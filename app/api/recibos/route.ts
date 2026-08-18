import { NextRequest, NextResponse } from 'next/server';
import { createRecibo } from '@/lib/recibos-store';
import { getPresupuesto } from '@/lib/presupuestos-store';
import { getCuentaRecibo } from '@/lib/cuentas-recibos-store';
import { MONTO_MAXIMO } from '@/components/admin/recibo-doc';
import type { ReciboInput, FormaPagoRecibo } from '@/types/recibo';

const FORMAS_PAGO_VALIDAS: FormaPagoRecibo[] = ['Efectivo', 'Transferencia', 'Otro'];

export async function POST(request: NextRequest) {
  let body: Partial<ReciboInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const errors: string[] = [];

  if (!body.fecha) errors.push('La fecha es requerida');
  if (!body.recibiDe || body.recibiDe.trim().length < 2) errors.push('El campo "Recibí de" es requerido');
  if (!body.concepto || body.concepto.trim().length < 2) errors.push('El concepto es requerido');
  if (body.monto === undefined || body.monto === null || Number(body.monto) <= 0) {
    errors.push('El monto debe ser mayor a 0');
  } else if (Number(body.monto) > MONTO_MAXIMO) {
    errors.push('El monto supera el máximo permitido');
  }
  if (!body.formaPago || !FORMAS_PAGO_VALIDAS.includes(body.formaPago)) {
    errors.push('La forma de pago es inválida');
  }
  if (body.formaPago === 'Otro' && (!body.formaPagoOtroDetalle || body.formaPagoOtroDetalle.trim().length === 0)) {
    errors.push('El detalle de "Otro" es requerido');
  }
  if (body.presupuestoId && body.cuentaReciboId) {
    errors.push('Un recibo no puede estar vinculado a un presupuesto y a una cuenta al mismo tiempo');
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (body.presupuestoId) {
    const presupuesto = await getPresupuesto(body.presupuestoId);
    if (!presupuesto) {
      return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }
  }

  if (body.cuentaReciboId) {
    const cuenta = await getCuentaRecibo(body.cuentaReciboId);
    if (!cuenta) {
      return NextResponse.json({ error: 'Cuenta de recibo no encontrada' }, { status: 404 });
    }
  }

  const input: ReciboInput = {
    ...(body.presupuestoId ? { presupuestoId: body.presupuestoId } : {}),
    ...(body.cuentaReciboId ? { cuentaReciboId: body.cuentaReciboId } : {}),
    fecha: body.fecha!,
    recibiDe: body.recibiDe!.trim(),
    concepto: body.concepto!.trim(),
    monto: Number(body.monto),
    montoEnLetras: (body.montoEnLetras ?? '').trim(),
    formaPago: body.formaPago!,
    formaPagoOtroDetalle: body.formaPago === 'Otro' ? body.formaPagoOtroDetalle?.trim() : undefined,
    observaciones: body.observaciones?.trim() || undefined,
  };

  try {
    const recibo = await createRecibo(input);
    return NextResponse.json(recibo, { status: 201 });
  } catch (err) {
    console.error('[recibos] Error al guardar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

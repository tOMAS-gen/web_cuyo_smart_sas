import { NextRequest, NextResponse } from 'next/server';
import { createCuentaRecibo } from '@/lib/cuentas-recibos-store';
import { MONTO_MAXIMO } from '@/components/admin/recibo-doc';
import type { CuentaReciboInput } from '@/types/cuenta-recibo';

export async function POST(request: NextRequest) {
  let body: Partial<CuentaReciboInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const errors: string[] = [];

  if (!body.cliente || body.cliente.trim().length < 2) errors.push('El cliente es requerido');
  if (!body.concepto || body.concepto.trim().length < 2) errors.push('El concepto es requerido');
  if (body.montoTotal === undefined || body.montoTotal === null || Number(body.montoTotal) <= 0) {
    errors.push('El monto total debe ser mayor a 0');
  } else if (Number(body.montoTotal) > MONTO_MAXIMO) {
    errors.push('El monto supera el máximo permitido');
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const input: CuentaReciboInput = {
    cliente: body.cliente!.trim(),
    concepto: body.concepto!.trim(),
    montoTotal: Number(body.montoTotal),
  };

  try {
    const cuenta = await createCuentaRecibo(input);
    return NextResponse.json(cuenta, { status: 201 });
  } catch (err) {
    console.error('[cuentas-recibos] Error al guardar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

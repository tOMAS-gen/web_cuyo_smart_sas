import { NextRequest, NextResponse } from 'next/server';
import { getPresupuestos, createPresupuesto } from '@/lib/presupuestos-store';
import type { PresupuestoInput } from '@/types/presupuesto';

export async function GET() {
  const presupuestos = await getPresupuestos();
  return NextResponse.json({ presupuestos, total: presupuestos.length });
}

export async function POST(request: NextRequest) {
  let body: Partial<PresupuestoInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const errors: string[] = [];

  if (!body.fecha) errors.push('La fecha es requerida');
  if (!body.cliente || body.cliente.trim().length < 2) errors.push('El cliente es requerido (mínimo 2 caracteres)');
  if (!body.ubicacion || body.ubicacion.trim().length < 3) errors.push('La ubicación es requerida');
  if (!body.detalle || body.detalle.trim().length < 5) errors.push('El detalle del trabajo es requerido');
  if (!body.items || body.items.length === 0) errors.push('Agregá al menos un ítem');
  if (!body.validezDias || body.validezDias <= 0) errors.push('La validez es requerida');
  if (!body.formaPago) errors.push('La forma de pago es requerida');

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const input: PresupuestoInput = {
    fecha: body.fecha!,
    cliente: body.cliente!.trim(),
    ubicacion: body.ubicacion!.trim(),
    detalle: body.detalle!.trim(),
    plazoRealizacion: body.plazoRealizacion?.trim() || undefined,
    items: body.items!.map(item => ({
      descripcion: item.descripcion.trim(),
      tipo: item.tipo,
      manoDeObra: Number(item.manoDeObra),
      materiales: Number(item.materiales),
    })),
    validezDias: Number(body.validezDias),
    formaPago: body.formaPago!,
    estado: body.estado ?? 'borrador',
    notas: body.notas?.trim(),
  };

  const presupuesto = await createPresupuesto(input);
  return NextResponse.json(presupuesto, { status: 201 });
}

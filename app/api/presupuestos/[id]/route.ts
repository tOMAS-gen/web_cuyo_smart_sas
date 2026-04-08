import { NextRequest, NextResponse } from 'next/server';
import { getPresupuesto, deletePresupuesto, updatePresupuesto, updatePresupuestoEstado } from '@/lib/presupuestos-store';
import type { EstadoPresupuesto, PresupuestoInput } from '@/types/presupuesto';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const presupuesto = await getPresupuesto(id);
  if (!presupuesto) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  }
  return NextResponse.json(presupuesto);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Partial<PresupuestoInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const errors: string[] = [];
  if (!body.fecha) errors.push('La fecha es requerida');
  if (!body.cliente || body.cliente.trim().length < 2) errors.push('El cliente es requerido');
  if (!body.ubicacion || body.ubicacion.trim().length < 3) errors.push('La ubicación es requerida');
  if (!body.detalle || body.detalle.trim().length < 5) errors.push('El detalle es requerido');
  if (!body.items || body.items.length === 0) errors.push('Agregá al menos un ítem');
  if (!body.validezDias || body.validezDias <= 0) errors.push('La validez es requerida');
  if (!body.formaPago) errors.push('La forma de pago es requerida');
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

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

  const updated = await updatePresupuesto(id, input);
  if (!updated) return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { estado?: EstadoPresupuesto };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!body.estado) {
    return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
  }

  const updated = await updatePresupuestoEstado(id, body.estado);
  if (!updated) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deletePresupuesto(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

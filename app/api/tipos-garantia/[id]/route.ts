import { NextRequest, NextResponse } from 'next/server';
import { deleteTipoGarantia, getTipoGarantia, updateTipoGarantia } from '@/lib/tipos-garantia-store';
import { validarTipoGarantiaInput } from '@/lib/garantia-logic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tipo = await getTipoGarantia(id);
  if (!tipo) {
    return NextResponse.json({ error: 'Tipo de garantía no encontrado' }, { status: 404 });
  }
  return NextResponse.json(tipo);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const { errors, input } = validarTipoGarantiaInput(body);
  if (!input) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const tipo = await updateTipoGarantia(id, input);
    if (!tipo) {
      return NextResponse.json({ error: 'Tipo de garantía no encontrado' }, { status: 404 });
    }
    return NextResponse.json(tipo);
  } catch (err) {
    console.error('[tipos-garantia] Error al actualizar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteTipoGarantia(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Tipo de garantía no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

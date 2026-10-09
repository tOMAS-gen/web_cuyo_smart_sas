import { NextRequest, NextResponse } from 'next/server';
import { deleteGarantia, getGarantia, updateGarantia } from '@/lib/garantias-store';
import { completarGarantia, validarGarantiaInput } from '@/lib/garantia-logic';
import { resolverVinculoGarantia } from '@/lib/garantia-vinculo';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const garantia = await getGarantia(id);
  if (!garantia) {
    return NextResponse.json({ error: 'Certificado de garantía no encontrado' }, { status: 404 });
  }
  return NextResponse.json(garantia);
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

  const { errors, input } = validarGarantiaInput(body);
  if (!input) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const vinculo = await resolverVinculoGarantia(input);
  if ('error' in vinculo) {
    return NextResponse.json({ error: vinculo.error }, { status: 404 });
  }

  try {
    const garantia = await updateGarantia(id, completarGarantia(input, vinculo.presupuestoNumero));
    if (!garantia) {
      return NextResponse.json({ error: 'Certificado de garantía no encontrado' }, { status: 404 });
    }
    return NextResponse.json(garantia);
  } catch (err) {
    console.error('[garantias] Error al actualizar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteGarantia(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Certificado de garantía no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

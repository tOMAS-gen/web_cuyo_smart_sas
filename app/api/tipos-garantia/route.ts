import { NextRequest, NextResponse } from 'next/server';
import { createTipoGarantia, getTiposGarantia } from '@/lib/tipos-garantia-store';
import { validarTipoGarantiaInput } from '@/lib/garantia-logic';

export async function GET() {
  return NextResponse.json(await getTiposGarantia());
}

export async function POST(request: NextRequest) {
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
    const tipo = await createTipoGarantia(input);
    return NextResponse.json(tipo, { status: 201 });
  } catch (err) {
    console.error('[tipos-garantia] Error al guardar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import {
  createGarantia,
  getGarantias,
  getGarantiasByCuenta,
  getGarantiasByPresupuesto,
} from '@/lib/garantias-store';
import { completarGarantia, validarGarantiaInput } from '@/lib/garantia-logic';
import { resolverVinculoGarantia } from '@/lib/garantia-vinculo';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const presupuestoId = searchParams.get('presupuestoId');
  const cuentaReciboId = searchParams.get('cuentaReciboId');

  const garantias = presupuestoId
    ? await getGarantiasByPresupuesto(presupuestoId)
    : cuentaReciboId
      ? await getGarantiasByCuenta(cuentaReciboId)
      : await getGarantias();
  return NextResponse.json(garantias);
}

export async function POST(request: NextRequest) {
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
    const garantia = await createGarantia(completarGarantia(input, vinculo.presupuestoNumero));
    return NextResponse.json(garantia, { status: 201 });
  } catch (err) {
    console.error('[garantias] Error al guardar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

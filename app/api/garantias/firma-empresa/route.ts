import { NextRequest, NextResponse } from 'next/server';
import { deleteFirmaEmpresa, getFirmaEmpresa, setFirmaEmpresa } from '@/lib/firma-empresa-store';
import { validarFirmaDataUrl } from '@/lib/garantia-logic';

export async function GET() {
  const firma = await getFirmaEmpresa();
  if (!firma) {
    return NextResponse.json({ error: 'No hay firma de la empresa cargada' }, { status: 404 });
  }
  return NextResponse.json(firma);
}

export async function PUT(request: NextRequest) {
  let body: { dataUrl?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const error = validarFirmaDataUrl(body.dataUrl);
  if (error) {
    return NextResponse.json({ errors: [error] }, { status: 400 });
  }

  try {
    const firma = await setFirmaEmpresa(body.dataUrl as string);
    return NextResponse.json(firma);
  } catch (err) {
    console.error('[firma-empresa] Error al guardar:', err);
    return NextResponse.json({ error: `Error al guardar: ${(err as Error).message}` }, { status: 500 });
  }
}

export async function DELETE() {
  const deleted = await deleteFirmaEmpresa();
  if (!deleted) {
    return NextResponse.json({ error: 'No hay firma de la empresa cargada' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

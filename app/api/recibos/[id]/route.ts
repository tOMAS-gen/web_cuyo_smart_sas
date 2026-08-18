import { NextRequest, NextResponse } from 'next/server';
import { deleteRecibo } from '@/lib/recibos-store';

// Deliberadamente solo DELETE: un recibo es comprobante de pago, no un
// documento que se revisa como un presupuesto. La semántica de negocio
// correcta es crear → borrar → recrear, nunca editar en el lugar; por eso no
// existe GET ni PATCH para un recibo individual.

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteRecibo(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Recibo no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

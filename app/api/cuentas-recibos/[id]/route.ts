import { NextRequest, NextResponse } from 'next/server';
import { deleteCuentaRecibo } from '@/lib/cuentas-recibos-store';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // La cascada (borrar los recibos de la cuenta) vive en el store, no acá
    // — mismo criterio que lib/presupuestos-store.ts::deletePresupuesto.
    const deleted = await deleteCuentaRecibo(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cuentas-recibos] Error al eliminar:', err);
    return NextResponse.json({ error: `Error al eliminar: ${(err as Error).message}` }, { status: 500 });
  }
}

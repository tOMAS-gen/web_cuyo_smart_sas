import { NextRequest, NextResponse } from 'next/server';
import { getPresupuesto } from '@/lib/presupuestos-store';
import { getCuentaRecibo, getResumenCuentaRecibo } from '@/lib/cuentas-recibos-store';
import { getResumenPresupuesto } from '@/lib/recibos-store';
import { prefillDesdeCuenta, prefillDesdePresupuesto } from '@/lib/garantia-logic';

// Datos para precargar el form de un certificado desde un presupuesto o una
// cuenta de recibos (cliente, domicilio, trabajos y resumen de pagos).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const presupuestoId = searchParams.get('presupuestoId');
  const cuentaReciboId = searchParams.get('cuentaReciboId');

  if (presupuestoId) {
    const presupuesto = await getPresupuesto(presupuestoId);
    if (!presupuesto) {
      return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }
    const resumen = await getResumenPresupuesto(presupuesto.id, presupuesto.total);
    return NextResponse.json(prefillDesdePresupuesto(presupuesto, resumen));
  }

  if (cuentaReciboId) {
    const cuenta = await getCuentaRecibo(cuentaReciboId);
    if (!cuenta) {
      return NextResponse.json({ error: 'Cuenta de recibo no encontrada' }, { status: 404 });
    }
    const resumen = await getResumenCuentaRecibo(cuenta.id, cuenta.montoTotal);
    return NextResponse.json(prefillDesdeCuenta(cuenta, resumen));
  }

  return NextResponse.json({ error: 'Indicá presupuestoId o cuentaReciboId' }, { status: 400 });
}

import { getPresupuesto } from './presupuestos-store';
import { getCuentaRecibo } from './cuentas-recibos-store';
import type { GarantiaInput } from '@/types/garantia';

/**
 * Verifica que exista el presupuesto o la cuenta vinculados al certificado.
 * Devuelve el número del presupuesto (snapshot) o el mensaje de error 404.
 */
export async function resolverVinculoGarantia(
  input: GarantiaInput
): Promise<{ error: string } | { presupuestoNumero?: number }> {
  if (input.presupuestoId) {
    const presupuesto = await getPresupuesto(input.presupuestoId);
    if (!presupuesto) return { error: 'Presupuesto no encontrado' };
    return { presupuestoNumero: presupuesto.numero };
  }
  if (input.cuentaReciboId) {
    const cuenta = await getCuentaRecibo(input.cuentaReciboId);
    if (!cuenta) return { error: 'Cuenta de recibo no encontrada' };
  }
  return {};
}

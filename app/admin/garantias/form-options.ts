import { getPresupuestos } from '@/lib/presupuestos-store';
import { getCuentasRecibo } from '@/lib/cuentas-recibos-store';
import { getTiposGarantia } from '@/lib/tipos-garantia-store';
import { getFirmaEmpresa } from '@/lib/firma-empresa-store';
import type { GarantiaFormOptions } from '@/components/admin/garantias/GarantiaForm';

export async function getGarantiaFormOptions(): Promise<GarantiaFormOptions> {
  const [presupuestos, cuentas, tipos, firma] = await Promise.all([
    getPresupuestos(),
    getCuentasRecibo(),
    getTiposGarantia(),
    getFirmaEmpresa(),
  ]);
  // Fecha civil de Mendoza; no se convierte un string YYYY-MM-DD a Date.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Mendoza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (name: string) => parts.find((p) => p.type === name)!.value;
  return {
    presupuestos: presupuestos.map(({ id, numero, cliente }) => ({ id, numero, cliente })),
    cuentas: cuentas.map(({ id, cliente, concepto }) => ({ id, cliente, concepto })),
    tipos,
    firmaEmpresa: firma?.dataUrl ?? null,
    fechaHoy: `${part('year')}-${part('month')}-${part('day')}`,
  };
}

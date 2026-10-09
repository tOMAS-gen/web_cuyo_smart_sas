import GarantiaForm from '@/components/admin/garantias/GarantiaForm';
import { getGarantiaFormOptions } from '../form-options';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Nuevo certificado de garantía' };

export default async function NuevaGarantiaPage({
  searchParams,
}: {
  searchParams: Promise<{ presupuestoId?: string; cuentaReciboId?: string }>;
}) {
  const [params, options] = await Promise.all([searchParams, getGarantiaFormOptions()]);
  return (
    <GarantiaForm
      {...options}
      presupuestoId={typeof params.presupuestoId === 'string' ? params.presupuestoId : undefined}
      cuentaReciboId={typeof params.cuentaReciboId === 'string' ? params.cuentaReciboId : undefined}
    />
  );
}

import { notFound } from 'next/navigation';
import { getRecibo } from '@/lib/recibos-store';
import { getCuentaRecibo } from '@/lib/cuentas-recibos-store';
import ReciboDetalle from './ReciboDetalle';

export const dynamic = 'force-dynamic';

export default async function ReciboStandalonePage({
  params,
}: {
  params: Promise<{ reciboId: string }>;
}) {
  const { reciboId } = await params;
  const r = await getRecibo(reciboId);
  if (!r || r.presupuestoId) notFound();

  const cuenta = r.cuentaReciboId ? await getCuentaRecibo(r.cuentaReciboId) : null;
  const backHref = cuenta ? `/admin/recibos/cuentas/${cuenta.id}` : '/admin/recibos';
  const backLabel = cuenta ? `Volver a ${cuenta.cliente}` : 'Volver a recibos';

  return (
    <ReciboDetalle r={r} cuenta={cuenta} backHref={backHref} backLabel={backLabel} />
  );
}

import { notFound } from 'next/navigation';
import { getRecibo } from '@/lib/recibos-store';
import ReciboDetalle from './ReciboDetalle';

export const dynamic = 'force-dynamic';

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ id: string; reciboId: string }>;
}) {
  const { id, reciboId } = await params;
  const r = await getRecibo(reciboId);
  if (!r || r.presupuestoId !== id) notFound();

  return <ReciboDetalle presupuestoId={id} r={r} />;
}

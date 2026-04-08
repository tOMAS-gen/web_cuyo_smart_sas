import { notFound } from 'next/navigation';
import { getPresupuesto } from '@/lib/presupuestos-store';
import PresupuestoEditForm from '@/components/admin/PresupuestoEditForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar Presupuesto — CuyoSmart Admin' };

export default async function EditarPresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPresupuesto(id);
  if (!p) notFound();

  return <PresupuestoEditForm presupuesto={p} />;
}

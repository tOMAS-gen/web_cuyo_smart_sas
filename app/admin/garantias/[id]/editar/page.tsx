import { notFound } from 'next/navigation';
import { getGarantia } from '@/lib/garantias-store';
import GarantiaForm from '@/components/admin/garantias/GarantiaForm';
import { getGarantiaFormOptions } from '../../form-options';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar certificado de garantía' };

export default async function EditarGarantiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [garantia, options] = await Promise.all([getGarantia(id), getGarantiaFormOptions()]);
  if (!garantia) notFound();
  return <GarantiaForm {...options} garantia={garantia} />;
}

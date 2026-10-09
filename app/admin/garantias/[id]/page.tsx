import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getGarantia } from '@/lib/garantias-store';
import { getFirmaEmpresa } from '@/lib/firma-empresa-store';
import GarantiaPrint from '@/components/admin/garantias/GarantiaPrint';
import GarantiaActions from '@/components/admin/garantias/GarantiaActions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Certificado de garantía' };

export default async function GarantiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [garantia, firma] = await Promise.all([getGarantia(id), getFirmaEmpresa()]);
  if (!garantia) notFound();
  return (
    <div className="garantia-page mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 space-y-4 print:hidden">
        <Link
          href="/admin/garantias"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft size={16} />
          Volver a garantías
        </Link>
        <GarantiaActions id={garantia.id} numero={garantia.numero} />
        <p className="text-xs text-gray-500">
          Formato A4. Para descargarlo, elegí «Guardar como PDF» en la ventana de impresión.
        </p>
        {garantia.incluirFirmaEmpresa && !firma && (
          <p
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            La firma de empresa ya no está disponible. Podés{' '}
            <Link href="/admin/garantias/tipos" className="underline">
              cargarla nuevamente
            </Link>{' '}
            o firmar en papel.
          </p>
        )}
      </div>
      <GarantiaPrint garantia={garantia} firmaEmpresa={firma?.dataUrl ?? null} />
    </div>
  );
}

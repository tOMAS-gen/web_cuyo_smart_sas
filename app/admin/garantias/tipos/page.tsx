import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTiposGarantia } from '@/lib/tipos-garantia-store';
import { getFirmaEmpresa } from '@/lib/firma-empresa-store';
import GarantiaSettings from '@/components/admin/garantias/GarantiaSettings';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tipos de garantía y firma' };

export default async function TiposGarantiaPage() {
  const [tipos, firma] = await Promise.all([getTiposGarantia(), getFirmaEmpresa()]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/admin/garantias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} />
        Volver a garantías
      </Link>
      <h1 className="text-2xl font-bold text-primary">Tipos de garantía y firma</h1>
      <p className="mb-8 mt-1 text-sm text-gray-500">
        Prepará las condiciones y la firma que usás al emitir certificados.
      </p>
      <GarantiaSettings initialTipos={tipos} firmaEmpresa={firma?.dataUrl ?? null} />
    </div>
  );
}

import Link from 'next/link';
import { Plus, Settings2 } from 'lucide-react';
import { getGarantias } from '@/lib/garantias-store';
import GarantiasList from '@/components/admin/garantias/GarantiasList';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Garantías' };

export default async function GarantiasPage() {
  const garantias = await getGarantias();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Garantías</h1>
          <p className="mt-1 text-sm text-gray-500">
            Certificados de cobertura de tus obras · {garantias.length}{' '}
            {garantias.length === 1 ? 'emitido' : 'emitidos'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/garantias/tipos"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            <Settings2 size={17} />
            Tipos y firma
          </Link>
          <Link
            href="/admin/garantias/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <Plus size={17} />
            Nuevo certificado
          </Link>
        </div>
      </div>
      <GarantiasList garantias={garantias} />
    </div>
  );
}

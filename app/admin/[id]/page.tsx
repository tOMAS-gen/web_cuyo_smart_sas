import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPresupuesto } from '@/lib/presupuestos-store';
import PresupuestoPrint from '@/components/admin/PresupuestoPrint';
import PresupuestoExportView from '@/components/admin/PresupuestoExportView';
import DeleteButton from './DeleteButton';
import PrintButton from './PrintButton';
import ExportImageButton from './ExportImageButton';

export const dynamic = 'force-dynamic';

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPresupuesto(id);
  if (!p) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-500 hover:text-[#0B1C3E] text-sm transition-colors"
        >
          ← Volver
        </Link>
        <div className="flex gap-2">
          <DeleteButton id={p.id} />
          <ExportImageButton numero={p.numero} />
          <a href={`/admin/${p.id}/editar`}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            ✏️ Editar
          </a>
          <PrintButton />
        </div>
      </div>

      {/* Notas internas (no se imprimen) */}
      {p.notas && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 no-print">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Nota interna</p>
          <p className="text-sm text-amber-800">{p.notas}</p>
        </div>
      )}

      {/* Documento imprimible */}
      <PresupuestoPrint p={p} />

      {/* Vista oculta para exportar como imagen (solo inline styles, sin Tailwind) */}
      <div className="no-print" style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <PresupuestoExportView p={p} />
      </div>
    </div>
  );
}

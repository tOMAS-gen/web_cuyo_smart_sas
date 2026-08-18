'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Presupuesto } from '@/types/presupuesto';
import PresupuestoPrint from '@/components/admin/PresupuestoPrint';
import DeleteButton from './DeleteButton';
import PrintButton from './PrintButton';
import ExportImageButton from './ExportImageButton';

/**
 * Dueño del `ref` compartido entre el documento en pantalla (`PresupuestoPrint`)
 * y el botón de exportación a imagen — mismo patrón que `ReciboDetalle.tsx`
 * usa para el recibo (research.md § 4 de la feature 002): fuente única, sin
 * el host oculto por `getElementById` que usaba `PresupuestoExportView`.
 * Client component porque `useRef` lo exige; `app/admin/[id]/page.tsx` sigue
 * siendo un Server Component que solo pasa datos ya resueltos.
 */
export default function PresupuestoDocumentPanel({ p }: { p: Presupuesto }) {
  const docRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Barra de acciones */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm transition-colors"
        >
          ← Volver
        </Link>
        <div className="flex gap-2">
          <DeleteButton id={p.id} />
          <ExportImageButton nodeRef={docRef} numero={p.numero} />
          <a href={`/admin/${p.id}/editar`}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            ✏️ Editar
          </a>
          <PrintButton />
        </div>
      </div>

      {/* Documento imprimible/exportable: mismo nodo para ambos (research.md § 4) */}
      <PresupuestoPrint ref={docRef} p={p} />
    </>
  );
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Recibo } from '@/types/recibo';
import ReciboPrint from '@/components/admin/ReciboPrint';
import ReciboExportImageButton from '@/components/admin/ReciboExportImageButton';
import ReciboPrintButton from '@/components/admin/ReciboPrintButton';

export default function ReciboDetalle({ presupuestoId, r }: { presupuestoId: string; r: Recibo }) {
  const docRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-[1040px] mx-auto px-4 py-6">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-6 print:hidden">
        <Link
          href={`/admin/${presupuestoId}`}
          className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm transition-colors"
        >
          ← Volver al presupuesto
        </Link>
        <div className="flex gap-2">
          <ReciboExportImageButton nodeRef={docRef} numero={r.numero} />
          <ReciboPrintButton />
        </div>
      </div>

      {/* Documento imprimible: tamaño fijo, scroll horizontal en el contenedor */}
      <div className="overflow-x-auto">
        <ReciboPrint ref={docRef} r={r} />
      </div>
    </div>
  );
}

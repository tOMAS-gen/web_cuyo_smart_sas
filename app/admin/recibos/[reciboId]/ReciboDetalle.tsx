'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Recibo } from '@/types/recibo';
import type { CuentaRecibo } from '@/types/cuenta-recibo';
import ReciboPrint from '@/components/admin/ReciboPrint';
import ReciboExportImageButton from '@/components/admin/ReciboExportImageButton';
import ReciboPrintButton from '@/components/admin/ReciboPrintButton';

export default function ReciboDetalle({
  r,
  cuenta,
  backHref,
  backLabel,
}: {
  r: Recibo;
  cuenta: CuentaRecibo | null;
  backHref: string;
  backLabel: string;
}) {
  const docRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-[1040px] mx-auto px-4 py-6">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-6 print:hidden">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm transition-colors"
        >
          ← {backLabel}
        </Link>
        <div className="flex gap-2">
          <ReciboExportImageButton nodeRef={docRef} numero={r.numero} />
          <ReciboPrintButton />
        </div>
      </div>

      {cuenta && (
        <div className="mb-4 print:hidden">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Cuenta: {cuenta.cliente} — {cuenta.concepto}
          </Link>
        </div>
      )}

      {/* Documento imprimible: tamaño fijo, scroll horizontal en el contenedor */}
      <div className="overflow-x-auto">
        <ReciboPrint ref={docRef} r={r} />
      </div>
    </div>
  );
}

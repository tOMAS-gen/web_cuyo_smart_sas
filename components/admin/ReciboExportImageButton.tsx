'use client';

import type { RefObject } from 'react';
import { useReciboExport } from './useReciboExport';

export interface ReciboExportImageButtonProps {
  /** Nodo del documento en pantalla a exportar (T005/research.md § 4). */
  nodeRef: RefObject<HTMLElement | null>;
  /** Número de recibo; da el nombre `recibo-NNNN.png` (FR-008). */
  numero: number;
}

export default function ReciboExportImageButton({ nodeRef, numero }: ReciboExportImageButtonProps) {
  const { loading, error, exportar } = useReciboExport({ nodeRef, numero });

  return (
    <div className="print:hidden">
      <button
        onClick={exportar}
        disabled={loading}
        className="bg-tertiary hover:bg-tertiary/90 disabled:bg-gray-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        {loading ? 'Exportando...' : 'Exportar imagen'}
      </button>
      {error && (
        <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

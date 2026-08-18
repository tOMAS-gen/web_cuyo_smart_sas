'use client';

import { useState, type RefObject } from 'react';
import { EXPORT_SCALE, filterExportBorderStyles } from '@/components/admin/recibo-doc';

export default function ExportImageButton({
  nodeRef,
  numero,
}: {
  nodeRef: RefObject<HTMLElement | null>;
  numero: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    const el = nodeRef.current;
    if (!el) {
      setError('No se encontró el presupuesto para exportar. Recargá la página e intentá de nuevo.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // FR-005: sin esto el `foreignObject` maqueta con métricas de fallback.
      await document.fonts.ready;

      const width = el.offsetWidth;
      const height = el.scrollHeight;

      const domtoimage = (await import('dom-to-image-more')).default;
      const blob = await domtoimage.toBlob(el, {
        width: width * EXPORT_SCALE,
        height: height * EXPORT_SCALE,
        bgcolor: '#ffffff',
        style: {
          transform: `scale(${EXPORT_SCALE})`,
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
        },
        filterStyles: filterExportBorderStyles,
      });

      if (!blob) {
        throw new Error('El navegador no devolvió la imagen generada.');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `presupuesto-${String(numero).padStart(4, '0')}.png`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? `No se pudo exportar la imagen: ${err.message}`
          : 'No se pudo exportar la imagen. Intentá de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="print:hidden">
      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-[#29ABE2] hover:bg-[#1e90c0] disabled:bg-gray-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
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

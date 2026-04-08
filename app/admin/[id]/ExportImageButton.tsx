'use client';

import { useState } from 'react';

export default function ExportImageButton({ numero }: { numero: number }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const el = document.getElementById('export-root') as HTMLElement;
      if (!el) return;

      const domtoimage = (await import('dom-to-image-more')).default;
      const blob = await domtoimage.toBlob(el, {
        scale: 2,
        bgcolor: '#ffffff',
        width: 680,
        height: el.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `presupuesto-${String(numero).padStart(4, '0')}.png`;
      link.href = URL.createObjectURL(blob as Blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    } catch (err) {
      console.error('Error al exportar imagen:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}

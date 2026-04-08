'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-[#0B1C3E] hover:bg-[#162d5e] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
    >
      🖨️ Imprimir / PDF
    </button>
  );
}

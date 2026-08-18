'use client';

export default function ReciboPrintButton() {
  return (
    <button
      onClick={async () => {
        await document.fonts.ready;
        window.print();
      }}
      className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
    >
      🖨️ Imprimir / PDF
    </button>
  );
}

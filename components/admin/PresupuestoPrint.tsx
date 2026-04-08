import Image from 'next/image';
import type { Presupuesto, TipoItem } from '@/types/presupuesto';
import { siteConfig } from '@/data/content';

const TIPO_LABELS: Record<TipoItem, string> = {
  material: 'Material',
  mano_de_obra: 'Mano de obra',
  ambos: 'Ambos',
};

const TIPO_COLORS: Record<TipoItem, string> = {
  material: 'bg-blue-100 text-blue-700',
  mano_de_obra: 'bg-orange-100 text-orange-700',
  ambos: 'bg-green-100 text-green-700',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatFecha(iso: string): string {
  const [year, month, day] = iso.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

export default function PresupuestoPrint({ p }: { p: Presupuesto }) {
  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm 12mm; background: white; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }

          /* Fondo blanco puro en todas las secciones grises */
          .doc-bg-gray { background-color: white !important; }

          /* Permite que el documento fluya en múltiples páginas */
          .doc-root {
            max-width: 100% !important;
            border-radius: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Header y footer no se cortan */
          .doc-header { border-radius: 0 !important; break-inside: avoid; }
          .doc-footer { border-radius: 0 !important; break-inside: avoid; break-before: avoid; }

          /* Total, condiciones y firma siempre juntos */
          .doc-total { border-radius: 0 !important; break-inside: avoid; }
          .doc-condiciones { break-inside: avoid; }
          .doc-firma { break-inside: avoid; break-before: avoid; }

          /* Cada ítem no se parte entre páginas */
          .doc-item { break-inside: avoid; }

          /* Si la tabla de ítems es larga, la cabecera no queda sola */
          .doc-items-header { break-after: avoid; }

          /* Subtotales y total siempre con la última fila */
          .doc-subtotales { break-inside: avoid; break-before: avoid; }
        }
      `}</style>

      <div className="doc-root max-w-[680px] mx-auto bg-white rounded-2xl shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>

        {/* HEADER azul */}
        <div className="doc-header bg-[#0B1C3E] px-6 py-5 flex items-center justify-between gap-4">
          <Image
            src="/brand/logo_name_completo_horizontal.svg"
            alt="CuyoSmart SAS"
            width={190}
            height={70}
            className="h-10 w-auto brightness-0 invert"
          />
          <div className="text-right text-white">
            <p className="font-bold text-base leading-tight">CuyoSmart SAS</p>
            <p className="text-xs text-gray-300 mt-0.5">{siteConfig.address}</p>
            <p className="text-xs text-gray-300">{siteConfig.contactEmail}</p>
            <p className="text-xs text-gray-300">{siteConfig.phoneDisplay}</p>
          </div>
        </div>

        {/* BANDA naranja — título */}
        <div className="bg-[#FF9000] px-6 py-3 flex items-center justify-between">
          <p className="text-white font-bold text-base tracking-wider uppercase">
            Presupuesto N° {formatNumero(p.numero)}
          </p>
          <p className="text-white text-sm font-medium">
            Fecha: {formatFecha(p.fecha)}
          </p>
        </div>

        {/* CLIENTE */}
        <div className="doc-bg-gray px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cliente</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <p className="text-sm text-gray-700 m-0">
              <span className="text-gray-400">Nombre: </span>
              <span className="font-bold">{p.cliente}</span>
            </p>
            <p className="text-sm text-gray-700 m-0">
              <span className="text-gray-400">Ubicación: </span>
              <span className="font-bold">{p.ubicacion}</span>
            </p>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Descripción del trabajo</p>
          <div className="border-l-4 border-[#FF9000] pl-4 min-h-[70px]">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed m-0">{p.detalle}</p>
          </div>
        </div>

        {/* ÍTEMS */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Desglose de costos</p>

          {/* Cabecera tabla */}
          <div className="doc-items-header grid grid-cols-[1fr_auto] gap-x-4 pb-1.5 mb-1 border-b-2 border-[#0B1C3E]">
            <span className="text-[10px] font-bold text-[#0B1C3E] uppercase tracking-wide">Descripción</span>
            <span className="text-[10px] font-bold text-[#0B1C3E] uppercase tracking-wide text-right w-24">Subtotal</span>
          </div>

          {/* Filas */}
          {(p.items ?? []).map((item, i) => {
            const hasBoth = item.manoDeObra > 0 && item.materiales > 0;
            return (
              <div key={i} className="doc-item grid grid-cols-[1fr_auto] gap-x-4 py-1.5 border-b border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-snug m-0">{item.descripcion}</p>
                  {item.tipo && (
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${TIPO_COLORS[item.tipo]}`}>
                      {TIPO_LABELS[item.tipo]}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[#0B1C3E]">$ {formatCurrency(item.manoDeObra + item.materiales)}</div>
                  {hasBoth && (
                    <div className="text-[10px] text-gray-400 mt-0.5 space-y-0.5">
                      <div>Mano de obra: <span className="font-medium text-gray-500">${formatCurrency(item.manoDeObra)}</span></div>
                      <div>Material: <span className="font-medium text-gray-500">${formatCurrency(item.materiales)}</span></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Desglose subtotales */}
          {(() => {
            const totalMDO = (p.items ?? []).reduce((a, i) => a + i.manoDeObra, 0);
            const totalMat = (p.items ?? []).reduce((a, i) => a + i.materiales, 0);
            if (totalMDO === 0 || totalMat === 0) return null;
            return (
              <div className="doc-subtotales mt-3 border-t border-gray-200 pt-2 w-full flex flex-col items-end gap-1">
                <div className="text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
                  <span>Mano de obra: <span className="font-bold text-[#0B1C3E]">$ {formatCurrency(totalMDO)}</span></span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                  <span>Materiales: <span className="font-bold text-[#0B1C3E]">$ {formatCurrency(totalMat)}</span></span>
                </div>
              </div>
            );
          })()}

          {/* Total */}
          <div className="doc-total bg-[#FF9000] rounded-xl mt-3 px-6 py-3 flex justify-between items-center">
            <span className="text-white font-bold uppercase tracking-wide text-sm">Total</span>
            <span className="text-white font-bold text-2xl">$ {formatCurrency(p.total)}</span>
          </div>
        </div>

        {/* CONDICIONES */}
        <div className="doc-condiciones doc-bg-gray px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Condiciones</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <p className="text-sm text-gray-700 m-0">
              <span className="text-gray-400">Validez: </span>
              <strong>{p.validezDias} días</strong>
            </p>
            <p className="text-sm text-gray-700 m-0">
              <span className="text-gray-400">Forma de pago: </span>
              <strong>{p.formaPago}</strong>
            </p>
            {p.plazoRealizacion && (
              <p className="text-sm text-gray-700 m-0 col-span-2">
                <span className="text-gray-400">Plazo de realización: </span>
                <strong>{p.plazoRealizacion}</strong>
              </p>
            )}
          </div>
        </div>

        {/* NOTA */}
        <div className="doc-firma px-6 py-5">
          <p className="text-xs text-gray-400 leading-relaxed m-0">
            Este presupuesto es válido por <strong className="text-gray-600">{p.validezDias} días</strong> desde la fecha de emisión.
            Los precios pueden variar una vez vencido el plazo de validez.
            Ante cualquier consulta no dude en comunicarse con nosotros.
          </p>
        </div>

        {/* FOOTER azul */}
        <div className="doc-footer bg-[#0B1C3E] px-6 py-3 flex items-center justify-between">
          <span className="text-gray-300 text-xs flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {siteConfig.phoneDisplay}
          </span>
          <span className="text-gray-300 text-xs flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            {siteConfig.contactEmail}
          </span>
          <span className="text-gray-300 text-xs flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {siteConfig.address}
          </span>
        </div>

      </div>
    </>
  );
}

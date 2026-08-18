'use client';

import { forwardRef } from 'react';
import type { Recibo } from '@/types/recibo';
import ReciboDocument from './ReciboDocument';
import { RECIBO_DOC, PRINT_TARGET_WIDTH_MM } from './recibo-doc';

const PX_PER_MM = 96 / 25.4;
const PRINT_SCALE = (PRINT_TARGET_WIDTH_MM * PX_PER_MM) / RECIBO_DOC.width;
/** Grosor pre-escala para que la guía de corte quede en ~1px físico ya
 * impresa (`transform: scale()` encoge el borde junto con el contenido). */
const CUT_GUIDE_BORDER_PX = 1 / PRINT_SCALE;

/**
 * Contenedor imprimible del comprobante.
 *
 * - El `@page` apunta a la hoja física real (A4 **vertical**), no a un tamaño
 *   custom derivado de `RECIBO_DOC` — lo que sí se deriva de `RECIBO_DOC` es
 *   `PRINT_SCALE` (invariante 5 de `recibo-doc.ts`), nunca escrito a mano. El
 *   documento es una tira compacta que se ubica **arriba** de la hoja (no
 *   centrada verticalmente) con `transform: scale(PRINT_SCALE)`: ocupa el
 *   ancho completo de la hoja pero solo una porción corta de su alto, nunca
 *   la hoja entera (decisión de producto).
 * - Lleva una guía de corte (`border` negro fino) alrededor del recibo,
 *   **solo en impresión** — vive en el wrapper `.recibo-print-scale`, nunca
 *   en el nodo del documento, para no aparecer en pantalla ni en la imagen
 *   exportada. Su grosor se compensa con `CUT_GUIDE_BORDER_PX` para quedar
 *   en ~1px físico ya impreso, pese a que `transform: scale()` encoge todo
 *   lo que pinta el elemento (incluido su propio borde).
 * - La sombra decorativa vive en un `<div>` wrapper y **nunca** en el nodo del
 *   documento: al exportar el nodo visible, un `box-shadow` en el nodo raíz se
 *   rasteriza como halo gris y hace fallar las cuatro orillas de FR-001
 *   (research.md § 4).
 * - Reenvía el `ref` al nodo del documento para que la página pueda pasarlo al
 *   botón de exportación sin `getElementById` (research.md § 4).
 * - El ocultado de controles en impresión se unifica en `print:hidden` de
 *   Tailwind; ya no se define la clase ad-hoc `.no-print` aquí, que solo
 *   funcionaba si había un `ReciboPrint` montado (research.md § 7).
 */
const ReciboPrint = forwardRef<HTMLDivElement, { r: Recibo }>(
  function ReciboPrint({ r }, ref) {
    return (
      <>
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 0; background: white; }
            html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
            /* Sin esto los navegadores descartan los fondos de color y el pie
               navy desaparece del PDF (research.md § 7, FR-011). */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

            /* Ubica el comprobante arriba de la hoja A4 física (no
               centrado verticalmente), a PRINT_SCALE en vez de a tamaño
               completo — el documento no debe ocupar toda la hoja.
               position: fixed + inset: 0 saca este contenedor del flujo
               normal para que ocupe exactamente la página impresa sin
               importar el padding/margin de los contenedores ancestros
               (por ejemplo el py-6 de la página que monta este componente)
               — sin esto, ese padding sobrante empuja el pie del documento
               a una segunda hoja en blanco. padding-top deja el mismo
               margen de impresión seguro (~10mm) que ya usa PRINT_TARGET_WIDTH_MM
               a los costados, en vez de arrancar pegado al borde físico. */
            .recibo-print-page {
              position: fixed;
              inset: 0;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding-top: 10mm;
            }
            .recibo-print-scale {
              transform: scale(${PRINT_SCALE});
              transform-origin: top center;
              border: ${CUT_GUIDE_BORDER_PX}px solid #000000;
            }
          }
        `}</style>
        <div className="overflow-x-auto no-scrollbar recibo-print-page">
          <div className="w-fit mx-auto shadow-lg print:shadow-none recibo-print-scale">
            <ReciboDocument ref={ref} r={r} />
          </div>
        </div>
      </>
    );
  }
);

export default ReciboPrint;

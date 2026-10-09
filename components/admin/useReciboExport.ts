'use client';

import { useCallback, useState, type RefObject } from 'react';
import { EXPORT_SCALE, RECIBO_DOC, filterExportBorderStyles } from './recibo-doc';

/**
 * Receta canónica de exportación del comprobante a PNG (research.md § 2).
 *
 * Reglas no negociables:
 * - `width`/`height` se pasan ya en **píxeles finales** (ancho fijo y alto real
 *   del documento, multiplicados por EXPORT_SCALE) y el contenido se agranda
 *   con CSS `transform: scale(N)` +
 *   `transformOrigin: 'top left'`. Así `dom-to-image-more` hace un blit 1:1 sin
 *   remuestreo y no queda costura de cobertura parcial en el contorno
 *   (FR-001, FR-002, FR-003).
 * - **Nunca** se pasa la opción `scale`: fuerza `ctx.scale(2,2)` sobre el
 *   `fillRect` blanco opaco y es exactamente la causa raíz del borde
 *   (research.md § 1).
 * - `EXPORT_SCALE` es una constante literal; **nunca** se deriva de
 *   `devicePixelRatio` ni del zoom del navegador (FR-004).
 * - `bgcolor` es idéntico a `RECIBO_DOC.background` (invariante 2 de
 *   data-model.md § 2.2).
 * - `embedFonts` e `inlineImages` quedan activos (no se pasan
 *   `disableEmbedFonts`/`disableInlineImages`): la webfont de `next/font` y el
 *   logo son mismo origen, sin restricción CORS (research.md § 3).
 */
export interface UseReciboExportOptions {
  /** Nodo del documento **en pantalla** a rasterizar (research.md § 4). */
  nodeRef: RefObject<HTMLElement | null>;
  /** Número de recibo; da el nombre `recibo-NNNN.png` (FR-008). */
  numero: number;
}

export interface UseReciboExportResult {
  loading: boolean;
  error: string | null;
  exportar: () => Promise<void>;
}

export function useReciboExport({
  nodeRef,
  numero,
}: UseReciboExportOptions): UseReciboExportResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportar = useCallback(async () => {
    // Guard **fuera** del try/finally: si el nodo no está montado no se debe
    // encender `loading` para después apagarlo como si la exportación hubiera
    // funcionado (research.md § 8, FR-007).
    const node = nodeRef.current;
    if (!node) {
      setError('No se encontró el comprobante para exportar. Recargá la página e intentá de nuevo.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // FR-005: sin esto el `foreignObject` maqueta con métricas de fallback y
      // los saltos de línea difieren de la pantalla.
      await document.fonts.ready;
      await Promise.all(
        Array.from(node.querySelectorAll('img')).map((img) => img.decode().catch(() => undefined)),
      );

      // El alto CSS conserva fracciones y no incluye el desborde decorativo
      // de las ondas del pie, a diferencia de scrollHeight. El documento
      // crece con el concepto: usar el mínimo fijo cortaría el PNG.
      const height = Math.ceil(parseFloat(getComputedStyle(node).height));

      const domtoimage = (await import('dom-to-image-more')).default;
      const blob = await domtoimage.toBlob(node, {
        width: RECIBO_DOC.width * EXPORT_SCALE,
        height: height * EXPORT_SCALE,
        bgcolor: RECIBO_DOC.background,
        style: {
          transform: `scale(${EXPORT_SCALE})`,
          transformOrigin: 'top left',
          width: `${RECIBO_DOC.width}px`,
          height: `${height}px`,
        },
        filterStyles: filterExportBorderStyles,
      });

      if (!blob) {
        throw new Error('El navegador no devolvió la imagen generada.');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `recibo-${String(numero).padStart(4, '0')}.png`;
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
  }, [nodeRef, numero]);

  return { loading, error, exportar };
}

export default useReciboExport;

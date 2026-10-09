/**
 * Fuente única de presentación del comprobante (recibo): geometría, paleta y
 * tipografía. Ningún literal de color de marca ni dimensión del documento debe
 * vivir fuera de este módulo dentro de `components/admin/` ni `app/admin/`
 * (data-model.md § 2.2, invariante 4).
 *
 * Invariantes (data-model.md § 2.2):
 * 1. El ancho y el alto mínimo son enteros. La exportación redondea hacia
 *    arriba el alto real del contenido para no recortar píxeles parciales.
 * 2. `RECIBO_DOC.background` debe ser exactamente el mismo string que se pasa
 *    como `bgcolor` a `toBlob`; si divergen, reaparece la costura de FR-003.
 * 3. `EXPORT_SCALE` es una constante literal — derivarla de `devicePixelRatio`
 *    o del zoom viola FR-004.
 * 4. Ningún literal de color de marca (`#0B1C3E`, `#FF9000`, `#29ABE2`) debe
 *    quedar fuera de este módulo; el documento usa `COLORS`, el panel usa
 *    utilidades de token (`bg-primary`, `text-secondary`, …).
 * 5. `@page` de `ReciboPrint` apunta a la hoja física real (A4 **vertical**);
 *    lo que se deriva de `RECIBO_DOC` es el **factor de escala de impresión**
 *    (`PRINT_TARGET_WIDTH_MM ÷ RECIBO_DOC.width`), nunca escrito a mano. El
 *    recibo es una tira compacta que ocupa el ancho completo de la hoja pero
 *    solo una porción corta de su alto — como un comprobante de papel real —,
 *    nunca la hoja entera (decisión de producto, no derivable de
 *    `RECIBO_DOC`). El alto mínimo impreso es ~6,5cm; el contenido extenso
 *    aumenta ese alto manteniendo el mismo ancho y tamaño de letra.
 *
 * Valores de `COLORS` derivados de los tokens `@theme` de `app/globals.css`
 * (`--color-primary`, `--color-secondary`, `--color-tertiary`,
 * `--color-background`).
 */

export const RECIBO_DOC = {
  width: 1002,
  minHeight: 340,
  background: '#FFFFFF',
  footerHeight: 22,
  paddingTop: 12,
  paddingX: 24,
  paddingBottom: 8,
} as const;

/** Constante literal — nunca `devicePixelRatio` (FR-004). */
export const EXPORT_SCALE = 2;

/**
 * Ancho impreso objetivo en A4 **vertical** (210×297mm) — el recibo ocupa el
 * ancho completo de la hoja (con un margen mínimo de impresión seguro a cada
 * lado). Su alto parte de ~6,5cm y crece cuando el contenido lo necesita.
 */
export const PRINT_TARGET_WIDTH_MM = 190;

export const COLORS = {
  navy: '#0B1C3E',
  orange: '#FF9000',
  tertiary: '#29ABE2',
  gray: '#4B5563',
  grayLight: '#9CA3AF',
  rule: '#E5E7EB',
  /** Texto sobre fondo navy (banda del número y pie). */
  white: '#FFFFFF',
  /** Fondo suave de los bloques destacados (importe y observaciones). */
  surface: '#F9FAFB',
} as const;

export const FONT = {
  family: 'var(--font-montserrat), Montserrat, Arial, sans-serif',
} as const;

export const DOC = {
  cuit: '30-71945595-2',
} as const;

/**
 * Tope de negocio para el monto de un recibo — defensa en profundidad además
 * de la corrección algorítmica de `numeroALetras` (lib/numero-a-letras.ts),
 * que sin este límite puede recibir montos arbitrariamente grandes desde los
 * formularios. Fuente única: se valida en cliente (los 4 formularios de
 * recibo) y en servidor (app/api/recibos/route.ts).
 */
export const MONTO_MAXIMO = 999_999_999.99;

/**
 * `filterStyles` para `dom-to-image-more`: evita el "recuadro" fantasma que
 * aparece en TODOS los elementos al exportar. Tailwind Preflight aplica
 * `border: 0 solid` como reset global (propiedades físicas y lógicas:
 * `border-block-style`, `border-inline-end`, …); `dom-to-image-more` compara
 * contra un iframe sandbox sin ese reset y copia el estilo de borde a cada
 * nodo aunque el ancho sea 0. El rasterizado SVG→canvas pinta ese borde de
 * ancho 0 pero estilo "solid" como una línea visible.
 *
 * El chequeo es **por lado físico**, no por elemento: un elemento con borde
 * real en un solo lado (p. ej. `ReciboRow` con `borderBottom` únicamente) no
 * debe dejar pasar el `border-style` reseteado de los otros tres lados, o el
 * reset de Preflight se cuela como una línea visible en los lados sin borde
 * real (mapeo lógico→físico asumido `horizontal-tb`/`ltr`, único usado en
 * este documento).
 */
export function filterExportBorderStyles(el: Element, propertyName: string): boolean {
  if (!propertyName.startsWith('border')) return true;
  const carriesStyle =
    /style$/.test(propertyName) ||
    /^border(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?$/.test(
      propertyName
    );
  if (!carriesStyle) return true;

  const computed = getComputedStyle(el);
  const has = (side: 'top' | 'right' | 'bottom' | 'left') =>
    parseFloat(computed.getPropertyValue(`border-${side}-width`)) > 0;

  if (/^border-(top|block-start)/.test(propertyName)) return has('top');
  if (/^border-(bottom|block-end)/.test(propertyName)) return has('bottom');
  if (/^border-(left|inline-start)/.test(propertyName)) return has('left');
  if (/^border-(right|inline-end)/.test(propertyName)) return has('right');
  if (/^border-block/.test(propertyName)) return has('top') && has('bottom');
  if (/^border-inline/.test(propertyName)) return has('left') && has('right');
  return has('top') && has('right') && has('bottom') && has('left');
}

import { COLORS } from './recibo-doc';

/**
 * Acento decorativo de marca: la onda naranja/celeste que aparece bajo el
 * isotipo de CuyoSmart (public/brand/logo_name_completo_dark.svg). No se
 * extraen los paths del logo — están atados a posiciones específicas de las
 * letras y a gradientes con stops que no coinciden exactamente con `COLORS`
 * — se dibuja una curva bezier nueva y liviana, coloreada directamente desde
 * `COLORS` para garantizar coincidencia exacta de marca. SVG puro (`fill`,
 * nunca `border`): cero interacción con `filterExportBorderStyles`.
 *
 * `variant="header"` se monta sobre fondo blanco (opacidad baja, tonos de
 * marca); `variant="footer"` sobre el pie navy (tonos claros, opacidad aún
 * más baja para no competir con el texto "¡Gracias por su confianza!").
 */
export default function ReciboWaveAccent({ variant }: { variant: 'header' | 'footer' }) {
  const onDark = variant === 'footer';
  return (
    <svg
      width="110"
      height="55"
      viewBox="0 0 220 110"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        pointerEvents: 'none',
        transform: onDark ? 'scaleY(-1)' : undefined,
      }}
      aria-hidden="true"
    >
      <path
        d="M0,80 C55,30 90,95 145,55 C175,35 195,45 220,20 L220,0 L0,0 Z"
        fill={onDark ? COLORS.white : COLORS.orange}
        opacity={onDark ? 0.06 : 0.1}
      />
      <path
        d="M40,100 C90,55 120,105 165,70 C190,52 205,58 220,42 L220,0 L60,0 Z"
        fill={onDark ? COLORS.orange : COLORS.tertiary}
        opacity={onDark ? 0.08 : 0.09}
      />
    </svg>
  );
}

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { Recibo } from '@/types/recibo';
import { siteConfig } from '@/data/content';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';
import { RECIBO_DOC, COLORS, FONT, DOC } from './recibo-doc';
import ReciboWaveAccent from './ReciboWaveAccent';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

function formaPagoTexto(r: Recibo): string {
  if (r.formaPago === 'Otro') {
    return r.formaPagoOtroDetalle ? `Otro: ${r.formaPagoOtroDetalle}` : 'Otro';
  }
  return r.formaPago;
}

interface ReciboDocumentProps {
  r: Recibo;
  className?: string;
}

/**
 * Nodo del documento del comprobante. Se expone por `ref` para que la
 * exportación rasterice el mismo nodo que se ve en pantalla (research.md § 4);
 * no lleva `id`, porque un identificador global colisiona con el documento de
 * presupuesto.
 *
 * Layout: comprobante de ancho fijo y alto mínimo compacto, que crece para
 * mostrar todo el contenido. Estilos inline con valores ya resueltos y **Flexbox en
 * todos los niveles** — el clon serializado dentro del `foreignObject` no ve
 * la hoja de Tailwind ni las custom properties del `:root`, y el soporte de
 * CSS Grid ahí es la fuente conocida de divergencia pantalla/imagen
 * (research.md § 5, plan.md § Complexity Tracking).
 *
 * El concepto tiene una fila completa. Ningún dato se trunca: la referencia
 * al presupuesto y el saldo suelen aparecer al final y deben llegar al cliente.
 */
const ReciboDocument = forwardRef<HTMLDivElement, ReciboDocumentProps>(
  function ReciboDocument({ r, className = '' }, ref) {
    return (
      <div
        ref={ref}
        data-recibo-document
        className={`recibo-document ${className}`}
        style={{
          position: 'relative',
          width: `${RECIBO_DOC.width}px`,
          minHeight: `${RECIBO_DOC.minHeight}px`,
          backgroundColor: RECIBO_DOC.background,
          fontFamily: FONT.family,
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          color: COLORS.navy,
        }}
      >
        <ReciboWaveAccent variant="header" />
        <div
          style={{
            flex: 1,
            boxSizing: 'border-box',
            padding: `${RECIBO_DOC.paddingTop}px ${RECIBO_DOC.paddingX}px ${RECIBO_DOC.paddingBottom}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Header: logo + contacto en una sola línea compacta */}
          <header style={{ display: 'flex', alignItems: 'center', gap: '24px', breakInside: 'avoid' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo_name_completo_dark.svg"
              alt="CuyoSmart SAS"
              style={{ width: '124px', height: 'auto', objectFit: 'contain', border: 'none', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <ContactRow label="CUIT" value={DOC.cuit}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </ContactRow>
              <ContactRow value={siteConfig.phoneDisplay}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </ContactRow>
              <ContactRow value={siteConfig.contactEmail}>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </ContactRow>
            </div>
          </header>

          {/* Franja de título + número + fecha: una sola tira navy compacta,
              redondeada a la izquierda, con bleed hasta el borde del canvas —
              identidad de marca del cliente (modelo-de-resivo.jpeg). */}
          <div
            style={{
              margin: `0 -${RECIBO_DOC.paddingX}px 0 0`,
              padding: '7px 28px',
              background: COLORS.navy,
              borderRadius: '999px 0 0 999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              breakInside: 'avoid',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: COLORS.white, letterSpacing: '0.18em', flexShrink: 0 }}>
              RECIBO
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: COLORS.grayLight, letterSpacing: '0.08em' }}>
                N.°
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: COLORS.orange, lineHeight: 1 }}>
                {formatNumero(r.numero)}
              </span>
              <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.white }}>
                {formatFechaDDMMYYYY(r.fecha)}
              </span>
            </div>
          </div>

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <FieldCol label="RECIBÍ DE" value={r.recibiDe} grow={2} emphasis />
              <FieldCol label="FORMA DE PAGO" value={formaPagoTexto(r)} divider />
            </div>

            <FieldCol label="EN CONCEPTO DE" value={r.concepto} grow={0} />

            {/* Bloque económico: importe en números y en letras, lado a lado
                (FR-009) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: `1px solid ${COLORS.rule}`,
                borderLeft: `5px solid ${COLORS.orange}`,
                borderRadius: '8px',
                background: COLORS.surface,
                padding: '7px 16px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.grayLight, letterSpacing: '0.1em' }}>
                  LA SUMA DE
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.gray }}>$</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy, lineHeight: 1 }}>
                    {formatCurrency(r.monto)}
                  </span>
                </div>
              </div>

              <div style={{ width: '1px', alignSelf: 'stretch', background: COLORS.rule, flexShrink: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.grayLight, letterSpacing: '0.1em' }}>
                  SON (EN LETRAS)
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: COLORS.navy,
                    lineHeight: 1.25,
                    overflowWrap: 'anywhere',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {r.montoEnLetras}
                </span>
              </div>
            </div>

            {/* Observaciones + Firma — Flexbox, nunca CSS Grid (research.md § 5) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.grayLight, letterSpacing: '0.1em' }}>
                  OBSERVACIONES
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    lineHeight: 1.3,
                    color: COLORS.gray,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {r.observaciones || ' '}
                </span>
              </div>

              {/* Firma */}
              <div style={{ flexShrink: 0, width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '100%', height: '1px', background: COLORS.grayLight }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.navy, letterSpacing: '0.1em' }}>
                  FIRMA
                </span>
              </div>
            </div>
          </main>
        </div>

        {/* El pie queda en el flujo y nunca tapa el texto. El sangrado de 1 px
            conserva el borde navy de la imagen exportada. */}
        <footer
          style={{
            position: 'relative',
            margin: '0 -1px -1px',
            flexShrink: 0,
            breakInside: 'avoid',
            height: `${RECIBO_DOC.footerHeight + 1}px`,
            background: COLORS.navy,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReciboWaveAccent variant="footer" />
          <span style={{ fontSize: '11px', fontWeight: 500, color: COLORS.white, fontStyle: 'italic' }}>
            ¡Gracias por su confianza!
          </span>
        </footer>
      </div>
    );
  }
);

export default ReciboDocument;

/** Campo multilínea. Conserva saltos manuales y parte palabras largas. */
function FieldCol({
  label,
  value,
  emphasis = false,
  divider = false,
  grow = 1,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  divider?: boolean;
  grow?: number;
}) {
  return (
    <div
      style={{
        flex: grow ? `${grow} 1 0%` : '0 0 auto',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        paddingLeft: divider ? '20px' : 0,
        paddingRight: '16px',
        marginLeft: divider ? '4px' : 0,
        borderLeft: divider ? `1px solid ${COLORS.rule}` : undefined,
      }}
    >
      <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.grayLight, letterSpacing: '0.1em' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: emphasis ? '15px' : '13px',
          fontWeight: emphasis ? 700 : 500,
          color: emphasis ? COLORS.navy : COLORS.gray,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          lineHeight: 1.45,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/** Renglón de contacto del header: ícono naranja + rótulo opcional + valor. */
function ContactRow({
  label,
  value,
  children,
}: {
  label?: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.orange}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        {children}
      </svg>
      <span style={{ fontSize: '11px', color: COLORS.gray, whiteSpace: 'nowrap' }}>
        {label ? <strong style={{ color: COLORS.navy, fontWeight: 700 }}>{label}: </strong> : null}
        {value}
      </span>
    </div>
  );
}

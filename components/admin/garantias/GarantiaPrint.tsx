import type { CSSProperties } from 'react';
import type { Garantia } from '@/types/garantia';
import {
  aniosEnTexto,
  formatNumeroDoc,
  numeroPresupuestoTexto,
  textosGarantia,
} from '@/lib/garantia-logic';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';
import { siteConfig } from '@/data/content';
import { COLORS, FONT } from '@/components/admin/recibo-doc';

const heading: CSSProperties = {
  margin: '10px 0 5px',
  paddingBottom: 4,
  borderBottom: `1px solid ${COLORS.rule}`,
  color: COLORS.navy,
  fontSize: '10pt',
  fontWeight: 800,
  fontFamily: FONT.family,
  breakAfter: 'avoid',
};
const paragraph: CSSProperties = {
  margin: '0 0 5px',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  orphans: 3,
  widows: 3,
};

export default function GarantiaPrint({
  garantia: g,
  firmaEmpresa,
}: {
  garantia: Garantia;
  firmaEmpresa: string | null;
}) {
  const textos = textosGarantia(g);
  const presupuesto = numeroPresupuestoTexto(g);
  const datos = [
    ...(presupuesto ? [['Presupuesto N.º', presupuesto]] : []),
    [
      'Cliente',
      [
        g.cliente,
        g.clienteDocumento ? `DNI / CUIT: ${g.clienteDocumento}` : '',
        g.clienteTelefono ? `Tel.: ${g.clienteTelefono}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
    ],
    ['Domicilio de la obra', [g.domicilioObra, g.localidad].filter(Boolean).join(', ')],
    ...(g.superficieM2
      ? [
          [
            'Superficie aproximada intervenida',
            `${new Intl.NumberFormat('es-AR').format(g.superficieM2)} m²`,
          ],
        ]
      : []),
    ['Trabajos realizados', g.trabajosRealizados],
    ...(g.materialesSistema ? [['Materiales / sistema', g.materialesSistema]] : []),
    ...(g.fechaInicio ? [['Fecha de inicio', formatFechaDDMMYYYY(g.fechaInicio)]] : []),
    ['Fecha de finalización', formatFechaDDMMYYYY(g.fechaFinalizacion)],
  ];
  return (
    <>
      <style>{`
      .garantia-document { width: 100%; max-width: 186mm; margin: 0 auto; background: white; box-shadow: 0 4px 24px #0b1c3e10; }
      .garantia-content { padding: 14px 20px; }
      .garantia-header { padding: 14px 20px; }
      @media (max-width: 480px) { .garantia-content, .garantia-header { padding: 16px; } }
      @media print {
        @page { size: A4 portrait; margin: 10mm; }
        html, body { background: white !important; margin: 0 !important; padding: 0 !important; min-height: 0 !important; }
        body > div, main { display: block !important; min-height: 0 !important; background: white !important; }
        .garantia-page { max-width: none !important; padding: 0 !important; margin: 0 !important; }
        .garantia-document { max-width: none; box-shadow: none; }
        .garantia-document * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .garantia-content { padding: 12px 16px; }
        .garantia-header { padding: 12px 16px; }
      }
    `}</style>
      <article
        className="garantia-document"
        aria-label={`Certificado de garantía N.º ${formatNumeroDoc(g.numero)}`}
        style={{
          fontFamily: 'var(--font-open-sans), Arial, sans-serif',
          color: COLORS.gray,
          fontSize: '8.5pt',
          lineHeight: 1.3,
        }}
      >
        <header
          className="garantia-header"
          style={{
            background: COLORS.navy,
            color: COLORS.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            breakInside: 'avoid',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Logo nativo para el documento imprimible. */}
          <img
            src="/brand/logo_name_completo_horizontal.svg"
            alt="CuyoSmart SAS"
            style={{
              width: 165,
              height: 42,
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}
          />
          <div style={{ fontSize: '8pt', overflowWrap: 'anywhere' }}>
            <strong>CUYO SMART S.A.S.</strong>
            <br />
            {siteConfig.phoneDisplay}
            <br />
            {siteConfig.contactEmail}
          </div>
        </header>
        <div
          style={{
            borderBottom: `3px solid ${COLORS.orange}`,
            padding: '8px 16px',
            color: COLORS.navy,
            breakInside: 'avoid',
            breakAfter: 'avoid',
          }}
        >
          <h1 style={{ fontSize: '14pt', fontWeight: 800, margin: 0, fontFamily: FONT.family }}>
            CERTIFICADO DE GARANTÍA
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: '9pt' }}>
            N.º <strong>{formatNumeroDoc(g.numero)}</strong>
          </p>
        </div>
        <div className="garantia-content">
          <p style={paragraph}>{textos.intro}</p>
          <dl
            style={{
              margin: '8px 0',
              padding: '8px 10px',
              background: COLORS.surface,
              borderLeft: `3px solid ${COLORS.orange}`,
            }}
          >
            {datos.map(([label, value]) => (
              <div key={label} style={{ marginBottom: 1, overflowWrap: 'anywhere' }}>
                <dt style={{ display: 'inline', fontWeight: 700, color: COLORS.navy }}>
                  {label}:{' '}
                </dt>
                <dd style={{ display: 'inline', margin: 0, whiteSpace: 'pre-wrap' }}>{value}</dd>
              </div>
            ))}
          </dl>
          <p style={{ ...paragraph, fontWeight: 700, color: COLORS.navy }}>
            Vigencia de la garantía: {aniosEnTexto(g.aniosGarantia)}, desde{' '}
            {formatFechaDDMMYYYY(g.vigenciaDesde)} hasta {formatFechaDDMMYYYY(g.vigenciaHasta)}.
          </p>
          <h2 style={heading}>ALCANCE DE LA GARANTÍA</h2>
          {textos.alcance.map((text, i) => (
            <p key={i} style={paragraph}>
              {text}
            </p>
          ))}
          <h2 style={heading}>EXCLUSIONES DE LA GARANTÍA</h2>
          <p style={paragraph}>{textos.exclusionesIntro}</p>
          {textos.exclusiones.length > 0 && (
            <ul style={{ listStyle: 'disc', paddingLeft: 18, margin: '6px 0 9px' }}>
              {textos.exclusiones.map((text, i) => (
                <li
                  key={i}
                  style={{ marginBottom: 1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {text}
                </li>
              ))}
            </ul>
          )}
          <p style={paragraph}>{textos.limitacion}</p>
          <h2 style={heading}>CONSTANCIA</h2>
          <p style={paragraph}>{textos.constancia}</p>
          {g.observaciones && (
            <p style={paragraph}>
              <strong>Observaciones: </strong>
              {g.observaciones}
            </p>
          )}
          <div style={{ breakInside: 'avoid', marginTop: 16 }}>
            <p style={paragraph}>
              <strong>Lugar y fecha: </strong>
              {g.lugarEmision}, {formatFechaDDMMYYYY(g.fechaEmision)}.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 28,
                marginTop: 16,
              }}
            >
              {[
                { label: 'CUYO SMART S.A.S.', image: g.incluirFirmaEmpresa ? firmaEmpresa : null },
                { label: 'CLIENTE', image: g.firmaClienteDataUrl },
              ].map((firma) => (
                <div key={firma.label} style={{ textAlign: 'center' }}>
                  <strong style={{ color: COLORS.navy }}>{firma.label}</strong>
                  <div
                    style={{
                      height: '25mm',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {firma.image && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- Firma embebida para impresión. */}
                        <img
                          src={firma.image}
                          alt={`Firma ${firma.label}`}
                          style={{ maxWidth: '100%', maxHeight: '23mm', objectFit: 'contain' }}
                        />
                      </>
                    )}
                  </div>
                  <p style={{ margin: 0, paddingTop: 6, borderTop: `1px solid ${COLORS.gray}` }}>
                    Firma y aclaración
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer
          style={{
            padding: '9px 20px',
            background: COLORS.navy,
            color: COLORS.white,
            fontSize: '8pt',
            textAlign: 'center',
            breakInside: 'avoid',
          }}
        >
          {siteConfig.address} · {siteConfig.phoneDisplay}
        </footer>
      </article>
    </>
  );
}

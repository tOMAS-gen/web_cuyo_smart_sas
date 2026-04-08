import type { Presupuesto, TipoItem } from '@/types/presupuesto';
import { siteConfig } from '@/data/content';

const TIPO_LABELS: Record<TipoItem, string> = {
  material: 'Material',
  mano_de_obra: 'Mano de obra',
  ambos: 'Ambos',
};

const TIPO_BG: Record<TipoItem, string> = {
  material: '#dbeafe',
  mano_de_obra: '#ffedd5',
  ambos: '#dcfce7',
};

const TIPO_COLOR: Record<TipoItem, string> = {
  material: '#1d4ed8',
  mano_de_obra: '#c2410c',
  ambos: '#15803d',
};

function fmt(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}
function fmtFecha(iso: string): string {
  const [year, month, day] = iso.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function fmtNum(n: number): string { return String(n).padStart(4, '0'); }

const NAVY   = '#0B1C3E';
const ORANGE = '#FF9000';

// Reset total para neutralizar cualquier CSS global de Tailwind
const RESET: React.CSSProperties = {
  all: 'unset' as never,
  display: 'block',
  boxSizing: 'border-box',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '13px',
  lineHeight: '1.4',
  color: NAVY,
  border: 'none',
  outline: 'none',
  margin: 0,
  padding: 0,
  background: 'none',
  textDecoration: 'none',
};

const ROW: React.CSSProperties = { ...RESET, display: 'flex', alignItems: 'center' };
const CELL = (width?: string | number, align?: string): React.CSSProperties => ({
  ...RESET,
  display: 'block',
  width: width ?? 'auto',
  textAlign: (align as never) ?? 'left',
  flexShrink: 0,
});

export default function PresupuestoExportView({ p }: { p: Presupuesto }) {
  const items = p.items ?? [];
  const totalMDO = items.reduce((a, i) => a + i.manoDeObra, 0);
  const totalMat = items.reduce((a, i) => a + i.materiales, 0);

  return (
    <div id="export-root" style={{
      ...RESET,
      width: '680px',
      backgroundColor: '#fff',
      overflow: 'hidden',
    }}>

      {/* HEADER */}
      <div style={{ ...ROW, backgroundColor: NAVY, padding: '20px 24px', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo_name_completo_horizontal.svg" alt="CuyoSmart SAS"
          style={{ height: '38px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)', border: 'none', outline: 'none' }} />
        <div style={{ ...RESET, textAlign: 'right' }}>
          <div style={{ ...RESET, fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>CuyoSmart SAS</div>
          <div style={{ ...RESET, fontSize: '11px', color: '#d1d5db', marginTop: '3px' }}>{siteConfig.address}</div>
          <div style={{ ...RESET, fontSize: '11px', color: '#d1d5db' }}>{siteConfig.contactEmail}</div>
          <div style={{ ...RESET, fontSize: '11px', color: '#d1d5db' }}>{siteConfig.phoneDisplay}</div>
        </div>
      </div>

      {/* BANDA NARANJA — título */}
      <div style={{ ...ROW, backgroundColor: ORANGE, padding: '10px 24px', justifyContent: 'space-between' }}>
        <div style={{ ...RESET, color: '#fff', fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Presupuesto N° {fmtNum(p.numero)}
        </div>
        <div style={{ ...RESET, color: '#fff', fontSize: '12px' }}>Fecha: {fmtFecha(p.fecha)}</div>
      </div>

      {/* CLIENTE */}
      <div style={{ ...RESET, backgroundColor: '#f9fafb', padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ ...RESET, fontSize: '9px', fontWeight: 'bold', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Cliente</div>
        <div style={{ ...ROW, gap: '40px' }}>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Nombre: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.cliente}</span>
          </div>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Ubicación: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div style={{ ...RESET, padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ ...RESET, fontSize: '9px', fontWeight: 'bold', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Descripción del trabajo</div>
        <div style={{ ...RESET, borderLeft: `3px solid ${ORANGE}`, paddingLeft: '12px', minHeight: '50px', color: '#374151', fontSize: '12px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {p.detalle}
        </div>
      </div>

      {/* ÍTEMS */}
      {items.length > 0 && (
        <div style={{ ...RESET, padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ ...RESET, fontSize: '9px', fontWeight: 'bold', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Desglose de costos</div>

          {/* Cabecera */}
          <div style={{ ...ROW, borderBottom: `2px solid ${NAVY}`, paddingBottom: '6px', marginBottom: '4px' }}>
            <div style={{ ...CELL('auto'), flex: 1, fontSize: '10px', fontWeight: 'bold', color: NAVY, textTransform: 'uppercase' }}>Descripción</div>
            <div style={{ ...CELL('110px', 'right'), fontSize: '10px', fontWeight: 'bold', color: NAVY, textTransform: 'uppercase' }}>Subtotal</div>
          </div>

          {/* Filas */}
          {items.map((item, i) => {
            const hasBoth = item.manoDeObra > 0 && item.materiales > 0;
            return (
              <div key={i} style={{ ...ROW, padding: '6px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
                <div style={{ ...CELL('auto'), flex: 1 }}>
                  <div style={{ ...RESET, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ ...RESET, fontSize: '12px', color: '#374151', whiteSpace: 'pre-wrap' }}>{item.descripcion}</div>
                    {item.tipo && (
                      <span style={{ ...RESET, display: 'inline-block', fontSize: '10px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px', backgroundColor: TIPO_BG[item.tipo], color: TIPO_COLOR[item.tipo] }}>
                        {TIPO_LABELS[item.tipo]}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ ...CELL('auto'), flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ ...RESET, fontSize: '12px', fontWeight: 'bold', color: NAVY, textAlign: 'right', whiteSpace: 'nowrap' }}>$ {fmt(item.manoDeObra + item.materiales)}</div>
                  {hasBoth && (
                    <div style={{ ...RESET, marginTop: '2px' }}>
                      <div style={{ ...RESET, fontSize: '10px', color: '#9ca3af', textAlign: 'right', whiteSpace: 'nowrap' }}>Mano de obra: <span style={{ color: '#6b7280' }}>${fmt(item.manoDeObra)}</span></div>
                      <div style={{ ...RESET, fontSize: '10px', color: '#9ca3af', textAlign: 'right', whiteSpace: 'nowrap' }}>Material: <span style={{ color: '#6b7280' }}>${fmt(item.materiales)}</span></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Desglose subtotales — solo si hay ambos tipos */}
          {totalMDO > 0 && totalMat > 0 && (
            <div style={{ ...RESET, borderTop: '1px solid #e5e7eb', marginTop: '8px', paddingTop: '6px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div style={{ ...ROW, gap: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                <div style={{ ...RESET, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fb923c', display: 'block', flexShrink: 0 }} />
                <div style={{ ...RESET, fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>Mano de obra: <span style={{ fontWeight: 'bold', color: NAVY }}>$ {fmt(totalMDO)}</span></div>
              </div>
              <div style={{ ...ROW, gap: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                <div style={{ ...RESET, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa', display: 'block', flexShrink: 0 }} />
                <div style={{ ...RESET, fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>Materiales: <span style={{ fontWeight: 'bold', color: NAVY }}>$ {fmt(totalMat)}</span></div>
              </div>
            </div>
          )}

          {/* Total */}
          <div style={{ ...ROW, backgroundColor: ORANGE, marginTop: '10px', padding: '12px 20px', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <div style={{ ...RESET, color: '#fff', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Total</div>
            <div style={{ ...RESET, color: '#fff', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>$ {fmt(p.total)}</div>
          </div>
        </div>
      )}

      {/* CONDICIONES */}
      <div style={{ ...RESET, backgroundColor: '#f9fafb', padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ ...RESET, fontSize: '9px', fontWeight: 'bold', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Condiciones</div>
        <div style={{ ...ROW, gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Validez: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.validezDias} días</span>
          </div>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Forma de pago: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.formaPago}</span>
          </div>
          {p.plazoRealizacion && (
            <div style={{ ...RESET, width: '100%' }}>
              <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Plazo de realización: </span>
              <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.plazoRealizacion}</span>
            </div>
          )}
        </div>
      </div>

      {/* NOTA */}
      <div style={{ ...RESET, padding: '16px 24px' }}>
        <div style={{ ...RESET, fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
          Este presupuesto es válido por <span style={{ ...RESET, display: 'inline', fontWeight: 'bold' }}>{p.validezDias} días</span> desde la fecha de emisión.
          Los precios pueden variar una vez vencido el plazo de validez.
          Ante cualquier consulta no dude en comunicarse con nosotros.
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ ...ROW, backgroundColor: NAVY, padding: '10px 24px', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px' }}>
        <div style={{ ...RESET, color: '#d1d5db', fontSize: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>☎ {siteConfig.phoneDisplay}</div>
        <div style={{ ...RESET, color: '#d1d5db', fontSize: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>✉ {siteConfig.contactEmail}</div>
        <div style={{ ...RESET, color: '#d1d5db', fontSize: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>⊙ {siteConfig.address}</div>
      </div>

    </div>
  );
}

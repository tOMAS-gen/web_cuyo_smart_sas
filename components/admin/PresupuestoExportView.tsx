import type { Presupuesto } from '@/types/presupuesto';
import { siteConfig } from '@/data/content';

function fmt(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}
function fmtFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Mendoza' });
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
            <div style={{ ...CELL('110px', 'right'), fontSize: '10px', fontWeight: 'bold', color: NAVY, textTransform: 'uppercase' }}>Mano de obra</div>
            <div style={{ ...CELL('110px', 'right'), fontSize: '10px', fontWeight: 'bold', color: NAVY, textTransform: 'uppercase' }}>Materiales</div>
            <div style={{ ...CELL('110px', 'right'), fontSize: '10px', fontWeight: 'bold', color: NAVY, textTransform: 'uppercase' }}>Subtotal</div>
          </div>

          {/* Filas */}
          {items.map((item, i) => (
            <div key={i} style={{ ...ROW, padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ ...CELL('auto'), flex: 1, fontSize: '12px', color: '#374151' }}>{item.descripcion}</div>
              <div style={{ ...CELL('110px', 'right'), fontSize: '12px', color: NAVY }}>$ {fmt(item.manoDeObra)}</div>
              <div style={{ ...CELL('110px', 'right'), fontSize: '12px', color: NAVY }}>$ {fmt(item.materiales)}</div>
              <div style={{ ...CELL('110px', 'right'), fontSize: '12px', fontWeight: 'bold', color: NAVY }}>$ {fmt(item.manoDeObra + item.materiales)}</div>
            </div>
          ))}

          {/* Subtotales */}
          <div style={{ ...ROW, padding: '6px 0', borderTop: '1px solid #e5e7eb', marginTop: '2px' }}>
            <div style={{ ...CELL('auto'), flex: 1, fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>Totales parciales</div>
            <div style={{ ...CELL('110px', 'right'), fontSize: '11px', color: '#4b5563' }}>$ {fmt(totalMDO)}</div>
            <div style={{ ...CELL('110px', 'right'), fontSize: '11px', color: '#4b5563' }}>$ {fmt(totalMat)}</div>
            <div style={{ ...CELL('110px') }}></div>
          </div>

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
        <div style={{ ...ROW, gap: '40px' }}>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Validez: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.validezDias} días</span>
          </div>
          <div style={{ ...RESET }}>
            <span style={{ ...RESET, display: 'inline', color: '#6b7280', fontSize: '12px' }}>Forma de pago: </span>
            <span style={{ ...RESET, display: 'inline', fontWeight: 'bold', fontSize: '12px', color: '#374151' }}>{p.formaPago}</span>
          </div>
        </div>
      </div>

      {/* NOTA + FIRMA */}
      <div style={{ ...RESET, padding: '16px 24px' }}>
        <div style={{ ...RESET, fontSize: '11px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
          Este presupuesto es válido por <span style={{ ...RESET, display: 'inline', fontWeight: 'bold' }}>{p.validezDias} días</span> desde la fecha de emisión.
          Los precios pueden variar una vez vencido el plazo de validez.
          Ante cualquier consulta no dude en comunicarse con nosotros.
        </div>
        <div style={{ ...ROW, justifyContent: 'flex-end' }}>
          <div style={{ ...RESET, textAlign: 'center', width: '180px', borderTop: `2px solid ${NAVY}`, paddingTop: '6px' }}>
            <div style={{ ...RESET, fontSize: '11px', fontWeight: 'bold', color: NAVY }}>Firma y sello</div>
            <div style={{ ...RESET, fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>CuyoSmart SAS</div>
          </div>
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

import Link from 'next/link';
import type { Recibo } from '@/types/recibo';
import ReciboDeleteButton from '@/components/admin/ReciboDeleteButton';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

function formatFecha(iso: string): string {
  const [year, month, day] = iso.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

const FORMA_PAGO_BADGE: Record<Recibo['formaPago'], { label: string; cls: string }> = {
  Efectivo: { label: 'Efectivo', cls: 'bg-green-100 text-green-700' },
  Transferencia: { label: 'Transferencia', cls: 'bg-blue-100 text-blue-700' },
  Otro: { label: 'Otro', cls: 'bg-gray-100 text-gray-700' },
};

export default function ReciboLista({
  presupuestoId,
  recibos,
}: {
  presupuestoId: string;
  recibos: Recibo[];
}) {
  return (
    <div className="space-y-5">
      {/* Lista de recibos — el resumen "Estado de pagos" ya lo renderiza app/admin/[id]/page.tsx */}
      {recibos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-gray-600 font-medium">Aún no hay recibos cargados</p>
          <p className="text-sm text-gray-400 mt-1">Creá el primero con el botón &quot;Nuevo recibo&quot;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recibos.map((r) => {
            const badge = FORMA_PAGO_BADGE[r.formaPago];
            return (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-secondary/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-primary">Recibo N° {formatNumero(r.numero)}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium truncate" title={r.recibiDe}>{r.recibiDe}</p>
                    <p className="text-xs text-gray-500 truncate" title={r.concepto}>{r.concepto}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-primary">$ {formatCurrency(r.monto)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatFecha(r.fecha)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/${presupuestoId}/recibos/${r.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Ver / Exportar
                  </Link>
                  <ReciboDeleteButton id={r.id} numero={r.numero} monto={r.monto} recibiDe={r.recibiDe} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

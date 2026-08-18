import { notFound } from 'next/navigation';
import { getPresupuesto } from '@/lib/presupuestos-store';
import { getRecibosByPresupuesto, getResumenPresupuesto } from '@/lib/recibos-store';
import PresupuestoDocumentPanel from './PresupuestoDocumentPanel';
import ReciboForm from './ReciboForm';
import ReciboLista from './ReciboLista';

export const dynamic = 'force-dynamic';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPresupuesto(id);
  if (!p) notFound();

  const [recibos, resumen] = await Promise.all([
    getRecibosByPresupuesto(p.id),
    getResumenPresupuesto(p.id, p.total),
  ]);

  const porcentaje = p.total > 0 ? Math.min((resumen.entregado / p.total) * 100, 100) : 0;
  const cancelado = !resumen.sobrepago && resumen.saldoPendiente === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Notas internas (no se imprimen) */}
      {p.notas && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 print:hidden">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Nota interna</p>
          <p className="text-sm text-amber-800">{p.notas}</p>
        </div>
      )}

      {/* Barra de acciones + documento imprimible/exportable (fuente única, research.md § 4) */}
      <PresupuestoDocumentPanel p={p} />

      {/* Sección de Recibos */}
      <div className="mt-8 print:hidden">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-primary">Recibos</h2>
            <p className="text-sm text-gray-500">Pagos recibidos para este presupuesto</p>
          </div>
          <ReciboForm
            presupuestoId={p.id}
            totalPresupuesto={p.total}
            entregadoPrevio={resumen.entregado}
            clienteDefault={p.cliente}
          />
        </div>

        {/* Resumen destacado: total, entregado y saldo pendiente */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-primary">Estado de pagos</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${resumen.sobrepago ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {resumen.sobrepago ? 'Sobrepago' : cancelado ? 'Saldo cancelado' : `${porcentaje.toFixed(0)}% cobrado`}
            </span>
          </div>

          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full transition-all duration-500 ${resumen.sobrepago ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm font-bold text-primary">{formatCurrency(p.total)}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Total</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-sm font-bold text-green-600">{formatCurrency(resumen.entregado)}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Entregado</p>
            </div>
            <div className={`rounded-xl p-3 ${resumen.sobrepago ? 'bg-red-50' : cancelado ? 'bg-green-50' : 'bg-primary/5'}`}>
              <p className={`text-sm font-bold ${resumen.sobrepago ? 'text-red-600' : cancelado ? 'text-green-600' : 'text-primary'}`}>
                {formatCurrency(Math.abs(resumen.saldoPendiente))}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                {resumen.sobrepago ? 'Excedente' : cancelado ? 'Cancelado' : 'Pendiente'}
              </p>
            </div>
          </div>

          {resumen.sobrepago && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              <p className="text-sm text-red-700 font-medium">
                El total entregado supera el monto del presupuesto por {formatCurrency(Math.abs(resumen.saldoPendiente))}.
              </p>
            </div>
          )}
        </div>

        {recibos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🧾</div>
            <p className="text-gray-600 font-medium">Aún no hay recibos cargados</p>
            <p className="text-sm text-gray-400 mt-1">Creá el primero con el botón &quot;Nuevo recibo&quot;</p>
          </div>
        ) : (
          <ReciboLista
            presupuestoId={p.id}
            recibos={recibos}
          />
        )}
      </div>
    </div>
  );
}

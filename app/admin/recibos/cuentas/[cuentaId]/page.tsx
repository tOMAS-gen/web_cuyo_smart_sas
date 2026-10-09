import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCuentaRecibo, getResumenCuentaRecibo } from '@/lib/cuentas-recibos-store';
import { getRecibosByCuenta } from '@/lib/recibos-store';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';
import ReciboCuentaForm from '@/components/admin/ReciboCuentaForm';
import ReciboDeleteButton from '@/components/admin/ReciboDeleteButton';
import CuentaDeleteButton from './CuentaDeleteButton';
import type { Recibo } from '@/types/recibo';
import { getGarantiasByCuenta } from '@/lib/garantias-store';
import { GarantiasSection } from '@/components/admin/garantias/GarantiasList';

export const dynamic = 'force-dynamic';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

const FORMA_PAGO_BADGE: Record<Recibo['formaPago'], { label: string; cls: string }> = {
  Efectivo: { label: 'Efectivo', cls: 'bg-green-100 text-green-700' },
  Transferencia: { label: 'Transferencia', cls: 'bg-blue-100 text-blue-700' },
  Otro: { label: 'Otro', cls: 'bg-gray-100 text-gray-700' },
};

export default async function CuentaReciboPage({
  params,
}: {
  params: Promise<{ cuentaId: string }>;
}) {
  const { cuentaId } = await params;
  const cuenta = await getCuentaRecibo(cuentaId);
  if (!cuenta) notFound();

  const [recibos, resumen, garantias] = await Promise.all([
    getRecibosByCuenta(cuentaId),
    getResumenCuentaRecibo(cuentaId, cuenta.montoTotal),
    getGarantiasByCuenta(cuentaId),
  ]);

  const porcentaje = cuenta.montoTotal > 0 ? Math.min((resumen.entregado / cuenta.montoTotal) * 100, 100) : 0;
  const cancelado = !resumen.sobrepago && resumen.saldoPendiente === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link
            href="/admin/recibos"
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            ← Volver a recibos
          </Link>
          <h1 className="text-2xl font-bold text-primary mt-1">{cuenta.cliente}</h1>
          <p className="text-gray-500 text-sm">{cuenta.concepto}</p>
        </div>
        <div className="flex items-center gap-3">
          <CuentaDeleteButton id={cuenta.id} cliente={cuenta.cliente} />
          <ReciboCuentaForm
            cuentaReciboId={cuenta.id}
            totalCuenta={cuenta.montoTotal}
            entregadoPrevio={resumen.entregado}
            clienteDefault={cuenta.cliente}
          />
        </div>
      </div>

      {/* Resumen: total, entregado y saldo pendiente siempre visibles sin scroll */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-primary">Estado de pagos</h2>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              resumen.sobrepago
                ? 'bg-red-100 text-red-700'
                : cancelado
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
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
            <p className="text-sm font-bold text-primary">{formatCurrency(cuenta.montoTotal)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Total</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-sm font-bold text-green-600">{formatCurrency(resumen.entregado)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Entregado</p>
          </div>
          <div
            className={`rounded-xl p-3 ${
              resumen.sobrepago ? 'bg-red-50' : cancelado ? 'bg-green-50' : 'bg-primary/5'
            }`}
          >
            <p
              className={`text-sm font-bold ${
                resumen.sobrepago ? 'text-red-600' : cancelado ? 'text-green-600' : 'text-primary'
              }`}
            >
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
              El total entregado supera el monto de la cuenta por $ {formatCurrency(Math.abs(resumen.saldoPendiente))}.
            </p>
          </div>
        )}

        {cancelado && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5"/></svg>
            <p className="text-sm text-green-700 font-medium">
              La cuenta está saldada: el total entregado cubre exactamente el monto de la cuenta.
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <GarantiasSection garantias={garantias} href={`/admin/garantias/nueva?cuentaReciboId=${encodeURIComponent(cuentaId)}`} />
      </div>

      {/* Lista de recibos */}
      <div>
        <h2 className="text-lg font-bold text-primary mb-4">Recibos de la cuenta</h2>
        {recibos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🧾</div>
            <p className="text-gray-600 font-medium">Aún no hay recibos en esta cuenta</p>
            <p className="text-sm text-gray-400 mt-1">Creá el primero con el botón &quot;Nuevo recibo&quot;</p>
            <div className="mt-4 flex justify-center">
              <ReciboCuentaForm
                cuentaReciboId={cuenta.id}
                totalCuenta={cuenta.montoTotal}
                entregadoPrevio={resumen.entregado}
                clienteDefault={cuenta.cliente}
              />
            </div>
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
                      <p className="text-xs text-gray-500 truncate" title={r.concepto}>{formatFechaDDMMYYYY(r.fecha)} · {r.concepto}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-primary">{formatCurrency(r.monto)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <Link
                      href={`/admin/recibos/${r.id}`}
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
    </div>
  );
}

import Link from 'next/link';
import { getRecibos } from '@/lib/recibos-store';
import { getCuentasRecibo, getResumenCuentaRecibo } from '@/lib/cuentas-recibos-store';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';
import ReciboStandaloneForm from '@/components/admin/ReciboStandaloneForm';
import CuentaReciboForm from '@/components/admin/CuentaReciboForm';
import ReciboDeleteButton from '@/components/admin/ReciboDeleteButton';
import type { Recibo } from '@/types/recibo';

export const metadata = { title: 'Recibos — CuyoSmart Admin' };
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

export default async function RecibosPage() {
  const [cuentas, recibos] = await Promise.all([getCuentasRecibo(), getRecibos()]);

  const cuentasConResumen = await Promise.all(
    cuentas.map(async (c) => {
      const resumen = await getResumenCuentaRecibo(c.id, c.montoTotal);
      return { ...c, ...resumen };
    })
  );

  const recibosSueltos = recibos.filter((r) => !r.presupuestoId && !r.cuentaReciboId);
  const totalRecaudado = recibos.reduce((acc, r) => acc + r.monto, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Recibos</h1>
          <p className="text-gray-500 text-sm">Cuentas por proyecto y recibos sueltos</p>
        </div>
        <div className="flex gap-3">
          <ReciboStandaloneForm />
          <CuentaReciboForm />
        </div>
      </div>

      {/* Resumen global */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-primary">{formatCurrency(totalRecaudado)}</p>
          <p className="text-xs text-gray-500 mt-1">Total recaudado</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-tertiary">{recibos.length}</p>
          <p className="text-xs text-gray-500 mt-1">Recibos emitidos</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-green-600">{cuentas.length}</p>
          <p className="text-xs text-gray-500 mt-1">Cuentas</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-secondary">{recibosSueltos.length}</p>
          <p className="text-xs text-gray-500 mt-1">Recibos sueltos</p>
        </div>
      </div>

      {/* Cuentas de recibo */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-primary mb-4">Cuentas de recibo</h2>
        {cuentasConResumen.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-gray-600 font-medium">No hay cuentas de recibo</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Creá la primera cuenta para empezar a registrar entregas</p>
            <div className="flex justify-center">
              <CuentaReciboForm />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {cuentasConResumen.map((c) => {
              const porcentaje = c.montoTotal > 0 ? Math.min((c.entregado / c.montoTotal) * 100, 100) : 0;
              return (
                <Link
                  key={c.id}
                  href={`/admin/recibos/cuentas/${c.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 hover:border-secondary hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-bold text-primary truncate" title={c.cliente}>{c.cliente}</p>
                      <p className="text-sm text-gray-500 truncate" title={c.concepto}>{c.concepto}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${c.sobrepago ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {c.sobrepago ? 'Sobrepago' : `${porcentaje.toFixed(0)}%`}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full transition-all ${c.sobrepago ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-bold text-primary">{formatCurrency(c.montoTotal)}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Total</p>
                    </div>
                    <div>
                      <p className="font-bold text-green-600">{formatCurrency(c.entregado)}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Entregado</p>
                    </div>
                    <div>
                      <p className={`font-bold ${c.sobrepago ? 'text-red-600' : 'text-secondary'}`}>
                        {formatCurrency(Math.abs(c.saldoPendiente))}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">{c.sobrepago ? 'Excedente' : 'Pendiente'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recibos sueltos */}
      <section>
        <h2 className="text-lg font-bold text-primary mb-4">Recibos sueltos</h2>
        {recibosSueltos.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🧾</div>
            <p className="text-gray-600 font-medium">No hay recibos sueltos</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Creá el primer recibo suelto para empezar a registrarlos</p>
            <div className="flex justify-center">
              <ReciboStandaloneForm />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left font-semibold text-gray-700 px-4 py-3">N°</th>
                    <th className="text-left font-semibold text-gray-700 px-4 py-3">Fecha</th>
                    <th className="text-left font-semibold text-gray-700 px-4 py-3">Cliente / Concepto</th>
                    <th className="text-left font-semibold text-gray-700 px-4 py-3">Forma de pago</th>
                    <th className="text-right font-semibold text-gray-700 px-4 py-3">Monto</th>
                    <th className="text-right font-semibold text-gray-700 px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recibosSueltos.map((r) => {
                    const badge = FORMA_PAGO_BADGE[r.formaPago];
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-primary">{formatNumero(r.numero)}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatFechaDDMMYYYY(r.fecha)}</td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <p className="font-medium text-gray-800 truncate" title={r.recibiDe}>{r.recibiDe}</p>
                          <p className="text-xs text-gray-500 truncate" title={r.concepto}>{r.concepto}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatCurrency(r.monto)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/recibos/${r.id}`}
                              className="text-xs font-semibold text-tertiary hover:underline"
                            >
                              Ver
                            </Link>
                            <ReciboDeleteButton id={r.id} numero={r.numero} monto={r.monto} recibiDe={r.recibiDe} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

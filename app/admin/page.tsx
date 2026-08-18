import Link from 'next/link';
import { getPresupuestos } from '@/lib/presupuestos-store';
import { getRecibos } from '@/lib/recibos-store';
import { getCuentasRecibo } from '@/lib/cuentas-recibos-store';
import type { Presupuesto } from '@/types/presupuesto';
import type { Recibo } from '@/types/recibo';
import type { CuentaRecibo } from '@/types/cuenta-recibo';

export const metadata = { title: 'Dashboard — CuyoSmart Admin' };
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

const ESTADO_BADGE: Record<Presupuesto['estado'], { label: string; cls: string }> = {
  borrador: { label: 'Borrador', cls: 'bg-gray-100 text-gray-600' },
  enviado: { label: 'Enviado', cls: 'bg-blue-100 text-blue-700' },
  aceptado: { label: 'Aceptado', cls: 'bg-green-100 text-green-700' },
  rechazado: { label: 'Rechazado', cls: 'bg-red-100 text-red-700' },
};

interface MesIngreso {
  label: string;
  monto: number;
}

function ultimos6Meses(recibos: Recibo[]): MesIngreso[] {
  const hoy = new Date();
  const meses: MesIngreso[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-AR', { month: 'short' });
    meses.push({ label, monto: 0 });

    recibos.forEach((r) => {
      if (r.fecha.startsWith(key)) {
        meses[meses.length - 1].monto += r.monto;
      }
    });
  }

  return meses;
}

export default async function DashboardPage() {
  const [presupuestos, recibos, cuentas] = await Promise.all([
    getPresupuestos(),
    getRecibos(),
    getCuentasRecibo(),
  ]);

  const totalPresupuestado = presupuestos.reduce((acc, p) => acc + p.total, 0);
  const totalEnCuentas = cuentas.reduce((acc, c) => acc + c.montoTotal, 0);
  const totalRecaudado = recibos.reduce((acc, r) => acc + r.monto, 0);
  const saldoPendiente = Math.max(0, totalPresupuestado + totalEnCuentas - totalRecaudado);

  const ingresosPorMes = ultimos6Meses(recibos);
  const maxIngreso = Math.max(...ingresosPorMes.map((m) => m.monto), 1);

  const estados = {
    borrador: presupuestos.filter((p) => p.estado === 'borrador').length,
    enviado: presupuestos.filter((p) => p.estado === 'enviado').length,
    aceptado: presupuestos.filter((p) => p.estado === 'aceptado').length,
    rechazado: presupuestos.filter((p) => p.estado === 'rechazado').length,
  };
  const maxEstado = Math.max(...Object.values(estados), 1);

  const ultimosPresupuestos = presupuestos.slice(0, 5);
  const ultimosRecibos = recibos.slice(0, 5);
  const ultimasCuentas = cuentas.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1C3E]">Dashboard</h1>
          <p className="text-gray-500 text-sm">Resumen general de CuyoSmart</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/presupuestos"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            Ver presupuestos
          </Link>
          <Link
            href="/admin/recibos"
            className="bg-[#FF9000] hover:bg-[#e68000] text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            Ver recibos
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Presupuestado</p>
          <p className="text-xl font-bold text-[#0B1C3E]">{formatCurrency(totalPresupuestado)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {presupuestos.length} presupuestos · {totalPresupuestado > 0 ? `${((totalRecaudado / totalPresupuestado) * 100).toFixed(0)}%` : '0%'} cobrado
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">En cuentas</p>
          <p className="text-xl font-bold text-[#29ABE2]">{formatCurrency(totalEnCuentas)}</p>
          <p className="text-xs text-gray-400 mt-1">{cuentas.length} cuentas de recibo</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recaudado</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalRecaudado)}</p>
          <p className="text-xs text-gray-400 mt-1">{recibos.length} recibos</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Saldo pendiente</p>
          <p className="text-xl font-bold text-[#FF9000]">{formatCurrency(saldoPendiente)}</p>
          <p className="text-xs text-gray-400 mt-1">Por cobrar total</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Ingresos por mes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-[#0B1C3E] mb-5">Ingresos por mes</h2>
          {ingresosPorMes.every((m) => m.monto === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">No hay ingresos registrados en los últimos 6 meses</p>
          ) : (
            <div className="flex items-end justify-between gap-2 h-40">
              {ingresosPorMes.map((mes) => {
                const altura = Math.round((mes.monto / maxIngreso) * 100);
                return (
                  <div key={mes.label} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full max-w-[40px] bg-[#29ABE2] rounded-t-lg transition-all"
                      style={{ height: `${altura}%`, minHeight: altura > 0 ? '4px' : '0' }}
                      title={`${mes.label}: ${formatCurrency(mes.monto)}`}
                    />
                    <span className="text-[10px] text-gray-500 capitalize">{mes.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Presupuestos por estado */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-[#0B1C3E] mb-5">Presupuestos por estado</h2>
          <div className="space-y-4">
            {(
              [
                { key: 'aceptado', label: 'Aceptados', color: '#22c55e' },
                { key: 'enviado', label: 'Enviados', color: '#3b82f6' },
                { key: 'borrador', label: 'Borradores', color: '#9ca3af' },
                { key: 'rechazado', label: 'Rechazados', color: '#ef4444' },
              ] as const
            ).map((item) => {
              const count = estados[item.key];
              const pct = Math.round((count / maxEstado) * 100);
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="font-bold text-[#0B1C3E]">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Listados recientes */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Últimos presupuestos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0B1C3E]">Últimos presupuestos</h2>
            <Link href="/admin/presupuestos" className="text-xs font-semibold text-[#29ABE2] hover:underline">Ver todos</Link>
          </div>
          {ultimosPresupuestos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay presupuestos aún</p>
          ) : (
            <div className="space-y-3">
              {ultimosPresupuestos.map((p) => {
                const badge = ESTADO_BADGE[p.estado];
                return (
                  <Link
                    key={p.id}
                    href={`/admin/${p.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0B1C3E]">N° {formatNumero(p.numero)}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{p.cliente}</p>
                    </div>
                    <span className="text-sm font-bold text-[#FF9000] shrink-0">{formatCurrency(p.total)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimos recibos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0B1C3E]">Últimos recibos</h2>
            <Link href="/admin/recibos" className="text-xs font-semibold text-[#29ABE2] hover:underline">Ver todos</Link>
          </div>
          {ultimosRecibos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay recibos aún</p>
          ) : (
            <div className="space-y-3">
              {ultimosRecibos.map((r) => (
                <Link
                  key={r.id}
                  href={r.presupuestoId ? `/admin/${r.presupuestoId}/recibos/${r.id}` : `/admin/recibos/${r.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B1C3E]">Recibo N° {formatNumero(r.numero)}</span>
                      {r.presupuestoId && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">Presupuesto</span>
                      )}
                      {r.cuentaReciboId && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700">Cuenta</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 truncate">{r.recibiDe}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 shrink-0">{formatCurrency(r.monto)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Últimas cuentas */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0B1C3E]">Últimas cuentas</h2>
            <Link href="/admin/recibos" className="text-xs font-semibold text-[#29ABE2] hover:underline">Ver todas</Link>
          </div>
          {ultimasCuentas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay cuentas aún</p>
          ) : (
            <div className="space-y-3">
              {ultimasCuentas.map((c: CuentaRecibo) => (
                <Link
                  key={c.id}
                  href={`/admin/recibos/cuentas/${c.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{c.cliente}</p>
                    <p className="text-xs text-gray-500 truncate">{c.concepto}</p>
                  </div>
                  <span className="text-sm font-bold text-[#29ABE2] shrink-0">{formatCurrency(c.montoTotal)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

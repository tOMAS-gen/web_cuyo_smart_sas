import { getPresupuestos } from '@/lib/presupuestos-store';
import PresupuestoLista from '@/components/admin/PresupuestoLista';
import Link from 'next/link';

export const metadata = { title: 'Presupuestos — CuyoSmart Admin' };
export const dynamic = 'force-dynamic';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboard() {
  const presupuestos = await getPresupuestos();

  const total = presupuestos.reduce((acc, p) => acc + p.total, 0);
  const aceptados = presupuestos.filter((p) => p.estado === 'aceptado').length;
  const pendientes = presupuestos.filter((p) => p.estado === 'borrador' || p.estado === 'enviado').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Título */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1C3E]">Presupuestos</h1>
          <p className="text-gray-500 text-sm">{presupuestos.length} presupuesto{presupuestos.length !== 1 ? 's' : ''} en total</p>
        </div>
        <Link
          href="/admin/nuevo"
          className="bg-[#FF9000] hover:bg-[#e68000] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Nuevo
        </Link>
      </div>

      {/* Estadísticas */}
      {presupuestos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-[#0B1C3E]">{presupuestos.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{aceptados}</p>
            <p className="text-xs text-gray-500 mt-1">Aceptados</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-lg font-bold text-[#FF9000]">{formatCurrency(total)}</p>
            <p className="text-xs text-gray-500 mt-1">Acumulado</p>
          </div>
        </div>
      )}

      {/* Lista */}
      <PresupuestoLista presupuestos={presupuestos} />

      {pendientes > 0 && (
        <p className="text-center text-xs text-gray-400 mt-6">
          {pendientes} presupuesto{pendientes !== 1 ? 's' : ''} pendiente{pendientes !== 1 ? 's' : ''} de respuesta
        </p>
      )}
    </div>
  );
}

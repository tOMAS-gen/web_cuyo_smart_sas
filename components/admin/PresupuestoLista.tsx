'use client';

import Link from 'next/link';
import type { Presupuesto } from '@/types/presupuesto';

const ESTADO_BADGE: Record<Presupuesto['estado'], { label: string; cls: string }> = {
  borrador: { label: 'Borrador', cls: 'bg-gray-100 text-gray-600' },
  enviado: { label: 'Enviado', cls: 'bg-blue-100 text-blue-700' },
  aceptado: { label: 'Aceptado', cls: 'bg-green-100 text-green-700' },
  rechazado: { label: 'Rechazado', cls: 'bg-red-100 text-red-700' },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Mendoza',
  });
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

export default function PresupuestoLista({ presupuestos }: { presupuestos: Presupuesto[] }) {
  if (presupuestos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-lg font-medium">No hay presupuestos aún</p>
        <p className="text-sm mt-1">Creá el primero con el botón &quot;+ Nuevo&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {presupuestos.map((p) => {
        const badge = ESTADO_BADGE[p.estado];
        return (
          <Link
            key={p.id}
            href={`/admin/${p.id}`}
            className="block bg-white rounded-2xl border border-gray-200 hover:border-[#FF9000] hover:shadow-md transition-all p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#0B1C3E] font-bold text-sm">N° {formatNumero(p.numero)}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 truncate">{p.cliente}</p>
                <p className="text-gray-500 text-sm truncate">{p.ubicacion}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[#FF9000] font-bold text-lg">{formatCurrency(p.total)}</p>
                <p className="text-gray-400 text-xs">{formatFecha(p.fecha)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

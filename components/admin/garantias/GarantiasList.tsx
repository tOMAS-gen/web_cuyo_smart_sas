import Link from 'next/link';
import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';
import type { Garantia } from '@/types/garantia';
import { formatNumeroDoc } from '@/lib/garantia-logic';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';

export type GarantiaResumen = Pick<
  Garantia,
  | 'id'
  | 'numero'
  | 'cliente'
  | 'domicilioObra'
  | 'aniosGarantia'
  | 'vigenciaHasta'
  | 'presupuestoId'
  | 'presupuestoNumero'
  | 'cuentaReciboId'
>;

export default function GarantiasList({ garantias }: { garantias: GarantiaResumen[] }) {
  if (!garantias.length)
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
        <ShieldCheck size={32} className="mx-auto mb-3 text-gray-400" />
        <p className="font-semibold text-primary">Todavía no hay certificados</p>
        <p className="mt-1 text-sm text-gray-500">
          Emití una garantía para documentar la cobertura de una obra.
        </p>
      </div>
    );
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-100">
        {garantias.map((g) => (
          <li key={g.id} className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  href={`/admin/garantias/${g.id}`}
                  className="group inline-flex max-w-full items-center gap-2 text-base font-bold text-primary hover:underline"
                >
                  <span className="break-words">
                    N.º {formatNumeroDoc(g.numero)} · {g.cliente}
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-gray-400 group-hover:text-primary"
                  />
                </Link>
                <p className="mt-1 break-words text-sm text-gray-500">{g.domicilioObra}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {g.presupuestoId ? (
                    <Link href={`/admin/${g.presupuestoId}`} className="hover:underline">
                      Presupuesto N.º{' '}
                      {g.presupuestoNumero !== undefined
                        ? formatNumeroDoc(g.presupuestoNumero)
                        : '—'}
                    </Link>
                  ) : g.cuentaReciboId ? (
                    <Link
                      href={`/admin/recibos/cuentas/${g.cuentaReciboId}`}
                      className="hover:underline"
                    >
                      Cuenta de recibos
                    </Link>
                  ) : (
                    'Certificado suelto'
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-5 sm:block sm:text-right">
                <p className="text-sm font-semibold text-primary">
                  {g.aniosGarantia} {g.aniosGarantia === 1 ? 'año' : 'años'} de garantía
                </p>
                <p className="mt-1 text-xs tabular-nums text-gray-500">
                  Hasta {formatFechaDDMMYYYY(g.vigenciaHasta)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GarantiasSection({
  garantias,
  href,
}: {
  garantias: GarantiaResumen[];
  href: string;
}) {
  return (
    <section className="mt-8 print:hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary">Garantías</h2>
          <p className="text-sm text-gray-500">Certificados de cobertura de esta obra</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <Plus size={17} />
          Emitir certificado
        </Link>
      </div>
      <GarantiasList garantias={garantias} />
    </section>
  );
}

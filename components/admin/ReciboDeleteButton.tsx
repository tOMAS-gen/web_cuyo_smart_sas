'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmModal from '@/components/admin/ConfirmModal';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

function formatNumero(n: number): string {
  return String(n).padStart(4, '0');
}

export default function ReciboDeleteButton({
  id,
  numero,
  monto,
  recibiDe,
}: {
  id: string;
  numero: number;
  monto: number;
  recibiDe: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recibos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOpen(false);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'No se pudo eliminar el recibo. Intentá de nuevo.');
    } catch {
      setError('No se pudo eliminar el recibo. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setOpen(true); }}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Eliminar
      </button>

      <ConfirmModal
        open={open}
        title="¿Eliminar este recibo?"
        description={`Estás por eliminar el Recibo N° ${formatNumero(numero)} de ${recibiDe} por $ ${formatCurrency(monto)}. Esta acción no se puede deshacer.`}
        confirmLabel={loading ? 'Eliminando...' : 'Sí, eliminar'}
        cancelLabel="Cancelar"
        confirmVariant="danger"
        error={error}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

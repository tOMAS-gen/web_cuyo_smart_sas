'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function CuentaDeleteButton({ id, cliente }: { id: string; cliente: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cuentas-recibos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOpen(false);
        router.push('/admin/recibos');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'No se pudo eliminar la cuenta. Intentá de nuevo.');
    } catch {
      setError('No se pudo eliminar la cuenta. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setOpen(true); }}
        className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Eliminar cuenta
      </button>

      <ConfirmModal
        open={open}
        title="¿Eliminar esta cuenta?"
        description={`Estás por eliminar la cuenta de ${cliente}. Se borrarán también todos los recibos y certificados de garantía vinculados. Esta acción no se puede deshacer.`}
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

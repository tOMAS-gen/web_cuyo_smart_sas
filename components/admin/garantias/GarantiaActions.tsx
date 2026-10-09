'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Pencil, Printer, Trash2 } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { formatNumeroDoc } from '@/lib/garantia-logic';
import { apiRequest, primaryButton, secondaryButton } from './ui';

export default function GarantiaActions({ id, numero }: { id: string; numero: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  async function remove() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/garantias/${id}`, { method: 'DELETE' });
      router.push('/admin/garantias');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el certificado.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" className={primaryButton} onClick={() => window.print()}>
        <Printer size={16} />
        Imprimir / PDF
      </button>
      <Link href={`/admin/garantias/${id}/editar`} className={secondaryButton}>
        <Pencil size={16} />
        Editar
      </Link>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        <Trash2 size={16} />
        Eliminar
      </button>
      <ConfirmModal
        open={open}
        title={`¿Eliminar certificado N.º ${formatNumeroDoc(numero)}?`}
        description="El certificado se eliminará definitivamente. El presupuesto, la cuenta y sus recibos se conservarán."
        confirmLabel={busy ? 'Eliminando…' : 'Sí, eliminar'}
        error={error}
        busy={busy}
        onConfirm={remove}
        onCancel={() => {
          if (!pending.current) setOpen(false);
        }}
      />
    </div>
  );
}

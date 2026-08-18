'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MONTO_MAXIMO } from '@/components/admin/recibo-doc';

interface FieldErrors {
  cliente?: string;
  concepto?: string;
  montoTotal?: string;
}

export default function CuentaReciboForm() {
  const router = useRouter();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [cliente, setCliente] = useState('');
  const [concepto, setConcepto] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
    }
  }, [open]);

  const montoTotalNum = useMemo(() => {
    const num = Number(montoTotal);
    return Number.isFinite(num) && num > 0 ? num : 0;
  }, [montoTotal]);

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (cliente.trim().length < 2) next.cliente = 'Ingresá al menos 2 caracteres';
    if (concepto.trim().length < 2) next.concepto = 'Ingresá al menos 2 caracteres';
    if (!montoTotalNum) next.montoTotal = 'El monto total debe ser mayor a 0';
    else if (montoTotalNum > MONTO_MAXIMO) next.montoTotal = 'El monto supera el máximo permitido';
    return next;
  }, [cliente, concepto, montoTotalNum]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const resetForm = useCallback(() => {
    setCliente('');
    setConcepto('');
    setMontoTotal('');
    setTouched({});
    setServerError(null);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ cliente: true, concepto: true, montoTotal: true });
    setServerError(null);

    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cuentas-recibos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: cliente.trim(),
          concepto: concepto.trim(),
          montoTotal: montoTotalNum,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.errors?.[0] ?? data.error ?? 'Error al guardar la cuenta');
        return;
      }

      handleClose();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Nueva cuenta
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cuenta-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl p-6 my-4 animate-[fadeIn_0.15s_ease-out]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="cuenta-modal-title" className="text-lg font-bold text-primary">
                Nueva cuenta de recibo
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-700 font-medium">{serverError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="cliente" className="block text-sm font-semibold text-gray-700 mb-1">Cliente / Proyecto</label>
                <input
                  ref={firstInputRef}
                  id="cliente"
                  type="text"
                  value={cliente}
                  onChange={(e) => { setCliente(e.target.value); setServerError(null); }}
                  onBlur={() => setTouched((t) => ({ ...t, cliente: true }))}
                  maxLength={100}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                    touched.cliente && errors.cliente ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del cliente o proyecto"
                />
                {touched.cliente && errors.cliente && (
                  <p className="mt-1 text-xs text-red-600">{errors.cliente}</p>
                )}
              </div>

              <div>
                <label htmlFor="concepto" className="block text-sm font-semibold text-gray-700 mb-1">Concepto</label>
                <input
                  id="concepto"
                  type="text"
                  value={concepto}
                  onChange={(e) => { setConcepto(e.target.value); setServerError(null); }}
                  onBlur={() => setTouched((t) => ({ ...t, concepto: true }))}
                  maxLength={200}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                    touched.concepto && errors.concepto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Obra techo galpón"
                />
                {touched.concepto && errors.concepto && (
                  <p className="mt-1 text-xs text-red-600">{errors.concepto}</p>
                )}
              </div>

              <div>
                <label htmlFor="montoTotal" className="block text-sm font-semibold text-gray-700 mb-1">Monto total de referencia $</label>
                <input
                  id="montoTotal"
                  type="number"
                  min="0.01"
                  max={MONTO_MAXIMO}
                  step="0.01"
                  value={montoTotal}
                  onChange={(e) => { setMontoTotal(e.target.value); setServerError(null); }}
                  onBlur={() => setTouched((t) => ({ ...t, montoTotal: true }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                    touched.montoTotal && errors.montoTotal ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                />
                {touched.montoTotal && errors.montoTotal && (
                  <p className="mt-1 text-xs text-red-600">{errors.montoTotal}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Este monto sirve como guía para saber cuánto falta cobrar.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !isValid}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Guardando...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

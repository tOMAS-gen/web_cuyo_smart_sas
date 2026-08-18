'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormaPagoRecibo } from '@/types/recibo';
import { numeroALetras } from '@/lib/numero-a-letras';
import { MONTO_MAXIMO } from '@/components/admin/recibo-doc';

const FORMAS_PAGO: FormaPagoRecibo[] = ['Efectivo', 'Transferencia', 'Otro'];

interface ReciboFormProps {
  presupuestoId: string;
  totalPresupuesto: number;
  entregadoPrevio: number;
  clienteDefault?: string;
}

interface FieldErrors {
  fecha?: string;
  recibiDe?: string;
  concepto?: string;
  monto?: string;
  formaPagoOtroDetalle?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

export default function ReciboForm({
  presupuestoId,
  totalPresupuesto,
  entregadoPrevio,
  clienteDefault = '',
}: ReciboFormProps) {
  const router = useRouter();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [recibiDe, setRecibiDe] = useState(clienteDefault);
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [montoEnLetras, setMontoEnLetras] = useState('');
  const [montoEnLetrasEditado, setMontoEnLetrasEditado] = useState(false);
  const [formaPago, setFormaPago] = useState<FormaPagoRecibo>('Efectivo');
  const [formaPagoOtroDetalle, setFormaPagoOtroDetalle] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
    }
  }, [open]);

  const montoNum = useMemo(() => {
    const num = Number(monto);
    return Number.isFinite(num) && num > 0 ? num : 0;
  }, [monto]);

  const saldoProyectado = useMemo(() => totalPresupuesto - entregadoPrevio - montoNum, [totalPresupuesto, entregadoPrevio, montoNum]);
  const sobrepagoProyectado = useMemo(() => saldoProyectado < 0, [saldoProyectado]);

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (!fecha) next.fecha = 'La fecha es requerida';
    if (recibiDe.trim().length < 2) next.recibiDe = 'Ingresá al menos 2 caracteres';
    if (concepto.trim().length < 2) next.concepto = 'Ingresá al menos 2 caracteres';
    if (!montoNum) next.monto = 'El monto debe ser mayor a 0';
    else if (montoNum > MONTO_MAXIMO) next.monto = 'El monto supera el máximo permitido';
    if (formaPago === 'Otro' && formaPagoOtroDetalle.trim().length < 2) {
      next.formaPagoOtroDetalle = 'Ingresá al menos 2 caracteres';
    }
    return next;
  }, [fecha, recibiDe, concepto, montoNum, formaPago, formaPagoOtroDetalle]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function handleMontoChange(value: string) {
    setMonto(value);
    setServerError(null);
    if (!montoEnLetrasEditado) {
      const num = Number(value);
      setMontoEnLetras(Number.isFinite(num) && num > 0 ? numeroALetras(num) : '');
    }
  }

  function handleLetrasChange(value: string) {
    setMontoEnLetras(value);
    setMontoEnLetrasEditado(true);
    setServerError(null);
  }

  function restoreLetrasAutomaticas() {
    setMontoEnLetras(montoNum ? numeroALetras(montoNum) : '');
    setMontoEnLetrasEditado(false);
  }

  const resetForm = useCallback(() => {
    setFecha(new Date().toISOString().slice(0, 10));
    setRecibiDe(clienteDefault);
    setConcepto('');
    setMonto('');
    setMontoEnLetras('');
    setMontoEnLetrasEditado(false);
    setFormaPago('Efectivo');
    setFormaPagoOtroDetalle('');
    setObservaciones('');
    setTouched({});
    setServerError(null);
  }, [clienteDefault]);

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
    setTouched({ fecha: true, recibiDe: true, concepto: true, monto: true, formaPagoOtroDetalle: true });
    setServerError(null);

    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/recibos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presupuestoId,
          fecha,
          recibiDe: recibiDe.trim(),
          concepto: concepto.trim(),
          monto: montoNum,
          montoEnLetras: montoEnLetras.trim() || numeroALetras(montoNum),
          formaPago,
          formaPagoOtroDetalle: formaPago === 'Otro' ? formaPagoOtroDetalle.trim() : undefined,
          observaciones: observaciones.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.errors?.[0] ?? data.error ?? 'Error al guardar el recibo');
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
        className="bg-secondary hover:bg-secondary/80 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Nuevo recibo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recibo-modal-title"
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
              <h3 id="recibo-modal-title" className="text-lg font-bold text-primary">
                Nuevo recibo
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                  <input
                    ref={firstInputRef}
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => { setFecha(e.target.value); setServerError(null); }}
                    onBlur={() => setTouched((t) => ({ ...t, fecha: true }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                      touched.fecha && errors.fecha ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={touched.fecha && !!errors.fecha}
                    aria-describedby={touched.fecha && errors.fecha ? 'fecha-error' : undefined}
                  />
                  {touched.fecha && errors.fecha && (
                    <p id="fecha-error" className="mt-1 text-xs text-red-600">{errors.fecha}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="recibiDe" className="block text-sm font-semibold text-gray-700 mb-1">Recibí de</label>
                  <input
                    id="recibiDe"
                    type="text"
                    value={recibiDe}
                    onChange={(e) => { setRecibiDe(e.target.value); setServerError(null); }}
                    onBlur={() => setTouched((t) => ({ ...t, recibiDe: true }))}
                    maxLength={100}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                      touched.recibiDe && errors.recibiDe ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del cliente"
                    aria-invalid={touched.recibiDe && !!errors.recibiDe}
                    aria-describedby={touched.recibiDe && errors.recibiDe ? 'recibiDe-error' : undefined}
                  />
                  {touched.recibiDe && errors.recibiDe && (
                    <p id="recibiDe-error" className="mt-1 text-xs text-red-600">{errors.recibiDe}</p>
                  )}
                </div>
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
                  placeholder="Ej: Anticipo obra techo"
                  aria-invalid={touched.concepto && !!errors.concepto}
                  aria-describedby={touched.concepto && errors.concepto ? 'concepto-error' : undefined}
                />
                {touched.concepto && errors.concepto && (
                  <p id="concepto-error" className="mt-1 text-xs text-red-600">{errors.concepto}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="monto" className="block text-sm font-semibold text-gray-700 mb-1">La suma de $</label>
                  <input
                    id="monto"
                    type="number"
                    min="0.01"
                    max={MONTO_MAXIMO}
                    step="0.01"
                    value={monto}
                    onChange={(e) => handleMontoChange(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, monto: true }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                      touched.monto && errors.monto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0,00"
                    aria-invalid={touched.monto && !!errors.monto}
                    aria-describedby={touched.monto && errors.monto ? 'monto-error' : undefined}
                  />
                  {touched.monto && errors.monto && (
                    <p id="monto-error" className="mt-1 text-xs text-red-600">{errors.monto}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="formaPago" className="block text-sm font-semibold text-gray-700 mb-1">Forma de pago</label>
                  <select
                    id="formaPago"
                    value={formaPago}
                    onChange={(e) => { setFormaPago(e.target.value as FormaPagoRecibo); setServerError(null); }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                  >
                    {FORMAS_PAGO.map((fp) => (
                      <option key={fp} value={fp}>{fp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formaPago === 'Otro' && (
                <div>
                  <label htmlFor="formaPagoOtroDetalle" className="block text-sm font-semibold text-gray-700 mb-1">Detalle de &quot;Otro&quot;</label>
                  <input
                    id="formaPagoOtroDetalle"
                    type="text"
                    value={formaPagoOtroDetalle}
                    onChange={(e) => { setFormaPagoOtroDetalle(e.target.value); setServerError(null); }}
                    onBlur={() => setTouched((t) => ({ ...t, formaPagoOtroDetalle: true }))}
                    maxLength={100}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary ${
                      touched.formaPagoOtroDetalle && errors.formaPagoOtroDetalle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Cheque, MercadoPago..."
                    aria-invalid={touched.formaPagoOtroDetalle && !!errors.formaPagoOtroDetalle}
                    aria-describedby={touched.formaPagoOtroDetalle && errors.formaPagoOtroDetalle ? 'formaPagoOtroDetalle-error' : undefined}
                  />
                  {touched.formaPagoOtroDetalle && errors.formaPagoOtroDetalle && (
                    <p id="formaPagoOtroDetalle-error" className="mt-1 text-xs text-red-600">{errors.formaPagoOtroDetalle}</p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="montoEnLetras" className="block text-sm font-semibold text-gray-700">Son (en letras)</label>
                  {montoEnLetrasEditado && (
                    <button
                      type="button"
                      onClick={restoreLetrasAutomaticas}
                      className="text-xs text-tertiary hover:underline"
                    >
                      Restaurar automático
                    </button>
                  )}
                </div>
                <input
                  id="montoEnLetras"
                  type="text"
                  value={montoEnLetras}
                  onChange={(e) => handleLetrasChange(e.target.value)}
                  maxLength={300}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                  placeholder="Se genera automáticamente al ingresar el monto"
                />
              </div>

              <div>
                <label htmlFor="observaciones" className="block text-sm font-semibold text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                  rows={2}
                />
              </div>
            </div>

            {/* Resumen proyectado */}
            <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Impacto en el presupuesto</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-primary">$ {formatCurrency(totalPresupuesto)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Total</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-600">$ {formatCurrency(entregadoPrevio + montoNum)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Entregado</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${sobrepagoProyectado ? 'text-red-600' : 'text-primary'}`}>
                    $ {formatCurrency(Math.abs(saldoProyectado))}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {sobrepagoProyectado ? 'Sobrepago' : 'Saldo pendiente'}
                  </p>
                </div>
              </div>
              {sobrepagoProyectado && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-700 font-medium">
                    ⚠️ Este recibo supera el saldo pendiente en $ {formatCurrency(Math.abs(saldoProyectado))}.
                  </p>
                </div>
              )}
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
                {loading ? 'Guardando...' : 'Guardar recibo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

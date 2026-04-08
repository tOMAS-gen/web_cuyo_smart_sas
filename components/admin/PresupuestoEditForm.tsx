'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { FormaPago, Presupuesto, PresupuestoItem } from '@/types/presupuesto';

const FORMAS_PAGO: FormaPago[] = [
  'Efectivo',
  'Transferencia bancaria',
  'Cheque',
  '50% anticipo / 50% al finalizar',
  'A convenir',
];

const VALIDEZ_OPCIONES = [7, 15, 30, 60, 90];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

export default function PresupuestoEditForm({ presupuesto }: { presupuesto: Presupuesto }) {
  const router = useRouter();

  const [form, setForm] = useState({
    fecha: presupuesto.fecha.split('T')[0],
    cliente: presupuesto.cliente,
    ubicacion: presupuesto.ubicacion,
    detalle: presupuesto.detalle,
    validezDias: presupuesto.validezDias,
    formaPago: presupuesto.formaPago,
    estado: presupuesto.estado,
    notas: presupuesto.notas ?? '',
  });

  const [items, setItems] = useState<PresupuestoItem[]>(
    presupuesto.items?.length
      ? presupuesto.items
      : [{ descripcion: '', manoDeObra: 0, materiales: 0 }]
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalManoDeObra = items.reduce((acc, i) => acc + (Number(i.manoDeObra) || 0), 0);
  const totalMateriales = items.reduce((acc, i) => acc + (Number(i.materiales) || 0), 0);
  const total = totalManoDeObra + totalMateriales;

  function setField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setItem(index: number, field: keyof PresupuestoItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  function addItem() {
    setItems((prev) => [...prev, { descripcion: '', manoDeObra: 0, materiales: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch(`/api/presupuestos/${presupuesto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            ...item,
            manoDeObra: Number(item.manoDeObra),
            materiales: Number(item.materiales),
          })),
          validezDias: Number(form.validezDias),
        }),
      });

      if (res.ok) {
        router.push(`/admin/${presupuesto.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        setErrors(data.errors ?? [data.error ?? 'Error al guardar']);
      }
    } catch {
      setErrors(['Error de conexión. Intente nuevamente.']);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1C3E]">
          Editar Presupuesto N° {String(presupuesto.numero).padStart(4, '0')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Modificá los datos del presupuesto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium mb-1">Corregí los siguientes errores:</p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((e, i) => <li key={i} className="text-red-600 text-sm">{e}</li>)}
            </ul>
          </div>
        )}

        {/* Fecha */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha *</label>
          <input type="date" required value={form.fecha} onChange={(e) => setField('fecha', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente *</label>
          <input type="text" required minLength={2} maxLength={100}
            value={form.cliente} onChange={(e) => setField('cliente', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación *</label>
          <input type="text" required minLength={3} maxLength={200}
            value={form.ubicacion} onChange={(e) => setField('ubicacion', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
        </div>

        {/* Detalle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción general *</label>
          <textarea required minLength={5} maxLength={2000} rows={3}
            value={form.detalle} onChange={(e) => setField('detalle', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent resize-y" />
        </div>

        {/* ÍTEMS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">Ítems *</label>
            <button type="button" onClick={addItem}
              className="text-sm text-[#FF9000] hover:text-[#e68000] font-semibold transition-colors">
              + Agregar ítem
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#FF9000] uppercase tracking-wide">Ítem {index + 1}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción *</label>
                  <input type="text" required maxLength={300}
                    value={item.descripcion}
                    onChange={(e) => setItem(index, 'descripcion', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mano de obra</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="number" min={0} step="0.01"
                        value={item.manoDeObra || ''}
                        onChange={(e) => setItem(index, 'manoDeObra', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Materiales</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input type="number" min={0} step="0.01"
                        value={item.materiales || ''}
                        onChange={(e) => setItem(index, 'materiales', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-400">Subtotal: </span>
                  <span className="text-xs font-semibold text-[#0B1C3E]">
                    $ {formatCurrency((Number(item.manoDeObra) || 0) + (Number(item.materiales) || 0))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm">
              <span className="text-gray-500">Total mano de obra</span>
              <span className="font-medium text-[#0B1C3E]">$ {formatCurrency(totalManoDeObra)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm">
              <span className="text-gray-500">Total materiales</span>
              <span className="font-medium text-[#0B1C3E]">$ {formatCurrency(totalMateriales)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-[#FF9000]">
              <span className="text-white font-bold text-sm uppercase tracking-wide">TOTAL</span>
              <span className="text-white font-bold text-xl">$ {formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Condiciones */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Validez *</label>
            <select required value={form.validezDias} onChange={(e) => setField('validezDias', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white">
              {VALIDEZ_OPCIONES.map((d) => <option key={d} value={d}>{d} días</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Forma de pago *</label>
            <select required value={form.formaPago} onChange={(e) => setField('formaPago', e.target.value as FormaPago)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white">
              {FORMAS_PAGO.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
          <select value={form.estado} onChange={(e) => setField('estado', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white">
            <option value="borrador">Borrador</option>
            <option value="enviado">Enviado</option>
            <option value="aceptado">Aceptado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Notas internas <span className="font-normal text-gray-400">(no se imprimen)</span>
          </label>
          <textarea maxLength={500} rows={2}
            value={form.notas} onChange={(e) => setField('notas', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent resize-y" />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-[#0B1C3E] hover:bg-[#162d5e] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

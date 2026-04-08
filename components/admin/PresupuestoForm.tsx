'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { FormaPago, PresupuestoItem, TipoItem } from '@/types/presupuesto';

const FORMAS_PAGO: FormaPago[] = [
  'Efectivo',
  'Transferencia bancaria',
  'Cheque',
  '50% anticipo / 50% al finalizar',
  'A convenir',
];

const VALIDEZ_OPCIONES = [7, 15, 30, 60, 90];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

const TIPOS_ITEM: { value: TipoItem; label: string }[] = [
  { value: 'material', label: 'Material' },
  { value: 'mano_de_obra', label: 'Mano de obra' },
  { value: 'ambos', label: 'Ambos' },
];

const ITEM_VACIO: PresupuestoItem = { descripcion: '', tipo: 'ambos', manoDeObra: 0, materiales: 0 };

export default function PresupuestoForm() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    fecha: today,
    cliente: '',
    ubicacion: '',
    detalle: '',
    plazoRealizacion: '',
    validezDias: 30,
    formaPago: 'Transferencia bancaria' as FormaPago,
    estado: 'borrador' as const,
    notas: '',
  });

  const [items, setItems] = useState<PresupuestoItem[]>([{ ...ITEM_VACIO }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalManoDeObra = items.reduce((acc, i) => acc + (Number(i.manoDeObra) || 0), 0);
  const totalMateriales = items.reduce((acc, i) => acc + (Number(i.materiales) || 0), 0);
  const total = totalManoDeObra + totalMateriales;

  function setField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setItem(index: number, field: keyof PresupuestoItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const updated = { ...item, [field]: value };
      if (field === 'tipo') {
        if (value === 'material') updated.manoDeObra = 0;
        if (value === 'mano_de_obra') updated.materiales = 0;
      }
      return updated;
    }));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...ITEM_VACIO }]);
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
      const res = await fetch('/api/presupuestos', {
        method: 'POST',
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
        const data = await res.json();
        router.push(`/admin/${data.id}`);
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
        <h1 className="text-2xl font-bold text-[#0B1C3E]">Nuevo Presupuesto</h1>
        <p className="text-gray-500 text-sm mt-1">Completá los datos del presupuesto para el cliente.</p>
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
          <input type="text" required minLength={2} maxLength={100} placeholder="Nombre del cliente o empresa"
            value={form.cliente} onChange={(e) => setField('cliente', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación *</label>
          <input type="text" required minLength={3} maxLength={200} placeholder="Dirección / localidad de la obra"
            value={form.ubicacion} onChange={(e) => setField('ubicacion', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
        </div>

        {/* Detalle general */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción general del trabajo *</label>
          <textarea required minLength={5} maxLength={2000} rows={3}
            placeholder="Describa el trabajo a realizar..."
            value={form.detalle} onChange={(e) => setField('detalle', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent resize-y" />
        </div>

        {/* ─── ÍTEMS ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">Ítems del presupuesto *</label>
            <button type="button" onClick={addItem}
              className="text-sm text-[#FF9000] hover:text-[#e68000] font-semibold flex items-center gap-1 transition-colors">
              + Agregar ítem
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                {/* Número de ítem */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#FF9000] uppercase tracking-wide">
                    Ítem {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
                      Eliminar
                    </button>
                  )}
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción *</label>
                  <textarea required maxLength={600} rows={2}
                    placeholder="Descripción del ítem (Enter para nueva línea)"
                    value={item.descripcion}
                    onChange={(e) => setItem(index, 'descripcion', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white resize-y" />
                </div>

                {/* Tipo de ítem */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
                  <div className="flex gap-2">
                    {TIPOS_ITEM.map((t) => (
                      <button key={t.value} type="button"
                        onClick={() => setItem(index, 'tipo', t.value)}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                          (item.tipo ?? 'ambos') === t.value
                            ? 'bg-[#0B1C3E] text-white border-[#0B1C3E]'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-secondary'
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mano de obra + Materiales (según tipo) */}
                <div className={`grid gap-3 ${(item.tipo ?? 'ambos') === 'ambos' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {(item.tipo ?? 'ambos') !== 'material' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Mano de obra</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" min={0} step="0.01" placeholder="0"
                          value={item.manoDeObra || ''}
                          onChange={(e) => setItem(index, 'manoDeObra', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white" />
                      </div>
                    </div>
                  )}
                  {(item.tipo ?? 'ambos') !== 'mano_de_obra' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Materiales</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" min={0} step="0.01" placeholder="0"
                          value={item.materiales || ''}
                          onChange={(e) => setItem(index, 'materiales', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent bg-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtotal del ítem */}
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-400">Subtotal: </span>
                  <span className="text-xs font-semibold text-[#0B1C3E]">
                    $ {formatCurrency((Number(item.manoDeObra) || 0) + (Number(item.materiales) || 0))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de totales */}
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

        {/* Plazo de realización */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Plazo de realización <span className="font-normal text-gray-400">(opcional)</span></label>
          <input type="text" maxLength={150} placeholder="Ej: 5 días hábiles, 2 semanas"
            value={form.plazoRealizacion} onChange={(e) => setField('plazoRealizacion', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:border-transparent" />
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
          <textarea maxLength={500} rows={2} placeholder="Notas solo visibles en el panel..."
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
            {loading ? 'Guardando...' : 'Guardar presupuesto'}
          </button>
        </div>
      </form>
    </div>
  );
}

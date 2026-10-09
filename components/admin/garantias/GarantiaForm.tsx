'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react';
import { ArrowLeft, ShieldCheck, Save } from 'lucide-react';
import type { Garantia, GarantiaInput, GarantiaPrefill } from '@/types/garantia';
import type { TipoGarantia } from '@/types/tipo-garantia';
import {
  ANIOS_GARANTIA_MAX,
  SUPERFICIE_M2_MAX,
  LUGAR_EMISION_POR_DEFECTO,
  esFechaValida,
  formatNumeroDoc,
  sumarAnios,
  validarGarantiaInput,
} from '@/lib/garantia-logic';
import { formatFechaDDMMYYYY } from '@/lib/format-fecha';
import FirmaInput from './FirmaInput';
import {
  apiRequest,
  ErrorList,
  ExclusionesEditor,
  Field,
  FormSection,
  inputClass,
  placeholderHelp,
  primaryButton,
  secondaryButton,
  TextArea,
} from './ui';

export interface GarantiaFormOptions {
  tipos: TipoGarantia[];
  presupuestos: { id: string; numero: number; cliente: string }[];
  cuentas: { id: string; cliente: string; concepto: string }[];
  firmaEmpresa: string | null;
  fechaHoy: string;
}

type FormState = Omit<GarantiaInput, 'aniosGarantia' | 'superficieM2'> & {
  aniosGarantia: string;
  superficieM2: string;
};
type Origen = 'suelto' | 'presupuesto' | 'cuenta';

export default function GarantiaForm({
  tipos,
  presupuestos,
  cuentas,
  firmaEmpresa,
  fechaHoy,
  garantia,
  presupuestoId,
  cuentaReciboId,
}: GarantiaFormOptions & { garantia?: Garantia; presupuestoId?: string; cuentaReciboId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    garantia
      ? {
          ...garantia,
          aniosGarantia: String(garantia.aniosGarantia),
          superficieM2: garantia.superficieM2?.toString() ?? '',
        }
      : {
          presupuestoId,
          cuentaReciboId: presupuestoId ? undefined : cuentaReciboId,
          cliente: '',
          domicilioObra: '',
          trabajosRealizados: '',
          trabajosGarantizados: '',
          aniosGarantia: '',
          superficieM2: '',
          alcance: '',
          exclusiones: [],
          fechaFinalizacion: '',
          vigenciaDesde: '',
          lugarEmision: LUGAR_EMISION_POR_DEFECTO,
          fechaEmision: fechaHoy,
          incluirFirmaEmpresa: false,
        }
  );
  const [origen, setOrigen] = useState<Origen>(() =>
    garantia?.presupuestoId || presupuestoId
      ? 'presupuesto'
      : garantia?.cuentaReciboId || cuentaReciboId
        ? 'cuenta'
        : 'suelto'
  );
  const initialLinked = Boolean(form.presupuestoId || form.cuentaReciboId);
  const [prefillLoading, setPrefillLoading] = useState(initialLinked);
  const [prefillError, setPrefillError] = useState('');
  const [resumen, setResumen] = useState<GarantiaPrefill['resumenPagos'] | null>(null);
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);
  const [processingFirma, setProcessingFirma] = useState(false);
  const [refreshingOptions, startRefresh] = useTransition();
  const [errors, setErrors] = useState<string[]>([]);
  const errorsRef = useRef<HTMLDivElement>(null);
  const savingRef = useRef(false);
  const prefillVersion = useRef(0);
  // En edición, consultar pagos no debe reemplazar los datos personalizados del certificado.
  const copyPrefill = useRef(!garantia);
  const selectedId =
    origen === 'presupuesto'
      ? form.presupuestoId
      : origen === 'cuenta'
        ? form.cuentaReciboId
        : undefined;

  useEffect(() => {
    if (!selectedId || origen === 'suelto') return;
    const controller = new AbortController();
    const version = ++prefillVersion.current;
    const query = new URLSearchParams({
      [origen === 'presupuesto' ? 'presupuestoId' : 'cuentaReciboId']: selectedId,
    });
    apiRequest<GarantiaPrefill>(`/api/garantias/prefill?${query}`, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted || version !== prefillVersion.current) return;
        if (copyPrefill.current)
          setForm((current) => ({
            ...current,
            cliente: data.cliente,
            domicilioObra: data.domicilioObra,
            trabajosRealizados: data.trabajosRealizados,
          }));
        setResumen(data.resumenPagos);
      })
      .catch((error) => {
        if (!controller.signal.aborted && version === prefillVersion.current)
          setPrefillError(
            error instanceof Error ? error.message : 'No se pudieron precargar los datos.'
          );
      })
      .finally(() => {
        if (!controller.signal.aborted && version === prefillVersion.current)
          setPrefillLoading(false);
      });
    return () => controller.abort();
  }, [selectedId, origen, retry]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectOrigin(next: Origen, id?: string) {
    prefillVersion.current++;
    copyPrefill.current = true;
    setOrigen(next);
    setResumen(null);
    setPrefillError('');
    setPrefillLoading(Boolean(id));
    setForm((current) => ({
      ...current,
      presupuestoId: next === 'presupuesto' ? id : undefined,
      cuentaReciboId: next === 'cuenta' ? id : undefined,
      referenciaPresupuesto: next === 'presupuesto' ? '' : current.referenciaPresupuesto,
    }));
  }

  function selectType(id: string) {
    const tipo = tipos.find((item) => item.id === id);
    setForm((current) => ({
      ...current,
      tipoGarantiaId: id || undefined,
      ...(tipo
        ? {
            trabajosGarantizados: tipo.trabajosGarantizados,
            aniosGarantia: String(tipo.aniosPorDefecto),
            alcance: tipo.alcance,
            exclusiones: [...tipo.exclusiones],
          }
        : {}),
    }));
  }

  function showErrors(messages: string[]) {
    setErrors(messages);
    requestAnimationFrame(() => errorsRef.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current || prefillLoading || processingFirma) return;
    if (origen !== 'suelto' && !selectedId) {
      showErrors(['Seleccioná el presupuesto o la cuenta de origen.']);
      return;
    }
    if (prefillError) {
      showErrors(['No se pudo verificar el origen. Reintentá la precarga antes de guardar.']);
      return;
    }
    const validation = validarGarantiaInput(form);
    if (!validation.input) {
      showErrors(validation.errors);
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setErrors([]);
    try {
      const saved = await apiRequest<Garantia>(
        garantia ? `/api/garantias/${garantia.id}` : '/api/garantias',
        { method: garantia ? 'PUT' : 'POST', body: JSON.stringify(validation.input) }
      );
      router.push(`/admin/garantias/${saved.id}`);
      router.refresh();
    } catch (error) {
      showErrors(
        error instanceof Error ? error.message.split('\n') : ['No se pudo guardar el certificado.']
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  const years = Number(form.aniosGarantia);
  const until =
    esFechaValida(form.vigenciaDesde) &&
    Number.isInteger(years) &&
    years >= 1 &&
    years <= ANIOS_GARANTIA_MAX
      ? sumarAnios(form.vigenciaDesde, years)
      : '';
  const backHref = garantia ? `/admin/garantias/${garantia.id}` : '/admin/garantias';
  const currency = (n: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} />
        Volver {garantia ? 'al certificado' : 'a garantías'}
      </Link>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-primary">
          {garantia
            ? `Editar certificado N.º ${formatNumeroDoc(garantia.numero)}`
            : 'Nuevo certificado de garantía'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Completá los datos de la obra y las condiciones de cobertura. Los campos con * son
          obligatorios.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <fieldset disabled={saving} className="min-w-0 space-y-5">
          <FormSection
            title="Origen del certificado"
            description="Al elegir un presupuesto o una cuenta se copian cliente, domicilio y trabajos. Podés ajustarlos después."
          >
            <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <legend className="sr-only">Origen</legend>
              {(
                [
                  { value: 'presupuesto', label: 'Presupuesto' },
                  { value: 'cuenta', label: 'Cuenta de recibos' },
                  { value: 'suelto', label: 'Suelto' },
                ] as const
              ).map((item) => (
                <label
                  key={item.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${origen === item.value ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}
                >
                  <input
                    type="radio"
                    name="origen"
                    value={item.value}
                    checked={origen === item.value}
                    onChange={() => selectOrigin(item.value)}
                    className="accent-primary"
                  />
                  {item.label}
                </label>
              ))}
            </fieldset>
            {origen !== 'suelto' && (
              <div>
                <label htmlFor="garantia-origen" className="mb-1.5 block text-sm font-semibold">
                  {origen === 'presupuesto' ? 'Presupuesto' : 'Cuenta de recibos'} *
                </label>
                <select
                  id="garantia-origen"
                  required
                  className={inputClass}
                  value={selectedId ?? ''}
                  onChange={(event) => selectOrigin(origen, event.target.value || undefined)}
                >
                  <option value="">Seleccionar…</option>
                  {origen === 'presupuesto'
                    ? presupuestos.map((p) => (
                        <option key={p.id} value={p.id}>
                          N.º {formatNumeroDoc(p.numero)} — {p.cliente}
                        </option>
                      ))
                    : cuentas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cliente} — {c.concepto}
                        </option>
                      ))}
                  {selectedId &&
                    !(origen === 'presupuesto' ? presupuestos : cuentas).some(
                      (item) => item.id === selectedId
                    ) && <option value={selectedId}>Origen no disponible</option>}
                </select>
                {(origen === 'presupuesto' ? presupuestos : cuentas).length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    No hay {origen === 'presupuesto' ? 'presupuestos' : 'cuentas'} disponibles.
                    Podés emitir un certificado suelto.
                  </p>
                )}
              </div>
            )}
            {origen !== 'presupuesto' && (
              <Field
                label="Referencia de presupuesto (opcional)"
                value={form.referenciaPresupuesto ?? ''}
                onChange={(event) => update('referenciaPresupuesto', event.target.value)}
                placeholder="Ej. 0012 / presupuesto externo"
              />
            )}
            {prefillLoading && (
              <p role="status" className="text-sm text-gray-500">
                Cargando datos del origen…
              </p>
            )}
            {prefillError && (
              <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {prefillError}
                <button
                  type="button"
                  className="ml-2 font-semibold underline"
                  onClick={() => {
                    setPrefillLoading(true);
                    setPrefillError('');
                    setRetry((n) => n + 1);
                  }}
                >
                  Reintentar
                </button>
              </div>
            )}
            {resumen && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="mb-3 text-xs font-semibold text-gray-500">
                  Estado de pagos · informativo
                </p>
                <dl className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Total', resumen.total],
                    ['Entregado', resumen.entregado],
                    [
                      resumen.saldoPendiente < 0 ? 'Excedente' : 'Saldo pendiente',
                      Math.abs(resumen.saldoPendiente),
                    ],
                  ].map(([label, amount]) => (
                    <div key={label}>
                      <dt className="text-xs text-gray-500">{label}</dt>
                      <dd className="font-semibold tabular-nums text-primary">
                        {currency(Number(amount))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </FormSection>
          <fieldset disabled={prefillLoading} className="min-w-0 space-y-5">
            <FormSection title="Cliente y obra">
              <Field
                label="Cliente / razón social"
                required
                minLength={2}
                value={form.cliente}
                onChange={(e) => update('cliente', e.target.value)}
                autoComplete="name"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="DNI / CUIT"
                  value={form.clienteDocumento ?? ''}
                  onChange={(e) => update('clienteDocumento', e.target.value)}
                />
                <Field
                  label="Teléfono"
                  type="tel"
                  value={form.clienteTelefono ?? ''}
                  onChange={(e) => update('clienteTelefono', e.target.value)}
                />
              </div>
              <Field
                label="Domicilio de la obra"
                required
                minLength={3}
                value={form.domicilioObra}
                onChange={(e) => update('domicilioObra', e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Localidad"
                  value={form.localidad ?? ''}
                  onChange={(e) => update('localidad', e.target.value)}
                />
                <Field
                  label="Superficie aproximada (m²)"
                  type="number"
                  min="0.01"
                  max={SUPERFICIE_M2_MAX}
                  step="any"
                  value={form.superficieM2}
                  onChange={(e) => update('superficieM2', e.target.value)}
                />
              </div>
              <TextArea
                label="Trabajos realizados"
                required
                minLength={3}
                value={form.trabajosRealizados}
                onChange={(e) => update('trabajosRealizados', e.target.value)}
              />
              <TextArea
                label="Materiales / sistema aplicado"
                value={form.materialesSistema ?? ''}
                onChange={(e) => update('materialesSistema', e.target.value)}
              />
            </FormSection>
            <FormSection
              title="Cobertura de la garantía"
              description="La plantilla se copia al certificado. Cambiarla reemplaza los trabajos garantizados, el plazo, el alcance y las exclusiones de este formulario."
            >
              <div>
                <label htmlFor="garantia-tipo" className="mb-1.5 block text-sm font-semibold">
                  Tipo de garantía
                </label>
                <select
                  id="garantia-tipo"
                  className={inputClass}
                  value={form.tipoGarantiaId ?? ''}
                  onChange={(e) => selectType(e.target.value)}
                >
                  <option value="">Personalizada · completar manualmente</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                  {form.tipoGarantiaId && !tipos.some((t) => t.id === form.tipoGarantiaId) && (
                    <option value={form.tipoGarantiaId}>
                      Tipo eliminado · se conserva el contenido
                    </option>
                  )}
                </select>
                <Link
                  href="/admin/garantias/tipos"
                  target="_blank"
                  className="mt-2 inline-block text-xs font-semibold text-primary underline"
                >
                  Administrar tipos y firma de empresa (otra pestaña)
                </Link>
                <button
                  type="button"
                  disabled={refreshingOptions}
                  className="mt-2 block text-xs font-semibold text-primary underline disabled:opacity-50"
                  onClick={() => startRefresh(() => router.refresh())}
                >
                  {refreshingOptions
                    ? 'Actualizando…'
                    : 'Actualizar tipos y firma sin perder los datos'}
                </button>
              </div>
              <TextArea
                label="Trabajos garantizados"
                required
                minLength={3}
                rows={2}
                value={form.trabajosGarantizados}
                onChange={(e) => update('trabajosGarantizados', e.target.value)}
              />
              <Field
                label="Años de garantía"
                type="number"
                required
                min={1}
                max={ANIOS_GARANTIA_MAX}
                step={1}
                value={form.aniosGarantia}
                onChange={(e) => update('aniosGarantia', e.target.value)}
              />
              <TextArea
                label="Alcance de la garantía"
                required
                minLength={10}
                rows={5}
                value={form.alcance}
                onChange={(e) => update('alcance', e.target.value)}
                help={placeholderHelp}
              />
              <ExclusionesEditor
                value={form.exclusiones}
                onChange={(value) => update('exclusiones', value)}
              />
            </FormSection>
            <FormSection title="Fechas y vigencia">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Fecha de inicio de obra"
                  type="date"
                  max={form.fechaFinalizacion || undefined}
                  value={form.fechaInicio ?? ''}
                  onChange={(e) => update('fechaInicio', e.target.value)}
                />
                <Field
                  label="Fecha de finalización"
                  type="date"
                  required
                  min={form.fechaInicio || undefined}
                  value={form.fechaFinalizacion}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((current) => ({
                      ...current,
                      fechaFinalizacion: value,
                      vigenciaDesde:
                        !current.vigenciaDesde ||
                        current.vigenciaDesde === current.fechaFinalizacion
                          ? value
                          : current.vigenciaDesde,
                    }));
                  }}
                />
              </div>
              <div className="grid items-end gap-4 sm:grid-cols-2">
                <Field
                  label="Vigencia desde"
                  type="date"
                  required
                  value={form.vigenciaDesde}
                  onChange={(e) => update('vigenciaDesde', e.target.value)}
                />
                <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3" role="status">
                  <ShieldCheck size={24} className="shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Vigencia hasta</p>
                    <p className="font-semibold tabular-nums">
                      {until ? formatFechaDDMMYYYY(until) : 'Completá fecha y plazo'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Lugar de emisión"
                  required
                  minLength={2}
                  value={form.lugarEmision}
                  onChange={(e) => update('lugarEmision', e.target.value)}
                />
                <Field
                  label="Fecha de emisión"
                  type="date"
                  required
                  value={form.fechaEmision}
                  onChange={(e) => update('fechaEmision', e.target.value)}
                />
              </div>
              <TextArea
                label="Observaciones"
                value={form.observaciones ?? ''}
                onChange={(e) => update('observaciones', e.target.value)}
              />
            </FormSection>
            <FormSection
              title="Firmas"
              description="Podés incluir imágenes de las firmas o dejar los espacios para firmar en papel."
            >
              <label className="flex items-start gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  checked={form.incluirFirmaEmpresa}
                  disabled={!firmaEmpresa}
                  onChange={(e) => update('incluirFirmaEmpresa', e.target.checked)}
                />
                Incluir firma de la empresa
              </label>
              {!firmaEmpresa && (
                <p className="text-sm text-gray-500">
                  Todavía no hay una firma de empresa cargada. Podés agregarla en{' '}
                  <Link href="/admin/garantias/tipos" target="_blank" className="underline">
                    Tipos y firma
                  </Link>
                  .
                  {form.incluirFirmaEmpresa &&
                    ' Este certificado conservará la opción de incluirla cuando vuelva a estar disponible.'}
                </p>
              )}
              {firmaEmpresa && form.incluirFirmaEmpresa && (
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Imagen de firma local. */}
                  <img
                    src={firmaEmpresa}
                    alt="Firma de la empresa"
                    className="h-24 max-w-full object-contain"
                  />
                </div>
              )}
              <FirmaInput
                label="Firma del cliente"
                value={form.firmaClienteDataUrl}
                onChange={(value) => update('firmaClienteDataUrl', value)}
                onProcessingChange={setProcessingFirma}
                disabled={saving}
              />
            </FormSection>
          </fieldset>
        </fieldset>
        <div ref={errorsRef} tabIndex={-1}>
          <ErrorList errors={errors} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-5">
          <Link href={backHref} className={secondaryButton}>
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || prefillLoading || processingFirma || Boolean(prefillError)}
            className={primaryButton}
          >
            <Save size={17} />
            {saving ? 'Guardando…' : garantia ? 'Guardar cambios' : 'Emitir certificado'}
          </button>
        </div>
      </form>
    </div>
  );
}

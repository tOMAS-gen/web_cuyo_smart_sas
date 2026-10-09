'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { TipoGarantia, TipoGarantiaInput } from '@/types/tipo-garantia';
import { ANIOS_GARANTIA_MAX, validarTipoGarantiaInput } from '@/lib/garantia-logic';
import ConfirmModal from '@/components/admin/ConfirmModal';
import FirmaInput from './FirmaInput';
import {
  apiRequest,
  ErrorList,
  ExclusionesEditor,
  Field,
  FormSection,
  placeholderHelp,
  primaryButton,
  secondaryButton,
  TextArea,
} from './ui';

type TipoDraft = Omit<TipoGarantiaInput, 'aniosPorDefecto'> & {
  aniosPorDefecto: string;
  id?: string;
};
const emptyDraft = (): TipoDraft => ({
  nombre: '',
  trabajosGarantizados: '',
  aniosPorDefecto: '',
  alcance: '',
  exclusiones: [],
});

function TipoEditor({
  tipo,
  onSaved,
  onCancel,
}: {
  tipo: TipoDraft;
  onSaved: (tipo: TipoGarantia) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(tipo);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  function showErrors(value: string[]) {
    setErrors(value);
    requestAnimationFrame(() => errorRef.current?.focus());
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    const valid = validarTipoGarantiaInput(draft);
    if (!valid.input) {
      showErrors(valid.errors);
      return;
    }
    pending.current = true;
    setBusy(true);
    setErrors([]);
    try {
      onSaved(
        await apiRequest<TipoGarantia>(
          tipo.id ? `/api/tipos-garantia/${tipo.id}` : '/api/tipos-garantia',
          { method: tipo.id ? 'PUT' : 'POST', body: JSON.stringify(valid.input) }
        )
      );
    } catch (error) {
      showErrors(
        error instanceof Error ? error.message.split('\n') : ['No se pudo guardar el tipo.']
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="rounded-2xl border border-primary/20 bg-white p-5 sm:p-6">
      <h2 className="mb-5 text-lg font-bold">
        {tipo.id ? 'Editar tipo de garantía' : 'Nuevo tipo de garantía'}
      </h2>
      <fieldset disabled={busy} className="space-y-4">
        <Field
          label="Nombre del tipo"
          autoFocus
          required
          minLength={2}
          value={draft.nombre}
          onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
        />
        <TextArea
          label="Trabajos garantizados"
          required
          minLength={3}
          value={draft.trabajosGarantizados}
          onChange={(e) => setDraft({ ...draft, trabajosGarantizados: e.target.value })}
        />
        <Field
          label="Años por defecto"
          required
          type="number"
          min={1}
          max={ANIOS_GARANTIA_MAX}
          step={1}
          value={draft.aniosPorDefecto}
          onChange={(e) => setDraft({ ...draft, aniosPorDefecto: e.target.value })}
        />
        <TextArea
          label="Alcance"
          required
          minLength={10}
          rows={5}
          value={draft.alcance}
          help={placeholderHelp}
          onChange={(e) => setDraft({ ...draft, alcance: e.target.value })}
        />
        <ExclusionesEditor
          value={draft.exclusiones}
          onChange={(exclusiones) => setDraft({ ...draft, exclusiones })}
        />
        <div ref={errorRef} tabIndex={-1}>
          <ErrorList errors={errors} />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className={secondaryButton} onClick={onCancel}>
            Cancelar
          </button>
          <button className={primaryButton} type="submit">
            {busy ? 'Guardando…' : 'Guardar tipo'}
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function FirmaEmpresaSettings({ initialFirma }: { initialFirma: string | null }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialFirma);
  const [draft, setDraft] = useState<string | undefined>(initialFirma ?? undefined);
  const [busy, setBusy] = useState(false);
  const [processingFirma, setProcessingFirma] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const pending = useRef(false);
  async function persist(remove = false) {
    if (pending.current || processingFirma || (!remove && !draft)) return;
    pending.current = true;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await apiRequest('/api/garantias/firma-empresa', {
        method: remove ? 'DELETE' : 'PUT',
        ...(remove ? {} : { body: JSON.stringify({ dataUrl: draft }) }),
      });
      setSaved(remove ? null : draft!);
      if (remove) setDraft(undefined);
      setRemoveOpen(false);
      setStatus(remove ? 'Firma de la empresa eliminada.' : 'Firma de la empresa guardada.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la firma.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <FormSection
      title="Firma de la empresa"
      description="La firma es compartida. Si la cambiás o eliminás, se actualizará en los certificados que la usan. Los que tienen una firma propia conservarán esa firma."
    >
      <FirmaInput
        label="Firma de Cuyo Smart S.A.S."
        value={draft}
        disabled={busy}
        onProcessingChange={setProcessingFirma}
        onChange={(value) => {
          setDraft(value);
          setStatus('');
          setError('');
        }}
      />
      {error && !removeOpen && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {status && (
        <p role="status" className="text-sm text-green-700">
          {status}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || processingFirma || !draft || draft === saved}
          className={primaryButton}
          onClick={() => void persist()}
        >
          {busy ? 'Guardando…' : 'Guardar firma de empresa'}
        </button>
        {saved && (
          <button
            type="button"
            disabled={busy || processingFirma}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
            onClick={() => {
              setRemoveOpen(true);
              setError('');
            }}
          >
            Eliminar firma guardada
          </button>
        )}
      </div>
      {!draft && saved && (
        <p className="text-xs text-gray-500">
          La firma guardada sigue vigente hasta que confirmes su eliminación o guardes una nueva.
        </p>
      )}
      <ConfirmModal
        open={removeOpen}
        title="¿Eliminar la firma de la empresa?"
        busy={busy}
        description="Dejará de aparecer en los certificados que usan la firma compartida. Las firmas propias de cada certificado y los espacios para firmar en papel se conservarán."
        confirmLabel={busy ? 'Eliminando…' : 'Eliminar firma'}
        error={error}
        onConfirm={() => void persist(true)}
        onCancel={() => {
          if (!pending.current) setRemoveOpen(false);
        }}
      />
    </FormSection>
  );
}

export default function GarantiaSettings({
  initialTipos,
  firmaEmpresa,
}: {
  initialTipos: TipoGarantia[];
  firmaEmpresa: string | null;
}) {
  const router = useRouter();
  const [tipos, setTipos] = useState(initialTipos);
  const [editing, setEditing] = useState<TipoDraft | null>(null);
  const [deleting, setDeleting] = useState<TipoGarantia | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const pending = useRef(false);
  const editorRef = useRef<HTMLDivElement>(null);
  function edit(tipo: TipoDraft) {
    setEditing(tipo);
    setStatus('');
    requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ block: 'start' });
    });
  }
  async function remove() {
    if (!deleting || pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/tipos-garantia/${deleting.id}`, { method: 'DELETE' });
      setTipos((items) => items.filter((item) => item.id !== deleting.id));
      setDeleting(null);
      setStatus('Tipo eliminado. Los certificados emitidos conservan su contenido.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el tipo.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Catálogo de garantías</h2>
            <p className="mt-1 text-sm text-gray-500">
              Los cambios en las plantillas no modifican certificados ya emitidos.
            </p>
          </div>
          <button
            type="button"
            className={primaryButton}
            disabled={Boolean(editing)}
            onClick={() => edit(emptyDraft())}
          >
            <Plus size={17} />
            Nuevo tipo
          </button>
        </div>
        {status && (
          <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
            {status}
          </p>
        )}
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {tipos.map((tipo) => (
            <li key={tipo.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row">
              <div className="min-w-0">
                <h3 className="font-bold text-primary">
                  {tipo.nombre}{' '}
                  <span className="ml-2 whitespace-nowrap text-sm font-medium text-gray-500">
                    {tipo.aniosPorDefecto} {tipo.aniosPorDefecto === 1 ? 'año' : 'años'}
                  </span>
                </h3>
                <p className="mt-1 break-words text-sm text-gray-500">
                  {tipo.trabajosGarantizados}
                </p>
                <p className="mt-2 text-xs text-gray-400">{tipo.exclusiones.length} exclusiones</p>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                <button
                  type="button"
                  disabled={Boolean(editing)}
                  className={secondaryButton}
                  aria-label={`Editar ${tipo.nombre}`}
                  onClick={() => edit({ ...tipo, aniosPorDefecto: String(tipo.aniosPorDefecto) })}
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  type="button"
                  disabled={Boolean(editing)}
                  className="rounded-xl p-3 text-red-700 hover:bg-red-50 disabled:opacity-40"
                  aria-label={`Eliminar ${tipo.nombre}`}
                  onClick={() => {
                    setDeleting(tipo);
                    setError(null);
                  }}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!tipos.length && (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No hay tipos de garantía. Creá una plantilla para reutilizar sus condiciones.
          </p>
        )}
        <div ref={editorRef} className="mt-5 scroll-mt-6">
          {editing && (
            <TipoEditor
              key={editing.id ?? 'new'}
              tipo={editing}
              onCancel={() => setEditing(null)}
              onSaved={(tipo) => {
                setTipos((items) =>
                  [...items.filter((item) => item.id !== tipo.id), tipo].sort((a, b) =>
                    a.nombre.localeCompare(b.nombre, 'es')
                  )
                );
                setEditing(null);
                setStatus('Tipo de garantía guardado.');
                router.refresh();
              }}
            />
          )}
        </div>
        <ConfirmModal
          open={Boolean(deleting)}
          title="¿Eliminar este tipo de garantía?"
          busy={busy}
          description={`Se eliminará «${deleting?.nombre ?? ''}» del catálogo. Los certificados emitidos conservarán sus textos y plazos.`}
          confirmLabel={busy ? 'Eliminando…' : 'Eliminar tipo'}
          error={error}
          onConfirm={remove}
          onCancel={() => {
            if (!pending.current) setDeleting(null);
          }}
        />
      </section>
      <FirmaEmpresaSettings initialFirma={firmaEmpresa} />
    </div>
  );
}

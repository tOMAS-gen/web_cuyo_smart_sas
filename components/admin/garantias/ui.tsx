import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const inputClass =
  'w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-primary focus:border-secondary disabled:bg-gray-100 disabled:text-gray-500';
export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed';
export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {props.required && ' *'}
      </label>
      <input id={id} className={inputClass} {...props} />
    </div>
  );
}

export function TextArea({
  label,
  help,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; help?: string }) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {props.required && ' *'}
      </label>
      <textarea
        id={id}
        rows={3}
        className={inputClass}
        aria-describedby={help ? `${id}-help` : undefined}
        {...props}
      />
      {help && (
        <p id={`${id}-help`} className="mt-1 text-xs leading-relaxed text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <p className="font-semibold">Revisá estos datos para continuar:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export const placeholderHelp =
  'Podés usar {anios}, {anios_letras}, {anios_texto}, {presupuesto} y {presupuesto_ref}. Se completan al emitir. Separá los párrafos con una línea en blanco.';

export function ExclusionesEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-gray-700">Exclusiones</legend>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <textarea
              rows={2}
              aria-label={`Exclusión ${index + 1}`}
              className={inputClass}
              value={item}
              onChange={(event) =>
                onChange(value.map((text, i) => (i === index ? event.target.value : text)))
              }
            />
            <button
              type="button"
              className="rounded-lg p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-700"
              aria-label={`Quitar exclusión ${index + 1}`}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        onClick={() => onChange([...value, ''])}
      >
        <Plus size={16} />
        Agregar exclusión
      </button>
    </fieldset>
  );
}

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401)
      throw new Error(
        'La sesión venció. Iniciá sesión en otra pestaña y volvé a intentar para conservar lo que completaste.'
      );
    throw new Error(
      data?.errors?.join('\n') ||
        data?.error ||
        'No se pudo completar la operación. Intentá nuevamente.'
    );
  }
  if (!data) throw new Error('La respuesta del servidor no es válida. Intentá nuevamente.');
  return data as T;
}

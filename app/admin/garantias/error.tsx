'use client';

export default function GarantiasError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div role="alert" className="rounded-2xl border border-red-200 bg-white p-6">
        <h1 className="text-lg font-bold">No se pudieron cargar las garantías</h1>
        <p className="mt-2 text-sm text-gray-500">Intentá nuevamente para recuperar los datos.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

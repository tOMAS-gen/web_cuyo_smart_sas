'use client';

import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { Pencil, Upload, X } from 'lucide-react';
import { validarFirmaDataUrl } from '@/lib/garantia-logic';
import { secondaryButton } from './ui';

// Rasterizamos tanto archivos como trazos: máximo 600 px y formato validado por la API.
function exportarFirma(source: HTMLCanvasElement | HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const scale = Math.min(1, 600 / width, 300 / height);
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la firma en este navegador.');
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  // Recortar el papel vacío evita firmas diminutas al usar una foto o un trazo corto.
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width,
    top = canvas.height,
    right = -1,
    bottom = -1;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (pixels[i + 3] > 20 && Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 240) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left) throw new Error('La imagen está vacía. Dibujá o subí una firma visible.');
  const cropped = document.createElement('canvas');
  cropped.width = right - left + 17;
  cropped.height = bottom - top + 17;
  const croppedContext = cropped.getContext('2d');
  if (!croppedContext) throw new Error('No se pudo procesar la firma.');
  croppedContext.drawImage(
    canvas,
    left,
    top,
    right - left + 1,
    bottom - top + 1,
    8,
    8,
    right - left + 1,
    bottom - top + 1
  );
  canvas.width = cropped.width;
  canvas.height = cropped.height;
  ctx.drawImage(cropped, 0, 0);
  let result = canvas.toDataURL('image/png');
  if (validarFirmaDataUrl(result)) {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    result = canvas.toDataURL('image/jpeg', 0.8);
  }
  const error = validarFirmaDataUrl(result);
  if (error) throw new Error(error);
  return result;
}

export default function FirmaInput({
  label,
  value,
  onChange,
  onProcessingChange,
  disabled = false,
}: {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  onProcessingChange?: (processing: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const uploadVersion = useRef(0);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      uploadVersion.current++;
    },
    []
  );

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) * 600) / box.width,
      y: ((event.clientY - box.top) * 200) / box.height,
    };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (
      disabled ||
      pointer.current !== null ||
      (event.pointerType === 'mouse' && event.button !== 0)
    )
      return;
    const ctx = event.currentTarget.getContext('2d');
    if (!ctx) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointer.current = event.pointerId;
    const { x, y } = point(event);
    ctx.strokeStyle = '#152642';
    ctx.fillStyle = '#152642';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(x, y, 1.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasInk(true);
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current !== event.pointerId) return;
    const ctx = event.currentTarget.getContext('2d');
    const { x, y } = point(event);
    ctx?.lineTo(x, y);
    ctx?.stroke();
  }

  function stop(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  async function upload(file?: File) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Elegí una imagen PNG, JPG o WEBP.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Elegí una imagen de menos de 20 MB.');
      return;
    }
    setLoading(true);
    onProcessingChange?.(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const result = exportarFirma(image);
      if (version === uploadVersion.current) {
        onChange(result);
        setDrawing(false);
      }
    } catch (err) {
      if (version === uploadVersion.current)
        setError(err instanceof Error ? err.message : 'No se pudo leer la imagen.');
    } finally {
      URL.revokeObjectURL(url);
      if (version === uploadVersion.current) {
        setLoading(false);
        onProcessingChange?.(false);
      }
    }
  }

  return (
    <fieldset disabled={disabled || loading} className="min-w-0 space-y-3">
      <legend className="mb-2 text-sm font-semibold text-gray-700">{label}</legend>
      {value && !drawing && (
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- Firma local en data URL, sin optimización remota. */}
          <img src={value} alt={label} className="mx-auto h-28 max-w-full object-contain" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label
          className={`${secondaryButton} relative cursor-pointer focus-within:outline-2 focus-within:outline-secondary`}
        >
          <Upload size={16} />
          {loading ? 'Procesando…' : 'Subir imagen'}
          <input
            id={id}
            aria-label={`Subir ${label.toLowerCase()}`}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="absolute inset-0 w-full cursor-pointer opacity-0"
            onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
        <button
          type="button"
          className={secondaryButton}
          onClick={() => {
            setDrawing(true);
            setHasInk(false);
            setError('');
            canvasRef.current?.getContext('2d')?.clearRect(0, 0, 600, 200);
          }}
        >
          <Pencil size={16} />
          Dibujar
        </button>
        {value && (
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 text-sm text-red-700"
            onClick={() => {
              onChange(undefined);
              setDrawing(false);
            }}
          >
            <X size={16} />
            Quitar firma
          </button>
        )}
      </div>
      {drawing && (
        <div className="space-y-3">
          <p id={`${id}-help`} className="text-xs text-gray-500">
            Dibujá con el mouse o el dedo y elegí «Usar firma». También podés subir una imagen.
          </p>
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            aria-label={`Dibujar ${label.toLowerCase()}`}
            aria-describedby={`${id}-help`}
            className="block w-full touch-none rounded-xl border border-dashed border-gray-400 bg-white"
            style={{ aspectRatio: '3 / 1' }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerCancel={stop}
            onLostPointerCapture={() => {
              pointer.current = null;
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!hasInk}
              className={secondaryButton}
              onClick={() => {
                try {
                  if (canvasRef.current) {
                    onChange(exportarFirma(canvasRef.current));
                    setDrawing(false);
                    setError('');
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'No se pudo procesar la firma.');
                }
              }}
            >
              Usar firma
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                canvasRef.current?.getContext('2d')?.clearRect(0, 0, 600, 200);
                setHasInk(false);
              }}
            >
              Limpiar trazos
            </button>
            <button
              type="button"
              className="px-2 text-sm text-gray-500"
              onClick={() => setDrawing(false)}
            >
              Cancelar dibujo
            </button>
          </div>
        </div>
      )}
      {!value && !drawing && (
        <p className="text-xs text-gray-500">
          Opcional. El certificado siempre incluye espacio para firmar en papel.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}

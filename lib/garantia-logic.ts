// Lógica pura de los certificados de garantía: validación, cálculo de vigencia,
// textos del documento y precarga desde presupuesto/cuenta. Sin `fs` ni DOM:
// la usan tanto las rutas de la API como los formularios del cliente, y se
// verifica con `npm run verify:logic`.

import { enteroALetras } from './numero-a-letras';
import type { Garantia, GarantiaDatos, GarantiaInput, GarantiaPrefill } from '@/types/garantia';
import type { TipoGarantiaInput } from '@/types/tipo-garantia';
import type { Presupuesto } from '@/types/presupuesto';
import type { CuentaRecibo, ResumenCuentaRecibo } from '@/types/cuenta-recibo';
import type { ResumenPresupuesto } from '@/types/recibo';

export const ANIOS_GARANTIA_MAX = 50;
export const SUPERFICIE_M2_MAX = 1_000_000;
/** Tamaño máximo (en bytes decodificados) de una imagen de firma. */
export const FIRMA_MAX_BYTES = 300 * 1024;
export const LUGAR_EMISION_POR_DEFECTO = 'Mendoza';

// ---------------------------------------------------------------------------
// Fechas "solo fecha" (YYYY-MM-DD). Igual que lib/format-fecha.ts, nunca se
// construye un `Date` desde el string para no correr el día por timezone.
// ---------------------------------------------------------------------------

const FECHA_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function esBisiesto(anio: number): boolean {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
}

function diasDelMes(anio: number, mes: number): number {
  if (mes === 2) return esBisiesto(anio) ? 29 : 28;
  return [4, 6, 9, 11].includes(mes) ? 30 : 31;
}

export function esFechaValida(iso: unknown): iso is string {
  if (typeof iso !== 'string') return false;
  const m = FECHA_RE.exec(iso);
  if (!m) return false;
  const anio = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  return mes >= 1 && mes <= 12 && dia >= 1 && dia <= diasDelMes(anio, mes);
}

/** Suma `n` años a una fecha YYYY-MM-DD. El 29/02 cae en 28/02 si el año destino no es bisiesto. */
export function sumarAnios(iso: string, n: number): string {
  const [anio, mes, dia] = iso.split('T')[0].split('-').map(Number);
  const anioDestino = anio + n;
  const diaDestino = Math.min(dia, diasDelMes(anioDestino, mes));
  return `${anioDestino}-${String(mes).padStart(2, '0')}-${String(diaDestino).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Textos del documento
// ---------------------------------------------------------------------------

/** 10 -> "DIEZ (10) AÑOS", 1 -> "UN (1) AÑO". */
export function aniosEnTexto(anios: number): string {
  return `${enteroALetras(anios).toUpperCase()} (${anios}) ${anios === 1 ? 'AÑO' : 'AÑOS'}`;
}

export function formatNumeroDoc(numero: number): string {
  return String(numero).padStart(4, '0');
}

type RefPresupuesto = Pick<Garantia, 'presupuestoNumero' | 'referenciaPresupuesto'>;

/** Número de presupuesto a mostrar: el vinculado (0012), la referencia libre, o null. */
export function numeroPresupuestoTexto(g: RefPresupuesto): string | null {
  if (g.presupuestoNumero !== undefined) return formatNumeroDoc(g.presupuestoNumero);
  return g.referenciaPresupuesto?.trim() || null;
}

/**
 * Reemplaza los placeholders admitidos en los textos de los tipos de garantía:
 * - `{anios}`            -> "10"
 * - `{anios_letras}`     -> "DIEZ (10)"
 * - `{anios_texto}`      -> "DIEZ (10) AÑOS"
 * - `{presupuesto}`      -> "0012" (o "—" si no hay presupuesto)
 * - `{presupuesto_ref}`  -> "en el Presupuesto N.º 0012" (o "en el presente certificado")
 */
export function renderTextoGarantia(
  texto: string,
  datos: { anios: number; presupuesto: string | null }
): string {
  const { anios, presupuesto } = datos;
  return texto
    .replaceAll('{anios_texto}', aniosEnTexto(anios))
    .replaceAll('{anios_letras}', `${enteroALetras(anios).toUpperCase()} (${anios})`)
    .replaceAll('{anios}', String(anios))
    .replaceAll('{presupuesto_ref}', presupuesto ? `en el Presupuesto N.º ${presupuesto}` : 'en el presente certificado')
    .replaceAll('{presupuesto}', presupuesto ?? '—');
}

export interface TextosGarantia {
  intro: string;
  alcance: string[];
  exclusionesIntro: string;
  exclusiones: string[];
  limitacion: string;
  constancia: string;
}

/** Todos los textos del certificado ya resueltos, listos para renderizar. */
export function textosGarantia(
  g: Pick<Garantia, 'aniosGarantia' | 'trabajosGarantizados' | 'alcance' | 'exclusiones'> & RefPresupuesto
): TextosGarantia {
  const presupuesto = numeroPresupuestoTexto(g);
  const datos = { anios: g.aniosGarantia, presupuesto };
  return {
    intro:
      'CUYO SMART S.A.S., en carácter de empresa responsable de los trabajos realizados, deja constancia ' +
      `mediante el presente certificado que otorga una garantía de ${aniosEnTexto(g.aniosGarantia)} sobre los ` +
      `trabajos de ${g.trabajosGarantizados} ejecutados en el inmueble indicado a continuación.`,
    alcance: renderTextoGarantia(g.alcance, datos)
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    exclusionesIntro:
      'La presente garantía no cubre filtraciones, daños o deterioros ocasionados por causas ajenas a los ' +
      'trabajos ejecutados por Cuyo Smart S.A.S., incluyendo:',
    exclusiones: g.exclusiones.map((e) => renderTextoGarantia(e, datos)),
    limitacion: presupuesto
      ? 'La garantía se limita exclusivamente a los sectores y trabajos efectivamente intervenidos por ' +
        `Cuyo Smart S.A.S., conforme al alcance establecido en el Presupuesto N.º ${presupuesto}.`
      : 'La garantía se limita exclusivamente a los sectores y trabajos efectivamente intervenidos por ' +
        'Cuyo Smart S.A.S., conforme al alcance detallado en el presente certificado.',
    constancia: presupuesto
      ? 'El presente certificado se emite como constancia de la garantía otorgada sobre los trabajos ' +
        `realizados y queda directamente vinculado al Presupuesto N.º ${presupuesto}, que forma parte de la ` +
        'documentación correspondiente a la obra.'
      : 'El presente certificado se emite como constancia de la garantía otorgada sobre los trabajos realizados.',
  };
}

// ---------------------------------------------------------------------------
// Validación
// ---------------------------------------------------------------------------

function texto(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function textoOpcional(v: unknown): string | undefined {
  return texto(v) || undefined;
}

function vacio(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function validarAnios(v: unknown, campo: string, errors: string[]): number {
  const n = Number(v);
  if (vacio(v) || !Number.isInteger(n) || n < 1 || n > ANIOS_GARANTIA_MAX) {
    errors.push(`${campo} debe ser un número entero entre 1 y ${ANIOS_GARANTIA_MAX}`);
  }
  return n;
}

function validarExclusiones(v: unknown, errors: string[]): string[] {
  if (vacio(v)) return [];
  if (!Array.isArray(v) || v.some((e) => typeof e !== 'string')) {
    errors.push('Las exclusiones deben ser una lista de textos');
    return [];
  }
  return (v as string[]).map((e) => e.trim()).filter(Boolean);
}

const FIRMA_RE = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

/** Devuelve el mensaje de error, o null si la firma es válida. */
export function validarFirmaDataUrl(v: unknown): string | null {
  if (typeof v !== 'string') return 'La firma debe ser una imagen';
  const m = FIRMA_RE.exec(v);
  if (!m) return 'La firma debe ser una imagen PNG, JPG o WEBP';
  const bytes = Math.floor((m[2].length * 3) / 4);
  if (bytes > FIRMA_MAX_BYTES) {
    return `La imagen de la firma supera el máximo de ${Math.round(FIRMA_MAX_BYTES / 1024)} KB`;
  }
  return null;
}

export function validarGarantiaInput(
  raw: unknown
): { errors: string[]; input: GarantiaInput | null } {
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const errors: string[] = [];

  const presupuestoId = textoOpcional(body.presupuestoId);
  const cuentaReciboId = textoOpcional(body.cuentaReciboId);
  if (presupuestoId && cuentaReciboId) {
    errors.push('Un certificado no puede estar vinculado a un presupuesto y a una cuenta al mismo tiempo');
  }

  const trabajosGarantizados = texto(body.trabajosGarantizados);
  if (trabajosGarantizados.length < 3) errors.push('Los trabajos garantizados son requeridos');
  const aniosGarantia = validarAnios(body.aniosGarantia, 'Los años de garantía', errors);
  const alcance = texto(body.alcance);
  if (alcance.length < 10) errors.push('El alcance de la garantía es requerido');
  const exclusiones = validarExclusiones(body.exclusiones, errors);

  const cliente = texto(body.cliente);
  if (cliente.length < 2) errors.push('El cliente es requerido');
  const domicilioObra = texto(body.domicilioObra);
  if (domicilioObra.length < 3) errors.push('El domicilio de la obra es requerido');
  const trabajosRealizados = texto(body.trabajosRealizados);
  if (trabajosRealizados.length < 3) errors.push('Los trabajos realizados son requeridos');

  let superficieM2: number | undefined;
  if (!vacio(body.superficieM2)) {
    superficieM2 = Number(body.superficieM2);
    if (!Number.isFinite(superficieM2) || superficieM2 <= 0 || superficieM2 > SUPERFICIE_M2_MAX) {
      errors.push('La superficie debe ser un número mayor a 0');
    }
  }

  const fechaInicio = textoOpcional(body.fechaInicio);
  if (fechaInicio && !esFechaValida(fechaInicio)) errors.push('La fecha de inicio es inválida');
  const fechaFinalizacion = texto(body.fechaFinalizacion);
  if (!esFechaValida(fechaFinalizacion)) errors.push('La fecha de finalización es requerida');
  if (fechaInicio && esFechaValida(fechaInicio) && esFechaValida(fechaFinalizacion) && fechaInicio > fechaFinalizacion) {
    errors.push('La fecha de inicio no puede ser posterior a la de finalización');
  }
  const vigenciaDesde = textoOpcional(body.vigenciaDesde) ?? fechaFinalizacion;
  if (vigenciaDesde !== fechaFinalizacion && !esFechaValida(vigenciaDesde)) {
    errors.push('La fecha de inicio de vigencia es inválida');
  }

  const lugarEmision = texto(body.lugarEmision);
  if (lugarEmision.length < 2) errors.push('El lugar de emisión es requerido');
  const fechaEmision = texto(body.fechaEmision);
  if (!esFechaValida(fechaEmision)) errors.push('La fecha de emisión es requerida');

  const firmaClienteDataUrl = textoOpcional(body.firmaClienteDataUrl);
  if (firmaClienteDataUrl) {
    const errorFirma = validarFirmaDataUrl(firmaClienteDataUrl);
    if (errorFirma) errors.push(`Firma del cliente: ${errorFirma}`);
  }

  if (errors.length > 0) return { errors, input: null };

  const input: GarantiaInput = {
    ...(presupuestoId ? { presupuestoId } : {}),
    ...(cuentaReciboId ? { cuentaReciboId } : {}),
    referenciaPresupuesto: presupuestoId ? undefined : textoOpcional(body.referenciaPresupuesto),
    tipoGarantiaId: textoOpcional(body.tipoGarantiaId),
    trabajosGarantizados,
    aniosGarantia,
    alcance,
    exclusiones,
    cliente,
    clienteDocumento: textoOpcional(body.clienteDocumento),
    clienteTelefono: textoOpcional(body.clienteTelefono),
    domicilioObra,
    localidad: textoOpcional(body.localidad),
    superficieM2,
    trabajosRealizados,
    materialesSistema: textoOpcional(body.materialesSistema),
    fechaInicio,
    fechaFinalizacion,
    vigenciaDesde,
    lugarEmision,
    fechaEmision,
    observaciones: textoOpcional(body.observaciones),
    incluirFirmaEmpresa: body.incluirFirmaEmpresa === true,
    firmaClienteDataUrl,
  };
  return { errors, input };
}

/** Agrega los campos derivados que calcula el servidor. */
export function completarGarantia(input: GarantiaInput, presupuestoNumero?: number): GarantiaDatos {
  return {
    ...input,
    presupuestoNumero: input.presupuestoId ? presupuestoNumero : undefined,
    vigenciaHasta: sumarAnios(input.vigenciaDesde, input.aniosGarantia),
  };
}

export function validarTipoGarantiaInput(
  raw: unknown
): { errors: string[]; input: TipoGarantiaInput | null } {
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const errors: string[] = [];

  const nombre = texto(body.nombre);
  if (nombre.length < 2) errors.push('El nombre es requerido');
  const trabajosGarantizados = texto(body.trabajosGarantizados);
  if (trabajosGarantizados.length < 3) errors.push('Los trabajos garantizados son requeridos');
  const aniosPorDefecto = validarAnios(body.aniosPorDefecto, 'Los años por defecto', errors);
  const alcance = texto(body.alcance);
  if (alcance.length < 10) errors.push('El alcance de la garantía es requerido');
  const exclusiones = validarExclusiones(body.exclusiones, errors);

  if (errors.length > 0) return { errors, input: null };
  return { errors, input: { nombre, trabajosGarantizados, aniosPorDefecto, alcance, exclusiones } };
}

// ---------------------------------------------------------------------------
// Precarga del formulario
// ---------------------------------------------------------------------------

export function prefillDesdePresupuesto(p: Presupuesto, resumen: ResumenPresupuesto): GarantiaPrefill {
  return {
    presupuestoId: p.id,
    presupuestoNumero: p.numero,
    cliente: p.cliente,
    domicilioObra: p.ubicacion,
    trabajosRealizados: p.detalle,
    resumenPagos: { total: p.total, entregado: resumen.entregado, saldoPendiente: resumen.saldoPendiente },
  };
}

export function prefillDesdeCuenta(c: CuentaRecibo, resumen: ResumenCuentaRecibo): GarantiaPrefill {
  return {
    cuentaReciboId: c.id,
    cliente: c.cliente,
    domicilioObra: '',
    trabajosRealizados: c.concepto,
    resumenPagos: { total: c.montoTotal, entregado: resumen.entregado, saldoPendiente: resumen.saldoPendiente },
  };
}

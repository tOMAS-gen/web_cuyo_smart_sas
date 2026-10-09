import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { TipoGarantia, TiposGarantiaDB, TipoGarantiaInput } from '@/types/tipo-garantia';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'tipos-garantia.json');
const TMP_FILE = DB_FILE + '.tmp';

// Catálogo inicial (servicios de la web). Mientras no exista el archivo se
// sirve este seed; la primera alta/edición/baja lo persiste. Los años y textos
// de los tipos distintos de impermeabilización son orientativos: se ajustan
// desde el admin.
const SEED_FECHA = '2026-10-09T00:00:00.000Z';

const EXCLUSIONES_CUBIERTA = [
  'Granizo.',
  'Tormentas extraordinarias o fenómenos meteorológicos severos.',
  'Vientos fuertes o ráfagas que provoquen daños en la cubierta.',
  'Caída de objetos, ramas u otros elementos sobre el techo.',
  'Daños ocasionados por terceros.',
  'Trabajos, modificaciones o intervenciones posteriores realizados por terceros.',
  'Perforaciones, cortes o roturas efectuadas posteriormente sobre la impermeabilización.',
  'Falta de mantenimiento o mantenimiento inadecuado.',
  'Daños estructurales, movimientos, asentamientos o deformaciones de la construcción.',
  'Deterioro de elementos que no hayan formado parte de los trabajos contratados.',
];

function parrafoReparacion(defecto: string): string {
  return (
    `Ante la aparición de ${defecto} durante el período de garantía, Cuyo Smart S.A.S. realizará la ` +
    'correspondiente inspección para determinar su origen. Cuando se compruebe que corresponde directamente ' +
    'a los trabajos garantizados, la empresa realizará la reparación correspondiente sin costo adicional de ' +
    'mano de obra.'
  );
}

const SEED_TIPOS: TipoGarantia[] = [
  {
    id: 'impermeabilizacion',
    nombre: 'Impermeabilización de techos',
    trabajosGarantizados: 'impermeabilización y tratamiento de cubierta/techo',
    aniosPorDefecto: 10,
    alcance:
      'Cuyo Smart S.A.S. garantiza durante un período de {anios_texto} la correcta ejecución de los trabajos ' +
      'de impermeabilización detallados {presupuesto_ref}, comprometiéndose a responder por filtraciones de ' +
      'agua que sean consecuencia directa de una falla o deficiencia en los trabajos de impermeabilización ' +
      'ejecutados por la empresa.\n\n' +
      'Ante la aparición de una filtración durante el período de garantía, Cuyo Smart S.A.S. realizará la ' +
      'correspondiente inspección para determinar su origen. Cuando se compruebe que la filtración corresponde ' +
      'directamente a los trabajos garantizados, la empresa realizará la reparación correspondiente sin costo ' +
      'adicional de mano de obra.',
    exclusiones: EXCLUSIONES_CUBIERTA,
    creadoEn: SEED_FECHA,
    actualizadoEn: SEED_FECHA,
  },
  {
    id: 'aislacion-termica',
    nombre: 'Aislación térmica con poliuretano',
    trabajosGarantizados: 'aislación térmica con espuma de poliuretano proyectado',
    aniosPorDefecto: 5,
    alcance:
      'Cuyo Smart S.A.S. garantiza durante un período de {anios_texto} la correcta ejecución de los trabajos ' +
      'de aislación térmica detallados {presupuesto_ref}, comprometiéndose a responder por desprendimientos, ' +
      'fisuras o pérdida de adherencia de la espuma aplicada que sean consecuencia directa de una falla o ' +
      'deficiencia en la aplicación realizada por la empresa.\n\n' +
      parrafoReparacion('un defecto'),
    exclusiones: [
      'Granizo.',
      'Tormentas extraordinarias o fenómenos meteorológicos severos.',
      'Caída de objetos, ramas u otros elementos sobre la superficie tratada.',
      'Daños ocasionados por terceros.',
      'Trabajos, modificaciones o intervenciones posteriores realizados por terceros.',
      'Perforaciones, cortes o roturas efectuadas posteriormente sobre la aislación.',
      'Degradación por exposición solar cuando no se aplique o no se mantenga el recubrimiento de protección recomendado.',
      'Falta de mantenimiento o mantenimiento inadecuado.',
      'Daños estructurales, movimientos, asentamientos o deformaciones de la construcción.',
      'Deterioro de elementos que no hayan formado parte de los trabajos contratados.',
    ],
    creadoEn: SEED_FECHA,
    actualizadoEn: SEED_FECHA,
  },
  {
    id: 'techos-zingueria',
    nombre: 'Reparación de techos y zinguería',
    trabajosGarantizados: 'reparación de cubierta, zinguería y reemplazo de chapas',
    aniosPorDefecto: 5,
    alcance:
      'Cuyo Smart S.A.S. garantiza durante un período de {anios_texto} la correcta ejecución de los trabajos ' +
      'de reparación de cubierta y zinguería detallados {presupuesto_ref}, comprometiéndose a responder por ' +
      'filtraciones de agua o desprendimientos que sean consecuencia directa de una falla o deficiencia en los ' +
      'trabajos ejecutados por la empresa.\n\n' +
      parrafoReparacion('una filtración o desprendimiento'),
    exclusiones: [
      ...EXCLUSIONES_CUBIERTA.filter((e) => !e.startsWith('Perforaciones')),
      'Perforaciones, cortes o roturas efectuadas posteriormente sobre la cubierta.',
      'Obstrucción de canaletas o desagües por falta de limpieza.',
    ],
    creadoEn: SEED_FECHA,
    actualizadoEn: SEED_FECHA,
  },
  {
    id: 'obras-civiles',
    nombre: 'Obras civiles y construcción en seco',
    trabajosGarantizados: 'obra civil y construcción en seco',
    aniosPorDefecto: 1,
    alcance:
      'Cuyo Smart S.A.S. garantiza durante un período de {anios_texto} la correcta ejecución de los trabajos ' +
      'de obra detallados {presupuesto_ref}, comprometiéndose a responder por fallas o defectos que sean ' +
      'consecuencia directa de deficiencias en los trabajos ejecutados por la empresa.\n\n' +
      parrafoReparacion('un defecto'),
    exclusiones: [
      'Tormentas extraordinarias, sismos o fenómenos naturales severos.',
      'Daños ocasionados por terceros.',
      'Trabajos, modificaciones o intervenciones posteriores realizados por terceros.',
      'Uso inadecuado o distinto al previsto.',
      'Fisuras capilares propias de la contracción natural de los materiales.',
      'Humedad o filtraciones de origen ajeno a los trabajos ejecutados.',
      'Falta de mantenimiento o mantenimiento inadecuado.',
      'Movimientos, asentamientos o deformaciones de la estructura o del terreno existentes.',
      'Deterioro de elementos que no hayan formado parte de los trabajos contratados.',
    ],
    creadoEn: SEED_FECHA,
    actualizadoEn: SEED_FECHA,
  },
];

async function readDB(): Promise<TiposGarantiaDB> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as TiposGarantiaDB;
  } catch {
    return { version: 1, tipos: SEED_TIPOS.map((t) => ({ ...t, exclusiones: [...t.exclusiones] })) };
  }
}

async function writeDB(db: TiposGarantiaDB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
}

export async function getTiposGarantia(): Promise<TipoGarantia[]> {
  const db = await readDB();
  return db.tipos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export async function getTipoGarantia(id: string): Promise<TipoGarantia | null> {
  const db = await readDB();
  return db.tipos.find((t) => t.id === id) ?? null;
}

export async function createTipoGarantia(input: TipoGarantiaInput): Promise<TipoGarantia> {
  const db = await readDB();
  const ahora = new Date().toISOString();
  const tipo: TipoGarantia = { ...input, id: nanoid(8), creadoEn: ahora, actualizadoEn: ahora };
  db.tipos.push(tipo);
  await writeDB(db);
  return tipo;
}

export async function updateTipoGarantia(
  id: string,
  input: TipoGarantiaInput
): Promise<TipoGarantia | null> {
  const db = await readDB();
  const index = db.tipos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const actual = db.tipos[index];
  const tipo: TipoGarantia = {
    ...input,
    id: actual.id,
    creadoEn: actual.creadoEn,
    actualizadoEn: new Date().toISOString(),
  };
  db.tipos[index] = tipo;
  await writeDB(db);
  return tipo;
}

/** Los certificados guardan un snapshot del tipo: borrarlo no los afecta. */
export async function deleteTipoGarantia(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.tipos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  db.tipos.splice(index, 1);
  await writeDB(db);
  return true;
}

import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { Garantia, GarantiasDB, GarantiaDatos } from '@/types/garantia';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'garantias.json');
const TMP_FILE = DB_FILE + '.tmp';

const EMPTY_DB: GarantiasDB = {
  version: 1,
  ultimoNumero: 0,
  garantias: [],
};

async function readDB(): Promise<GarantiasDB> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as GarantiasDB;
  } catch {
    return { ...EMPTY_DB, garantias: [] };
  }
}

async function writeDB(db: GarantiasDB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
}

export async function getGarantias(): Promise<Garantia[]> {
  const db = await readDB();
  return db.garantias.sort((a, b) => b.numero - a.numero);
}

export async function getGarantia(id: string): Promise<Garantia | null> {
  const db = await readDB();
  return db.garantias.find((g) => g.id === id) ?? null;
}

export async function getGarantiasByPresupuesto(presupuestoId: string): Promise<Garantia[]> {
  const db = await readDB();
  return db.garantias
    .filter((g) => g.presupuestoId === presupuestoId)
    .sort((a, b) => b.numero - a.numero);
}

export async function getGarantiasByCuenta(cuentaReciboId: string): Promise<Garantia[]> {
  const db = await readDB();
  return db.garantias
    .filter((g) => g.cuentaReciboId === cuentaReciboId)
    .sort((a, b) => b.numero - a.numero);
}

export async function createGarantia(datos: GarantiaDatos): Promise<Garantia> {
  const db = await readDB();
  const numero = db.ultimoNumero + 1;
  const ahora = new Date().toISOString();
  const garantia: Garantia = {
    ...datos,
    id: nanoid(8),
    numero,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };
  db.ultimoNumero = numero;
  db.garantias.push(garantia);
  await writeDB(db);
  return garantia;
}

/** Reemplaza el contenido conservando `id`, `numero` y `creadoEn`. */
export async function updateGarantia(id: string, datos: GarantiaDatos): Promise<Garantia | null> {
  const db = await readDB();
  const index = db.garantias.findIndex((g) => g.id === id);
  if (index === -1) return null;
  const actual = db.garantias[index];
  const garantia: Garantia = {
    ...datos,
    id: actual.id,
    numero: actual.numero,
    creadoEn: actual.creadoEn,
    actualizadoEn: new Date().toISOString(),
  };
  db.garantias[index] = garantia;
  await writeDB(db);
  return garantia;
}

export async function deleteGarantia(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.garantias.findIndex((g) => g.id === id);
  if (index === -1) return false;
  db.garantias.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function deleteGarantiasByPresupuesto(presupuestoId: string): Promise<void> {
  const db = await readDB();
  const before = db.garantias.length;
  db.garantias = db.garantias.filter((g) => g.presupuestoId !== presupuestoId);
  if (db.garantias.length !== before) {
    await writeDB(db);
  }
}

export async function deleteGarantiasByCuenta(cuentaReciboId: string): Promise<void> {
  const db = await readDB();
  const before = db.garantias.length;
  db.garantias = db.garantias.filter((g) => g.cuentaReciboId !== cuentaReciboId);
  if (db.garantias.length !== before) {
    await writeDB(db);
  }
}

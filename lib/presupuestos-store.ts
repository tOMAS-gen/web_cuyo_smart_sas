import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { Presupuesto, PresupuestosDB, PresupuestoInput } from '@/types/presupuesto';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'presupuestos.json');
const TMP_FILE = DB_FILE + '.tmp';

const EMPTY_DB: PresupuestosDB = {
  version: 1,
  ultimoNumero: 0,
  presupuestos: [],
};

async function readDB(): Promise<PresupuestosDB> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as PresupuestosDB;
  } catch {
    return { ...EMPTY_DB };
  }
}

async function writeDB(db: PresupuestosDB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
}

export async function getPresupuestos(): Promise<Presupuesto[]> {
  const db = await readDB();
  return db.presupuestos.sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );
}

export async function getPresupuesto(id: string): Promise<Presupuesto | null> {
  const db = await readDB();
  return db.presupuestos.find((p) => p.id === id) ?? null;
}

export async function createPresupuesto(input: PresupuestoInput): Promise<Presupuesto> {
  const db = await readDB();
  const numero = db.ultimoNumero + 1;
  const total = input.items.reduce((acc, item) => acc + item.manoDeObra + item.materiales, 0);
  const presupuesto: Presupuesto = {
    ...input,
    id: nanoid(8),
    numero,
    total,
    creadoEn: new Date().toISOString(),
  };
  db.ultimoNumero = numero;
  db.presupuestos.push(presupuesto);
  await writeDB(db);
  return presupuesto;
}

export async function deletePresupuesto(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.presupuestos.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.presupuestos.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function updatePresupuesto(
  id: string,
  input: PresupuestoInput
): Promise<Presupuesto | null> {
  const db = await readDB();
  const index = db.presupuestos.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const existing = db.presupuestos[index];
  const total = input.items.reduce((acc, item) => acc + item.manoDeObra + item.materiales, 0);
  db.presupuestos[index] = { ...existing, ...input, total };
  await writeDB(db);
  return db.presupuestos[index];
}

export async function updatePresupuestoEstado(
  id: string,
  estado: Presupuesto['estado']
): Promise<Presupuesto | null> {
  const db = await readDB();
  const p = db.presupuestos.find((p) => p.id === id);
  if (!p) return null;
  p.estado = estado;
  await writeDB(db);
  return p;
}

import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { Recibo, RecibosDB, ReciboInput, ResumenPresupuesto } from '@/types/recibo';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'recibos.json');
const TMP_FILE = DB_FILE + '.tmp';

const EMPTY_DB: RecibosDB = {
  version: 1,
  ultimoNumero: 0,
  recibos: [],
};

async function readDB(): Promise<RecibosDB> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as RecibosDB;
  } catch {
    return { ...EMPTY_DB };
  }
}

async function writeDB(db: RecibosDB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
}

export async function getRecibosByPresupuesto(presupuestoId: string): Promise<Recibo[]> {
  const db = await readDB();
  return db.recibos
    .filter((r) => r.presupuestoId === presupuestoId)
    .sort((a, b) => b.numero - a.numero);
}

export async function getRecibosByCuenta(cuentaReciboId: string): Promise<Recibo[]> {
  const db = await readDB();
  return db.recibos
    .filter((r) => r.cuentaReciboId === cuentaReciboId)
    .sort((a, b) => b.numero - a.numero);
}

export async function getRecibo(id: string): Promise<Recibo | null> {
  const db = await readDB();
  return db.recibos.find((r) => r.id === id) ?? null;
}

export async function getRecibos(): Promise<Recibo[]> {
  const db = await readDB();
  return db.recibos.sort((a, b) => b.numero - a.numero);
}

export async function createRecibo(input: ReciboInput): Promise<Recibo> {
  const db = await readDB();
  const numero = db.ultimoNumero + 1;
  const recibo: Recibo = {
    ...input,
    id: nanoid(8),
    numero,
    creadoEn: new Date().toISOString(),
  };
  db.ultimoNumero = numero;
  db.recibos.push(recibo);
  await writeDB(db);
  return recibo;
}

export async function deleteRecibo(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.recibos.findIndex((r) => r.id === id);
  if (index === -1) return false;
  db.recibos.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function deleteRecibosByPresupuesto(presupuestoId: string): Promise<void> {
  const db = await readDB();
  const before = db.recibos.length;
  db.recibos = db.recibos.filter((r) => r.presupuestoId !== presupuestoId);
  if (db.recibos.length !== before) {
    await writeDB(db);
  }
}

export async function deleteRecibosByCuenta(cuentaReciboId: string): Promise<void> {
  const db = await readDB();
  const before = db.recibos.length;
  db.recibos = db.recibos.filter((r) => r.cuentaReciboId !== cuentaReciboId);
  if (db.recibos.length !== before) {
    await writeDB(db);
  }
}

export async function getResumenPresupuesto(
  presupuestoId: string,
  totalPresupuesto: number
): Promise<ResumenPresupuesto> {
  const recibos = await getRecibosByPresupuesto(presupuestoId);
  const entregado = recibos.reduce((acc, r) => acc + r.monto, 0);
  const saldoPendiente = totalPresupuesto - entregado;
  const sobrepago = entregado > totalPresupuesto;
  return { entregado, saldoPendiente, sobrepago };
}

import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { CuentaRecibo, CuentaReciboInput, ResumenCuentaRecibo } from '@/types/cuenta-recibo';
import { getRecibosByCuenta, deleteRecibosByCuenta } from './recibos-store';
import { deleteGarantiasByCuenta } from './garantias-store';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cuentas-recibos.json');
const TMP_FILE = DB_FILE + '.tmp';

interface CuentasRecibosDB {
  version: 1;
  cuentas: CuentaRecibo[];
}

const EMPTY_DB: CuentasRecibosDB = {
  version: 1,
  cuentas: [],
};

async function readDB(): Promise<CuentasRecibosDB> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as CuentasRecibosDB;
  } catch {
    return { ...EMPTY_DB };
  }
}

async function writeDB(db: CuentasRecibosDB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
}

export async function getCuentasRecibo(): Promise<CuentaRecibo[]> {
  const db = await readDB();
  return db.cuentas.sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );
}

export async function getCuentaRecibo(id: string): Promise<CuentaRecibo | null> {
  const db = await readDB();
  return db.cuentas.find((c) => c.id === id) ?? null;
}

export async function createCuentaRecibo(input: CuentaReciboInput): Promise<CuentaRecibo> {
  const db = await readDB();
  const cuenta: CuentaRecibo = {
    ...input,
    id: nanoid(8),
    creadoEn: new Date().toISOString(),
  };
  db.cuentas.push(cuenta);
  await writeDB(db);
  return cuenta;
}

export async function deleteCuentaRecibo(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.cuentas.findIndex((c) => c.id === id);
  if (index === -1) return false;
  // Eliminación en cascada: los hijos se borran ANTES que el padre (mismo
  // criterio que lib/presupuestos-store.ts::deletePresupuesto) — un fallo a
  // mitad de camino deja la cuenta todavía visible/borrable en vez de
  // recibos huérfanos referenciando una cuenta ya inexistente.
  await deleteRecibosByCuenta(id);
  await deleteGarantiasByCuenta(id);
  db.cuentas.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function getResumenCuentaRecibo(
  cuentaId: string,
  totalCuenta: number
): Promise<ResumenCuentaRecibo> {
  const recibos = await getRecibosByCuenta(cuentaId);
  const entregado = recibos.reduce((acc, r) => acc + r.monto, 0);
  const saldoPendiente = totalCuenta - entregado;
  const sobrepago = entregado > totalCuenta;
  return { entregado, saldoPendiente, sobrepago };
}

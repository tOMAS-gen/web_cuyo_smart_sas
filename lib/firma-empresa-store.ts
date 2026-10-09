import fs from 'fs/promises';
import path from 'path';
import type { FirmaEmpresa } from '@/types/garantia';

// Firma digital de Cuyo Smart: se carga una sola vez y la reutilizan todos los
// certificados con `incluirFirmaEmpresa: true` (no se copia en cada uno).

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'firma-empresa.json');
const TMP_FILE = DB_FILE + '.tmp';

export async function getFirmaEmpresa(): Promise<FirmaEmpresa | null> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as FirmaEmpresa;
  } catch {
    return null;
  }
}

export async function setFirmaEmpresa(dataUrl: string): Promise<FirmaEmpresa> {
  const firma: FirmaEmpresa = { dataUrl, actualizadoEn: new Date().toISOString() };
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, JSON.stringify(firma, null, 2), 'utf-8');
  await fs.rename(TMP_FILE, DB_FILE);
  return firma;
}

export async function deleteFirmaEmpresa(): Promise<boolean> {
  try {
    await fs.unlink(DB_FILE);
    return true;
  } catch {
    return false;
  }
}

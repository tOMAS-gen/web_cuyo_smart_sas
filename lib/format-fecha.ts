// Formateo de fechas "solo fecha" (sin hora) provenientes de <input type="date">
// o de la store (p.ej. "2026-08-17"). Nunca se construye un `Date` a partir del
// string completo: `new Date("2026-08-17")` lo interpreta como medianoche UTC,
// y formatear con una timezone explícita (America/Argentina/Mendoza, UTC-3) lo
// corre un día hacia atrás. Se descompone el string manualmente en su lugar.

export function splitFechaISO(iso: string): { dia: string; mes: string; anio: string } {
  const [anio, mes, dia] = iso.split('T')[0].split('-');
  return { dia, mes, anio };
}

export function formatFechaDDMMYYYY(iso: string): string {
  const { dia, mes, anio } = splitFechaISO(iso);
  return `${dia}/${mes}/${anio}`;
}

// Conversión de un monto numérico a su representación en letras (español,
// pesos argentinos), sin dependencias externas (Constitución Principio V).
// Ej: 40000 -> "Cuarenta mil pesos"
//     1250.50 -> "Mil doscientos cincuenta pesos con 50/100"

const UNIDADES = [
  '', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
  'dieciocho', 'diecinueve', 'veinte',
];

const DECENAS = [
  '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta',
  'ochenta', 'noventa',
];

// Excepciones ortográficas: solo estas 4 formas de "veinti-" llevan tilde.
const VEINTI_TILDE: Record<number, string> = {
  1: 'veintiún',
  2: 'veintidós',
  3: 'veintitrés',
  6: 'veintiséis',
};

const CENTENAS = [
  '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
  'seiscientos', 'setecientos', 'ochocientos', 'novecientos',
];

function convertirGrupo(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cien';

  let resultado = '';
  const c = Math.floor(n / 100);
  const resto = n % 100;

  if (c > 0) {
    resultado += CENTENAS[c];
    if (resto > 0) resultado += ' ';
  }

  if (resto > 0) {
    if (resto <= 20) {
      resultado += UNIDADES[resto];
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      if (resto < 30) {
        resultado += u > 0 ? (VEINTI_TILDE[u] ?? `veinti${UNIDADES[u]}`) : 'veinte';
      } else {
        resultado += DECENAS[d];
        if (u > 0) resultado += ` y ${UNIDADES[u]}`;
      }
    }
  }

  return resultado;
}

function convertirEntero(n: number): string {
  if (n === 0) return 'cero';

  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;

  const partes: string[] = [];

  if (millones > 0) {
    // Recursivo, no `convertirGrupo` (que solo soporta 0-999): un monto de
    // 1.000.000.000+ pesos tiene una cantidad de millones que a su vez puede
    // superar los 3 dígitos.
    partes.push(
      millones === 1 ? 'un millón' : `${convertirEntero(millones)} millones`
    );
  }

  if (miles > 0) {
    partes.push(miles === 1 ? 'mil' : `${convertirGrupo(miles)} mil`);
  }

  if (resto > 0) {
    partes.push(convertirGrupo(resto));
  }

  return partes.join(' ');
}

function capitalizar(texto: string): string {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Convierte un monto numérico a su representación en letras, en español,
 * con formato "Son X pesos [con Y/100]" adecuado para el campo "Son (en
 * letras)" del recibo.
 */
export function numeroALetras(monto: number): string {
  if (!Number.isFinite(monto) || monto < 0) return '';

  // Redondear una sola vez sobre el total en centavos evita que el ruido de
  // punto flotante (p.ej. 19.995 - 19 = 0.9950000000000045) produzca
  // `centavos = 100`; con este cálculo `centavos` queda garantizado en 0..99.
  const totalCentavos = Math.round(monto * 100);
  const entero = Math.floor(totalCentavos / 100);
  const centavos = totalCentavos % 100;

  let texto = convertirEntero(entero);
  texto += entero === 1 ? ' peso' : ' pesos';

  if (centavos > 0) {
    texto += ` con ${String(centavos).padStart(2, '0')}/100`;
  }

  return capitalizar(texto);
}

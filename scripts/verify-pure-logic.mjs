// Verificación de las funciones puras del sistema de comprobantes (sin DOM,
// sin dependencias nuevas — usa node:assert). Cubre los casos límite
// encontrados y corregidos en specs/003-terminar-sistema-comprobantes/.
//
// Uso: npm run verify:logic

import assert from 'node:assert/strict';

const { numeroALetras } = await import('../lib/numero-a-letras.ts');
const { splitFechaISO, formatFechaDDMMYYYY } = await import('../lib/format-fecha.ts');

let passed = 0;
function check(label, actual, expected) {
  assert.equal(actual, expected, `${label}: esperado "${expected}", obtuve "${actual}"`);
  passed++;
}

// --- numeroALetras: casos básicos ---
check('cero', numeroALetras(0), 'Cero pesos');
check('uno', numeroALetras(1), 'Un peso');
check('negativo', numeroALetras(-5), '');
check('no finito', numeroALetras(NaN), '');

// --- numeroALetras: tildes de "veinti-" (bug corregido) ---
check('21', numeroALetras(21), 'Veintiún pesos');
check('22', numeroALetras(22), 'Veintidós pesos');
check('23', numeroALetras(23), 'Veintitrés pesos');
check('24 (sin tilde, correcto)', numeroALetras(24), 'Veinticuatro pesos');
check('26', numeroALetras(26), 'Veintiséis pesos');
check('121', numeroALetras(121), 'Ciento veintiún pesos');

// --- numeroALetras: millones >= 1000 (bug corregido, antes daba "undefined millones") ---
check('100 (cien, caso especial)', numeroALetras(100), 'Cien pesos');
check('1.000.000', numeroALetras(1_000_000), 'Un millón pesos');
check('2.000.000', numeroALetras(2_000_000), 'Dos millones pesos');
check('1.234.567.891', numeroALetras(1_234_567_891),
  'Mil doscientos treinta y cuatro millones quinientos sesenta y siete mil ochocientos noventa y un pesos');
assert.ok(!numeroALetras(1_234_567_891).includes('undefined'), 'no debe contener "undefined"');
passed++;

// --- numeroALetras: centavos y punto flotante (bug corregido, antes daba centavos=100) ---
check('19.99', numeroALetras(19.99), 'Diecinueve pesos con 99/100');
check('19.995 (redondea a 20 sin overflow de centavos)', numeroALetras(19.995), 'Veinte pesos');
check('100.00 (sin centavos)', numeroALetras(100.0), 'Cien pesos');
check('80000.5', numeroALetras(80000.5), 'Ochenta mil pesos con 50/100');

// --- splitFechaISO / formatFechaDDMMYYYY (bug de desfase de un día) ---
check('split dia', splitFechaISO('2026-08-17').dia, '17');
check('split mes', splitFechaISO('2026-08-17').mes, '08');
check('split anio', splitFechaISO('2026-08-17').anio, '2026');
check('formato DD/MM/YYYY', formatFechaDDMMYYYY('2026-08-17'), '17/08/2026');
check('formato con hora incluida', formatFechaDDMMYYYY('2026-01-01T00:00:00.000Z'), '01/01/2026');
// El caso que reproducía el bug original: día 1 del mes, más propenso al
// desfase con new Date() + timezone.
check('primer dia del mes', formatFechaDDMMYYYY('2026-08-01'), '01/08/2026');

console.log(`OK: ${passed} verificaciones pasaron.`);

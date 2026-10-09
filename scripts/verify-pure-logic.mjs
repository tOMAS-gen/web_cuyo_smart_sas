// Verificación de las funciones puras del sistema de comprobantes (sin DOM,
// sin dependencias nuevas — usa node:assert). Cubre los casos límite
// encontrados y corregidos en specs/003-terminar-sistema-comprobantes/.
//
// Uso: npm run verify:logic

import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Los módulos de lib/ importan como en Next (`./x` sin extensión, alias `@/`).
// Este hook de resolución los mapea al .ts real para poder correrlos en Node.
const ROOT = new URL('../', import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    let url = null;
    if (specifier.startsWith('@/')) url = new URL(specifier.slice(2), ROOT);
    else if (specifier.startsWith('.') && context.parentURL) url = new URL(specifier, context.parentURL);
    if (url && !/\.[cm]?[jt]s$/.test(url.pathname) && existsSync(fileURLToPath(url) + '.ts')) {
      return nextResolve(pathToFileURL(fileURLToPath(url) + '.ts').href, context);
    }
    return nextResolve(specifier, context);
  },
});

const { numeroALetras } = await import('../lib/numero-a-letras.ts');
const { splitFechaISO, formatFechaDDMMYYYY } = await import('../lib/format-fecha.ts');
const G = await import('../lib/garantia-logic.ts');

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

// --- Certificados de garantía: vigencia (sumarAnios) ---
check('suma simple', G.sumarAnios('2026-10-09', 10), '2036-10-09');
check('29/02 a año no bisiesto', G.sumarAnios('2028-02-29', 1), '2029-02-28');
check('29/02 a año bisiesto', G.sumarAnios('2028-02-29', 4), '2032-02-29');
check('fin de mes', G.sumarAnios('2026-12-31', 5), '2031-12-31');
check('primer dia del mes', G.sumarAnios('2026-08-01', 10), '2036-08-01');
check('fecha valida', G.esFechaValida('2026-02-28'), true);
check('fecha invalida 30/02', G.esFechaValida('2026-02-30'), false);
check('fecha invalida formato', G.esFechaValida('09/10/2026'), false);

// --- Certificados de garantía: textos ---
check('anios plural', G.aniosEnTexto(10), 'DIEZ (10) AÑOS');
check('anios singular', G.aniosEnTexto(1), 'UN (1) AÑO');
check('anios 21', G.aniosEnTexto(21), 'VEINTIÚN (21) AÑOS');
check('placeholders con presupuesto',
  G.renderTextoGarantia('{anios_texto} / {anios_letras} / {anios} / {presupuesto} / detallados {presupuesto_ref}',
    { anios: 10, presupuesto: '0012' }),
  'DIEZ (10) AÑOS / DIEZ (10) / 10 / 0012 / detallados en el Presupuesto N.º 0012');
check('placeholders sin presupuesto',
  G.renderTextoGarantia('{presupuesto} detallados {presupuesto_ref}', { anios: 5, presupuesto: null }),
  '— detallados en el presente certificado');
check('numero presupuesto vinculado', G.numeroPresupuestoTexto({ presupuestoNumero: 12 }), '0012');
check('numero presupuesto referencia libre', G.numeroPresupuestoTexto({ referenciaPresupuesto: ' P-88 ' }), 'P-88');
check('numero presupuesto ausente', G.numeroPresupuestoTexto({}), null);
{
  const t = G.textosGarantia({
    aniosGarantia: 10, trabajosGarantizados: 'impermeabilización', presupuestoNumero: 3,
    alcance: 'Párrafo {anios_texto}.\n\n  Segundo {presupuesto_ref}.  ', exclusiones: ['Granizo.'],
  });
  check('textos intro', t.intro.includes('garantía de DIEZ (10) AÑOS sobre los trabajos de impermeabilización'), true);
  check('textos alcance parrafos', t.alcance.length, 2);
  check('textos alcance segundo', t.alcance[1], 'Segundo en el Presupuesto N.º 0003.');
  check('textos limitacion', t.limitacion.endsWith('Presupuesto N.º 0003.'), true);
  check('textos constancia sin presupuesto',
    G.textosGarantia({ aniosGarantia: 1, trabajosGarantizados: 'x', alcance: 'a', exclusiones: [] }).constancia.includes('Presupuesto'),
    false);
}

// --- Certificados de garantía: validación ---
const base = {
  trabajosGarantizados: 'impermeabilización y tratamiento de cubierta/techo',
  aniosGarantia: 10, alcance: 'Texto de alcance de prueba', exclusiones: [' Granizo. ', ''],
  cliente: ' Juan Pérez ', domicilioObra: 'Calle 123', trabajosRealizados: 'Membrana líquida',
  fechaFinalizacion: '2026-10-01', lugarEmision: 'Mendoza', fechaEmision: '2026-10-09',
  superficieM2: '', incluirFirmaEmpresa: true,
};
{
  const { errors, input } = G.validarGarantiaInput(base);
  check('valido sin errores', errors.length, 0);
  check('trim cliente', input.cliente, 'Juan Pérez');
  check('exclusiones limpias', JSON.stringify(input.exclusiones), '["Granizo."]');
  check('vigenciaDesde por defecto', input.vigenciaDesde, '2026-10-01');
  check('superficie vacia -> undefined', input.superficieM2, undefined);
  check('completar vigenciaHasta', G.completarGarantia(input).vigenciaHasta, '2036-10-01');
  check('completar sin presupuestoId ignora numero', G.completarGarantia(input, 7).presupuestoNumero, undefined);
}
check('anios 0 invalido', G.validarGarantiaInput({ ...base, aniosGarantia: 0 }).errors.length, 1);
check('anios decimal invalido', G.validarGarantiaInput({ ...base, aniosGarantia: 2.5 }).errors.length, 1);
check('anios string numerico ok', G.validarGarantiaInput({ ...base, aniosGarantia: '5' }).input.aniosGarantia, 5);
check('superficie negativa', G.validarGarantiaInput({ ...base, superficieM2: -3 }).errors.length, 1);
check('inicio posterior a fin', G.validarGarantiaInput({ ...base, fechaInicio: '2026-11-01' }).errors.length, 1);
check('presupuesto y cuenta juntos',
  G.validarGarantiaInput({ ...base, presupuestoId: 'a', cuentaReciboId: 'b' }).errors.length, 1);
check('referencia libre se descarta si hay presupuesto',
  G.validarGarantiaInput({ ...base, presupuestoId: 'a', referenciaPresupuesto: 'X' }).input.referenciaPresupuesto, undefined);
check('exclusiones no array', G.validarGarantiaInput({ ...base, exclusiones: 'x' }).errors.length, 1);
check('body vacio da errores', G.validarGarantiaInput(null).errors.length > 5, true);
check('firma empresa por defecto false', G.validarGarantiaInput({ ...base, incluirFirmaEmpresa: undefined }).input.incluirFirmaEmpresa, false);

// --- Firma (data URL) ---
check('firma png ok', G.validarFirmaDataUrl('data:image/png;base64,iVBORw0KGgo='), null);
check('firma tipo invalido', G.validarFirmaDataUrl('data:image/gif;base64,R0lGOD=') !== null, true);
check('firma no data url', G.validarFirmaDataUrl('https://x/y.png') !== null, true);
check('firma demasiado grande',
  G.validarFirmaDataUrl('data:image/png;base64,' + 'A'.repeat(Math.ceil(G.FIRMA_MAX_BYTES * 4 / 3) + 8)) !== null, true);
check('firma cliente invalida en certificado',
  G.validarGarantiaInput({ ...base, firmaClienteDataUrl: 'nope' }).errors.length, 1);

// --- Tipos de garantía ---
check('tipo valido', G.validarTipoGarantiaInput({
  nombre: 'Aislación', trabajosGarantizados: 'aislación térmica', aniosPorDefecto: 5,
  alcance: 'Alcance de prueba largo', exclusiones: [],
}).errors.length, 0);
check('tipo invalido', G.validarTipoGarantiaInput({}).errors.length, 4);

// --- Precarga ---
{
  const p = { id: 'p1', numero: 12, cliente: 'Ana', ubicacion: 'Godoy Cruz', detalle: 'Impermeabilización losa', total: 1000 };
  const pre = G.prefillDesdePresupuesto(p, { entregado: 400, saldoPendiente: 600, sobrepago: false });
  check('prefill presupuesto numero', pre.presupuestoNumero, 12);
  check('prefill presupuesto domicilio', pre.domicilioObra, 'Godoy Cruz');
  check('prefill presupuesto saldo', pre.resumenPagos.saldoPendiente, 600);
  const c = { id: 'c1', cliente: 'Luis', concepto: 'Aislación galpón', montoTotal: 500 };
  const prc = G.prefillDesdeCuenta(c, { entregado: 500, saldoPendiente: 0, sobrepago: false });
  check('prefill cuenta trabajos', prc.trabajosRealizados, 'Aislación galpón');
  check('prefill cuenta sin presupuesto', prc.presupuestoId, undefined);
}

console.log(`OK: ${passed} verificaciones pasaron.`);

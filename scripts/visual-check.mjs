// Verificación visual del sistema de comprobantes (recibos + presupuestos)
// con un navegador real. No es parte del build ni del CI — es un script
// committeado pero inerte (Principio V: no agrega dependencias permanentes).
//
// Formaliza el flujo probado manualmente durante specs/003-terminar-sistema-comprobantes/:
// login → abrir un comprobante → capturar pantalla → exportar imagen →
// verificar dimensiones y bordes sin defectos → (recibo) verificar A4
// vertical, ancho completo, alto corto y ubicado arriba de la hoja (no
// centrado verticalmente) en la impresión.
//
// Uso:
//   npm install --no-save playwright pngjs
//   node scripts/visual-check.mjs [baseUrl]
//   npm uninstall playwright pngjs   # al terminar
//
// Requiere: el servidor de desarrollo corriendo (npm run dev) y al menos un
// recibo y un presupuesto ya cargados (usa los primeros que encuentre en
// /admin/recibos y /admin/presupuestos).

import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = process.argv[2] || 'http://localhost:3000';

let chromium, PNG;
try {
  ({ chromium } = await import('playwright'));
  ({ PNG } = await import('pngjs'));
} catch {
  console.error(
    'Faltan dependencias temporales. Corré primero:\n' +
    '  npm install --no-save playwright pngjs\n' +
    'y desinstalalas al terminar con: npm uninstall playwright pngjs'
  );
  process.exit(1);
}

const OUT_DIR = mkdtempSync(join(tmpdir(), 'visual-check-'));
let failures = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  OK   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}${detail ? ' — ' + detail : ''}`);
  }
}

function pngEdgeColors(pngBuffer) {
  const png = PNG.sync.read(pngBuffer);
  const hex = (d, i) => '#' + [d[i], d[i + 1], d[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const alpha = (d, i) => d[i + 3];
  function row(r) {
    const colors = new Set();
    let minAlpha = 255;
    for (let x = 0; x < png.width; x++) {
      const i = (png.width * r + x) << 2;
      colors.add(hex(png.data, i));
      minAlpha = Math.min(minAlpha, alpha(png.data, i));
    }
    return { colors, minAlpha };
  }
  return {
    width: png.width,
    height: png.height,
    top: row(0),
    bottom: row(png.height - 1),
    bottomMinus1: row(png.height - 2),
  };
}

async function login(page) {
  const env = readFileSync('.env.local', 'utf8');
  const username = /ADMIN_USERNAME=(.*)/.exec(env)[1].trim();
  const password = /ADMIN_PASSWORD=(.*)/.exec(env)[1].trim();
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', username);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  await page.waitForTimeout(500);
}

async function findFirstHref(page, listUrl, hrefPattern) {
  await page.goto(`${BASE_URL}${listUrl}`, { waitUntil: 'networkidle' });
  const hrefs = await page.$$eval('a[href]', (els) => els.map((el) => el.getAttribute('href')));
  return hrefs.find((h) => h && hrefPattern.test(h)) ?? null;
}

async function checkExport(page, label, exportButtonText, expectFixedSize) {
  console.log(`\n${label} — exportación de imagen`);
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.click(`text=${exportButtonText}`),
  ]);
  const path = join(OUT_DIR, `${label.replace(/\s+/g, '_')}.png`);
  await download.saveAs(path);
  const buffer = readFileSync(path);
  const edges = pngEdgeColors(buffer);

  if (expectFixedSize) {
    check(`dimensiones exactas ${expectFixedSize.join('x')}`, edges.width === expectFixedSize[0] && edges.height === expectFixedSize[1], `obtuvo ${edges.width}x${edges.height}`);
  }
  check('fila superior sin transparencia parcial (alpha=255)', edges.top.minAlpha === 255, `minAlpha=${edges.top.minAlpha}`);
  check('fila inferior sin transparencia parcial (alpha=255)', edges.bottom.minAlpha === 255, `minAlpha=${edges.bottom.minAlpha}`);
  console.log(`  info fila superior: ${[...edges.top.colors].slice(0, 5).join(', ')}`);
  console.log(`  info fila inferior: ${[...edges.bottom.colors].slice(0, 5).join(', ')}`);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1400, height: 1400 } });
  const page = await context.newPage();

  console.log('Iniciando sesión...');
  await login(page);
  check('login exitoso', page.url().includes('/admin') && !page.url().includes('/login'));

  // --- Recibo ---
  // Los recibos suelen estar vinculados a un presupuesto o a una cuenta —
  // rara vez son "sueltos" (sin ninguno) — así que se busca en ese orden:
  // 1) un recibo suelto listado directo en /admin/recibos,
  // 2) un recibo dentro del primer presupuesto que tenga alguno,
  // 3) un recibo dentro de la primera cuenta que tenga alguno.
  let reciboHref = await findFirstHref(page, '/admin/recibos', /^\/admin\/recibos\/[^/]+$/);
  if (!reciboHref) {
    const presupuestoForRecibo = await findFirstHref(
      page,
      '/admin/presupuestos',
      /^\/admin\/(?!presupuestos$|recibos$|nuevo$|login$)[^/]+$/
    );
    if (presupuestoForRecibo) {
      reciboHref = await findFirstHref(page, presupuestoForRecibo, /^\/admin\/[^/]+\/recibos\/[^/]+$/);
    }
  }
  if (!reciboHref) {
    const cuentaHref = await findFirstHref(page, '/admin/recibos', /^\/admin\/recibos\/cuentas\/[^/]+$/);
    if (cuentaHref) {
      reciboHref = await findFirstHref(page, cuentaHref, /^\/admin\/recibos\/[^/]+$/);
    }
  }
  if (reciboHref) {
    await page.goto(`${BASE_URL}${reciboHref}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await checkExport(page, 'Recibo', 'Exportar imagen', [2004, 680]);

    // A4 print check — el viewport se fija al tamaño real de una hoja A4
    // vertical (210x297mm a 96dpi) para que `position:fixed;inset:0` mida
    // márgenes contra la página física real, no contra el viewport de prueba.
    console.log('\nRecibo — impresión A4 vertical, ancho completo, alto corto');
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    const measurements = await page.evaluate(() => {
      const pageEl = document.querySelector('.recibo-print-page');
      const docEl = Array.from(document.querySelectorAll('div')).find(
        (el) => el.style.width === '1002px' && el.style.height === '340px'
      );
      if (!pageEl || !docEl) return null;
      const pageRect = pageEl.getBoundingClientRect();
      const docRect = docEl.getBoundingClientRect();
      return {
        marginLeft: docRect.left - pageRect.left,
        marginRight: pageRect.right - docRect.right,
        marginTop: docRect.top - pageRect.top,
        marginBottom: pageRect.bottom - docRect.bottom,
      };
    });
    await page.emulateMedia({ media: 'screen' });
    await page.setViewportSize({ width: 1400, height: 1400 });
    if (measurements) {
      const symH = Math.abs(measurements.marginLeft - measurements.marginRight) < 2;
      // El recibo va arriba de la hoja (no centrado verticalmente): solo un
      // margen superior chico (~10mm de zona de impresión segura), y un
      // margen inferior grande — el resto de la hoja en blanco (decisión de
      // producto tras feedback del cliente).
      check('centrado horizontal en A4 (margen izq ≈ der)', symH, `L=${measurements.marginLeft.toFixed(1)} R=${measurements.marginRight.toFixed(1)}`);
      // PRINT_TARGET_WIDTH_MM deja 10mm de margen de impresión seguro a cada
      // lado (≈37.8px a 96dpi) — no 0, para no exceder el área imprimible de
      // impresoras reales; "ancho completo" es relativo a ese margen mínimo.
      check('ocupa el ancho completo (margen lateral mínimo de impresión)', measurements.marginLeft < 45, `L=${measurements.marginLeft.toFixed(1)}px`);
      check('ubicado arriba de la hoja (margen superior chico, ~10mm)', measurements.marginTop < 45, `T=${measurements.marginTop.toFixed(1)}px`);
      check('ocupa solo una porción corta del alto (hay margen inferior real)', measurements.marginBottom > 300, `B=${measurements.marginBottom.toFixed(1)}px`);
    } else {
      failures++;
      console.log('  FAIL no se encontraron los elementos de impresión (.recibo-print-page)');
    }
  } else {
    console.log('\n[omitido] Recibo: no se encontró ningún recibo existente en /admin/recibos');
  }

  // --- Presupuesto ---
  const presupuestoHref = await findFirstHref(
    page,
    '/admin/presupuestos',
    /^\/admin\/(?!presupuestos$|recibos$|nuevo$|login$)[^/]+$/
  );
  if (presupuestoHref) {
    await page.goto(`${BASE_URL}${presupuestoHref}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const fontFamily = await page.evaluate(() => {
      const el = document.querySelector('.doc-root');
      return el ? getComputedStyle(el).fontFamily : null;
    });
    check('tipografía de marca (no Arial hardcodeado)', !!fontFamily && !/^Arial/.test(fontFamily), fontFamily ?? 'no encontrado');
    await checkExport(page, 'Presupuesto', 'Exportar imagen', null);
  } else {
    console.log('\n[omitido] Presupuesto: no se encontró ningún presupuesto existente en /admin/presupuestos');
  }

  await browser.close();

  console.log(`\n${failures === 0 ? '✅ Todo OK' : `❌ ${failures} verificación(es) fallaron`} — capturas en ${OUT_DIR}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('SCRIPT_ERROR:', err);
  process.exit(1);
});

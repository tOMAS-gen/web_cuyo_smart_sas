# Phase 1 — Quickstart: validación de «Diseño de Comprobantes y Exportación sin Bordes»

**Feature**: `002-mejorar-diseno-recibos` | **Date**: 2026-07-29

Guía de validación manual ejecutable, de punta a punta. El proyecto **no tiene
runner de tests automatizados** (plan.md § Technical Context → Testing), por lo
que esta guía **es** la suite de aceptación de la feature.

Los detalles de implementación no se repiten aquí: la causa raíz del borde y la
receta de exportación están en [research.md](./research.md) § 1–§ 2, la
tipografía en § 6, la paridad de impresión en § 7, y la estructura de archivos en
[plan.md](./plan.md) § Project Structure.

---

## 0. Prerrequisitos

| # | Requisito | Cómo conseguirlo / verificarlo |
|---|---|---|
| 1 | Node.js 20+ y dependencias instaladas | `node -v` → v20 o superior; `npm ci` |
| 2 | Variables de entorno del panel | `.env.local` con las credenciales de admin y el secreto JWT que ya usa el proyecto (mismas que en `main`) |
| 3 | Servidor de desarrollo corriendo | `npm run dev` → `http://localhost:3000` |
| 4 | Sesión administrativa activa | Ingresar en `/admin/login`. Toda la validación ocurre autenticado (FR-020) |
| 5 | **Al menos un recibo asociado a un presupuesto** | Panel → un presupuesto → «Nuevo recibo». Anotar su ruta `/admin/<presupuestoId>/recibos/<reciboId>` |
| 6 | **Al menos un recibo de una cuenta independiente** | `/admin/recibos` → crear cuenta de recibos → cargarle un recibo. Anotar `/admin/recibos/<reciboId>` |
| 7 | Datos de prueba variados | Ver § 1 (matriz de 10 casos). Se necesitan recibos con texto corto, texto largo, con y sin observaciones, y monto de muchos dígitos |
| 8 | Visor de imagen con zoom ≥ 800% y cuentagotas | Windows: **Paint** (zoom + selector de color) o **Paint.NET**/GIMP. Alternativa sin instalar nada: el snippet de muestreo de píxeles de § 3.3 en la consola del navegador |
| 9 | Navegador Chromium y Firefox | La paridad de exportación se valida en ambos (research.md § 2.4) |

Comandos base:

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint         # debe pasar sin errores antes de dar la feature por terminada
```

### Escenario 0 — Gate de seguridad (bloqueante, correr PRIMERO)

Antes de cualquier validación visual, verificar el gate del Principio I
(plan.md § «Principio I — remediación obligatoria»). Con el servidor corriendo y
**sin** cookie de sesión:

```bash
# Debe FALLAR (redirección / 401 / 403). Si devuelve 200 con datos, el gate no está cerrado.
curl -i -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/cuentas-recibos

# Debe FALLAR igualmente
curl -i -s -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"cliente":"TEST NO AUTH","concepto":"x","montoTotal":1}' \
  http://localhost:3000/api/cuentas-recibos
```

Y verificar que el archivo de datos no se commitea:

```bash
git check-ignore -v data/cuentas-recibos.json    # debe imprimir la regla de .gitignore
git status --short data/                          # no debe listar cuentas-recibos.json
```

**Criterio de aceptación**: ninguna de las dos peticiones sin sesión devuelve
`200`, no se crea la cuenta «TEST NO AUTH», y `data/cuentas-recibos.json` está
ignorado. Cierra FR-020.

---

## 1. Matriz de datos de prueba (base de SC-001)

SC-001 exige **10 de 10** recibos exportados sin defectos de borde. Crear estos
casos una vez y reutilizarlos en todos los escenarios:

| # | Origen | `recibiDe` | `concepto` | `monto` | `observaciones` | Cubre |
|---|---|---|---|---|---|---|
| 1 | Presupuesto | corto | corto | `15000` | vacío | caso base |
| 2 | Presupuesto | corto | corto | `15000` | 1 línea | caso base + obs |
| 3 | Presupuesto | largo (>60 car.) | corto | `7500.50` | vacío | FR-012 nombre |
| 4 | Presupuesto | corto | muy largo (>250 car.) | `250000` | vacío | FR-012 concepto |
| 5 | Presupuesto | corto | corto | `1234567.89` | vacío | FR-012 monto/letras largos |
| 6 | Presupuesto | corto | corto | `9999999.99` | muy largo (>300 car.) | FR-012 observaciones |
| 7 | Cuenta indep. | corto | corto | `15000` | vacío | FR-006 |
| 8 | Cuenta indep. | largo | largo | `480000` | 1 línea | FR-006 + FR-012 |
| 9 | Cuenta indep. | corto | corto | `100` | vacío | monto mínimo |
| 10 | Cualquiera | **recibo preexistente** creado antes del rediseño | — | — | — | FR-022, SC-006 |

El caso 10 es obligatorio y no se puede fabricar después: usar un recibo que ya
exista en `data/recibos.json` desde antes de tocar el código.

---

## 2. Escenario P1 — Exportar imagen sin bordes indeseados

> User Story 1 · FR-001..FR-008 · SC-001, SC-002, SC-004, SC-005

### 2.1 Pasos de exportación

1. Abrir `/admin/<presupuestoId>/recibos/<reciboId>` (caso 1 de la matriz).
2. Confirmar que el documento se ve completo en pantalla y que **la sombra
   decorativa está en el contenedor, no en el documento** (research.md § 4: si la
   sombra quedó en el nodo raíz, se rasterizará como halo gris → FR-001).
3. Presionar **«Exportar imagen»**.
4. Verificar que el archivo descargado se llama `recibo-NNNN.png` con el número
   del recibo rellenado a 4 dígitos (FR-008).
5. Cronometrar: desde el clic hasta la descarga, **< 3 s** (SC-005).
6. Contar las acciones necesarias desde la vista del recibo hasta tener el archivo
   listo para enviar: debe ser **≤ 2** (SC-004).

### 2.2 Verificación de dimensiones (FR-002, SC-002)

En el explorador de archivos (Propiedades → Detalles) o por consola:

```powershell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$HOME\Downloads\recibo-0001.png")
"$($img.Width) x $($img.Height)"
$img.Dispose()
```

**Esperado**: `2004 x 1604` — exactamente `RECIBO_DOC.width × 2` por
`RECIBO_DOC.height × 2` (research.md § 2.2). Cualquier otro valor (1002×802,
2005×1605, dimensiones fraccionarias redondeadas) indica que la receta de
`width/height` + `style.transform` no está aplicada como se especificó.

### 2.3 Inspección de las cuatro orillas (FR-001, FR-003, SC-002)

Este es **el** criterio de la feature. Hacerlo con rigor, no de vista.

**Método A — visor de imagen (obligatorio)**

1. Abrir el PNG en Paint (o GIMP) y llevar el zoom a **800 %** o más.
2. Recorrer las **cuatro orillas** completas, no solo las esquinas:
   - Orilla **inferior**: es donde el defecto se manifiesta hoy. El pie navy
     (`#0B1C3E`) debe llegar al **último renglón de píxeles**. No debe haber
     ninguna línea blanca, gris o azul-claro de 1–2 px entre la franja y el borde
     del archivo (FR-003, el síntoma exacto reportado en la spec).
   - Orillas **izquierda**, **derecha** y **superior**: fondo blanco del documento
     hasta el píxel del borde. Ninguna línea gris, marco ni franja de otro tono.
3. Revisar las **cuatro esquinas** a ≥ 1600 %: no debe haber píxeles de color
   distinto al esperado ni redondeos parciales.
4. Verificar que **no falta contenido**: el pie navy no debe estar cortado
   verticalmente y el margen del diseño debe ser visualmente igual en los cuatro
   lados respecto a la vista en pantalla.

**Método B — muestreo de píxeles (recomendado, es determinista)**

Pegar en la consola del navegador (`F12`) y elegir el PNG descargado con el
selector de archivo que aparece:

```js
// Muestrea las 4 orillas del PNG exportado y reporta colores únicos por borde.
const input = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/png' });
input.onchange = async () => {
  const bmp = await createImageBitmap(input.files[0]);
  const c = Object.assign(document.createElement('canvas'), { width: bmp.width, height: bmp.height });
  const ctx = c.getContext('2d');
  ctx.drawImage(bmp, 0, 0);
  const hex = (d, i) => '#' + [d[i], d[i+1], d[i+2]].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const edge = (name, x, y, w, h) => {
    const d = ctx.getImageData(x, y, w, h).data;
    const set = new Set();
    for (let i = 0; i < d.length; i += 4) set.add(hex(d, i) + (d[i+3] === 255 ? '' : `/a${d[i+3]}`));
    console.log(name, [...set].join(' '));
  };
  console.log('size', bmp.width + 'x' + bmp.height);
  edge('fila  0   (top)   ', 0, 0, bmp.width, 1);
  edge('fila  H-1 (bottom)', 0, bmp.height - 1, bmp.width, 1);
  edge('fila  H-2 (bottom)', 0, bmp.height - 2, bmp.width, 1);
  edge('col   0   (left)  ', 0, 0, 1, bmp.height);
  edge('col   W-1 (right) ', bmp.width - 1, 0, 1, bmp.height);
};
input.click();
```

**Esperado**:

| Muestra | Resultado aceptable | Resultado que FALLA |
|---|---|---|
| `size` | `2004x1604` | cualquier otro |
| fila `0` (superior) | solo `#FFFFFF` | cualquier gris/color adicional |
| fila `H-1` (inferior) | solo `#0B1C3E` (navy puro del pie) | `#FFFFFF`, `#F...`, o cualquier tono intermedio → es la costura de FR-003 |
| fila `H-2` (inferior) | solo `#0B1C3E` | idem |
| col `0` (izquierda) | `#FFFFFF` + `#0B1C3E` (donde arranca el pie) — **sin** tonos intermedios | tonos mezclados tipo `#8...`/`#E...` en el límite |
| col `W-1` (derecha) | `#FFFFFF` + `#0B1C3E`, sin intermedios | idem |
| canal alfa | siempre `255` en las 4 orillas | cualquier `/aNNN` con alfa < 255 |

Un tono *intermedio* entre `#FFFFFF` y `#0B1C3E` en una orilla es la firma
inequívoca del blit escalado con cobertura parcial descrito en research.md § 1: si
aparece, la corrección no está aplicada.

### 2.4 Determinismo (FR-004)

1. Exportar el **mismo** recibo dos veces seguidas. Comparar hashes:

   ```powershell
   Get-FileHash "$HOME\Downloads\recibo-0001.png" -Algorithm SHA256
   Get-FileHash "$HOME\Downloads\recibo-0001 (1).png" -Algorithm SHA256
   ```

   **Esperado**: mismas dimensiones y resultado visualmente equivalente (los
   hashes pueden diferir por metadatos del encoder; las dimensiones y el muestreo
   de orillas **no** deben diferir).
2. Repetir con **zoom del navegador al 50 %, 100 % y 150 %** (`Ctrl+-` / `Ctrl+0`
   / `Ctrl++`). Las tres exportaciones deben dar `2004x1604` y pasar § 2.3.
3. Repetir en un monitor con distinto `devicePixelRatio` si está disponible (o
   emulando DPR desde DevTools → Rendering). El resultado no debe cambiar.
4. Repetir el ciclo completo en Firefox.

### 2.5 Fuentes e imágenes cargadas (FR-005)

1. Recargar la página del recibo con `Ctrl+Shift+R` y presionar «Exportar imagen»
   **inmediatamente**, antes de que se estabilice el render.
2. **Esperado**: la imagen exportada usa la tipografía corporativa (Montserrat) y
   tiene **exactamente** los mismos saltos de línea que la vista en pantalla. Si
   aparece Arial o los saltos difieren, falta el `await document.fonts.ready`
   (research.md § 3, § 6).
3. En DevTools → Network, bloquear `/_next/static/media/*` y exportar: el
   documento debe exportarse igualmente, sin marcos ni cajas de imagen rota.
4. Bloquear `/brand/logo_name_completo_dark.svg` y exportar: el resto del diseño
   debe quedar intacto, **sin marco ni ícono de imagen roto** en el lugar del logo
   (Edge Case de la spec).

### 2.6 Error visible (FR-007)

1. En DevTools → Network, poner **Offline** (o bloquear `/_next/static/media/*`
   con un patrón que provoque el fallo del `fetch` de `embedFonts`).
2. Presionar «Exportar imagen».
3. **Esperado**: aparece un mensaje de error **visible junto al botón**, con el
   estilo de error del panel, y el botón sale del estado de carga. **No** es
   aceptable que solo se registre en `console.error` ni que el botón vuelva a su
   estado normal como si hubiera funcionado (research.md § 8).

### 2.7 Paridad de origen (FR-006)

Repetir § 2.1 a § 2.3 en `/admin/recibos/<reciboId>` (recibo de cuenta
independiente, casos 7–9). El documento y la calidad del PNG deben ser
**idénticos** a los del recibo de presupuesto.

### 2.8 Barrido de los 10 casos (SC-001)

Ejecutar § 2.1 + § 2.2 + § 2.3 (método B) sobre los **10 casos** de la matriz de
§ 1 y registrar el resultado:

| Caso | `size` | Orillas limpias | Contenido completo | Resultado |
|---|---|---|---|---|
| 1..10 | `2004x1604` | sí | sí | ✅ |

**Criterio de aceptación (SC-001, SC-002)**: **10/10** casos sin ningún defecto de
borde y sin píxeles de contenido recortado ni margen sobrante. Un solo fallo
bloquea la feature.

---

## 3. Escenario P2 — Documento rediseñado con paridad pantalla / impresión / imagen

> User Story 2 · FR-009..FR-014 · SC-003, SC-006, SC-007

### 3.1 Comparación de las tres salidas (FR-011, SC-003)

Para el mismo recibo (caso 2 de la matriz), producir las tres salidas:

1. **Pantalla**: captura de pantalla del documento en `/admin/.../recibos/<reciboId>`.
2. **Impresión/PDF**: `Ctrl+P` → «Guardar como PDF» → guardar.
3. **Imagen**: «Exportar imagen».

Poner las tres una al lado de la otra (o alternarlas en el mismo visor) y verificar
campo por campo:

| Elemento oficial | Presente | Misma posición | Mismo tamaño | Mismo color |
|---|---|---|---|---|
| Logo + identidad CuyoSmart SAS | ☐ | ☐ | ☐ | ☐ |
| CUIT | ☐ | ☐ | ☐ | ☐ |
| Teléfono y correo (desde `siteConfig`) | ☐ | ☐ | ☐ | ☐ |
| Caja de número de recibo | ☐ | ☐ | ☐ | ☐ |
| Fecha (día / mes / año) | ☐ | ☐ | ☐ | ☐ |
| Título del comprobante | ☐ | ☐ | ☐ | ☐ |
| «Recibí de» | ☐ | ☐ | ☐ | ☐ |
| Concepto | ☐ | ☐ | ☐ | ☐ |
| Monto en números | ☐ | ☐ | ☐ | ☐ |
| Monto en letras | ☐ | ☐ | ☐ | ☐ |
| Forma de pago (incl. «Otro: detalle») | ☐ | ☐ | ☐ | ☐ |
| Observaciones | ☐ | ☐ | ☐ | ☐ |
| Firma | ☐ | ☐ | ☐ | ☐ |
| Pie «¡Gracias por su confianza!» | ☐ | ☐ | ☐ | ☐ |

**Esperado (SC-003)**: cero diferencias perceptibles de posición, tamaño o color en
ninguno de los campos, en las tres salidas.

Verificaciones específicas de la impresión:

- El **pie navy aparece en el PDF** con su fondo de color. Si sale blanco, se
  perdió `print-color-adjust: exact` (research.md § 7).
- La página del PDF tiene **exactamente** la proporción del documento, sin margen
  extra ni corte: el `@page { size }` se deriva de `RECIBO_DOC`, no de literales.

### 3.2 Jerarquía visual e identidad (FR-009, FR-010, SC-007)

1. Verificar que el **número de recibo y los datos económicos** (monto en números,
   monto en letras) destacan tipográficamente sobre los datos secundarios.
2. Verificar con el cuentagotas del visor que los colores del documento son
   únicamente los de la identidad: `#0B1C3E`, `#FF9000`, `#29ABE2`, `#FFFFFF` y
   los grises semánticos de UI.
3. **Tipografía**: en DevTools, inspeccionar el nodo del documento y confirmar que
   `getComputedStyle(nodo).fontFamily` resuelve a la familia **hasheada de
   `next/font`** (Montserrat), **no** a `Arial`. Este es el defecto verificado en
   research.md § 6: si sigue diciendo Arial, FR-010 no está cumplido.
4. Confirmar visualmente que la imagen exportada usa la **misma** tipografía que
   la pantalla (no un fallback).

### 3.3 Textos largos y campos vacíos (FR-012, FR-013)

| Caso de la matriz | Verificación | Esperado |
|---|---|---|
| 4 (concepto muy largo) | Pantalla + PDF + PNG | Ajusta en varias líneas, sin desbordar el documento, sin solapar otros campos, sin truncar |
| 5 (monto de 7 dígitos) | Pantalla + PDF + PNG | Monto en números y en letras completos y legibles dentro de su área, sin recortes |
| 6 (observaciones muy largas) | Pantalla + PDF + PNG | Multilínea contenida; firma y pie no se desplazan fuera del lienzo |
| 1, 3, 7 (sin observaciones) | Pantalla + PDF + PNG | El bloque de observaciones **no deja un hueco roto** y firma y pie mantienen su posición (altura mínima estable) |

En los cuatro subcasos, **re-ejecutar § 2.3** sobre el PNG: un cambio de altura del
contenido no debe reintroducir franja ni recorte (es el segundo síntoma de FR-002
descrito en research.md § 1).

### 3.4 Controles fuera de la impresión (FR-014)

1. `Ctrl+P` en la vista de detalle de un recibo.
2. **Esperado**: la vista previa contiene **solo** el documento del comprobante.
   No aparecen botones («Exportar imagen», «Imprimir», «Eliminar»), ni enlaces de
   navegación, ni cabecera/pie del panel administrativo.
3. Repetir en `/admin/recibos/<reciboId>` y en el detalle de presupuesto: la
   ocultación debe funcionar en **todas** las páginas, no solo donde hay un
   `ReciboPrint` montado (research.md § 7 — la clase ad-hoc `.no-print` tenía esa
   dependencia implícita).

### 3.5 Recibos preexistentes (FR-022, SC-006)

Abrir el caso 10 (recibo creado antes del rediseño) y verificar las tres salidas:
se visualiza, se imprime y se exporta correctamente con el diseño nuevo, con
**todos** sus datos intactos y **sin** haber ejecutado ninguna migración.

**Esperado (SC-006)**: 100 % de los recibos previos funcionan. Verificar además que
`data/recibos.json` **no cambió** durante la validación:

```bash
git diff --stat -- data/    # no debe reportar cambios de esquema
```

### 3.6 Pantallas angostas (Edge Case)

En DevTools → Device toolbar, emular un móvil (375 px) y una tablet (768 px) sobre
la vista de detalle de recibo. **Esperado**: el documento se ve completo mediante
scroll horizontal dentro de su contenedor, **sin** deformarse y **sin** romper el
layout de la página del panel.

---

## 4. Escenario P3 — Pantallas de comprobantes del panel consistentes

> User Story 3 · FR-015..FR-020 · SC-007, SC-008

### 4.1 Recorrido de las 5 pantallas (FR-015, SC-007)

Recorrer en este orden y comparar:

1. `/admin/recibos` — listado general de recibos y cuentas
2. `/admin/recibos/cuentas/<cuentaId>` — detalle de cuenta de recibos
3. `/admin/<presupuestoId>` — detalle de presupuesto con sus recibos
4. `/admin/recibos/<reciboId>` — detalle de recibo de cuenta
5. `/admin/<presupuestoId>/recibos/<reciboId>` — detalle de recibo de presupuesto
   (+ los formularios de carga que se abren desde 1, 2 y 3)

**Esperado (FR-015)**: mismos estilos de tarjeta, botón, tipografía y colores de
marca en las cinco. **Esperado (SC-007)**: recorriendo las cinco pantallas, cero
colores y cero tipografías fuera de la identidad corporativa.

Verificación auditable de la migración a tokens (research.md § 9):

```bash
# No deben quedar literales de color de marca como clases arbitrarias en el panel.
# Esperado: sin resultados.
git grep -n -E "\[#(0B1C3E|FF9000|29ABE2)\]" -- app/admin components/admin
```

Los literales de marca solo pueden vivir en `components/admin/recibo-doc.ts`
(desviación acotada del Principio IV, plan.md § Complexity Tracking):

```bash
# Esperado: coincidencias únicamente en components/admin/recibo-doc.ts
git grep -n -E "#(0B1C3E|FF9000|29ABE2)" -- app components
```

### 4.2 Totales destacados (FR-016, SC-008)

En `/admin/recibos/cuentas/<cuentaId>` y en `/admin/<presupuestoId>`:

1. **Total**, **total entregado** y **saldo pendiente** están visibles **sin
   desplazarse** por la página y sin abrir otra vista (SC-008).
2. Cargar recibos hasta que el saldo sea exactamente **cero** → debe haber una
   distinción visual explícita de «cancelado».
3. Cargar un recibo que exceda el total → debe haber una distinción visual
   explícita de **sobrepago** (`sobrepago: true` de `ResumenCuentaRecibo` /
   `ResumenPresupuesto`).
4. Verificar que los números coinciden con la suma manual de los recibos listados
   (no-regresión de FR-021).

### 4.3 Listados y estados vacíos (FR-017, FR-018)

1. En cada listado de recibos, verificar que se identifican de un vistazo
   **número, fecha, monto y forma de pago**, y que las acciones (ver, exportar,
   eliminar) se presentan de forma consistente entre pantallas.
2. Crear una cuenta de recibos **sin** recibos y abrirla; abrir un presupuesto
   **sin** recibos. **Esperado**: estado vacío explícito con la acción principal
   para crear el primer recibo, no un área en blanco.

### 4.4 Errores de validación y confirmaciones (FR-019)

1. En cada formulario (`ReciboForm`, `ReciboStandaloneForm`, `ReciboCuentaForm`,
   `CuentaReciboForm`), enviar datos inválidos: monto `0` o negativo, campos
   obligatorios vacíos, `formaPago: 'Otro'` sin detalle.
   **Esperado**: mensaje de error con el estilo de error del panel, visible y
   **asociado al campo** correspondiente.
2. Presionar «Eliminar» en un recibo y en una cuenta. **Esperado**: modal de
   confirmación con el mismo estilo en ambos casos; al cancelar no se borra nada;
   al confirmar, el borrado en cascada de la cuenta arrastra sus recibos
   (no-regresión de FR-021).

### 4.5 Autenticación del área completa (FR-020)

1. Cerrar sesión (o borrar la cookie de sesión).
2. Intentar abrir directamente cada una de las 5 rutas de § 4.1.
   **Esperado**: redirección a `/admin/login` en todas.
3. Re-ejecutar el **Escenario 0** para confirmar que las rutas de API de cuentas
   siguen protegidas.

---

## 5. Cierre — checklist de Success Criteria

| SC | Criterio | Se valida en | ✅ |
|---|---|---|---|
| **SC-001** | 10/10 recibos exportados sin bordes ni franjas ajenas | § 2.8 | ☐ |
| **SC-002** | Orillas exactas: 0 px recortados, 0 px de margen sobrante | § 2.2 + § 2.3 | ☐ |
| **SC-003** | Pantalla / PDF / imagen sin diferencias de posición, tamaño ni color | § 3.1 | ☐ |
| **SC-004** | Comprobante listo para enviar en ≤ 2 acciones, sin retoque externo | § 2.1 pasos 3–6 | ☐ |
| **SC-005** | Exportación completa en < 3 s | § 2.1 paso 5 | ☐ |
| **SC-006** | 100 % de los recibos previos se ven, imprimen y exportan bien | § 3.5 | ☐ |
| **SC-007** | Cero colores/tipografías fuera de la identidad en las 5 pantallas | § 3.2 + § 4.1 | ☐ |
| **SC-008** | Total / entregado / saldo identificables sin desplazarse | § 4.2 | ☐ |

Y como gate final del plan:

```bash
npm run lint     # debe pasar sin errores
npm run build    # debe compilar sin errores
```

| Gate | Se valida en | ✅ |
|---|---|---|
| Principio I — `/api/cuentas-recibos` autenticada | Escenario 0 | ☐ |
| Principio I — `data/cuentas-recibos.json` ignorado | Escenario 0 | ☐ |
| `npm run lint` + `npm run build` limpios | § 5 | ☐ |

---

## 6. Notas de orden de validación

El orden importa por la dependencia que research.md § 6 documenta: **primero** la
receta de exportación con `await document.fonts.ready`, **después** el cambio de
familia tipográfica, y **revalidar § 2.3 y § 2.5 inmediatamente después** del
cambio de familia. Mientras el documento renderiza en Arial (fuente local) no hay
webfont que incrustar; al activar Montserrat, la exportación pasa a depender de
`embedFonts`, así que un export que pasaba puede empezar a fallar.

El punto de mayor riesgo de regresión del refactor es la **sombra decorativa**: al
eliminar el host oculto fuera de pantalla y exportar el nodo visible, `shadow-lg`
debe haberse movido a un wrapper. Si queda en el nodo raíz del documento, se
rasteriza como halo gris y § 2.3 falla en las cuatro orillas
(research.md § 4, última viñeta).

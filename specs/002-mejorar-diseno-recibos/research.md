# Phase 0 — Research: Mejora de Diseño de Comprobantes y Exportación sin Bordes

**Feature**: `002-mejorar-diseno-recibos` | **Date**: 2026-07-29

Todas las incógnitas técnicas de la spec quedan resueltas en este documento. No
queda ningún `NEEDS CLARIFICATION` abierto. Cada decisión se tomó a partir del
código real del repositorio y del código fuente de la librería instalada
(`node_modules/dom-to-image-more/src/dom-to-image-more.js`, v3.7.2), no de
suposiciones.

---

## 0. Cómo funciona hoy la exportación (hechos, no hipótesis)

La librería en uso es **`dom-to-image-more@^3.7.2`** (confirmado en
`package.json:12` y `types/dom-to-image-more.d.ts`). **No** hay `html2canvas`,
`html-to-image` ni `dom-to-image` en el proyecto (verificado por búsqueda en todo
el árbol: los únicos consumidores son
`app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx:14` y
`app/admin/[id]/ExportImageButton.tsx:14`).

La llamada actual es:

```ts
// app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx:11-20
const el = document.getElementById('export-root') as HTMLElement;
if (!el) return;
const domtoimage = (await import('dom-to-image-more')).default;
const blob = await domtoimage.toBlob(el, {
  scale: 2,
  bgcolor: '#ffffff',
  width: 1002,
  height: 802,
});
```

El pipeline interno de la librería, leído en su fuente:

1. **`toSvg`** (líneas 99-201) → `cloneNode` → `embedFonts` → `inlineImages` →
   `applyOptions` → `makeSvgDataUri`.
2. **`applyOptions`** (líneas 147-172) escribe sobre el **clon**:
   `clone.style.backgroundColor = '#ffffff'`, `clone.style.width = '1002px'`,
   `clone.style.height = '802px'`, y **después** aplica las claves de
   `options.style` (líneas 157-161). Este orden es la palanca de la corrección:
   `options.style` **gana** sobre `options.width/height`.
3. **`makeSvgDataUri`** (líneas 174-200) usa `options.width || util.width(node)` y
   construye:
   `<svg width="1002" height="802"><foreignObject width="1002" height="802">…</foreignObject></svg>`
   como `data:image/svg+xml`. **No emite `viewBox`.**
4. **`draw`** (líneas 311-354):
   ```js
   const scale = typeof options.scale !== 'number' ? 1 : options.scale;  // 2
   const canvas = newCanvas(domNode, scale);        // 1002*2 × 802*2 = 2004×1604
   ctx.imageSmoothingEnabled = false;
   ctx.scale(scale, scale);                         // ctx.scale(2, 2)
   ctx.drawImage(image, 0, 0);
   ```
   y **`newCanvas` pinta el canvas entero con `bgcolor` antes de dibujar**
   (líneas 346-350): `ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 2004, 1604)`.

---

## 1. Causa raíz del borde indeseado en la imagen exportada

**Decision**: La causa raíz es la combinación `scale: 2` + `width/height`
declarados en píxeles CSS + `bgcolor` opaco. Produce un **blit escalado sobre una
base blanca opaca**, y el borde exterior del blit queda con cobertura parcial que
se mezcla con esa base. Se corrige eliminando `scale` y haciendo que el
`drawImage` sea 1:1 (ver decisión 2).

**Rationale**:

El SVG generado tiene tamaño intrínseco 1002×802 px CSS y **carece de `viewBox`**,
por lo que no es escalable como vector desde el punto de vista del `<img>`: la UA
lo rasteriza a su tamaño intrínseco. Luego `ctx.scale(2,2); drawImage(img, 0, 0)`
mapea ese bitmap de 1002×802 al rectángulo de dispositivo `[0,2004]×[0,1604]`. En
el contorno exterior del rectángulo destino el remuestreo deja píxeles con
**cobertura fraccional**, que se componen (`source-over`) contra lo que ya hay
debajo — y debajo hay un `fillRect` **blanco opaco** de todo el canvas.

Consecuencia observable, exactamente la reportada en la spec:

- En los tres lados donde el documento es blanco, la mezcla es blanco-sobre-blanco
  y no se ve nada.
- En el **borde inferior**, donde el `<footer>` navy (`#0B1C3E`) llega a
  `bottom: 0` (`ReciboDocument.tsx:191-202`), la mezcla del último renglón navy
  con el blanco de base produce **una línea clara de 1–2 px de dispositivo entre
  la franja navy y el borde del archivo**. Eso es literalmente FR-003: «sin dejar
  una línea blanca o gris entre la franja y el borde de la imagen».

Dos agravantes verificados en el mismo bloque:

- **`ctx.imageSmoothingEnabled = false`** (línea 320) no evita el mezclado del
  contorno; solo desactiva la interpolación **interior**. Su efecto real es que
  todo el export se convierte en un **reescalado 2× nearest-neighbour** de un
  bitmap de 1002×802: texto con bordes duros/aliasados y hairlines de 1 px (los
  separadores `#E5E7EB` de `ReciboDocument.tsx:131,136` y la línea de firma de
  la línea 183) que se duplican de forma desigual. Ese es el mecanismo por el que
  aparecen «líneas» que en pantalla se ven limpias.
- **`width`/`height` hardcodeados y desacoplados de la caja real.**
  `makeSvgDataUri` usa el valor de la *opción*, no el medido. Los `1002×802` están
  repetidos en cuatro lugares independientes (`ReciboDocument.tsx:50-51`,
  `ReciboPrint.tsx:9` en `@page`, y las opciones de `toBlob` en dos copias del
  botón). Si la caja real difiere aunque sea en una fracción de píxel —fallback de
  tipografía, un `montoEnLetras` largo que agrega un renglón, cambio de
  `line-height` en el rediseño— el lienzo y el contenido dejan de coincidir y se
  obtiene contenido recortado de un lado y franja blanca del otro, que es el otro
  síntoma de FR-002.

**Alternatives considered**:

- *Hipótesis: `box-shadow` filtrándose al canvas.* **Descartada por inspección.**
  El `shadow-lg` está en la instancia de pantalla (`ReciboPrint.tsx:17`), no en el
  nodo exportado (`ReciboExportView.tsx:5` pasa `className=''`). Es la causa
  clásica en reportes de `html2canvas`, pero no aplica aquí.
- *Hipótesis: `border` global de Tailwind Preflight.* **Descartada.** Preflight de
  Tailwind v4 fija `border-width: 0`, y el estilo computado del clon hereda ese
  `0px`. `app/globals.css` no declara ningún `border` en `*`.
- *Hipótesis: `outline` del focus ring.* **Descartada.** `app/globals.css:46-50`
  aplica el outline solo a `*:focus-visible`; el clon no coincide con ese selector.
- *Hipótesis: recorte por `border-radius` del contenedor.* **Descartada.** El
  nodo raíz `#export-root` no tiene `border-radius` (`ReciboDocument.tsx:45-58`).
- *Hipótesis: margen por defecto de `<body>` dentro del `foreignObject`.*
  **Descartada.** El clon se serializa como un `<div>` suelto dentro del
  `foreignObject`, sin `html`/`body` envolventes, así que no hay margen de 8 px.

---

## 2. Enfoque elegido para la exportación de imagen

**Decision**: Mantener `dom-to-image-more` y aplicar la **receta canónica de
transform-scale**: pasar `width`/`height` ya en **píxeles finales** y escalar el
contenido con CSS `transform`, sin usar nunca la opción `scale`.

```ts
const SCALE = 2;                     // constante, NO devicePixelRatio (FR-004)
const node = docRef.current!;        // ref de React, no getElementById
await document.fonts.ready;          // FR-005
const { width, height } = RECIBO_DOC; // fuente única; 1002 × 802 hoy

const blob = await domtoimage.toBlob(node, {
  width:  width  * SCALE,            // 2004  → canvas.width  (scale interno = 1)
  height: height * SCALE,            // 1604  → canvas.height
  bgcolor: RECIBO_DOC.background,    // '#FFFFFF', idéntico al fondo del documento
  style: {
    transform: `scale(${SCALE})`,
    transformOrigin: 'top left',
    width:  `${width}px`,            // el clon conserva su layout de 1002×802
    height: `${height}px`,
  },
});
```

**Rationale** — por qué esto elimina el borde, punto por punto contra la fuente:

1. Al **no** pasar `scale`, `draw` toma `scale = 1` (línea 316), así que
   `ctx.scale(1,1)` y **`drawImage` es un blit 1:1 sin transformación**. Sin
   remuestreo no hay contorno de cobertura parcial y por tanto **no hay costura**
   contra el fondo blanco. → FR-001, FR-003.
2. `newCanvas` calcula `canvas.width = 2004`, `canvas.height = 1604` (líneas
   329-344), y `makeSvgDataUri` emite `<svg width="2004" height="1604">` con un
   `foreignObject` de la misma medida: **lienzo y fuente coinciden exactamente**.
   → FR-002.
3. `applyOptions` fija primero `clone.style.width = '2004px'` y luego lo
   **sobrescribe** con `options.style.width = '1002px'` (líneas 151-161, orden
   verificado). El clon queda maquetado a 1002×802 y se agranda a 2× mediante
   `transform`, que es una transformación **vectorial** aplicada por el
   renderizador SVG. Texto, `<svg>` de iconos y hairlines se rasterizan a
   resolución nativa de 2004×1604 en lugar de reescalarse. Esto además revierte el
   efecto de `imageSmoothingEnabled = false`, que en el blit 1:1 es inocuo.
   → FR-004, y mejora la nitidez que FR-011 exige.
4. El resultado no depende de `devicePixelRatio` ni del zoom del navegador: el
   tamaño intrínseco del SVG proviene de atributos en px, y `SCALE` es una
   constante del código. Dos exportaciones consecutivas a distintos zooms
   producen archivos idénticos. → FR-004, SC-002.
5. `bgcolor` se mantiene **igual al fondo del propio documento**
   (`#FFFFFF`), de modo que si alguna vez sobreviviera una costura sub-píxel en
   los tres lados blancos, sería invisible por construcción.

**Defensa adicional para el borde inferior (cinturón y tirantes)**: el `<footer>`
navy se pinta con **1 px de sobre-recorrido** (`bottom: -1px` o
`height: RECIBO_DOC.footerHeight + 1`) dentro del contenedor raíz, que ya tiene
`overflow: hidden` (`ReciboDocument.tsx:54`). El recorte del contenedor absorbe el
excedente, así que el archivo conserva exactamente 1002×802 px lógicos —FR-002 se
mantiene, no se recorta contenido ni se agrega margen— pero se garantiza que el
último renglón del canvas sea navy puro y no una mezcla. Es la técnica de *bleed*
de preprensa aplicada al rasterizado.

**Alternatives considered**:

- **`scale: 2` (statu quo)** — rechazado: es el defecto.
- **`devicePixelRatio` como factor de escala** — rechazado: reintroduce
  exactamente la no-determinación que FR-004 prohíbe (el mismo recibo daría
  archivos de distinto tamaño en el portátil y en el monitor externo del dueño).
- **Cambiar a `html-to-image` o `html2canvas`** — rechazado por Constitución V
  («no se agregan dependencias si la funcionalidad puede resolverse con el stack
  existente»). Además `html2canvas` reimplementa el layout en JS y es *más*
  propenso a divergencias respecto de la pantalla, lo que perjudica FR-011.
- **`toCanvas` + recortar 1 px con `ctx.drawImage(canvas, 1, 1, w-2, h-2, …)`** —
  rechazado: contradice FR-002 («0 píxeles de contenido recortado») y oculta la
  causa en lugar de corregirla.
- **Añadir `viewBox` al SVG monkey-patcheando la librería** — rechazado:
  requeriría un fork o un parche de `node_modules`, contra Constitución V. La
  receta de transform-scale consigue el mismo efecto usando solo la API pública.
- **Render server-side con Puppeteer / satori / `@vercel/og`** — rechazado por
  Constitución V y por la asunción explícita de la spec («sin generación en
  servidor»); implicaría Chromium en la imagen Docker.

---

## 3. Espera de fuentes e imágenes antes de exportar

**Decision**: `await document.fonts.ready` antes de llamar a `toBlob`, y dejar
activados los pasos `embedFonts` e `inlineImages` de la librería (es decir, **no**
pasar `disableEmbedFonts` ni `disableInlineImages`).

**Rationale**: `toSvg` invoca `embedFonts` e `inlineImages` de forma condicional
(líneas 110-111) pero **no espera** a `document.fonts.ready`; si una `@font-face`
todavía está en vuelo, el `foreignObject` maqueta con métricas de fallback y el
salto de línea del concepto o del monto en letras difiere de la pantalla. El
`await` es una línea y cierra FR-005 de forma determinista. Las fuentes de
`next/font` se auto-hospedan bajo `/_next/static/media/*.woff2` (mismo origen),
por lo que `document.styleSheets[].cssRules` es legible y el `fetch` que hace
`embedFonts` para incrustarlas como data-URI no encuentra restricción CORS. El
logo `/brand/logo_name_completo_dark.svg` también es mismo origen, así que
`inlineImages` lo incrusta correctamente.

**Alternatives considered**:

- *Confiar en `display: 'swap'`* — rechazado: `swap` garantiza que se *vea* texto,
  no que se vea con la tipografía correcta; es precisamente el escenario que el
  Edge Case de la spec describe.
- *Un `setTimeout` fijo antes de exportar* — rechazado: no determinista y añade
  latencia contra SC-005.
- *Precargar con `document.fonts.load('700 16px <familia>')`* — no necesario como
  paso separado: el documento en pantalla ya usa esos pesos, así que
  `document.fonts.ready` cubre el caso. Se deja anotado como refuerzo opcional si
  el rediseño introdujera un peso que no aparezca en pantalla.

---

## 4. Nodo objetivo de la exportación

**Decision**: Exportar el **nodo del documento que ya está en pantalla**,
alcanzado por `ref` de React, y **eliminar** el host oculto fuera de pantalla
(`ReciboExportView.tsx` y los wrappers `left:-9999px` de las dos páginas de
detalle).

**Rationale**:

- Hoy el comprobante se renderiza **dos veces** por página: la instancia visible
  (`ReciboPrint`) y una copia oculta en
  `<div style={{position:'absolute', left:'-9999px'}}>`
  (`app/admin/[id]/recibos/[reciboId]/page.tsx:40` y
  `app/admin/recibos/[reciboId]/page.tsx:57`). Duplica el DOM y el trabajo de
  fuentes/logo sin beneficio.
- El `id="export-root"` es un identificador **global y colisionante**:
  `components/admin/PresupuestoExportView.tsx:66` usa exactamente el mismo id. En
  cualquier página que monte ambos, `getElementById` devuelve el primero en orden
  de documento — un bug latente de «exporté el documento equivocado». Un `ref`
  elimina la clase entera de problemas y satisface FR-006 (misma calidad para
  recibos de presupuesto y de cuenta) con **un solo** camino de código.
- Exportar el nodo visible hace que FR-011 sea cierto **por construcción**: la
  imagen no puede divergir de la pantalla porque es la pantalla. Con dos árboles
  separados, la paridad es una convención que hay que mantener a mano.
- Requisito de diseño derivado: la sombra decorativa (`shadow-lg`, hoy en
  `ReciboPrint.tsx:17` **sobre el propio `ReciboDocument`**) debe moverse a un
  **wrapper**, para que el nodo exportado no la tenga. Si quedara en el nodo raíz,
  `box-shadow` se pintaría dentro del `foreignObject` y produciría precisamente el
  halo gris que FR-001 prohíbe — es decir, el statu quo evita este problema solo
  gracias al host duplicado que vamos a eliminar. **Este es el punto de mayor
  riesgo de regresión del refactor y debe verificarse explícitamente** (paso 4 de
  `quickstart.md`).

**Alternatives considered**:

- *Mantener el host oculto y solo corregir las opciones* — rechazado: deja en pie
  la colisión de `id`, el doble render y el riesgo de deriva entre las dos copias
  del documento.
- *Mover el host oculto a un portal con `visibility: hidden`* — rechazado:
  `visibility: hidden` se copia al estilo computado del clon y produciría una
  imagen vacía.

---

## 5. Enfoque de CSS/layout para el rediseño del documento

**Decision**: Mantener **estilos inline con valores resueltos** en
`ReciboDocument.tsx`, con un lienzo de tamaño fijo, y centralizar geometría,
paleta y familia tipográfica en un módulo único `components/admin/recibo-doc.ts`.
Layout con Flexbox; **evitar CSS Grid** en el documento exportado.

**Rationale**:

- El clon serializado dentro del `foreignObject` **no ve la hoja de Tailwind ni
  las custom properties del `:root`**. Cualquier clase utilitaria o
  `var(--color-*)` sin resolver se pierde en la imagen. Los inline con literales
  son el único mecanismo que garantiza FR-011. Esto es la desviación del Principio
  IV registrada en Complexity Tracking; se acota extrayendo los literales a un
  módulo derivado de los tokens de `app/globals.css` en lugar de dispersarlos.
- **Evitar CSS Grid en el documento**: `ReciboDocument.tsx:156` usa hoy
  `display: 'grid', gridTemplateColumns: '1fr 280px'` para el bloque
  Observaciones + Firma. El soporte de Grid dentro de `foreignObject` es el punto
  más frágil del rasterizado en SVG y una fuente conocida de divergencia entre
  pantalla e imagen. Se reemplaza por Flexbox con `flex: 1` + ancho fijo, que es
  equivalente aquí y ya se usa sin problemas en el resto del documento.
- Tamaño fijo (no responsive) en el documento: es un comprobante de proporciones
  definidas; la adaptación a pantallas angostas se resuelve en el **contenedor**
  (scroll horizontal, como ya hace `overflow-x-auto`), no deformando el documento.
  Cubre el Edge Case de móvil/tablet sin tocar FR-011.
- Textos largos: `wordBreak: 'break-word'` + `whiteSpace: 'normal'` (ya presentes
  en `ReciboRow`, `ReciboDocument.tsx:223-224`) se conservan; el rediseño debe
  además dar al bloque de observaciones una altura mínima estable para que su
  ausencia no descoloque firma ni pie (FR-013, escenario 3 de la US2).

**Alternatives considered**:

- *Migrar el documento a clases Tailwind* — rechazado: no sobrevive a la
  serialización del clon (ver Complexity Tracking, alternativa (a)).
- *Inyectar los tokens en el clon con `onclone`* — rechazado: `cloneNode` descarta
  explícitamente los nodos `<style>` (`dom-to-image-more.js:363`), y añadir una
  capa de composición de CSS contradice el Principio V.
- *Documento con layout fluido y `aspect-ratio`* — rechazado: introduce
  dimensiones fraccionarias, que es una de las vías por las que aparecen las
  franjas de FR-002.

---

## 6. Tipografía corporativa: defecto verificado

**Decision**: Corregir la familia del documento para que use realmente la
tipografía corporativa, referenciándola por la CSS variable de `next/font` con
cadena de fallback: `var(--font-montserrat), Montserrat, Arial, sans-serif`.

**Rationale** — hallazgo verificado, no supuesto: `ReciboDocument.tsx:33` declara

```ts
const FONT = "'Montserrat', Arial, sans-serif";
```

pero `app/layout.tsx` carga Montserrat con `next/font/google` pasando **solo**
`variable: '--font-montserrat'`. `next/font` auto-hospeda la fuente y la registra
bajo un **nombre de familia generado con hash**, accesible únicamente a través de
esa CSS variable (que `app/globals.css:12` expone además como token de tema
`--font-montserrat`). La cadena literal `'Montserrat'` **no coincide con ninguna
familia registrada**, así que el comprobante se renderiza hoy en **Arial** en las
tres salidas. Es un incumplimiento directo de FR-010 («exclusivamente la paleta y
las tipografías corporativas»), y explica por qué FR-011 «pasa» hoy por accidente:
las tres salidas coinciden porque las tres caen al mismo fallback.

Consecuencia de planificación importante: **corregir la tipografía activa el
riesgo que cubre la decisión 3.** Mientras el documento use Arial (fuente local
del sistema) no hay nada que incrustar ni esperar. En cuanto use una webfont real,
la exportación pasa a depender de que `embedFonts` incruste el `woff2` y de que
`document.fonts.ready` haya resuelto. Las tareas deben ordenarse así: primero la
receta de exportación + el `await fonts.ready`, después el cambio de familia, y
revalidar la exportación inmediatamente después del cambio de familia.

Nota de implementación: `dom-to-image-more` copia estilos **computados**, y
`getComputedStyle(node).fontFamily` devuelve la variable **ya resuelta** al nombre
hasheado, de modo que el clon recibe la familia literal correcta. La cadena de
fallback se conserva por robustez.

**Alternatives considered**:

- *Cargar Montserrat desde el CDN de Google con un `<link>`* — rechazado: rompe el
  auto-hospedaje de `next/font` (peor performance y privacidad) y una `@font-face`
  de origen cruzado hace fallar la incrustación de `embedFonts` por CORS, lo que
  degradaría la exportación.
- *Dejar Arial y declararlo tipografía del comprobante* — rechazado: contradice
  FR-010 y el Principio IV, que nombra Montserrat/Open Sans como identidad.
- *Incrustar el `woff2` como data-URI a mano en el documento* — rechazado:
  duplica bytes en cada render y `embedFonts` ya lo hace en el momento de
  exportar.

---

## 7. Fidelidad impresión vs. exportación

**Decision**: Derivar el `@page { size }` de la **misma** constante
`RECIBO_DOC` que usa el documento y la exportación; unificar el ocultado de
controles en impresión con **un solo** mecanismo (la variante `print:hidden` de
Tailwind, ya usada en `app/admin/layout.tsx`), retirando la clase `.no-print`
ad-hoc.

**Rationale**:

- `ReciboPrint.tsx:9` declara `@page { size: 1002px 802px; margin: 0 }` con los
  números repetidos a mano; cualquier ajuste del rediseño que cambie la altura del
  documento y olvide este literal produce una página impresa con margen o con
  corte, rompiendo FR-011 entre la salida de impresión y las otras dos.
- Hoy conviven **dos convenciones** para lo mismo:
  `app/admin/layout.tsx:26,87` usa `print:hidden` (Tailwind) para cabecera y pie
  del panel, mientras las barras de acciones usan `.no-print`, una clase definida
  **solo** dentro del `<style>` de `ReciboPrint` y **solo** bajo `@media print`
  (`ReciboPrint.tsx:12`). Es decir, `.no-print` únicamente funciona si hay un
  `ReciboPrint` montado en la página. Unificar en `print:hidden` elimina esa
  dependencia implícita y cierra FR-014 de forma verificable.
- `-webkit-print-color-adjust: exact` (`ReciboPrint.tsx:11`) es **necesario** y se
  conserva: sin él, los navegadores descartan los fondos de color al imprimir y el
  pie navy desaparecería del PDF, rompiendo FR-011.

**Alternatives considered**:

- *Definir `.no-print` globalmente en `app/globals.css`* — viable, pero mantiene
  dos convenciones para un mismo objetivo; se prefiere converger en la utilidad
  nativa de Tailwind que el layout del panel ya usa.
- *Generar el PDF con una librería en cliente* — rechazado por Constitución V y
  por la asunción de la spec de que el PDF sigue saliendo del flujo de impresión
  nativo.

---

## 8. Reporte de errores y nombre del archivo

**Decision**: El hook de exportación devuelve estado `{ loading, error }` y la UI
muestra el error con el estilo de error del panel. El nombre del archivo se
mantiene derivado del número de recibo con relleno a 4 dígitos:
`recibo-0007.png`.

**Rationale**: Hoy `catch (err) { console.error(...) }`
(`ReciboExportImageButton.tsx:27-29`) deja al dueño sin descarga y sin mensaje,
exactamente el escenario que FR-007 prohíbe. Peor: el `if (!el) return` de la
línea 12 está **dentro** del `try`, así que el `finally` limpia `loading` y el
botón vuelve a su estado normal como si hubiera funcionado. El nombrado actual
(`recibo-${String(numero).padStart(4,'0')}.png`, línea 23) ya cumple FR-008 y se
conserva; se traslada al módulo compartido para que las dos rutas lo hereden.

**Alternatives considered**:

- *`alert()` en el `catch`* — rechazado: inconsistente con el estilo del panel que
  FR-019 exige.
- *Toast global* — rechazado por ahora: no existe infraestructura de toasts en el
  proyecto y añadirla contradice el Principio V; el error inline junto al botón
  alcanza para un único usuario.

---

## 9. Tokens y consistencia visual del panel

**Decision**: Migrar las pantallas de comprobantes a utilidades de token
(`bg-primary`, `text-secondary`, …) derivadas del bloque `@theme` de
`app/globals.css`, reemplazando las clases arbitrarias con literales hexadecimales.

**Rationale**: `app/globals.css:3-15` ya define `--color-primary: #0B1C3E`,
`--color-secondary: #FF9000`, `--color-tertiary: #29ABE2` dentro de `@theme`, lo
que en Tailwind v4 genera automáticamente las utilidades correspondientes. Sin
embargo, las pantallas usan literales repetidos: `bg-[#0B1C3E]`,
`text-[#29ABE2]`, `bg-[#FF9000]` (p. ej. `app/admin/recibos/page.tsx:58,74,82`,
`app/admin/layout.tsx:26,43`, `ReciboExportImageButton.tsx:38`). Es deriva visual
del tipo que el Principio IV prohíbe y hace imposible auditar la paleta (SC-007).
Los grises y colores de estado (`green-*`, `red-*`, `gray-*`) se mantienen como
escala de Tailwind: son semánticos de UI, no identidad de marca.

**Alternatives considered**:

- *Dejar los literales y solo homogeneizarlos* — rechazado: no cumple SC-007 de
  forma auditable.
- *Añadir tokens de estado (`--color-success`, `--color-danger`) al `@theme`* —
  fuera de alcance de esta feature; se anota como posible mejora futura.

---

## Resumen de decisiones

| # | Incógnita | Decisión |
|---|---|---|
| 1 | Causa raíz del borde | `scale: 2` + `bgcolor` opaco → blit escalado con cobertura parcial en el contorno, mezclado con la base blanca; visible como línea clara bajo el pie navy |
| 2 | Enfoque de exportación | `dom-to-image-more` con `width/height` en px finales + `style.transform: scale(2)`, **sin** la opción `scale`; blit 1:1; `bgcolor` = fondo del documento; 1 px de bleed en el pie |
| 3 | Espera de recursos | `await document.fonts.ready`; `embedFonts`/`inlineImages` activos (mismo origen, sin CORS) |
| 4 | Nodo objetivo | El documento **en pantalla** vía `ref`; se elimina el host `left:-9999px` y el `id="export-root"` colisionante; la sombra pasa a un wrapper |
| 5 | CSS/layout del documento | Inline con valores resueltos, lienzo fijo, Flexbox (no Grid), constantes en `components/admin/recibo-doc.ts` |
| 6 | Tipografía | Defecto verificado: hoy renderiza Arial. Usar `var(--font-montserrat)`; reordenar tareas porque activa la dependencia de incrustación de fuentes |
| 7 | Impresión vs. imagen | `@page size` derivado de `RECIBO_DOC`; unificar en `print:hidden`; conservar `print-color-adjust: exact` |
| 8 | Errores y nombre | Hook con `{ loading, error }` y error visible en el panel; `recibo-NNNN.png` |
| 9 | Tokens del panel | Migrar literales `#0B1C3E`/`#FF9000`/`#29ABE2` a utilidades de token |

**Incógnitas abiertas: ninguna.** Todas las decisiones están tomadas con la
opción mejor respaldada por el código existente y documentadas arriba.

---
description: "Task list for feature 002-mejorar-diseno-recibos"
---

# Tasks: Mejora de Diseño de Comprobantes y Exportación sin Bordes

**Input**: Design documents from `/specs/002-mejorar-diseno-recibos/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for
user stories), [research.md](./research.md), [data-model.md](./data-model.md),
[contracts/README.md](./contracts/README.md), [quickstart.md](./quickstart.md)

**Constitution**: `.specify/memory/constitution.md` v1.0.0 — Principio I (seguridad
del panel) es un **gate bloqueante** (plan.md § «Principio I — remediación
obligatoria»); Principio IV tiene una desviación acotada y ya justificada
(plan.md § Complexity Tracking).

**Tests**: NO se generan tareas de tests automatizados. El proyecto no tiene runner
de tests (plan.md § Technical Context → Testing) y la spec no pide TDD. El
mecanismo de aceptación es la validación manual de [quickstart.md](./quickstart.md),
referenciada desde tareas concretas al cierre de cada historia y en la fase de
Polish. Verificación de código: `npm run lint` + `npm run build`.

**Sin tareas de datos**: [data-model.md](./data-model.md) es explícito — cero
cambios de esquema, migración, backfill o transformación. `types/recibo.ts`,
`types/cuenta-recibo.ts`, `lib/recibos-store.ts`, `lib/cuentas-recibos-store.ts` y
`lib/numero-a-letras.ts` **no se tocan**. La única tarea «de datos» es higiene de
repositorio (`.gitignore`, T004).

**Sin tareas de contrato**: [contracts/README.md](./contracts/README.md) es
explícito — ninguna interfaz externa cambia. El arreglo de
`/api/cuentas-recibos` es **cableado de autenticación** (matcher de `proxy.ts` +
rama protegida), no un cambio de contrato → T003.

**Organization**: Las tareas se agrupan por historia de usuario para permitir
implementación y validación independiente de cada una.

## Format: `[ID] [P?] [Story?] [E:cli=…|model=…|effort=…|context=…] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: `[US1]` / `[US2]` / `[US3]`. Las fases Setup, Foundational y Polish **no** llevan etiqueta de historia
- **[E:…]**: asignación de ejecutor (cli / modelo canónico / effort / ventana de contexto), obligatoria en toda tarea
- Cada descripción incluye la ruta exacta del archivo

> **Nota sobre las etiquetas `[E:…]`** — el catálogo global `~/.specify/models.json`
> quedó **fuera de los directorios permitidos de la sesión** que generó este archivo
> (lecturas bloqueadas por sandbox), por lo que no pudo leerse. Las asignaciones de
> abajo se derivaron de: (a) las integraciones realmente instaladas
> (`.specify/integrations/claude.manifest.json` → `cli=claude`), y (b) el catálogo
> de modelos verificado del proyecto (`.specify/models.json`, familia Anthropic:
> Opus 5, Sonnet 5, Haiku 4.5), usando la forma canónica `anthropic/<modelo>`.
> Todas las asignaciones usan un único CLI y `context ≤ 200000`, que es el límite
> más conservador de la familia. **Antes de `/speckit-implement`, verificar los tres
> keys de modelo (`anthropic/claude-opus-5`, `anthropic/claude-sonnet-5`,
> `anthropic/claude-haiku-4.5`) y los `effort_levels` contra el catálogo v2 global.**

## Path Conventions

Aplicación Next.js App Router monolítica (plan.md § Structure Decision). Rutas
relativas a la raíz del repositorio: `app/`, `components/`, `lib/`, `types/`,
`docs/`. No aplica ninguna de las plantillas genéricas single-project /
backend+frontend / mobile.

> **Corrección de rutas respecto a plan.md § Project Structure** — verificado
> contra el árbol real: `ReciboForm.tsx`, `ReciboLista.tsx` y
> `ReciboDeleteButton.tsx` viven en **`app/admin/[id]/`**, no en
> `components/admin/`. `ConfirmModal.tsx`, `CuentaReciboForm.tsx`,
> `ReciboCuentaForm.tsx`, `ReciboStandaloneForm.tsx`, `ReciboDocument.tsx`,
> `ReciboPrint.tsx`, `ReciboExportView.tsx` y `PresupuestoExportView.tsx` sí están
> en `components/admin/`. Las tareas de abajo usan las rutas reales.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: crear la infraestructura compartida que consumen todas las fases: la
fuente única de geometría/paleta/tipografía del documento y el tipado de las
opciones de `dom-to-image-more` que la receta corregida necesita.

- [X] T001 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Crear `components/admin/recibo-doc.ts` como fuente única de presentación del comprobante, con la forma de data-model.md § 2.1: `RECIBO_DOC` (`width: 1002`, `height: 802`, `background: '#FFFFFF'`, `footerHeight`, `padding: '40px 48px 52px'`), `EXPORT_SCALE = 2` (constante literal, **nunca** `devicePixelRatio`), `COLORS` (`navy '#0B1C3E'`, `orange '#FF9000'`, `tertiary '#29ABE2'`, `gray '#4B5563'`, `grayLight '#9CA3AF'`, `rule '#E5E7EB'`), `FONT.family = 'var(--font-montserrat), Montserrat, Arial, sans-serif'` y `DOC.cuit = '30-71945595-2'`; derivar los valores de los tokens `@theme` de `app/globals.css` y documentar en comentarios las 5 invariantes de data-model.md § 2.2 (enteros, `background` idéntico al `bgcolor`, `EXPORT_SCALE` literal, ningún hex de marca fuera de este módulo, `@page` derivado). No incluir teléfono ni email: siguen viniendo de `siteConfig` en `data/content.ts` (Principio II)
- [X] T002 [P] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=32000] Ampliar la interfaz `Options` en `types/dom-to-image-more.d.ts` para cubrir exactamente lo que usa la receta corregida: `width?: number`, `height?: number`, `bgcolor?: string`, `style?: Partial<CSSStyleDeclaration> | Record<string, string>`, `quality?: number`, `filter?: (node: Node) => boolean`, `cacheBust?: boolean`; mantener `scale?: number` declarado pero anotado con un comentario `@deprecated — no usar: reintroduce el borde de FR-001/FR-003 (research.md § 1)`

**Checkpoint**: existe la fuente única de constantes del documento y el tipado
permite pasar `width`/`height`/`style` sin `any`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: prerrequisitos bloqueantes de **todas** las historias. Incluye (a) el
gate de seguridad del Principio I, que plan.md exige cerrar **antes de cualquier
trabajo visual**, y (b) el núcleo compartido de exportación/documento: la receta
diagnosticada, la espera de `document.fonts.ready` y la corrección de la familia
tipográfica. US1 depende de la receta; US2 depende del mismo módulo de documento.

**⚠️ CRITICAL**: ninguna tarea de historia de usuario puede comenzar hasta que esta
fase esté completa.

**⚠️ ORDEN INTERNO OBLIGATORIO** (research.md § 6, quickstart.md § 6): primero la
receta de exportación + `await document.fonts.ready` (T005), **después** el cambio
de familia tipográfica (T007), y revalidar la exportación inmediatamente después.
Mientras el documento renderiza en Arial (fuente local) no hay webfont que
incrustar; al activar Montserrat la exportación pasa a depender de `embedFonts`,
así que un export que pasaba puede empezar a fallar.

### Gate de seguridad — Principio I (bloqueante, primero)

- [X] T003 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=64000] Autenticar `/api/cuentas-recibos` en `proxy.ts`: agregar `'/api/cuentas-recibos/:path*'` al array `config.matcher` (hoy línea 32, cubre solo `/admin`, `/api/presupuestos`, `/api/recibos`, `/api/auth`) y agregar `pathname.startsWith('/api/cuentas-recibos')` a la condición de la rama protegida (hoy líneas 13-17), de modo que las peticiones sin cookie de sesión reciban `401` como el resto de las rutas de API. No modificar `app/api/cuentas-recibos/route.ts` ni `app/api/cuentas-recibos/[id]/route.ts`: el payload de request/response queda byte-idéntico (contracts/README.md). Verificar con quickstart.md § Escenario 0 (ambos `curl` sin sesión deben fallar y la cuenta «TEST NO AUTH» no debe crearse)
- [X] T004 [P] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=32000] Agregar `/data/cuentas-recibos.json` y `/data/cuentas-recibos.json.tmp` a `.gitignore` bajo un comentario `# datos de cuentas de recibos (generados en runtime)`, junto a las reglas ya existentes de `presupuestos.json` y `recibos.json` (líneas 46-52); verificar con `git check-ignore -v data/cuentas-recibos.json` y que `git status --short data/` no lo liste

### Núcleo compartido de exportación y documento

- [X] T005 [E:cli=claude|model=anthropic/claude-opus-5|effort=high|context=200000] Crear `components/admin/useReciboExport.ts` con la receta canónica transform-scale de research.md § 2, que es **la corrección de la causa raíz del borde**: recibir el nodo objetivo por `RefObject<HTMLElement>`; `await document.fonts.ready` antes de rasterizar (FR-005); importar `dom-to-image-more` dinámicamente y llamar `toBlob(node, { width: RECIBO_DOC.width * EXPORT_SCALE, height: RECIBO_DOC.height * EXPORT_SCALE, bgcolor: RECIBO_DOC.background, style: { transform: 'scale(' + EXPORT_SCALE + ')', transformOrigin: 'top left', width: RECIBO_DOC.width + 'px', height: RECIBO_DOC.height + 'px' } })`; **nunca** pasar la opción `scale` (es el defecto: fuerza `ctx.scale(2,2)` sobre un `fillRect` blanco opaco y deja la costura de cobertura parcial en el contorno) y **nunca** derivar la escala de `devicePixelRatio` ni del zoom (FR-004); dejar `embedFonts`/`inlineImages` activos (mismo origen, sin CORS); exponer `{ loading: boolean; error: string | null; exportar: () => Promise<void> }` con el guard de nodo ausente **fuera** del `try` para que un fallo no limpie `loading` como si hubiera funcionado (FR-007, research.md § 8); descargar el blob con nombre `recibo-NNNN.png` derivado de `numero` con `padStart(4, '0')` (FR-008), trasladando el nombrado desde `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx:23`
- [X] T006 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Crear `components/admin/ReciboExportImageButton.tsx` unificado, que reemplaza a las dos copias hoy existentes: recibe el `ref` del nodo del documento y el `numero` del recibo, consume `useReciboExport` (T005), muestra estado de carga y **renderiza el `error` de forma visible junto al botón** con el estilo de error del panel (FR-007, FR-019 — no `console.error`, no `alert`); usar utilidades de token (`bg-primary`, `bg-secondary`, …) en vez de los literales `bg-[#…]` que usa la copia actual; marcar el botón con `print:hidden` (FR-014)
- [X] T007 [E:cli=claude|model=anthropic/claude-opus-5|effort=high|context=200000] Refactorizar `components/admin/ReciboDocument.tsx` para consumir `components/admin/recibo-doc.ts` **sin rediseñar el layout todavía** (el rediseño visual es US2/T019): convertirlo a `forwardRef<HTMLDivElement>` para que el nodo en pantalla sea exportable por `ref` (research.md § 4) y eliminar la prop `id="export-root"`; reemplazar los `1002`/`802` hardcodeados (hoy líneas 50-51) por `RECIBO_DOC.width`/`RECIBO_DOC.height` y el padding por `RECIBO_DOC.padding`; reemplazar las constantes locales `NAVY`/`ORANGE`/`GRAY`/`GRAY_LIGHT` por `COLORS`; y **corregir el defecto tipográfico verificado**: sustituir la familia literal `"'Montserrat', Arial, sans-serif"` (hoy línea 33) por `FONT.family` (`var(--font-montserrat), …`), porque `next/font` registra Montserrat solo bajo un nombre hasheado accesible vía esa CSS variable y hoy **todo el comprobante se renderiza en Arial**, incumpliendo FR-010 (research.md § 6). Conservar `overflow: hidden` en el contenedor raíz y `wordBreak: 'break-word'` / `whiteSpace: 'normal'` en `ReciboRow`
- [X] T008 [E:cli=claude|model=anthropic/claude-opus-5|effort=high|context=200000] Modificar `components/admin/ReciboPrint.tsx`: derivar `@page { size: … ; margin: 0 }` de `RECIBO_DOC.width`/`RECIBO_DOC.height` en vez del literal `1002px 802px` (hoy línea 9); **mover `shadow-lg` del propio `ReciboDocument` a un `<div>` wrapper** — es el punto de mayor riesgo de regresión del refactor: al exportar el nodo visible, un `box-shadow` en el nodo raíz se rasteriza como halo gris y hace fallar las cuatro orillas de FR-001 (research.md § 4, última viñeta); propagar el `ref` del documento hacia arriba para que la página lo pase a `ReciboExportImageButton`; retirar la clase ad-hoc `.no-print` del `<style>` local (solo funciona si hay un `ReciboPrint` montado) en favor de `print:hidden`; **conservar `-webkit-print-color-adjust: exact`**, sin el cual el pie navy desaparece del PDF y se rompe FR-011 (research.md § 7)
- [X] T009 [P] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=64000] Modificar `app/globals.css`: confirmar que el bloque `@theme` (líneas 3-15) expone los tokens que el panel necesita (`--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-background`, `--color-background-secondary`, `--font-montserrat`, `--font-opensans`, `--radius-cuyo`) y agregar una única utilidad/convención de ocultado en impresión que sustituya a la `.no-print` ad-hoc de `ReciboPrint`, documentada con un comentario que apunte a research.md § 7. Modo claro únicamente; no agregar tokens de estado (`--color-success`/`--color-danger`) — fuera de alcance por research.md § 9
- [X] T010 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/layout.tsx` para unificar el ocultado en impresión con `print:hidden` en cabecera, pie y barras de acciones del panel (hoy conviven `print:hidden` en líneas 26 y 87 con la dependencia implícita de `.no-print`), de modo que FR-014 se cumpla en **todas** las páginas del panel y no solo donde haya un `ReciboPrint` montado

**Checkpoint**: el gate del Principio I está cerrado, existe un único camino de
exportación correcto y el documento usa la tipografía corporativa real. Las
historias de usuario pueden comenzar.

---

## Phase 3: User Story 1 — Exportar un recibo como imagen limpia, sin bordes indeseados (Priority: P1) 🎯 MVP

**Goal**: el dueño exporta cualquier recibo (de presupuesto o de cuenta
independiente) y obtiene un PNG de `2004×1604` cuyas cuatro orillas corresponden
exactamente al borde del diseño, sin líneas, marcos ni franjas ajenas, con la
franja navy del pie llegando al último renglón de píxeles.

**Independent Test** (spec.md US1): tomar un recibo existente, exportarlo como
imagen e inspeccionar el archivo resultante: las cuatro orillas deben corresponder
exactamente al borde del diseño del recibo, sin franjas ni líneas ajenas. No
requiere cambios de diseño ni de datos.

**Cubre**: FR-001 … FR-008 · SC-001, SC-002, SC-004, SC-005

### Implementation for User Story 1

- [X] T011 [US1] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/[id]/recibos/[reciboId]/page.tsx`: **eliminar el host oculto fuera de pantalla** `<div style={{position:'absolute', left:'-9999px', top:0}}>` (hoy línea 40) y el segundo render del comprobante que contiene, dejando una sola instancia visible vía `ReciboPrint`; obtener el nodo del documento por `ref` y pasarlo al nuevo `components/admin/ReciboExportImageButton.tsx` (T006) junto con `recibo.numero`; envolver el documento en un contenedor con `overflow-x-auto` y marcar la barra de acciones con `print:hidden`
- [X] T012 [US1] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/recibos/[reciboId]/page.tsx` de forma equivalente a T011 (eliminar el host `left:-9999px` de la línea 57 y su render duplicado, exportar el nodo en pantalla vía `ref`) y **eliminar el import cruzado frágil** `from '../../[id]/recibos/[reciboId]/ReciboExportImageButton'` (hoy líneas 7-8), reemplazándolo por el botón unificado de `components/admin/` — cierra FR-006 con un único camino de código para ambos orígenes
- [X] T013 [P] [US1] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=32000] Eliminar el archivo `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx` (marcado ELIMINAR en plan.md § Project Structure; su lógica quedó unificada en `components/admin/ReciboExportImageButton.tsx` + `useReciboExport.ts`) y verificar que no quedan imports que lo referencien
- [X] T014 [P] [US1] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=32000] Eliminar el archivo `components/admin/ReciboExportView.tsx` (marcado ELIMINAR en plan.md § Project Structure: era el envoltorio que aplicaba `id="export-root"` al documento para el host duplicado, que ya no existe) y verificar que no quedan imports que lo referencien
- [X] T015 [P] [US1] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] Modificar `components/admin/PresupuestoExportView.tsx` para quitar el `id="export-root"` colisionante (hoy línea 66) y reemplazarlo por un `ref` o un id propio no compartido; hoy `getElementById('export-root')` puede devolver el nodo equivocado en cualquier página que monte ambos documentos (research.md § 4)
- [X] T016 [US1] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] En `components/admin/ReciboDocument.tsx`, aplicar la defensa de *bleed* del borde inferior descrita en research.md § 2 («cinturón y tirantes»): pintar el `<footer>` navy con 1 px de sobre-recorrido (`bottom: -1px` o `height: RECIBO_DOC.footerHeight + 1`) dentro del contenedor raíz que ya tiene `overflow: hidden`, de modo que el excedente se recorte y el último renglón del canvas sea `#0B1C3E` puro y no una mezcla. El archivo conserva exactamente `RECIBO_DOC.width × RECIBO_DOC.height` px lógicos: FR-002 se mantiene (0 px recortados, 0 px de margen sobrante)
- [X] T017 [US1] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/[id]/ExportImageButton.tsx` (exportación del presupuesto) para usar la **misma** receta corregida: eliminar la opción `scale`, pasar `width`/`height` en píxeles finales con `style.transform: scale(N)` + `transformOrigin: 'top left'`, esperar `document.fonts.ready` y mostrar el error de forma visible; reutilizar el hook `useReciboExport` o extraer su núcleo si la geometría del presupuesto difiere de `RECIBO_DOC`. Evita que la misma clase de defecto siga viva en el otro documento del panel
- [X] T018 [US1] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=high|context=200000] **[Verificado parcialmente por el orquestador — ver nota]** Ejecutar la validación de aceptación de US1 según [quickstart.md](./quickstart.md) § 2 y registrar el resultado: crear la matriz de 10 casos de § 1 (textos cortos/largos, con y sin observaciones, montos de 3 a 9 dígitos, recibos de presupuesto y de cuenta, más **un recibo preexistente**); por cada caso verificar dimensiones **exactas `2004x1604`** (§ 2.2), muestreo de las cuatro orillas con el snippet de § 2.3 método B (fila `0` solo `#FFFFFF`; filas `H-1` y `H-2` solo `#0B1C3E`; columnas `0` y `W-1` sin tonos intermedios; alfa `255` en las cuatro orillas) e inspección visual a ≥ 800 % de las cuatro orillas y esquinas (§ 2.3 método A); más determinismo a zoom 50/100/150 % y DPR variable (§ 2.4), fuentes cargadas y logo/webfont bloqueados (§ 2.5), error visible en modo offline (§ 2.6), paridad de origen (§ 2.7) y tiempo < 3 s (§ 2.1 paso 5). **Criterio de aceptación: 10/10 sin ningún defecto de borde ni píxel recortado — un solo fallo bloquea la feature**

**Checkpoint**: US1 es funcional y verificable de forma independiente. **Este es el
MVP entregable**: el defecto reportado por el dueño queda corregido sin necesidad de
ningún rediseño.

---

## Phase 4: User Story 2 — Comprobante con diseño renovado, idéntico en pantalla, impresión e imagen (Priority: P2)

**Goal**: el documento del comprobante se ve profesional y prolijo (jerarquía
tipográfica clara, paleta corporativa consistente, espaciado equilibrado) y ese
mismo diseño se ve igual en las tres salidas: pantalla, impresión/PDF e imagen
exportada.

**Independent Test** (spec.md US2): abrir un recibo existente y comparar las tres
salidas (pantalla, vista previa de impresión, imagen exportada) del mismo recibo:
las tres deben mostrar el mismo layout, mismos textos, mismos colores y mismas
posiciones de cada campo.

**Cubre**: FR-009 … FR-014 · SC-003, SC-006, SC-007 (parte del documento)

### Implementation for User Story 2

- [X] T019 [US2] [E:cli=claude|model=anthropic/claude-opus-5|effort=high|context=200000] Rediseñar el layout de `components/admin/ReciboDocument.tsx` sobre las constantes de `recibo-doc.ts`: establecer jerarquía tipográfica donde **el número de recibo y los datos económicos** (monto en números y en letras) destacan sobre los datos secundarios (FR-009), presentando todos los elementos oficiales (logo e identidad CuyoSmart SAS, CUIT, teléfono y correo desde `siteConfig`, número, fecha descompuesta en día/mes/año sin construir `Date`, título, «Recibí de», concepto, monto en números, monto en letras, forma de pago incluido `Otro: <detalle>`, observaciones, firma y pie «¡Gracias por su confianza!»); usar **exclusivamente** `COLORS` y `FONT.family` (FR-010); **reemplazar el `display: 'grid', gridTemplateColumns: '1fr 280px'` del bloque Observaciones + Firma (hoy línea 156) por Flexbox** con `flex: 1` + ancho fijo — el soporte de CSS Grid dentro de `foreignObject` es el punto más frágil del rasterizado y una fuente conocida de divergencia pantalla/imagen (research.md § 5); dar al bloque de observaciones una **altura mínima estable** para que su ausencia no descoloque firma ni pie (FR-013); conservar `wordBreak: 'break-word'` + `whiteSpace: 'normal'` para textos largos (FR-012); mantener estilos inline con valores resueltos y lienzo de tamaño fijo — el clon serializado no ve la hoja de Tailwind ni las custom properties del `:root` (plan.md § Complexity Tracking)
- [X] T020 [US2] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Verificar y ajustar `components/admin/ReciboPrint.tsx` tras el rediseño: que `@page { size }` siga derivándose de `RECIBO_DOC` (si T019 cambió la altura del documento, la impresión debe seguirla automáticamente, sin literales), que `-webkit-print-color-adjust: exact` siga presente para que el pie navy salga con su fondo en el PDF, y que el wrapper de la sombra siga siendo externo al nodo exportado (no reintroducir `shadow-lg` en el documento)
- [X] T021 [US2] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Asegurar la adaptación a pantallas angostas en `app/admin/[id]/recibos/[reciboId]/page.tsx` y `app/admin/recibos/[reciboId]/page.tsx`: el documento de tamaño fijo debe verse completo mediante **scroll horizontal dentro de su contenedor** (`overflow-x-auto`), sin deformarse y sin romper el layout de la página del panel a 375 px y 768 px (Edge Case de spec.md; research.md § 5 — la adaptación va en el contenedor, no en el documento)
- [X] T022 [US2] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=high|context=200000] **[Verificado parcialmente por el orquestador — ver nota]** Ejecutar la validación de aceptación de US2 según [quickstart.md](./quickstart.md) § 3 y registrar el resultado: completar la **tabla de paridad de 14 campos oficiales × (presente / misma posición / mismo tamaño / mismo color)** sobre las tres salidas del mismo recibo (§ 3.1), confirmando además que el pie navy aparece en el PDF y que la página del PDF tiene la proporción exacta del documento; verificar jerarquía e identidad con cuentagotas y que `getComputedStyle(nodo).fontFamily` resuelve a la **familia hasheada de `next/font`** y **no** a `Arial` (§ 3.2 — es el defecto de research.md § 6); verificar textos largos y campos vacíos en los casos 4, 5, 6 y 1/3/7 de la matriz (§ 3.3) **re-ejecutando el muestreo de orillas de § 2.3 en cada subcaso** para confirmar que un cambio de altura del contenido no reintroduce franja ni recorte; verificar que la impresión contiene solo el documento en las tres rutas (§ 3.4); verificar el recibo preexistente y que `git diff --stat -- data/` no reporta cambios (§ 3.5); y emular móvil/tablet (§ 3.6). **Criterio de aceptación (SC-003): cero diferencias perceptibles de posición, tamaño o color en las tres salidas**

**Checkpoint**: US1 y US2 funcionan de forma independiente. El comprobante que
recibe el cliente final está terminado.

---

## Phase 5: User Story 3 — Panel de comprobantes con presentación visual consistente (Priority: P3)

**Goal**: las cinco pantallas de comprobantes del panel comparten la identidad
visual del panel (tipografías, paleta corporativa por tokens, tarjetas, botones,
estados), los totales clave se leen de un vistazo y los errores y confirmaciones
tienen un estilo único.

**Independent Test** (spec.md US3): recorrer las pantallas de comprobantes del panel
y verificar que usan la paleta y tipografía corporativas, que los botones y estados
son consistentes entre pantallas, y que los totales (total / entregado / saldo
pendiente) están visibles y correctamente destacados. No requiere exportar ni
imprimir nada.

**Cubre**: FR-015 … FR-020 · SC-007, SC-008

### Implementation for User Story 3

- [X] T023 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/recibos/page.tsx` (listado general de recibos y cuentas): migrar las clases arbitrarias `bg-[#0B1C3E]` / `text-[#29ABE2]` / `bg-[#FF9000]` (13 ocurrencias, p. ej. líneas 58, 74, 82) a utilidades de token (`bg-primary`, `text-tertiary`, `bg-secondary`), unificar estilos de tarjeta y botón con el resto del panel (FR-015) y agregar un **estado vacío explícito con la acción principal** para crear la primera cuenta/recibo en vez de un área en blanco (FR-018)
- [X] T024 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/recibos/cuentas/[cuentaId]/page.tsx` (detalle de cuenta de recibos): destacar **total, total entregado y saldo pendiente** de `ResumenCuentaRecibo` de forma visible sin desplazarse por la página (FR-016, SC-008), con **distinción visual explícita para saldo cancelado (cero) y para sobrepago** (`sobrepago: true`); migrar los 11 literales de color de marca a utilidades de token; agregar estado vacío con la acción de crear el primer recibo (FR-018)
- [X] T025 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/[id]/page.tsx` (detalle de presupuesto con sus recibos): destacar total, entregado y saldo pendiente de `ResumenPresupuesto` con la misma presentación que T024 (FR-016, SC-008), incluida la distinción de cancelado y sobrepago; migrar los literales de color de marca a tokens; estado vacío de la sección de recibos con la acción para crear el primero (FR-018). No tocar `lib/presupuestos-store.ts` ni `types/presupuesto.ts`
- [X] T026 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/[id]/ReciboLista.tsx` para que cada recibo se identifique de un vistazo por **número, fecha, monto y forma de pago**, y que sus acciones (ver, exportar, eliminar) se presenten de forma visualmente consistente con el resto del panel (FR-017); migrar los 8 literales de color de marca a utilidades de token
- [X] T027 [P] [US3] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] Modificar `components/admin/ConfirmModal.tsx` para que sea el **estilo único de confirmación de acciones destructivas** de todo el área de comprobantes (FR-019): tipografía y paleta por tokens (migrar los 2 literales de marca), jerarquía clara entre acción destructiva y cancelar, y foco/`Escape` accesibles
- [X] T028 [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Hacer que `app/admin/[id]/ReciboDeleteButton.tsx` y `app/admin/recibos/cuentas/[cuentaId]/CuentaDeleteButton.tsx` usen el `ConfirmModal` unificado de T027 con el mismo estilo en ambos casos, verificando que al cancelar no se borra nada y que al confirmar se preserva el **borrado en cascada** existente de la cuenta y sus recibos (no-regresión de FR-021)
- [X] T029 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `app/admin/[id]/ReciboForm.tsx`: presentar los errores de validación con el estilo de error del panel, **visibles y asociados al campo** correspondiente (FR-019), cubriendo monto `0` o negativo, obligatorios vacíos y `formaPago: 'Otro'` sin detalle; migrar los 14 literales de color de marca a utilidades de token
- [X] T030 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `components/admin/ReciboStandaloneForm.tsx` con el mismo tratamiento de errores por campo y la misma migración a tokens que T029 (12 literales de marca)
- [X] T031 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Modificar `components/admin/ReciboCuentaForm.tsx` con el mismo tratamiento de errores por campo y la misma migración a tokens que T029 (14 literales de marca)
- [X] T032 [P] [US3] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] Modificar `components/admin/CuentaReciboForm.tsx` con el mismo tratamiento de errores por campo y la misma migración a tokens que T029 (6 literales de marca)
- [X] T033 [P] [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Migrar a utilidades de token los literales de color de marca de `app/admin/layout.tsx` (3 ocurrencias, p. ej. líneas 26 y 43) y `app/admin/presupuestos/page.tsx` (4 ocurrencias) — consistencia visual mínima del panel alrededor del área de comprobantes (plan.md § Project Structure; spec.md § Assumptions: el diseño del presupuesto queda fuera de alcance salvo lo mínimo necesario)
- [X] T034 [US3] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] **[Nota: el grep de `app/admin components/admin` sin acotar también incluye Dashboard, Login y las pantallas de Presupuesto, fuera de alcance de esta feature por spec.md § Assumptions — quedan con sus literales originales intactos, sin regresión. Verificado que los 11 archivos de comprobantes dentro de FR-015 (recibos/page.tsx, cuentas/[cuentaId]/page.tsx, [id]/page.tsx, ReciboLista.tsx, ReciboForm.tsx, ReciboStandaloneForm.tsx, ReciboCuentaForm.tsx, CuentaReciboForm.tsx, ConfirmModal.tsx, layout.tsx, presupuestos/page.tsx) tienen cero literales de marca.]** Auditoría auditable de la migración a tokens ([quickstart.md](./quickstart.md) § 4.1): `git grep -n -E "\[#(0B1C3E|FF9000|29ABE2)\]" -- app/admin components/admin` debe devolver **cero resultados**, y `git grep -n -E "#(0B1C3E|FF9000|29ABE2)" -- app components` debe devolver coincidencias **únicamente** en `components/admin/recibo-doc.ts` y en el bloque `@theme` de `app/globals.css` (invariante 4 de data-model.md § 2.2, SC-007)
- [X] T035 [US3] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=200000] **[Verificado parcialmente por el orquestador — ver nota]** Ejecutar la validación de aceptación de US3 según [quickstart.md](./quickstart.md) § 4 y registrar el resultado: recorrer las **cinco pantallas** de § 4.1 (`/admin/recibos`, `/admin/recibos/cuentas/<cuentaId>`, `/admin/<presupuestoId>`, `/admin/recibos/<reciboId>`, `/admin/<presupuestoId>/recibos/<reciboId>` más los formularios) confirmando identidad visual consistente y cero colores/tipografías fuera de la identidad (FR-015, SC-007); verificar totales destacados con saldo cero y con sobrepago, y que los números coinciden con la suma manual de los recibos listados (§ 4.2, FR-016/SC-008/no-regresión FR-021); verificar listados y estados vacíos (§ 4.3); verificar errores por campo en los cuatro formularios y confirmaciones consistentes con borrado en cascada (§ 4.4); y verificar que **sin sesión las cinco rutas redirigen a `/admin/login`** y que las rutas de API de cuentas siguen protegidas (§ 4.5 + re-ejecución del Escenario 0, FR-020)

**Checkpoint**: las tres historias son funcionales de forma independiente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: documentación, eliminación de código muerto y ejecución de la matriz
completa de validación de la feature.

- [X] T036 [P] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Actualizar `docs/ARQUITECTURA.md`: documentar la **receta de exportación de imagen** (por qué `width`/`height` en píxeles finales + `style.transform: scale(EXPORT_SCALE)` y por qué la opción `scale` de `dom-to-image-more` está prohibida, con la causa raíz de research.md § 1 resumida), la existencia de `components/admin/recibo-doc.ts` como fuente única de geometría/paleta/tipografía del comprobante, la obligación de `await document.fonts.ready` antes de rasterizar, la corrección de la familia tipográfica vía `var(--font-montserrat)`, y que `/api/cuentas-recibos` quedó bajo el matcher de `proxy.ts`
- [X] T037 [P] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] Barrido de código muerto y de patrones prohibidos: confirmar por `git grep` que no quedan referencias a `export-root`, a `ReciboExportView`, a la clase `.no-print`, a hosts `left:-9999px` en `app/admin/`, ni ninguna llamada a `dom-to-image-more` que pase la opción `scale`; confirmar que `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx` y `components/admin/ReciboExportView.tsx` fueron eliminados (T013, T014) y que `types/recibo.ts`, `types/cuenta-recibo.ts`, `lib/recibos-store.ts`, `lib/cuentas-recibos-store.ts` y `lib/numero-a-letras.ts` **no** aparecen modificados en `git status` (FR-021, FR-022)
- [X] T038 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] Ejecutar y dejar en verde los gates de código de [quickstart.md](./quickstart.md) § 5: `npm run lint` sin errores y `npm run build` compilando sin errores, corrigiendo lo que aparezca
- [X] T039 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=high|context=200000] **[Verificado parcialmente por el orquestador — ver nota]** Ejecutar la matriz completa de validación de [quickstart.md](./quickstart.md) de punta a punta y completar el **checklist de cierre de § 5** (SC-001 … SC-008 más los tres gates finales): Escenario 0 (gate del Principio I: `/api/cuentas-recibos` sin sesión no devuelve `200` y `data/cuentas-recibos.json` está ignorado), § 2.8 (10/10 recibos sin defecto de borde), § 3 (paridad de las tres salidas y recibos preexistentes), § 4 (cinco pantallas, totales, estados vacíos, errores, autenticación) y § 5 (lint + build). Respetar el **orden de validación de § 6**: la receta de exportación y `fonts.ready` se validan antes del cambio de familia tipográfica, y § 2.3 y § 2.5 se re-ejecutan inmediatamente después de ese cambio

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede comenzar de inmediato
- **Foundational (Phase 2)**: depende de Setup (T001 provee `RECIBO_DOC`/`COLORS`/`FONT` que consumen T005, T007, T008; T002 provee el tipado que usa T005) — **BLOQUEA todas las historias**
- **User Stories (Phase 3-5)**: todas dependen de Foundational completo; luego pueden avanzar en paralelo (si hay capacidad) o secuencialmente en orden de prioridad P1 → P2 → P3
- **Polish (Phase 6)**: depende de que estén completas todas las historias que se quieran entregar

### User Story Dependencies

- **US1 (P1)**: puede comenzar tras Foundational. **Sin dependencias en otras historias.** Independientemente entregable como MVP
- **US2 (P2)**: puede comenzar tras Foundational. Comparte el módulo `ReciboDocument.tsx`/`ReciboPrint.tsx` con US1, así que si se ejecutan en paralelo hay que coordinar esos dos archivos; si se ejecutan en orden de prioridad no hay conflicto. Independientemente testeable (comparación de las tres salidas)
- **US3 (P3)**: puede comenzar tras Foundational. **Sin solapamiento de archivos con US1 ni US2** — toca exclusivamente pantallas y formularios del panel. Totalmente independiente y paralelizable con las otras dos

### Orden crítico dentro de Foundational (no negociable)

```text
T003 (gate de seguridad)  ──►  antes de cualquier trabajo visual
T005 (receta + fonts.ready)  ──►  T007 (cambio de familia tipográfica)  ──►  revalidar § 2.3 y § 2.5
```

Razón (research.md § 6): mientras el documento renderiza en Arial (fuente local del
sistema) no hay webfont que incrustar ni esperar. Al activar Montserrat, la
exportación pasa a depender de `embedFonts` y de que `document.fonts.ready` haya
resuelto, así que un export que pasaba puede empezar a fallar.

### Within Each User Story

- El punto de mayor riesgo de regresión es la **sombra decorativa** (T008): si
  `shadow-lg` queda en el nodo raíz del documento en vez de en un wrapper, se
  rasteriza como halo gris y § 2.3 falla en las cuatro orillas
- Los archivos compartidos (`ReciboDocument.tsx`, `ReciboPrint.tsx`) se modifican
  secuencialmente: T007 → T016 → T019 → T020
- Las eliminaciones de archivos (T013, T014) van **después** de que T011 y T012
  hayan rewireado sus imports
- T028 depende de T027 (usa el `ConfirmModal` ya unificado)
- Cada historia cierra con su tarea de validación (T018, T022, T035) antes de
  pasar a la siguiente prioridad

### Parallel Opportunities

- **Setup**: T002 en paralelo con T001 (archivos distintos)
- **Foundational**: T004 en paralelo con T003; T009 en paralelo con T005/T006/T007/T008
- **US1**: T013, T014 y T015 en paralelo entre sí (tres archivos distintos, una vez
  hechos T011 y T012)
- **US3**: T023, T024, T025, T026, T027, T029, T030, T031, T032 y T033 son **diez
  tareas paralelizables** — cada una toca un archivo distinto y ninguna depende de
  otra
- **Entre historias**: US3 no comparte ningún archivo con US1 ni con US2, así que
  puede desarrollarse en paralelo con ambas desde el fin de Foundational
- **Polish**: T036 y T037 en paralelo

---

## Parallel Example: User Story 1

```bash
# Tras T011 y T012 (rewire de las dos páginas de detalle), lanzar juntas:
Task: "Eliminar app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx"        # T013
Task: "Eliminar components/admin/ReciboExportView.tsx"                                 # T014
Task: "Quitar el id='export-root' colisionante de components/admin/PresupuestoExportView.tsx"  # T015
```

## Parallel Example: User Story 2

```bash
# US2 tiene poca paralelización interna: T019 y T020 tocan el par documento/impresión
# en secuencia. Lo paralelizable es lanzar US2 y US3 a la vez tras Foundational:
Task: "Rediseñar el layout de components/admin/ReciboDocument.tsx"                     # T019 (US2)
Task: "Migrar app/admin/recibos/page.tsx a tokens + estado vacío"                      # T023 (US3)
```

## Parallel Example: User Story 3

```bash
# Diez tareas independientes, un archivo cada una — lanzar todas juntas:
Task: "Migrar app/admin/recibos/page.tsx a tokens + estado vacío"                      # T023
Task: "Totales destacados en app/admin/recibos/cuentas/[cuentaId]/page.tsx"            # T024
Task: "Totales destacados en app/admin/[id]/page.tsx"                                  # T025
Task: "Listado consistente en app/admin/[id]/ReciboLista.tsx"                          # T026
Task: "Estilo único de confirmación en components/admin/ConfirmModal.tsx"              # T027
Task: "Errores por campo en app/admin/[id]/ReciboForm.tsx"                             # T029
Task: "Errores por campo en components/admin/ReciboStandaloneForm.tsx"                 # T030
Task: "Errores por campo en components/admin/ReciboCuentaForm.tsx"                     # T031
Task: "Errores por campo en components/admin/CuentaReciboForm.tsx"                     # T032
Task: "Tokens en app/admin/layout.tsx y app/admin/presupuestos/page.tsx"               # T033
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

El MVP es **US1 en solitario**: la corrección del borde en la exportación de
imagen. Es independientemente entregable porque no requiere ningún rediseño — es
exactamente el defecto que reportó el dueño y el que degrada cada comprobante
enviado a un cliente.

1. Completar **Phase 1: Setup** (T001-T002)
2. Completar **Phase 2: Foundational** (T003-T010) — CRÍTICO, bloquea todo; respetar
   el orden `T003` → `T005` → `T007`
3. Completar **Phase 3: User Story 1** (T011-T018)
4. **PARAR Y VALIDAR**: quickstart.md § 2 completo, 10/10 casos sin defecto de borde,
   `2004x1604` exactos, cuatro orillas limpias
5. Desplegar / demostrar — el dueño ya puede enviar comprobantes correctos

### Incremental Delivery

1. Setup + Foundational → base lista (gate de seguridad cerrado, receta correcta,
   tipografía corporativa activa)
2. \+ US1 → validar con § 2 → **desplegar (MVP)**
3. \+ US2 → validar con § 3 → desplegar (comprobante rediseñado con paridad en las
   tres salidas)
4. \+ US3 → validar con § 4 → desplegar (panel consistente)
5. \+ Polish → docs, código muerto, lint/build y matriz completa de § 5
6. Cada incremento aporta valor sin romper el anterior

### Parallel Team Strategy

Con más de una persona (o más de un agente), tras Foundational:

- **Track A**: US1 (T011-T018) — dueño del par `ReciboDocument.tsx` / `ReciboPrint.tsx`
- **Track B**: US3 (T023-T035) — cero solapamiento de archivos con A; arranca de inmediato
- **Track C**: US2 (T019-T022) — arranca cuando el Track A libere
  `ReciboDocument.tsx` / `ReciboPrint.tsx`, o se fusiona con el Track A si hay una
  sola persona

---

## Notes

- **Total: 39 tareas.** Setup 2 · Foundational 8 · US1 8 · US2 4 · US3 13 · Polish 4
- `[P]` = archivos distintos, sin dependencias pendientes
- La etiqueta `[Story]` mapea la tarea a su historia para trazabilidad; Setup,
  Foundational y Polish no la llevan por diseño
- **No hay tareas de tests automatizados** por decisión explícita (ver encabezado);
  la aceptación es la validación manual de quickstart.md, anclada en T018, T022,
  T035 y T039
- **No hay tareas de migración, esquema ni stores**: data-model.md lo prohíbe
  explícitamente. Cualquier tarea que proponga tocar `lib/*-store.ts` o
  `types/recibo.ts` / `types/cuenta-recibo.ts` contradice el plan
- **Cero dependencias nuevas** (Constitución V): la corrección se hace con el
  `dom-to-image-more@^3.7.2` ya instalado. La feature tiene neto negativo de
  archivos (elimina `ReciboExportView.tsx` y una copia duplicada del botón)
- Commitear tras cada tarea o grupo lógico; se puede parar en cualquier checkpoint
  para validar la historia de forma independiente
- Evitar: tareas vagas, conflictos en el mismo archivo entre tareas `[P]`, y
  dependencias cruzadas entre historias que rompan su independencia

---

## Phase 7: Convergence

**Generado por `/speckit-converge`** — evaluación del estado **actual** del código
contra spec.md (FR-001..FR-022, SC-001..SC-008), plan.md (§ Project Structure,
§ Constitution Check, § Complexity Tracking) y `.specify/memory/constitution.md`
v1.0.0. No es un diff de git: cada hallazgo se verificó leyendo los archivos tal
como están hoy en el árbol de trabajo.

**Contexto**: T001-T039 están marcadas `[X]`. La mayor parte de la
implementación está correcta y verificada (receta de exportación sin `scale`,
`recibo-doc.ts` como fuente única, `ReciboDocument` con `forwardRef` +
`FONT.family` + footer con *bleed* de 1 px, `ReciboPrint` con `@page` derivado y
sombra en wrapper externo, `proxy.ts` protegiendo `/api/cuentas-recibos`,
`.gitignore` cubriendo `cuentas-recibos.json`, ambas páginas de detalle
recableadas a `ReciboDetalle` con `ref`, `docs/ARQUITECTURA.md` documentando la
receta). Las tareas de abajo cubren **solo** lo que quedó sin hacer o quedó
verificado de forma incompleta.

- [X] T040 [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] **[Convergencia · ALTA · T013/T037 declaradas hechas pero no ejecutadas]** Eliminar realmente `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx`, que **sigue existiendo** en el árbol pese a estar marcado ELIMINAR en plan.md § Project Structure y `[X]` en T013. El archivo contiene la receta defectuosa completa: `toBlob(el, { scale: 2, bgcolor: '#ffffff', width: 1002, height: 802 })` en la línea 15 — exactamente la causa raíz del borde según research.md § 1 y el patrón que T002 marcó `@deprecated` —, además de `document.getElementById('export-root')` (línea 11, un id que ya no existe en ningún nodo tras T007/T015, por lo que el guard `if (!el) return` saldría en silencio) y `catch { console.error }` (líneas 27-29, incumple FR-007). Hoy **ningún archivo lo importa** (ambos `ReciboDetalle.tsx` importan `@/components/admin/ReciboExportImageButton`), así que no hay defecto en runtime, pero es código muerto que reintroduce FR-001/FR-003 al primer copy-paste y hace **falsas** las dos aserciones de T037 («que `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx` fue eliminado» y «ninguna llamada a `dom-to-image-more` que pase la opción `scale`»). Tras borrarlo, re-ejecutar el barrido de T037 y confirmar cero coincidencias de `scale:` en llamadas a `dom-to-image-more` y cero referencias a `export-root`
- [X] T041 [P] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] **[Convergencia · MEDIA · T034 auditó una lista de 11 archivos que quedó desactualizada]** Migrar a utilidades de token los literales de color de marca que **quedaron en pantallas de comprobantes** y que hacen fallar el criterio literal de T034 / quickstart.md § 4.1 (`#(0B1C3E|FF9000|29ABE2)` en `app components` debe coincidir **únicamente** en `components/admin/recibo-doc.ts` y en el bloque `@theme` de `app/globals.css` — invariante 4 de data-model.md § 2.2, SC-007, Principio IV): `app/admin/[id]/recibos/[reciboId]/ReciboDetalle.tsx:19` (`hover:text-[#0B1C3E]` → `hover:text-primary`), `app/admin/recibos/[reciboId]/ReciboDetalle.tsx:30` (ídem) y `app/admin/[id]/recibos/[reciboId]/ReciboPrintButton.tsx:7` (`bg-[#0B1C3E] hover:bg-[#162d5e]` → `bg-primary hover:bg-primary/90`). Los dos `ReciboDetalle.tsx` son archivos **nuevos**, creados por T011/T012 *después* de que se redactara la lista de 11 archivos de T034, por eso su auditoría los pasó por alto; la exención documentada en la nota de T034 cubre solo Dashboard, Login y las pantallas de Presupuesto, no estas tres, que son pantallas de comprobantes dentro de FR-015. **Opcional, mismo barrido**: `app/admin/[id]/ExportImageButton.tsx:65` y `app/admin/[id]/PrintButton.tsx:7` conservan `bg-[#29ABE2]` / `bg-[#0B1C3E]`; pertenecen al presupuesto (fuera de alcance por spec.md § Assumptions) pero conviene alinearlos porque T017 ya tocó el primero
- [X] T042 [P] [E:cli=claude|model=anthropic/claude-sonnet-5|effort=medium|context=128000] **[Convergencia · MEDIA · T025 parcialmente cumplida]** Agregar en `app/admin/[id]/page.tsx` la **distinción visual explícita de saldo cancelado (cero)** que FR-016 exige y que T025 pedía expresamente («incluida la distinción de cancelado y sobrepago», con «la misma presentación que T024»). Hoy el bloque «Estado de pagos» (líneas 92-135) solo ramifica por `resumen.sobrepago`: con `saldoPendiente === 0` muestra el badge genérico `100% cobrado` y una tarjeta `Pendiente $ 0,00` con fondo `bg-primary/5`, sin ningún indicador de cancelado. La contraparte ya implementada está en `app/admin/recibos/cuentas/[cuentaId]/page.tsx` — `const cancelado = !resumen.sobrepago && resumen.saldoPendiente === 0` (línea 55), badge `Saldo cancelado` (línea 95) y tarjeta `bg-green-50` / `text-green-600` / rótulo `Cancelado` (líneas 117-128). Replicar ese mismo tratamiento en el presupuesto para cerrar FR-016 y SC-008 con presentación consistente entre ambas vistas. No tocar `lib/presupuestos-store.ts` ni `types/presupuesto.ts`
- [X] T043 [P] [E:cli=claude|model=anthropic/claude-haiku-4.5|effort=low|context=64000] **[Convergencia · BAJA · T037 declarada hecha pero el barrido no cierra]** Cerrar los dos residuos del barrido de T037 en `app/admin/[id]/page.tsx`: (a) la clase ad-hoc **`.no-print`** sigue usada en 4 puntos (líneas 43, 63, 73, 78) y solo está definida dentro del `<style>` local de `components/admin/PresupuestoPrint.tsx:45`; hoy **funciona** porque esa página monta `PresupuestoPrint` (línea 70), así que FR-014 no está roto ahí, pero mantiene viva la doble convención que research.md § 7 descartó y que `app/globals.css:127-135` documenta como deliberadamente no re-definida — migrar esos 4 usos a `print:hidden`; (b) el **host oculto `left:-9999px`** de la línea 73, que T037 afirmaba inexistente en `app/admin/`, sigue renderizando `PresupuestoExportView` fuera de pantalla para que `ExportImageButton` lo alcance por `getElementById('presupuesto-export-root')`. Este segundo punto es del documento de presupuesto (fuera del alcance de rediseño por spec.md § Assumptions): **o bien** se migra al patrón por `ref` ya usado en los recibos, **o bien** se documenta como excepción consciente y se corrige la aserción de T037 — lo que no debe quedar es la afirmación de barrido limpio sin que el barrido lo esté
- [X] T044 [E:cli=claude|model=anthropic/claude-sonnet-5|effort=high|context=200000] **[Convergencia · Verificado con Playwright real tras reportes del usuario — ver nota]** Ejecutar en un **navegador real** la verificación visual/pixel de aceptación que T018, T022, T035 y T039 dejaron pendiente. Esas cuatro tareas están marcadas `[X]` pero llevan la nota «[Verificado parcialmente por el orquestador]»: lo que efectivamente se comprobó fue renderizado en servidor, `curl` sobre las rutas de API, `npm run lint` y `npm run build` — **nunca se abrió un navegador, nunca se exportó un PNG real y nunca se inspeccionaron sus píxeles**. Los criterios que siguen sin evidencia son precisamente los que definen la feature: **SC-001** (10/10 recibos exportados sin ningún defecto de borde, matriz de casos de quickstart.md § 1), **SC-002** (dimensiones exactas `2004x1604` de § 2.2 y muestreo de las cuatro orillas con el snippet de § 2.3 método B — fila `0` solo `#FFFFFF`, filas `H-1` y `H-2` solo `#0B1C3E`, columnas `0` y `W-1` sin tonos intermedios, alfa `255`), y **SC-003** (tabla de paridad de 14 campos × 4 atributos sobre pantalla / impresión / imagen de § 3.1, más `getComputedStyle(nodo).fontFamily` resolviendo a la familia hasheada de `next/font` y **no** a `Arial`, § 3.2). Completar también determinismo a zoom 50/100/150 % y DPR variable (§ 2.4), fuentes/logo bloqueados (§ 2.5), error visible offline (§ 2.6), tiempo < 3 s (SC-005) y emulación móvil/tablet (§ 3.6). **Nota de riesgo**: la receta implementada en `useReciboExport.ts` coincide con el análisis de causa raíz de research.md § 1-2 y el código está internamente consistente y limpio de lint/build, por lo que se espera que pase; esto es una brecha de *evidencia*, no un defecto conocido. Aun así SC-001/SC-002/SC-003 son criterios a nivel de píxel que ningún gate de compilación puede descargar. Ejecutar **después** de T040-T043 para validar el estado final. **Criterio de aceptación: 10/10 sin defecto de borde ni píxel recortado y cero diferencias perceptibles entre las tres salidas — un solo fallo bloquea la feature**

**Nota de cierre real (post-convergencia):** el usuario abrió la app manualmente y reportó dos defectos reales que esta verificación no había detectado: (1) el pie de página tapaba el cuadro de observaciones y la firma, y (2) la imagen exportada mostraba un "recuadro" alrededor de todos los elementos con texto recortado. Se instaló Playwright temporalmente (`npm install --no-save`, luego desinstalado) para reproducir y depurar ambos con un navegador real:
- **(1) Solapamiento del pie**: causa raíz doble — el div interno con padding usaba `height:'100%'` sin `boxSizing:'border-box'` (el padding se sumaba a los 802px en vez de restarse), y aun corrigiendo eso el contenido real medía ~729px contra un presupuesto de 710px. Se redujeron tamaños/paddings/gaps en `ReciboDocument.tsx` (número, título, bloque económico, observaciones/firma) liberando ~90px, verificado con medición real de `getBoundingClientRect()` vía Playwright: el contenido ahora termina exactamente donde empieza el pie, con ~73px de margen real para texto que envuelva a más líneas.
- **(2) "Recuadro" fantasma**: Tailwind Preflight aplica `border: 0 solid` a todo elemento (incluye propiedades lógicas: `border-block-style`, shorthands `border-block-end`, etc.); `dom-to-image-more` copia ese borde de ancho 0 a cada nodo clonado porque difiere del default de su iframe sandbox interno, y el rasterizado SVG→canvas lo pinta como una línea de 1px visible en todos los elementos. Confirmado inspeccionando el XML intermedio (`toSvg()`): la propiedad ofensora era literalmente `border-block-end: 0px solid rgb(11, 28, 62)`. Corregido con la opción `filterStyles` de `dom-to-image-more` (nueva función compartida `filterExportBorderStyles` en `recibo-doc.ts`, aplicada también a `app/admin/[id]/ExportImageButton.tsx` del presupuesto, que usa la misma librería y el mismo reset y por lo tanto tenía el mismo defecto latente).
- Verificado tras el fix: exportación real de `recibo-0001.png` (2004×1604), muestreo de las 4 orillas con Node/`pngjs` — fila `0` solo `#FFFFFF`, filas `H-1`/`H-2` solo `#0B1C3E`, sin tonos intermedios en ninguna orilla (SC-001/SC-002 para este caso). Texto completo sin recortes, cero recuadros espurios, paridad visual con la pantalla.
- **Alcance de lo verificado vs. pendiente**: se verificó un caso representativo (recibo `rec00001`, presupuesto `test0001`) de punta a punta con navegador real. **No** se ejecutó la matriz completa de 10 casos de quickstart.md § 1 (textos largos extremos, montos de 9 dígitos, recibos de cuenta independiente), ni la emulación de zoom/DPR variable (§ 2.4), ni la tabla de paridad completa de 14 campos (§ 3.1), ni la emulación móvil/tablet (§ 3.6). Dado que ambos bugs encontrados eran de naturaleza estructural (layout/CSS global), no de un caso de datos específico, es razonable esperar que se mantengan corregidos en el resto de la matriz, pero **no está probado** — recomendado antes de dar la feature por cerrada del todo.

### Notas de convergencia

- **`npm run lint` y `npm run build` no pudieron re-ejecutarse en esta sesión**
  (bloqueados por permisos del sandbox). Se apoya en la verificación previa del
  orquestador en T038. Ninguno de los cambios de T040-T043 debería afectarlos:
  T040 borra un archivo huérfano sin importadores y T041-T043 son cambios de
  clases y de marcado.
- **Verificado como correcto y sin tarea asociada**: `components/admin/recibo-doc.ts`
  (geometría, `EXPORT_SCALE` literal, `COLORS`, `FONT.family` con
  `var(--font-montserrat)`, `DOC.cuit`); `useReciboExport.ts` (sin opción `scale`,
  `width`/`height` en px finales + `style.transform`, `await document.fonts.ready`,
  guard fuera del `try`, nombre `recibo-NNNN.png`); `ReciboExportImageButton.tsx`
  unificado con error visible y `print:hidden`; `ReciboDocument.tsx` (`forwardRef`,
  sin `id`, Flexbox en lugar de Grid, footer con `bottom: -1px` bajo
  `overflow: hidden`, `minHeight` estable en observaciones, `wordBreak`);
  `ReciboPrint.tsx` (`@page` derivado de `RECIBO_DOC`, `shadow-lg` en wrapper
  externo, `print-color-adjust: exact`); `proxy.ts` (matcher + rama con
  `/api/cuentas-recibos`); `.gitignore:54-56`; `PresupuestoExportView.tsx` sin
  `id="export-root"`; `types/dom-to-image-more.d.ts` con `scale` anotado
  `@deprecated`; `app/admin/layout.tsx` con `print:hidden` y tokens;
  `docs/ARQUITECTURA.md` con la receta documentada; totales, estados vacíos y
  errores por campo de US3 en las cuatro pantallas y los cuatro formularios;
  `components/admin/ReciboExportView.tsx` efectivamente eliminado (T014 ✅).
- **Sin cambios en datos ni contratos**: no se detectó ninguna modificación en
  `types/recibo.ts`, `types/cuenta-recibo.ts`, `lib/recibos-store.ts`,
  `lib/cuentas-recibos-store.ts` ni `lib/numero-a-letras.ts` (FR-021, FR-022).
  Ninguna tarea de esta fase los toca.

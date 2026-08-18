# Implementation Plan: Mejora de Diseño de Comprobantes y Exportación sin Bordes

**Branch**: `002-mejorar-diseno-recibos` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-mejorar-diseno-recibos/spec.md`

## Summary

Dos entregables acoplados sobre el sistema de recibos ya existente:

1. **Corregir la exportación de imagen** (FR-001..FR-008). La causa raíz del borde
   indeseado está identificada y verificada en el código: el botón de exportación
   llama a `dom-to-image-more@3.7.2` con `{ scale: 2, width: 1002, height: 802 }`.
   Con esa combinación la librería crea un canvas de `1002*2 × 802*2`, **lo pinta
   entero de blanco (`bgcolor`)** y luego blitea la imagen SVG (de tamaño
   intrínseco 1002×802, **sin `viewBox`**) a través de `ctx.scale(2,2)`. El borde
   exterior del blit escalado queda con cobertura parcial y se mezcla con el
   blanco de fondo, produciendo la línea clara entre el pie navy y el borde
   inferior del archivo. La corrección elimina `scale` y usa la receta canónica
   de `dom-to-image`: `width/height` en píxeles finales + `style.transform:
   scale(2)`, de modo que el `drawImage` sea **1:1 sin transformación** y el
   contenido se rasterice vectorialmente a 2×.
2. **Rediseñar la presentación** del documento del comprobante y de las pantallas
   de comprobantes del panel (FR-009..FR-019), dentro de la identidad corporativa
   ya definida en `app/globals.css`, con paridad exacta pantalla / impresión /
   imagen.

En el camino se corrigen dos defectos verificados que bloquean los requisitos: la
tipografía corporativa **no se está aplicando** (`ReciboDocument` pide la familia
literal `'Montserrat'`, que `next/font` no registra bajo ese nombre, por lo que
todo el comprobante se renderiza en Arial) y `/api/cuentas-recibos` **no está
autenticada** (ausente del matcher de `proxy.ts` y sin verificación en la ruta).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2.3, Node.js 20+ (runtime de Next)

**Primary Dependencies**: Next.js 16.1.6 (App Router, `--webpack`), Tailwind CSS
v4 (`@tailwindcss/postcss`, config CSS-first vía `@theme` en `app/globals.css`),
`dom-to-image-more@^3.7.2` (rasterizado DOM→PNG en cliente), `jose@^6` (JWT de
sesión), `nanoid@^5` (ids), `lucide-react` (iconografía del panel),
`next/font/google` (Montserrat, Open Sans, Geist auto-hospedadas)

**Storage**: Archivos JSON en disco bajo `DATA_DIR` (default `./data`), escritos
con patrón *write-tmp + rename* — `data/recibos.json`
(`lib/recibos-store.ts`), `data/cuentas-recibos.json`
(`lib/cuentas-recibos-store.ts`), `data/presupuestos.json`
(`lib/presupuestos-store.ts`). **Sin cambios de esquema en esta feature.**

**Testing**: El proyecto no tiene runner de tests automatizados. La verificación
es `npm run lint` (ESLint 9 + `eslint-config-next`) + validación manual guiada
por [quickstart.md](./quickstart.md), incluida la inspección ampliada de las
cuatro orillas del PNG exportado (SC-001, SC-002).

**Target Platform**: Navegador de escritorio moderno (Chromium/Firefox) para el
panel `/admin`; despliegue en contenedor Docker multi-stage a GHCR gestionado con
Portainer.

**Project Type**: Aplicación web Next.js App Router monolítica (sitio público de
marketing + panel administrativo en el mismo proyecto).

**Performance Goals**: Exportación de imagen completa en **< 3 s** en el equipo
del dueño (SC-005). La receta elegida rasteriza una sola vez a 2× (2004×1604) en
lugar de rasterizar a 1× y reescalar, sin costo adicional de red.

**Constraints**:
- Sin dependencias nuevas (Constitución V): la corrección se hace con
  `dom-to-image-more` ya instalado.
- Sin cambios en el modelo persistido ni en los contratos de datos de recibos
  (FR-021, FR-022): los recibos existentes deben renderizar con el diseño nuevo
  sin migración.
- Modo claro únicamente; solo tokens de `app/globals.css` (Constitución IV).
- Resultado de exportación **determinista** e independiente de
  `devicePixelRatio` y del zoom del navegador (FR-004).
- Todo el área de comprobantes permanece detrás de la sesión JWT (FR-020,
  Constitución I).

**Scale/Scope**: Un único usuario administrador. ~5 pantallas de comprobantes del
panel + 1 documento imprimible/exportable. Superficie tocada: 8 componentes en
`components/admin/`, 5 rutas bajo `app/admin/`, 2 grupos de rutas API, 1 archivo
de proxy, 1 `.gitignore`.

### Estado actual verificado (base del diagnóstico)

| Pieza | Ubicación | Hecho verificado |
|---|---|---|
| Librería de exportación | `package.json`, `types/dom-to-image-more.d.ts` | `dom-to-image-more@^3.7.2`, tipada a mano con `{ scale, bgcolor, width, height, style, quality }` |
| Llamada de exportación | `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx:15` | `toBlob(el, { scale: 2, bgcolor: '#ffffff', width: 1002, height: 802 })` |
| Objetivo de exportación | `components/admin/ReciboExportView.tsx:5` | `<ReciboDocument r={r} id="export-root" />`, alcanzado con `document.getElementById('export-root')` |
| Host fuera de pantalla | `app/admin/[id]/recibos/[reciboId]/page.tsx:40`, `app/admin/recibos/[reciboId]/page.tsx:57` | `position:absolute; left:-9999px; top:0` — renderiza el comprobante **una segunda vez** |
| Colisión de `id` | `components/admin/PresupuestoExportView.tsx:66` | usa el **mismo** `id="export-root"` |
| Geometría | `components/admin/ReciboDocument.tsx:50-51`, `ReciboPrint.tsx:9` | `1002×802` hardcodeado en 4 lugares independientes |
| Tipografía | `ReciboDocument.tsx:33` vs `app/layout.tsx` | pide `'Montserrat'` literal; `next/font` la expone solo vía `--font-montserrat` → **renderiza Arial** |
| Manejo de error | `ReciboExportImageButton.tsx:27-29` | `catch { console.error }`, sin aviso al usuario |
| Espera de recursos | `ReciboExportImageButton.tsx:8-20` | no espera `document.fonts.ready` |
| Auth del panel | `proxy.ts:32` | matcher cubre `/admin`, `/api/presupuestos`, `/api/recibos` — **no** `/api/cuentas-recibos` |
| Datos en repo | `.gitignore:46-52` | ignora `presupuestos.json` y `recibos.json` — **no** `cuentas-recibos.json` |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluado contra `.specify/memory/constitution.md` v1.0.0.

| Principio | Veredicto | Justificación |
|---|---|---|
| **I. Seguridad del Panel Administrativo** | ⚠️ **PASS con remediación obligatoria** | Ver más abajo. Se detectaron dos incumplimientos **preexistentes** que FR-020 exige no perpetuar. |
| **II. Fuente Única de Contenido** | ✅ PASS | El comprobante ya consume `siteConfig` de `data/content.ts` para teléfono y email. El rediseño no hardcodea copy de marketing; los labels del recibo (`RECIBÍ DE:`, `CONCEPTO:`) son estructurales de UI, explícitamente exceptuados por el principio. El CUIT queda como constante del documento legal, no como copy SEO. |
| **III. SEO y Performance del Sitio Público** | ✅ N/A | La feature es íntegramente dentro de `/admin`. No agrega ni modifica rutas públicas, `metadata` pública, imágenes de `public/images/` ni entradas de `app/sitemap.ts`. |
| **IV. Consistencia de Diseño (Tokens Tailwind)** | ⚠️ **PASS con desviación acotada y justificada** | Ver Complexity Tracking. El documento del recibo **debe** usar estilos inline con literales de color porque el clon serializado en el `foreignObject` no hereda la hoja de Tailwind; los literales se derivan de los tokens en un único módulo de constantes. El resto del panel usa tokens/utilidades normalmente. Modo claro únicamente: se respeta. |
| **V. Simplicidad y Justificación de Complejidad** | ✅ PASS | **Cero dependencias nuevas.** La corrección reconfigura la llamada a `dom-to-image-more` ya instalado. Se rechazan explícitamente `html2canvas`, `html-to-image` y el renderizado server-side (Puppeteer/satori). El almacenamiento JSON se mantiene. La feature **reduce** superficie: elimina el host duplicado fuera de pantalla y unifica dos copias del botón de exportación en una. |

### Principio I — remediación obligatoria (gate bloqueante)

FR-020 exige que las pantallas de comprobantes «sigan siendo accesibles
únicamente para la sesión administrativa autenticada». La inspección del código
muestra que hoy **no** se cumple para el área de cuentas de recibo:

1. **`/api/cuentas-recibos` está sin autenticar.** `proxy.ts:32` no incluye
   `/api/cuentas-recibos/:path*` en el `matcher`, y ni
   `app/api/cuentas-recibos/route.ts` ni `app/api/cuentas-recibos/[id]/route.ts`
   verifican la sesión. Cualquiera puede crear o borrar cuentas de cliente sin
   credenciales. Viola el Principio I («no debe existir ningún camino de acceso
   no autenticado a datos»).
2. **`data/cuentas-recibos.json` no está en `.gitignore`.** `.gitignore:46-52`
   cubre `presupuestos.json` y `recibos.json` pero no este archivo, que hoy
   aparece como *untracked* y se commitearía con nombres de clientes y montos.
   Viola el Principio I («nunca se commitean al repositorio»).

Ambos son preexistentes, ambos caen dentro del alcance de FR-020, y ambos son
correcciones de una línea. Se tratan como **tareas bloqueantes de prioridad
máxima**, antes de cualquier trabajo visual. No requieren excepción ni figuran en
Complexity Tracking porque *restauran* el cumplimiento en lugar de desviarse.

### Re-evaluación post-diseño (Phase 1)

Repetida tras generar `research.md`, `data-model.md`, `contracts/` y
`quickstart.md`:

| Principio | Veredicto post-diseño | Nota |
|---|---|---|
| I | ✅ PASS | El diseño añade `/api/cuentas-recibos/:path*` al matcher del proxy y a la rama protegida, y añade `/data/cuentas-recibos.json{,.tmp}` a `.gitignore`. No se introduce ninguna ruta, vista ni endpoint de exportación nuevo: la exportación sigue siendo 100 % cliente sobre un nodo ya renderizado dentro de `/admin`, sin endpoint de imagen. |
| II | ✅ PASS | Sin cambios; `siteConfig` sigue siendo la fuente de contacto. |
| III | ✅ N/A | Confirmado: ningún artefacto de Phase 1 toca `app/(public)/` ni `app/sitemap.ts`. |
| IV | ⚠️ PASS con desviación acotada | La desviación quedó *reducida* respecto del estado actual: hoy los literales de color están dispersos en `ReciboDocument.tsx` (`NAVY`, `ORANGE`, `GRAY`, `GRAY_LIGHT`) y repetidos como clases arbitrarias `bg-[#0B1C3E]` / `text-[#29ABE2]` en las pantallas del panel. El diseño los centraliza en un módulo único derivado de los tokens y migra el panel a utilidades de token. |
| V | ✅ PASS | Confirmado sin dependencias nuevas y con neto negativo de archivos (se eliminan `ReciboExportView.tsx` y una copia duplicada del botón). |

**Resultado del gate: PASS.** Ninguna violación queda sin justificar. La única
desviación (IV) está documentada en Complexity Tracking con su alternativa
rechazada.

## Project Structure

### Documentation (this feature)

```text
specs/002-mejorar-diseno-recibos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — causa raíz del borde + decisiones
├── data-model.md        # Phase 1 output — sin cambios de modelo (justificado)
├── quickstart.md        # Phase 1 output — guía de validación manual
├── contracts/
│   └── README.md        # Phase 1 output — contratos existentes + gate de auth
├── checklists/          # Existente (/speckit.checklist)
├── spec.md              # Entrada
└── tasks.md             # Phase 2 output (/speckit.tasks — NO creado por plan)
```

### Source Code (repository root)

```text
components/admin/
├── recibo-doc.ts                    # NUEVO — fuente única de geometría y paleta
│                                    #   del documento (RECIBO_DOC, COLORS, FONT)
├── ReciboDocument.tsx               # REDISEÑO — consume recibo-doc.ts; jerarquía
│                                    #   tipográfica, familia corporativa real
├── ReciboPrint.tsx                  # MODIF — @page desde RECIBO_DOC; expone el
│                                    #   nodo del documento vía ref para exportar
├── ReciboExportImageButton.tsx      # NUEVO (unificado) — reemplaza las 2 copias
├── useReciboExport.ts               # NUEVO — receta transform-scale + fonts.ready
│                                    #   + errores visibles (FR-004/005/007/008)
├── ReciboExportView.tsx             # ELIMINAR — el host duplicado desaparece
├── ReciboForm.tsx                   # MODIF — estilos de error consistentes
├── ReciboStandaloneForm.tsx         # MODIF — idem
├── ReciboCuentaForm.tsx             # MODIF — idem
├── CuentaReciboForm.tsx             # MODIF — idem
├── ReciboLista.tsx                  # MODIF — listado consistente (FR-017/018)
├── ReciboDeleteButton.tsx           # MODIF — confirmación consistente (FR-019)
├── ConfirmModal.tsx                 # MODIF — estilo único de confirmación
└── PresupuestoExportView.tsx        # MODIF — quitar el id="export-root" colisionante

app/admin/
├── layout.tsx                       # MODIF — unificar ocultación en impresión
├── recibos/page.tsx                 # MODIF — resumen + estados vacíos (FR-016/018)
├── recibos/cuentas/[cuentaId]/page.tsx   # MODIF — totales destacados (FR-016)
├── recibos/[reciboId]/page.tsx      # MODIF — exportar el nodo en pantalla
├── presupuestos/page.tsx            # MODIF — consistencia visual mínima
└── [id]/
    ├── page.tsx                     # MODIF — recibos del presupuesto (FR-016)
    ├── recibos/[reciboId]/page.tsx  # MODIF — idem recibos/[reciboId]
    ├── recibos/[reciboId]/ReciboExportImageButton.tsx  # ELIMINAR (unificado)
    └── ExportImageButton.tsx        # MODIF — usa la misma receta corregida

app/api/cuentas-recibos/             # Sin cambios de contrato; protegido vía proxy
proxy.ts                             # MODIF — matcher + rama: /api/cuentas-recibos
.gitignore                           # MODIF — /data/cuentas-recibos.json{,.tmp}
app/globals.css                      # MODIF — utilidad única de print + tokens
docs/ARQUITECTURA.md                 # MODIF — documentar la receta de exportación

types/recibo.ts                      # SIN CAMBIOS (FR-021, FR-022)
types/cuenta-recibo.ts               # SIN CAMBIOS
lib/recibos-store.ts                 # SIN CAMBIOS
lib/cuentas-recibos-store.ts         # SIN CAMBIOS
lib/numero-a-letras.ts               # SIN CAMBIOS
types/dom-to-image-more.d.ts         # MODIF — ampliar Options con lo que se usa
```

**Structure Decision**: Se mantiene la estructura monolítica de Next.js App
Router ya existente (no aplica ninguna de las opciones genéricas
single-project / backend+frontend / mobile del template). La feature es de
presentación y no introduce capas nuevas. La única decisión estructural es
**centralizar** lo que hoy está duplicado: un módulo de constantes del documento
(`components/admin/recibo-doc.ts`), un botón de exportación
(`components/admin/ReciboExportImageButton.tsx`) y un hook con la receta de
rasterizado (`components/admin/useReciboExport.ts`), consumidos por las dos rutas
de detalle de recibo. Esto elimina el import cruzado frágil que hoy existe en
`app/admin/recibos/[reciboId]/page.tsx:7-8`
(`from '../../[id]/recibos/[reciboId]/ReciboExportImageButton'`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| **Principio IV** — el documento del recibo usa estilos inline con literales de color/tamaño en lugar de utilidades Tailwind con tokens | El pipeline de `dom-to-image-more` serializa un **clon** del nodo dentro de un `<foreignObject>` SVG. Ese clon no tiene acceso a la hoja de estilos de Tailwind ni a las custom properties del `:root` del documento, por lo que cualquier clase utilitaria o `var(--color-*)` no resuelto se pierde o cae a un valor por defecto en la imagen exportada. Los estilos inline con valores ya resueltos son el único modo de garantizar FR-011 (paridad pantalla/impresión/imagen). La desviación se **acota** definiendo los literales una sola vez en `components/admin/recibo-doc.ts`, derivados de los tokens de `app/globals.css`, en vez de dispersarlos por el JSX como hoy. | (a) *Clases Tailwind en el documento*: rechazado — las clases no sobreviven a la serialización del clon; produce exactamente las divergencias de color y layout que FR-011 prohíbe. (b) *`var(--color-primary)` inline*: rechazado — `dom-to-image-more` copia estilos **computados**, y una custom property no declarada en el clon resuelve a vacío dentro del `foreignObject`. (c) *Inyectar un `<style>` con los tokens en el clon vía `onclone`*: rechazado por Principio V — añade una capa de composición de CSS frágil para ahorrar unas constantes, y `<style>` es uno de los nodos que `cloneNode` descarta explícitamente (`dom-to-image-more.js:363`). |

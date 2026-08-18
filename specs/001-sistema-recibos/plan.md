# Implementation Plan: Sistema de Recibos de Pago

**Branch**: `001-sistema-recibos` | **Date**: 2026-07-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-sistema-recibos/spec.md`

## Summary

Agregar un sistema de recibos de pago dentro del panel admin de CuyoSmart,
anidado en la vista de detalle de cada presupuesto (`/admin/[id]`). El dueño
podrá registrar recibos de pago (parciales o totales) sobre un presupuesto,
ver en todo momento el total entregado y el saldo pendiente, eliminar un
recibo cargado por error, y exportar cualquier recibo como imagen o como PDF
(vía impresión del navegador) reproduciendo fielmente el diseño oficial de la
plantilla `modelo-de-resivo.jpeg`. Enfoque técnico: nuevo store de datos
`lib/recibos-store.ts` (mismo patrón JSON atómico que `presupuestos-store.ts`),
nuevas rutas API `/api/recibos` protegidas por el middleware existente, y
componentes de UI que reutilizan el mismo mecanismo de exportación
(`dom-to-image-more` + `window.print()`) ya usado para presupuestos.

## Technical Context

**Language/Version**: TypeScript ^5, Next.js 16.1.6 (App Router), React 19.2.3

**Primary Dependencies**: Next.js, React, Tailwind CSS v4, `nanoid` (IDs),
`dom-to-image-more` (exportación a imagen, ya instalada), `jose` (sesión JWT,
reutilizada sin cambios)

**Storage**: Archivo JSON dedicado `data/recibos.json`, mismo patrón atómico
(`fs.writeFile` a `.tmp` + `fs.rename`) que `data/presupuestos.json`

**Testing**: No hay suite de tests automatizados en el proyecto (no se detectó
`jest`/`vitest`/`playwright` en `package.json`); la validación se realiza vía
`npm run lint` + verificación manual guiada por `quickstart.md`

**Target Platform**: Servidor Next.js en Docker (Node 22-alpine), acceso vía
navegador de escritorio/mobile por el dueño

**Project Type**: Web application (Next.js App Router, monolito frontend+backend
en el mismo proyecto) — reutiliza la estructura ya existente, no es un proyecto
nuevo

**Performance Goals**: Sin metas de carga específicas más allá de las ya
asumidas por el panel admin existente (uso por un único usuario administrador,
sin concurrencia significativa)

**Constraints**: Debe reutilizar el middleware de autenticación existente
(`proxy.ts`), no debe introducir nuevas dependencias de servidor para PDF, debe
mantener fidelidad visual absoluta con `modelo-de-resivo.jpeg`

**Scale/Scope**: Volumen bajo (decenas/cientos de recibos por año, acorde al
volumen actual de presupuestos de una PyME)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Seguridad del Panel Administrativo | Las rutas `/api/recibos/*` se agregan al `matcher` de `proxy.ts` (mismo middleware JWT que ya protege `/admin` y `/api/presupuestos`). `data/recibos.json` se agrega a `.gitignore` igual que `data/presupuestos.json`. No se expone ningún dato de recibos en rutas públicas. | ✅ PASS |
| II. Fuente Única de Contenido | No aplica contenido de marketing/SEO nuevo (feature es 100% panel admin, fuera del alcance de `data/content.ts`); sí se reutiliza `siteConfig` (CUIT/tel/email vía `data/content.ts`) para los datos de contacto del recibo. | ✅ PASS |
| III. SEO y Performance del Sitio Público | No aplica: el panel admin (`/admin/**`) está fuera del sitio público indexable (no requiere metadata/JSON-LD/sitemap). | N/A (fuera de alcance del principio) |
| IV. Consistencia de Diseño (Tokens Tailwind) | Los nuevos componentes (`ReciboPrint.tsx`, `ReciboExportView.tsx`, formularios) usan los tokens `--color-primary`/`--color-secondary` ya definidos en `globals.css`, replicando el patrón visual de `PresupuestoPrint.tsx`/`PresupuestoExportView.tsx`. Modo claro único, sin excepciones. | ✅ PASS |
| V. Simplicidad y Justificación de Complejidad | Se reutiliza el patrón de almacenamiento JSON existente (sin BD nueva), se reutiliza `dom-to-image-more` y `window.print()` ya instalados (sin generador de PDF en servidor), no se agregan dependencias npm nuevas. Ver `research.md` Decisiones 1, 4 y 5 para el detalle de justificación explícita. | ✅ PASS |

**Resultado**: Ninguna violación. No se requiere `Complexity Tracking`.

## Project Structure

### Documentation (this feature)

```text
specs/001-sistema-recibos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output (/speckit.plan command)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output (/speckit.plan command)
│   └── recibos-api.md
└── tasks.md              # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
types/
└── recibo.ts                          # Nuevo: tipos Recibo, FormaPagoRecibo, ReciboInput

lib/
├── recibos-store.ts                   # Nuevo: CRUD + cálculo entregado/saldo (patrón JSON atómico)
├── numero-a-letras.ts                 # Nuevo: función pura monto → texto en español
└── presupuestos-store.ts              # Modificado: deletePresupuesto() elimina recibos en cascada

app/
├── api/
│   └── recibos/
│       ├── route.ts                   # Nuevo: POST (crear recibo) — sin GET; lectura vía Server Component + lib/recibos-store.ts
│       └── [id]/
│           └── route.ts               # Nuevo: DELETE (eliminar recibo)
└── admin/
    └── [id]/
        ├── page.tsx                   # Modificado: agrega resumen entregado/saldo + lista de recibos + formulario "Nuevo recibo"
        ├── ReciboForm.tsx             # Nuevo: formulario de creación de recibo (client component)
        ├── ReciboLista.tsx            # Nuevo: lista de recibos del presupuesto con acciones (ver/exportar/eliminar)
        ├── ReciboDeleteButton.tsx     # Nuevo: botón eliminar con confirmación (patrón DeleteButton.tsx)
        └── recibos/
            └── [reciboId]/
                ├── page.tsx           # Nuevo: vista de detalle/impresión de un recibo específico (patrón admin/[id]/page.tsx)
                ├── ReciboExportImageButton.tsx # Nuevo: exportar recibo como imagen (patrón ExportImageButton.tsx)
                └── ReciboPrintButton.tsx       # Nuevo: exportar/imprimir recibo como PDF (patrón PrintButton.tsx)

components/
└── admin/
    ├── ReciboPrint.tsx                # Nuevo: vista imprimible del recibo (Tailwind, patrón PresupuestoPrint.tsx)
    └── ReciboExportView.tsx           # Nuevo: vista para exportar a imagen (inline styles, patrón PresupuestoExportView.tsx)

proxy.ts                                # Modificado: matcher incluye /api/recibos/:path*
.gitignore                              # Modificado: agrega data/recibos.json y data/recibos.json.tmp
```

**Structure Decision**: Se reutiliza íntegramente la estructura ya existente
del proyecto Next.js App Router (sin nuevos proyectos/paquetes). Los recibos
viven anidados bajo `/admin/[id]/` como subcomponentes de la vista de detalle
del presupuesto (según clarificación de ubicación en el panel), replicando
exactamente los mismos patrones de archivo, nomenclatura y separación
server/client component que ya usa el módulo de presupuestos.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Ninguna violación detectada — tabla omitida intencionalmente.

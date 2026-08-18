---
description: "Task list for Sistema de Recibos de Pago"
---

# Tasks: Sistema de Recibos de Pago

**Input**: Design documents from `specs/001-sistema-recibos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/recibos-api.md, quickstart.md

**Tests**: No se generan tareas de test automatizado — el proyecto no tiene
suite de tests configurada (`package.json` sin `jest`/`vitest`/`playwright`) y
la spec no las solicitó explícitamente. La validación se realiza vía
`npm run lint` (T019) y los escenarios manuales de `quickstart.md` (T021).

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] [C:n<level>->model] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **[C:n<level>->model]**: Task complexity level (`n5` critical | `n4` complex | `n3` moderate | `n2` simple | `n1` trivial) and the model assigned to execute it, taken from `models.json` (`by_complexity`)
- Include exact file paths in descriptions

## Path Conventions

Proyecto Next.js App Router existente (single project, sin `backend/`/`frontend/`
separados). Todas las rutas de archivo son relativas a la raíz del repositorio.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Definiciones base reutilizadas por toda la feature

- [X] T001 [P] [C:n1->opencode/north-mini-code-free] Crear tipos `Recibo`, `FormaPagoRecibo`, `RecibosDB`, `ReciboInput` en `types/recibo.ts` según `data-model.md`
- [X] T002 [P] [C:n3->opencode/deepseek-v4-flash-free] Crear función pura `numeroALetras(monto: number): string` (conversión a texto en español, sin dependencias externas) en `lib/numero-a-letras.ts` según `research.md` Decisión 4
- [X] T003 [P] [C:n1->opencode/north-mini-code-free] Agregar `data/recibos.json` y `data/recibos.json.tmp` a `.gitignore` (mismo patrón que `data/presupuestos.json`)

**Checkpoint**: Tipos y utilidades base listos para el resto de la feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistencia, seguridad y API base que TODAS las user stories necesitan

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [C:n3->opencode/deepseek-v4-flash-free] Crear `lib/recibos-store.ts` con `getRecibosByPresupuesto(presupuestoId)`, `createRecibo(input)` (numeración correlativa global, `nanoid(8)` para `id`), `deleteRecibo(id)`, `getResumenPresupuesto(presupuestoId, total)` (calcula `entregado`, `saldoPendiente`, `sobrepago`), `deleteRecibosByPresupuesto(presupuestoId)`, siguiendo el patrón de escritura atómica (`.tmp` + `rename`) de `lib/presupuestos-store.ts`. Depende de T001.
- [X] T005 [C:n2->opencode/mimo-v2.5-free] Modificar `deletePresupuesto()` en `lib/presupuestos-store.ts` para invocar `deleteRecibosByPresupuesto(id)` de `lib/recibos-store.ts` antes de eliminar el presupuesto (FR-013, cascada). Depende de T004.
- [X] T006 [P] [C:n1->opencode/north-mini-code-free] Extender el `matcher` de `proxy.ts` para incluir `/api/recibos/:path*`, protegiendo las nuevas rutas con el mismo middleware JWT existente (Principio I de la constitución)
- [X] T007 [P] [C:n3->opencode/deepseek-v4-flash-free] Crear `app/api/recibos/route.ts` con `POST` (crear recibo, validaciones de `contracts/recibos-api.md`: monto > 0, presupuesto existente, campos requeridos) usando `createRecibo()` de T004. Depende de T004.
- [X] T008 [P] [C:n2->opencode/mimo-v2.5-free] Crear `app/api/recibos/[id]/route.ts` con `DELETE` (eliminar recibo, 404 si no existe) usando `deleteRecibo()` de T004. Depende de T004.

**Checkpoint**: Backend de recibos completo, protegido y con cascada correcta — listo para construir UI de cualquier user story.

---

## Phase 3: User Story 1 - Registrar un pago recibido y ver el saldo actualizado (Priority: P1) 🎯 MVP

**Goal**: El dueño puede crear recibos sobre un presupuesto y ver de inmediato el
total entregado y el saldo pendiente, incluyendo advertencia de sobrepago.

**Independent Test**: Crear dos recibos parciales sobre un mismo presupuesto y
verificar que "Entregado" y "Saldo pendiente" mostrados sean correctos.

### Implementation for User Story 1

- [X] T009 [P] [US1] [C:n3->opencode/deepseek-v4-flash-free] Crear `app/admin/[id]/ReciboForm.tsx` (client component): formulario con fecha, "Recibí de", concepto, monto, forma de pago (Efectivo/Transferencia/Otro + detalle), "Son en letras" autogenerado vía `numeroALetras()` pero editable, observaciones; POST a `/api/recibos`; validación de monto > 0 en cliente
- [X] T010 [P] [US1] [C:n3->opencode/deepseek-v4-flash-free] Crear `app/admin/[id]/ReciboLista.tsx`: recibe `recibos: Recibo[]` y `resumen: {entregado, saldoPendiente, sobrepago}`; muestra tarjetas resumen "Entregado" / "Saldo pendiente" (con estilo de advertencia si `sobrepago === true`, FR-012) y la lista de recibos con número, fecha, monto, forma de pago
- [X] T011 [US1] [C:n3->opencode/deepseek-v4-flash-free] Modificar `app/admin/[id]/page.tsx` para: leer `getRecibosByPresupuesto(p.id)` y `getResumenPresupuesto(p.id, p.total)` server-side, renderizar `<ReciboLista>` y `<ReciboForm>` en una nueva sección "Recibos" bajo el documento del presupuesto. Depende de T009, T010, T004.

**Checkpoint**: User Story 1 completamente funcional — crear recibos y ver entregado/saldo en tiempo real.

---

## Phase 4: User Story 2 - Exportar un recibo como imagen o PDF (Priority: P2)

**Goal**: El dueño puede exportar cualquier recibo ya creado como imagen o PDF,
reproduciendo fielmente el diseño de `modelo-de-resivo.jpeg`.

**Independent Test**: Tomar un recibo ya creado (de US1) y exportarlo en cada
formato, comparando visualmente contra la plantilla de referencia.

### Implementation for User Story 2

- [X] T012 [P] [US2] [C:n3->opencode/deepseek-v4-flash-free] Crear `components/admin/ReciboPrint.tsx` (vista Tailwind para pantalla/impresión): header con logo + CUIT/Tel/Correo (`siteConfig`) + N° de recibo (4 dígitos) + fecha, banda "RECIBO", campos "Recibí de"/"Concepto"/"La suma de $"/"Son (en letras)", bloque "Forma de pago" con checkboxes Efectivo/Transferencia/Otro, "Observaciones", línea de firma, pie "¡Gracias por su confianza!" — replicando `modelo-de-resivo.jpeg` con los tokens `--color-primary`/`--color-secondary`, siguiendo el patrón de `components/admin/PresupuestoPrint.tsx` (incluyendo estilos `@media print`)
- [X] T013 [P] [US2] [C:n3->opencode/deepseek-v4-flash-free] Crear `components/admin/ReciboExportView.tsx` (vista con estilos inline `RESET`, para exportación a imagen vía `dom-to-image-more`), replicando el mismo layout y contenido de T012 según el patrón de `components/admin/PresupuestoExportView.tsx`
- [X] T014 [P] [US2] [C:n1->opencode/north-mini-code-free] Crear `app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx`, copiando el patrón exacto de `app/admin/[id]/ExportImageButton.tsx` (ajustando nombre de archivo descargado a `recibo-{numero}.png`)
- [X] T015 [P] [US2] [C:n1->opencode/north-mini-code-free] Crear `app/admin/[id]/recibos/[reciboId]/ReciboPrintButton.tsx`, copiando el patrón exacto de `app/admin/[id]/PrintButton.tsx`
- [X] T016 [US2] [C:n2->opencode/mimo-v2.5-free] Crear `app/admin/[id]/recibos/[reciboId]/page.tsx` (server component, patrón de `app/admin/[id]/page.tsx`): busca el recibo por `reciboId`, `notFound()` si no existe, renderiza `<ReciboPrint>` visible + `<ReciboExportView>` oculto para exportación, con botones `ReciboExportImageButton` y `ReciboPrintButton`. Depende de T012, T013, T014, T015, T004.

**Checkpoint**: User Story 2 completamente funcional — exportación a imagen y PDF con diseño fiel a la plantilla oficial.

---

## Phase 5: User Story 3 - Eliminar un recibo cargado por error (Priority: P3)

**Goal**: El dueño puede eliminar un recibo erróneo con confirmación explícita,
recalculando entregado/saldo de inmediato.

**Independent Test**: Crear un recibo, eliminarlo, y verificar que desaparece
de la lista y que entregado/saldo vuelven a su valor previo.

### Implementation for User Story 3

- [X] T017 [US3] [C:n1->opencode/north-mini-code-free] Crear `app/admin/[id]/ReciboDeleteButton.tsx`, copiando el patrón exacto de `app/admin/[id]/DeleteButton.tsx` (confirmación `confirm()`, `DELETE /api/recibos/{id}`, `router.refresh()` tras éxito). Depende de T008.
- [X] T018 [US3] [C:n2->opencode/mimo-v2.5-free] Integrar `ReciboDeleteButton` en `app/admin/[id]/ReciboLista.tsx` (una por cada recibo listado). Depende de T010, T017.

**Checkpoint**: Las 3 user stories funcionan de forma independiente y en conjunto — MVP completo.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validación de calidad y documentación acorde a la constitución del proyecto

- [X] T019 [P] [C:n1->opencode/north-mini-code-free] Ejecutar `npm run lint` y corregir cualquier error/warning introducido por los archivos nuevos (Constitución, Flujo de Trabajo y Calidad)
- [X] T020 [P] [C:n2->opencode/mimo-v2.5-free] Actualizar `docs/ARQUITECTURA.md` describiendo el nuevo módulo de recibos (`lib/recibos-store.ts`, relación con presupuestos, cascada de borrado) (Constitución, Flujo de Trabajo y Calidad)
- [X] T021 [C:n2->opencode/mimo-v2.5-free] Ejecutar manualmente los 4 escenarios de `quickstart.md` contra el servidor de desarrollo (`npm run dev`) y confirmar que cada resultado esperado se cumple. Depende de T001-T018 completas. **Validado end-to-end vía `npm run build && npm run start` + llamadas HTTP directas (curl): US1 (3 escenarios: $40k→saldo $60k, +$60k→saldo $0, sobrepago +$1k→saldo -$1k con advertencia visual), US2 (vista de detalle del recibo renderiza RECIBO/N°0001/monto en letras/CUIT/firma/pie/export-root), US3 (eliminar recibo recalcula saldo a $0, advertencia desaparece), cascada (eliminar presupuesto borra sus 2 recibos de `data/recibos.json`), auth (POST sin cookie → 401), validación (monto=0 → 400). Datos de prueba y `.env.local` temporal limpiados post-validación.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — puede iniciar de inmediato
- **Foundational (Phase 2)**: Depende de T001 (Setup) para T004 — BLOQUEA todas las user stories
- **User Story 1 (Phase 3)**: Depende de Foundational (T004, T007) completo
- **User Story 2 (Phase 4)**: Depende de Foundational (T004) completo; usa recibos creados por US1 pero es implementable/testeable de forma independiente dado un recibo existente
- **User Story 3 (Phase 5)**: Depende de Foundational (T008) completo; usa recibos creados por US1 pero es implementable/testeable de forma independiente dado un recibo existente
- **Polish (Phase 6)**: Depende de que todas las user stories deseadas estén completas

### User Story Dependencies

- **User Story 1 (P1)**: Sin dependencia de otras user stories — es el MVP
- **User Story 2 (P2)**: No depende del código de US1, pero para probarse end-to-end necesita datos (un recibo) que US1 permite crear
- **User Story 3 (P3)**: No depende del código de US1/US2, pero para probarse end-to-end necesita datos (un recibo) que US1 permite crear

### Within Each User Story

- US1: T009 y T010 en paralelo → T011 los integra
- US2: T012, T013, T014, T015 en paralelo → T016 los integra
- US3: T017 → T018 (integración secuencial, un solo archivo modificado en T018)

### Parallel Opportunities

- Setup: T001, T002, T003 en paralelo
- Foundational: T006 en paralelo con T004/T005; T007 y T008 en paralelo entre sí (ambos dependen solo de T004)
- US1: T009 y T010 en paralelo
- US2: T012, T013, T014, T015 en paralelo
- Polish: T019 y T020 en paralelo

---

## Parallel Example: User Story 2

```bash
# Lanzar en paralelo los 4 componentes de exportación de US2:
Task: "Crear components/admin/ReciboPrint.tsx"
Task: "Crear components/admin/ReciboExportView.tsx"
Task: "Crear app/admin/[id]/recibos/[reciboId]/ReciboExportImageButton.tsx"
Task: "Crear app/admin/[id]/recibos/[reciboId]/ReciboPrintButton.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup (T001-T003)
2. Completar Phase 2: Foundational (T004-T008) — CRÍTICO, bloquea todo
3. Completar Phase 3: User Story 1 (T009-T011)
4. **STOP and VALIDATE**: Probar US1 de forma independiente (crear 2 recibos, verificar entregado/saldo)
5. Deploy/demo si está listo — ya resuelve "llevar la cuenta del total... cuánto se debe, cuánto se ha entregado"

### Incremental Delivery

1. Setup + Foundational → base lista
2. Agregar User Story 1 → probar independientemente → demo (MVP)
3. Agregar User Story 2 (exportar imagen/PDF) → probar independientemente → demo
4. Agregar User Story 3 (eliminar por error) → probar independientemente → demo
5. Polish (lint + docs + validación end-to-end de quickstart.md)

---

## Notes

- [P] tasks = archivos distintos, sin dependencias entre sí
- [Story] label mapea cada tarea a su user story para trazabilidad
- Cada user story es completable y testeable de forma independiente
- Commitear después de cada tarea o grupo lógico
- Detenerse en cada checkpoint para validar la story de forma independiente
- Evitar: tareas vagas, conflictos en el mismo archivo, dependencias cruzadas entre stories que rompan la independencia

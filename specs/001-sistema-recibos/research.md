# Research: Sistema de Recibos de Pago

**Feature**: `001-sistema-recibos` | **Date**: 2026-07-28

## Contexto ya resuelto (sin NEEDS CLARIFICATION pendientes)

Todas las incógnitas del Technical Context fueron resueltas por inspección directa
del código existente (mismo repo, mismo patrón que `presupuestos`) y por las
respuestas de `/speckit.clarify`. No quedan `NEEDS CLARIFICATION`.

## Decisión 1: Almacenamiento — archivo JSON dedicado (`data/recibos.json`)

- **Decision**: Crear `lib/recibos-store.ts` siguiendo exactamente el mismo patrón
  que `lib/presupuestos-store.ts` (lectura/escritura atómica vía archivo `.tmp` +
  `rename`), con su propio archivo `data/recibos.json` y su propio contador
  `ultimoNumero` para la numeración correlativa global de recibos.
- **Rationale**: Constitución Principio V (Simplicidad) exige justificar cualquier
  alternativa a la solución de archivo JSON ya probada. El volumen de datos (recibos
  de una PyME) y la ausencia de necesidad de consultas complejas no justifican una
  base de datos. Mantener un archivo separado (en vez de anidar recibos dentro de
  `presupuestos.json`) evita reescrituras masivas del archivo de presupuestos cada
  vez que se registra un pago, y permite una numeración correlativa global de
  recibos independiente de la numeración de presupuestos (según clarificación).
- **Alternatives considered**:
  - Anidar `recibos: Recibo[]` dentro de cada `Presupuesto` en `presupuestos.json`:
    rechazado porque mezclaría dos ciclos de vida distintos en un solo archivo y
    complicaría la numeración correlativa global.
  - Base de datos (SQLite/Postgres): rechazado por Principio V — no hay necesidad de
    concurrencia ni consultas complejas que lo justifiquen.

## Decisión 2: Relación Presupuesto ↔ Recibo y cálculo de entregado/saldo

- **Decision**: `Recibo.presupuestoId` referencia al `id` del presupuesto. El total
  entregado y el saldo pendiente se calculan en tiempo de lectura (no se persisten
  como campos denormalizados en `Presupuesto`), iterando los recibos del
  presupuesto vía una función `getRecibosByPresupuesto(presupuestoId)` +
  `sumMontos()`.
- **Rationale**: Evita duplicar/desincronizar datos (un campo `entregado` cacheado en
  `Presupuesto` podría quedar desactualizado si falla una escritura). El volumen de
  recibos por presupuesto es bajo, por lo que el cálculo en lectura es
  computacionalmente trivial. Consistente con el patrón ya usado para `total` del
  presupuesto (se recalcula, no se acumula manualmente en cada request salvo en
  creación).
- **Alternatives considered**: Persistir `entregado`/`saldoPendiente` como campos del
  presupuesto, actualizados en cada creación/eliminación de recibo — rechazado por
  riesgo de desincronización y complejidad adicional innecesaria (Principio V).

## Decisión 3: Eliminación en cascada al borrar un presupuesto

- **Decision**: `deletePresupuesto()` en `lib/presupuestos-store.ts` MUST invocar
  también la eliminación de todos los recibos asociados a ese `presupuestoId` en
  `lib/recibos-store.ts` (`deleteRecibosByPresupuesto(id)`), dentro de la misma
  operación de borrado.
- **Rationale**: Cumple FR-013 (edge case identificado en spec: evitar recibos
  huérfanos). Al ser dos archivos JSON independientes, no hay integridad
  referencial automática de una base de datos; se implementa explícitamente en el
  código.
- **Alternatives considered**: No hacer cascade y dejar recibos huérfanos visibles
  con "presupuesto eliminado" — rechazado, contradice explícitamente el edge case
  ya definido en el spec.

## Decisión 4: Conversión de monto a texto ("Son en letras")

- **Decision**: Crear una función pura `numeroALetras(monto: number): string` en
  `lib/numero-a-letras.ts` (sin dependencias externas), que genere el texto en
  español (p. ej. "Cuarenta mil pesos"). El formulario de recibo la usa para
  autocompletar el campo "Son (en letras)" al cambiar el monto, pero el campo queda
  editable por el dueño antes de guardar (FR-003).
- **Rationale**: Evita agregar una dependencia npm nueva solo para esta
  conversión (Principio V); es una función acotada y testeable de forma aislada.
- **Alternatives considered**: Librería npm de terceros para números a letras en
  español — rechazada por Principio V (dependencia innecesaria para una función
  simple y acotada).

## Decisión 5: Exportación a imagen y PDF — reutilizar patrón existente

- **Decision**: Reutilizar exactamente el mismo mecanismo que ya usa
  `PresupuestoExportView.tsx` + `ExportImageButton.tsx` (librería `dom-to-image-more`
  ya instalada) para exportar el recibo como imagen, y el mismo mecanismo de
  `PrintButton.tsx` (`window.print()` + CSS `@media print`) para exportar/imprimir
  como PDF vía el diálogo nativo del navegador.
- **Rationale**: Constitución Principio V — no agregar dependencias nuevas
  (generadores de PDF en servidor) cuando el patrón ya existente y probado en
  producción resuelve el mismo problema para presupuestos. Mantiene consistencia de
  UX entre presupuestos y recibos (Principio IV).
- **Alternatives considered**: Generación de PDF en servidor (p. ej. Puppeteer,
  `pdf-lib`) — rechazada por Principio V (nueva dependencia pesada, sin necesidad
  real dado que el flujo de impresión del navegador ya cumple el requisito).

## Decisión 6: Diseño visual del recibo — fidelidad a `modelo-de-resivo.jpeg`

- **Decision**: Crear `ReciboPrint.tsx` (vista con clases Tailwind, para pantalla e
  impresión) y `ReciboExportView.tsx` (vista con estilos inline, para exportación a
  imagen vía `dom-to-image-more`, replicando el patrón `PresupuestoExportView.tsx`
  cuyo uso de `RESET`/inline styles evita que clases Tailwind se pierdan al
  rasterizar). El layout replica fielmente la plantilla de referencia: header con
  logo + CUIT/Tel/Correo + N° de recibo + fecha; banda "RECIBO"; campos "Recibí de",
  "Concepto", "La suma de $", "Son (en letras)"; bloque "Forma de pago" con
  checkboxes Efectivo/Transferencia/Otro; "Observaciones"; línea de firma; pie
  "¡Gracias por su confianza!".
- **Rationale**: FR-007/FR-008 exigen fidelidad visual al diseño oficial; Principio
  IV (Consistencia de Diseño) exige usar los tokens de marca ya definidos
  (`--color-primary` `#0B1C3E`, `--color-secondary` `#FF9000`) que además coinciden
  visualmente con los colores del `modelo-de-resivo.jpeg` (azul marino y naranja).
- **Alternatives considered**: Generar el recibo como imagen estática editable
  (plantilla PNG con overlay de texto) — rechazado por ser más frágil ante cambios
  de datos y no reutilizar el stack React/Tailwind ya existente.

## Decisión 7: Autorización de las nuevas rutas

- **Decision**: Extender el `matcher` de `proxy.ts` para incluir
  `/api/recibos/:path*`, de modo que quede protegido por el mismo middleware JWT que
  ya protege `/admin` y `/api/presupuestos`.
- **Rationale**: Constitución Principio I (Seguridad del Panel Administrativo) —
  toda ruta nueva bajo el panel hereda por defecto las garantías de autenticación
  existentes; olvidar este paso dejaría `/api/recibos` completamente público.
- **Alternatives considered**: Verificar la sesión manualmente dentro de cada route
  handler de recibos — rechazado por duplicar lógica ya centralizada en el
  middleware `proxy.ts` (menor superficie de error).

## Decisión 8: Advertencia de sobrepago (FR-012)

- **Decision**: La advertencia de "monto entregado supera el total del
  presupuesto" es puramente de UI (cálculo derivado en el cliente/servidor al
  renderizar, comparando `entregado > presupuesto.total`), no bloquea el guardado
  ni agrega un nuevo campo persistido.
- **Rationale**: Cumple FR-012 sin introducir estado adicional a sincronizar
  (consistente con Decisión 2).

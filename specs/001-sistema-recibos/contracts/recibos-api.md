# API Contract: Recibos

**Feature**: `001-sistema-recibos` | **Base path**: `/api/recibos`

Todas las rutas están protegidas por el middleware `proxy.ts` (matcher
`/api/recibos/:path*`): requieren cookie de sesión JWT válida (`cuyo_admin_session`).
Sin sesión válida → `401 { "error": "No autorizado" }`.

**Nota de diseño**: siguiendo el patrón ya establecido por `presupuestos` (los
Server Components leen datos directamente vía `lib/*-store.ts`, sin pasar por
un endpoint HTTP — ver `app/admin/[id]/page.tsx` usando `getPresupuesto()`), la
lista de recibos de un presupuesto y el resumen entregado/saldo pendiente se
obtienen server-side llamando directamente a
`getRecibosByPresupuesto(presupuestoId)` y `getResumenPresupuesto(presupuestoId, total)`
de `lib/recibos-store.ts`. No existe un endpoint `GET /api/recibos` público;
la API solo expone las operaciones de mutación (crear, eliminar), consistente
con el Principio V de la constitución (evitar superficie de API innecesaria).

## `POST /api/recibos`

Crea un nuevo recibo asociado a un presupuesto (FR-001, FR-002).

**Body**:
```json
{
  "presupuestoId": "abc12345",
  "fecha": "2026-07-28",
  "recibiDe": "Juan Pérez",
  "concepto": "Anticipo obra techo",
  "monto": 40000,
  "montoEnLetras": "Cuarenta mil pesos",
  "formaPago": "Transferencia",
  "formaPagoOtroDetalle": null,
  "observaciones": ""
}
```

**Validaciones del servidor** (FR-011 y Data Model):
- `presupuestoId` debe existir → si no, `404`.
- `monto` debe ser número `> 0` → si no, `400` con lista de errores.
- `recibiDe`, `concepto`, `fecha` no vacíos → si no, `400`.
- `formaPago` debe ser uno de `Efectivo | Transferencia | Otro`.

**Response 201**: objeto `Recibo` completo (con `id`, `numero` correlativo
global asignado, `creadoEn`).

**Response 400**:
```json
{ "errors": ["El monto debe ser mayor a 0", "..."] }
```

**Response 404**:
```json
{ "error": "Presupuesto no encontrado" }
```

## `DELETE /api/recibos/{id}`

Elimina un recibo existente (FR-006). El cliente MUST solicitar confirmación
explícita al usuario antes de invocar este endpoint (implementado en UI, no en
el contrato de API).

**Response 200**:
```json
{ "ok": true }
```

**Response 404**:
```json
{ "error": "Recibo no encontrado" }
```

## Efecto colateral: cascada en `DELETE /api/presupuestos/{id}`

El endpoint ya existente `DELETE /api/presupuestos/{id}` se modifica para
eliminar también, en la misma operación, todos los recibos cuyo
`presupuestoId` coincida con el presupuesto eliminado (FR-013). No cambia su
contrato de request/response externo (`{ "ok": true }` / `404`).

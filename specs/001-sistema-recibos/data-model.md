# Data Model: Sistema de Recibos de Pago

**Feature**: `001-sistema-recibos` | **Date**: 2026-07-28

## Entidad: Recibo

Comprobante de un pago recibido por un cliente, vinculado a un presupuesto
(FR-001, FR-002, FR-003).

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `id` | `string` | Sí | Generado con `nanoid(8)`, igual que `Presupuesto.id` |
| `numero` | `number` | Sí | Correlativo global único (contador compartido por todos los recibos, independiente del número de presupuesto — clarificación) |
| `presupuestoId` | `string` | Sí | FK lógica hacia `Presupuesto.id` |
| `fecha` | `string` (ISO date `YYYY-MM-DD`) | Sí | Fecha del recibo |
| `recibiDe` | `string` | Sí | Nombre de quien realiza el pago ("Recibí de") |
| `concepto` | `string` | Sí | Concepto del pago |
| `monto` | `number` | Sí | Debe ser `> 0` (FR-011) |
| `montoEnLetras` | `string` | Sí | Autogenerado desde `monto` vía `numeroALetras()`, editable por el usuario antes de guardar (FR-003) |
| `formaPago` | `FormaPagoRecibo` | Sí | `'Efectivo' \| 'Transferencia' \| 'Otro'` |
| `formaPagoOtroDetalle` | `string` | No | Solo aplica si `formaPago === 'Otro'` |
| `observaciones` | `string` | No | Texto libre opcional |
| `creadoEn` | `string` (ISO datetime) | Sí | Timestamp de creación, no editable |

### Validaciones

- `monto` MUST ser un número finito y `> 0` (FR-011); rechazar con error si es
  `0`, negativo, `NaN` o no numérico.
- `recibiDe`, `concepto` y `fecha` MUST ser no vacíos.
- `formaPagoOtroDetalle` es requerido solo cuando `formaPago === 'Otro'`
  (validación de UI + servidor).
- `presupuestoId` MUST referenciar un presupuesto existente al momento de la
  creación (404 si no existe).

### Ciclo de vida

- **Creación**: única vía de entrada; no existe edición posterior (clarificación:
  "Solo eliminar y recrear").
- **Eliminación**: individual (con confirmación explícita, FR-006) o en cascada
  al eliminarse el presupuesto padre (FR-013).
- Sin estados/transiciones adicionales (a diferencia de `Presupuesto.estado`).

### Persistencia

```ts
interface RecibosDB {
  version: 1;
  ultimoNumero: number;      // contador global compartido por todos los recibos
  recibos: Recibo[];
}
```

Archivo: `data/recibos.json` (nuevo, mismo patrón de escritura atómica que
`data/presupuestos.json`: `writeFile` a `.tmp` + `rename`).

## Entidad derivada: Resumen de cobranza del Presupuesto

No es una entidad persistida — se calcula en tiempo de lectura combinando
`Presupuesto.total` con la suma de `Recibo.monto` de los recibos cuyo
`presupuestoId` coincide (ver `research.md` Decisión 2).

| Campo derivado | Cálculo | Uso |
|---|---|---|
| `entregado` | `sum(recibos.map(r => r.monto))` | Mostrado en `/admin/[id]` (FR-004, FR-005) |
| `saldoPendiente` | `presupuesto.total - entregado` | Mostrado en `/admin/[id]` (FR-004, FR-005) |
| `sobrepago` | `entregado > presupuesto.total` (booleano) | Dispara advertencia visual no bloqueante (FR-012) |

## Relaciones

```
Presupuesto (1) ──── (N) Recibo
     id  ◄───────────── presupuestoId
```

- Un `Presupuesto` puede tener cero o más `Recibo`.
- Un `Recibo` pertenece exactamente a un `Presupuesto`.
- Eliminar el `Presupuesto` elimina en cascada todos sus `Recibo` asociados
  (FR-013, implementado en `deletePresupuesto()`).

## Tipos TypeScript (resumen, ver `types/recibo.ts` en implementación)

```ts
export type FormaPagoRecibo = 'Efectivo' | 'Transferencia' | 'Otro';

export interface Recibo {
  id: string;
  numero: number;
  presupuestoId: string;
  fecha: string;
  recibiDe: string;
  concepto: string;
  monto: number;
  montoEnLetras: string;
  formaPago: FormaPagoRecibo;
  formaPagoOtroDetalle?: string;
  observaciones?: string;
  creadoEn: string;
}

export interface RecibosDB {
  version: 1;
  ultimoNumero: number;
  recibos: Recibo[];
}

export type ReciboInput = Omit<Recibo, 'id' | 'numero' | 'creadoEn'>;
```

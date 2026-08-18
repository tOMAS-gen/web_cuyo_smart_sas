# Contracts — intencionalmente vacío

**Feature**: `002-mejorar-diseno-recibos` | **Date**: 2026-07-29

## Por qué no hay archivos de contrato

Esta feature **no introduce ni modifica ninguna interfaz externa**: no hay
endpoints nuevos, ni cambios en las formas de request/response de los existentes,
ni cambios en el modelo persistido. Es una feature de presentación (rediseño del
documento del comprobante y de las pantallas del panel) más la corrección del
pipeline cliente de rasterizado DOM→PNG.

Base normativa:

- [spec.md](../spec.md) § Assumptions — «Sin cambios de datos ni de contratos: se
  asume que no se requieren cambios en el modelo de datos persistido ni en los
  contratos de las rutas de recibos».
- [plan.md](../plan.md) § Constraints — «Sin cambios en el modelo persistido ni en
  los contratos de datos de recibos (FR-021, FR-022)».
- [plan.md](../plan.md) § Project Structure — `app/api/cuentas-recibos/` figura
  como «Sin cambios de contrato; protegido vía proxy».
- [data-model.md](../data-model.md) § 4 — detalle completo de la decisión.

Se optó por **no** crear archivos placeholder (OpenAPI vacíos, esquemas de
ejemplo) porque un contrato inventado invita a tareas de implementación que el
plan prohíbe explícitamente. Este README existe solo para que la ausencia sea
deliberada y auditable.

## Inventario de interfaces existentes (todas intactas)

| Ruta | Métodos | Payload | Estado en esta feature |
|---|---|---|---|
| `/api/recibos` | `GET`, `POST` | `ReciboInput` (`types/recibo.ts`) | Sin cambios |
| `/api/recibos/[id]` | `DELETE` | — | Sin cambios |
| `/api/cuentas-recibos` | `GET`, `POST` | `CuentaReciboInput` (`types/cuenta-recibo.ts`) | Payload sin cambios; **se agrega autenticación** |
| `/api/cuentas-recibos/[id]` | `DELETE` | — | Payload sin cambios; **se agrega autenticación** |
| `/api/presupuestos`, `/api/presupuestos/[id]` | `GET`, `POST`, `PUT`, `DELETE` | Sin cambios | Fuera de alcance |
| `/api/auth/login`, `/api/auth/logout` | `POST` | Sin cambios | Fuera de alcance |

## El único cambio en la capa de API es de seguridad, no de contrato

`proxy.ts:32` no incluye hoy `/api/cuentas-recibos/:path*` en su `matcher`, y
ninguna de las dos rutas de cuentas verifica la sesión: cualquiera puede crear o
borrar cuentas de cliente sin credenciales. Es un incumplimiento **preexistente**
del Principio I de la constitución que FR-020 obliga a no perpetuar, y es un gate
bloqueante del plan (ver [plan.md](../plan.md) § «Principio I — remediación
obligatoria»).

Efecto observable de la corrección:

- **Antes**: petición sin cookie de sesión → `200` con datos reales.
- **Después**: petición sin cookie de sesión → rechazada/redirigida por el proxy.
- **Peticiones autenticadas**: request y response byte-idénticos a hoy.

Es decir, cambia *quién* puede llamar, no *qué* se envía ni *qué* se devuelve. Por
eso no se versiona como contrato nuevo. La verificación de este gate está en
[quickstart.md](../quickstart.md) § Escenario 0.

## Exportación de imagen y PDF: sin superficie de red

- La exportación PNG ocurre **enteramente en el cliente**: `dom-to-image-more`
  serializa un nodo del DOM ya renderizado dentro de `/admin` y produce un `Blob`
  descargado por el navegador. **No existe endpoint de imagen**, ni público ni
  autenticado (rechazo explícito del render server-side en
  [research.md](../research.md) § 2).
- El PDF se obtiene por el flujo de impresión nativo del navegador
  (`window.print()` + `@page`), sin generación en servidor.

Por construcción, entonces, esta feature no abre ninguna ruta de exportación
accesible sin autenticación — la condición exacta que FR-020 exige.

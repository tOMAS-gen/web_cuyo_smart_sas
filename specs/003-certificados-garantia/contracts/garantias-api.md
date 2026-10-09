# API Contract: Certificados de Garantía

**Feature**: `003-certificados-garantia`

Todas las rutas están protegidas por `proxy.ts` y requieren la cookie de sesión. Sin
sesión responden `401 { "error": "No autorizado" }`.

**Formato de errores** (igual que en recibos):
- `400 { "errors": string[] }` si la validación falla;
- `400 { "error" }` si el JSON es inválido;
- `404 { "error" }`;
- `500 { "error" }`.

Los Server Components pueden leer directamente desde los stores
(`getGarantias`, `getGarantia`, `getGarantiasByPresupuesto`, `getGarantiasByCuenta`,
`getTiposGarantia`, `getFirmaEmpresa`) sin pasar por HTTP, como hacen hoy los
recibos.

## Certificados — `/api/garantias`

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/garantias` | `200 Garantia[]` (por número, de mayor a menor). Filtros opcionales: `?presupuestoId=` o `?cuentaReciboId=` |
| `POST` | `/api/garantias` | `201 Garantia` |
| `GET` | `/api/garantias/:id` | `200 Garantia` o `404` |
| `PUT` | `/api/garantias/:id` | `200 Garantia` (reemplazo completo; se conservan `id`, `numero` y `creadoEn`) o `404` |
| `DELETE` | `/api/garantias/:id` | `200 { ok: true }` o `404` |

**Body de POST/PUT** (`GarantiaInput`): la validación la hace `validarGarantiaInput`
en `lib/garantia-logic.ts`.

```json
{
  "presupuestoId": "mtPpX6_u",
  "tipoGarantiaId": "impermeabilizacion",
  "trabajosGarantizados": "impermeabilización y tratamiento de cubierta/techo",
  "aniosGarantia": 10,
  "alcance": "Cuyo Smart S.A.S. garantiza durante un período de {anios_texto} ...",
  "exclusiones": ["Granizo.", "..."],
  "cliente": "Ana Gómez",
  "clienteDocumento": "20-12345678-9",
  "clienteTelefono": "261 555-5555",
  "domicilioObra": "San Martín 123",
  "localidad": "Godoy Cruz",
  "superficieM2": 120,
  "trabajosRealizados": "Impermeabilización de losa con membrana líquida",
  "materialesSistema": "Membrana líquida poliuretánica, 3 manos",
  "fechaInicio": "2026-09-20",
  "fechaFinalizacion": "2026-10-01",
  "vigenciaDesde": "2026-10-01",
  "lugarEmision": "Mendoza",
  "fechaEmision": "2026-10-09",
  "observaciones": "",
  "incluirFirmaEmpresa": true,
  "firmaEmpresaDataUrl": "data:image/png;base64,...",
  "firmaClienteDataUrl": "data:image/png;base64,..."
}
```

Comportamiento del servidor:
- Calcula `vigenciaHasta` y `presupuestoNumero`; si el cliente los manda, se ignoran.
- Si viene `presupuestoId` o `cuentaReciboId` y no existe, responde `404`.
- Mandar los dos a la vez responde `400`.
- Si hay `presupuestoId`, `referenciaPresupuesto` se descarta.
- Los strings vacíos en campos opcionales se guardan como `undefined`.

## Precarga — `GET /api/garantias/prefill`

Recibe `?presupuestoId=` o `?cuentaReciboId=` y responde `200 GarantiaPrefill`:

```json
{
  "presupuestoId": "mtPpX6_u",
  "presupuestoNumero": 1,
  "cliente": "Ana Gómez",
  "domicilioObra": "San Martín 123, Godoy Cruz",
  "trabajosRealizados": "Impermeabilización de losa con membrana líquida",
  "resumenPagos": { "total": 1500, "entregado": 600, "saldoPendiente": 900 }
}
```
- Desde una cuenta, `domicilioObra` viene vacío y `trabajosRealizados` toma el concepto de la cuenta.
- Si el presupuesto o la cuenta no existen responde `404`; sin parámetros, `400`.

## Firma de la empresa — `/api/garantias/firma-empresa`

| Método | Body | Respuesta |
|---|---|---|
| `GET` | — | `200 { dataUrl, actualizadoEn }` o `404` si no hay firma |
| `PUT` | `{ "dataUrl": "data:image/png;base64,..." }` | `200 FirmaEmpresa` o `400` (formato inválido o más de 300 KB) |
| `DELETE` | — | `200 { ok: true }` o `404` |

## Tipos de garantía — `/api/tipos-garantia`

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/tipos-garantia` | `200 TipoGarantia[]` (por nombre) |
| `POST` | `/api/tipos-garantia` | `201 TipoGarantia` |
| `GET` | `/api/tipos-garantia/:id` | `200` o `404` |
| `PUT` | `/api/tipos-garantia/:id` | `200` o `404` |
| `DELETE` | `/api/tipos-garantia/:id` | `200 { ok: true }` o `404` (no afecta a los certificados emitidos) |

**Body de POST/PUT** (`TipoGarantiaInput`, validado con `validarTipoGarantiaInput`):
`{ nombre, trabajosGarantizados, aniosPorDefecto, alcance, exclusiones[] }`.

## Cascada

- `DELETE /api/presupuestos/:id` también borra los certificados con ese `presupuestoId`.
- `DELETE /api/cuentas-recibos/:id` también borra los certificados con ese `cuentaReciboId`.

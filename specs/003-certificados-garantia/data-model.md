# Data Model: Certificados de Garantía

**Feature**: `003-certificados-garantia` | **Date**: 2026-10-09

Persistencia: archivos JSON en `DATA_DIR`, con escritura atómica (`.tmp` + `rename`),
igual que el resto de los stores.

| Archivo | Store | Tipo |
|---|---|---|
| `data/garantias.json` | `lib/garantias-store.ts` | `GarantiasDB` (`types/garantia.ts`) |
| `data/tipos-garantia.json` | `lib/tipos-garantia-store.ts` | `TiposGarantiaDB` (`types/tipo-garantia.ts`) |
| `data/firma-empresa.json` | `lib/firma-empresa-store.ts` | `FirmaEmpresa` (`types/garantia.ts`) |

## Garantia

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | string | sí | `nanoid(8)` |
| `numero` | number | sí | Correlativo propio (`ultimoNumero + 1`). No se reutiliza y se mantiene al editar |
| `presupuestoId` | string | no | Excluyente con `cuentaReciboId`. Si no hay ninguno, el certificado es suelto |
| `cuentaReciboId` | string | no | |
| `presupuestoNumero` | number | no | **Server**: snapshot de `Presupuesto.numero` |
| `referenciaPresupuesto` | string | no | Texto libre (solo si no hay `presupuestoId`) |
| `tipoGarantiaId` | string | no | Tipo de origen (informativo) |
| `trabajosGarantizados` | string | sí | Completa "...sobre los trabajos de ___" |
| `aniosGarantia` | number | sí | Entero de 1 a 50 |
| `alcance` | string | sí | Párrafos separados por línea en blanco; admite placeholders |
| `exclusiones` | string[] | sí | Puede ser `[]` |
| `cliente` | string | sí | ≥ 2 caracteres |
| `clienteDocumento` | string | no | DNI / CUIT |
| `clienteTelefono` | string | no | |
| `domicilioObra` | string | sí | ≥ 3 caracteres |
| `localidad` | string | no | |
| `superficieM2` | number | no | > 0 |
| `trabajosRealizados` | string | sí | |
| `materialesSistema` | string | no | Materiales o sistema aplicado |
| `fechaInicio` | YYYY-MM-DD | no | ≤ `fechaFinalizacion` |
| `fechaFinalizacion` | YYYY-MM-DD | sí | |
| `vigenciaDesde` | YYYY-MM-DD | sí | Si no viene, toma `fechaFinalizacion` |
| `vigenciaHasta` | YYYY-MM-DD | sí | **Server**: `sumarAnios(vigenciaDesde, aniosGarantia)` |
| `lugarEmision` | string | sí | Valor por defecto sugerido: `LUGAR_EMISION_POR_DEFECTO` ("Mendoza") |
| `fechaEmision` | YYYY-MM-DD | sí | |
| `observaciones` | string | no | |
| `incluirFirmaEmpresa` | boolean | sí | `false` si no viene |
| `firmaClienteDataUrl` | string | no | `data:image/(png\|jpeg\|webp);base64,...`, ≤ 300 KB decodificados |
| `creadoEn` / `actualizadoEn` | ISO datetime | sí | **Server** |

## TipoGarantia

Campos: `id`, `nombre`, `trabajosGarantizados`, `aniosPorDefecto` (de 1 a 50),
`alcance`, `exclusiones[]`, `creadoEn` y `actualizadoEn`.
- Mientras no exista el archivo, el store sirve el **seed** (ids `impermeabilizacion`,
  `aislacion-termica`, `techos-zingueria`, `obras-civiles`).
- La primera alta, edición o baja persiste el archivo.

## FirmaEmpresa

`{ dataUrl, actualizadoEn }`. Es una sola firma global y no se copia en los
certificados.

## Placeholders en `alcance` / `exclusiones`

Los resuelve `renderTextoGarantia` en `lib/garantia-logic.ts`:

| Placeholder | Resultado |
|---|---|
| `{anios}` | `10` |
| `{anios_letras}` | `DIEZ (10)` |
| `{anios_texto}` | `DIEZ (10) AÑOS` (o `UN (1) AÑO`) |
| `{presupuesto}` | `0012`, la referencia libre, o `—` |
| `{presupuesto_ref}` | `en el Presupuesto N.º 0012`, o `en el presente certificado` |

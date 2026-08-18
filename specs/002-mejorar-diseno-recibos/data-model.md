# Phase 1 — Data Model: Mejora de Diseño de Comprobantes y Exportación sin Bordes

**Feature**: `002-mejorar-diseno-recibos` | **Date**: 2026-07-29 | **Plan**: [plan.md](./plan.md)

## Veredicto: cero cambios en el modelo persistido

Esta feature **no crea, elimina ni modifica ninguna entidad persistida, ningún
campo, ningún tipo y ningún archivo de datos**. Es una feature de presentación
(rediseño del documento y de las pantallas del panel) más la corrección del
pipeline de rasterizado DOM→PNG.

Base normativa:

- **spec.md § Key Entities**: «Esta feature no introduce entidades nuevas ni
  cambia los datos guardados; opera sobre las existentes».
- **spec.md § Assumptions**: «Sin cambios de datos ni de contratos».
- **FR-021 / FR-022**: el comportamiento funcional existente (numeración
  correlativa, cálculo de entregado y saldo, borrado en cascada) se preserva sin
  cambios, y los recibos ya guardados deben renderizar con el diseño nuevo **sin
  migración manual de datos**.
- **plan.md § Technical Context → Storage**: «**Sin cambios de esquema en esta
  feature.**»
- **plan.md § Project Structure**: `types/recibo.ts`, `types/cuenta-recibo.ts`,
  `lib/recibos-store.ts`, `lib/cuentas-recibos-store.ts` y
  `lib/numero-a-letras.ts` están marcados explícitamente **SIN CAMBIOS**.

Corolario para `/speckit.tasks`: **no debe generarse ninguna tarea de migración,
versionado de esquema, backfill ni transformación de datos.** Cualquier tarea que
proponga tocar los stores o los tipos de dominio contradice el plan. La única
tarea relacionada con datos es de *higiene de repositorio*: agregar
`/data/cuentas-recibos.json{,.tmp}` a `.gitignore` (gate bloqueante del
Principio I, ver plan.md § «Principio I — remediación obligatoria»).

---

## 1. Entidades persistidas existentes (sin cambios)

### 1.1 `Recibo` — `types/recibo.ts`

Comprobante de un pago recibido. Es la entidad que el documento rediseñado
renderiza y que la exportación rasteriza.

| Campo | Tipo | Oblig. | Notas / uso en el documento |
|---|---|---|---|
| `id` | `string` | Sí | Identificador interno (`nanoid`). No se muestra en el comprobante. |
| `numero` | `number` | Sí | Correlativo único. Se muestra con relleno a 4 dígitos (`0007`) y da nombre al archivo exportado (`recibo-0007.png`, FR-008). Destacado en la jerarquía tipográfica (FR-009). |
| `presupuestoId` | `string?` | No | Vínculo opcional a un presupuesto. Mutuamente excluyente en la práctica con `cuentaReciboId`. |
| `cuentaReciboId` | `string?` | No | Vínculo opcional a una cuenta de recibos independiente. Ambos orígenes producen el **mismo** documento oficial (FR-006). |
| `fecha` | `string` | Sí | Fecha del comprobante en `YYYY-MM-DD` (o ISO). El documento la descompone en día / mes / año sin construir `Date`, para evitar el offset de timezone. |
| `recibiDe` | `string` | Sí | Nombre del pagador. Texto potencialmente largo → debe ajustar en múltiples líneas (FR-012). |
| `concepto` | `string` | Sí | Detalle del pago. Texto largo → multilínea sin desborde ni truncado (FR-012). |
| `monto` | `number` | Sí | Importe en números, formateado `es-AR` con 2 decimales. Dato económico destacado (FR-009). |
| `montoEnLetras` | `string` | Sí | Importe en palabras (generado por `lib/numero-a-letras.ts` al crear el recibo; **se persiste**, no se recalcula al renderizar). Texto largo → multilínea (FR-012). |
| `formaPago` | `'Efectivo' \| 'Transferencia' \| 'Otro'` | Sí | Unión cerrada `FormaPagoRecibo`. |
| `formaPagoOtroDetalle` | `string?` | No | Solo cuando `formaPago === 'Otro'`; el documento compone `Otro: <detalle>`. |
| `observaciones` | `string?` | No | Opcional. Su ausencia **no debe** descolocar firma ni pie (FR-013) → el rediseño le da altura mínima estable (research.md § 5). |
| `creadoEn` | `string` | Sí | Timestamp de creación. No se muestra en el comprobante. |

Tipos derivados en el mismo archivo, también sin cambios:

- `RecibosDB` — envoltorio persistido en `data/recibos.json`:
  `{ version: 1; ultimoNumero: number; recibos: Recibo[] }`. `ultimoNumero`
  sostiene la numeración correlativa única que FR-021 obliga a preservar.
- `ReciboInput` — `Omit<Recibo, 'id' | 'numero' | 'creadoEn'>`: forma que aceptan
  los formularios y `POST /api/recibos`. **Sin cambios**, por eso no hay contrato
  nuevo (ver § 4).
- `ResumenPresupuesto` — `{ entregado: number; saldoPendiente: number; sobrepago: boolean }`.
  Valor **derivado, no persistido**; se calcula sumando los recibos del
  presupuesto. Es el dato que las vistas agrupadoras deben destacar (FR-016,
  SC-008).

### 1.2 `CuentaRecibo` — `types/cuenta-recibo.ts`

Agrupación de recibos de un cliente/concepto que no proviene de un presupuesto.

| Campo | Tipo | Oblig. | Notas |
|---|---|---|---|
| `id` | `string` | Sí | Identificador interno. |
| `cliente` | `string` | Sí | Nombre del cliente. Se muestra en el listado y en el detalle de cuenta. |
| `concepto` | `string` | Sí | Concepto global de la cuenta. |
| `montoTotal` | `number` | Sí | Total acordado; base del cálculo de saldo pendiente. |
| `creadoEn` | `string` | Sí | Timestamp de creación. |

Tipos derivados, sin cambios:

- `CuentaReciboInput` — `Omit<CuentaRecibo, 'id' | 'creadoEn'>`.
- `ResumenCuentaRecibo` — `{ entregado; saldoPendiente; sobrepago }`. Derivado de
  los recibos de la cuenta; alimenta los totales destacados de FR-016 y el
  distintivo visual de saldo cancelado / sobrepago.

### 1.3 `Presupuesto` (referencia)

Fuera del alcance de esta feature salvo por consistencia visual mínima
(plan.md § Project Structure: `app/admin/presupuestos/page.tsx`, MODIF). Sus
atributos y su store (`lib/presupuestos-store.ts`) **no se tocan**; solo se
consumen sus valores derivados (`ResumenPresupuesto`) para destacar total /
entregado / saldo en el detalle.

### 1.4 Persistencia y relaciones (sin cambios)

```text
CuentaRecibo 1 ──< Recibo   (Recibo.cuentaReciboId)
Presupuesto  1 ──< Recibo   (Recibo.presupuestoId)
```

Un `Recibo` pertenece a **exactamente uno** de los dos padres. El borrado del
padre arrastra sus recibos (cascada existente, preservada por FR-021).

| Archivo | Store | Estado |
|---|---|---|
| `data/recibos.json` | `lib/recibos-store.ts` | Sin cambios de esquema |
| `data/cuentas-recibos.json` | `lib/cuentas-recibos-store.ts` | Sin cambios de esquema; **debe agregarse a `.gitignore`** |
| `data/presupuestos.json` | `lib/presupuestos-store.ts` | Sin cambios |

Todos bajo `DATA_DIR` (default `./data`), escritos con *write-tmp + rename*.

---

## 2. Entidad de presentación nueva: `components/admin/recibo-doc.ts`

Único artefacto «modelado» que esta feature introduce. **No se persiste, no se
serializa y no cruza la red**: es un módulo de constantes en tiempo de
compilación, fuente única de la geometría, la paleta y la tipografía del
documento del comprobante. Su razón de existir es acotar la desviación del
Principio IV registrada en plan.md § Complexity Tracking: hoy los mismos
literales están repetidos en cuatro lugares (`ReciboDocument.tsx:50-51`,
`ReciboPrint.tsx:9` en `@page`, y las opciones de `toBlob` en dos copias del
botón), y esa duplicación es una de las vías por las que aparecen las franjas de
FR-002.

### 2.1 Forma propuesta

| Constante / campo | Tipo | Valor origen | Consumidores |
|---|---|---|---|
| `RECIBO_DOC.width` | `number` | `1002` (geometría actual del documento) | `ReciboDocument` (lienzo), `ReciboPrint` (`@page size`), `useReciboExport` (`width * SCALE`) |
| `RECIBO_DOC.height` | `number` | `802` | idem |
| `RECIBO_DOC.background` | `string` | Token `--color-background` (`#FFFFFF`) de `app/globals.css` | Fondo del documento **y** `bgcolor` de `toBlob` — deben ser idénticos por construcción (research.md § 2.5) |
| `RECIBO_DOC.footerHeight` | `number` | Altura del pie navy | `ReciboDocument`; el bleed de 1 px se calcula sobre este valor (research.md § 2, «cinturón y tirantes») |
| `RECIBO_DOC.padding` | `string` | `'40px 48px 52px'` (actual) | Caja interior del documento |
| `EXPORT_SCALE` | `number` | `2` — **constante**, nunca `devicePixelRatio` (FR-004) | `useReciboExport` |
| `COLORS.navy` | `string` | Token `--color-primary` → `#0B1C3E` | Texto base, pie, encabezados del documento |
| `COLORS.orange` | `string` | Token `--color-secondary` → `#FF9000` | Acentos, caja de número/fecha |
| `COLORS.tertiary` | `string` | Token `--color-tertiary` → `#29ABE2` | Acento secundario |
| `COLORS.gray` | `string` | `#4B5563` (escala Tailwind `gray-600`, semántico de UI) | Labels y datos secundarios |
| `COLORS.grayLight` | `string` | `#9CA3AF` (`gray-400`) | Texto terciario |
| `COLORS.rule` | `string` | `#E5E7EB` (`gray-200`) | Separadores y línea de firma |
| `FONT.family` | `string` | `var(--font-montserrat), Montserrat, Arial, sans-serif` | Familia del documento — **corrige el defecto verificado** de research.md § 6 (hoy renderiza Arial) |
| `DOC.cuit` | `string` | `'30-71945595-2'` | Dato legal del comprobante, no copy de marketing (plan.md, Principio II) |

Los valores de contacto (teléfono, email) **no** entran en este módulo: siguen
viniendo de `siteConfig` en `data/content.ts` (Principio II, fuente única de
contenido).

### 2.2 Reglas de validación / invariantes

Son invariantes de *código*, no de datos; conviene verificarlas en la validación
manual de [quickstart.md](./quickstart.md):

1. `RECIBO_DOC.width` y `RECIBO_DOC.height` son **enteros**. Dimensiones
   fraccionarias reintroducen las franjas de FR-002 (research.md § 5).
2. `RECIBO_DOC.background` es **exactamente** el mismo string que se pasa como
   `bgcolor` a `toBlob`. Si divergen, reaparece la costura de FR-003.
3. `EXPORT_SCALE` es una constante literal. Derivarla de `devicePixelRatio` o del
   zoom viola FR-004.
4. Ningún literal de color de marca (`#0B1C3E`, `#FF9000`, `#29ABE2`) debe quedar
   fuera de este módulo dentro de `components/admin/` ni de `app/admin/`: en el
   panel se usan utilidades de token (`bg-primary`, `text-secondary`, …), en el
   documento se usa `COLORS` (research.md § 9, SC-007).
5. `@page { size }` de `ReciboPrint` se **deriva** de `RECIBO_DOC`, nunca se
   escribe a mano (research.md § 7).

### 2.3 Estado (no-modelo) del hook de exportación

`components/admin/useReciboExport.ts` expone estado efímero de UI, no una
entidad: `{ loading: boolean; error: string | null; exportar: () => Promise<void> }`.
No se persiste. Existe para cerrar FR-007 (hoy el error solo va a
`console.error`). Detalle de la receta en research.md § 2 y § 8.

---

## 3. Transiciones de estado

Ninguna. Esta feature no introduce máquinas de estado, ciclos de vida ni estados
nuevos en las entidades. El ciclo de vida existente de `Recibo` (crear → listar →
ver → exportar/imprimir → eliminar con confirmación) se preserva íntegro por
FR-021; lo único que cambia es cómo se **presenta** cada paso.

---

## 4. Contratos: omitidos intencionalmente

**No se creó el directorio `contracts/` con archivos de contrato porque esta
feature no introduce ni modifica ninguna interfaz externa.** Se agregó únicamente
[`contracts/README.md`](./contracts/README.md) documentando la decisión y el
inventario de rutas existentes que quedan intactas.

Fundamento:

- Las rutas `POST/GET /api/recibos`, `DELETE /api/recibos/[id]`,
  `POST/GET /api/cuentas-recibos` y `DELETE /api/cuentas-recibos/[id]` conservan
  **exactamente** las mismas formas de request y response. `ReciboInput` y
  `CuentaReciboInput` no cambian (§ 1.1, § 1.2).
- El único cambio que roza la capa de API es de **seguridad, no de contrato**:
  agregar `/api/cuentas-recibos/:path*` al `matcher` y a la rama protegida de
  `proxy.ts` (plan.md § «Principio I — remediación obligatoria», punto 1). El
  efecto observable es que las peticiones sin sesión pasan de `200` a redirección
  / rechazo por el proxy; el payload de las peticiones autenticadas es idéntico.
- La exportación de imagen es **100 % cliente**: rasteriza un nodo del DOM ya
  renderizado con `dom-to-image-more`. No se agrega ningún endpoint de imagen ni
  de PDF (research.md § 2, alternativa server-side rechazada; plan.md
  § Constitution Check, re-evaluación del Principio I).
- El PDF se sigue obteniendo por el flujo de impresión nativo del navegador
  (spec.md § Assumptions), sin generación en servidor.

---

## Referencias

- Causa raíz del borde y receta de exportación: [research.md](./research.md) § 1, § 2
- Tipografía corporativa (defecto verificado): [research.md](./research.md) § 6
- Desviación acotada del Principio IV: [plan.md](./plan.md) § Complexity Tracking
- Gate de seguridad bloqueante: [plan.md](./plan.md) § «Principio I — remediación obligatoria»
- Validación manual end-to-end: [quickstart.md](./quickstart.md)

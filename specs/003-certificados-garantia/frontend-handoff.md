# Handoff Frontend: Certificados de Garantía

Backend y frontend implementados. Este documento conserva los requisitos de la UI
como referencia. Las pantallas viven en `app/admin/garantias` y los componentes en
`components/admin/garantias`. Ver `quickstart.md` para la verificación del flujo.
Contrato de la API: `contracts/garantias-api.md`. Modelo: `data-model.md`.

## Qué reutilizar (no reimplementar)

Todo lo que sigue sale de `lib/garantia-logic.ts`. Son funciones puras que se
pueden importar desde componentes cliente.

| Función / constante | Uso en UI |
|---|---|
| `validarGarantiaInput(body)` | Validar el form antes del POST/PUT: devuelve los mismos errores que el server |
| `validarTipoGarantiaInput(body)` | Lo mismo para el CRUD de tipos |
| `validarFirmaDataUrl(dataUrl)` | Validar la firma antes de enviarla |
| `sumarAnios(desde, anios)` | Mostrar "vigencia hasta" en vivo mientras se edita el form |
| `textosGarantia(garantia)` | **Todos los textos del documento ya resueltos**: `intro`, `alcance[]` (párrafos), `exclusionesIntro`, `exclusiones[]`, `limitacion`, `constancia` |
| `aniosEnTexto(n)` | "DIEZ (10) AÑOS" |
| `numeroPresupuestoTexto(g)` | "0012", la referencia libre, o `null` |
| `formatNumeroDoc(n)` | Número del certificado con padding de 4 dígitos |
| `LUGAR_EMISION_POR_DEFECTO`, `ANIOS_GARANTIA_MAX`, `FIRMA_MAX_BYTES` | Valores por defecto y límites |

Para las fechas usar `formatFechaDDMMYYYY` de `lib/format-fecha.ts`. **Nunca**
`new Date(iso)`, por el bug de timezone del commit 9708bc2.

## Pantallas

1. **Nav**: agregar "Garantías" en `NAV_LINKS` (`app/admin/layout.tsx`).
2. **`/admin/garantias`**: lista con número, cliente, obra, años, vigencia hasta y
   origen (presupuesto N.º / cuenta / suelto). Lee del server con `getGarantias()`.
3. **`/admin/garantias/nueva`**: formulario.
   - **Origen**: Presupuesto, Cuenta de recibos o Suelto.
     - Si es presupuesto o cuenta, se elige uno y se llama a
       `GET /api/garantias/prefill?...` para precargar cliente, domicilio y trabajos.
     - Mostrar `resumenPagos` (total / entregado / saldo) como información.
     - Si es suelto, mostrar el campo opcional `referenciaPresupuesto`.
   - **Tipo de garantía** (select desde `GET /api/tipos-garantia`): al elegirlo se copian
     `trabajosGarantizados`, `aniosPorDefecto → aniosGarantia`, `alcance` y
     `exclusiones` a campos editables del form.
   - **Datos**: cliente, DNI/CUIT, teléfono, domicilio de obra, localidad,
     superficie en m², trabajos realizados, materiales/sistema, fechas de inicio y de
     finalización, vigencia desde (por defecto la fecha de finalización), lugar y
     fecha de emisión, observaciones.
   - **Firmas**:
     - checkbox "Incluir firma de la empresa", deshabilitado si no hay firma cargada;
     - firma del cliente opcional: subir imagen o dibujar en un `<canvas>`.
   - Atajo: aceptar `?presupuestoId=` / `?cuentaReciboId=` en la URL para entrar
     desde el detalle del presupuesto o de la cuenta.
4. **`/admin/garantias/[id]`**: documento A4 con botones Imprimir, Editar y Eliminar
   (con confirmación). La edición reutiliza el form con `PUT`.
5. **`/admin/garantias/tipos`**:
   - CRUD del catálogo: nombre, trabajos garantizados, años por defecto, alcance (con
     ayuda de placeholders) y exclusiones como lista editable.
   - Sección "Firma de la empresa": subir o dibujar, previsualizar y borrar.
6. **Detalle de presupuesto** (`app/admin/[id]/page.tsx`) y **detalle de cuenta**
   (`app/admin/recibos/cuentas/[cuentaId]/page.tsx`):
   - sección "Garantías" con `getGarantiasByPresupuesto` / `getGarantiasByCuenta` y
     un botón "Emitir certificado";
   - en la confirmación de borrar el presupuesto o la cuenta, avisar que también se
     borran sus certificados.

## Documento A4 (impresión)

Tomar como base `components/admin/PresupuestoPrint.tsx`: `@page { size: A4 portrait }`,
estilos inline, cabecera navy con logo y pie. El orden sigue el modelo del cliente:

1. Título **CERTIFICADO DE GARANTÍA** y N.º `formatNumeroDoc(numero)`.
2. `intro`.
3. Datos:
   - Presupuesto N.º (`numeroPresupuestoTexto`, se omite si es `null`);
   - Cliente (más DNI/CUIT y teléfono si existen);
   - Domicilio de la obra (más localidad);
   - Superficie aproximada intervenida en m² (si existe);
   - Trabajos realizados y Materiales/sistema (si existe).
4. Fecha de finalización, y "Vigencia de la garantía: {aniosEnTexto}, desde
   DD/MM/AAAA hasta DD/MM/AAAA".
5. **ALCANCE DE LA GARANTÍA**: párrafos de `alcance[]`.
6. **EXCLUSIONES DE LA GARANTÍA**: `exclusionesIntro`, la lista `exclusiones[]` y
   después `limitacion`.
7. **CONSTANCIA**: `constancia`. Observaciones, si hay.
8. "Lugar y fecha: {lugarEmision}, {DD/MM/AAAA}".
9. **Firmas** en dos columnas, **CUYO SMART S.A.S.** y **CLIENTE**:
   - un espacio de alto fijo (unos 25 mm) que muestra la imagen de la firma si existe
     (empresa: `incluirFirmaEmpresa && firmaEmpresa`; cliente:
     `firmaClienteDataUrl`);
   - debajo, **siempre** la línea con "Firma y aclaración" para firmar a mano.
   - Usar `break-inside: avoid` para que el bloque de firmas no se corte entre páginas.

La firma de la empresa se obtiene con `getFirmaEmpresa()` en el Server Component, o
con `GET /api/garantias/firma-empresa` (responde 404 si no hay).

## Firma: captura en el cliente

- Al subir una imagen o dibujar en el canvas, exportar a PNG
  (`canvas.toDataURL('image/png')`). Si supera `FIRMA_MAX_BYTES`, reescalar a un
  ancho máximo de unos 600 px o pasar a `image/jpeg` con calidad 0,8 antes de enviar.
- Fondo transparente o blanco, recortando los márgenes vacíos si es posible.
- Sin dependencias nuevas (Principio V): canvas nativo con pointer events.

# Feature Specification: Mejora de Diseño de Comprobantes y Exportación sin Bordes

**Feature Branch**: `002-mejorar-diseno-recibos`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Mejorar el sistema de comprobantes (recibos), principalmente su diseño visual, y corregir la exportación de imagen para que no produzca bordes que no deberían aparecer (actualmente la exportación sigue generando bordes indeseados)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exportar un recibo como imagen limpia, sin bordes indeseados (Priority: P1)

El dueño de CuyoSmart abre un recibo ya guardado (sea de un presupuesto o de
una cuenta de recibos independiente), presiona "Exportar imagen" y obtiene un
archivo listo para enviar al cliente por WhatsApp o email. La imagen contiene
únicamente el comprobante: no aparecen líneas, marcos, franjas grises ni
recortes de bordes que no formen parte del diseño del recibo.

**Why this priority**: Es el defecto explícitamente reportado por el dueño. Hoy
la exportación funciona pero produce bordes indeseados, por lo que cada
comprobante enviado a un cliente se ve defectuoso; es el impacto más directo
sobre la imagen profesional de la empresa y no depende de ningún rediseño.

**Independent Test**: Puede probarse por completo tomando un recibo existente,
exportándolo como imagen e inspeccionando el archivo resultante: las cuatro
orillas de la imagen deben corresponder exactamente al borde del diseño del
recibo, sin franjas ni líneas ajenas. No requiere cambios de diseño ni de
datos.

**Acceptance Scenarios**:

1. **Given** un recibo guardado con datos completos, **When** el dueño exporta
   la imagen, **Then** el archivo descargado no presenta ninguna línea, marco
   ni franja de color en sus bordes que no pertenezca al diseño del recibo.
2. **Given** un recibo guardado, **When** el dueño exporta la imagen, **Then**
   el archivo tiene exactamente las proporciones del documento oficial y no
   aparece contenido recortado ni espacio vacío sobrante en ningún lado.
3. **Given** el mismo recibo, **When** el dueño exporta la imagen dos veces
   seguidas (o desde distintos niveles de zoom del navegador), **Then** ambos
   archivos son visualmente equivalentes y ninguno presenta bordes indeseados.
4. **Given** un recibo cuyo pie de página usa fondo de color, **When** el dueño
   exporta la imagen, **Then** esa franja de color llega exactamente hasta el
   borde del documento, sin dejar una línea blanca o gris entre la franja y el
   borde de la imagen.

---

### User Story 2 - Comprobante con diseño renovado, idéntico en pantalla, impresión e imagen (Priority: P2)

El dueño necesita que el comprobante en sí se vea más profesional y prolijo
(jerarquía tipográfica clara, uso consistente de la paleta corporativa,
espaciado equilibrado, campos fáciles de leer) y que ese mismo diseño se vea
igual en las tres salidas: en pantalla, al imprimir/guardar como PDF y en la
imagen exportada.

**Why this priority**: Es el pedido principal ("mejorar principalmente su
diseño visual") y es lo que el cliente final ve. Se prioriza después del
defecto de bordes porque un diseño mejor con bordes defectuosos seguiría
siendo inutilizable.

**Independent Test**: Puede probarse abriendo un recibo existente y comparando
las tres salidas (pantalla, vista previa de impresión, imagen exportada) del
mismo recibo: las tres deben mostrar el mismo layout, mismos textos, mismos
colores y mismas posiciones de cada campo.

**Acceptance Scenarios**:

1. **Given** un recibo guardado, **When** el dueño lo visualiza en pantalla, lo
   imprime y lo exporta como imagen, **Then** las tres salidas muestran el
   mismo diseño (encabezado con logo y datos de contacto, caja de número y
   fecha, título, campos del cuerpo, observaciones, firma y pie) sin
   diferencias de posición, tamaño ni color perceptibles.
2. **Given** un recibo con concepto y observaciones extensos, **When** se
   visualiza en cualquiera de las tres salidas, **Then** el texto se ajusta en
   varias líneas sin desbordar el documento, sin solaparse con otros campos y
   sin cortar información.
3. **Given** un recibo sin observaciones, **When** se visualiza en cualquiera de
   las tres salidas, **Then** el bloque de observaciones no deja un hueco
   visual roto ni descoloca la firma ni el pie del documento.
4. **Given** un recibo con un monto de muchos dígitos, **When** se visualiza el
   documento, **Then** el monto en números y su versión en letras se muestran
   completos y legibles dentro de su área, sin recortes.

---

### User Story 3 - Panel de comprobantes con presentación visual consistente (Priority: P3)

El dueño administra los comprobantes desde el panel: el listado general de
recibos, las cuentas de recibos, el detalle de un presupuesto con sus recibos y
los formularios de carga. Necesita que todas esas pantallas compartan la misma
identidad visual del panel (tipografías, paleta corporativa, tarjetas, botones,
estados) y que la información clave (total, entregado, saldo pendiente, datos
de cada recibo) se lea de un vistazo.

**Why this priority**: Mejora el trabajo diario del dueño y la coherencia del
producto, pero no afecta lo que recibe el cliente final; puede entregarse
después de las dos anteriores sin bloquearlas.

**Independent Test**: Puede probarse recorriendo las pantallas de comprobantes
del panel y verificando que usan la paleta y tipografía corporativas, que los
botones y estados son consistentes entre pantallas, y que los totales
(total / entregado / saldo pendiente) están visibles y correctamente
destacados. No requiere exportar ni imprimir nada.

**Acceptance Scenarios**:

1. **Given** el dueño autenticado en el panel, **When** navega entre el listado
   de recibos, una cuenta de recibos y el detalle de un presupuesto con
   recibos, **Then** las tres pantallas presentan una identidad visual
   consistente (mismos estilos de tarjeta, botón, tipografía y colores de la
   marca).
2. **Given** una cuenta de recibos o un presupuesto con varios recibos, **When**
   el dueño abre su vista, **Then** ve destacados el total, el total entregado y
   el saldo pendiente, con distinción visual clara cuando el saldo es cero o
   hay sobrepago.
3. **Given** los formularios de carga de recibos, **When** el dueño los completa
   con un dato inválido, **Then** el mensaje de error se muestra con el estilo
   de error del panel, visible y asociado al campo correspondiente.
4. **Given** una cuenta o presupuesto sin recibos cargados, **When** el dueño
   abre su vista, **Then** ve un estado vacío explícito con la acción para crear
   el primer recibo, en vez de un área en blanco.

---

### Edge Cases

- ¿Qué pasa si la fuente corporativa no terminó de cargarse cuando el dueño
  presiona "Exportar imagen"? La exportación MUST esperar a que las fuentes e
  imágenes del documento estén disponibles antes de generar el archivo, para que
  el resultado no cambie de tipografía ni de layout respecto a la vista en
  pantalla.
- ¿Qué pasa si el navegador está con zoom distinto de 100% o en una pantalla de
  alta densidad? La imagen exportada MUST mantener las mismas dimensiones y el
  mismo resultado visual, sin bordes ni recortes adicionales.
- ¿Qué pasa si el logo corporativo no puede cargarse al exportar? El documento
  MUST exportarse igualmente con el resto del diseño intacto, sin dejar un
  marco, caja ni ícono de imagen roto en su lugar.
- ¿Qué pasa en pantallas angostas (móvil/tablet) al ver un recibo? El documento
  MUST poder verse completo (con desplazamiento o escalado) sin romper el layout
  de la página del panel.
- ¿Qué pasa con los recibos ya existentes al cambiar el diseño? Todos los
  recibos previamente guardados MUST poder visualizarse, imprimirse y exportarse
  con el diseño nuevo, sin pérdida ni alteración de sus datos.
- ¿Qué pasa si un recibo pertenece a una cuenta de recibos y no a un presupuesto
  (o viceversa)? Ambos casos MUST producir el mismo documento oficial y la misma
  calidad de exportación.

## Requirements *(mandatory)*

### Functional Requirements

#### Corrección de la exportación de imagen

- **FR-001**: La imagen exportada de un recibo MUST contener únicamente el
  documento del comprobante: ningún borde, marco, línea fina ni franja de color
  que no forme parte del diseño del recibo puede aparecer en el archivo
  resultante.
- **FR-002**: La imagen exportada MUST tener las dimensiones y proporciones
  exactas del documento oficial, sin contenido recortado en ninguno de los
  cuatro lados y sin márgenes vacíos añadidos.
- **FR-003**: Los elementos del diseño que llegan al borde del documento (por
  ejemplo, el pie de página con fondo de color) MUST llegar hasta el límite
  exacto de la imagen exportada, sin franjas blancas ni grises intermedias.
- **FR-004**: La exportación de imagen MUST producir un resultado visualmente
  equivalente de forma repetible: distintas ejecuciones, niveles de zoom del
  navegador y densidades de pantalla no deben introducir bordes ni diferencias
  de recorte.
- **FR-005**: La exportación MUST completarse solo después de que las fuentes e
  imágenes del documento estén disponibles, de modo que el archivo generado
  reproduzca la misma tipografía y el mismo layout que la vista en pantalla.
- **FR-006**: La exportación de imagen MUST estar disponible tanto para recibos
  asociados a un presupuesto como para recibos de cuentas independientes, con
  idéntica calidad de resultado.
- **FR-007**: El sistema MUST informar al dueño cuando una exportación falla, en
  vez de terminar sin descarga y sin mensaje visible.
- **FR-008**: El archivo exportado MUST nombrarse de forma identificable a
  partir del número de recibo, para que el dueño pueda reconocerlo sin abrirlo.

#### Diseño del documento del comprobante

- **FR-009**: El documento del recibo MUST presentar todos los elementos
  oficiales ya definidos (logo e identidad de CuyoSmart SAS, CUIT, teléfono,
  correo, número de recibo, fecha, "Recibí de", concepto, monto en números,
  monto en letras, forma de pago, observaciones, firma y pie "¡Gracias por su
  confianza!") con jerarquía visual clara: los datos económicos y el número de
  recibo destacan sobre los datos secundarios.
- **FR-010**: El documento MUST usar exclusivamente la paleta y las tipografías
  corporativas del proyecto, sin colores ni familias tipográficas arbitrarias
  fuera de esa identidad.
- **FR-011**: El documento MUST renderizarse con el mismo diseño en las tres
  salidas —vista en pantalla, impresión/PDF e imagen exportada— sin divergencias
  de layout, tamaños ni colores perceptibles.
- **FR-012**: El documento MUST adaptar textos largos (concepto, observaciones,
  monto en letras, nombre del cliente) ajustándolos en múltiples líneas dentro
  de su área asignada, sin desbordar, solapar ni truncar información.
- **FR-013**: El documento MUST mantener su estructura y legibilidad cuando
  campos opcionales están vacíos (por ejemplo, observaciones sin contenido).
- **FR-014**: La salida de impresión MUST contener solo el documento del
  comprobante: los controles del panel (botones, enlaces de navegación,
  encabezados administrativos) no deben aparecer en la impresión ni en el PDF.

#### Presentación del panel de comprobantes

- **FR-015**: Las pantallas de comprobantes del panel (listado de recibos,
  cuentas de recibos, detalle de cuenta, detalle de presupuesto con recibos y
  formularios de carga) MUST compartir una presentación visual consistente entre
  sí y con el resto del panel administrativo.
- **FR-016**: Las vistas que agrupan recibos (cuenta de recibos y presupuesto)
  MUST mostrar de forma destacada el total, el total entregado y el saldo
  pendiente, con distinción visual explícita para saldo cancelado y para
  sobrepago.
- **FR-017**: Los listados de recibos MUST permitir identificar cada recibo de
  un vistazo por número, fecha, monto y forma de pago, y ofrecer sus acciones
  (ver, exportar, eliminar) de manera visualmente consistente.
- **FR-018**: Las vistas de comprobantes sin datos MUST mostrar un estado vacío
  explícito con la acción principal para crear el primer recibo.
- **FR-019**: Los errores de validación y las confirmaciones de acciones
  destructivas MUST presentarse con un estilo consistente y claramente visible
  en todas las pantallas de comprobantes.
- **FR-020**: Las pantallas de comprobantes MUST seguir siendo accesibles
  únicamente para la sesión administrativa autenticada, sin introducir ninguna
  vista ni ruta de exportación accesible sin autenticación.

#### No regresión

- **FR-021**: El rediseño y la corrección de exportación MUST preservar sin
  cambios el comportamiento funcional existente de los comprobantes: creación,
  numeración correlativa única, cálculo de entregado y saldo pendiente,
  eliminación con confirmación previa y borrado en cascada.
- **FR-022**: Los recibos ya guardados MUST seguir visualizándose, imprimiéndose
  y exportándose correctamente con el diseño nuevo, sin migración manual de
  datos ni pérdida de información.

### Key Entities *(include if feature involves data)*

Esta feature no introduce entidades nuevas ni cambia los datos guardados; opera
sobre las existentes:

- **Recibo**: comprobante de un pago recibido, con número correlativo, fecha,
  "Recibí de", concepto, monto, monto en letras, forma de pago y observaciones.
  Puede pertenecer a un presupuesto o a una cuenta de recibos independiente. Sus
  atributos permanecen sin cambios.
- **Cuenta de recibos**: agrupación de recibos de un cliente/concepto que no
  proviene de un presupuesto; expone total, entregado y saldo pendiente
  derivados de sus recibos.
- **Presupuesto (valores derivados)**: expone total entregado y saldo pendiente
  calculados a partir de sus recibos asociados. Sin cambios de atributos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En 10 de 10 recibos exportados como imagen (con datos cortos,
  largos, con y sin observaciones, con y sin cuenta asociada), ninguna imagen
  presenta bordes, marcos ni franjas ajenos al diseño: 0 defectos de borde sobre
  el total exportado.
- **SC-002**: Las cuatro orillas de cada imagen exportada corresponden
  exactamente al borde del documento: 0 píxeles de contenido recortado y 0
  píxeles de margen sobrante respecto al diseño previsto.
- **SC-003**: Para un mismo recibo, la comparación de las tres salidas
  (pantalla, impresión/PDF, imagen) no revela diferencias de posición, tamaño ni
  color en ninguno de los campos oficiales del comprobante.
- **SC-004**: El dueño obtiene un comprobante listo para enviar al cliente en 2
  acciones o menos desde la vista del recibo, sin retoques posteriores en
  ninguna herramienta externa.
- **SC-005**: La exportación de una imagen de recibo se completa en menos de 3
  segundos en el equipo habitual del dueño.
- **SC-006**: 100% de los recibos creados antes de este cambio se visualizan,
  imprimen y exportan correctamente con el diseño nuevo, sin pérdida de datos.
- **SC-007**: En un recorrido por las 5 pantallas de comprobantes del panel, no
  se detectan colores ni tipografías fuera de la identidad corporativa definida
  para el proyecto.
- **SC-008**: En las vistas de cuenta y de presupuesto, el dueño identifica
  total, entregado y saldo pendiente sin desplazarse por la página ni abrir otra
  vista.

## Assumptions

- **Dirección visual sin especificar**: el pedido no define colores, fuentes ni
  maquetación concretos. Se asume que la mejora visual se realiza dentro de la
  identidad corporativa ya establecida del proyecto (paleta y tipografías
  definidas en los tokens de diseño existentes, modo claro únicamente), con
  criterios de presentación limpia y profesional: jerarquía tipográfica clara,
  espaciado equilibrado y consistencia entre pantallas. No se introduce una
  nueva identidad de marca ni se requiere aprobación previa de un diseño
  detallado.
- **Alcance del "sistema de comprobantes"**: se asume que abarca el documento
  del recibo y las pantallas administrativas de recibos ya existentes (listado
  general, cuentas de recibos, recibos dentro del detalle de presupuesto y
  formularios de carga), no otros documentos del panel como el presupuesto, cuyo
  diseño queda fuera de alcance salvo lo mínimo necesario para mantener
  consistencia visual.
- **Estructura del comprobante**: se asume que el conjunto de campos oficiales
  del recibo (definido en la feature 001) se mantiene; la mejora es de
  presentación, no de contenido. No se agregan ni quitan campos.
- **Formato de exportación**: se asume que la imagen se sigue entregando como un
  único archivo de imagen rasterizada descargado por el navegador, y el PDF se
  sigue obteniendo mediante el flujo de impresión nativo, sin generación en
  servidor.
- **Sin cambios de datos ni de contratos**: se asume que no se requieren cambios
  en el modelo de datos persistido ni en los contratos de las rutas de recibos;
  esta feature es de presentación y corrección de exportación.
- **Un solo usuario**: se asume que la única audiencia del panel es el dueño
  autenticado; no se contempla una vista pública del recibo para el cliente
  final.
- **Origen del defecto**: se asume que los bordes indeseados provienen del
  proceso de captura/rasterizado del documento y de su contenedor de
  exportación, no de un requisito de diseño; por lo tanto la corrección no debe
  alterar el contenido del comprobante.
- **Verificación**: se asume que la validación de "sin bordes" se realiza por
  inspección del archivo exportado (incluyendo revisión ampliada de las cuatro
  orillas), sin requerir herramientas nuevas de testing visual automatizado.

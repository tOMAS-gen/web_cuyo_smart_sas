# Feature Specification: Sistema de Recibos de Pago

**Feature Branch**: `001-sistema-recibos`

**Created**: 2026-07-28

**Status**: Draft

**Input**: User description: "necesito crear un sistema de recibos el cual esta en el sector de presupuesto, tiene que permitieme exportalo, yo te paso el diseno de guia del recibo y llevar la cuanta del total de la cuanta y cuanto se debe cuanto se a entregado y poder eliminarlo por eeror tambien, tambienm exportalos como imagen o pdf. Diseño de referencia: recibo con logo CuyoSmart SAS, CUIT, teléfono, correo, N° de recibo correlativo, fecha, campos 'Recibí de', 'Concepto', 'La suma de $', 'Son (en letras)', 'Forma de pago' (Efectivo/Transferencia/Otro), 'Observaciones', firma y pie 'Gracias por su confianza'."

## Clarifications

### Session 2026-07-28

- Q: ¿Dónde debe vivir el sistema de recibos dentro de la navegación del panel admin? → A: Dentro del detalle del presupuesto (`/admin/[id]`), junto al resumen de entregado/saldo pendiente.
- Q: ¿La numeración correlativa del recibo es un contador único compartido por todos los recibos, o independiente por presupuesto? → A: Contador global único, compartido por todos los recibos del sistema (igual que ya funciona el número de presupuesto).
- Q: ¿Se puede crear un recibo para un presupuesto en cualquier estado, o solo cuando está aceptado? → A: Cualquier estado del presupuesto habilita la creación de recibos (sin restricción por estado).
- Q: ¿Un recibo ya creado se puede editar, o solo eliminar y volver a cargar uno nuevo? → A: Solo eliminar y recrear; no existe edición de recibos existentes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar un pago recibido y ver el saldo actualizado (Priority: P1)

El dueño de CuyoSmart, desde el panel administrativo, abre un presupuesto ya
aceptado por un cliente y registra un nuevo recibo cada vez que recibe un pago
(total o parcial) por ese trabajo. El sistema calcula y muestra de inmediato
cuánto se entregó en total y cuánto queda por cobrar (saldo pendiente).

**Why this priority**: Es el núcleo del pedido: llevar la cuenta de cuánto se
debe y cuánto se entregó. Sin esto no existe "sistema de recibos", solo un
generador de documentos sueltos.

**Independent Test**: Puede probarse por completo creando dos recibos
parciales sobre un mismo presupuesto y verificando que el total entregado y el
saldo pendiente mostrados sean matemáticamente correctos, sin necesidad de
exportar ni eliminar nada.

**Acceptance Scenarios**:

1. **Given** un presupuesto aceptado con total $100.000 y sin recibos previos,
   **When** el dueño registra un recibo por $40.000, **Then** el sistema
   muestra "Entregado: $40.000" y "Saldo pendiente: $60.000".
2. **Given** un presupuesto con $40.000 ya entregados, **When** el dueño
   registra un segundo recibo por $60.000, **Then** el sistema muestra
   "Entregado: $100.000" y "Saldo pendiente: $0".
3. **Given** un presupuesto con saldo pendiente $0, **When** el dueño intenta
   registrar un nuevo recibo, **Then** el sistema permite guardarlo pero
   muestra una advertencia de que el monto supera el saldo pendiente.

---

### User Story 2 - Exportar un recibo como imagen o PDF con el diseño oficial (Priority: P2)

El dueño necesita entregarle al cliente un comprobante formal del pago
recibido, ya sea por WhatsApp/email (imagen) o para imprimir/archivar (PDF).
El recibo exportado debe verse igual a la plantilla oficial de CuyoSmart
(logo, datos de contacto, número de recibo, campos completos, firma y pie de
página).

**Why this priority**: Es un requisito explícito del pedido ("exportarlo...
como imagen o pdf") y es lo que le da valor externo al recibo frente al
cliente, pero depende de que el recibo ya exista (US1).

**Independent Test**: Puede probarse tomando un recibo ya creado y
exportándolo en cada formato, comparando visualmente el resultado contra la
plantilla de referencia (`modelo-de-resivo.jpeg`) sin depender de crear o
borrar otros recibos.

**Acceptance Scenarios**:

1. **Given** un recibo ya guardado, **When** el dueño elige "Exportar como
   imagen", **Then** se descarga un archivo de imagen con el diseño oficial
   completo y los datos del recibo correctamente ubicados.
2. **Given** un recibo ya guardado, **When** el dueño elige "Exportar /
   Imprimir PDF", **Then** se abre el flujo de impresión del navegador
   mostrando el recibo con el mismo diseño oficial, listo para guardarse como
   PDF.

---

### User Story 3 - Eliminar un recibo cargado por error (Priority: P3)

El dueño se equivocó al cargar un recibo (monto incorrecto, presupuesto
equivocado, duplicado) y necesita eliminarlo para que no distorsione el
cálculo de lo entregado y el saldo pendiente.

**Why this priority**: Es una acción correctiva explícitamente pedida
("poder eliminarlo por error"), necesaria para la integridad de los datos,
pero de menor frecuencia de uso que crear o exportar recibos.

**Independent Test**: Puede probarse creando un recibo, eliminándolo y
verificando que desaparece de la lista y que el total entregado/saldo
pendiente del presupuesto vuelven a su valor previo, sin depender de
exportación.

**Acceptance Scenarios**:

1. **Given** un recibo existente, **When** el dueño elige eliminarlo,
   **Then** el sistema pide una confirmación explícita antes de borrar.
2. **Given** que el dueño confirmó la eliminación, **When** se completa la
   acción, **Then** el recibo desaparece de la lista y el total entregado /
   saldo pendiente del presupuesto se recalculan de inmediato.

---

### Edge Cases

- ¿Qué pasa si se intenta crear un recibo con monto cero o negativo? El
  sistema MUST rechazar el guardado y mostrar un error de validación.
- ¿Qué pasa si se elimina un presupuesto que ya tiene recibos asociados? El
  sistema MUST eliminar en cascada todos los recibos de ese presupuesto junto
  con él, para no dejar recibos huérfanos.
- ¿Qué pasa si el "concepto" u "observaciones" del recibo son muy largos? El
  diseño exportado (imagen/PDF) MUST ajustar el texto (wrap) sin romper el
  layout ni cortar información.
- ¿Qué pasa si se registra un recibo cuyo monto sumado a los anteriores
  supera el total del presupuesto? El sistema MUST permitir guardarlo pero
  MUST advertir visualmente del sobrepago (ver US1, escenario 3).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir al dueño (sesión admin autenticada)
  crear un nuevo recibo asociado a un presupuesto existente, desde la vista
  de detalle de ese presupuesto (`/admin/[id]`), capturando: fecha, "Recibí
  de" (cliente), concepto, monto ("La suma de $"), forma de pago (Efectivo /
  Transferencia / Otro con detalle libre) y observaciones opcionales. La
  creación de recibos MUST estar disponible sin importar el estado del
  presupuesto (borrador, enviado, aceptado o rechazado).
- **FR-002**: El sistema MUST asignar automáticamente un número de recibo
  correlativo y único, tomado de un contador global compartido por todos los
  recibos del sistema (independiente del número de presupuesto), mostrado
  con formato de 4 dígitos (p. ej. "0036"), igual al de la plantilla
  oficial.
- **FR-003**: El sistema MUST generar automáticamente el texto "Son (en
  letras)" a partir del monto numérico, en español, permitiendo que el dueño
  lo edite antes de guardar.
- **FR-004**: El sistema MUST calcular y mostrar, para cada presupuesto: el
  total del presupuesto, el total entregado (suma de los montos de todos sus
  recibos) y el saldo pendiente (total − entregado).
- **FR-005**: El sistema MUST permitir al dueño ver el listado de recibos de
  un presupuesto, ordenado por fecha/número, junto con el resumen de
  entregado y saldo pendiente.
- **FR-006**: El sistema MUST permitir al dueño eliminar un recibo,
  exigiendo una confirmación explícita previa, y MUST recalcular
  inmediatamente el total entregado y el saldo pendiente del presupuesto
  afectado tras la eliminación. Los recibos NO son editables una vez
  creados: la única corrección posible ante un error de carga es eliminar el
  recibo y crear uno nuevo con los datos correctos.
- **FR-007**: El sistema MUST permitir exportar cualquier recibo como
  archivo de imagen, reproduciendo fielmente el diseño oficial de CuyoSmart
  (logo, datos de contacto, número de recibo, campos, forma de pago, firma y
  pie de página) según la plantilla de referencia.
- **FR-008**: El sistema MUST permitir exportar/imprimir cualquier recibo en
  formato listo para PDF, con el mismo diseño oficial que la exportación en
  imagen.
- **FR-009**: El sistema MUST restringir la creación, visualización,
  exportación y eliminación de recibos exclusivamente a sesiones admin
  autenticadas, reutilizando el mecanismo de autenticación ya existente del
  panel.
- **FR-010**: El sistema MUST persistir los recibos de forma durable, de
  modo que el total entregado y el saldo pendiente se mantengan correctos
  entre sesiones y recargas de página.
- **FR-011**: El sistema MUST validar que el monto de un recibo sea un
  número positivo mayor que cero antes de guardarlo.
- **FR-012**: El sistema MUST advertir visualmente al dueño (sin bloquear el
  guardado) cuando el total entregado de un presupuesto supere su monto
  total tras registrar un recibo.
- **FR-013**: El sistema MUST eliminar en cascada los recibos asociados
  cuando se elimina el presupuesto al que pertenecen.

### Key Entities *(include if feature involves data)*

- **Recibo**: comprobante de un pago recibido por un cliente, vinculado a un
  presupuesto. Atributos: número correlativo, fecha, presupuesto asociado,
  "Recibí de" (cliente), concepto, monto, monto en letras, forma de pago,
  observaciones y fecha de creación.
- **Presupuesto (extendido)**: además de sus datos actuales, expone dos
  valores derivados de sus recibos: total entregado (suma de montos de
  recibos asociados) y saldo pendiente (total del presupuesto menos total
  entregado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El dueño puede registrar un nuevo recibo de pago desde la
  vista de un presupuesto en menos de 1 minuto.
- **SC-002**: El total entregado y el saldo pendiente de un presupuesto se
  actualizan correctamente e inmediatamente después de crear o eliminar
  cualquier recibo, en el 100% de los casos probados.
- **SC-003**: El recibo exportado como imagen o PDF reproduce el diseño
  oficial (logo, datos de contacto, numeración, campos) sin requerir edición
  manual posterior para ser entregado al cliente.
- **SC-004**: El dueño puede eliminar un recibo cargado por error en menos
  de 3 acciones (clics/taps), incluyendo la confirmación previa que evita
  borrados accidentales.
- **SC-005**: El 100% de los recibos generados mantienen numeración
  correlativa única, sin duplicados.

## Assumptions

- Todo recibo está siempre asociado a un presupuesto existente; no se
  contempla la creación de recibos independientes sin presupuesto, en línea
  con "está en el sector de presupuesto".
- La numeración de recibos es un contador correlativo global único
  (independiente del número de presupuesto), con formato de 4 dígitos como
  en la plantilla de referencia.
- Las opciones de "Forma de pago" del recibo son exactamente Efectivo,
  Transferencia y Otro (con detalle libre), tal como muestra el diseño de
  referencia — un conjunto distinto de las opciones de forma de pago que ya
  existen para el presupuesto.
- La exportación a PDF se resuelve mediante el flujo de impresión nativo del
  navegador (igual que el presupuesto ya lo hace hoy), no mediante generación
  de PDF en el servidor.
- Solo el dueño autenticado accede a esta funcionalidad; no existe vista de
  recibos para el cliente final en el alcance de esta feature.
- Eliminar un presupuesto elimina en cascada sus recibos asociados.

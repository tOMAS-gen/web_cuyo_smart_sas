# Spec: Certificados de Garantía

**Feature**: `003-certificados-garantia` | **Date**: 2026-10-09

## Objetivo

Emitir **certificados de garantía** por obra, en hoja A4, para imprimir (PDF vía
`window.print()`) y firmar en papel, con opción de firma digital.

## Requisitos

- **FR-001** — Un certificado se puede crear de tres formas:
  - desde un **presupuesto** (cliente registrado, con recibos de entrega);
  - desde una **cuenta de recibos**;
  - **suelto, de cero**.
- **FR-002** — Hay un catálogo de **tipos de garantía** (uno por servicio), editable
  desde el admin. Cada tipo trae:
  - los trabajos garantizados;
  - los años por defecto;
  - el texto de alcance;
  - la lista de exclusiones.

  El catálogo arranca con 4 tipos sembrados a partir de los servicios de la web:
  Impermeabilización (10 años), Aislación térmica (5), Techos/zinguería (5) y
  Obras civiles (1). Los años y textos de los 3 últimos son orientativos y se ajustan
  desde el admin.
- **FR-003** — Al emitir, el contenido del tipo se **copia** al certificado (snapshot)
  y se puede editar por certificado. El dato que más cambia es el plazo en años.
  Editar o borrar un tipo **no** altera los certificados ya emitidos.
- **FR-004** — El certificado es **editable** después de creado. Conserva su número
  correlativo propio, independiente de presupuestos y recibos.
- **FR-005** — La vigencia "hasta" se calcula en el servidor: `vigenciaDesde + N años`.
  Si `vigenciaDesde` cae el 29/02 y el año destino no es bisiesto, pasa al 28/02.
- **FR-006** — Firma digital opcional:
  - **Empresa**: una sola imagen global, que cada certificado incluye o no
    (`incluirFirmaEmpresa`).
  - **Cliente**: una imagen opcional por certificado.

  Haya o no imagen, el documento **siempre** muestra la línea "Firma y aclaración"
  para firmar a mano.
- **FR-007** — Al borrar un presupuesto o una cuenta se borran **en cascada** sus
  certificados, igual que los recibos.
- **FR-008** — Todo requiere sesión de admin (`proxy.ts`).

## Fuera de alcance (por ahora)

- Generación de PDF en el servidor (Principio V).
- Envío por mail.
- Firma electrónica con validez legal: la "firma digital" es una imagen incrustada.

## Archivos

- **Modelo de datos:** `data-model.md`.
- **API:** `contracts/garantias-api.md`.
- **Frontend (Codex):** `frontend-handoff.md`.

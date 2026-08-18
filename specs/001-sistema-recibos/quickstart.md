# Quickstart: Sistema de Recibos de Pago

**Feature**: `001-sistema-recibos` | **Date**: 2026-07-28

## Prerrequisitos

- Repositorio con la feature implementada (rama `001-sistema-recibos` o
  posterior al merge).
- `.env.local` configurado con `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
  `SESSION_SECRET` (mismas variables que ya usa el login admin existente).
- Al menos un presupuesto ya creado en `data/presupuestos.json` (crear uno vía
  `/admin/nuevo` si no existe).

## Setup

```bash
npm install
cp .env.example .env.local   # si no existe aún
npm run dev
```

Abrir [http://localhost:3000/admin/login](http://localhost:3000/admin/login) e
iniciar sesión con las credenciales de `.env.local`.

## Escenario de validación 1 — Registrar pagos y ver saldo (US1)

1. Ir a `/admin` y abrir un presupuesto existente con total, por ejemplo,
   `$100.000`.
2. En la vista de detalle (`/admin/[id]`), localizar la sección de recibos y
   hacer clic en "Nuevo recibo".
3. Completar: Recibí de, Concepto, Monto `40000`, Forma de pago, confirmar
   "Son en letras" autogenerado, Guardar.
4. **Esperado**: la sección de resumen muestra "Entregado: $40.000" y "Saldo
   pendiente: $60.000".
5. Repetir el paso 2-3 con un segundo recibo de `$60000`.
6. **Esperado**: "Entregado: $100.000" y "Saldo pendiente: $0".
7. Intentar cargar un tercer recibo de `$1000` sobre el mismo presupuesto.
8. **Esperado**: el recibo se guarda pero aparece una advertencia visual de
   sobrepago (FR-012).

## Escenario de validación 2 — Exportar recibo (US2)

1. Sobre cualquier recibo ya creado en el paso anterior, hacer clic en
   "Exportar imagen".
2. **Esperado**: se descarga un `.png` con el diseño idéntico a
   `modelo-de-resivo.jpeg` (logo, CUIT, teléfono, correo, N° de recibo,
   fecha, campos completos, forma de pago marcada, firma, pie "¡Gracias por
   su confianza!").
3. Hacer clic en "Exportar / Imprimir PDF".
4. **Esperado**: se abre el diálogo de impresión del navegador mostrando el
   mismo diseño; al elegir "Guardar como PDF" se obtiene un PDF fiel al
   diseño oficial.

## Escenario de validación 3 — Eliminar un recibo por error (US3)

1. Sobre un recibo de prueba, hacer clic en "Eliminar".
2. **Esperado**: aparece un diálogo de confirmación explícito.
3. Confirmar la eliminación.
4. **Esperado**: el recibo desaparece de la lista; el resumen de "Entregado" /
   "Saldo pendiente" del presupuesto se recalcula inmediatamente reflejando la
   eliminación.

## Escenario de validación 4 — Cascada al eliminar presupuesto

1. Crear un presupuesto de prueba y agregarle 1-2 recibos.
2. Eliminar el presupuesto desde `/admin`.
3. Inspeccionar `data/recibos.json`.
4. **Esperado**: los recibos que tenían `presupuestoId` igual al presupuesto
   eliminado ya no están presentes en el archivo (FR-013).

## Validación técnica adicional

- `npm run lint` MUST pasar sin errores (constitución, Flujo de Trabajo y
  Calidad).
- Verificar que `/api/recibos` sin cookie de sesión responde `401` (Principio
  I de la constitución).

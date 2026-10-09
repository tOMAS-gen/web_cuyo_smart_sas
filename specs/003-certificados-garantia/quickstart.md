# Verificación: certificados de garantía

## Inicio

1. Configurar las credenciales de admin y `SESSION_SECRET` como en el resto del panel.
2. Ejecutar `npm run dev` e iniciar sesión en `/admin/login`.
3. Abrir **Garantías** en la navegación (`/admin/garantias`).

Para pruebas que creen o eliminen documentos, usar un `DATA_DIR` aislado. No usar
datos de producción. No se agregaron dependencias al proyecto.

## Flujos de aceptación

- **Tipos y firma:** crear, editar y eliminar una plantilla. Confirmar que un
  certificado ya emitido conserva sus condiciones incluso cuando se elimina su tipo.
- **Firma de empresa:** dibujar con mouse o dedo, elegir «Usar firma» y guardar;
  alternativamente subir un PNG/JPG/WEBP. Se normaliza la imagen, se recortan los
  márgenes blancos y se valida su tamaño con la lógica compartida. Cambiar o eliminar
  esta firma modifica su aparición en todos los certificados que la incluyen.
- **Desde presupuesto:** usar «Emitir certificado» en el detalle. Verificar cliente,
  domicilio, trabajos y resumen informativo de pagos. También se puede elegir el
  presupuesto desde el formulario nuevo.
- **Desde cuenta:** usar el mismo atajo en el detalle de cuenta. Se precargan cliente
  y concepto; completar el domicilio manualmente.
- **Suelto:** completar cliente y obra sin vínculo, con referencia libre opcional.
- **Cobertura:** elegir una plantilla y editar sus textos, exclusiones y plazo. El
  selector de tipo no es obligatorio si se completan las condiciones manualmente.
- **Fechas:** finalización precarga la vigencia desde. Una vigencia personalizada se
  conserva al modificar la finalización. Probar 29/02/2024 con un año: 28/02/2025.
- **Firmas del cliente:** subir o dibujar, aceptar y quitar. No se permite guardar
  mientras una imagen se procesa. Una imagen inválida muestra un error.
- **Edición:** cambiar el cliente de un certificado vinculado, guardar y volver a
  editar. La consulta de pagos no debe sobrescribir el cliente personalizado.
- **Actualizar opciones:** después de administrar tipos/firma en otra pestaña,
  actualizar las opciones desde el formulario sin perder sus datos.
- **Eliminar:** cancelar y luego confirmar. Los diálogos mantienen el foco de
  teclado y bloquean las acciones durante la petición. Presupuestos y cuentas
  advierten sobre la eliminación en cascada de sus certificados.

## Impresión y adaptación

- Abrir un certificado y usar **Imprimir / PDF**. Elegir «Guardar como PDF» con A4,
  escala 100 %, sin encabezados/pies del navegador.
- Verificar que no aparezcan navegación, acciones ni pie del administrador.
- La plantilla habitual cabe en A4; los textos extensos continúan en otras hojas
  sin ocultar contenido. El bloque de firmas se mantiene unido y siempre muestra
  ambas líneas de «Firma y aclaración», haya imágenes o no.
- Revisar listado, formulario y documento a 390 px y 320 px de ancho. No debe haber
  desbordamiento horizontal de la página.

## Errores y concurrencia

- Simular error 500 y sesión vencida (401) al guardar: mostrar mensaje y conservar
  el formulario para reintentar.
- Abrir un atajo con origen inexistente: mostrar error y permitir reintentar o
  cambiar a «Suelto».
- Cambiar de origen con una precarga pendiente: la respuesta anterior no debe
  reemplazar los datos del último origen elegido.
- El botón de firma de empresa permanece deshabilitado cuando no hay firma.

## Comprobaciones automáticas

```sh
npx tsc --noEmit
npm run lint
npm run verify:logic
npm run build
```

La implementación se verificó además con Chrome automatizado sobre un `DATA_DIR`
de prueba, cubriendo los tres orígenes, edición, CRUD de tipos, firmas, errores,
foco de confirmaciones, adaptación móvil y exportación A4. Los scripts y artefactos
locales de esa prueba se guardan en `.context/` y no forman parte de la aplicación.

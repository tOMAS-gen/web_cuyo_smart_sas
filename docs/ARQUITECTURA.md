# Arquitectura del Proyecto

## Vision General

CuyoSmart SAS es un sitio web corporativo de marketing construido con Next.js 16 (App Router). Funciona como plataforma de generacion de leads, dirigiendo visitantes a conversaciones de WhatsApp y formularios de contacto/presupuesto.

**No tiene backend, API routes, ni base de datos.** Todo el contenido esta definido como codigo en TypeScript.

## Decisiones de Arquitectura

### 1. Contenido como Codigo (Content-as-Code)

Todo el texto, metadata SEO, listados de proyectos y configuracion vive en un unico archivo TypeScript (`data/content.ts`). No se utiliza un CMS externo.

**Justificacion:** El contenido cambia con poca frecuencia, y mantenerlo en codigo permite tipado estricto, versionado con Git, y eliminacion de dependencias externas.

### 2. Output Standalone + Inyeccion de Variables en Runtime

Next.js se compila con `output: 'standalone'` para generar una imagen Docker minima. Las variables de entorno `NEXT_PUBLIC_*` se embeben como placeholders (`__NEXT_PUBLIC_*__`) durante el build. Al iniciar el contenedor, `scripts/entrypoint.sh` reemplaza los placeholders con los valores reales.

**Justificacion:** Permite cambiar datos de contacto, URLs y redes sociales sin reconstruir la imagen Docker.

### 3. SEO-First con URLs Semanticas

Las rutas usan slugs largos en espanol con keywords geograficas:

| Ruta                                             | Servicio              |
| :----------------------------------------------- | :-------------------- |
| `/reparacion-techos-impermeabilizacion-mendoza`  | Techos                |
| `/aislacion-termica-poliuretano-expandido`       | Aislacion termica     |
| `/obras-civiles-construccion-en-seco-mendoza`    | Obras civiles         |
| `/proyectos-obras-realizadas`                    | Portfolio             |
| `/contacto-presupuesto-obras`                    | Contacto              |

Se configuraron redirects 301 desde las URLs anteriores (mas cortas) a las actuales.

### 4. Sin API Routes

Todas las "acciones" son enlaces externos:
- WhatsApp: links `wa.me` con mensajes pre-cargados
- Telefono: links `tel:`
- Email: links `mailto:`
- El formulario de contacto actualmente es solo frontend (sin handler de envio)

## Mapa de Paginas

```
app/
├── layout.tsx                     # Layout raiz
│   ├── Schema.org LocalBusiness JSON-LD
│   ├── Google Fonts (Geist, Montserrat, Open Sans)
│   ├── Header (componente)
│   ├── Footer (componente)
│   └── WhatsAppFAB (componente)
│
├── page.tsx                       # Homepage (Server Component)
│   ├── Hero con CTA
│   ├── Servicios en layout zig-zag
│   ├── Diferenciales
│   ├── Proyectos destacados
│   └── Banner CTA de urgencia
│
├── reparacion-techos-*/page.tsx   # Servicio: Techos (Server Component)
├── aislacion-termica-*/page.tsx   # Servicio: Aislacion (Server Component)
├── obras-civiles-*/page.tsx       # Servicio: Obras (Server Component)
│
├── proyectos-*/page.tsx           # Portfolio (Client Component)
│   └── Filtro por categoria (27 proyectos)
│
├── contacto-*/page.tsx            # Contacto (Server Component)
│   ├── Tarjetas de contacto
│   ├── Formulario de presupuesto
│   ├── Google Maps embed
│   └── FAQ Accordion
│
├── sitemap.ts                     # Sitemap programatico (6 URLs)
└── robots.ts                      # Configuracion de crawlers
```

## Flujo de Datos

```
.env.local / Docker env vars
        │
        ▼
  data/content.ts          ← Fuente unica de verdad
  (siteConfig, homeData,     (lee variables de entorno
   techosData, etc.)          con fallbacks __PLACEHOLDER__)
        │
        ▼
  app/*/page.tsx           ← Importan datos y renderizan
  components/*.tsx         ← Componentes reutilizables
        │
        ▼
  types/content.ts         ← Interfaces TypeScript que tipizan
                              toda la capa de datos
```

## Sistema de Diseno

### Paleta de Colores

Definida en `app/globals.css` como variables CSS de Tailwind v4:

| Color      | Valor     | Uso                                   |
| :--------- | :-------- | :------------------------------------ |
| Primary    | `#0B1C3E` | Azul marino oscuro - textos, fondos   |
| Secondary  | `#FF9000` | Naranja - CTAs, acentos               |
| Tertiary   | `#29ABE2` | Celeste - enlaces, detalles           |
| Background | `#FFFFFF` | Fondo principal                       |
| Muted      | `#F4F6F8` | Fondo de secciones alternadas         |

### Tipografias

| Fuente      | Uso                    |
| :---------- | :--------------------- |
| Montserrat  | Titulos principales    |
| Open Sans   | Cuerpo de texto        |
| Geist       | UI general             |
| Geist Mono  | Codigo (si aplica)     |

### Patrones de UI

- **Hero full-screen** con imagen de fondo, gradiente overlay y CTA
- **Layout zig-zag** para servicios (imagen izquierda/derecha alternada)
- **Tarjetas** con animacion hover (lift + shadow)
- **CTAs** siempre vinculados a WhatsApp con mensajes pre-cargados
- **Banner de urgencia** oscuro al final de cada pagina
- **Responsive:** menu hamburguesa en mobile, columnas apiladas

### Animaciones

Definidas en `globals.css`:
- `fadeInUp`: entrada con desplazamiento vertical
- `bounce`: animacion del boton de WhatsApp

## Componentes

| Componente     | Archivo                     | Client? | Funcion                                    |
| :------------- | :-------------------------- | :------ | :----------------------------------------- |
| `Header`       | `components/Header.tsx`     | Si      | Navegacion fija, barra de contacto, menu mobile |
| `Footer`       | `components/Footer.tsx`     | No      | Footer 4 columnas (marca, links, cobertura, contacto) |
| `WhatsAppFAB`  | `components/WhatsAppFAB.tsx`| Si      | Boton flotante con animacion ping y tooltip |
| `FAQAccordion` | `components/FAQAccordion.tsx`| Si     | Acordeon para preguntas frecuentes         |

## Activos Estaticos

```
public/
├── brand/                # 7 archivos de marca (SVG + JPG)
│   ├── logo.svg
│   ├── name.svg
│   ├── logo_symmetrical.svg
│   ├── logo_name_completo.svg
│   ├── logo_name_completo_horizontal.svg
│   ├── logo_name_completo_fondo.svg
│   └── logo_name_completo_fondo_800x800.jpg
│
└── images/               # ~410 fotos organizadas por categoria
    ├── techos/           # 108 imagenes (01.jpeg ... N.jpeg)
    ├── impermeabilizacion/ # 128 imagenes
    ├── obras-civiles/    # 110 imagenes
    ├── aislacion/        # 60 imagenes
    └── home/             # 4 imagenes para el hero
```

Las imagenes se nombran con numeracion secuencial (`01.jpeg`, `02.jpeg`, etc.) y se clasifican con `scripts/classify-new-images.sh`.

## Dependencias

El proyecto tiene un set de dependencias minimo:

**Produccion:**
- `next` - Framework
- `react`, `react-dom` - UI
- `lucide-react` - Iconos
- `jose` - Firma/verificacion de JWT (panel admin)
- `nanoid` - Generacion de IDs para presupuestos y recibos
- `dom-to-image-more` - Exportacion de presupuestos/recibos a imagen

**Desarrollo:**
- `tailwindcss`, `@tailwindcss/postcss` - Estilos
- `typescript`, `@types/*` - Tipado
- `eslint`, `eslint-config-next` - Linting

## Panel Administrativo (`/admin`)

Ademas del sitio publico de marketing, el proyecto incluye un panel privado
(`/admin`) para que el dueno gestione presupuestos y recibos de pago. A
diferencia del resto del sitio, este modulo si tiene backend (API routes) y
persistencia de datos.

### Autenticacion

- Sesion basada en JWT firmado con `jose` (`lib/auth.ts`), almacenado en la
  cookie `cuyo_admin_session`.
- `proxy.ts` (middleware) protege `/admin/:path*`, `/api/presupuestos/:path*`
  y `/api/recibos/:path*`: sin sesion valida, redirige a `/admin/login` (o
  responde `401` en rutas `/api/`).
- Credenciales configuradas via variables de entorno server-only
  (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`).

### Persistencia

Sin base de datos externa: cada dominio de datos se persiste en su propio
archivo JSON bajo `data/`, con escritura atomica (`fs.writeFile` a un archivo
`.tmp` seguido de `fs.rename`) para evitar corrupcion ante escrituras
concurrentes o cortes de proceso.

| Store | Archivo | Modulo |
| :--- | :--- | :--- |
| Presupuestos | `data/presupuestos.json` | `lib/presupuestos-store.ts` |
| Recibos | `data/recibos.json` | `lib/recibos-store.ts` |

Ambos archivos estan en `.gitignore` (datos generados en runtime, no se
versionan).

### Modulo de Recibos

Cada presupuesto puede tener uno o mas recibos de pago asociados
(`Recibo.presupuestoId`). El detalle de un presupuesto (`/admin/[id]`)
muestra el resumen de **entregado** (suma de montos de sus recibos) y
**saldo pendiente** (total del presupuesto menos entregado), calculados en
tiempo de lectura (no se persisten como campos denormalizados).

- Los recibos usan una numeracion correlativa **global**, independiente del
  numero de presupuesto.
- No son editables una vez creados: la unica correccion posible ante un
  error de carga es eliminar el recibo y crear uno nuevo.
- Al eliminar un presupuesto, sus recibos se eliminan en cascada
  (`deletePresupuesto()` invoca `deleteRecibosByPresupuesto()`) para evitar
  registros huerfanos.
- Cada recibo tiene su propia vista de detalle/exportacion
  (`/admin/[id]/recibos/[reciboId]`), reproduciendo el diseno oficial de
  CuyoSmart (logo, CUIT, telefono, correo, campos del recibo, forma de pago,
  firma, onda decorativa de marca en cabecera/pie). Se exporta como imagen
  (`dom-to-image-more`) o como PDF (dialogo de impresion nativo del navegador
  via `window.print()` + CSS `@media print`, centrado en A4 horizontal sin
  ocupar toda la hoja — ver `PRINT_TARGET_WIDTH_MM` en `recibo-doc.ts`). El
  presupuesto (`/admin/[id]`, `components/admin/PresupuestoPrint.tsx`) sigue
  este mismo patron: un unico nodo, expuesto por `ref` desde
  `app/admin/[id]/PresupuestoDocumentPanel.tsx`, sirve para pantalla,
  impresion y exportacion — ya no existe un arbol de componentes duplicado
  para la exportacion (el antiguo `PresupuestoExportView.tsx` + host oculto
  por `getElementById` se eliminaron).

Ver `specs/001-sistema-recibos/` para el detalle completo de especificacion,
plan y decisiones de diseno de este modulo.

### Receta de Exportacion de Imagen del Comprobante

`components/admin/useReciboExport.ts` rasteriza el comprobante a PNG con
`dom-to-image-more` siguiendo una receta no negociable:

- `width`/`height` se pasan a `toBlob` ya en **pixeles finales**
  (ancho `RECIBO_DOC.width × EXPORT_SCALE` = 2004 px; alto CSS real del nodo,
  redondeado hacia arriba, por `EXPORT_SCALE`),
  mientras que el nodo en pantalla se agranda con CSS
  `style.transform: scale(EXPORT_SCALE)` + `transformOrigin: 'top left'`. Asi
  `dom-to-image-more` hace un blit 1:1 sin remuestreo.
- **Nunca** se pasa la opcion `scale` de `dom-to-image-more`: esa opcion fuerza
  un `ctx.scale(2,2)` sobre el `fillRect` blanco opaco del canvas interno, lo
  que deja una franja de cobertura parcial (semi-transparente) en el borde del
  documento exportado. Esa es la causa raiz del defecto de borde que la receta
  de arriba evita.
- `EXPORT_SCALE` es una constante literal (nunca se deriva de
  `devicePixelRatio` ni del zoom del navegador), y `bgcolor` es siempre
  identico a `RECIBO_DOC.background`.
- El documento tiene ancho fijo de 1002 px y alto minimo de 340 px. El concepto
  ocupa una fila completa y los campos permiten varias lineas; el alto crece
  con el contenido. El pie participa del flujo para evitar superposiciones.
- Antes de medir y rasterizar se espera la decodificacion de las imagenes y
  `await document.fonts.ready`: sin
  eso, el `foreignObject` interno de `dom-to-image-more` maqueta el texto con
  metricas de fuente de fallback y los saltos de linea de la imagen exportada
  no coinciden con lo que se ve en pantalla.
- La familia tipografica del comprobante se referencia via la variable CSS de
  `next/font` (`var(--font-montserrat)`), nunca con un nombre de fuente
  hardcodeado, para que la fuente autoalojada se resuelva igual en pantalla y
  en la exportacion.
- Se pasa siempre `filterStyles: filterExportBorderStyles` (definido en
  `components/admin/recibo-doc.ts`, reutilizado por el export de recibos y de
  presupuestos): Tailwind Preflight aplica `border: 0 solid` como reset global
  a *todo* elemento (incluye variantes fisicas y logicas: `border-top-style`,
  `border-block-style`, `border-inline-end`, etc.). `dom-to-image-more`
  compara cada propiedad computada contra un iframe sandbox que no carga nuestro
  CSS, encuentra que el estilo de borde difiere del default del sandbox, y lo
  copia al clon de **cada** nodo — aunque el ancho sea `0px`. El rasterizado
  SVG→canvas pinta ese borde de ancho 0 pero estilo `solid` como una linea de
  1px visible alrededor de todos los elementos ("recuadro" fantasma en cada
  fila/campo del documento, con texto recortado como efecto secundario). El
  filtro suprime cualquier propiedad que transporte un `border-style` (longhand
  fisico/logico o shorthand) salvo que el elemento tenga un borde real (ancho
  > 0) en al menos un lado fisico — asi se preservan los bordes intencionales
  del diseno (caja de numero, bloque de importe, observaciones) sin heredar el
  reset global de Tailwind. Verificado con `toSvg()` inspeccionando el XML
  intermedio: la propiedad ofensora aparecia como
  `border-block-end: 0px solid rgb(11, 28, 62)`.

`components/admin/recibo-doc.ts` es la **fuente unica** de geometria
(`RECIBO_DOC`), paleta (`COLORS`) y tipografia (`FONT`) del comprobante.
Ningun literal de color de marca ni dimension del documento debe vivir fuera
de este modulo dentro de `components/admin/` ni `app/admin/`; el panel usa en
cambio las utilidades de token (`bg-primary`, `text-secondary`, etc.) que
consumen las variables `@theme` de `app/globals.css`.

`proxy.ts` protege ademas `/api/cuentas-recibos/:path*` bajo el mismo matcher
que `/api/presupuestos` y `/api/recibos`: sin sesion valida responde `401`.

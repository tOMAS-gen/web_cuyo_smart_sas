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

**Desarrollo:**
- `tailwindcss`, `@tailwindcss/postcss` - Estilos
- `typescript`, `@types/*` - Tipado
- `eslint`, `eslint-config-next` - Linting

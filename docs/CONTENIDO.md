# Gestion de Contenido y Datos

## Fuente Unica de Verdad

Todo el contenido del sitio vive en un unico archivo: `data/content.ts`. Este archivo exporta objetos tipados que las paginas importan directamente.

**No se utiliza un CMS externo.** Los cambios de contenido se realizan editando este archivo y desplegando una nueva version.

## Estructura de Datos

### `siteConfig`

Configuracion global del sitio. Lee las variables de entorno con fallbacks para el sistema de inyeccion Docker:

```typescript
export const siteConfig: SiteConfig = {
  name: "CuyoSmart SAS",
  url: process.env.NEXT_PUBLIC_SITE_URL || "__NEXT_PUBLIC_SITE_URL__",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "__NEXT_PUBLIC_PHONE_NUMBER__",
  // ...
}
```

### `homeData`

Contenido de la homepage:
- `meta`: titulo y descripcion SEO
- `hero`: titulo, subtitulo, CTA principal
- `services`: array de servicios con titulo, descripcion, imagen, link
- `differentials`: factores diferenciadores
- `featuredProjects`: proyectos destacados para la home
- `ctaBanner`: banner de urgencia final

### `techosData`

Pagina de reparacion de techos e impermeabilizacion:
- `meta`: SEO metadata
- `hero`: seccion hero
- `services`: sub-servicios (diagnostico, chapas, zingueria, membranas)
- `process`: pasos del proceso de trabajo
- `ctaBanner`: CTA final

### `insulationPageData`

Pagina de aislacion termica con poliuretano:
- Estructura similar a `techosData`
- Enfocado en aplicaciones industriales y residenciales

### `obrasData`

Pagina de obras civiles y construccion en seco:
- Steel framing, Durlock, albanileria tradicional
- Remodelaciones y mantenimiento

### `projectsPageData`

Pagina de portfolio de proyectos:
- `meta`: SEO metadata
- `projects`: array de 27 proyectos, cada uno con:
  - `title`: nombre del proyecto
  - `category`: categoria (techos, impermeabilizacion, obras-civiles, aislacion)
  - `description`: descripcion breve
  - `images`: array de rutas de imagenes
  - `location`: ubicacion
- `categories`: definicion de categorias para el filtro

### `contactPageData`

Pagina de contacto y presupuestos:
- `meta`: SEO metadata
- `contactCards`: tarjetas con telefono, email, direccion
- `formFields`: campos del formulario
- `faq`: preguntas frecuentes (array de `{ question, answer }`)

## Interfaces TypeScript

Todas las interfaces estan definidas en `types/content.ts`. Las principales son:

```typescript
interface SiteConfig {
  name: string
  url: string
  phone: string
  phoneDisplay: string
  email: string
  adminEmail: string
  address: string
  whatsapp: string
  // ...
}

interface MetaData {
  title: string
  description: string
  keywords?: string[]
}

interface HeroData {
  title: string
  subtitle: string
  cta: { text: string; href: string }
  backgroundImage: string
}

interface ServiceItem {
  title: string
  description: string
  icon?: string
  image?: string
  href?: string
}

interface ProjectItem {
  title: string
  category: string
  description: string
  images: string[]
  location: string
}
```

## Como Modificar Contenido

### Cambiar textos de una pagina

1. Abrir `data/content.ts`
2. Localizar el objeto correspondiente (ej. `homeData`, `techosData`)
3. Editar el texto deseado
4. Verificar que el build compile: `npm run build`
5. Desplegar

### Agregar un nuevo proyecto al portfolio

1. Agregar las imagenes a `public/images/{categoria}/`
2. En `data/content.ts`, agregar un nuevo objeto al array `projects` de `projectsPageData`:

```typescript
{
  title: "Nombre del proyecto",
  category: "techos",  // techos | impermeabilizacion | obras-civiles | aislacion
  description: "Descripcion breve del proyecto",
  images: [
    "/images/techos/nuevo-01.jpeg",
    "/images/techos/nuevo-02.jpeg",
  ],
  location: "Ciudad, Mendoza"
}
```

### Agregar una pregunta frecuente

En `data/content.ts`, agregar al array `faq` de `contactPageData`:

```typescript
{
  question: "La pregunta nueva?",
  answer: "La respuesta a la pregunta."
}
```

### Cambiar datos de contacto

**Opcion A: Sin rebuild (runtime)**
Editar las variables de entorno en `docker-compose.yml` y reiniciar el contenedor.

**Opcion B: En el codigo**
Editar los valores en `.env.local` (desarrollo) o los fallbacks en `data/content.ts`.

## Gestion de Imagenes

### Organizacion

Las imagenes de proyectos estan en `public/images/` organizadas por categoria:

```
public/images/
├── techos/              # 01.jpeg, 02.jpeg, ...
├── impermeabilizacion/  # 01.jpeg, 02.jpeg, ...
├── obras-civiles/       # 01.jpeg, 02.jpeg, ...
├── aislacion/           # 01.jpeg, 02.jpeg, ...
└── home/                # hero-1.jpeg, etc.
```

### Agregar imagenes nuevas

**Metodo manual:**
1. Nombrar el archivo con el siguiente numero secuencial de la categoria
2. Formato: JPEG (`.jpeg`)
3. Copiar a la carpeta correspondiente

**Metodo automatizado:**
1. Colocar las imagenes en una subcarpeta nueva dentro de `public/images/`
2. Ejecutar el script de clasificacion:

```bash
# Preview sin cambios
bash scripts/classify-new-images.sh --dry-run

# Ejecutar
bash scripts/classify-new-images.sh
```

El script clasifica automaticamente por palabras clave en el nombre del directorio.

### Optimizacion

Para convertir imagenes a WebP (requiere ImageMagick):

```bash
bash scripts/optimize-images.sh
```

### Logos y Marca

Los activos de marca estan en `public/brand/`:

| Archivo                              | Uso                              |
| :----------------------------------- | :------------------------------- |
| `logo.svg`                           | Icono/simbolo solo               |
| `name.svg`                           | Nombre solo                      |
| `logo_symmetrical.svg`               | Logo simetrico                   |
| `logo_name_completo.svg`             | Logo + nombre vertical           |
| `logo_name_completo_horizontal.svg`  | Logo + nombre horizontal         |
| `logo_name_completo_fondo.svg`       | Logo completo con fondo          |
| `logo_name_completo_fondo_800x800.jpg` | Version JPG 800x800           |

Los archivos fuente de Affinity Designer estan en `LOGOS_Smart_Cuyo_SAS/` en la raiz del repositorio.

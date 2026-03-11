# Guia de Desarrollo

## Requisitos

- **Node.js** 22+ (recomendado via `nvm`)
- **npm** (incluido con Node.js)
- **Docker** y **Docker Compose** (para desarrollo/produccion con contenedores)
- **ImageMagick** (opcional, para optimizacion de imagenes)

## Setup Inicial

```bash
# Clonar el repositorio
git clone https://github.com/tOMAS-gen/web_cuyo_smart_sas.git
cd web_cuyo_smart_sas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con valores reales o de prueba

# Iniciar desarrollo
npm run dev
```

## Convenciones de Codigo

### TypeScript

- **Tipado estricto** (`strict: true` en `tsconfig.json`). Evitar `any`.
- Usar inferencia de tipos siempre que sea posible.
- Interfaces en `types/content.ts` para la capa de datos.

### Importaciones

Usar el alias `@/*` para importaciones internas. Orden:

```typescript
// 1. Bibliotecas de terceros
import Image from 'next/image'
import { Phone } from 'lucide-react'

// 2. Importaciones internas (alias @/)
import { siteConfig, homeData } from '@/data/content'
import { Header } from '@/components/Header'

// 3. Tipos
import type { HeroData } from '@/types/content'
```

### Nomenclatura

| Elemento              | Convencion   | Ejemplo              |
| :-------------------- | :----------- | :------------------- |
| Componentes React     | PascalCase   | `Header.tsx`         |
| Funciones/variables   | camelCase    | `handleClick`        |
| Tipos/Interfaces      | PascalCase   | `SiteConfig`         |
| Archivos de pagina    | kebab-case   | `contacto-presupuesto-obras/` |
| Variables CSS         | kebab-case   | `--color-primary`    |

### Estilos

- **Tailwind CSS v4** con clases utilitarias directamente en JSX
- Variables CSS custom en `app/globals.css` para colores y tipografias del tema
- No usar archivos CSS por componente; todo va inline con Tailwind

### Componentes

- **Server Components** por defecto (sin `"use client"`)
- Agregar `"use client"` solo cuando se necesite:
  - Estado (`useState`, `useReducer`)
  - Efectos (`useEffect`)
  - Eventos del navegador (`onClick`, `onScroll`)
  - APIs del navegador (`window`, `document`)

### Comentarios

- Solo para logica no obvia o compleja (el "por que", no el "que")
- JSDoc para funciones y componentes complejos

## Estructura de una Pagina

Cada pagina de servicio sigue este patron:

```typescript
// app/nombre-servicio/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { servicioData } from '@/data/content'

export const metadata: Metadata = {
  title: servicioData.meta.title,
  description: servicioData.meta.description,
}

export default function NombreServicioPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen ...">
        ...
      </section>

      {/* Servicios / Contenido */}
      <section className="py-20 ...">
        ...
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-white ...">
        ...
      </section>
    </main>
  )
}
```

## Agregar una Nueva Pagina

1. Crear directorio en `app/` con slug SEO-friendly en espanol:
   ```
   app/nuevo-servicio-mendoza/page.tsx
   ```

2. Definir la interfaz de datos en `types/content.ts`

3. Agregar los datos en `data/content.ts`

4. Importar datos y renderizar en la pagina

5. Agregar el link en el `Header` y `Footer`

6. Agregar la URL en `app/sitemap.ts`

7. Si reemplaza una URL existente, agregar redirect en `next.config.ts`

## Agregar un Nuevo Componente

1. Crear en `components/NombreComponente.tsx`
2. Determinar si necesita ser Client Component
3. Tipar las props con una interfaz
4. Importar con `@/components/NombreComponente`

```typescript
// components/NuevoComponente.tsx
interface NuevoComponenteProps {
  titulo: string
  descripcion: string
}

export function NuevoComponente({ titulo, descripcion }: NuevoComponenteProps) {
  return (
    <div className="...">
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  )
}
```

## Agregar una Nueva Variable de Entorno

1. Agregar en `.env.example` con documentacion
2. Agregar en `.env.local` con valor de desarrollo
3. Leer en `data/content.ts` con fallback placeholder:
   ```typescript
   nuevoValor: process.env.NEXT_PUBLIC_NUEVO_VALOR || "__NEXT_PUBLIC_NUEVO_VALOR__"
   ```
4. Agregar `NEXT_PUBLIC_NUEVO_VALOR` a la lista `VARS` en `scripts/entrypoint.sh`
5. Agregar en `docker-compose.yml` y `docker-compose.dev.yml`
6. Actualizar la tabla en el README

## Verificacion

Antes de hacer deploy, verificar:

```bash
# Compilacion exitosa
npm run build

# Sin errores de linting
npm run lint
```

No hay tests unitarios configurados actualmente. El proyecto no define un script `test` en `package.json`.

## Imagenes Remotas

Si se necesitan imagenes de dominios externos, agregar el hostname en `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',  // ya configurado
    },
    {
      protocol: 'https',
      hostname: 'nuevo-dominio.com',    // agregar nuevos aqui
    },
  ],
},
```

## Troubleshooting

### El build falla con errores de tipo

Ejecutar `npm run lint` para identificar errores. Verificar que `types/content.ts` coincida con la estructura de `data/content.ts`.

### Las variables de entorno no se inyectan en Docker

1. Verificar que la variable esta en la lista `VARS` de `scripts/entrypoint.sh`
2. Verificar que el fallback en `data/content.ts` usa el formato `__NOMBRE_VARIABLE__`
3. Revisar los logs del contenedor: `docker logs cuyo_smart_sas`

### Las imagenes no cargan

1. Verificar que la ruta en `data/content.ts` coincide con el archivo en `public/images/`
2. Para imagenes remotas, verificar que el dominio esta en `next.config.ts`
3. Verificar el formato: el proyecto usa `.jpeg` para fotos de proyecto

### Hot reload no funciona en Docker dev

Verificar que los volumenes estan correctamente montados en `docker-compose.dev.yml`. Los directorios `node_modules` y `.next` se excluyen del mount para evitar conflictos.

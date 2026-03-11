# Despliegue y Operaciones

## Infraestructura

El sitio se despliega como contenedor Docker, alojado en GitHub Container Registry (GHCR) y gestionado con Portainer.

```
Codigo fuente
    │
    ▼ scripts/deploy.sh
Docker build (multi-stage)
    │
    ▼ docker push
GitHub Container Registry (GHCR)
  ghcr.io/tomas-gen/web_cuyo_smart_sas:latest
    │
    ▼ Portainer: Pull & Redeploy
Servidor de produccion
  puerto 3000
```

## Docker: Build Multi-Stage

El `Dockerfile` utiliza 3 etapas para minimizar el tamano de la imagen final:

### Etapa 1: Dependencias (`deps`)
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
```

### Etapa 2: Build (`builder`)
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
```

### Etapa 3: Produccion (`runner`)
```dockerfile
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
# Solo copia lo necesario del build standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY scripts/entrypoint.sh ./entrypoint.sh
USER nextjs
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
```

## Inyeccion de Variables en Runtime

El mecanismo clave que permite configurar el sitio sin reconstruir la imagen:

1. Durante el build, `data/content.ts` lee las variables `NEXT_PUBLIC_*` con fallbacks tipo `__NEXT_PUBLIC_SITE_URL__`
2. Estos placeholders quedan embebidos en los archivos JS/HTML compilados
3. Al iniciar el contenedor, `scripts/entrypoint.sh` recorre todos los `.js` y `.html` en `.next/` y reemplaza cada `__VARIABLE__` con el valor real del environment

### Variables soportadas

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_PHONE_NUMBER
NEXT_PUBLIC_PHONE_DISPLAY
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_ADMIN_EMAIL
NEXT_PUBLIC_ADDRESS
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL
NEXT_PUBLIC_FACEBOOK_URL
NEXT_PUBLIC_INSTAGRAM_URL
NEXT_PUBLIC_LINKEDIN_URL
```

Para agregar una nueva variable:
1. Agregarla en `.env.example`
2. Leerla en `data/content.ts` con su fallback `__PLACEHOLDER__`
3. Agregarla a la lista `VARS` en `scripts/entrypoint.sh`
4. Agregarla en `docker-compose.yml`

## Deploy a Produccion

### Requisitos previos

- Docker instalado
- Autenticacion con GHCR: `docker login ghcr.io`
- Acceso a Portainer del servidor

### Pasos

```bash
# 1. Build y push con tag latest
./scripts/deploy.sh

# 2. O con tag de version especifico
./scripts/deploy.sh v1.2.0
```

El script ejecuta:
```bash
docker build -t ghcr.io/tomas-gen/web_cuyo_smart_sas:${TAG} .
docker push ghcr.io/tomas-gen/web_cuyo_smart_sas:${TAG}
```

Luego, en Portainer: **Pull and redeploy** el stack/servicio.

### Cambiar datos de contacto sin rebuild

Si solo cambian datos de contacto, URLs o redes sociales:

1. Editar las variables en `docker-compose.yml` (o en Portainer)
2. Reiniciar el contenedor: `docker compose up -d`

El `entrypoint.sh` reinyectara los nuevos valores al arrancar.

## Docker Compose

### Produccion (`docker-compose.yml`)

```yaml
services:
  app:
    image: ghcr.io/tomas-gen/web_cuyo_smart_sas:latest
    container_name: cuyo_smart_sas
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SITE_URL=https://cuyosmart.com.ar
      - NEXT_PUBLIC_PHONE_NUMBER=+5492617590316
      # ... demas variables
    restart: unless-stopped
```

### Desarrollo (`docker-compose.dev.yml`)

```yaml
services:
  app:
    image: node:22-alpine
    container_name: cuyo_smart_sas-dev
    working_dir: /app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    env_file:
      - .env.local
    volumes:
      - ./:/app
      - /app/node_modules
      - /app/.next
    command: sh -c "npm install && npm run dev"
```

Iniciar con:
```bash
docker compose -f docker-compose.dev.yml up
```

Los volumenes montados permiten hot reload: los cambios en el codigo se reflejan automaticamente.

## Redirects

Configurados en `next.config.ts` como redirects permanentes (301) para migracion de URLs:

| URL antigua                              | URL nueva                                        |
| :--------------------------------------- | :----------------------------------------------- |
| `/reparacion-techos-impermeabilizacion`  | `/reparacion-techos-impermeabilizacion-mendoza`  |
| `/obras-civiles-remodelaciones`          | `/obras-civiles-construccion-en-seco-mendoza`    |
| `/aislacion-termica-poliuretano`         | `/aislacion-termica-poliuretano-expandido`       |
| `/contacto-presupuesto`                  | `/contacto-presupuesto-obras`                    |

## SEO

### Sitemap

Generado programaticamente en `app/sitemap.ts`. Incluye las 6 URLs del sitio con `lastModified` y `changeFrequency`.

### Robots.txt

Generado en `app/robots.ts`. Permite todos los crawlers y apunta al sitemap.

### Schema.org

El layout raiz (`app/layout.tsx`) incluye datos estructurados `LocalBusiness` en JSON-LD con:
- Nombre, descripcion, direccion
- Telefono, email
- Horarios de atencion
- Area de servicio
- Tipo de negocio

### Open Graph / Meta Tags

Cada pagina define metadata propia con titulo, descripcion, y tags Open Graph para compartir en redes sociales.

## Scripts de Utilidad

### `scripts/optimize-images.sh`

Categoriza y convierte imagenes a WebP usando ImageMagick:

```bash
bash scripts/optimize-images.sh
```

Requiere `imagemagick` instalado. Si no esta disponible, copia las imagenes sin convertir.

### `scripts/classify-new-images.sh`

Clasifica imagenes nuevas de subcarpetas no integradas en las 4 categorias principales, renombrandolas con numeracion secuencial:

```bash
# Ver que haria sin ejecutar cambios
bash scripts/classify-new-images.sh --dry-run

# Ejecutar la clasificacion
bash scripts/classify-new-images.sh
```

Las imagenes se clasifican por palabras clave en el nombre del directorio:
- **techos:** techo, chapa, tejas, quincho, cochera
- **impermeabilizacion:** membrana, liquida, imperm
- **obras-civiles:** remodelacion, bano, medianera, cielorraso
- **aislacion:** aislacion, poliuretano, eolico

## Monitoreo

El contenedor corre con `restart: unless-stopped`. Para verificar su estado:

```bash
# Estado del contenedor
docker ps | grep cuyo_smart_sas

# Logs en tiempo real
docker logs -f cuyo_smart_sas

# Uso de recursos
docker stats cuyo_smart_sas
```

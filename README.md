# CuyoSmart SAS - Sitio Web Corporativo

Sitio web corporativo de **CuyoSmart SAS**, empresa de construccion, mantenimiento e infraestructura con base en Mendoza, Argentina. Operando desde 2009 con mas de 17 anos de experiencia.

**Dominio de produccion:** [cuyosmart.com.ar](https://cuyosmart.com.ar)

## Stack Tecnologico

| Tecnologia       | Version  | Proposito                        |
| :--------------- | :------- | :------------------------------- |
| Next.js          | 16.1.6   | Framework React (App Router)     |
| React            | 19.2.3   | Biblioteca de UI                 |
| TypeScript       | ^5       | Tipado estatico                  |
| Tailwind CSS     | ^4       | Framework CSS utility-first      |
| Lucide React     | ^0.563.0 | Biblioteca de iconos             |
| Docker           | Multi-stage | Contenerizacion                |
| Node.js          | 22-alpine | Runtime                         |

## Inicio Rapido

### Desarrollo local (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores reales

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Desarrollo con Docker

```bash
docker compose -f docker-compose.dev.yml up
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Produccion con Docker

```bash
docker compose up -d
```

## Comandos Disponibles

| Comando           | Descripcion                                     |
| :---------------- | :---------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con hot reload  |
| `npm run build`   | Compila la aplicacion para produccion            |
| `npm run start`   | Inicia el servidor de produccion                 |
| `npm run lint`    | Ejecuta ESLint sobre el codigo fuente            |

## Estructura del Proyecto

```
web_cuyo_smart_sas/
├── app/                          # Paginas (Next.js App Router)
│   ├── layout.tsx                # Layout raiz (fonts, Schema.org, Header/Footer)
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Tema Tailwind CSS v4 y animaciones
│   ├── sitemap.ts                # Sitemap programatico
│   ├── robots.ts                 # Configuracion robots.txt
│   ├── reparacion-techos-impermeabilizacion-mendoza/
│   ├── aislacion-termica-poliuretano-expandido/
│   ├── obras-civiles-construccion-en-seco-mendoza/
│   ├── proyectos-obras-realizadas/
│   └── contacto-presupuesto-obras/
├── components/                   # Componentes React reutilizables
│   ├── Header.tsx                # Navegacion fija con menu mobile
│   ├── Footer.tsx                # Footer de 4 columnas
│   ├── WhatsAppFAB.tsx           # Boton flotante de WhatsApp
│   └── FAQAccordion.tsx          # Acordeon de preguntas frecuentes
├── data/
│   └── content.ts                # Fuente unica de todo el contenido
├── types/
│   └── content.ts                # Interfaces TypeScript
├── public/
│   ├── brand/                    # Logos SVG y JPG
│   └── images/                   # ~410 fotos de proyectos
│       ├── techos/               # 108 imagenes
│       ├── impermeabilizacion/   # 128 imagenes
│       ├── obras-civiles/        # 110 imagenes
│       ├── aislacion/            # 60 imagenes
│       └── home/                 # 4 imagenes
├── scripts/                      # Scripts de utilidad
│   ├── deploy.sh                 # Build + push a GHCR
│   ├── entrypoint.sh             # Inyeccion de env vars en runtime
│   ├── optimize-images.sh        # Optimizacion de imagenes a WebP
│   └── classify-new-images.sh    # Clasificacion de imagenes nuevas
├── Dockerfile                    # Build multi-stage para produccion
├── docker-compose.yml            # Compose de produccion
├── docker-compose.dev.yml        # Compose de desarrollo
└── .env.example                  # Plantilla de variables de entorno
```

## Variables de Entorno

Copiar `.env.example` como `.env.local` y completar con valores reales:

```bash
cp .env.example .env.local
```

| Variable                              | Descripcion                          |
| :------------------------------------ | :----------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | URL base de produccion               |
| `NEXT_PUBLIC_PHONE_NUMBER`            | Telefono (formato internacional)     |
| `NEXT_PUBLIC_PHONE_DISPLAY`           | Telefono con formato legible         |
| `NEXT_PUBLIC_CONTACT_EMAIL`           | Email de contacto general            |
| `NEXT_PUBLIC_ADMIN_EMAIL`             | Email para presupuestos              |
| `NEXT_PUBLIC_ADDRESS`                 | Direccion fisica                     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`         | Numero de WhatsApp (solo digitos)    |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`   | URL embed de Google Maps             |
| `NEXT_PUBLIC_FACEBOOK_URL`            | URL de Facebook                      |
| `NEXT_PUBLIC_INSTAGRAM_URL`           | URL de Instagram                     |
| `NEXT_PUBLIC_LINKEDIN_URL`            | URL de LinkedIn                      |

## Despliegue

El proyecto se despliega mediante Docker en GitHub Container Registry (GHCR) y se gestiona con Portainer.

```bash
# Build y push con tag latest
./scripts/deploy.sh

# Build y push con tag especifico
./scripts/deploy.sh v1.0.0
```

Ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) para la guia completa de despliegue.

## Documentacion

| Documento                                              | Descripcion                                       |
| :----------------------------------------------------- | :------------------------------------------------ |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)           | Arquitectura del proyecto y decisiones de diseno   |
| [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md)               | Guia de despliegue y operaciones                   |
| [docs/CONTENIDO.md](docs/CONTENIDO.md)                 | Gestion de contenido y datos                       |
| [docs/DESARROLLO.md](docs/DESARROLLO.md)               | Guia para desarrolladores                          |
| [AGENTS.md](AGENTS.md)                                 | Guia para agentes de codificacion IA               |

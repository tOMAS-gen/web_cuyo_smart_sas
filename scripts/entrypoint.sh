#!/bin/sh
# =============================================================================
# entrypoint.sh
# Reemplaza placeholders __NEXT_PUBLIC_*__ en los archivos JS compilados
# con los valores reales del environment de Docker.
# Esto permite configurar variables NEXT_PUBLIC_* en runtime sin reconstruir.
# =============================================================================

set -e

# Lista de variables a reemplazar
VARS="
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_PHONE_NUMBER
NEXT_PUBLIC_PHONE_DISPLAY
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_ADDRESS
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL
NEXT_PUBLIC_FACEBOOK_URL
NEXT_PUBLIC_INSTAGRAM_URL
NEXT_PUBLIC_LINKEDIN_URL
"

echo "→ Inyectando variables de entorno en el bundle..."

# SITE_URL se bakeó con el valor real en build-time (no como placeholder).
# Si el usuario define otro dominio, reemplazamos el valor original.
BUILD_SITE_URL="https://cuyosmart.com.ar"
if [ -n "$NEXT_PUBLIC_SITE_URL" ] && [ "$NEXT_PUBLIC_SITE_URL" != "$BUILD_SITE_URL" ]; then
    find /app/.next -name "*.js" -exec sed -i "s|${BUILD_SITE_URL}|${NEXT_PUBLIC_SITE_URL}|g" {} + 2>/dev/null || true
    find /app/.next -name "*.html" -exec sed -i "s|${BUILD_SITE_URL}|${NEXT_PUBLIC_SITE_URL}|g" {} + 2>/dev/null || true
    echo "  ✓ NEXT_PUBLIC_SITE_URL = ${NEXT_PUBLIC_SITE_URL}"
fi

for VAR_NAME in $VARS; do
    # Obtener el valor de la variable de entorno
    VAR_VALUE=$(eval echo "\$$VAR_NAME")

    # Si la variable está definida y no está vacía, reemplazar el placeholder
    if [ -n "$VAR_VALUE" ]; then
        PLACEHOLDER="__${VAR_NAME}__"

        # Reemplazar en todos los archivos JS del build
        find /app/.next -name "*.js" -exec sed -i "s|${PLACEHOLDER}|${VAR_VALUE}|g" {} + 2>/dev/null || true
        find /app/.next -name "*.html" -exec sed -i "s|${PLACEHOLDER}|${VAR_VALUE}|g" {} + 2>/dev/null || true

        echo "  ✓ ${VAR_NAME} = ${VAR_VALUE}"
    fi
done

echo "→ Iniciando servidor..."
exec node server.js

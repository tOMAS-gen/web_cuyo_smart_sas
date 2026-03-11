#!/bin/bash
# =============================================================================
# Script para construir y subir la imagen de producción a GHCR
#
# Los datos de contacto se toman de los fallbacks en data/content.ts.
# Para cambiarlos, editar ese archivo y volver a ejecutar este script.
#
# Uso:
#   ./scripts/deploy.sh           # sube como :latest
#   ./scripts/deploy.sh v1.0.0    # sube como :v1.0.0
# =============================================================================

set -e

IMAGE="ghcr.io/tomas-gen/web_cuyo_smart_sas"
TAG="${1:-latest}"

echo "→ Construyendo imagen ${IMAGE}:${TAG}..."
docker build -t "${IMAGE}:${TAG}" .

echo "→ Subiendo imagen a GHCR..."
docker push "${IMAGE}:${TAG}"

echo "✓ Listo: ${IMAGE}:${TAG}"
echo "  En Portainer: Pull and redeploy"

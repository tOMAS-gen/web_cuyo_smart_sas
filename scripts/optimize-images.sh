#!/bin/bash

# Directorio de origen
SOURCE_DIR="/Users/tomi/github.com/tOMAS-gen/web_cuyo_smart_sas/public/images"
# Directorio de destino
DEST_DIR="/Users/tomi/github.com/tOMAS-gen/web_cuyo_smart_sas/public/images/optimized"

# Crear directorios si no existen
mkdir -p "$DEST_DIR"/{techos,remodelaciones,impermeabilizacion,obras-civiles,otros}

# Función para categorizar y renombrar imágenes
categorize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local category=""

    # Categorización basada en nombres de directorios
    case "$file" in 
        *techo*|*chapa*) category="techos" ;;
        *remodelacion*|*baño*|*quincho*) category="remodelaciones" ;;
        *impermea*|*membrana*|*liquida*) category="impermeabilizacion" ;;
        *obras-civiles*) category="obras-civiles" ;;
        *) category="otros" ;;
    esac

    # Generar nuevo nombre descriptivo
    local timestamp=$(date +"%Y%m%d%H%M%S")
    local new_filename="${category}-${timestamp}-${filename}"
    
    # Convertir a WebP y optimizar
    if command -v magick &> /dev/null; then
        magick convert "$file" -quality 80 "$DEST_DIR/$category/${new_filename%.*}.webp"
    else
        cp "$file" "$DEST_DIR/$category/$new_filename"
    fi
}

# Exportar la función para usar con find
export -f categorize_image
export SOURCE_DIR
export DEST_DIR

# Buscar y procesar todas las imágenes
find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec bash -c 'categorize_image "$0"' {} \;

echo "Optimización completada. Imágenes guardadas en $DEST_DIR"
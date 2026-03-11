#!/usr/bin/env bash
# =============================================================================
# classify-new-images.sh
#
# Clasifica las imagenes de las subcarpetas no integradas de public/images/
# en las 4 categorias principales (techos, impermeabilizacion, obras-civiles,
# aislacion), renombrandolas con numeracion secuencial.
#
# Uso: bash scripts/classify-new-images.sh [--dry-run]
# =============================================================================

set -euo pipefail

BASE_DIR="/Users/tomi/github.com/tOMAS-gen/web_cuyo_smart_sas/public/images"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "=== DRY RUN MODE - No files will be copied ==="
fi

# Contar archivos existentes en cada categoria
count_files() {
    local dir="$1"
    local n
    n=$(find "$dir" -maxdepth 1 -name '*.jpeg' -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "$n"
}

NEXT_TECHOS=$(( $(count_files "$BASE_DIR/techos") + 1 ))
NEXT_IMPERMEABILIZACION=$(( $(count_files "$BASE_DIR/impermeabilizacion") + 1 ))
NEXT_OBRAS=$(( $(count_files "$BASE_DIR/obras-civiles") + 1 ))
NEXT_AISLACION=$(( $(count_files "$BASE_DIR/aislacion") + 1 ))

echo "Numeracion inicial:"
echo "  techos:              $NEXT_TECHOS"
echo "  impermeabilizacion:  $NEXT_IMPERMEABILIZACION"
echo "  obras-civiles:       $NEXT_OBRAS"
echo "  aislacion:           $NEXT_AISLACION"
echo ""

COUNT_TECHOS=0
COUNT_IMPERMEABILIZACION=0
COUNT_OBRAS=0
COUNT_AISLACION=0
SKIPPED=0

# Funcion para copiar imagen con numero secuencial
copy_image() {
    local src="$1"
    local category="$2"
    local num padded_num dest

    case "$category" in
        techos)
            num=$NEXT_TECHOS
            padded_num=$(printf "%02d" "$num")
            dest="$BASE_DIR/techos/${padded_num}.jpeg"
            NEXT_TECHOS=$((num + 1))
            COUNT_TECHOS=$((COUNT_TECHOS + 1))
            ;;
        impermeabilizacion)
            num=$NEXT_IMPERMEABILIZACION
            padded_num=$(printf "%02d" "$num")
            dest="$BASE_DIR/impermeabilizacion/${padded_num}.jpeg"
            NEXT_IMPERMEABILIZACION=$((num + 1))
            COUNT_IMPERMEABILIZACION=$((COUNT_IMPERMEABILIZACION + 1))
            ;;
        obras-civiles)
            num=$NEXT_OBRAS
            padded_num=$(printf "%02d" "$num")
            dest="$BASE_DIR/obras-civiles/${padded_num}.jpeg"
            NEXT_OBRAS=$((num + 1))
            COUNT_OBRAS=$((COUNT_OBRAS + 1))
            ;;
        aislacion)
            num=$NEXT_AISLACION
            padded_num=$(printf "%02d" "$num")
            dest="$BASE_DIR/aislacion/${padded_num}.jpeg"
            NEXT_AISLACION=$((num + 1))
            COUNT_AISLACION=$((COUNT_AISLACION + 1))
            ;;
    esac

    if $DRY_RUN; then
        echo "  [DRY] $(basename "$src") -> $category/${padded_num}.jpeg"
    else
        cp "$src" "$dest"
        echo "  $(basename "$src") -> $category/${padded_num}.jpeg"
    fi
}

# Funcion para determinar la categoria de un nombre de directorio
get_category() {
    local dir_name_lower
    dir_name_lower=$(echo "$1" | tr '[:upper:]' '[:lower:]')

    # Aislacion / Poliuretano
    if echo "$dir_name_lower" | grep -qE '(aislacion|poliuretano|eolico)'; then
        echo "aislacion"
        return
    fi

    # Impermeabilizacion / Membrana
    if echo "$dir_name_lower" | grep -qE '(membrana|mebrana|memebrana|imperm|impem|liquida)'; then
        echo "impermeabilizacion"
        return
    fi

    # Obras civiles / Remodelacion
    if echo "$dir_name_lower" | grep -qE '(remodelacion|bano|baño|pieza|medianera|expansion|cielorraso|vereda|fondo)'; then
        echo "obras-civiles"
        return
    fi

    # Techos
    if echo "$dir_name_lower" | grep -qE '(techo|chapa|tejas|quincho|cochera|sangeria)'; then
        echo "techos"
        return
    fi

    echo ""
}

# Directorios excluidos
is_excluded() {
    local name="$1"
    case "$name" in
        techos|impermeabilizacion|obras-civiles|aislacion|home|optimized) return 0 ;;
        *) return 1 ;;
    esac
}

# Procesar subcarpetas
for subdir in "$BASE_DIR"/*/; do
    [ -d "$subdir" ] || continue
    dir_name=$(basename "$subdir")

    if is_excluded "$dir_name"; then
        continue
    fi

    # Buscar imagenes
    img_count=$(find "$subdir" -maxdepth 1 -type f -iname "*.jpeg" 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$img_count" -eq 0 ]]; then
        continue
    fi

    # Determinar categoria
    category=$(get_category "$dir_name")

    if [[ -z "$category" ]]; then
        echo "[SKIP] No se pudo clasificar: $dir_name ($img_count imagenes)"
        SKIPPED=$((SKIPPED + img_count))
        continue
    fi

    echo "[$category] $dir_name/ ($img_count imagenes)"
    while IFS= read -r img; do
        copy_image "$img" "$category"
    done < <(find "$subdir" -maxdepth 1 -type f -iname "*.jpeg" | sort)
    echo ""
done

# Procesar archivos sueltos en la raiz
echo "=== Archivos sueltos en raiz ==="
while IFS= read -r img; do
    fname_lower=$(basename "$img" | tr '[:upper:]' '[:lower:]')

    if echo "$fname_lower" | grep -qE '(membrana|mebrana|memebrana|liquida)'; then
        category="impermeabilizacion"
    elif echo "$fname_lower" | grep -qE '(techo|tejas)'; then
        category="techos"
    elif echo "$fname_lower" | grep -qE '(cielorraso)'; then
        category="obras-civiles"
    else
        category="techos"
    fi

    echo "[$category] $(basename "$img")"
    copy_image "$img" "$category"
done < <(find "$BASE_DIR" -maxdepth 1 -type f -iname "*.jpeg" | sort)

echo ""
echo "=== RESUMEN ==="
echo "  techos:              +$COUNT_TECHOS imagenes (ahora hasta $(printf '%02d' $((NEXT_TECHOS - 1))).jpeg)"
echo "  impermeabilizacion:  +$COUNT_IMPERMEABILIZACION imagenes (ahora hasta $(printf '%02d' $((NEXT_IMPERMEABILIZACION - 1))).jpeg)"
echo "  obras-civiles:       +$COUNT_OBRAS imagenes (ahora hasta $(printf '%02d' $((NEXT_OBRAS - 1))).jpeg)"
echo "  aislacion:           +$COUNT_AISLACION imagenes (ahora hasta $(printf '%02d' $((NEXT_AISLACION - 1))).jpeg)"
echo "  Omitidas:            $SKIPPED"
echo ""
TOTAL=$((COUNT_TECHOS + COUNT_IMPERMEABILIZACION + COUNT_OBRAS + COUNT_AISLACION))
echo "Total nuevas imagenes integradas: $TOTAL"

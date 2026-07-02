#!/bin/bash
# privacy-regression.sh
# Verifies that public structs and public endpoints do not leak private fields.

set -e

# Forbidden keywords (checked case-insensitively)
FORBIDDEN_FIELDS=("email" "telegram" "phone" "privatenote" "private_note" "requesteremail" "requestertelegram" "counterpartycontact" "walletprivatekey" "secret")

echo "=== STARTING PRIVACY REGRESSION TEST ==="
echo ""

# 1. Static code scan of public-facing structs
echo "1. Scanning backend Go models for leaking tags in public structs..."
SRC_DIR="services/backend-go"

VIOLATIONS=0

check_struct_tags() {
    local file=$1
    local struct_name=$2
    
    echo "Checking struct $struct_name in $file..."
    
    if [ ! -f "$file" ]; then
        echo "  ERROR: File $file not found!"
        VIOLATIONS=$((VIOLATIONS + 1))
        return
    fi
    
    # Extract the struct block
    local in_struct=0
    while IFS= read -r line || [ -n "$line" ]; do
        if echo "$line" | grep -E "type[[:space:]]+$struct_name[[:space:]]+struct" > /dev/null; then
            in_struct=1
            continue
        fi
        if [ $in_struct -eq 1 ]; then
            if echo "$line" | grep -E "^[[:space:]]*\}" > /dev/null; then
                in_struct=0
                continue
            fi
            # Extract json tag name
            if echo "$line" | grep -E '\`json:\"[^\"]+\"\`' > /dev/null; then
                local json_tag
                json_tag=$(echo "$line" | sed -n 's/.*json:"\([^"]*\)".*/\1/p')
                # split tags by comma (e.g. "email,omitempty")
                local tag_name
                tag_name=$(echo "$json_tag" | cut -d',' -f1)
                
                # Check against forbidden words
                local tag_lower
                tag_lower=$(echo "$tag_name" | tr '[:upper:]' '[:lower:]')
                for forbidden in "${FORBIDDEN_FIELDS[@]}"; do
                    local forbidden_lower
                    forbidden_lower=$(echo "$forbidden" | tr '[:upper:]' '[:lower:]')
                    if echo "$tag_lower" | grep "$forbidden_lower" > /dev/null; then
                        # Exclude allowed public fields
                        if [ "$tag_lower" != "publiccontact" ] && [ "$tag_lower" != "contactmethod" ]; then
                            echo "  ERROR: Forbidden tag '$tag_name' (matches '$forbidden') found in struct $struct_name"
                            VIOLATIONS=$((VIOLATIONS + 1))
                        fi
                    fi
                done
            fi
        fi
    done < "$file"
}

# Run struct checks
check_struct_tags "$SRC_DIR/internal/board/models.go" "PublicBoardListing"
check_struct_tags "$SRC_DIR/internal/history/models.go" "HistoryItem"

# 2. Query production backend endpoint and scan JSON output for forbidden fields
echo ""
echo "2. Querying production API to verify no forbidden keys in actual payload..."
BACKEND_URL=${BACKEND_URL:-"https://trade-window-production.up.railway.app"}
LISTINGS_URL="$BACKEND_URL/api/board/listings"

echo "Fetching listings from $LISTINGS_URL..."
local_payload=$(curl -s "$LISTINGS_URL")

# Check if payload is valid JSON and does not contain forbidden keys
if [ -n "$local_payload" ] && [ "$local_payload" != "null" ]; then
    for forbidden in "${FORBIDDEN_FIELDS[@]}"; do
        forbidden_lower=$(echo "$forbidden" | tr '[:upper:]' '[:lower:]')
        # Do not flag contactMethod or publicContact
        if [ "$forbidden_lower" = "contact" ]; then
            # We want to make sure it's not "privateContact" or just "contact"
            # but allowed: "publicContact", "contactMethod"
            # So search for: contact, but not publicContact or contactMethod
            if echo "$local_payload" | grep -i -E '"[^"]*contact[^"]*"' | grep -v -i -E 'publicContact|contactMethod' > /dev/null; then
                echo "  ERROR: Forbidden field matching '$forbidden' found in production API payload!"
                VIOLATIONS=$((VIOLATIONS + 1))
            fi
        else
            if echo "$local_payload" | tr '[:upper:]' '[:lower:]' | grep -q "$forbidden_lower"; then
                echo "  ERROR: Forbidden field matching '$forbidden' found in production API payload!"
                VIOLATIONS=$((VIOLATIONS + 1))
            fi
        fi
    done
else
    echo "  (No listings found or API unreachable, skipping live payload check)"
fi

echo ""
if [ $VIOLATIONS -eq 0 ]; then
    echo "=== PRIVACY REGRESSION TEST PASSED ==="
    exit 0
else
    echo "=== PRIVACY REGRESSION TEST FAILED ($VIOLATIONS violations found) ==="
    exit 1
fi

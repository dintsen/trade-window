#!/bin/bash
# mainnet-guard-regression.sh
# Verifies that Gno mainnet transfers remain strictly disabled,
# and no custodial/signing logic exists in the codebase.

set -e

echo "=== STARTING MAINNET GUARD REGRESSION TEST ==="
echo ""

VIOLATIONS=0

# 1. Check env files
echo "1. Checking environment configuration files..."
ENV_FILES=(
    "apps/web/.env"
    "apps/web/.env.example"
    ".env"
    ".env.example"
)

for env_file in "${ENV_FILES[@]}"; do
    if [ -f "$env_file" ]; then
        echo "Checking $env_file..."
        # If the file defines ENABLE_GNO_MAINNET_TRANSFERS=true, it's a violation
        if grep -E "^[[:space:]]*NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS[[:space:]]*=[[:space:]]*true" "$env_file" > /dev/null; then
            echo "  ERROR: NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS is set to true in $env_file!"
            VIOLATIONS=$((VIOLATIONS + 1))
        else
            echo "  OK"
        fi
    fi
done

# 2. Check frontend feature flags configuration
echo ""
echo "2. Verifying frontend feature flag default settings..."
FLAGS_FILE="apps/web/src/lib/config/feature-flags.ts"
if [ -f "$FLAGS_FILE" ]; then
    echo "Checking $FLAGS_FILE..."
    # Ensure it parses the env variable and doesn't hardcode true
    if grep -E "enableGnoMainnetTransfers:[[:space:]]*true" "$FLAGS_FILE" > /dev/null; then
        echo "  ERROR: enableGnoMainnetTransfers is hardcoded to true in $FLAGS_FILE!"
        VIOLATIONS=$((VIOLATIONS + 1))
    else
        echo "  OK"
    fi
else
    echo "  WARNING: Feature flags file not found at $FLAGS_FILE"
fi

# 3. Check for backend signing/custody/keys
echo ""
echo "3. Verifying non-custodial architecture (no private keys/signing in Go backend)..."
BACKEND_DIR="services/backend-go"

# Search for common private key variables/signing methods that should not exist in backend
FORBIDDEN_PATTERNS=(
    "PrivateKey"
    "SeedPhrase"
    "Mnemonic"
    "SignTx"
    "SignTransaction"
    "BroadcastTx"
    "gno.land/r/gov" # Avoid governmental or mainnet direct contract calls
)

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    # Search Go files only
    found_files=$(grep -rn --include="*.go" "$pattern" "$BACKEND_DIR" || true)
    if [ -n "$found_files" ]; then
        # Check if the match is a comment or a model validation field (like walletPrivateKey in schema)
        # We can print it as warning/error depending on content.
        echo "  WARNING: Found potential custodial pattern '$pattern' in backend:"
        echo "$found_files"
        # We don't fail immediately unless it's a clear private key storage variable
        if echo "$found_files" | grep -E "var|func|const" > /dev/null; then
            echo "  ERROR: Direct key/signing variable/function found in backend code!"
            VIOLATIONS=$((VIOLATIONS + 1))
        fi
    fi
done

echo ""
if [ $VIOLATIONS -eq 0 ]; then
    echo "=== MAINNET GUARD REGRESSION TEST PASSED ==="
    exit 0
else
    echo "=== MAINNET GUARD REGRESSION TEST FAILED ($VIOLATIONS violations found) ==="
    exit 1
fi

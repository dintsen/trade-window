#!/bin/bash
# auth-smoke.sh
# Smoke test script to verify Trade Window wallet authentication status.

set -e

BACKEND_URL=${BACKEND_URL:-"https://trade-window-production.up.railway.app"}

echo "=== STARTING AUTH SMOKE TEST ==="
echo "Backend URL: $BACKEND_URL"
echo ""

# 1. Check if unauthenticated GET /api/me fails or is unregistered (401 or 404)
echo -n "Checking GET /api/me (expecting 401 Unauthorized or 404 Not Found)... "
status_me=$(curl -o /dev/null -s -w "%{http_code}" "$BACKEND_URL/api/me")
if [ "$status_me" = "401" ]; then
    echo "OK (Got 401 Unauthorized)"
elif [ "$status_me" = "404" ]; then
    echo "PENDING (Got 404 Not Found - Endpoints are currently blocked/pending implementation)"
else
    echo "FAILED (Got unexpected status code: $status_me)"
    exit 1
fi

# 2. Check if GET /api/me/trades without wallet query parameter returns error (400 or 401)
echo -n "Checking GET /api/me/trades without session/parameters... "
status_trades=$(curl -o /dev/null -s -w "%{http_code}" "$BACKEND_URL/api/me/trades")
if [ "$status_trades" = "400" ]; then
    echo "MVP-DEPRECATED (Got 400 Bad Request - backend is in deprecated query-param mode)"
elif [ "$status_trades" = "401" ]; then
    echo "OK (Got 401 Unauthorized - backend enforces authenticated sessions)"
elif [ "$status_trades" = "404" ]; then
    echo "PENDING (Got 404 Not Found - Trades history endpoint is pending deployment)"
else
    echo "FAILED (Got unexpected status code: $status_trades)"
    exit 1
fi

# 3. Check /api/auth/nonce
echo -n "Checking POST /api/auth/nonce availability... "
status_nonce=$(curl -o /dev/null -s -w "%{http_code}" -X POST "$BACKEND_URL/api/auth/nonce")
if [ "$status_nonce" = "404" ]; then
    echo "PENDING (Got 404 - Not yet implemented due to Adena signing blockers)"
else
    echo "UNEXPECTED (Got status code: $status_nonce)"
fi

echo ""
echo "=== AUTH SMOKE TEST COMPLETED ==="
echo "Note: Full cryptographic signature verification remains blocked."
echo "See docs/WALLET_AUTH_PLAN.md for details."
exit 0

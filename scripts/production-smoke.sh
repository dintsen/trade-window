#!/bin/bash
# production-smoke.sh
# Smoke test script for Trade Window production deployment.
# Verifies key frontend pages and backend API endpoints.

set -e

FRONTEND_URL=${FRONTEND_URL:-"https://tradewindow.xyz"}
BACKEND_URL=${BACKEND_URL:-"https://trade-window-production.up.railway.app"}
TEST_WALLET="g1jg8mtu5upuzwepzth9kvl6nv970n5v42k0t7t3"

echo "=== STARTING PRODUCTION SMOKE TEST ==="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo ""

FAILED=0

check_endpoint() {
    local url=$1
    local name=$2
    local expected_code=${3:-"200"}
    
    echo -n "Testing $name ($url)... "
    # Fetch HTTP status code
    local status_code
    status_code=$(curl -o /dev/null -s -w "%{http_code}" "$url")
    
    if [ "$status_code" = "$expected_code" ]; then
        echo "OK ($status_code)"
    else
        echo "FAILED (Expected $expected_code, got $status_code)"
        FAILED=$((FAILED + 1))
    fi
}

# 1. Frontend Pages
check_endpoint "$FRONTEND_URL/" "Frontend Home" "200"
check_endpoint "$FRONTEND_URL/board" "Frontend OTC Board" "200"
# NOTE: Next.js pages might redirect/rewrite depending on trailing slashes or authentication logic,
# but we expect HTTP 200 for these routes.
check_endpoint "$FRONTEND_URL/request" "Frontend Deal Request" "200"
check_endpoint "$FRONTEND_URL/trade" "Frontend Trade Room Root" "200"
check_endpoint "$FRONTEND_URL/history" "Frontend Trade History" "200"
check_endpoint "$FRONTEND_URL/trades" "Frontend Trades List" "200"

# 2. Backend API Endpoints
check_endpoint "$BACKEND_URL/health" "Backend Health Check" "200"
check_endpoint "$BACKEND_URL/api/board/listings" "Backend Listings API" "200"
check_endpoint "$BACKEND_URL/api/me/trades?wallet=$TEST_WALLET" "Backend My Trades API" "200"

echo ""
if [ $FAILED -eq 0 ]; then
    echo "=== ALL PRODUCTION SMOKE TESTS PASSED ==="
    exit 0
else
    echo "=== PRODUCTION SMOKE TESTS FAILED ($FAILED endpoints failed) ==="
    exit 1
fi

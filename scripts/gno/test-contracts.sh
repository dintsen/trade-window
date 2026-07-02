#!/bin/bash
set -e
export PATH="$HOME/go/bin:$PATH"

echo "=== Testing Gno Contracts ==="
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

for realm in board escrow fees intents registry rooms token; do
  echo "Testing ${realm}..."
  (cd "$ROOT/gno/realms/tradewindow/${realm}" && gno test . -v)
done

echo "✅ All Gno tests passed!"

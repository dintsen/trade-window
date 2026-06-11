#!/bin/bash
set -e
export PATH="$HOME/go/bin:$PATH"

echo "=== Testing Gno Contracts ==="
cd "$(dirname "$0")/../../gno/realms/tradewindow/rooms"
echo "Testing rooms..."
gno test . -v

cd "../intents"
echo "Testing intents..."
gno test . -v

cd "../registry"
echo "Testing registry..."
gno test . -v

echo "✅ All Gno tests passed!"

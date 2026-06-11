#!/bin/bash
set -e
export PATH="$HOME/go/bin:$PATH"

echo "=== Gno Tooling Check ==="

if command -v gno >/dev/null 2>&1; then
    echo "✅ gno found: $(gno version)"
else
    echo "❌ gno not found in PATH"
fi

if command -v gnokey >/dev/null 2>&1; then
    echo "✅ gnokey found: $(gnokey version)"
else
    echo "❌ gnokey not found in PATH"
fi

if command -v gnoland >/dev/null 2>&1; then
    echo "✅ gnoland found: $(gnoland version)"
else
    echo "❌ gnoland not found. Required for local node/dev environment."
fi

if command -v gnodev >/dev/null 2>&1; then
    echo "✅ gnodev found: $(gnodev version)"
else
    echo "❌ gnodev not found."
fi

echo "=== Summary ==="
if ! command -v gnoland >/dev/null 2>&1; then
    echo "Local dev node (gnoland) is MISSING. Local deployment dry-run cannot be executed."
else
    echo "All tooling available for local deployment dry-run."
fi

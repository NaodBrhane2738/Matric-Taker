#!/usr/bin/env bash
set -e

echo "============================================================"
echo "          MATRIC TRACKER - LOCAL LAUNCHER"
echo "============================================================"
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

# Check pnpm
PNPM_CMD="pnpm"
if ! command -v pnpm >/dev/null 2>&1; then
    echo "[INFO] pnpm not found. Using npx pnpm..."
    PNPM_CMD="npx pnpm"
fi

# Copy env if needed
if [ ! -f "apps/web/.env.local" ] && [ -f ".env.example" ]; then
    echo "[INFO] Copying .env.example to apps/web/.env.local..."
    cp .env.example apps/web/.env.local
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    $PNPM_CMD install
fi

echo ""
echo "[SUCCESS] Starting Matric Tracker at http://localhost:3000 ..."
echo ""

# Try opening browser across OS
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000" &
elif command -v open >/dev/null 2>&1; then
    open "http://localhost:3000" &
fi

$PNPM_CMD --filter web dev

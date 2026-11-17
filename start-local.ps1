# Matric Tracker - Local Start Script
$Host.UI.RawUI.WindowTitle = "Matric Tracker - Local Server"

Write-Host "============================================================" -ForegroundColor Green
Write-Host "          MATRIC TRACKER - LOCAL LAUNCHER" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. Check pnpm
$pnpmCmd = "pnpm"
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] pnpm not found in PATH. Using npx pnpm..." -ForegroundColor Yellow
    $pnpmCmd = "npx pnpm"
}

# 3. Check .env.local
if (-not (Test-Path "apps\web\.env.local")) {
    if (Test-Path ".env.example") {
        Write-Host "[INFO] Copying .env.example to apps\web\.env.local..." -ForegroundColor Cyan
        Copy-Item ".env.example" "apps\web\.env.local"
    }
}

# 4. Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Cyan
    Invoke-Expression "$pnpmCmd install"
}

Write-Host ""
Write-Host "[SUCCESS] Starting Matric Tracker at http://localhost:3000 ..." -ForegroundColor Green
Write-Host ""

# Launch browser
Start-Process "http://localhost:3000"

# Start dev server
Invoke-Expression "$pnpmCmd --filter web dev"

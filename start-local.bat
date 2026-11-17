@echo off
setlocal enabledelayedexpansion
title Matric Tracker - Local Server

echo ============================================================
echo           MATRIC TRACKER - LOCAL LAUNCHER
echo ============================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

:: 2. Check pnpm, fallback to npx pnpm if missing
set PNPM_CMD=pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] pnpm not found in PATH. Using npx pnpm...
    set PNPM_CMD=npx pnpm
)

:: 3. Check for .env.local
if not exist "apps\web\.env.local" (
    if exist ".env.example" (
        echo [INFO] Creating apps\web\.env.local from .env.example...
        copy ".env.example" "apps\web\.env.local" >nul
    )
)

:: 4. Check dependencies
if not exist "node_modules" (
    echo [INFO] Installing monorepo dependencies...
    call %PNPM_CMD% install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo [SUCCESS] Starting Matric Tracker local web app...
echo [URL] Opening http://localhost:3000 in your browser...
echo.

:: Open browser
start "" http://localhost:3000

:: Start Next.js dev server
call %PNPM_CMD% --filter web dev

pause

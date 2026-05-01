@echo off
echo ========================================
echo   SwipeVerse - Setup Script
echo ========================================
echo.
echo Step 1: Installing dependencies...
call npm install
echo.
echo Step 2: Starting development server...
echo Open http://localhost:3000 in your browser
echo.
call npm run dev

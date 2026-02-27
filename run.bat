@echo off
echo ========================================================
echo Starting Harshit Paints E-Commerce Application System...
echo ========================================================

echo.
echo [1/3] Ensuring backend dependencies and database schema are ready...
cd backend
start cmd /k "echo Starting Backend Server... && npm run dev"

echo [2/3] Backend is starting in a new window.
echo.

echo [3/3] Starting Frontend Server...
cd ../frontend

REM Check if frontend is installed yet before trying to run it
IF EXIST "package.json" (
    start cmd /k "echo Starting Frontend Server... && npm run dev"
    echo Frontend is starting in a new window.
) ELSE (
    echo [WARNING] Frontend folder does not have package.json yet. Keep waiting for the Next.js installation to finish!
)

echo.
echo ========================================================
echo System launched. Check the two new terminal windows for logs.
echo ========================================================
pause

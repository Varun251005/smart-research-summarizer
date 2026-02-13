@echo off
echo ========================================
echo   Mini NotebookLM - Starting Services
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Mini NotebookLM Backend" cmd /k "cd backend\app && python main.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Mini NotebookLM Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul

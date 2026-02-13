@echo off
echo ========================================
echo   Mini NotebookLM - Setup Script
echo ========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend\app
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..\..

echo.
echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now run 'start.bat' to launch the application
echo.
pause

@echo off
echo ===============================
echo E-Learning System - Windows Setup
echo ===============================
echo.

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies!
    pause
    exit /b 1
)
echo.

echo Installing client dependencies...
cd ../client
call npm install  
if %errorlevel% neq 0 (
    echo Error installing client dependencies!
    pause
    exit /b 1
)
echo.

echo ===============================
echo Setup complete!
echo ===============================
echo.
echo To start the application:
echo 1. Open two command prompts
echo 2. In first prompt: cd server && npm start
echo 3. In second prompt: cd client && npm run dev
echo.
echo Or use the start-windows.bat script
echo.
pause
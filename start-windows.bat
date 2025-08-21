@echo off
echo ===============================
echo Starting E-Learning System
echo ===============================
echo.

echo Starting server...
start "Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting client...
start "Client" cmd /k "cd client && npm run dev"

echo.
echo Both server and client are starting...
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo.
echo Press any key to exit this window
pause > nul
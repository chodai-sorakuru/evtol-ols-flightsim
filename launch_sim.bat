@echo off
setlocal
cd /d "%~dp0"
set "SIM_FILE=eVTOL_FlightSim_V24.html"
set "SIM_URL=http://localhost:8080/%SIM_FILE%"

where node >nul 2>nul
if %errorlevel%==0 (
  start "eVTOL FlightSim local server" /min node "%~dp0serve_sim.js"
  goto :open_browser
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "eVTOL FlightSim local server" /min py -m http.server 8080 --bind 127.0.0.1
  goto :open_browser
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "eVTOL FlightSim local server" /min python -m http.server 8080 --bind 127.0.0.1
  goto :open_browser
)

echo.
echo Node.js or Python 3 was not found on this PC.
echo Install either runtime, then run launch_sim.bat again.
echo.
pause
exit /b 1

:open_browser
timeout /t 2 /nobreak >nul
start "" "%SIM_URL%"
echo eVTOL FlightSim is running at:
echo %SIM_URL%
echo.
echo Mapbox Allowed URLs:
echo   http://localhost:8080/*
echo   http://127.0.0.1:8080/*
echo.
echo Keep the local server window open while using the simulator.
timeout /t 4 /nobreak >nul
endlocal

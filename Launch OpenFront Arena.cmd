@echo off
setlocal
if not exist "%~dp0apps\OpenFrontIO\package.json" (
  echo OpenFrontIO is not installed yet.
  echo Run "Install OpenFront Arena.cmd" first.
  pause
  exit /b 1
)
if not exist "%~dp0apps\OpenFrontIO\node_modules" (
  echo OpenFrontIO dependencies are missing.
  echo Run "Install OpenFront Arena.cmd" first.
  pause
  exit /b 1
)
start "" /min powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0apps\OpenFrontArena\scripts\windows\launch-control-room-suite.ps1"
endlocal

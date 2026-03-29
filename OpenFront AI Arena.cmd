@echo off
setlocal

set "ROOT=%~dp0"
set "OPENFRONT_ROOT=%ROOT%apps\OpenFrontIO"

if not exist "%OPENFRONT_ROOT%\package.json" (
  echo First run detected. Installing workspace...
  powershell -ExecutionPolicy Bypass -File "%ROOT%scripts\setup-workspace.ps1"
  if errorlevel 1 (
    echo Installation failed.
    pause
    exit /b 1
  )
)

if not exist "%OPENFRONT_ROOT%\node_modules" (
  echo Dependencies are missing. Running setup...
  powershell -ExecutionPolicy Bypass -File "%ROOT%scripts\setup-workspace.ps1"
  if errorlevel 1 (
    echo Installation failed.
    pause
    exit /b 1
  )
)

start "" /min powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "%ROOT%apps\OpenFrontArena\scripts\windows\launch-control-room-suite.ps1"

endlocal

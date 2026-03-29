@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\setup-workspace.ps1"
endlocal

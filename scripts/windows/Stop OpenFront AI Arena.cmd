@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0..\..\apps\OpenFrontArena\scripts\windows\stop-control-room.ps1"
endlocal

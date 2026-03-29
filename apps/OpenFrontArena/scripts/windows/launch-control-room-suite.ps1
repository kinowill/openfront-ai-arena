$ErrorActionPreference = "Stop"

# OpenFront local suite:
# - cleans stale node processes on the expected ports
# - starts the control room on 4318
# - starts OpenFrontIO local client/server stack
# - opens the control room in the browser

$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent (Split-Path -Parent $scriptsDir)
$openfrontRoot = Join-Path (Split-Path -Parent $root) "OpenFrontIO"
$controlRoomPort = 4318
$controlRoomUrl = "http://127.0.0.1:$controlRoomPort"
$openfrontPorts = @(9000, 3000, 3001, 3002)
$allPorts = @($controlRoomPort) + $openfrontPorts

function Stop-NodeListeners {
  param([int[]]$Ports)

  $listeners = Get-NetTCPConnection -LocalPort $Ports -State Listen -ErrorAction SilentlyContinue |
    Sort-Object -Property OwningProcess -Unique

  foreach ($listener in $listeners) {
    try {
      $process = Get-Process -Id $listener.OwningProcess -ErrorAction Stop
      if ($process.ProcessName -like "node*") {
        Stop-Process -Id $listener.OwningProcess -Force -ErrorAction Stop
        Write-Host "Stopped stale node process $($listener.OwningProcess) on port $($listener.LocalPort)."
      }
    } catch {
      Write-Host "Could not stop process $($listener.OwningProcess) on port $($listener.LocalPort)."
    }
  }
}

Stop-NodeListeners -Ports $allPorts

$controlRoomCommand = "cd /d `"$root`" && set `"OPENFRONT_BOTS_CONTROL_ROOM_PORT=$controlRoomPort`" && npm run control-room:start"
$openfrontCommand = "cd /d `"$openfrontRoot`" && set `"SKIP_BROWSER_OPEN=true`" && npm run dev"

Write-Host ""
Write-Host "Launching OpenFront Control Room Suite..."
Write-Host "  - Control Room: $controlRoomUrl"
Write-Host "  - OpenFront client: http://localhost:9000"
Write-Host "  - OpenFront server: http://localhost:3000"
Write-Host ""

Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "title OpenFront Control Room ($controlRoomPort) && $controlRoomCommand" | Out-Null
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "title OpenFrontIO Dev Stack && $openfrontCommand" | Out-Null

for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -Uri "$controlRoomUrl/api/dashboard" -UseBasicParsing -TimeoutSec 1
    if ($response.StatusCode -ge 200) {
      break
    }
  } catch {
  }
}

Start-Process -FilePath "explorer.exe" -ArgumentList $controlRoomUrl | Out-Null

Write-Host "Browser opening requested on $controlRoomUrl"

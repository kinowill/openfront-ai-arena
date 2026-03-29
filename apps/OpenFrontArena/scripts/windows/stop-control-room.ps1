$ErrorActionPreference = "Stop"

# Stops the local control room and OpenFrontIO listeners used by the suite.

$ports = @(4318, 9000, 3000, 3001, 3002)
$listeners = Get-NetTCPConnection -LocalPort $ports -State Listen -ErrorAction SilentlyContinue |
  Sort-Object -Property OwningProcess -Unique

if (-not $listeners) {
  Write-Host "No Control Room or OpenFrontIO listener found on ports 4318, 9000, 3000, 3001, or 3002."
  exit 0
}

Write-Host ""
Write-Host "Stopping local listeners..."
Write-Host ""

foreach ($listener in $listeners) {
  try {
    $process = Get-Process -Id $listener.OwningProcess -ErrorAction Stop
    if ($process.ProcessName -like "node*") {
      Stop-Process -Id $listener.OwningProcess -Force -ErrorAction Stop
      Write-Host "Stopped node process $($listener.OwningProcess) on port $($listener.LocalPort)."
    }
  } catch {
    Write-Host "Could not stop process $($listener.OwningProcess) on port $($listener.LocalPort)."
  }
}

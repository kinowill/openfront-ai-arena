$ErrorActionPreference = "Stop"

$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$setupScript = Join-Path $scriptsDir "setup-workspace.ps1"

& $setupScript -RefreshVendor

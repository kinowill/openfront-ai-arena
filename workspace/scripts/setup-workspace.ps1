param(
  [switch]$RefreshVendor
)

$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $workspaceRoot
$arenaRoot = Join-Path $repoRoot "apps\OpenFrontArena"
$openfrontRoot = Join-Path $repoRoot "apps\OpenFrontIO"
$lockFile = Join-Path $workspaceRoot "openfrontio.lock.json"

if (-not (Test-Path $lockFile)) {
  throw "Missing lock file: $lockFile"
}

$lock = Get-Content $lockFile -Raw | ConvertFrom-Json
$openfrontRepoUrl = [string]$lock.repo
$openfrontCommit = [string]$lock.commit
$patchFiles = @($lock.patches | ForEach-Object { Join-Path $workspaceRoot ([string]$_) })

if ([string]::IsNullOrWhiteSpace($openfrontRepoUrl) -or [string]::IsNullOrWhiteSpace($openfrontCommit)) {
  throw "openfrontio.lock.json must define both 'repo' and 'commit'."
}

if ($patchFiles.Count -eq 0) {
  throw "openfrontio.lock.json must define at least one patch."
}

function Assert-Command {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command '$Name'. Install it, then run setup again."
  }
}

function Test-GitTreeDirty {
  param([string]$RepoPath)

  $status = git -C $RepoPath status --porcelain
  return -not [string]::IsNullOrWhiteSpace(($status | Out-String))
}

function Ensure-OpenFrontCheckout {
  if (-not (Test-Path $openfrontRoot)) {
    Write-Host "Cloning OpenFrontIO..."
    git clone $openfrontRepoUrl $openfrontRoot
  }

  if (-not (Test-Path (Join-Path $openfrontRoot ".git"))) {
    throw "apps/OpenFrontIO exists but is not a git checkout."
  }

  Write-Host "Fetching OpenFrontIO..."
  git -C $openfrontRoot fetch origin --tags

  $currentHead = (git -C $openfrontRoot rev-parse HEAD).Trim()
  if ($RefreshVendor -or $currentHead -ne $openfrontCommit) {
    if (Test-GitTreeDirty -RepoPath $openfrontRoot) {
      throw "apps/OpenFrontIO has local changes. Commit or discard them before refreshing the vendor checkout."
    }

    Write-Host "Checking out OpenFrontIO commit $openfrontCommit..."
    git -C $openfrontRoot checkout $openfrontCommit
  }
}

function Ensure-OpenFrontPatch {
  foreach ($patchFile in $patchFiles) {
    if (-not (Test-Path $patchFile)) {
      throw "Missing patch file: $patchFile"
    }

    $reverseCheckOk = $false
    try {
      & git -C $openfrontRoot apply --ignore-space-change --ignore-whitespace --reverse --check $patchFile *> $null
    } catch {
    }
    if ($LASTEXITCODE -eq 0) {
      $reverseCheckOk = $true
    }

    if ($reverseCheckOk) {
      Write-Host "Patch already applied: $(Split-Path $patchFile -Leaf)"
      continue
    }

    try {
      & git -C $openfrontRoot apply --ignore-space-change --ignore-whitespace --check $patchFile *> $null
    } catch {
    }
    if ($LASTEXITCODE -ne 0) {
      throw "Patch $(Split-Path $patchFile -Leaf) cannot be applied cleanly on OpenFrontIO commit $openfrontCommit. Refresh or rebuild the patch set."
    }

    Write-Host "Applying patch: $(Split-Path $patchFile -Leaf)"
    git -C $openfrontRoot apply --ignore-space-change --ignore-whitespace --whitespace=nowarn $patchFile
  }
}

Assert-Command git
Assert-Command npm

Write-Host ""
Write-Host "Installing OpenFront Arena workspace..."
Write-Host "  - Arena root: $arenaRoot"
Write-Host "  - OpenFrontIO vendor: $openfrontRoot"
Write-Host "  - OpenFrontIO upstream: $openfrontRepoUrl"
Write-Host "  - Locked OpenFrontIO commit: $openfrontCommit"
Write-Host ""

Ensure-OpenFrontCheckout
Ensure-OpenFrontPatch

Write-Host "Installing OpenFrontIO dependencies..."
npm install --prefix $openfrontRoot

Write-Host "Installing OpenFrontArena dependencies..."
npm install --prefix $arenaRoot

Write-Host ""
Write-Host "Workspace ready."
Write-Host "Next step: double-click 'OpenFront AI Arena.cmd'"

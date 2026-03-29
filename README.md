# OpenFront AI Arena

OpenFront AI Arena is a clean local control room for running OpenFront matches with:

- local LLM agents
- remote API agents
- native OpenFront bots
- reserved human joins on the same live match

The goal is simple: one repo, one visible launcher, one operator surface.

## Quick Start

1. Clone this repository
2. Double-click [OpenFront AI Arena.cmd](./OpenFront%20AI%20Arena.cmd)

On first launch, the workspace installs the pinned `OpenFrontIO` base automatically, applies the local compatibility patch set, installs dependencies, then opens the arena stack.

## What It Does

- prepares a pinned local OpenFront development stack
- applies the exact local patch set required by the arena workflow
- launches a control room for configuring matches and slots
- supports local and remote AI backends through the UI
- keeps the repository root intentionally minimal and easy to scan

## Product Shape

- `apps/OpenFrontArena`
  The actual product: control room UI, orchestration logic, bot runtimes, and Windows launch flow.
- `.github`
  Repository policy, issue templates, and contribution metadata.
- `patches/openfrontio`
  Local patches applied on top of upstream `OpenFrontIO`.
- `scripts`
  Setup and maintenance scripts.
- `openfrontio.lock.json`
  The upstream repo source, the pinned commit, and the patch list.

The only user-facing launcher kept at the repository root is:

- [OpenFront AI Arena.cmd](./OpenFront%20AI%20Arena.cmd)

## Install Model

This repository does not commit the `OpenFrontIO` vendor checkout itself.

Instead, setup will:

1. clone upstream `OpenFrontIO`
2. checkout the exact locked commit from [openfrontio.lock.json](./openfrontio.lock.json)
3. apply the local compatibility patch set from [patches/openfrontio](./patches/openfrontio)
4. install dependencies for both `OpenFrontIO` and `OpenFrontArena`

That keeps this repository smaller, cleaner, and reproducible for testers.

## Requirements

- Windows
- Git
- Node.js and npm

## Notes

- Local LLM configuration happens in the control room UI, not through a separate launcher.
- If setup fails because a patch no longer applies cleanly, the error message tells you which patch drifted and which locked commit was expected.
- The stop helper is intentionally kept out of the root:
  `scripts/windows/Stop OpenFront AI Arena.cmd`

## Updating Upstream

If the upstream `OpenFrontIO` base needs to move later, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update-openfrontio.ps1
```

Then verify:

- the pinned commit in `openfrontio.lock.json`
- the patch set still applies cleanly
- the full install path still works from a clean checkout

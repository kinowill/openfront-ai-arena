# OpenFront Arena

OpenFront AI Arena is a local control room and match orchestration workspace for testing OpenFront matches with local AI, remote API models, native bots, and human joins from a single entry point.

## Quick start

1. Clone this repository
2. Double-click [OpenFront AI Arena.cmd](./OpenFront%20AI%20Arena.cmd)

On first run, the launcher installs the pinned `OpenFrontIO` vendor checkout automatically, applies the local patch set, installs dependencies, then starts the arena.

## What gets installed

This repository does not commit the `OpenFrontIO` vendor checkout directly.

Instead, setup will:

1. clone upstream `OpenFrontIO`
2. pin the exact locked commit from [openfrontio.lock.json](./openfrontio.lock.json)
3. apply the local compatibility patch set from [patches/openfrontio](./patches/openfrontio)
4. install dependencies for both `OpenFrontIO` and `OpenFrontArena`

That keeps this repository small while preserving compatibility with the exact engine version used during development.

## Repository layout

- `apps/OpenFrontArena`: arena app, control room UI, orchestration logic, Windows launch helpers
- `patches/openfrontio`: local patch set applied on top of upstream `OpenFrontIO`
- `scripts`: workspace setup and vendor refresh scripts
- `openfrontio.lock.json`: upstream repo URL, pinned commit, and patch list

The only user-facing launcher kept at the repository root is:

- [OpenFront AI Arena.cmd](./OpenFront%20AI%20Arena.cmd)

The stop helper stays out of the way under:

- `scripts/windows/Stop OpenFront AI Arena.cmd`

## Requirements

- Windows
- Git
- Node.js and npm

## Notes for testers

- If setup fails because a patch no longer applies cleanly, the error message will tell you which patch drifted and which locked commit was expected.
- Local LLM configuration is done from the control room UI, not from a separate launcher.
- The root is intentionally kept minimal so the repository reads cleanly on GitHub.

## Updating the vendor base

If the upstream `OpenFrontIO` base needs to move later, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update-openfrontio.ps1
```

Then verify that:

- the pinned commit in `openfrontio.lock.json` is still correct
- the patch set still applies cleanly
- the full install path still works from a clean checkout

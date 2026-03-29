# OpenFront Arena

OpenFront Arena is a local control room and match orchestration workspace for testing bots, human joins, and real OpenFront matches from a single launcher.

## Quick start

1. Clone this repository
2. Double-click [Install OpenFront Arena.cmd](./Install%20OpenFront%20Arena.cmd)
3. Double-click [Launch OpenFront Arena.cmd](./Launch%20OpenFront%20Arena.cmd)
4. Use [Stop OpenFront Arena.cmd](./Stop%20OpenFront%20Arena.cmd) when you are done

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

## Requirements

- Windows
- Git
- Node.js and npm

## Notes for testers

- If setup fails because a patch no longer applies cleanly, the error message will tell you which patch drifted and which locked commit was expected.
- Local LLM configuration is done from the control room UI, not from a separate launcher.

## Updating the vendor base

If the upstream `OpenFrontIO` base needs to move later, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update-openfrontio.ps1
```

Then verify that:

- the pinned commit in `openfrontio.lock.json` is still correct
- the patch set still applies cleanly
- the full install path still works from a clean checkout

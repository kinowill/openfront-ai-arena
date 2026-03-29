# Contributing

## Scope

This repository is the top-level workspace for `OpenFrontArena`.

- `apps/OpenFrontArena` is developed directly here
- `apps/OpenFrontIO` is treated as a pinned upstream vendor checkout
- local changes needed on top of upstream `OpenFrontIO` must be captured as patch files in `workspace/patches/openfrontio/`

## Basic workflow

1. Run `OpenFront AI Arena.cmd`
2. Make changes in `apps/OpenFrontArena`
3. If `apps/OpenFrontIO` must change, regenerate or update the patch set instead of committing the vendor checkout
4. Test locally through the control room started by `OpenFront AI Arena.cmd`

## Updating the OpenFrontIO vendor base

When the upstream dependency moves:

1. Update `workspace/openfrontio.lock.json`
2. Refresh `apps/OpenFrontIO`
3. Rebuild the patch files under `workspace/patches/openfrontio/`
4. Verify setup still works from a clean checkout

## Pull requests

Keep pull requests focused:

- one feature or one cleanup pass at a time
- mention whether `workspace/openfrontio.lock.json` changed
- mention whether the patch set changed
- include the local test path you used

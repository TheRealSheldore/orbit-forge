# UQM native battle port

Orbit Forge 0.9.58 compiles the supplied UQM C source to WebAssembly. All 25 ship modules, tactical AI, ship preprocessing, weapon callbacks, movement, gravity, and collision routines execute as C. The earlier JavaScript alien combat implementation is not called by the active battle loop.

## Build

Install Zig 0.13 (`pip install ziglang==0.13.0`), then run `python tools/build-uqm.py`. Alternatively set `ZIG` to its executable. The build uses `vendor/uqm-src.zip`, the user-supplied source archive. The archive is restored automatically from `vendor/uqm-src.zip.part*`, with its SHA-256 checked. No source download is required. Then run `python tools/build.py` to embed the module into the standalone HTML.

`uqm/process-core.c` and `status-core.c` retain selected original function bodies from `process.c` and `status.c`. The original queue, swept collision ordering, energy, crew, and callback lifecycle are retained. `bridge.c` replaces the operating-system, campaign, sound, and drawing frontends. Source ships use 16 facings and a fixed 24 Hz battle clock. A block represents 64 source world units. The original arena wraps; display positions are unwrapped around the player.

## Integration boundaries

Orbit Forge retains its own art, audio synthesis, mining, menus, encounter flow, and player weapon/loadout system. Player weapons enter the native collision world; direct beam and area hits invoke native ship collision handlers. The player uses native ship movement with movement characteristics derived from its Orbit Forge upgrades. This is a port of the alien battle engine, not a port of UQM's campaign or presentation.

Original alien crew, energy, costs, cooldowns, and special abilities come from their native descriptors. Prior Orbit Forge overrides for alien timers and movement do not control native combat. During arrival and departure, Orbit Forge supplies turn/thrust commands to the same source movement routines. Departure suppresses attacks and does not target the player.

## Source and licenses

The original source copyright notices are preserved in `vendor/uqm-src.zip`. See `vendor/UQM-COPYING.txt` for the GNU GPL v2. The source archive and the bridge sources are provided alongside the binary as corresponding source. The bridge and extracted engine sources are licensed GPL-2.0-or-later, matching the source notices.

`collision-assets.c` contains collision masks and frame/hotspot metadata generated from the official UQM 0.8 content package, not display sprites. `tools/generate-uqm-masks.py <content.uqm>` regenerates them and requires Pillow. Source: https://downloads.sourceforge.net/project/sc2/UQM/0.8/uqm-0.8.0-content.uqm . Original content is credited to Toys for Bob and the UQM contributors. No UQM music or sound recordings are embedded. See `vendor/UQM-CONTENT-NOTICE.md` for content licensing.

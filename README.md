# Orbit Forge

Current version: **0.9.69**. This folder runs directly, without compiling or bundling.

## Start playing

1. Extract the entire ZIP.
2. Install Python 3.9 or newer once, if needed: <https://www.python.org/downloads/windows/>.
3. Double-click **Start-Orbit-Forge.bat** on Windows. Keep its window open.

The launcher opens <http://127.0.0.1:8765/>. On macOS or Linux, run `sh Start-Orbit-Forge.sh`. You can also run `python tools/serve.py --open`.

Use the same address each time to keep the same browser save. The earlier downloaded HTML uses a separate browser save, which does not transfer automatically.

## Make a quick change

Open **settings/game-settings.js** in Notepad. Change a number, save, and refresh the game. Keep the commas and brackets.

| Setting | What it changes |
|---|---|
| `shipSpeedMultiplier` | Ship travel speed |
| `shipTurnMultiplier` | Ship turning speed |
| `turretTurnRate` | Turret turning speed, initially 9 |
| `weaponDamageMultiplier` | All weapon damage |
| `weaponFireRateMultiplier` | All weapon attack rates |
| `weaponUpgradeCostMultiplier` | Weapon level prices in credits |
| `planetHpMultiplier` | Planet block HP; existing damage is scaled on reload |
| `alienRecipeChance` | Recipe chance per collected alien site |
| `ringResourceChance` | Resource chance per mined ring block |

A multiplier of `1` is normal, `1.25` is 25% more, and `0.8` is 20% less. A chance of `0.33` means 33%. Existing sites do not reroll recipes after being collected. Invalid or missing numeric settings use defaults.

For other changes, edit `src/game.js` or `styles/game.css`, then refresh. Replace images and audio in `assets/`. Image and audio changes need a refresh too. No build step is required for any of these edits.

## Updates

Keep this folder as the working game. Future tweaks can replace just the changed code or settings files. You only need new media files when the artwork or audio changes. Restart the launcher only if the server code changes.

The local server disables browser caching and listens only on your own computer. Stop it with Ctrl+C or close its window. If port 8765 is busy, close an earlier Orbit Forge launcher window and try again. Do not run two copies at once.

## Portable single-file releases

Single-file HTML releases remain available. To build one from this folder:

```sh
python tools/build.py
```

It writes `dist/Orbit-Forge-v0.9.69.html`. This is optional and is only needed for a portable release.

## Files and source

| Folder | Purpose |
|---|---|
| `settings/` | Small editable balance settings |
| `src/` | Startup, game code and native combat loader |
| `styles/` | Layout and interface appearance |
| `assets/` | Ship art, weapon art, music and compiled combat engine |
| `tools/` | Launcher server, checks and release builder |
| `native/` and `vendor/` | Combat engine source, original source archive parts and licenses |

Native combat uses the UQM source and licenses described in [native/README.md](native/README.md). The corresponding native source and original source archive parts are included. Normal game edits do not require rebuilding this engine. The approved turret art is in `assets/images/player-turret-v2.png`.

# Orbit Forge

An automatic space-mining game. Build a ship, choose weapons, collect resources, research technology, meet alien ships, and earn permanent upgrades by entering new universes.

Current version: **0.9.51**.

## Play locally

From this folder, run:

```sh
python tools/prepare.py
python -m http.server 8000
```

Open **http://localhost:8000** in your browser. The preparation command joins the mining music parts without changing the audio. No package installation is needed. Progress saves in that browser. Tap the top status bar to open developer settings.

## Build a downloadable game

```sh
python tools/build.py
```

The output is `dist/Orbit-Forge-v0.9.51.html`. It includes the music, artwork, and code in one file and can be opened offline.

## Project files

| Path | Purpose |
|---|---|
| `index.html` | Game interface and media references |
| `src/game.js` | Mining, movement, weapons, combat, progression, and menus |
| `src/boot.js` | Startup status and error reporting |
| `styles/game.css` | Layout and appearance |
| `assets/music/` | Five music tracks |
| `assets/images/` | Ship and weapon artwork |
| `assets/manifest.json` | Media types used by the offline builder |
| `VERSION` | Current game version |
| `docs/` | Design and audit notes |

## Make a change

Edit the source files, run `python tools/check.py`, and playtest the affected behaviour. JavaScript syntax checks also need Node.js. Increase `VERSION` when making a new game release, add a short entry to `CHANGELOG.md`, then rebuild the downloadable HTML.

Generated `dist/` files are excluded from Git. Keep the editable sources in the repository and attach the built HTML to a release when sharing a version.

## Current gameplay

The player makes upgrade and equipment decisions while the ship mines automatically. Ten weapons have their own progression paths. Scanners reveal ores, gems, plants, creatures, and alien technology. Systems, crafting, research, trading, combat, and permanent Aether upgrades support longer runs.

Ring blocks break in one hit, award one credit, and have a ten-percent chance to drop one Copper or Silver. The first universe change unlocks at planet four.

Alien combat draws on researched Star Control II / The Ur-Quan Masters mechanics, with deliberate Orbit Forge changes. See the versioned combat audit in `docs/` for sources and differences. That audit records v0.9.47; later changes are listed in the changelog.

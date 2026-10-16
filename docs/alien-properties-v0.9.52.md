# Alien ship reference, v0.9.52

Source: https://wiki.starcontrol.com/index.php?title=Table_of_ship_properties
Verified against the ship constants in https://github.com/davidben/uqm/tree/master/src/uqm/ships .

Player mass is 4. Visual length = player length × sqrt(mass / 4). Sprite crops are normalized before scaling. This is an Orbit Forge visual rule, not an original-game mass-to-size formula. Hit areas, hull overlays and engine anchors use the same scale.

Movement uses max thrust × 0.07 blocks/s; acceleration uses thrust increment × 0.07 × 24 / (thrust wait + 1); turning uses 16 facings × a 24 Hz source clock, interpolated smoothly. Pearl Disc retains the chosen 9 blocks/s and full-tank teleport. Source constants take precedence where the wiki compresses multi-form columns or differs (Spathi mass is 5 in the source).

| Ship | Source | Mass | Length vs player | Starting / max crew | Starting / max energy | Speed (blocks/s) | Turn (rad/s) | Acceleration (blocks/s²) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Jade Caravan | Ur-Quan Kzer-Za Dreadnought | 10 | 1.58× | 42 / 42 | 42 / 42 | 2.10 | 1.88 | 1.44 |
| Obsidian Hauler | Kohr-Ah Marauder | 10 | 1.58× | 42 / 42 | 42 / 42 | 2.10 | 1.88 | 1.44 |
| Azure Bastion | Slylandro Probe | 1 | 0.50× | 12 / 12 | 20 / 20 | 4.20 | 9.42 | 100.80 |
| Silver Talon | Chmmr Avatar | 10 | 1.58× | 42 / 42 | 42 / 42 | 2.45 | 2.36 | 1.96 |
| Lattice Ark | Utwig Jugger | 8 | 1.41× | 20 / 20 | 10 / 20 | 2.52 | 4.71 | 1.44 |
| Prism Cartographer | Spathi Eluder | 5 | 1.12× | 30 / 30 | 10 / 10 | 3.36 | 4.71 | 10.08 |
| Cinder Heart | Mycon Podship | 7 | 1.32× | 20 / 20 | 40 / 40 | 1.89 | 1.35 | 2.16 |
| Tidal Manta | Orz Nemesis | 4 | 1.00× | 16 / 16 | 20 / 20 | 2.45 | 4.71 | 8.40 |
| Crystal Conclave | Chenjesu Broodhome | 10 | 1.58× | 36 / 36 | 30 / 30 | 1.89 | 1.35 | 1.01 |
| Verdant Seed | Supox Blade | 4 | 1.00× | 12 / 12 | 16 / 16 | 2.80 | 4.71 | 13.44 |
| Amethyst Reaper | Ilwrath Avenger | 7 | 1.32× | 22 / 22 | 16 / 16 | 1.75 | 3.14 | 8.40 |
| Railspine Frigate | Druuge Mauler | 5 | 1.12× | 14 / 14 | 32 / 32 | 1.40 | 1.88 | 1.68 |
| Orbital Bulwark | Melnorme Trader | 7 | 1.32× | 20 / 20 | 42 / 42 | 2.52 | 1.88 | 2.02 |
| Sunneedle Scout | Mmrnmhrm X-Form | 3 | 0.87× | 20 / 20 | 10 / 10 | 1.40 | 3.14 | 4.20 |
| Triune Voyager | Pkunk Fury | 1 | 0.50× | 8 / 8 | 12 / 12 | 4.48 | 9.42 | 26.88 |
| Spectrum Spire | Androsynth Guardian | 6 | 1.22× | 20 / 20 | 24 / 24 | 1.68 | 1.88 | 5.04 |
| Crescent Runner | VUX Intruder | 6 | 1.22× | 20 / 20 | 40 / 40 | 1.47 | 1.35 | 2.35 |
| Aether Surveyor | Earthling Cruiser | 6 | 1.22× | 18 / 18 | 18 / 18 | 1.68 | 4.71 | 1.01 |
| Ember Lance | Syreen Penetrator | 2 | 0.71× | 12 / 42 | 16 / 16 | 2.52 | 4.71 | 7.56 |
| Cobalt Scuttler | Zoq-Fot-Pik Stinger | 5 | 1.12× | 10 / 10 | 10 / 10 | 2.80 | 4.71 | 16.80 |
| Mossveil Drifter | Umgah Drone | 1 | 0.50× | 10 / 10 | 30 / 30 | 1.26 | 1.88 | 2.52 |
| Quadjet Courier | Thraddash Torch | 7 | 1.32× | 8 / 8 | 24 / 24 | 1.96 | 4.71 | 11.76 |
| Sapphire Wing | Yehat Terminator | 3 | 0.87× | 20 / 20 | 10 / 10 | 2.10 | 3.14 | 3.36 |
| Pearl Disc | Arilou Skiff | 1 | 0.50× | 6 / 6 | 20 / 20 | 9.00 | 9.42 | 67.20 |
| Ivory Wisp | Shofixti Scout | 1 | 0.50× | 6 / 6 | 4 / 4 | 2.45 | 4.71 | 8.40 |

Crew and damage in this table are raw reference units. Live encounters keep the existing universe baseline and encounter scaling. Starting crew, battery size, regeneration, primary/secondary energy costs and refire constants were checked. Lattice Ark now correctly starts with half a battery; the rest already matched the source. Alien shield bars remain disabled; interception abilities remain as designed. Existing special abilities, weapons and selected Pearl Disc rules are preserved.

Alternate forms: Sunneedle fast form uses thrust 50, increment 10, thrust wait 0, turn wait 14; Spectrum blazer uses thrust 60, increment 60, thrust wait 0, turn wait 1; Quadjet afterburner uses thrust 72.

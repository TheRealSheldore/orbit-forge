# Uploaded source and spreadsheet integration, v0.9.53

The user supplied src.zip (UQM source) and an edited ship workbook. Reference repository: https://sourceforge.net/p/sc2/uqm/ci/main/tree/ . The uploaded files were used directly because the public tree could not be fetched.

## Applied workbook edits

All 25 `Length vs player` values are now explicit size multipliers. Mass is unchanged. Jade Caravan fighter launch range is 30 blocks, and fighters return after 8 seconds. Other numeric stats matched the previous workbook. A trailing space in a weapon description has no behavioral effect.

## Source checks and movement

325 base stat fields match the uploaded source. `src/uqm/battle.h` confirms a 24 Hz battle clock and `units.h` confirms 16 facings. `ship.c` updates thrust only when its counter expires, preserves drift while rotating, and uses a special velocity correction at maximum speed rather than simply normalizing every vector. These rules are adapted into the alien flight integrator. Evasion uses that same integrator.

`ships/slylandr/slylandr.c` continually sets the Probe velocity to its facing at full speed and reverses facing on a thrust press. Azure Bastion now has that movement exception. `ships/urquan/urquan.c` sets the Dreadnought to pursue, so Jade Caravan no longer uses the generic looping attack pass.

## Preserved game choices and limits

Pearl Disc retains the selected nine blocks/s speed, no coasting and full-battery teleport. Fighters retain the chosen 12-unit cap, laser weapons, red art and trail effect, with the new eight-second return. Universe balancing, mining behavior, player weapons, no alien shield bars, and the user's size values remain Orbit Forge rules.

This is a targeted movement adaptation, not a complete port of the original AI or collision engine. The original cyborg.c uses concern evaluation and discrete combat facings, with additional decisions in every ship file. Orbit Forge still uses smooth turning, its existing combat targeting and weapon effects, and adapted special abilities. Probe lightning still uses the existing beam effect rather than the source's recursive bolt system. Source gravity slingshots and screen wrapping are not enabled in Orbit Forge combat.

## Size multipliers

1. urquan: 2.5x
2. blackurq: 2.5x
3. slylandr: 0.25x
4. chmmr: 2.5x
5. utwig: 2x
6. spathi: 1.75x
7. mycon: 1.75x
8. orz: 1x
9. chenjesu: 2.5x
10. supox: 1x
11. ilwrath: 1.75x
12. druuge: 1.25x
13. melnorme: 1.75x
14. mmrnmhrm: 0.75x
15. pkunk: 0.25x
16. androsyn: 1.5x
17. vux: 1.5x
18. human: 1.5x
19. syreen: 0.5x
20. zoqfot: 1.25x
21. umgah: 0.25x
22. thradd: 1.75x
23. yehat: 0.75x
24. arilou: 0.25x
25. shofixti: 0.25x

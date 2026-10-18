# Changelog

## 0.9.63

- Apply dense strata to planet 4 onward in all universes, with an additional 15% HP growth per planet. Migrate saved damage once.
- Give each collected alien site one 33% roll for an unknown, stage-appropriate research recipe. Exclude merchant-only plans and active research jobs.
- Apply fixed planet-based alien hull resistance in native combat, including fractional projectile and area damage. Early alien attacks are stronger; encounter variation and player upgrades determine outcomes.
- Start two-ship fleets at planet 8, then add a ship every three planets, up to eight.
- Smooth displayed combat turns and thruster intensity, and add a steering dead band to reduce rapid direction changes.

## 0.9.62

- Make planet 4 and later planets 16x tougher in the first universe, encouraging the first ascent. Later universes retain normal planet HP. Existing cleared blocks stay cleared.
- Anchor new weapon damage to 60% of the unlocking weapon's effective DPS, limiting area coverage to four targets for this comparison. Preserve each weapon's firing behaviour.
- Set the first upgrade price to 25% of the unlocking weapon's next level (minimum 75 CR), then retain 12% level growth. Acquisition costs at least four starting upgrades.
- Preview starting damage, fire rate and upgrade price. Persist acquisition values across saves; reset them on ascension.

## 0.9.61

- Show Copper/Silver drops from ring blocks, while retaining 10% chance and one resource per successful drop.
- Report cargo-full rejections and recover a valid ore name for older ring blocks.

## 0.9.60

- Hide the original red ion trail in favour of the existing blue thrusters.
- Counter momentum when piloting the player ship and match its moving target.
- Smooth displayed combat positions between native ticks.
- Track alien positions continuously in a larger arena and have distant ships fly back under thrust, without screen-wrap jumps.

## 0.9.59

- Smooth player and alien hull rotation between native combat turns, including their thrusters.
- Preserve native physics, aiming, cooldowns, collisions, and instant reversal/teleport abilities.

## 0.9.58

- Execute all 25 original UQM ship modules, tactical AI, movement, weapons, energy, and collision callbacks in WebAssembly.
- Preserve native ship defenses for player weapon hits and original secondary entities.
- Use source movement during alien arrival and departure. Remove alien hit-block graphics.
- Keep one post-battle report, then let surviving aliens leave without targeting the player.
- Include corresponding source, a reproducible native build, and attribution/license notices.

## 0.9.53

- Apply all 25 user-edited size multipliers independently of mass.
- Apply Jade Caravan fighter launch range 30 blocks and return after 8 seconds.
- Adapt timed thrust and at-speed direction changes from the uploaded UQM source.
- Give Azure Bastion its continuous flight and reversal behavior.
- Match evasion predictions to the movement integrator and make Jade Caravan pursue its target.

## 0.9.52

- Scale alien hulls, hit areas and engine plumes by source ship mass, relative to player mass 4.
- Normalize sprite lengths and use world units consistently across mining, visitors, combat and wrecks.
- Apply source turn waits, thrust increments and thrust waits, including alternate forms.
- Start Lattice Ark with 10 of 20 energy; retain Pearl Disc speed and full-tank teleport.
- Predict evasive movement using each alien ship's actual acceleration and size.

## 0.9.51

- Ring blocks break in one hit and award exactly one credit.
- Each ring block has a ten-percent chance to drop one Copper or Silver.

## 0.9.50

- Reduced early resource yields and capped alien-tech finds at two pieces.
- Reduced ring and encounter resource rewards.
- Adjusted starter system recipes for the lower resource supply.
- Moved the first universe change to planet four, with permanent boosts available afterwards.

## 0.9.49

- Added inventory dumping with 1, 10, 100, 1000, and MAX quantities.
- Added free cargo-space display.

## 0.9.48

- Increased Supernova targeting range from four to five blocks.

## 0.9.47

- Audited all 25 alien ships against original source mechanics.
- Corrected primary attacks, energy use, recharge, and secondary abilities.
- Added distinct projectile sprites and beam effects.

## 0.9.46

- Gave ships individual sprite boundaries to remove neighbouring artwork fragments.

## 0.9.45

- Added incoming-projectile prediction and evasive combat steering.

## Repository preparation

- Split the existing v0.9.51 HTML into editable code, styles, and media files.
- Added a builder that recreates the original standalone HTML.
- Added local reference and JavaScript syntax checks.


# Changelog

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

# Encounter controls and weapon phases, v0.9.56

## Reproduced failures

A complete 15-second encounter loop with the moving mining ship and incoming player fire exposed four primaries which could remain unused in v0.9.55: Silver Talon, Cinder Heart, Amethyst Reaper and Orbital Bulwark. The earlier direct firing checks bypassed tactical movement and did not catch these failures. Obsidian and Azure did move and fire in the simulation, but their weapon behavior and Azure propulsion display were wrong.

## Changes

Ready forward weapons get an aiming opportunity while the hull coasts. Low-speed coasting can resume thrust. Close-range flamers and cones pursue into their own weapon envelope rather than retreat at a generic distance. Tractor use leaves energy for the beam. Source costs, ship sizes and hull mass stay unchanged.

Obsidian blades now have flight, braking and tracking stages, replacing the instant jump to fast homing. Launch speed is source MISSILE_SPEED 64 times the established world conversion 0.07, or 4.48 blocks/s. Release halves the source 64-frame lifetime, braking halves velocity per 24 Hz tick, parked tracking updates every five ticks at 0.56 blocks/s within 2.613 blocks. Eight-blade cap, damage 4, energy 6 and seven-tick refire remain. The fire ring responds to close danger or a shot due within eight ticks. Automatic release is an Orbit Forge adaptation of the source held-button and PlotIntercept decisions.

Azure remains a constant-speed Probe, with reversals rather than ordinary acceleration. Its previously empty exhaust assignment is represented by a blue energy wake at the main orb. Like source slylandro_intelligence in story encounters, it does not abandon its attack for every projectile. Lightning grows over eight segments, damages only when a segment reaches the player, and has a two-energy launch cost and 18-tick refire. This segment animation is an adaptation, not a literal port of the source recursive random lightning. Existing harvest rocks are still drawn and used for battery refill.

Pearl Disc also had a shared threat-window problem: a distant incoming shot could reserve its full battery for teleportation and indefinitely block its laser. Teleport decisions now use the source six-tick danger window, and primary energy reservation only applies to a threat within three ticks. Its full-energy teleport requirement is preserved.

## Validation and limits

The regression suite now runs all 25 ships through the actual stepMerchant encounter loop for 15 simulated seconds each, including player navigation, incoming fire, actors, projectile/hull contact, energy and tactical decisions. It asserts movement, thrust, primary attacks and valid energy. It also checks blade braking/slow tracking and lightning travel before damage, plus existing geometry, firing and sustained-hit tests. Rendering calls are suppressed only during the long logical encounter checks; separate existing draw checks remain. Randomness is seeded for repeatability. Run node tools/test-combat.cjs and python3 tools/check.py.

These checks demonstrate that controls execute in complete encounters. They do not prove that every alien tactic or visual matches UQM. Existing smooth turning, in-place planet combat, weapon artwork and several adapted secondary abilities remain. A local browser was unavailable, so no visual browser playtest is claimed.

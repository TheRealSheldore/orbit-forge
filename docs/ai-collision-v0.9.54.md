# Combat AI and collision, v0.9.54

The uploaded UQM source is the behavior reference: uqm/cyborg.c, uqm/ship.c, uqm/collide.c, uqm/weapon.c, and the 25 ships/* intelligence functions. This is an adaptation to Orbit Forge world units and combat, not a binary-compatible port.

## AI

Pursue, entice, coast, and avoid decisions replace the universal approach/break loop. Facing and thrust are separate controls. Coasting preserves velocity while the ship rotates to aim. Threats are predicted from relative projectile motion. Race-specific decision rules cover fighter deployment, defensive interception, rear missiles, healing, marines, drainers, cloaking, recoil, charge weapons, transformations, ramming, limpets, point defense, crew collection, tongue, reverse thrust, afterburners, teleportation and self-destruction. Straight weapons check predicted target clearance before spending energy. Existing source energy costs and 24 Hz thrust cadence remain.

## Collision

Embedded silhouettes come from the displayed ship-atlas alpha channel, averaged into four-pixel cells at alpha 96. The collision transform matches sprite origin, scale, rotation and alternate-form stretch. It is a sampled silhouette, not exact native sprite-mask intersection. Crew target points now lie inside those silhouettes. Existing encounters migrate their crew distribution without resetting progress.

Relative movement and rotation are swept for projectile hits. Earliest hull or fighter contact wins. Destroyed projectiles cannot hit again. Ordinary hull contact separates overlaps and exchanges momentum using mass, with player mass 4, while preventing ordinary contact crew damage. Moving hulls receive an additional contact sweep. Defensive projectile interception cannot occur through a nearer hull. Directed beam checks use the player silhouette. Area effects retain one damage application per affected ship.

## Preserved choices

All edited size multipliers, Pearl Disc speed and teleport requirement, Jade fighter range 30 / attack time 8 seconds, mining behavior, source energy tables, in-place combat and save data. Planets remain background during combat. No arena gravity or wrapping is introduced. Smooth turning, Orbit Forge weapon effects, sampled collision masks, AI distance thresholds and existing secondary mechanics remain adaptations rather than a literal full UQM simulation.

## Validation

Run python3 tools/check.py and node tools/test-combat.cjs. The headless regression suite exercises combat and drawing for all 25 ships, atlas scale ratios, source thrust, Probe reversal, frame cadence, target points inside rotated silhouettes, fast projectile sweeps, empty-space misses, mass-based momentum conservation, contact separation, and coasting without sideways acceleration. This does not replace device playtesting or visual review on a phone.

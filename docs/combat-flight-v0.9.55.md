# Combat flight and attack corrections, v0.9.55

Compared against uploaded UQM cyborg.c Pursue, ThrustShip and ship_intelligence, ship.c thrust timing and the existing projectile definitions.

Fixed thrust being applied while facing away from the navigation course. Turn and coast preserve momentum. Approach, coast and withdrawal now use separated distance thresholds, avoiding rapid direction changes at the edge of weapon range. Evasion predicts approaching shots only, respects projectile expiry, chooses the earliest threat, and commits to a dodge for 0.4 seconds instead of choosing a different side each frame. Concern evaluation occurs once per ship step.

Aiming solves interception using the actual projectile speed. Beam weapons aim at current positions; homing weapons retain tracking. Navigation uses projectile lifetime to avoid waiting outside the weapon's reachable distance. Fixed the nonexistent mainCost field to mainEnergy, restoring plasma primary firing and low-energy secondary decisions. Failed aim or energy checks retry at 24 Hz without consuming a full firing cooldown. Successful shots retain their source cadence and cannot accumulate a catch-up burst.

Tests now include all 25 primary firing checks, receding and expired threat rejection, a moving-target interception calculation, thrust suppression while turning away, and sustained 20-second fights checking both shots and actual hull hits for five weapon families. Existing collision, scale, source thrust and simulation checks remain. Headless tests do not establish visual equivalence with the original game. Device playtesting is still required for feel and ship-by-ship tuning.

Preserved ship sizes, source base stats, energy costs, Jade fighters, Pearl Disc's chosen movement exception, mining flight, art, progress and saved games. This remains an adaptation of UQM behavior rather than a complete native engine port.

# Orbit Forge v0.9.47: Alien combat audit

Audited against the original ship implementations and the shared ship/status code in The Ur-Quan Masters. This is an adaptation for Orbit Forge, not a frame-perfect port.

## Primary attacks

Damage below is in original crew units. Orbit Forge applies its universe/fleet damage scale afterwards. Energy costs remain literal battery units. Minimum refire time is `(WEAPON_WAIT + 1) / 24` seconds. Actual fire also depends on aiming, energy, weapon state, and AI decisions.

| Orbit Forge ship | Original ship | Attack | Damage per projectile/hit | Energy per trigger | Minimum refire | Tank | Recharge |
|---|---|---|---:|---:|---:|---:|---|
| Jade Caravan | Ur-Quan Kzer-Za Dreadnought | Forward fusion bolt | 6 | 6 | 0.292 s | 42 | +1 every 0.208 s, after the last energy change |
| Obsidian Hauler | Kohr-Ah Marauder | Held razor blade, then homing mine | 4 | 6 | 0.292 s | 42 | +1 every 0.208 s, after the last energy change |
| Azure Bastion | Slylandro Probe | Tracking lightning burst | 1 | 2 | 0.750 s | 20 | None |
| Silver Talon | Chmmr Avatar | Forward X-ray beam | 2 | 2 | 0.042 s | 42 | +1 every 0.083 s, after the last energy change |
| Lattice Ark | Utwig Jugger | Six parallel cannon shots | 1 each | 0 | 0.333 s | 20 | None |
| Prism Cartographer | Spathi Eluder | Forward cannon | 1 | 2 | 0.042 s | 10 | +1 every 0.458 s, after the last energy change |
| Cinder Heart | Mycon Podship | Homing plasma, weakens with age | 10 | 20 | 0.250 s | 40 | +1 every 0.208 s, after the last energy change |
| Tidal Manta | Orz Nemesis | Rotating-turret shell | 3 | 6 | 0.208 s | 20 | +1 every 0.292 s, after the last energy change |
| Crystal Conclave | Chenjesu Broodhome | Crystal, splits into 8 shards | 6 | 5 | 0.042 s | 30 | +1 every 0.208 s, after the last energy change |
| Verdant Seed | Supox Blade | Green globule | 1 | 1 | 0.125 s | 16 | +1 every 0.208 s, after the last energy change |
| Amethyst Reaper | Ilwrath Avenger | Short flame stream | 1 | 1 | 0.042 s | 16 | +4 every 0.208 s, after the last energy change |
| Railspine Frigate | Druuge Mauler | Heavy slug with recoil | 6 | 4 | 0.458 s | 32 | +1 every 2.125 s, after the last energy change |
| Orbital Bulwark | Melnorme Trader | Charge orb: 2 / 4 / 8 / 16 damage | 2 / 4 / 8 / 16 | 5 | 0.083 s | 42 | +1 every 0.208 s, after the last energy change |
| Sunneedle Scout | Mmrnmhrm X-Form | Twin lasers; fast form twin missiles | 1 each | 1 | 0.042 s | 10 | +2 every 0.292 s, after the last energy change |
| Triune Voyager | Pkunk Fury | Forward and two sideways pellets | 1 each | 1 | 0.042 s | 12 | None |
| Spectrum Spire | Androsynth Guardian | Wandering homing bubble | 2 | 3 | 0.042 s | 24 | +1 every 0.375 s, after the last energy change |
| Crescent Runner | VUX Intruder | Forward green cutting beam | 1 | 1 | 0.042 s | 40 | +1 every 0.375 s, after the last energy change |
| Aether Surveyor | Earthling Cruiser | Accelerating homing missile | 4 | 9 | 0.458 s | 18 | +1 every 0.375 s, after the last energy change |
| Ember Lance | Syreen Penetrator | Forward particle projectile | 2 | 1 | 0.375 s | 16 | +1 every 0.292 s, after the last energy change |
| Cobalt Scuttler | Zoq-Fot-Pik Stinger | Random-spread spit pellet | 1 | 1 | 0.042 s | 10 | +1 every 0.208 s, after the last energy change |
| Mossveil Drifter | Umgah Drone | Continuous antimatter cone | 1 | 0 | 0.042 s | 30 | +30 after 6.292 s without resetting recharge |
| Quadjet Courier | Thraddash Torch | Thin cannon bolt | 1 | 2 | 0.542 s | 24 | +1 every 0.292 s, after the last energy change |
| Sapphire Wing | Yehat Terminator | Twin cannon shots | 1 each | 1 | 0.042 s | 10 | +2 every 0.292 s, after the last energy change |
| Pearl Disc | Arilou Skiff | Auto-aim short laser | 1 | 2 | 0.083 s | 20 | +1 every 0.292 s, after the last energy change |
| Ivory Wisp | Shofixti Scout | Forward dart | 1 | 1 | 0.167 s | 4 | +1 every 0.417 s, after the last energy change |

## Secondary abilities

| Ship | Corrected rule |
|---|---|
| Jade Caravan | 8 energy and 2 crew per pair. Maximum 12 fighters. Fighter laser: 1 damage, 9/24 s refire, no parent energy per laser. Survivors return after five seconds and restore committed crew. |
| Obsidian Hauler | 21 energy emits 16 expanding gas clouds. Each cloud deals 3 damage. Minimum activation interval 10/24 s. |
| Azure Bastion | No passive regeneration. Nearby loose space debris restores the full 20-energy tank at zero cost. Harvest cooldown 21/24 s. Mineable planet blocks are untouched. |
| Silver Talon | Tractor costs 1 energy per 1/24 s while used. Three automatic satellites cost no launch energy, have 10 HP each, and fire point-defence lasers every 3/24 s. |
| Lattice Ark | Source absorption shield is adapted to projectile interception. Activation costs 1 energy, minimum interval 13/24 s, and intercepted damage replenishes the tank. |
| Prism Cartographer | Rear B.U.T.T. homing missile costs 3 energy and deals 2 damage. Minimum interval 8/24 s. Launches backwards, not from the front. |
| Cinder Heart | 40 energy restores four crew units. AI saves a full tank when damaged. Ordinary homing plasma starts at 10 damage, not the previous 12. |
| Tidal Manta | Rotating turret uses no energy. Each boarding marine commits 1 crew, has 3 HP, and costs no energy. Maximum 8. Launch interval 13/24 s; boarded marines damage crew on a timer. |
| Crystal Conclave | A D.O.G.I. costs the entire 30-energy tank and has 3 HP. Maximum 4. Source hit drains 10 battery energy; here it interrupts player weapon recharge for 1.25 seconds because the mining loadout has no shared battery. |
| Verdant Seed | Lateral and reverse thrust are free. The original source comments out the apparent 1-energy movement charge. AI uses lateral movement for evasion. |
| Amethyst Reaper | Cloaking costs 3 energy. It persists until firing reveals the ship. Minimum activation interval 14/24 s. |
| Railspine Frigate | Burning one crew restores 16 energy; it does not cost 16 energy. Minimum interval 31/24 s. Mass-driver recoil is retained. |
| Orbital Bulwark | Confusion projectile costs 20 energy, does no direct damage, and disrupts steering/aim on contact. Charge orb costs 5 once, then charges every 72/24 seconds with regeneration suspended. |
| Sunneedle Scout | Transformation costs a full 10-energy tank. Slow form fires two red lasers for 1 energy total; fast form fires two homing missiles for 1 energy total. Fast form refire is 21/24 s and regenerates one energy per 7/24 s. |
| Triune Voyager | Taunt restores 2 energy every 17/24 s. There is no passive regeneration. The existing 50% resurrection rule remains. |
| Spectrum Spire | Blazer requires at least 2 energy to enter but does not deduct a separate entry cost in the source. It drains 1 energy per 9/24 s, prevents bubble fire, and deals 3 damage on ramming contact. |
| Crescent Runner | Homing limpet costs 2 energy and does zero direct damage. Each hit slows player movement/turning. Minimum interval 8/24 s. |
| Aether Surveyor | Point defence costs 4 energy per activation and attacks nearby projectiles or the player with a white laser. Minimum interval 10/24 s. |
| Ember Lance | Crew call costs 5 energy, with a 21/24 s minimum interval. Crew loss falls with distance, never takes the final crew member, and produces collectible crew pods. Starts at 12 crew, with capacity for 42. |
| Cobalt Scuttler | Tongue costs 7 energy, deals 12 damage, and needs close range and alignment. Minimum interval 7/24 s. |
| Mossveil Drifter | Reverse zip costs 1 energy every 3/24 s. Recharge restores all 30 energy after 151/24 s of uninterrupted recharge time. AI temporarily stops firing and retreats to recharge. |
| Quadjet Courier | Afterburner costs 1 energy per 1/24 s and leaves fire hazards. Each hazard deals 2 damage on contact and lasts 48/24 s. |
| Sapphire Wing | Source shield is adapted to projectile interception. Activation costs 3 energy, minimum interval 3/24 s, with a 10/24 s interception window. |
| Pearl Disc | Original teleport costs 3. Your chosen rule remains: needs and consumes the full 20-energy tank. Phasing lasts 5/24 s. AI reserves energy after jumping. Pearl Disc still has no inertia and uses a five-block laser range. |
| Ivory Wisp | Glory device costs no energy, destroys its own ship, and has up to 18 source damage, decreasing with distance. AI arms it when badly hurt and close to the player. |

## Deliberate Orbit Forge differences

Alien ships have no shield bars or blanket shield immunity. The two original shield ships instead intercept incoming projectiles using their source energy costs. This keeps your earlier no-shields rule.

Pearl Disc keeps the full-tank teleport, nine-blocks-per-second movement, five-block laser range, and no inertia. Jade Caravan keeps the 12-fighter limit, five-second fighter return, small red fighter graphics, and three-second exhaust trails.

World distances, projectile sizes, and ship movement speeds are rescaled for Orbit Forge. Damage and crew still scale with encounter difficulty. Beam aiming and projectile steering use continuous angles rather than the original fixed facings. Probe lightning is a readable tracking burst rather than an exact recreation of its recursive segments. D.O.G.I. battery drain becomes a recharge interruption for the player’s mining weapons. Marine boarding is simplified to timed crew damage with a chance of being repelled.

## Graphics

Twenty-five new transparent weapon sprites are embedded in the HTML. Missiles, razor blades, plasma, shells, crystals, bubbles, limpets, globules, and charged-orb stages have distinct silhouettes. Lightning, lasers, tongue, and tractor effects retain animated beam graphics. Each sprite has its own crop boundary. Projectile graphics scale with map zoom. The player’s mining weapon art is preserved.

## Validation

131 isolated checks cover primary energy costs, empty tanks, recharge ticks, secondary budgets, crew commitments, launch caps, charge stages, and full-tank teleporting. All 25 AIs passed fifteen-second simulations. All 25 ships also ran in the complete browser game without script errors. These checks verify implementation; further playtesting is needed to judge balance and tactical feel.

## Sources

The original implementations are linked below. Energy changes and recharge-counter behaviour were also checked in [status.c](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/status.c), and refire counters in [ship.c](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ship.c).

- [Ur-Quan Kzer-Za Dreadnought](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/urquan/urquan.c)
- [Kohr-Ah Marauder](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/blackurq/blackurq.c)
- [Slylandro Probe](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/slylandr/slylandr.c)
- [Chmmr Avatar](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/chmmr/chmmr.c)
- [Utwig Jugger](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/utwig/utwig.c)
- [Spathi Eluder](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/spathi/spathi.c)
- [Mycon Podship](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/mycon/mycon.c)
- [Orz Nemesis](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/orz/orz.c)
- [Chenjesu Broodhome](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/chenjesu/chenjesu.c)
- [Supox Blade](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/supox/supox.c)
- [Ilwrath Avenger](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/ilwrath/ilwrath.c)
- [Druuge Mauler](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/druuge/druuge.c)
- [Melnorme Trader](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/melnorme/melnorme.c)
- [Mmrnmhrm X-Form](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/mmrnmhrm/mmrnmhrm.c)
- [Pkunk Fury](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/pkunk/pkunk.c)
- [Androsynth Guardian](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/androsyn/androsyn.c)
- [VUX Intruder](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/vux/vux.c)
- [Earthling Cruiser](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/human/human.c)
- [Syreen Penetrator](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/syreen/syreen.c)
- [Zoq-Fot-Pik Stinger](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/zoqfot/zoqfot.c)
- [Umgah Drone](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/umgah/umgah.c)
- [Thraddash Torch](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/thradd/thradd.c)
- [Yehat Terminator](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/yehat/yehat.c)
- [Arilou Skiff](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/arilou/arilou.c)
- [Shofixti Scout](https://raw.githubusercontent.com/davidben/uqm/master/src/uqm/ships/shofixti/shofixti.c)

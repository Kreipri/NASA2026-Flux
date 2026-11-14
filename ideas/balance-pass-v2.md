# Balance Pass v2: day-based loop (2026-11-14, session 2)

**Status:** decided (D-019), from Bea's first terminal playtest. Supersedes the turn structure and job table in `balance-pass-v1.md` (v1 stays for history). All numbers are game numbers (SIMULATED); live values in `src/config/moon.json`.

## What Bea's playtest found, and the fix
| Problem | Fix |
|---|---|
| Can't tell which jobs serve the goal vs keep you alive | Menu grouped: **MISSION GOAL** (each job tagged LIGHT / RADIATION / SHELTER / ICE), **KEEP THE BASE ALIVE**, **KEEP THE CREW SAFE**. Report card with stars and "to do" hints is on screen every day. Science points removed (two scores were confusing). |
| 2 jobs per shift wastes time on small tasks | **1 turn = 1 day** with **8 crew time** (4 astronauts x morning + afternoon). Jobs cost 1, 2 or 4. Unused time rests the crew. |
| Can't see crew endurance | **STAMINA** meter. Work tires the crew (outside work 4x more than inside); sleep + daily exercise restore +10. Stamina sets tomorrow's crew time: 50%+ = 8, 25-49% = 6, under 25% = 4. |
| No idea how to recover from a power emergency | Emergency box says exactly how: wait for sun (countdown shown), clean dust (allowed in emergency, needs no power), rest. New **Power-saving mode** job halves base power use (crew gets cold). |

## Crew: is it a team or one person? (verified)
- NASA's first planned landing (Artemis IV, early 2028): **two astronauts** go down to the surface for about a week near the south pole while the rest of the crew stays in lunar orbit. [nasa.gov/mission/artemis-iv/]
- NASA's 2020 Base Camp concept: a habitat for **up to four astronauts for a month**, with power storage for **up to eight days** because "no single location ... avoids periods of darkness". [nasa.gov/blogs/artemis/2020/10/28/lunar-living-nasas-artemis-base-camp-concept/]
- Space Station crews are scheduled for **2.5 hours of exercise a day** (that's why exercise is built into the day, not a job). [nasa.gov FAQ: the real story about astronaut health care in space]
- Plus a big team on Earth: Mission Control, forecasters, the radiation group (already in SunWatch, D-012).
- **Game choice (FICTION, labeled):** you command a crew of **4** (you + engineer, doctor, geologist), matching the Base Camp concept, at a later permanent base. Not the first landing. "Outside jobs use astronauts in pairs" is a game rule that matches the two-person surface crew; no NASA buddy rule was verified.

## Per day (background)
| Effect | Value | Note |
|---|---|---|
| Solar, sunny / short eclipse / long shadow | +60 / +30 / 0 | dust -10 per level (0-3), jammed panel -20 |
| Base upkeep | -20 power (power-saving or emergency: -10) | full battery = 5 days with no jobs (~120 h; real worst case at the rim 73-117 h, Base Camp plans 8 days) |
| Breathing | -8 oxygen | |
| Background radiation | +2 dose | |
| Stamina | +10, minus 1 per inside crew time, 4 per outside, plus 3 per unused, -10 if cold | |
| Dust | +1 every 2 days, +1 per rover trip | |

## Jobs (crew time / costs / gives)
| Group | Job | Time | Costs | Gives |
|---|---|---|---|---|
| GOAL | Log sunlight & shadows | 1 | pwr -2 | LIGHT (log while dark = rare star) |
| GOAL | Measure radiation | 1 | pwr -4 | RADIATION (in a storm = star + real CRaTER reading) |
| GOAL | Scout with hop-drone | 1 | pwr -15 | ICE odds +25% (max 80%) |
| GOAL | Rover to dark crater | 4 | pwr -50, O2 -8, dose +4, outside | ICE: 30% base chance |
| GOAL | Pile soil on shelter | 4 | pwr -10, O2 -4, dose +2, outside | SHELTER level +1 (~1 m soil) |
| ALIVE | Clean dust off panels | 2 | O2 -2, dose +1, outside | full solar again (allowed in emergency) |
| ALIVE | Tune the air system | 1 | pwr -20 (-6 per ice sample, min -8) | oxygen +30 |
| ALIVE | Repair a fault | 2 | pwr -10 | fixes jammed panel or clogged scrubber |
| ALIVE | Power-saving mode | 1 | stamina -10, no drone or meter today | base uses 10 instead of 20 |
| SAFE | Shelter during peak | 4 | (pwr +5) | storm dose 5/4/2/1 by shelter level vs 10 in the habitat. Counts for SHELTER |
| SAFE | Rest day (2 crew) | 2 | O2 -1 | stamina +20 |
| SAFE | Call Mission Control | 1 | pwr -5 | 2-day storm forecast (not when Earth link is down) |

Removed: "Collect rock samples" and "Send daily report" (they only fed science points, which are gone). Storm dose outside: +8 per outside crew time on a storm day (half when the storm is still building).

## Report card (the goal, 12 stars)
- LIGHT: 2 sun logs / a log while dark / power never ran out
- RADIATION: 1 measurement / one during a storm / 3 measurements
- SHELTER: sheltered in a storm / shelter level 1+ / final dose under 50%
- ICE: 1 trip = 1 star, 1 ice = 2, 2 ice = 3

## Timeline (full, 14 days)
Flare alert day 6 (real May 8 X-class flares), real storm days 7-8 (May 9 building, May 10 strong), long shadow days 9-10 or 9-11, comms drop days 11-12 with a simulated storm (onboard alarm only), 2 random short eclipses.

## Sim results (500 seeded games per bot)
| Bot | Done | O2 fail | Dose fail | Had emergency | Stars /12 |
|---|---|---|---|---|---|
| Careful | 100% | 0 | 0 | 5% | 10.7 |
| Greedy (blind trips, never cleans) | 25% | 67% | 9% | 100% | 6.8 |
| Reckless (ignores storms) | 62% | 0 | 38% | 100% | 8.4 |
| Idle (inside jobs only) | 89% | 11% | 0 | 100% | 5.3 |
| Random clicks | 14% | 68% | 18% | 94% | 6.4 |

**Sim-driven tweaks:** emergency no longer speeds up oxygen loss (backup oxygen; the cost is cold = stamina -10/day), upkeep 24 -> 20 so the battery covers the long shadow.

**Watch in playtests:** random clicking still fails 86%. Real kids read warnings, but if first-time players keep failing on oxygen, make low-oxygen warnings louder before changing numbers. Reckless still collects lots of ice, so the dose limit is what stops them; check the debrief explains that.

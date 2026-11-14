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
| GOAL | Pile soil on shelter | 4 | pwr -10, O2 -4, dose +2, outside | SHELTER level +1. Text says crew run a digging machine; levels are a game scale for NASA's ~3 m design (real work = machines, many days, tonnes of soil) |
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

## Open accuracy item: shelter levels (proposed, not built)
Thick soil matters most against cosmic rays (every day), while thin shielding already cuts solar storm particles. Today levels only help on storm days. Option: level 1 gives most of the storm protection; levels 2-3 also shave everyday background dose. Needs Bea's OK; would change balance.

---

# 7-day mission addendum (D-020, 2026-11-14)
Default game is now `week` (7 days). `full` (14 days) and `slice` remain for comparison.

**Objective:** SITE APPROVED = 11+/12 stars, 1+ per question, crew healthy. GOLD = 12.

**Changed star rules:** ICE = rover sample / drone map + sample / ice found or 2 samples. RADIATION 3rd star = 4 measurements. SHELTER 3rd star = final dose under 25%. Ice no longer discounts the air system.

**Week timeline:** short eclipse maybe day 1-2; flare alert day 2; storm days 3-4 (real data); long shadow days 5-6; Earth below horizon days 5-7; 50% chance of an unannounced simulated storm on day 6 or 7. Start power 60, oxygen 70.

**How we tuned the challenge (sim, 1,000 games per bot):**
| Win rule | Planner | Careful | Others |
|---|---|---|---|
| 8 stars | 100% | 100% | reckless 83% |
| 10 stars | 100% | 94% | 0% |
| **11 stars (chosen)** | **81% (gold 30%)** | **61%** | **0%** |

Why 11: a player who plans for the dark usually wins, a careful one about 3 in 5, careless styles never. Main trade-off found by the sim: the crater trip vs keeping power through the dark. Even the careful bot runs out of power when it goes too late.

**Watch:** 11/12 may feel strict for a 7-year-old's first run. If playtests show frustration, keep 11 for "approved" but add a "PROMISING" result at 9-10 so a near-miss still feels like progress.

## Tiers + stamina (D-021)
| Bot (1,000 games) | Promising+ | Approved+ | Gold | Dose under 25% | Lowest stamina |
|---|---|---|---|---|---|
| Planner | 100% | 81% | 30% | 100% | 63 |
| Careful | 100% | 61% | 0% | 76% | 63 |
| Greedy / reckless / idle / random | 0% | 0% | 0% | 0-50% | 37-100 |
Not-proven usually means "never sheltered" or "never went to the crater". Stamina now limits heavy outside work rather than everyday play.

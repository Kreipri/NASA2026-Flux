# Balance Pass v1: action costs (2026-11-14, session 2)

**Status:** proposed v1 numbers for playtest. Every number here is a **game number** (badge `[~ SIMULATED]` or `· scaled for the game`). The "Grounding" column says which real fact the *direction and ratio* come from; facts are in `ideas/research-setting-facts.md` (verification pass). Nothing here claims NASA uses these values.

## 1. Units and pacing
- **Meters 0-100.** Power = battery charge. Oxygen = air reserve. Dose = % of the *mission dose plan* used (fail at 100). Science feeds the report card.
- **Pacing (changed, proposed):** 14 days x **2 shifts** (12 h each) = **28 turns**, 2 crew slots per turn = 56 actions. At ~30 s a turn that's ~15 min, right for ages 7-12. The old "3-4 shifts a day" = 42-56 turns, too long for one sitting.
- **Crew time:** 2 slots per shift. Big jobs take both slots. **Fatigue:** 6 shifts (3 days) without Rest = only 1 slot next shift (shown as a sleepy crew icon, not a 5th meter).

## 2. Background per shift (happens without any action)
| Effect | Value / shift | Grounding |
|---|---|---|
| Solar charge, sun up | **+30** | Ridge sunlit most of the year (rim points >90%, ridge 76-89% avg) |
| Solar charge, eclipse | **0** | Ridge goes dark for hours to days |
| Dust on panels | **-5 solar per dust level** (0-3). +1 level every 4 shifts and after each crater trip | Dust clings (static), clogs mechanisms |
| Base upkeep (air, heat, comms) | **-12 power** | Air making = electrolysis of water, needs power (ISS ECLSS) |
| Breathing | **-4 oxygen** | Crew use oxygen constantly |
| Background radiation, inside | **+1 dose** | No magnetic field or air on the Moon |

**Battery check:** 100 power / 12 per shift = ~8 shifts (~96 h) in the dark with no jobs. Real worst-case storage need at the Shackleton rim: **73-117 h** (NTRS 2007, verified). So the battery is sized like the real problem: a long shadow is survivable only if you charge up first and stop spending.

**Start:** Power 80, Oxygen 90, Dose 0, Science 0, Dust 0, Shelter level 0.

## 3. Action table (13 pickable + 1 event choice)
Slots = crew time. Negative = cost. Every action costs a slot **plus** at least one meter (except Shelter in place, which costs the whole shift; see notes).

| # | Group | Action | Slots | Power | O2 | Dose | Gives | Grounding | Badge |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Keep alive | Clean dust off panels and seals | 1 | 0 | -2 (airlock) | +1 (outside) | Dust -> 0 (solar back to +30), fewer seal faults | REAL: dust clings, wears seals | SIM numbers |
| 2 | Keep alive | Tune air system | 1 | **-10** (-3 per ice sample, min -4) | **+15** | 0 | Air reserve up | REAL: ISS makes O2 by splitting water with power | SIM |
| 3 | Keep alive | Repair a fault | 1 | -5 | 0 | 0 | Clears fault (panel fault: solar -10; scrubber fault: O2 -3 extra/shift) | GAME | SIM |
| 4 | Stay safe | Pile regolith on shelter | **2** | -5 (digger) | -2 | +2 (outside) | Shelter level +1 (max 3, "1 m per level") | REAL: ~3 m regolith shields from cosmic rays and solar protons (NTRS 2012) | SIM, scaled |
| 5 | Stay safe | Shelter in place | **2** | +3 (less use) | 0 | storm rate by shelter level | Lowest dose this shift. No science | REAL: SRAG advice, shelter in most shielded area | SIM |
| 6 | Stay safe | Rest or exercise | 1 | 0 | -1 | 0 | Resets fatigue | REAL: OSDR bone/muscle studies (mostly mice, say so) | SIM |
| 7 | Explore | Rover to the dark crater | **2** | **-35** (heaters, batteries only) | -5 (suits) | +4 quiet / **+20 storm** | Ice roll. Ice = **+25 science**, no ice = +8 ("mapped where not to look"). Dust +1 | REAL: ice in PSRs, -414 F, no sunlight | SIM |
| 8 | Explore | Scout with hop-drone | 1 | -10 | 0 | 0 | Next trip ice odds +25% (max +50%), +3 science | REAL: JPL MoonFall hop-drones planned | SIM |
| 9 | Explore | Log sunlight and eclipse | 1 | -1 | 0 | 0 | +4 science, **+10 if logged during an eclipse** | REAL: ridge lighting studies drive site choice | SIM |
| 10 | Explore | Measure radiation | 1 | -2 | 0 | 0 | +4 science, **+10 during a storm** + learn card with real CRaTER values | REAL: CRaTER/LRO data | ARCHIVE for the real values |
| 11 | Explore | Collect rock and dust samples | 1 | 0 | -2 | +1 | +6 science | GAME | SIM |
| 12 | Talk to Earth | Call Mission Control | 1 | -3 | 0 | 0 | SunWatch shows storm risk for next 2 shifts; eclipse forecast for 3 days | REAL: SRAG / Mission Control advise crews | SIM |
| 13 | Talk to Earth | Send daily report | 1 | -3 | 0 | 0 | +5 science (only if Earth link up) | GAME | SIM |
| E | Event choice | **Come back early / finish the trip** (was "Delay or end a spacewalk") | - | - | - | back: no storm dose, half science / finish: +20 dose | Shown only when a storm alert hits during a crater trip | REAL: SRAG advice to delay/end EVA | SIM |

**Change proposed:** "Delay or end a spacewalk" becomes an event prompt (E), not a menu button. It only makes sense mid-trip, and it trims the menu to 13.

## 4. Ice odds (the uncertain prize)
- Base chance per crater trip: **30%**. Grounding: NTRS (LCROSS/Cabeus) estimates **20-40% of the Cabeus floor may be "wet"**, so a blind trip is roughly a 1-in-3 shot. Ratio is real, the dice are SIMULATED.
- Each scout: +25%, max 80%. Ice samples count max 2 for the air-system discount.
- Seeded random so a run can be replayed for judges.

## 5. Radiation storms
Storm dose per shift (storm lasts 2-3 shifts, 2 storms per run: the scripted May 2024 replay + 1 random archived storm):

| Where the crew is | Dose / storm shift |
|---|---|
| Outside (crater trip, cleaning, piling) | **+20** |
| Inside habitat, no shelter | +8 |
| Shelter in place, level 0 (stowage-bag style) | +4 |
| Level 1 / 2 / 3 regolith | +3 / +2 / +1 |

- Real ratio vs game ratio: CRaTER in lunar orbit rose ~600x (5 -> ~3,150 uGy/h) in May 2024. The game uses ~8-20x so the meter stays readable. Label `[✓ NASA RadLab · ARCHIVE May 2024 · scaled for the game]` and show the real numbers on the learn card.
- The 100 on the dose meter is **our mission plan, not a NASA limit**. Learn card gives the real limits (600 mSv career, 250 mSv per solar particle event; verified) without mapping them to the bar.

## 6. Long shadow (eclipse)
- One forecast "long shadow" per run, **4-8 shifts (48-96 h)**, around days 8-10. Mission Control warns 3 days ahead (eclipses are predictable from topography, storms are not: that contrast is itself a lesson).
- Short eclipses (1 shift) appear 2-3 times at random.

## 7. Fail and win states
- **Oxygen 0** or **Dose 100** -> crew called home safely ("mission paused") + debrief. Nobody dies.
- **Power 0** -> power emergency: no jobs except Repair and Shelter, oxygen -10/shift until power > 10.
- **Warnings** at Oxygen 25, Dose 75, Power 20 (Mission Control speaks, meter blinks with icon + word, not color only).
- **Report card (4 entries, 0-3 stars each):** Lighting (logs + eclipse logged), Radiation (measurements + storm measured), Shelter (shelter level + final dose), Ice (samples, or "mapped where not to look"). Stars, not a single score, so a no-ice run can still be a good run.

## 8. Sanity check (hand math, needs a bot sim to confirm)
| Player style | Power | Oxygen | Dose | Outcome |
|---|---|---|---|---|
| **Careful** (cleans dust, shelters in storms, 2 scouted trips) | ~22 sunlit shifts x ~+15 net = ~330 income vs ~250 spend: comfortable | 5 air tunes needed | ~28 base + 2 storms x 6 + trips 8 = **~48** | Safe, 1-2 ice likely, 2-3 stars |
| **Greedy** (4 blind crater trips, no cleaning) | Dust drags solar to +15 -> net ~+3: runs dry before the long shadow | Squeezed | ~28 + 16 + storm outside 20 = **~64+** | Power emergency in the dark around day 9 |
| **Reckless** (works through both storms outside) | OK | OK | ~28 + 2 x (20+16) + 16 = **~116** | Dose fail, debrief explains shelter |

The three styles split cleanly, which is what we want. Confirm with a seeded bot sim once the engine exists (see prototype plan).

## 9. Known risks
- **Numbers are hand-tuned.** Without a bot sim, one cheap dominant strategy may exist (e.g. spamming Log sunlight). Mitigation: diminishing returns (each repeat in a day gives half science) if the sim shows it.
- **Dose meter vs real limits:** kids may read "100 = deadly". Copy must say "plan", and the debrief says "the crew went home to stay safe".
- **Two-slot jobs** (rover, regolith) may feel slow. If playtests show boredom, make the rover 1 slot + 1 shift away.

---

# v1.1: bot-sim results and tuning (2026-11-14, session 2)
Engine built (`src/engine/engine.ts`, numbers in `src/config/moon.json`). Run `npm run sim` (full) or `node --no-warnings src/sim/bots.ts slice 500`. 500 seeded games per bot.

**Changes the sim forced:**
- **Power emergency was a death spiral** (idle player died 91% of the time: no air tuning + oxygen -10/shift). Emergency oxygen drain is now **-6/shift**.
- **Log spamming beat real play** (idle bot out-scored careful on science). Sunlight logs and quiet-day radiation measurements now give full points for the first 3, then 1 point. Eclipse logs and storm measurements always pay full.
- Full game long shadow is **4-6 shifts** (was 4-8) so it doesn't overlap the comms-drop storm too often.
- The slice has **7 actions** (added Log sunlight, the main "light" evidence). Earlier plan said 6.

**Full game (28 turns), after tuning:**
| Bot | Completes | Fails (O2 / dose) | Power emergency | Avg dose | Stars /12 |
|---|---|---|---|---|---|
| Careful | 100% | 0 / 0 | 23% | 51 | 10.3 |
| Greedy (blind rover trips, no cleaning) | 0% | 100 / 0 | 100% | 36 | 5.4 |
| Reckless (works outside in storms) | 45% | 9 / 45 | 100% | 95 | 4.8 |
| Idle (logs + rest only) | 52% | 48 / 0 | 99% | 56 | 5.2 |
| Random clicks | 21% | 6 / 72 | 23% | 96 | 3.0 |

**Read:** styles split cleanly, and no lazy strategy wins. **Watch:** random clicking fails 79% (mostly dose). Real kids aren't random, but a first-timer who ignores storm alerts will fail. Playtest whether Mission Control's alerts are loud enough before softening storm numbers. Greedy always loses, which may feel harsh; the debrief must make the cause obvious ("you ran out of power in the dark").

**Slice (10 turns):** every bot completes. Stars still separate careful (10.6) from reckless (5.5), but there's **no real danger in the slice**. It's good for learning the controls and the storm moment, not for testing tension. Use the full game for that.

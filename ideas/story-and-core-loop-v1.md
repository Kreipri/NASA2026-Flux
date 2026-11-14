# Story and Core Loop: Draft v1

**Status:** draft for Bea's review. Setting facts come from `ideas/research-setting-facts.md`. **Everything labeled FICTION below is invented.** All numbers are placeholders to tune later, and each should be grounded in a source (or badged SIMULATED).

## Premise (setting is real, story is FICTION)
- **Real:** an outpost on the sunlit Shackleton Connecting Ridge near the Moon's south pole. Sunlight most of the year, permanently dark and very cold craters nearby, ice possible but uncertain, no radiation protection, sharp sticky dust.
- **FICTION:** a small crew on a short stay. Mission Control on Earth guides them. No exact dates or crew size are claimed as NASA plans.

**One-line story:** *"Your crew has two weeks on the ridge to find out whether the dark craters hold water ice, without running out of power, air, or safe radiation budget."*

## Characters (FICTION, placeholders)
- **You:** the outpost commander (the player).
- **3 crew, one job each:** an engineer (power/repairs), a doctor (dose and health), a geologist (science and rover). They never die. If things go badly the crew is called home safely ("mission paused") and you retry with what you learned.
- **Mission Control** (voice on the SunWatch console): relays solar event alerts and advice. Matches the real chain (forecasters -> radiation team in Mission Control -> crew).
- **Mascot:** TBD, original (not Fallout).

## Core idea: Light is a resource
Where you work decides power, cold, and radiation:
| Place | Power | Cold | Radiation | Reward |
|---|---|---|---|---|
| **On the ridge** | Good (sunlight, short eclipses) | Mild | Moderate (no protection) | Safe, low science |
| **In the dark crater** | None. Rover and heaters run on batteries | Extreme (as low as -414 F, colder than Pluto) | Same sky, extra time outside | **Ice samples = big science** |
| **Shelter** (regolith-covered) | Small | Mild | **Much lower** | None, you wait |

## Meters (D-007)
- **Power:** the shared budget. Spent on life support, heaters, rover, instruments.
- **Oxygen:** survival meter. Making and cleaning air costs power.
- **Dose budget:** radiation the crew can take. Rises slowly always, spikes in storms. Shelter reduces it.
- **Science:** the tempting goal. Going for ice earns it and costs the others.

No safe choice: every action costs at least one meter.

## Turn loop (one "shift" = a few hours, about 3-4 turns a day, 14 days; tune later)
1. **SunWatch + Mission Control brief:** what's coming (sunlight, eclipse, solar events).
2. **Split power** between life support, heaters, rover, science (simple sliders or 3 chips).
3. **Pick 2 crew actions** (e.g. rover to crater, repair panel, clean dust, shelter, rest).
4. **Resolve:** deterministic rules engine updates meters. AI writes the short event text (D-004). Real data badges appear when real data is used (D-008).
5. **Learn card** (optional, tap): "Why did that happen?" with a plain-language fact and its source.

## Story beats (about 14 days, FICTION)
1. **Days 1-3: Settle in.** Learn the meters. Mission Control walks through power and air.
2. **Days 4-6: The ice hunt.** Rover trips toward the dark crater. First real trade-off: leave the light for science.
3. **Day 7: First solar alert.** SunWatch shows a flare. Particles arrive later. Shelter or keep working? Replays real May 2024 events: flare, then particle event, then geomagnetic storm, with real moon-orbit radiation readings (badged ARCHIVE).
4. **Days 8-10: Long shadow and dust.** The ridge loses sunlight for many hours and dust clogs panels. NASA studies give worst-case storage needs of 73-117 hours at the Shackleton rim (verified, see D-014). Game long shadow: 2-4 days, forecast ahead.
5. **Day 11-12: Comms drop during a storm.** The link to Earth is lost, so the **onboard radiation alarm** is your backup (real design). Make the call yourself.
6. **Days 13-14: Final push.** Spend what's left on one crater trip, or protect the crew.
7. **Ending (honest about the science):** based on your science score and luck, either "trace ice found, patchy" or "no ice here, but you mapped where to look next." Both are good endings, because NASA's real ice evidence is uncertain and uneven. Fail state = crew called home early, with a debrief of what to change.

## Replayability (varies each run)
- Real DONKI events drawn from a bundled set of archived storms (and optionally live, badged LIVE).
- AI-written event flavor within fixed rules.
- Random dust, eclipse length, and ice patchiness each run.

## What this teaches (check against the brief)
Real trade-offs: shared power, light location, radiation shelter vs work, uncertain science. A kid leaves knowing why NASA picks sunlit ridges, why dark craters are hard, and why shelters matter.

## Open items for next pass
- Pick the mascot and crew names.
- Define the exact action list and power costs, and ground them in a source or badge SIMULATED.
- Choose tech stack and write the first thin prototype plan.
- Source Shackleton size and distance from the pole.
- Verify the snippet-only facts used here (eclipse length, dose limits).

---

# Revision v1.1 (Bea approved the objective change)

## Objective: build the evidence for a site report card
The crew keeps healthy for the whole stay and collects evidence on whether the ridge works as a base (NASA site choice weighs lighting, terrain, comms). Final score is a **report card** built from what you gathered. Ice is one big entry, not a pass/fail. Ice samples convert to oxygen and water, which lowers power cost later (an investment). Better prospecting raises the odds of finding ice. A bad run still ends with "here's where to look next."

## Player actions (each shift: pick 2, crew time is the hidden limit)
Tags: **[REAL]** is grounded in a researched NASA fact. **[GAME]** is an invented gameplay simplification (badge SIMULATED).

| Group | Action | Costs | Gives |
|---|---|---|---|
| **Keep the base alive** | Clean dust off panels and seals [REAL: dust clogs mechanisms, wears seals] | Crew time | Power back up, fewer failures |
| | Tune air system (oxygen and CO2 scrubbing) [REAL: ISS recycles 98%+ of water] | Power | Oxygen steady |
| | Repair a fault [GAME] | Crew time, power | Prevents shutdown |
| **Stay safe** | Pile regolith over the shelter [REAL: regolith shields] | Crew time, outside dose | Much lower dose in storms, permanent |
| | Shelter in place [REAL: SRAG advice] | A shift of science | Dose drops during storm |
| | Delay or end a spacewalk [REAL: SRAG advice] | Lost progress | Dose avoided |
| | Rest or exercise [REAL: OSDR studies on bone and muscle loss] | Crew time | Crew health up (keeps actions available) |
| **Explore and learn** | Send the rover to the dark crater [REAL: ice in shadowed regions] | Lots of power, dose, cold | Ice samples |
| | Scout with a hop-drone first [REAL: JPL MoonFall drones planned] | Some power | Better ice odds, safer trip |
| | Log sunlight and eclipse at the ridge [REAL: ridge lighting studies] | Little | Report-card evidence |
| | Measure radiation with the instrument [REAL: CRaTER-style data, badged] | Little | Report-card evidence, learn cards |
| | Collect rock and dust samples [GAME] | Crew time | Science points |
| **Talk to Earth** | Call Mission Control [REAL: mission control advises on storms] | Little power | Advice, early heads-up on storms |
| | Send the daily report [GAME] | Little power | Bonus science if comms are up |

Every action costs at least one of power, oxygen, dose, or crew time, so there is no free move.

## Mockup: first-screen tutorial (ALL NUMBERS ARE PLACEHOLDERS)
```
+--------------------------------------------------------------+
| SHACKLETON RIDGE OUTPOST              DAY 1 / 14   SHIFT 1/4 |
+--------------------------------------------------------------+
| POWER  [########--]  80%   OXYGEN [#########-] 90%           |
| DOSE BUDGET [#---------] 10%        SCIENCE  0               |
+--------------------------------------------------------------+
| SUNWATCH  (our console, fiction)                             |
|  Sun: UP, on the ridge     Eclipse today: none               |
|  Alerts: none              Earth link: OK                    |
+--------------------------------------------------------------+
| MISSION CONTROL: "Welcome to the ridge. The sun barely moves |
|  here, so your panels have light almost all year. But the    |
|  craters nearby are dark and freezing. Choose 2 jobs."       |
+--------------------------------------------------------------+
| [1] Clean dust    [2] Tune air     [3] Scout with drone      |
| [4] Log sunlight  [5] Rest         [6] Call Mission Control  |
+--------------------------------------------------------------+
```

**Tutorial steps (Mission Control speaks in short, plain sentences):**
1. **Meters.** "Power runs everything. Oxygen keeps you breathing. The dose budget is how much space radiation your crew can safely take. Science is how you finish the mission."
2. **Pick 2 jobs.** "Your crew has time for 2 jobs each shift. Every job costs something. Try 'Clean dust'." *(Panels get brighter, power goes up, crew time used. The tutorial points at the cost.)*
3. **Spot the trade-off.** "Cleaning used crew time, so you can't scout this shift. There's no free choice up here." *(Badge tap: "Why does dust matter?" -> learn card: dust is sharp, sticky, and wears seals. Source badge shown.)*
4. **First alert (scripted day 2).** SunWatch lights up: "Mission Control: the Sun had a flare. Particles may arrive later. Shelter or keep working?" *(Player chooses. Dose meter shows the result. Event data badge: `[✓ NASA DONKI · ARCHIVE May 2024]`.)*
5. **Dark crater preview.** "Ice may be hiding in the dark craters. Going there costs power and exposes you to more radiation. Scouting first makes it safer."
6. **Goal card.** "Your goal: stay healthy and build the evidence for a site report card. Ice is one big piece, but light, shelter and radiation readings count too."

## Still to do
- Balance action costs in a spreadsheet (placeholders only so far).
- Source or badge SIMULATED for each [GAME] action.
- Pick crew names and mascot.

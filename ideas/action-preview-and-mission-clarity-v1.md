# Action preview, environment brief, and mission clarity

**Status:** proposed design, 2026-11-14. Builds on D-008, D-019, D-020, and D-021. No code or number changes.

## Recommendation

Use a **three-part planning screen** before the player commits a day:

1. **Mission Brief** says the one thing the player is trying to prove today.
2. **Environment Brief** shows the known sunlight, shadow, storm, temperature, Earth-link, and crew conditions before any job is selected.
3. **Action Preview** appears when a job is selected and shows the expected resource changes, location risk, time used, and report-card progress.

This is the clearest fit for ages 7-12 because the child can answer three questions in order:

> What is happening? What can I do? What will it cost?

The preview must show **expected** results, not guaranteed results. For uncertain jobs such as a rover trip, show a range and explain the uncertainty.

## Option comparison

| Option | How it works | Strength | Trade-off |
|---|---|---|---|
| A. Full action preview **(recommended)** | Selecting a job opens a “before you do it” card with resource deltas, risk, time, and goal link. | Makes trade-offs concrete without hiding the game’s challenge. | Adds a little screen space and requires plain-language copy for every job. |
| B. Compare two jobs | Player selects two jobs and sees a side-by-side cost/reward comparison. | Strong for teaching opportunity cost. | Slower to use; can turn the game into a spreadsheet and is harder on small screens. |
| C. Consequence-only confirmation | Show only a short sentence before commitment, such as “This uses power and sends crew outside.” | Fastest to build and least cluttered. | Too vague for children to understand numbers, ranges, or report-card value. |
| D. Guided mission cards | Each day recommends one or two suitable jobs and explains why. | Very approachable for a first run. | Risks making the game feel like following instructions instead of planning. |

Recommend **A**, with a light version of **D** in the tutorial and when a meter is in danger. Do not make the recommendation a free or always-correct choice.

## Screen flow

```text
┌ DAY 3 / 7 ─────────────── MISSION BRIEF ─────────────────────┐
│ TODAY: Prepare for tomorrow's solar storm.                    │
│ Why: A storm can raise the crew's radiation dose.              │
│ Main goal: Measure radiation during the storm.  [0/1]          │
│ Helpful next step: Build shelter OR save power for the dark.   │
├────────────── ENVIRONMENT BRIEF ────────────────┬─────────────┤
│ SUN: bright ridge light until evening             │ CREW       │
│ SHADOW: long shadow starts tomorrow (forecast)    │ TIME 8/8    │
│ SPACE WEATHER: storm building; peak tomorrow      │ STAMINA 74  │
│ TEMPERATURE: crater is always extremely cold      │ LINK: OK    │
│ BASE: dust level 1; panels make less power        │             │
│ [ARCHIVE NASA data] [SIMULATED game forecast]     │             │
├───────────────────────────────────────────────────┴─────────────┤
│ SELECT A JOB                                                     │
│ [MEASURE RADIATION] [PILE SHELTER SOIL] [SCOUT WITH DRONE]       │
└──────────────────────────────────────────────────────────────────┘

After selecting a job:

┌ MEASURE RADIATION ──────────────────────────────────────────────┐
│ What it does: checks how much radiation is around the outpost.   │
│ Where: HABITAT · Time: 1 crew time · Outside: NO                │
│                                                                  │
│ EXPECTED CHANGE                                                  │
│ Power       60 → 56     uses 4                                   │
│ Oxygen      70 → 70     no change                               │
│ Dose        12 → 14     normal background exposure              │
│ Stamina     74 → 73     small effort                            │
│                                                                  │
│ MISSION RESULT: +1 radiation evidence                            │
│ TRADE-OFF: You learn more, but have 1 less crew time for another  │
│ job today.                                                       │
│ [Why?] [ADD JOB] [CANCEL]                                       │
└──────────────────────────────────────────────────────────────────┘
```

## What every action preview must contain

- **Plain-language purpose:** “Checks the radiation around the base,” not only “Measure radiation.”
- **Where it happens:** habitat, shelter, solar panels, or dark crater.
- **Crew time used:** show chips, for example `●●○○○○○○` after spending 2 of 8.
- **Resource changes:** Power, Oxygen, Dose, and Stamina with before → expected after values.
- **Exposure flags:** `OUTSIDE`, `COLD`, `STORM RISK`, or `EARTH LINK NEEDED` when relevant.
- **Mission effect:** the exact report-card item it advances, such as `LIGHT +1 evidence`.
- **Opportunity cost:** one sentence naming what the player may not be able to do because time or power was spent.
- **Uncertainty:** use `likely`, `range`, or `chance` for rover results; never show a random result as guaranteed.
- **Data labels:** keep `[ARCHIVE]`, `[LIVE]`, and `[SIMULATED]` beside the relevant forecast or measurement. Archived NASA data must never look live.

## Preview copy patterns for the current jobs

| Job | Child-facing trade-off sentence |
|---|---|
| Log sunlight & shadows | “Learn about the light here, but use a little power and crew time.” |
| Measure radiation | “Get evidence about radiation, but spend power and one crew-time chip.” |
| Scout with hop-drone | “Spend power now to make the later crater trip more informed.” |
| Rover to dark crater | “Look for ice, but leave the bright ridge. This uses lots of power, air, and crew time.” |
| Pile soil on shelter | “Make storm shelter stronger, but send crew outside and use power.” |
| Clean dust | “Panels can make more power again, but crew must go outside.” |
| Tune the air system | “Make more oxygen by spending power.” |
| Power-saving mode | “Save power today, but the crew gets colder and loses stamina.” |
| Shelter during peak | “Protect the crew from the storm, but spend the day waiting instead of gathering evidence.” |
| Rest day | “Recover stamina, but use oxygen and make less mission progress today.” |
| Call Mission Control | “Get the forecast when Earth is visible, but use power and crew time.” |

## Environment brief: what children should see before acting

The brief should be a compact, always-visible strip near the top of the screen. It is not a weather app; it is the outpost's current operating picture.

| Status | Show | Child explanation |
|---|---|---|
| Sunlight | `BRIGHT / SHORT ECLIPSE / LONG SHADOW` | “This tells us how much solar power the panels can make.” |
| Space weather | `QUIET / BUILDING / STORM PEAK` | “The Sun can send particles that raise radiation.” |
| Temperature | `RIDGE / DARK CRATER` | “The crater is much colder because sunlight never reaches it.” |
| Earth link | `VISIBLE / BELOW HORIZON` | “When Earth is out of view, Mission Control cannot send a new forecast.” |
| Dust | `LEVEL 0-3` | “Dust can make panels and seals work worse.” |
| Crew | `TIME` and `STAMINA` | “This is how much work the crew can safely do today.” |

Each status should have a short `Why?` link. The first time it appears, open a one-sentence lesson; after that, let the child reopen it without interrupting play.

## Mission clarity: make the goal impossible to miss

Use this hierarchy on every day:

1. **Big goal:** “Prove this ridge can host a Moon base.”
2. **Today’s job:** one sentence generated from the timeline, for example “Prepare for the storm and keep the crew safe.”
3. **Main goal:** one report-card checkbox, for example “Shelter during a storm.”
4. **Optional bonus:** one or two smaller stars, visibly marked `BONUS`.
5. **End-of-day recap:** “You used 6 crew time. Power fell because the base used air and the rover used heaters. Tomorrow: long shadow.”

Avoid presenting all 12 stars as equal urgent tasks. The main goal should be visually first; bonus goals should reward deeper planning. This preserves D-021 while reducing cognitive load.

## Teaching the consequence after the action

After `END DAY`, animate only the important changes in three beats:

```text
1. SUN: panels charged the base                         POWER +18
2. ROVER: heaters used battery in the dark crater       POWER -50
3. CREW: outside work increased exposure                 DOSE +4
```

Then show one sentence:

> “The crater gave you a chance to find ice, but it cost power because there is no sunlight there.”

If a warning threshold is crossed, explain the cause before showing the button for the next day. Failure should say “The crew went home safely because…” and name the first cause, not just show a red meter.

## Scope guard

This proposal changes presentation and teaching, not the current balance numbers or core resources. For the first web slice, implement the preview for three jobs only: **rover trip, shelter during peak, and measure radiation**. Reuse the same component/data shape for the other jobs after playtesting.

## Teaching rules for the UI

The preview should help a child predict the result without turning the game into a spreadsheet.

- **Use words beside numbers.** Show `Power 60 → 10 (uses a lot)` rather than only `-50`.
- **Show the biggest cost first.** For a rover trip, put `POWER: BIG COST` and `DARK + COLD` above the smaller oxygen and dose changes.
- **Make the trade-off symmetrical.** Every action card has one `YOU GAIN` line and one `YOU GIVE UP` line. Example: `GAIN: chance to find ice` / `GIVE UP: power needed for the long shadow`.
- **Separate known from uncertain.** Use `EXPECTED`, `RANGE`, and `CHANCE`; never show a random ice result as guaranteed.
- **Do not require a quiz before play.** Let the child act, then use the recap to explain what happened. A short “What will this cost?” prompt can be optional practice, not a gate.
- **Reserve red for danger.** Amber means “think carefully”; red means the action may put the crew in immediate danger. Always include a plain sentence so color is not the only signal.
- **Keep the mission hierarchy in one place.** The mission card should always answer: `WHY ARE WE HERE?`, `WHAT MATTERS TODAY?`, and `WHAT COUNTS AS SUCCESS?`.

### Recommended planning sequence

```text
1. READ THE SKY       What is the light, shadow, storm, and Earth-link status?
2. PICK A JOB         Which job helps today's main goal?
3. CHECK THE COST     What changes in Power, Oxygen, Dose, Stamina, and crew time?
4. CHECK THE GIVE-UP  What other job may no longer fit today?
5. COMMIT             The player confirms only after seeing the preview.
6. WATCH THE RESULT   End-of-day playback connects each meter change to its cause.
```

This sequence should be the same for every job. Consistency matters more than adding extra tutorial text.

## Acceptance questions for a child playtest

- Before choosing, can the child point to whether the next period is sunny, shadowed, or stormy?
- Can the child say at least one resource the selected job will use?
- Can the child explain what they give up by choosing it?
- Can the child say whether the job helps the main goal or is a bonus?
- After the day ends, can the child explain one meter change in their own words?
- Can the child repeat the mission in one sentence: “Prove this ridge can host a Moon base”?


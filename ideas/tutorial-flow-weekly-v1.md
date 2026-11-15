# Tutorial flow for the weekly mission, v1 (text draft)

**Status:** proposed. Text only; nothing built. 2026-11-15, Bea asked to improve the tutorial so children understand the game flow. Applies to `main` (weekly seven-week mission, side dock). Replaces the card-mode draft that lived on `feat/gameplay-v2`; that one does not apply here.

## Current flow (what the child sees)
```
Title → Story (P1-P4, M1-M5) → Arrive → Sun time-lapse
      → Tour 1 meters → 2 solar → 3 crew time → 4 shelter → 5 crater → 6 kinds of job → 7 report card
      → Week 1: dust alert → coach steps 1-4 (sunlight, air, rest, end week) → recap
```
That is **9 read-only screens** between the story and the first tap, then a good hands-on week. The hands-on part works. The front is the problem.

## What's weak
1. **Too much reading before doing.** Seven tour stops, each a new idea (panels, time, shelter, ice, three job kinds, goals). Most are forgotten by the first job.
2. **The tour teaches jobs the player is about to do.** Solar, shelter and crater stops describe jobs (clean panels, take shelter, drive to the crater). The coach later teaches three other jobs. Nothing ties the two together.
3. **The report card and "Mission Control's ask" are taught at stop 7, then never mentioned in Week 1.** The first coach step says "check the sunlight" without saying that is the ask or that it fills a star.
4. **The trade-off is stated but not felt.** Result notes say what a job cost, but never "you can't fix everything", the idea the brief wants.
5. **Two kid-limiting numbers, easy to mix up:** crew **Energy** (a meter) and the 8 crew **time blocks** (a weekly budget). The tour introduces both in different stops with no link.
6. **Jargon early:** "ridge" (arrive) and "dose" (meters) appear before the child has a reason to care. Both are tappable, which helps, but they sit in the main line.
7. **Fixed in this pass:** the Week 1 dust alert is now a one-button Curio step (no obvious "Good pick" choice).

## Recommendation: 5 stops, then a stronger Week 1

```
Title → Story → Arrive → Sun time-lapse            (keep: the hook and real facts F06 F76 F07)
      → Tour 1/3 Meters → 2/3 Jobs and time → 3/3 Your goal
      → Week 1: dust (guided) → coach 1-4 → recap
```
Cut from the tour: solar, shelter, crater. Their facts move to the **"Curio's tip" pill on each job's detail panel**, which already exists, so each fact appears when the child meets the job. Facts must keep their registry IDs and source cards (F65, F24, F67, F09, F29).

Alternatives:
- **B, copy trims only:** keep all 7 stops, shorten lines. Cheapest, but the stop count is the real issue. Rejected.
- **C, no tour, coach only:** fastest, but the child never sees the meters or Mission Control before a job. Too steep for ages 7-8. Rejected.
- **A (recommended):** merge and move, as above.

Trade-offs and risks of A:
- Facts tied to jobs only show if the child opens that job. Mitigation: the report card's main goals lead to Mission jobs (crater, shelter soil), and Mission Control's weekly ask points there. Check that F65 (panels) is also shown by the sunlight step result.
- The "who talks" split (D-031) matters: **Mission Control** asks, **Curio** explains. The tour should keep that voice.
- Not child-tested. Pass test below.

## Tour copy (3 stops)

**Tour 1/3: The meters** (ring meters glow)
> Four meters show how we're doing.
> **Power** is the battery. **Air** is what we breathe. Keep both up.
> **Radiation** is space energy that can hurt people. It only goes up, so keep it low.
> **Energy** is how rested the crew is.

Next: **Jobs and time ▶**. "Dose" stays a tappable word, not in the main line.

**Tour 2/3: Jobs and time** (time blocks glow, three job pins appear)
> Each week the crew has **8 time blocks**. A job uses blocks for the time and effort it needs: bigger jobs use more. It happens right away.
> Jobs come in 3 kinds: **Mission** jobs collect evidence, **Base** jobs keep power and air healthy, **Crew** jobs look after the astronauts.
> Jobs can't fix everything. Choose what matters most.

Next: **Your goal ▶**. Energy line: "Hard work outside tires the crew more", one sentence so Energy and time blocks connect.

**Tour 3/3: Your goal** (Mission Control voice; report card shows)
> **Mission Control:** Each week I'll send you one ask. Your jobs fill in the **report card**. Finish the main goals and keep everyone safe to prove this ridge is a good home!

Button: **Start week 1 ▶**. (Voice stays Mission Control per D-031.)

## Week 1 (keep the structure, sharpen the words)
Order stays: week opens → dust alert → coach steps. Only copy changes; step gating and reload behaviour stay as built.

| Step | Now | Proposed |
|---|---|---|
| Dust (guided) | built | "Dust blocks sunlight. I'll clear it before charging. It can come back, and then it's up to you." |
| 1 Check sunlight | "Welcome, Commander! Your crew has 8 time blocks… tap the glowing job to check the sunlight." | "**Mission Control's ask:** check the sunlight. Tap the glowing job. It fills in your report card." |
| 1 result | "…cost a little power and energy, and one time block." | "That job used power, energy and one time block. **Every job costs something.**" |
| 2 Run air | "Now keep the base alive…" | Keep. Result: "Air went up, but it cost power. You can't fix everything at once." |
| 3 Rest | "Your crew needs rest too…" | Keep. Result: "Resting gives energy back, but it used a time block. A rested crew can do more next week." |
| 4 End week | "Now end the week…" | "End the week. The Sun charges the batteries, the crew breathes and rests, and dust or faults can happen." |
| Recap note | what a week is | Add: "The report card has its first evidence. Next week Mission Control sends a new ask." |

Rules: other jobs stay held back until the three are done (as now). "Skip to week 2" stays debug-only.

## One-time tips after the tutorial (weeks 2+)
Use the existing Curio pop-up/result area; one per first occurrence, never repeated.

| Trigger | Tip |
|---|---|
| First blocked job | "This job can't run yet. Here's why." (reason already built) |
| First radiation alarm | "The alarm means a space-weather storm. Shelter helps. It needs a source row (F24/F67) before it ships." |
| First Earth radio loss | "Earth is below the horizon. The base alarm is still our backup." (check existing row) |
| First time a job is Mission and drone-first | "Mapping first can make the rover trip cheaper." |

## Facts and science
- Everything above is **game rules**: no data badges. Moved facts keep their existing registry rows and source cards (see `ideas/fact-sources.md`). The new storm tip text needs its row confirmed before it ships.
- "Radiation is space energy that can hurt people" is a simplification; check it against the fact registry before using it in the tour.

## Pass test and open items
- **Pass test (not run):** after Week 1, can a child aged 7-12 say, in their own words, what the report card is and why they couldn't do every job? Test with 2-3 children.
- **One question for Bea:** is it OK to drop the solar, shelter and crater tour stops and rely on job tips for those facts? **Default if no answer: yes.**
- Build cost: tour changes are copy and stop removal in `scripts/build-web.ts` (plus `tourKinds`/`tourCard` helpers in `src/web/game.js`); Week 1 copy is the `TUT` table and `tutNote` calls in `src/web/game.js`. Asking before building.

## Addendum (2026-11-15, Bea): week = 7 days? and a Mission Control briefing each week

### 1. "7 blocks, a day a task": not decided, still 8
- The record has no decision changing crew time to 7. Current rule: **8 time blocks a week** (stamina can lower it to 6 or 4); jobs cost **1, 2 or 4 blocks** (`blocksFor()` in `src/engine/engine.ts`, `src/config/moon.json`). So a job is not "a day". The seven-day idea exists in the separate card-mode branch (seven fictional days), not here.
- If Bea wants it, options:
  - **A. Keep 8 blocks, relabel nothing.** Cheapest. Risk: "week" and "blocks" stay abstract.
  - **B. 7 blocks, label them Mon-Sun ("days").** Kids get a real calendar. Needs job costs rebalanced (1/2/4 doesn't map to "a day per task"), a sim rerun and a tutorial copy change. Risk: a 4-block job would be a four-day task, which is fine only if the story says so.
  - **C. One job per day (7 jobs a week), no costs in days.** Simplest to explain and matches "a day a task", but removes the 1/2/4 cost trade-off that makes choices costly (brief: no choice is free). Not recommended without another cost.
- **Decided (Bea, 2026-11-15): A. Keep 8 blocks a week.** A block is the effort and time a job needs, so bigger jobs use more blocks. Tutorial copy should say that ("Each job takes time and effort: bigger jobs use more blocks"), not tie blocks to days. Options B and C below are history.
- Recommendation: **B if we change it at all**, but only after the tutorial copy is settled, because it changes the balance. **Question for Bea: A, B or C?** Default: A (no change).

### 2. Mission Control briefing popup at the start of each week
Proposed flow:
```
Recap  →  [Week 2 of 7: Mission Control briefing]  →  Start week 2  →  (alert, if any)  →  jobs
              ▲ same card reopens from the Mission Control pill (read-only, "Back to work")
```
- **Card content (short, 3 lines max):** header "Week 2 of 7", conditions (sun, Earth radio, any storm warning), and **one ask** (the first unfinished main goal). One button: **Start week 2**.
- **Reopen:** the existing Mission pill/drop-down becomes "Mission Control" and shows the same card with **Back to work** instead of Start. It does not restart anything.
- **Week 1:** use this card instead of tour stop 3/3 ("Your goal"), so there is one briefing, not two. Order: tour 2/3 → Mission start → Week 1 briefing → Start → dust step.
- **Earth radio down** (weeks with the blackout): the card is Curio's, titled "The plan Mission Control left" (D-031). Alerts come after Start, in that order.
- **Why:** it gives each week a clear start and one stated goal, and it teaches children to look back at the ask.
- **Risks:** modal fatigue (7 briefings plus 7 recaps per run). Keep it to a few lines and one tap; no extra confirm step beyond the Start button. Briefing text must not duplicate the recap. Needs a flag so a reload mid-briefing reopens it without repeating the week start.
- Build cost: a new `modal` kind in `src/web/game.js` (next to recap/alert), a `briefed` flag in the mission/week state, and the brief pill's click handler. Engine unchanged. Not started.

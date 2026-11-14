# Handoff

**Read order for any new agent:** `CONTEXT.md` -> `DECISIONS.md` -> this file -> `ideas/story-and-core-loop-v1.md` -> `CLAUDE.md` / `AGENTS.md` for working rules.

## Current Phase
Git is configured with `origin` at https://github.com/Kreipri/NASA2026-Flux on `main` (D-017). Commit `781a543` holds the day-based loop. **Uncommitted on disk:** the 7-day mission, main/bonus tiers, stamina tuning, Earth-blackout explanation and their docs (D-020, D-021), plus other agents' `ideas/ice-*.md` and `ideas/ui-base-overview-v1.md`. Commit only when Bea asks; no agent co-author trailers (D-018 attribution rule).

Prototyping. A playable **terminal prototype** exists (`npm run play`, 7-day mission by default). Rules engine + bot sim tune the numbers. The project is terminal-only for now; the D-023 browser UI remains a design specification, not an implementation target yet.

## What's Decided (details in `DECISIONS.md`)
- **Game:** kid-friendly (ages 7-12) survival resource-management game, browser-based, outpost management only (no launch/landing gameplay).
- **Setting:** real place, the **Shackleton Connecting Ridge** near the lunar south pole. Sunlit most of the year with short eclipses; permanently shadowed, extremely cold craters nearby where ice may exist (uncertain). Moon first, Mars later via a site config file (D-005, D-006, D-010).
- **Teaching goal:** "Light is a resource. Where you work decides your power, cold, and radiation risk."
- **Meters:** Power, Oxygen, Dose budget (radiation), and crew **Stamina** (sets daily crew time). The Science points meter was replaced by the on-screen report card (D-019).
- **Objective:** build the evidence for a **site report card**. Ice is one big entry, not pass/fail (D-013).
- **UI:** retro green-terminal look, inspired by Fallout's *visual interface only*, not its game concepts (D-002). Original mascot and art.
- **Accuracy rule:** setting must match official NASA info; fiction (crew, story, mascot, dates) is clearly labeled (D-009).
- **Source badges:** `LIVE` / `ARCHIVE` / `SIMULATED`, tap for a "where is this from?" card (D-008). AI text gets `[AI-written story]`, never a data badge.
- **AI:** writes event flavor and situations; a deterministic rules engine owns all numbers; bundled offline events as fallback (D-004).
- **7-day mission (D-020/D-021, default):** 4 main goals + crew healthy = SITE PROMISING; 11 stars = APPROVED; 12 = GOLD. Ice is survey evidence (no air discount). Earth blackout explained and forecast.
- **Core loop v2 (D-019):** 1 turn a day (7-day `week` default, 14-day `full` kept), 8 crew time (crew of 4), stamina meter, 12 jobs grouped by purpose, report card on screen. Numbers + sim results: `ideas/balance-pass-v2.md` (v1 is history).
- **Stack (D-016):** Vite + TS + React; engine in plain TS, seeded, with a bot sim. Plan: `ideas/tech-stack-and-prototype-plan.md`.
- **Facts verified (D-014):** Shackleton 21 km wide / 4 km deep, pole on its rim; ridge ~17 km from pole (derived); worst-case dark 73-117 h storage, longer ground-level shadows possible.
- **SunWatch:** our fictional outpost-console panel showing alerts relayed from Mission Control. Not a real device. DONKI is a research log of events, **never call it a warning or forecast service** (D-012).
- **Planning UX (D-023/D-024/D-025/D-026):** before planning, the terminal shows an Environment Brief and a named daily scenario. Selecting job numbers opens an Action Preview with expected resource changes, risk, opportunity cost, and a clear `YOU GAIN` / `YOU GIVE UP` pair. `yes` adds the task to today's plan and prints its immediate task result; players can add repeatable light tasks, heavy 4-block tasks are `ONCE/DAY`, and `end` resolves the day. Browser implementation is deferred. Spec: `ideas/action-preview-and-mission-clarity-v1.md`.

## Key Files
| File | What it holds |
|---|---|
| `CONTEXT.md` | Challenge brief, data-source links, judging lens |
| `DECISIONS.md` | Every decision (D-001 to D-021) and the open-questions list |
| `ideas/story-and-core-loop-v1.md` | Story, characters (fiction), turn loop, 14-action table, tutorial mockup |
| `ideas/research-data-sources.md` | DONKI, RadLab, OSDR, Trek, CSA findings, with live-test results |
| `ideas/research-setting-facts.md` | Official south pole facts. **Verification pass table at the top overrides older lines** |
| `ideas/balance-pass-v2.md` | **Current** loop, job table, report card rules, sim results |
| `ideas/ui-base-overview-v1.md` | **Proposed** main screen: angled 3/4 base map with sky band + console (v1.1), wireframe, options |
| `ideas/balance-pass-v1.md` | Old shift-based version (history) |
| `ideas/ice-science-check.md` | NASA check on what ice is for; option 1 (survey evidence) adopted in D-020 |
| `ideas/ice-value-in-prototype.md` | Explains the old (now removed) ice air discount; history |
| `ideas/tech-stack-and-prototype-plan.md` | Stack choice, architecture, thin prototype scope and build order |
| `src/` | Engine, configs, bot sim, chat CLI. Run: `npm run sim`; play interactively with `npm run play` (type job numbers; `note <text>` logs feedback). State in `.run/state.json`, full transcript in `.run/playlog.txt` |
| `data/samples/` | Real archived May 2024 solar storm data (DONKI + RadLab CRaTER) with README |

## Prototype state (for the next agent)
- **Run:** `npm run play` (interactive; type job numbers like `1 3 4`, `back`/`finish`, `note <text>`, `new week|full|slice`, `quit`). `npm run sim` for balance. Node 24+, no dependencies.
- **Week timeline:** day 2 real flare alert, days 3-4 real storm (DONKI + CRaTER, ARCHIVE badges), days 5-6 long shadow, days 5-7 Earth below the horizon (forecast; onboard alarm only), 50% surprise simulated storm on day 6/7.
- **Goal tiers (D-021):** 4 main goals + crew healthy = PROMISING; 11 stars = APPROVED; 12 = GOLD. Checklist shown every day.
- **Open design items:** (1) shelter levels could also cut everyday cosmic-ray dose (more accurate; proposed in `ideas/balance-pass-v2.md`, not built). (2) The day 6/7 storm is SIMULATED; bundle another archived storm to make it real. (3) If kids find power too loose, raise job costs, not daily upkeep (D-021). (4) Bea hasn't played the 7-day version yet.

## Verified by live test
- **DONKI** (`https://ccmc.gsfc.nasa.gov/DONKI-API/get/<TYPE>?startDate=&endDate=`): works from browser JS, no key, CORS open, about 120 calls remaining per window. OpenAPI spec at `/DONKI-API/v3/api-docs`.
- **RadLab** (`https://visualization.osdr.nasa.gov/radlab/api/`): returns real Moon-orbit radiation (CRaTER on LRO, hourly, uGy/h). Data ends sometime in 2024-25. No CORS header, so bundle snapshots. Always filter by time (unfiltered >10 MB).
- **May 2024 storm:** lunar-orbit dose rate rose from about 5 to about 3,150 uGy/h while DONKI logged flares, particle events, and a Kp 9 geomagnetic storm. Samples are in `data/samples/`.

## Warnings for the next agent
- **Ice:** air-power discount removed (D-020); ice is survey evidence. Find odds are SIMULATED, not validated site probabilities.
- **The Artemis plan changed in 2026** (per research: Artemis III is now an Earth-orbit test, first landing Artemis IV in 2028, Gateway paused, "Moon Base" announced). Re-verify on nasa.gov before quoting dates, names, or crew sizes. We state no exact dates as fact.
- **Use the verification table** in `ideas/research-setting-facts.md`. Dropped: "-280 F" (not on the page), "5.6% ice" (use "a few percent, patchy"). Still unverified: Chang'e-4 dose (China, **not NASA**), Orion 150 mSv, ISS 6-month dose, 1.3 s delay.
- **Ridge distance (~17 km / 10 mi) is our arithmetic** from NASA-hosted coordinates. Label it "worked out", don't cite it as a NASA statement.
- **Numbers are tuned by bots, not kids.** `npm run sim` (planner / careful / greedy / reckless / idle / random) must keep the split in `ideas/balance-pass-v2.md` (planner ~81% approved, careless styles 0%). Rerun it after any change to `src/config/*.json`.
- Most OSDR studies are **mice or cells, not astronauts**. Label honestly.
- Moon Trek, OSDR terms, and OSDR keyword results are **still unverified** (JS-only pages).
- **Two entries are numbered D-018** (attribution rule, and the engine/bot sim). Both were made in parallel by different agents; refer to them by title. Next new decision is D-022.
- The user wants **light usage**: concise text, no subagents or big workflows unless asked, no Figma/HTML builds in ideation (see `CLAUDE.md`).

## Next Steps (suggested order)
1. **Bea playtests the 7-day mission** in the terminal (`npm run play`, starts `week`). Read `.run/playlog.txt` + her `note` lines, tune `src/config/moon.json`, rerun `npm run sim`.
2. **Playtest the terminal planning flow** (`npm run play`): test whether a child can predict the environment, name a cost, explain what they give up, and repeat the mission in one sentence.
3. **Playtest the terminal planning flow** (`npm run play`): add the D-023 environment summary and task preview to the CLI before building a browser UI. Check whether a child notices the environment, names a cost, understands what they give up, and can repeat the mission in one sentence.
4. **Name the crew and mascot** (original, fictional).
5. **Data plan:** bundle more archived storms so the second storm can be real (ARCHIVE) instead of SIMULATED.
6. Write the short **datasets explanation** for judges.

## Handoff Protocol
When you finish a chunk of work or stop:
1. Save outputs to the right folder (see layout below). Don't leave them only in chat.
2. Log any decision in `DECISIONS.md`.
3. Update **What's Decided**, **Warnings**, and **Next Steps** here, replacing stale entries.
4. Add a dated line to the Session Log.

Keep entries short. Link to files instead of pasting content.

## Folder Layout
```
CONTEXT.md     Project brief (stable, rarely edited)
DECISIONS.md   What's decided, proposed, and open
HANDOFF.md     Live status for the next agent (this file)
CLAUDE.md      Working style and rules for Claude agents
AGENTS.md      Same rules, for other agents (Codex etc.)
ideas/         Story, research, wireframes, balance notes (markdown)
data/samples/  Real archived NASA data snapshots + README
src/engine/    Rules engine (deterministic, seeded)
src/config/    moon.json (all game numbers), scenarios.json (week / full / slice timelines + win rules)
src/content/   Pre-written Mission Control lines
src/cli/       Terminal play (npm run play)
src/sim/       Bot balance sim (npm run sim)
src/data/      Trimmed May 2024 storm data (built by scripts/build-storm-data.ts)
```
Add `docs/` for the judges' write-up.

## Session Log
- 2026-11-14 (UI draft, Opus 5.5): Proposed base-overview main screen (ridge side-view + console) with 4 options and extra UI suggestions in `ideas/ui-base-overview-v1.md`. Not decided; open question on target device.
- 2026-11-14 (UI draft v1.1): Bea wants a visual UI, open to web/desktop, suggested angled top-down. Recommended webapp (brief + D-016) and an angled 3/4 SVG map with sky band (sun on horizon, Earth = comms). Two sky facts marked TO VERIFY. Not decided.
- 2026-11-14 (Ice source check, Codex): Verified science, prospecting and resource-processing roles against NASA sources; withdrew prior recommendation to retain the permanent discount. Saved three replacement options in `ideas/ice-science-check.md`, logged proposed D-013 revision. No gameplay edits.
- 2026-11-14 (Ice clarification, Codex): Checked current engine; explained ice's permanent air-power discount and report-card value, costs, and missing water/processing mechanics in `ideas/ice-value-in-prototype.md`. No design decision or gameplay change.
- 2026-11-14 (Git workflow advice, Codex): Saved a proposed branch/PR workflow in `ideas/git-workflow.md`. No branches, protection settings, commits, or pushes changed for this advice.
- 2026-11-14 (Git attribution, Codex): Verified GitHub lists only `Kreipri` as collaborator and both initial commits use the user's Git identity with no co-authors. Saved the no-agent-collaborator/co-author rule in `AGENTS.md` and D-018.
- 2026-11-14 (Git setup, Codex): Initialized `main`, connected the supplied GitHub repository, added `.gitignore`, and pushed the initial snapshot to `origin/main`. No gameplay changes made. Prototype files are being added concurrently; files created after staging are outside this snapshot.
- 2026-11-14 (session 1, Sonnet 5.5): Set up context, decisions, and handoff structure. Researched all 7 provided links plus live API tests (DONKI, RadLab). Researched official south pole setting, radiation risk, and astronaut tools via research agents. Decided setting (Shackleton Ridge), badges, SunWatch, AI role, report-card objective. Drafted story, 14-action table, and tutorial mockup. Saved sample data. Nothing built in code.
- 2026-11-14 (session 2, Opus 5.5): Balance pass v1 (`ideas/balance-pass-v1.md`). Verified Shackleton size/pole position and most snippet-only facts on nasa.gov/NTRS pages (curl, exact wording); corrected eclipse hours, dropped -280 F and 5.6% ice. Picked stack (Vite+TS+React) and wrote thin prototype plan. Logged D-014 to D-016. No code.
- 2026-11-14 (session 2, cont.): Bea approved D-015 and step 1. Built engine + bot sim + chat CLI, tuned from sim (D-018). Started chat playtest.
- 2026-11-14 (session 2, cont.): Bea's playtest feedback -> v2 loop (D-019): days, crew time, stamina, grouped jobs, report card on screen, emergency recovery help. Verified crew facts (Artemis IV 2 on surface, Base Camp up to 4, 2.5 h exercise). Terminal play via `npm run play`.
- 2026-11-14 (session 2, cont.): 7-day mission with SITE APPROVED objective (D-020), tuned to 11/12 stars by sim; ice made survey evidence (air discount removed); Earth blackout grounded in NASA/JPL study and forecast in game.
- 2026-11-14 (session 2, cont.): Main/bonus goal tiers (PROMISING/APPROVED/GOLD) and stamina cost tuning (D-021). Checked low-dose star is reachable.
- 2026-11-14 (session 2, end, Opus 5.5): Saved and handed off. Summary of session 2: verified facts (D-014), balance + stack (D-015/16), engine/sim/terminal play (D-018 engine), day loop (D-019), 7-day SITE APPROVED mission + ice as survey evidence + Earth blackout (D-020), main/bonus tiers + stamina (D-021). Work since commit 781a543 is uncommitted.
- 2026-11-14 (action preview design, Codex): Read all project-authored Markdown files. Proposed D-022: show the environment before planning, show resource/risk/goal/opportunity-cost previews when selecting a job, and keep overall goal plus today's main goal visible. Saved `ideas/action-preview-and-mission-clarity-v1.md`; no code or balance changes.
- 2026-11-14 (planning UX clarification, Codex): Confirmed D-023 from the user's follow-up. Added child-facing teaching rules (`YOU GAIN` / `YOU GIVE UP`, words beside numbers, known vs uncertain results, no forced quiz), made the mission card's three questions explicit, and added the end-of-day cause-and-effect playback to the handoff. No code or balance changes.
- 2026-11-14 (terminal-only scope, Codex): Removed the temporary browser UI implementation and Vite setup at the user's request. Implemented D-024 in `src/cli/play.ts`: environment summary, task previews, gain/give-up language, uncertainty, and yes/no confirmation before interactive plans commit.
- 2026-11-14 (confirmation bug fix, Codex): Fixed interactive `yes` so it commits the already-validated action IDs directly instead of treating action names as numeric job numbers. Verified with a scripted terminal run; `npm run sim` still passes.
- 2026-11-14 (staged day planning, Codex): Confirmed tasks now remain in the current day. Players can select more work until crew time is used, then type `end` to resolve the whole plan and advance. Verified with two confirmed tasks followed by `end`.
- 2026-11-15 (mission management rules, Codex): Added named daily scenarios, immediate task-result messages, repeatable light tasks, once-per-day heavy tasks, and explicit failed/incomplete/complete mission result text. `npm run sim` and an interactive multi-task terminal run pass.
- 2026-11-15 (task status readout, Codex): After every confirmed task, the terminal now prints mission progress, projected Power/Oxygen/Dose/Stamina, crew time remaining, and the approval target. Projected values are clearly separated from the end-of-day resolution.
- 2026-11-15 (full interface redraw, Codex): After every confirmed task, the terminal now redraws the complete outpost interface with projected resources, queued tasks, remaining crew time, daily scenario, report-card progress, and task menu. Deterministic report-card evidence is projected before `end`; daily survival effects still resolve at `end`.
- 2026-11-15 (forecast visibility, Codex): Mission Control forecasts now appear immediately when `Call Mission Control` is confirmed, including the current outlook and the next two days. The full interface continues to show SunWatch alerts and Mission Control messages.
- 2026-11-15 (rest explanation, Codex): Clarified the immediate rest result: rest restores stamina when the day resolves, but does not refill today's crew time or reduce cumulative radiation dose.

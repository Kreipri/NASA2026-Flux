# Handoff

**Read order for any new agent:** `CONTEXT.md` -> `DECISIONS.md` -> this file -> `ideas/story-and-core-loop-v1.md` -> `CLAUDE.md` / `AGENTS.md` for working rules.

## Current Phase
Git is configured with `origin` at https://github.com/Kreipri/NASA2026-Flux on `main` (D-017). The engine, sim and chat CLI in `src/` are uncommitted work from session 2 (commit when Bea asks).

Prototyping. Rules engine, bot sim, and a **chat-play CLI** exist (`src/`). No web UI yet. Bea is playtesting in chat.

## What's Decided (details in `DECISIONS.md`)
- **Game:** kid-friendly (ages 7-12) survival resource-management game, browser-based, outpost management only (no launch/landing gameplay).
- **Setting:** real place, the **Shackleton Connecting Ridge** near the lunar south pole. Sunlit most of the year with short eclipses; permanently shadowed, extremely cold craters nearby where ice may exist (uncertain). Moon first, Mars later via a site config file (D-005, D-006, D-010).
- **Teaching goal:** "Light is a resource. Where you work decides your power, cold, and radiation risk."
- **Meters:** Power, Oxygen, Dose budget (radiation), plus Science (D-007). Crew time is a hidden limit (2 actions per shift).
- **Objective:** build the evidence for a **site report card**. Ice is one big entry, not pass/fail (D-013).
- **UI:** retro green-terminal look, inspired by Fallout's *visual interface only*, not its game concepts (D-002). Original mascot and art.
- **Accuracy rule:** setting must match official NASA info; fiction (crew, story, mascot, dates) is clearly labeled (D-009).
- **Source badges:** `LIVE` / `ARCHIVE` / `SIMULATED`, tap for a "where is this from?" card (D-008). AI text gets `[AI-written story]`, never a data badge.
- **AI:** writes event flavor and situations; a deterministic rules engine owns all numbers; bundled offline events as fallback (D-004).
- **Core loop v2 (D-019):** 14 days, 1 turn a day, 8 crew time (crew of 4), stamina meter, 12 jobs grouped by purpose, report card on screen. Numbers + sim results: `ideas/balance-pass-v2.md` (v1 is history).
- **Stack (D-016):** Vite + TS + React; engine in plain TS, seeded, with a bot sim. Plan: `ideas/tech-stack-and-prototype-plan.md`.
- **Facts verified (D-014):** Shackleton 21 km wide / 4 km deep, pole on its rim; ridge ~17 km from pole (derived); worst-case dark 73-117 h storage, longer ground-level shadows possible.
- **SunWatch:** our fictional outpost-console panel showing alerts relayed from Mission Control. Not a real device. DONKI is a research log of events, **never call it a warning or forecast service** (D-012).

## Key Files
| File | What it holds |
|---|---|
| `CONTEXT.md` | Challenge brief, data-source links, judging lens |
| `DECISIONS.md` | Every decision (D-001 to D-013) and the open-questions list |
| `ideas/story-and-core-loop-v1.md` | Story, characters (fiction), turn loop, 14-action table, tutorial mockup |
| `ideas/research-data-sources.md` | DONKI, RadLab, OSDR, Trek, CSA findings, with live-test results |
| `ideas/research-setting-facts.md` | Official south pole facts. **Verification pass table at the top overrides older lines** |
| `ideas/balance-pass-v2.md` | **Current** loop, job table, report card rules, sim results |
| `ideas/balance-pass-v1.md` | Old shift-based version (history) |
| `ideas/tech-stack-and-prototype-plan.md` | Stack choice, architecture, thin prototype scope and build order |
| `src/` | Engine, configs, bot sim, chat CLI. Run: `npm run sim`; play interactively with `npm run play` (type job numbers; `note <text>` logs feedback). State in `.run/state.json`, full transcript in `.run/playlog.txt` |
| `data/samples/` | Real archived May 2024 solar storm data (DONKI + RadLab CRaTER) with README |

## Verified by live test
- **DONKI** (`https://ccmc.gsfc.nasa.gov/DONKI-API/get/<TYPE>?startDate=&endDate=`): works from browser JS, no key, CORS open, about 120 calls remaining per window. OpenAPI spec at `/DONKI-API/v3/api-docs`.
- **RadLab** (`https://visualization.osdr.nasa.gov/radlab/api/`): returns real Moon-orbit radiation (CRaTER on LRO, hourly, uGy/h). Data ends sometime in 2024-25. No CORS header, so bundle snapshots. Always filter by time (unfiltered >10 MB).
- **May 2024 storm:** lunar-orbit dose rate rose from about 5 to about 3,150 uGy/h while DONKI logged flares, particle events, and a Kp 9 geomagnetic storm. Samples are in `data/samples/`.

## Warnings for the next agent
- **The Artemis plan changed in 2026** (per research: Artemis III is now an Earth-orbit test, first landing Artemis IV in 2028, Gateway paused, "Moon Base" announced). Re-verify on nasa.gov before quoting dates, names, or crew sizes. We state no exact dates as fact.
- **Use the verification table** in `ideas/research-setting-facts.md`. Dropped: "-280 F" (not on the page), "5.6% ice" (use "a few percent, patchy"). Still unverified: Chang'e-4 dose (China, **not NASA**), Orion 150 mSv, ISS 6-month dose, 1.3 s delay.
- **Ridge distance (~17 km / 10 mi) is our arithmetic** from NASA-hosted coordinates. Label it "worked out", don't cite it as a NASA statement.
- **Balance numbers are hand math.** Build the bot sim before trusting them.
- Most OSDR studies are **mice or cells, not astronauts**. Label honestly.
- Moon Trek, OSDR terms, and OSDR keyword results are **still unverified** (JS-only pages).
- **Two entries are numbered D-018** (attribution rule, and the engine/bot sim). Both were made in parallel by different agents; refer to them by title. Next new decision is D-020.
- The user wants **light usage**: concise text, no subagents or big workflows unless asked, no Figma/HTML builds in ideation (see `CLAUDE.md`).

## Next Steps (suggested order)
1. **Bea playtests v2** in the terminal (`npm run play`). Read `.run/playlog.txt` + her `note` lines, tune `src/config/moon.json`, rerun `npm run sim`.
2. **Name the crew and mascot** (original, fictional).
3. **Web UI** (D-016): Vite + React skin over the same engine. Ask Bea first.
4. **Data plan:** bundle more archived storms so the second storm can be real (ARCHIVE) instead of SIMULATED.
5. Write the short **datasets explanation** for judges.

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
ideas/         Story, research, wireframes (markdown)
data/samples/  Real archived NASA data snapshots + README
```
Add `src/` and `docs/` when those phases begin.

## Session Log
- 2026-11-14 (Git workflow advice, Codex): Saved a proposed branch/PR workflow in `ideas/git-workflow.md`. No branches, protection settings, commits, or pushes changed for this advice.
- 2026-11-14 (Git attribution, Codex): Verified GitHub lists only `Kreipri` as collaborator and both initial commits use the user's Git identity with no co-authors. Saved the no-agent-collaborator/co-author rule in `AGENTS.md` and D-018.
- 2026-11-14 (Git setup, Codex): Initialized `main`, connected the supplied GitHub repository, added `.gitignore`, and pushed the initial snapshot to `origin/main`. No gameplay changes made. Prototype files are being added concurrently; files created after staging are outside this snapshot.
- 2026-11-14 (session 1, Sonnet 5.5): Set up context, decisions, and handoff structure. Researched all 7 provided links plus live API tests (DONKI, RadLab). Researched official south pole setting, radiation risk, and astronaut tools via research agents. Decided setting (Shackleton Ridge), badges, SunWatch, AI role, report-card objective. Drafted story, 14-action table, and tutorial mockup. Saved sample data. Nothing built in code.
- 2026-11-14 (session 2, Opus 5.5): Balance pass v1 (`ideas/balance-pass-v1.md`). Verified Shackleton size/pole position and most snippet-only facts on nasa.gov/NTRS pages (curl, exact wording); corrected eclipse hours, dropped -280 F and 5.6% ice. Picked stack (Vite+TS+React) and wrote thin prototype plan. Logged D-014 to D-016. No code.
- 2026-11-14 (session 2, cont.): Bea approved D-015 and step 1. Built engine + bot sim + chat CLI, tuned from sim (D-018). Started chat playtest.
- 2026-11-14 (session 2, cont.): Bea's playtest feedback -> v2 loop (D-019): days, crew time, stamina, grouped jobs, report card on screen, emergency recovery help. Verified crew facts (Artemis IV 2 on surface, Base Camp up to 4, 2.5 h exercise). Terminal play via `npm run play`.

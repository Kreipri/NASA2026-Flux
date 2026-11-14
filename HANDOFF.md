# Handoff

**Read order for any new agent:** `CONTEXT.md` -> `DECISIONS.md` -> this file -> `ideas/story-and-core-loop-v1.md` -> `CLAUDE.md` / `AGENTS.md` for working rules.

## Current Phase
Git is configured with `origin` at https://github.com/Kreipri/NASA2026-Flux on `main` (D-017). Commit `781a543` holds the day-based loop. **Uncommitted on disk:** the 7-day mission, main/bonus tiers, stamina tuning, Earth-blackout explanation and their docs (D-020, D-021), plus other agents' `ideas/ice-*.md` and `ideas/ui-base-overview-v1.md`. Commit only when Bea asks; no agent co-author trailers (D-018 attribution rule).

Prototyping. A playable **terminal prototype** exists (`npm run play`, 7-day mission by default). Rules engine + bot sim tune the numbers. No web UI yet; a visual main-screen draft is proposed in `ideas/ui-base-overview-v1.md` (not decided).

## What's Decided (details in `DECISIONS.md`)
- **Game:** kid-friendly (ages 7-12) survival resource-management game, browser-based, outpost management only (no launch/landing gameplay).
- **Characters (D-024–D-026):** human player-commander, possible future customization. **Curio is the helper AI, separate from the field rover.** Current draft: `ideas/character-concepts-v3.md`, proposing an on-screen Curiosity-inspired avatar + Bram (dog), Remy (rabbit), Mica (squirrel monkey), with subtle optional animal-history tributes. Species/names/visuals unapproved. Professions are backgrounds with overlapping duties, not a required NASA crew composition.
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

## Key Files
| File | What it holds |
|---|---|
| `CONTEXT.md` | Challenge brief, data-source links, judging lens |
| `MILESTONES.md` | Hackathon goals, milestones, and the **submission checklist** (current focus) |
| `DECISIONS.md` | Every decision (through D-026) and the open-questions list |
| `ideas/character-concepts-v3.md` | **Current character proposal:** Curio as helper AI (separate field rover), Bram/Remy/Mica astronaut drafts; v2 retains verified rover/history/profession research |
| `ideas/story-and-core-loop-v1.md` | Story, characters (fiction), turn loop, 14-action table, tutorial mockup |
| `ideas/research-data-sources.md` | DONKI, RadLab, OSDR, Trek, CSA findings, with live-test results |
| `ideas/research-setting-facts.md` | Official south pole facts. **Verification pass table at the top overrides older lines** |
| `ideas/ui-mockups/title-drafts-b.html` | **Current title direction:** B's style on a whole Moon. B1 Moon horizon over the south pole (rec), B2 half Moon + zoom bubble. No Mars on title |
| `ideas/ui-mockups/title-drafts.html` | Visual mockups of title drafts A, B, C (SVG, no 3D) |
| `ideas/title-screen-drafts-v1.md` | **Proposed** title screen: 5 drafts from Bea's "Space flux" Pinterest board (rec: A, Lamp on the Ridge) |
| `ideas/objective-v1.md` | **Proposed** main objective reconciling brief + NASA reasons + kids; simulator wrapper question open |
| `ideas/fact-sources.md` | **Fact registry**: every fact shown in game, with kid wording, source link, badge, status. No row = doesn't ship |
| `ideas/real-events-deck.md` | **Proposed** 7 real storms (checked live) + real eclipse + quake/impact events |
| `ideas/storyline-v1.md` | **Proposed** storyline: intro cards, day-by-day beats + crew asks, personalized ending |
| `ideas/balance-pass-v2.md` | **Current** loop, job table, report card rules, sim results |
| `ideas/ui-base-overview-v1.md` | **Proposed** main screen: angled 3/4 base map with sky band + console (v1.1), wireframe, options |
| `ideas/ui-screens-v1.md` | **Proposed** screen map (3 screens + base hub with overlays), wireframes, style recommendation |
| `ideas/ui-mockups/all-screens.html` | **All app screens, clickable** (title, settings, 5 story cards, 10 mission screens, ending, debrief) on the 3D scene |
| `ideas/ui-mockups/ridge-3d.html` | **Current UI direction (D-023):** three.js real-scale ridge, base long lens + site view, sunlight/long-shadow |
| `ideas/ui-mockups/ridge-long-lens.html` | **Current lean:** real-scale Connecting Ridge terrain, traced shadows; site view (5 km up) + ground long lens |
| `ideas/ui-mockups/base-styles.html` | Base view styles: side view / top-down / storybook / iso diorama / 3D→vector (bonus) |
| `ideas/ui-mockups/main-screen-v2.html` | **Current** UI draft: 3 decluttered vector layouts (bottom tray / corners / side rail), 7-day mission |
| `ideas/ui-mockups/main-screen.html` | Visual draft of the base screen: vector vs 16-bit pixel, 3 camera angles, sunlight/long-shadow toggle |
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
- **Two entries are numbered D-018** (attribution rule, and the engine/bot sim). Both were made in parallel by different agents; refer to them by title. Next new decision is D-027.
- **Character draft is not a locked cast:** v3 is current; Bram/Remy/Mica and species/tributes remain proposals. Curio's helper-only role is confirmed. Do not apply v2's physical rover/recharge/sampling discussion to Curio. Its proposed rover-shaped avatar is fictional; field equipment stays separate. Attribute Soviet/Army animal missions to their actual programs; NASA hosting a history page doesn't make the flight NASA's. Do not repeat StarChild's incorrect broad "first living creatures to return" claim.
- **Crew accuracy:** F23 rechecked with NASA training/biography sources; M4 text now uses backgrounds and shared duties. Existing HTML still uses old role shorthand and needs alignment if/when UI edits are requested. No dedicated-doctor requirement or one-person-only job restrictions.
- The user wants **light usage**: concise text, no subagents or big workflows unless asked, no Figma/HTML builds in ideation (see `CLAUDE.md`).

## Next Steps (suggested order)
1. **Bea playtests the 7-day mission** in the terminal (`npm run play`, starts `week`). Read `.run/playlog.txt` + her `note` lines, tune `src/config/moon.json`, rerun `npm run sim`.
2. **Review the cast draft:** `ideas/character-concepts-v3.md` (Curio helper avatar + Bram/Remy/Mica). Curio is not the field rover. Settle species/names/visual treatment and optional tributes; preserve the verified background/duty distinction. Human commander confirmed; customization later if time permits.
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
- 2026-11-15 (Objective v1.1, Opus 5.5): D-024 (real to characters, fiction compresses facts; ice = survey). Proposed 7 weeks with weekly turns + alert days. Added F29, F60-F62 (ice purposes, astronaut routine).
- 2026-11-15 (Cast draft v3, Codex): Bea clarified Curio is the helper AI, not the exploration rover (D-026). Saved current profiles for Curio + Bram (dog/base systems), Remy (rabbit/crew health), Mica (squirrel monkey/exploring). Marked v2 physical-Curio concept as earlier exploration; proposed optional dog/Baker tributes. No art, UI, or gameplay changes.
- 2026-11-15 (Objective, Opus 5.5): Reconciled the main objective in `ideas/objective-v1.md` (first crew in the new base, 1 week, 4 tests = NASA's reasons). Wrapper (simulator vs straight mission) awaits Bea. Added F28.
- 2026-11-15 (Character follow-up, Codex): Bea prefers a familiar rover spinoff with a backstory and is considering animal-history Easter eggs. Saved v2 (Curiosity recommended; quiet tributes; no locked cast), verified NASA sources, corrected M4/F23's profession-vs-duty framing, logged D-025. Curiosity's non-solar power is a material design distinction. No art, HTML, or gameplay changes.
- 2026-11-15 (Fact confirm, Opus 5.5): F21 confirmed on the NASA tidal-locking page. F50 reworded as 1.5 AU (NASA) + inverse-square (worked out), since the ACR PDF wasn't readable. Added F26/F27 stay lengths. The current Moon Base page (updated Nov 12 2026) gives no stay length.
- 2026-11-15 (Character concepts, Codex): Recorded Bea's human commander, NASA-grounded bot, tentative animal crew, and possible later customization (D-024). Saved three bot directions with verified NASA/JPL references and a proposed beaver/rabbit/mole cast in `ideas/character-concepts-v1.md`. No art, code, or gameplay changes.
- 2026-11-15 (Fact registry, Opus 5.5): Built `ideas/fact-sources.md` (F01-F52) so every displayed fact has a source card. Still to confirm: F21 (4 cm/yr), F50 (Mars 45%). Dropped the unsourced eclipse red-glow line.
- 2026-11-15 (Title B redo, Opus 5.5): Bea liked B's style but not the slice; wants a whole Moon and no Mars yet. Built B1 (Moon horizon zoomed on Shackleton) and B2 (half Moon + zoom bubble) in `ideas/ui-mockups/title-drafts-b.html`. Awaiting pick.
- 2026-11-15 (Real events + fact checks, Opus 5.5): Checked 7 real storms live (DONKI + RadLab), wrote `ideas/real-events-deck.md`. Verified libration, Mars teaser, ice → fuel, 3 days to the Moon; clarified prelude card P4. RadLab CRaTER data ends mid-2024.
- 2026-11-14 (Title drafts, Opus 5.5): 5 ASCII title-screen drafts from Bea's Pinterest board in `ideas/title-screen-drafts-v1.md`. Recommended A (cozy lit habitat on the ridge) + mission buttons. Bea: purple OK on title/story (logged under D-023). Top 3 (A, B, C) mocked up in `ideas/ui-mockups/title-drafts.html`; Bea to pick.
- 2026-11-14 (Storyline v1.1, Opus 5.5): Added prelude, fact check (crew backgrounds, mission length, tilt vs tidal locking), kid questions, emphasis, variety options to `ideas/storyline-v1.md`. TO VERIFY: libration cause, Mars facts, ice 'rocket fuel' wording.
- 2026-11-14 (Storyline v1, Opus 5.5): Drafted intro → in-game beats → ending in `ideas/storyline-v1.md` (proposed). Not built; engine needs key-moment flags for the personalized ending.
- 2026-11-14 (UI v6.3, Opus 5.5): Applied the 8 taste fixes to `all-screens.html` (grey palette, SVG icons, reduced motion + working setting, 44 px targets, keyboard/labels, ≥14 px text, title scrim, fewer radii). Old version kept as `all-screens-v6.2.html`. Standalone `ridge-3d.html` still has the old lavender palette.
- 2026-11-14 (UI taste review, Opus 5.5): Reviewed `all-screens.html` with the design-taste-frontend skill (the requested `taste-skill:taste-skill` isn't installed). 8 findings saved in `ideas/ui-screens-v1.md` (taste review section). Top ones: lavender palette, emoji icons, no reduced motion, small tap targets and text. Not fixed yet.
- 2026-11-14 (UI v6.2, Opus 5.5): Reframed the mockup story as Junior Astronaut training (Mission 1 Moon, Mars teased as Mission 2); proposed objective change logged (would revise D-020: MISSION COMPLETE / HONORS / GOLD PATCH instead of SITE APPROVED). Restyled the 3D in the storybook palette (two-tone toon, no outlines, crisp per-pixel bands). Engine/CLI wording and experience-arc doc still say SITE APPROVED.
- 2026-11-14 (UI v6.1, Opus 5.5): `all-screens.html` now uses storybook SVG art for title/story/ending (card 2 = real orbiter photo, credit TO CONFIRM) and a 6-step Base Bot 3D tour as the tutorial. Notes in `ideas/ui-screens-v1.md` v6.1.
- 2026-11-14 (UI): Bea: keep 3D for gameplay only; title/story/ending need a different style (options proposed in chat, not chosen yet). Logged in D-023.
- 2026-11-14 (UI all screens, Opus 5.5): Built `ideas/ui-mockups/all-screens.html`: 19 screens on one three.js scene with per-screen camera flights, following `ideas/experience-arc-v1.md`. Screen table in `ideas/ui-screens-v1.md` v6. Open: title, mascot and crew names, tutorial steps.
- 2026-11-14 (UI shading v5.3, Opus 5.5): Replaced per-vertex baked light with per-pixel GPU shading in `ridge-3d.html` (height-map texture, ray-marched soft shadows, blended palette). Fixed far-wall saw-tooth (ray step cap). Needs a low-quality mode for Chromebooks later.
- 2026-11-14 (UI shading, Opus 5.5): Smoothed `ridge-3d.html` terrain shading per Bea (blurred light field, soft blue-grey bands, deep tone only in permanently shadowed craters, calmer crest). Notes: `ideas/ui-screens-v1.md` v5.2.
- 2026-11-14 (UI 3D vector, Opus 5.5): Bea wants 3D but vector-styled (D-023 updated). `ridge-3d.html` now uses banded terrain shader + toon/outlined base. Fixed a terrain bug: the widened day-5 blocking massif lifted the base area ~35 m, putting camera and base underground ("terrain too up"). It's now a narrow ridge 45 km out; crest normalised to 0 m; checked: nothing nearby rises above the base, far hills ≤0.9° at ~47 km.
- 2026-11-14 (UI 3D, Opus 5.5): Bea found the drawn look weak and chose sleek real-time 3D (D-023). Built `ideas/ui-mockups/ridge-3d.html` in three.js 0.160 (CDN): real-scale terrain with baked soft shadows, base with PBR materials and shadow maps, bloom, Earth, orbit controls, base↔site camera fly.
- 2026-11-14 (UI ridge at real scale, Opus 5.5): Built `ideas/ui-mockups/ridge-long-lens.html` from Bea's ridge references: true-scale terrain (Shackleton 21 km, base 50 m), ray-traced soft shadows, site + ground framings. Flags: rover target craters should be ~1-2 km away; ridge-to-pole distance conflicts (~10 km on Bea's map vs D-014's ~17 km). Notes in `ideas/ui-screens-v1.md` v4.
- 2026-11-14 (Team plan, Opus 5.5): Rewrote `MILESTONES.md` as the team plan: status, goals, M1-M10, 4 parallel lanes for the last ~45 min (repo, README+data write-up, form+demo, stretch story text) with T-minus checkpoints, post-hackathon phases P1-P6.
- 2026-11-14 (UI): Bea is leaning toward F (3D long-lens side view) for the base screen. Not decided yet.
- 2026-11-14 (UI 3D side views, Opus 5.5): Added side-on renders of the 3D model (long lens F, cutaway G) in `ideas/ui-mockups/side-3d.html` and as tabs in `base-styles.html`.
- 2026-11-14 (Experience arc, Opus 5.5): Drafted Bea's intro -> mission -> ending -> replay arc, fun facts, and source labels in `ideas/experience-arc-v1.md` (proposed). Not built.
- 2026-11-14 (UI base styles, Opus 5.5): Built 5 base view styles in `ideas/ui-mockups/base-styles.html` (notes: `ideas/ui-screens-v1.md` v3). Recommended A, the side-view cross-section, because it shows the light mechanism. Not decided.
- 2026-11-14 (Milestones, Opus 5.5): At ~90% of the 8 h plan. Wrote `MILESTONES.md`: goals G1-G6 vs judging lens, milestones M1-M8, submission checklist (README, datasets write-up, form text, AI disclosure, demo, merge to main). Gaps: no README, no judge data write-up, no web UI (cut).
- 2026-11-14 (UI drafts v2, Opus 5.5): Bea chose vector and called v1 too cluttered (D-022). Built 3 decluttered layouts in `ideas/ui-mockups/main-screen-v2.html`, notes in `ideas/ui-screens-v1.md` (v2 section). Recommended bottom tray. Open: report checklist hidden behind a star pill vs D-019/D-021 'shown every day'.
- 2026-11-14 (UI drafts, Opus 5.5): Built a code-drawn base-screen draft (vector + 16-bit pixel, 3 camera angles, light toggle) from Bea's references (Walkr-style UI, low-camera campfire scene). Screen map + wireframes in `ideas/ui-screens-v1.md`. Recommended vector + low camera. Open: does the cyan console replace D-002's green terminal?
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

- 2026-11-14 (branch inspection advice, Codex): Current branch is `cli-prototype` with local edits; `origin/new-ui` exists. Saved safe inspection options in `ideas/checking-other-branches.md`. No checkout, stash, commit, or push performed.

- 2026-11-14 (push destination advice, Codex): Pending work is UI/story drafts and assets on `cli-prototype`. Recommended a separate `design/mission-ui` branch from current HEAD; no checkout, commit, or push performed.

- 2026-11-14 (branch cleanup advice, Codex): Inspected local/remote branches and worktrees. Saved incremental cleanup proposal in `ideas/git-workflow.md`; no Git mutations performed. Existing branches and uncommitted work preserved.

- 2026-11-15 (post-merge advice, Codex): Remote main is now `9ce0ed4`; this folder remains on `cli-prototype` at `da62739` with uncommitted design/story/research work. Recommend creating `design/mission-ui` here, committing/pushing the drafts there, then fetching and merging `origin/main` into that branch. No branch switch, staging, commit, or push performed.

# Handoff

## Space base vector draft (2026-11-15)
- Latest: `ideas/base-designs/vector-v3/space-base.svg`; comparison: `review.html`; notes/rebuild: `README.md`. Bea suggested **no outlines** to match the sprites. v3 removes added dark contours, outlined rods and dark tunnel edging, retaining crew-v5 metal/glass gradients, pale inner rims and quiet seams. This supersedes the v2 outlined recommendation for the 2D illustration. Both prior passes are preserved.
- Comparison includes unchanged Curio/astronaut sprites, a material close-up and an isolated copy of the actual title screen (`in-screen.html`). Also includes a version without the astronaut and a 2200px transparent PNG export. All artwork is editable vector shapes/gradients/clip paths; the field rover remains separate from Curio.
- **Next:** Bea reviews the v3 rim-only version before any active story-asset swap. This is a proposed 2D illustration only, not a replacement for D-023's gameplay 3D or a request to remove gameplay outlines. Active PNG, mockups, sprites, 3D source and builders were not changed. Keep this draft isolated from concurrent scene work.

## Gameplay side dock chosen; v2 refinement (2026-11-15)
- Bea chose the **side panel** and asked for the newer zoomed-in model, smaller understandable resources, integrated Curio help and clearer Earth-link wording. Current draft: `ideas/ui-mockups/gameplay-side-dock-v2/index.html`; notes/rebuild instructions in its `README.md`. The v1 three-layout study remains preserved.
- Uses the latest `flow-start-v1.html` scene snapshot, ~58 m camera, soft VSM shadows and crew-v5 Curio. Resources are a shorter named 2×2 grid, with “Radiation: Keep low”; tapping a meter explains it inside the dock. Ask Curio replaces the dock contents and returns to the saved plan. “Earth radio: on” explains its meaning on hover, focus or tap.
- Only the side-dock arrangement is chosen. Exact v2 resource/help treatment and copy remain a visual proposal. Three resource options/trade-offs are recorded in the v2 `README.md`. Next: Bea reviews v2, then coordinate integration with whichever opening-flow source is current.
- All example numbers are SIMULATED direct-job previews; no weekly simulation or balance changes. The active scene/flow sources and other agent's work are untouched. Each draft builds only its own frozen sources; never copy its snapshot over newer shared 3D work.
- All four goals now appear in an overview; details replace the list and return through “All 4 tasks.” Visual previews and control/layout checks at 1280px/728px cover jobs, compact resources, in-dock answers, preserved plan and radio hover/tap/Escape. No child playtest yet; verify comprehension with children before treating exact copy as final.

**Read order for any new agent:** `CONTEXT.md` -> `DECISIONS.md` -> this file -> `ideas/story-and-core-loop-v1.md` -> `CLAUDE.md` / `AGENTS.md` for working rules.

## Current Phase
This checkout is on `gameplay-updates`. Its existing commit `6948ea1` imports six gameplay files from `Added-Gameplay` (`91e68e3`); latest fetched `origin/main` is `238d80a` and has been merged without conflicts. See `ideas/gameplay-updates-integration.md`. Commit only when Bea asks; no agent co-author trailers (D-018 attribution rule).

Prototyping. `npm run play` now defaults to the seven-week `weeks7` terminal mission; `solarMax` and legacy scenarios remain available. Rules engine + bot sim tune the numbers. Browser screens under `ideas/ui-mockups/` remain design prototypes, separate from the terminal engine.

## What's Decided (details in `DECISIONS.md`)
- **Game:** kid-friendly (ages 7-12) survival resource-management game, browser-based, outpost management only (no launch/landing gameplay).
- **Characters (D-024–D-026):** human player-commander, possible future customization. **Curio is the helper AI, separate from the field rover.** Current draft: `ideas/character-concepts-v3.md`, proposing an on-screen Curiosity-inspired avatar + Bram (dog), Remy (rabbit), Mica (squirrel monkey), with subtle optional animal-history tributes. Species/names/visuals unapproved. Professions are backgrounds with overlapping duties, not a required NASA crew composition.
- **Character art (D-029):** Bea requested child-friendly vector clip-art style. First generated concept sheet: `ideas/character-designs/crew-sheet-v1.png`; exact prompt and review notes beside it. Includes an example human commander. PNG concept art; individual designs remain unapproved.
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
| `DECISIONS.md` | Every decision (through D-029) and the open-questions list |
| `ideas/character-designs/` | **Newest: `crew-v5/`** crew (Bram, Remy, Mica as single-colour cat, Curio, placeholder astronaut) with character sheets in `sheets/`, drawn to match Bea's Figma Curio (`curio-original.svg`), plus a faceless placeholder astronaut sprite (6 frames + colour-band variants), Figma-ready SVGs in `export/`. Proposed. Earlier: `chibi-v4/` outfit + suit options (rec role gear + visor helmet) and `mica-options.svg`: squirrel monkey rejected, choosing tortoise / cat (rec) / simple monkey; `curio-options.svg`: Curio as a small robot with a Curiosity-style head (wheels / wheel-feet (rec) / legs). All awaiting Bea's pick. **`figma-export/`**: 54 per-character SVGs with named layers for drag-and-drop into Figma (no Figma connector in this setup). `chibi-v3/` (D-030): small cute crew SVG sheet (inside / outside / feelings rows) from `build.mjs`, preview PNG in `preview/`. `vector-v2/` (rejected styles) and sheet v1 PNG are history |
| `ideas/character-concepts-v3.md` | **Current character proposal:** Curio as helper AI (separate field rover), Bram/Remy/Mica astronaut drafts; v2 retains verified rover/history/profession research |
| `ideas/story-and-core-loop-v1.md` | Story, characters (fiction), turn loop, 14-action table, tutorial mockup |
| `ideas/research-data-sources.md` | DONKI, RadLab, OSDR, Trek, CSA findings, with live-test results |
| `ideas/research-setting-facts.md` | Official south pole facts. **Verification pass table at the top overrides older lines** |
| `ideas/ui-mockups/assets/base-clipart.png` | Clip-art render of the 3D base in the 2D crew style (no outlines, no ground blobs, low eye-level angle; transparent PNG) used on the title, P3 and M2. Re-make with `scenes/render_base.py` + `scenes/matte.py` |
| `ideas/ui-mockups/flow-start-v1.html` | **Opening flow, clickable:** title → P1-P3 → M1-M5 (storybook) → READY dissolves into the 3D ridge → Arrive (5 km) → Sun time-lapse → 5-stop crew tour → Week 1. Built by `python3 ideas/ui-mockups/scenes/build_flow.py` from `scenes/scenes-start.src.html` + the 3D engine in `all-screens.html`. `?s=week1` opens a given screen |
| `ideas/ui-mockups/scenes-start-v1.html` | **Opening scenes, visual:** title (Bea's layout) + P1-P4 + M1-M5 from `story-script-v2.md`. Built from `ideas/ui-mockups/scenes/scenes-start.src.html` with `python3 ideas/ui-mockups/scenes/build.py` (inlines chibi SVGs) |
| `ideas/ui-mockups/title-drafts-b.html` | **Title screen = B1 Moon Horizon (D-033).** B2 (half Moon + zoom) kept for reference |
| `ideas/ui-mockups/title-drafts.html` | Visual mockups of title drafts A, B, C (SVG, no 3D) |
| `ideas/title-screen-drafts-v1.md` | Title screen exploration (rounds 1-2); B1 chosen (D-033) |
| `ideas/storyboard-start-end-v1.md` | **Proposed** storyboard: game start (title → prelude → briefing → 3D tour → week 1) and ending (Earth rises → your story → stamp → next crew → lesson → Mars → debrief) |
| `ideas/story-script-v2.md` | **For Bea to finalize:** the story script with simple words, SHOW lines, tappable words, the Mission Control/Curio split (D-031) and the sourced ending (base stays, F69). Replaces v1 |
| `ideas/title-drafts-v1.md` | Title options (rec: "First Crew: Moon Base") |
| `ideas/storyline-v2.md` | **Story text source** (proposed final copy): prelude, briefing, Curio tour, 7 weekly beats with crew lines, storm templates, ending, Ask Curio |
| `ideas/gameplay-changes-7-weeks.md` | **Build spec** for the 7-week engine changes (for the next agent or collaborator) |
| `ideas/timeline-7-weeks-v1.md` | **D-028** 7-week timeline: Earth up/down cycle, long shadow, 4 storm slots from the real deck, week beats, tasks |
| `ideas/objective-v1.md` | **Proposed** main objective reconciling brief + NASA reasons + kids; simulator wrapper question open |
| `ideas/fact-sources.md` | **Fact registry**: every fact shown in game, with kid wording, source link, badge, status. No row = doesn't ship |
| `ideas/real-events-deck.md` | **Proposed** 7 real storms (checked live) + real eclipse + quake/impact events |
| `ideas/storyline-v1.md` | **Proposed** storyline: intro cards, day-by-day beats + crew asks, personalized ending |
| `ideas/balance-pass-v2.md` | **Current** loop, job table, report card rules, sim results |
| `ideas/ui-base-overview-v1.md` | **Proposed** main screen: angled 3/4 base map with sky band + console (v1.1), wireframe, options |
| `ideas/ui-screens-v1.md` | **Proposed** screen map (3 screens + base hub with overlays), wireframes, style recommendation |
| `ideas/ui-mockups/all-screens.html` | **All app screens, clickable** (title, settings, 5 story cards, 10 mission screens, ending, debrief) on the 3D scene |
| `ideas/ui-mockups/all-screens-v8.html` | v8 clip-art base without outlines |
| `ideas/ui-mockups/all-screens-v7.html` | v7 base (realistic-ish detail, two-tone toon), before the clip-art restyle |
| `ideas/ui-mockups/all-screens-v6.3.html` | Previous version, before the v7 base/Earth rework |
| `ideas/ui-mockups/assets/earth/` | Earth day, ocean-mask and cloud maps (NASA Blue Marble, copied from the three.js r160 examples); loaded locally, CDN fallback |
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
- **Decision numbering:** D-018 remains duplicated (attribution / engine). Character decisions are D-024–D-026 and D-029; mission-fiction and seven-week decisions are D-027/D-028. Character art was explicitly renumbered from a colliding D-027 to D-029 at handoff. Next new decision is D-031 (D-030 = chibi character style).
- **Character draft is not a locked cast:** v3 is current; Bram/Remy/Mica and species/tributes remain proposals. Curio's helper-only role is confirmed. Do not apply v2's physical rover/recharge/sampling discussion to Curio. Its proposed rover-shaped avatar is fictional; field equipment stays separate. Attribute Soviet/Army animal missions to their actual programs; NASA hosting a history page doesn't make the flight NASA's. Do not repeat StarChild's incorrect broad "first living creatures to return" claim.
- **Crew accuracy:** F23 rechecked with NASA training/biography sources; M4 text now uses backgrounds and shared duties. Existing HTML still uses old role shorthand and needs alignment if/when UI edits are requested. No dedicated-doctor requirement or one-person-only job restrictions.
- The user wants **light usage**: concise text, no subagents or big workflows unless asked, no Figma/HTML builds in ideation (see `CLAUDE.md`).

## Next Steps (suggested order)
1. **Review/playtest the imported 7-week mission** against `ideas/gameplay-changes-7-weeks.md`. Integration does not certify full spec coverage; the simulation completes but its balance differs from the legacy 7-day baseline. Coordinate the terminal engine with the browser mockups in a separate implementation task.
1b. **Storyline (Bea + agent):** finalize in `ideas/storyline-v2.md`; the engine pulls its copy from there.
2. **Review the first character sheet:** `ideas/character-designs/crew-sheet-v1.png` against `ideas/character-concepts-v3.md`. Curio is the helper avatar, not field equipment; human commander is an example appearance. Settle species/names/proportions and optional tributes before production assets. User chose vector clip-art style; exact designs await feedback.
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
- 2026-11-15 (Gameplay branch integration): Confirmed the six selected gameplay files were already committed/pushed on `gameplay-updates` and match `Added-Gameplay`. Fetched and merged `origin/main` at `238d80a` without conflicts; `npm run sim` completed across 3,000 seeded games. Preserved branch history and existing design assets; no gameplay edits. See `ideas/gameplay-updates-integration.md`.
- 2026-11-15 (Space base without outlines, Codex): Bea suggested removing outlines to match the sprites. Saved `ideas/base-designs/vector-v3/`: removed dark silhouette/rod/tunnel contours, retained pale inside rims and sprite shading. Comparison against v2, actual sprites and the title screen; SVG/PNG exports checked. Earlier drafts and active assets preserved.
- 2026-11-15 (Gameplay side dock v2, Codex): Recorded Bea's side-panel choice. Created `ideas/ui-mockups/gameplay-side-dock-v2/` with the latest close 3D scene, compact labelled/tappable meters, in-dock Curio topics and contextual explanations, simpler job/time copy, and Earth-radio hover/focus/tap help. Preserved v1 and concurrent source work. Exact v2 treatment remains proposed.
- 2026-11-15 (Space base style match, Codex): Saved `ideas/base-designs/vector-v2/` with the screen's slate-navy outlines, sprite-derived gradients/inner metal rims and three line weights. Comparison includes real crew-v5 sprites and an isolated title-screen placement. Rendered/checked all SVG variants and export margins; reviewed desktop, phone, light/navy and title placement. Active scenes/sprites/model preserved; matched weight recommended, draft still proposed.
- 2026-11-15 (Space base vector draft, Codex): Redrew the existing base render as grouped editable SVGs in `ideas/base-designs/vector-v1/`, with transparent PNG export and an original/vector comparison. Reviewed on navy/light and at desktop/phone sizes; checked pure-vector contents and export margins. Proposed only; active scenes/model preserved.
- 2026-11-15 (Opening flow v3.1, Opus 5.5): Base clip-art re-rendered without outlines from a low angle; placed to scale (P3: base far back near the horizon, Commander in front), one soft contact + long shadow per scene. Portraits crop the head; M1 Curio bigger; solar pin moved low on the mast and pins draw above other UI (job card above pins).
- 2026-11-15 (Gameplay layout study, Codex): Built three isolated layout drafts around a frozen copy of the latest Week 1 UI and real 3D scene; same art/type/palette/control sizes, roomier place jobs and mission tasks. A side dock recommended; no choice locked. Active mockups/model/engine untouched. Files: `ideas/ui-mockups/gameplay-layouts-v1/`, `ideas/gameplay-layouts-v1.md`.
- 2026-11-15 (Opening flow v3, Opus 5.5): crew-v5 sprites in all scenes; crew renamed Biscuit/Mochi/Pebble (D-034, proposed). Rendered the 3D base as clip-art (`assets/base-clipart.png`, black/white difference matte) and used it on title, P3, M2. 3D base camera now ~58 m away; base shadows use soft VSM shadow maps (the 2.3° Sun stretched normal shadow maps into jaggies).
- 2026-11-15 (Opening flow v2, Opus 5.5): Flow rebuilt on the v8.1 outlined base + v8 light. M4 introduces all 3 crew (tap per crewmate; Mica's rock fact F63/F64). Closer base camera. Fixed invisible tooltips blocking taps. Week 1 is playable: tap a pin → job card (moon.json numbers) → crew-time blocks + meter preview → Start week. Mica's crater line now says why it matters (ice task). Terrain shading patched in the flow build only (bicubic height reads + softer shadow edges) to remove stair-step shadows; `all-screens.html` itself is unchanged. Still uses chibi-v4 crew art (crew-v5 folder was mid-rename).
- 2026-11-15 (Crew files renamed, Opus 5.5): Bea asked for crew-wide names. `curio-style-v5/` → `ideas/character-designs/crew-v5/`; Curio source → `curio-original.svg`; overview → `crew-lineup.svg`; sheets → `sheets/<name>-sheet.svg`; Figma singles → `export/{bram,remy,mica,curio,astronaut}.svg` + `astronaut-frames/`, `astronaut-colours/`. Comment-only references in UI mockups/docs updated.
- 2026-11-15 (Gameplay 3D v8.1, Opus 5.5): Bea liked v8 and asked for outlines or a more 2D look. Added screen-space inverted-hull outlines (#27304C, ~3.6 px at 1280 wide, scales with the frame) on all base parts except screens, glows and shine. Also a crisper rim band, a weaker sun, and an 'Outlines: on/off' button by ◀ ▶. v8 kept as `all-screens-v8.html`. Earth, rocks and terrain have no outlines.
- 2026-11-15 (Opening flow v1, Opus 5.5): Joined the storybook scenes and the 3D scene into `ideas/ui-mockups/flow-start-v1.html`. 3D screens use the same kid-sized captions, faces, word pop-ups and ✓ source badges; 3D sky tinted purple; a visible Sun sprite follows the light; cameras tilted so the action sits above the caption. Tour copy from `storyline-v2.md` §3 (sources F65, F24, F67, F09 added to the badge list). Edit the build sources, not the output files.
- 2026-11-15 (Gameplay 3D v8, Opus 5.5): Bea: copy the clip-art style in 3D (logged under D-023). Restyled the base in `all-screens.html` to the crew-v5 rules. Changes: rounded parts with per-part light-to-slate gradients, soft wrap light with strong ambient, a rim on metal, navy screens with shine, cyan beacons with halos, amber plates and the suit chest panel on modules, soft blob shadows, Curio-style navy rover wheels, chibi astronauts matching the sprite. Removed panel textures, guy wires, cables and the thin lattice. v7 kept as `all-screens-v7.html`. The terrain still uses the banded shader.
- 2026-11-15 (Gameplay 3D v7, Opus 5.5): Reworked the base in `all-screens.html` from Bea's 3 reference renders. Changes: habitat modules sit on a landed deck with legs; a ribbed tunnel runs to the shelter; lattice comms tower with floodlights and an Earth dish; solar masts cut to 10 m (F65); 6-wheel pressurised rover with a worn path toward the crater; 2 astronauts in v5 suit colours; rounded rocks; parts now sit on the real slope. The Earth is a 3D globe with real continents and storybook clouds (procedural, banded like real weather, plus the real cloud map). It is lowered to 2.4° so it isn't cropped (F20: it stays near the horizon). Added a **Reset view** button that appears once the camera is moved. Old version kept as `all-screens-v6.3.html`. Not decided by Bea yet. Standalone `ridge-3d.html` not updated. HUD still says BASE BOT (D-026 says Curio).
- 2026-11-15 (Opening scenes v3, Opus 5.5): Intro now question → why it's hard → you (`ideas/intro-v2.md`). Sources only on ✓ badges; words show plain meanings (added NASA, crew, radiation, solar panels, Pluto). Added F76 (ridges sunlit, SVS 4716). M2 Sun, shadow and top-down map synced; M3 thermometer on a dark card; M4 floor and lockers aligned with the crew.
- 2026-11-15 (Opening scenes v2, Opus 5.5): New 3-card intro "visit → stay → you" (`ideas/intro-v2.md`, proposed; replaces P1-P4, Mars only at the end). Bigger kid-sized UI; no Story tags, yellow highlights or Why chip; every ✓ badge shows its NASA source on hover/tap. M2 Sun now stays on the far horizon (shadow swings, top-down inset). M3 redrawn as a bowl; M4 room filled out; M5 fact tied to the 7-week screen; base re-shaded with long shadows.
- 2026-11-15 (Curio-style crew v5, Opus 5.5): Pulled Bea's Curio from Figma via REST API (token she supplied; not stored). Restyled Bram/Remy/Mica (cat) in its look and drew a generic astronaut placeholder sprite (idle/walk/wave, colour variants) in `ideas/character-designs/crew-v5/`. Mica species still open. Character sheets added in `crew-v5/sheets/` (Bram, Remy, Mica, Curio, placeholder astronaut: turnaround, expressions or frames, palette). v5.1: Bea liked the astronaut; animals made chibi (bigger head, big plain eyes, smaller details), Mica single-colour cat.
- 2026-11-15 (Opening scenes v1, Opus 5.5): Title re-laid out to Bea's sketch; built P1-P4 and M1-M5 storybook scenes with chibi crew (role gear) in `ideas/ui-mockups/scenes-start-v1.html`. Next: Bea's notes, then the tour hand-off and ending scenes (B3-B9).
- 2026-11-15 (Title screen picked, Opus 5.5): Bea chose B1 Moon Horizon → D-033. Crater label reworded to NASA's "inside is always in shadow" (F75 added). Logo text stays a placeholder until the game name is picked.
- 2026-11-15 (Difficulty split, Opus 5.5): D-032 decided: call home + false alarm in Solar max only; power at zero = power-saving mode. Updated the spec, timeline and script week 5. Title "Space Base Commander" checked: no exact clash.
- 2026-11-15 (Gameplay adjustments, Opus 5.5): Added story-driven must-dos #13-20 to `gameplay-changes-7-weeks.md` (speaker per line, alert choice effects, call home, forecast data, cue ids, ending inputs). Called-home copy fixed: the engine ends on oxygen or dose; power at zero = emergency mode. "Space Commander" title checked: taken.
- 2026-11-15 (Story script v2, Opus 5.5): Simplified the language (rules: show first, ≤12 words a sentence, tappable words). Checked NASA: the base habitat stays on the Moon between crews (F69). Mission Control's real jobs (F70, F71) → D-031 proposed voice split. Added F69-F74 and title drafts.
- 2026-11-15 (Story script, Opus 5.5): Wrote `ideas/story-script-v1.md`, the full story and ending in reading order for Bea to finalize. Briefing voice moved to Mission Control; called-home ending written. No new facts.
- 2026-11-15 (Storyboard + sources, Opus 5.5): Wrote `ideas/storyboard-start-end-v1.md`. Sourced every unsourced line (F63-F68: rock ages, dinosaurs, vertical panels, Apollo samples, SRAG advice, dust on panels). Ending = next crew arrives. Rule saved: always find a source, never just flag.
- 2026-11-15 (Agent-switch checkpoint, Codex): Verified character sheet PNG, exact prompt, README, v3 character brief, decisions, and handoff are saved locally. Last visual is the first proposal awaiting Bea's feedback; Curio is a helper avatar, separate from field equipment. No new commit or push made for the art. Renumbered this session's character-art decision to D-029 to resolve a new D-027 collision without changing another session's decisions.
- 2026-11-15 (Storyline v2, Opus 5.5): Wrote the final copy draft `ideas/storyline-v2.md` with the v3 cast (Curio, Bram, Remy, Mica) and 7 weeks. Renumbered my clashing decisions to D-027/D-028. Open: Mica's dinosaur line needs a source; ending crew-swap vs fly home.
- 2026-11-15 (Character design sheet, Codex): Bea requested vector clip-art character designs (D-029, originally logged as D-027). Generated and visually reviewed `ideas/character-designs/crew-sheet-v1.png` with the built-in image tool; saved exact prompt and README. Curio in helper panel, Bram/Remy/Mica astronauts, sample human commander. First proposal only; PNG, no editable SVG or UI/engine integration.
- 2026-11-15 (Build spec, Opus 5.5): Wrote `ideas/gameplay-changes-7-weeks.md` for whoever builds D-028. Focus now: finalizing the storyline.
- 2026-11-15 (7 weeks, Opus 5.5): Bea approved D-028 (renumbered from a clashing D-025). Wrote `ideas/timeline-7-weeks-v1.md` (weekly turns, alert days, 2 Earth blackouts, long shadow week 4, eclipse week 5, 4 storm slots, new task goals). Engine/CLI still run the 7-day `week`; rescale + sim not started.
- 2026-11-15 (Objective v1.1, Opus 5.5): D-027 (renumbered from a clashing D-024; real to characters, fiction compresses facts; ice = survey). Proposed 7 weeks with weekly turns + alert days. Added F29, F60-F62 (ice purposes, astronaut routine).
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

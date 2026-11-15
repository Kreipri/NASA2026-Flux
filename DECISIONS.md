# Decisions Log

Append new entries at the top. Agents: check here before proposing something that was already decided. Don't silently reverse a decision; add a new entry that supersedes it.

Status: `decided` | `proposed` | `open` | `superseded`

---

## Requested: Fresh vectorization from the actual 3D base
**Status:** decided for the source requirement; proposed for the exported artwork (Bea, 2026-11-15: “just pull up the 3d model again and try to vectorize it”).
- Use the actual Three.js base in `ideas/ui-mockups/flow-start-v1.html`; do not revise the earlier hand-drawn SVG passes. The incomplete v4 redraw was withdrawn.
- New draft: `ideas/base-designs/from-3d-v1/space-base.svg`, with transparent PNG and `review.html` comparing the export with the same-camera original 3D model. Mesh positions/proportions/camera come from the source; geometry visibility is resolved at 4× and converted to paths. Shader shading is approximated with SVG gradients and normal-based bands; no dark silhouette outlines are added.
- Generator, source snapshot, camera and SHA-256 provenance are saved beside the art. Actual 3D source and the app's integrated v3 illustration remain unchanged; no production swap requested.

## Decided: Week 1 is a guided tutorial
**Status:** decided (Bea, 2026-11-15: "make week 1 a tutorial, with an option to skip to week 2 for debugging").
- Week 1 of the seven-week mission is the real mission with a Curio guide: answer the dust alert, check the sunlight (Mission), run the air system (Base), rest (Crew), then end the week. Other jobs and End week are held back with a hint until the three are done; the recap explains what a week is. Solar max has no tutorial.
- Debug only: **More → Debug: skip to week 2** (visible with debug mode on, week 1 only) and a skip button on the guide bubble. It plays week 1 with the same three jobs and lands on the start of week 2.
- Guide steps are derived from what has been done (no extra saved step), so a reload mid-tutorial resumes correctly.

## Decided: Job-by-job weeks, one voice for objectives, 10 jobs in 3 kinds
**Status:** decided (Bea, 2026-11-15: asked for step-by-step actions, no conflict between Mission Control and Goals, simpler kid-friendly jobs; approved the proposal "go ahead with all").
- **Step-by-step:** each job runs when chosen (preview, then Do this job), shows a result card with meter changes, and spends crew time. The week closes when time hits 0 or on End week (with a confirm if time is left). Sunlight, breathing, rest, dust and faults still apply once at week end. Engine: `step()` was split into `newWeek` / `runJob` / `closeWeek`; `step()` is a wrapper and gives identical results (0 differences over 11,729 random weeks). Alerts open the week; the crater and rover-trip decisions open when the rover job starts.
- **One voice:** Mission Control gives conditions plus one ask for the week (first unfinished main goal). The Goals panel is now the **Report card** (progress and stars only). Mission jobs carry a "Report card · Light/Radiation/Ice/Shelter" tag.
- **Jobs 12 → 10, three kinds:** Mission (check sunlight, check radiation, fly the hop-drone, drive to the dark crater, cover the shelter with soil), Base (clean the solar panels, run the air system, fix what's broken), Crew (rest and exercise, take shelter). Cut from the seven-week and Solar max missions: Power-saving mode and Call Mission Control (Solar max's week-5 check-in is gone). Both stay in the engine for terminal play and legacy scenarios.
- Browser saves are now v2; older saves are discarded. Bot sim balance is essentially unchanged.
- Known gap (not new): the storm alert's free "Shelter for the peak" choice protects the crew without spending crew time, which makes the Take shelter job redundant. Needs a cost.

## Decided: Publish the current browser gameplay on a new branch
**Status:** decided (Bea, 2026-11-15: "push to a new branch").
- Use `feat/browser-gameplay`, branched from the current `gameplay-updates` checkout. Include the integrated browser game, current food-free engine and supporting documentation/backlog notes. Preserve the existing branches and use the user's configured Git identity.

## Decided: Connect the finished browser screen to the seven-week engine
**Status:** decided (Bea, 2026-11-15; requested the new gameplay on the current screen, then confirmed the screen agent had finished).
- Use the shared engine for actual week results, alerts, progress and endings. Preserve the finished opening story, 3D base and side-dock design sources. The adapter changes their generated website copy only.
- Browser controller/save code lives in `src/web/`; `npm run dev` starts the game and `npm run build` produces `dist/`. Pin/copy the existing Three.js 0.160.0 locally. Retain the current food-free resource set.
- This is engine integration, not balance tuning or new science claims. Verification and remaining imported-rule/data gaps: `ideas/browser-gameplay-integration.md`.

## Decided: Queue learning check, causal debrief and parent/teacher guide
**Status:** decided (Bea, 2026-11-15: “put them in the to do”).
- Added the three submission-audit proposals to `MILESTONES.md`, with the learning check first. Detailed task list: `/Users/bg/Coding/NASA2026-Flux/TODO.md`.
- Backlog approval only; none is implemented. This supersedes the earlier description of these items as unapproved proposals.

## Decided: Remove food for now; retain Space Base Commander as working name
**Status:** decided (Bea, 2026-11-15: “yes. also sure lets remove the food resource for now”).
- Keep Power, Air/Oxygen and Radiation as the three core systems, with crew energy limiting work. Remove food stock, meal choices, meal-based stamina effects and the food failure state from engine/configs, terminal and browser controls. Food production is not added to the submission scope.
- Updated `src/engine/engine.ts`, `src/config/{moon,scenarios}.json`, `src/cli/play.ts`, `src/web/{model.js,game.js,game.css}` and existing browser-model tests. Active older browser saves discard retired controls; old runs already ended by food are rejected rather than silently changing their outcome.
- Verified seven gameplay tests, browser build, CLI syntax and the default bot simulation. No balance retuning or browser visual verification performed. Existing concurrent browser-build work remains in place.
- Submission text, demo storyboard and rubric audit are saved in the user-requested checkout at `/Users/bg/Coding/NASA2026-Flux/ideas/` (`project-submission-draft-v1.md`, `project-demo-outline-v1.md`, `judging-gap-audit-v1.md`). Working title retained; team/member placeholders remain.
- Learning check, causal debrief extension and parent/teacher guide are proposals only. Complete the existing data pipeline and costly-choice rules before claiming scientific traceability or full validation.

## Decided: Integrate selected gameplay files on gameplay-updates
**Status:** decided (Bea, 2026-11-15; requested latest main plus selected Added-Gameplay work).
- Keep the six gameplay files already imported by `6948ea1`; they match `Added-Gameplay` at `91e68e3`. Merge latest `origin/main` (`238d80a`) into the existing branch, preserving its published history. No duplicate cherry-pick is needed.
- This is branch integration only; no gameplay tuning or new design decisions. Verification and scope: `ideas/gameplay-updates-integration.md`.

## Decided: Gameplay uses the side dock
**Status:** decided (Bea, 2026-11-15: "i like the side panel").
- Select A from the layout study. Preserve the current UI design; keep jobs, mission tasks and help in a stable side panel beside the 3D base. The older bottom-tray and focus-window drafts remain references.
- Follow-up draft: `ideas/ui-mockups/gameplay-side-dock-v2/index.html`, using the latest opening-flow scene and ~58 m close camera. Frozen separately to protect the other active agent's scene work.
- **Proposed refinements in v2:** shorter 2×2 labelled meters (Power, Air, Radiation, Crew energy), tap-to-explain in Curio's dock, an integrated Ask Curio row with return-to-plan, and “Earth radio: on” with hover/focus/tap explanation. Exact copy/treatment still for review. Resource alternatives and trade-offs are in the v2 `README.md`.
- Goal: children understand what each meter means, which direction is better, what a job costs and how to get help. No engine/balance changes or additional core resources.

## Proposed: Editable vector version of the story-screen space base
**Status:** proposed (2026-11-15; Bea requested trying to vectorize the space base).
- Latest draft: `ideas/base-designs/vector-v3/space-base.svg`; previous passes preserved in `vector-v1/` and `vector-v2/`. Clean SVG redraw of the existing `assets/base-clipart.png`, with named component groups and transparent background; no embedded raster or filters. Includes a version without crew, a transparent PNG export and `review.html`.
- **Latest style steering (Bea, 2026-11-15):** try no outlines to match the sprites. v3 removes the dark contours/outlined rods/tunnel edge, keeping crew-v5 shading, pale inner metal rims, quiet seams and shared accent colours. This supersedes the v2 outlined recommendation below for this 2D illustration; no global change to D-023's gameplay outlines. Final artwork remains a draft.
- **Style follow-up (Bea, 2026-11-15):** match the screens/sprites, including outline and line width. v2 uses the screen's #27304C contour, the crew-v5 metal gradients and clipped pale inner rim, quieter seams/grid and shared glass/cyan/amber colours. Three weights: fine 2.2 / match 3.2 (recommended) / bold 4.2 SVG units. Compare directly with unchanged Curio/astronaut sprites and an isolated title-screen placement; no choice of final weight locked.
- Recommend the clean redraw over automatic raster tracing (messy paths) or projecting every 3D face (dense geometry). Trade-off: simplified reconstruction rather than pixel-identical shading/perspective. Notes and drawing source in the draft folder.
- Visual trial only; await Bea's review before swapping story assets. D-023's 3D gameplay direction, the current PNG, active mockups and their builders are preserved.

## Proposed: Roomier gameplay layouts, preserving the current UI design
**Status:** superseded (2026-11-15; Bea chose the side dock; see the decision above).
- Compare **A: side dock (recommended)**, **B: bottom tray**, and **C: focus window** for both place jobs and mission tasks. Preserve the latest Week 1 flow's fonts, colours, control sizes and actual v8.1 3D base; change arrangement and when competing panels are shown.
- Draft: `ideas/ui-mockups/gameplay-layouts-v1/index.html`; rationale and trade-offs: `ideas/gameplay-layouts-v1.md`. A was selected; current refinement is `ideas/ui-mockups/gameplay-side-dock-v2/index.html`.
- Another agent is using the active mockups. This study freezes its own scene/CSS/assets/config snapshot and rebuilds only its own files. The active flow, 3D source and engine were not edited.

## Open Questions
- [ ] **UI style (2026-11-14):** Bea's references point to a Walkr-like cyan console (speech bubble + portrait, resource stack) and a low-camera illustrated scene. Does this replace D-002's green-terminal look? (Vector chosen, see D-022.) Drafts: `ideas/ui-screens-v1.md`, `ideas/ui-mockups/main-screen.html`.
- [x] ~~Ice mechanic accuracy~~ -> resolved in D-020: ice is site-survey evidence (option 1 of `ideas/ice-science-check.md`); the air-power discount is removed.
- [x] ~~Site~~ -> decided, see D-005 (Moon first, Mars later).
- [x] ~~Core resources~~ -> decided, see D-007 (revisitable).
- [x] ~~Teaching goal / one real constraint~~ -> decided, see D-010: "Light is a resource. Where you work decides your power, cold, and radiation risk."
- [x] ~~How AI is used~~ -> decided, see D-004.
- [x] ~~Story objective~~ -> decided, see D-013 (site report card). Story draft: `ideas/story-and-core-loop-v1.md` (awaiting Bea's full review).
- [x] ~~Action list and costs~~ -> decided v1, see D-015 + D-018 (`ideas/balance-pass-v1.md`). Bot sim done; needs kid playtest.
- [ ] **Crew species, names and mascot design:** human player-commander confirmed (D-024). Curio is the helper AI, separate from the exploration rover (D-026); rover-history inspiration and animal-spaceflight Easter eggs remain the direction. Current draft: `ideas/character-concepts-v3.md` proposes Curio + Bram (dog), Remy (rabbit), Mica (squirrel monkey). Species/names/visuals remain drafts. Crew stays 4 (D-019); professions/duties distinction in D-025.
- [x] ~~Tech stack~~ -> see D-016 (Vite + TS + React, plain-TS engine).
- [ ] **Data plan:** DONKI can be called from the browser (verified). RadLab needs bundled snapshots. Decide live-vs-archive mix and the fallback. (Prototype: ARCHIVE only.)
- [x] ~~Source Shackleton's size and distance from the pole~~ -> verified, see D-014 and `ideas/research-setting-facts.md` (verification pass).
- [~] **Verify snippet-only facts:** most done (D-014). Still open: Chang'e-4 (non-NASA), Orion 150 mSv, ISS 6-month dose, 1.3 s delay, "Centennial" 10 cm.

---

## D-034: Crew renamed to fit the crew-v5 look: Biscuit, Mochi, Pebble
**Status:** proposed (Bea asked for new names to match the new appearances, 2026-11-15)
- **Biscuit**: golden-brown dog, engineer (was Bram). **Mochi**: round white bunny, doctor (was Remy). **Pebble**: grey-blue cat, geologist/explorer (was Mica). Curio unchanged.
- Picked for kids: short, easy to read, different first letters, named after how they look (Pebble also fits the rock job).
- Alternatives if Bea wants others: dog Toffee or Rivet · bunny Clover or Pip · cat Misty or Slate.
- Applied in `ideas/ui-mockups/scenes-start-v1.html` and `flow-start-v1.html`. Story docs (`storyline-v2.md`, `story-script-v2.md`, `character-concepts-v3.md`) still say Bram/Remy/Mica until this is confirmed.

## D-033: Title screen is B1, Moon Horizon
**Status:** decided (Bea, 2026-11-15)
- Flat vector storybook style: rounded gradient logo, purple nebula sky, soft glow and twinkle (uses the title/story purple exception under D-023).
- Scene: the Moon's curve seen from above the south pole. The Sun sits on the horizon (F07). Shackleton Crater's inside is in shadow (F75), with the ice shown only as a "?" sparkle. The base is a glowing marker on the sunny ridge, labeled "Your base" and not to scale.
- UI: logo + "Junior Astronaut Training", a "The Moon · South Pole" chip, one "Start mission" button, Settings, "Real NASA data · Sources". **No Mars on the title yet.**
- The logo text is a placeholder until the game name is picked (`ideas/title-drafts-v1.md`).
- **Layout (Bea's sketch, 2026-11-15):** name top-left, 3 stacked menu buttons under it (Start mission / Real NASA data / Settings), base large on the right on the horizon, rover trail winding to the bottom-right. Mockup uses "Space Base Commander" from the sketch. Built in `ideas/ui-mockups/scenes-start-v1.html`.
- Mockup: `ideas/ui-mockups/title-drafts-b.html` (B1). Notes: `ideas/title-screen-drafts-v1.md`.

## D-028: 7-week mission (1 turn = 1 week, alert days zoom in)
**Status:** decided (Bea, 2026-11-15). Supersedes D-020's 7-day `week` default once the engine is updated. Timeline and beats: `ideas/timeline-7-weeks-v1.md`. 49 days fits NASA's base concept (~1-2 months, F27). Needs an engine rescale, a new timeline and a sim rerun. Details in `ideas/objective-v1.md` v1.1.

## D-027: Mission is real to the characters; fiction only compresses facts
**Status:** decided (Bea, 2026-11-15)
- In-world, the commander and crew are on a real mission (not a simulator). Only the player knows it's a game. Fiction compresses real facts into one mission. Real past storms are made honest by their ARCHIVE badge and source card (real date), not by the story.
- Ice purpose = **survey** (where is water, could future crews use it), not use. Matches D-020 and `ice-science-check.md`.

## D-032: Call home + false alarm are harder-mode only; power at zero = power-saving mode
**Status:** decided (Bea, 2026-11-15). The `call` job and the Feb 2024 false-alarm storm only appear in **Solar max** (harder mode). In normal mode, storm slot 3 draws a small or medium real storm, and in week 5 Remy asks for check-ups and exercise instead. Running out of power never ends the mission: the base goes into power-saving (emergency) mode, as the engine already does. Only air or radiation dose can end a run ("crew called home"). Files: `gameplay-changes-7-weeks.md` #6, #9, #12, #15, #17, #18 · `story-script-v2.md` week 5 · `timeline-7-weeks-v1.md` §3.

## D-031: Who talks when: Mission Control briefs and warns, Curio teaches and fills gaps
**Status:** proposed (Bea leaning this way, 2026-11-15). **Mission Control** does its real jobs (F70, F71, F67): weekly briefs (the plan), storm and system warnings when Earth is up, giving the mission, calling the crew home. **Curio** fills the gaps: intro and tour (tutorial), "why" answers, word pop-ups, onboard alarms and "the plan Mission Control left" when Earth is down, week summaries, "Your story". Curio suggests and never gives orders. Script: `ideas/story-script-v2.md` §1. Also adopted there: the base stays on the Moon after the crew leaves (F69); the ending shows the crew lifting off, Curio keeping the base running, and the next crew landing later (no crew overlap shown).

## D-030: Character style is small and cute (chibi); vector-v2 styles rejected
**Status:** decided (Bea, 2026-11-15: "ew i dont like that art style. i want cuter smaller characters", with 4 reference images: a screen-faced robot mascot set and a children's character sheet of a fox, duck and hedgehog).
- Take the *style traits* only, never the reference characters: head ~60% of height, tiny stub body and limbs, dot eyes, blush, no outlines, bright flat fills, one darker tone, an expression set.
- Draft: `ideas/character-designs/chibi-v3/` (`crew-chibi.svg`, generator `build.mjs`, single files `chibi-<name>.svg`). Default look is indoors in a teal flight suit with no helmet; helmet + white suit for outside. Curio gets a pixel face on a screen-shaped camera head and stays inside its help panel when outside. Species/names unchanged and still proposed.
- vector-v2 (A flat / B sticker / C badges) is history.
- **v4 options (proposed):** `ideas/character-designs/chibi-v4/` redoes Mica and offers 3 out-of-suit outfits + 3 suits. Agent rec: role gear + visor helmet. Personal colours: Bram blue, Remy pink, Mica green, You orange.

## D-029: Character art uses child-friendly vector clip-art style
**Status:** decided (Bea's design-draft request, 2026-11-15); individual character designs remain proposed.
- Renumbered from D-027 at the agent-switch checkpoint to avoid a collision with the separate mission-fiction decision; content unchanged.
- Draft characters in a child-friendly vector clip-art style, consistent with the broader flat/vector direction. User explicitly authorized a visual design pass.
- First proposal: `ideas/character-designs/crew-sheet-v1.png` (built-in image generation; vector-style PNG concept art, not an editable vector source). Exact prompt and review notes saved beside it.
- Includes Curio inside a helper panel, Bram/Remy/Mica in shared suits, and one placeholder human commander. No final species, names, appearances, or production assets approved by this request; no UI/engine changes.
- **Vector v2 (proposed, 2026-11-15):** real SVG versions in three styles in `ideas/character-designs/vector-v2/` (A flat, B sticker, C portrait badges). Agent recommends A for full-body art + C for dialogue/HUD. Style not chosen yet.

## D-026: Curio is the helper AI, separate from the exploration rover
**Status:** decided (Bea's clarification, 2026-11-15).
- Curio is the helper AI bot/companion, not the field rover deployed for mapping or samples. Replaces v2's physical-Curio/recharging/sampling concept. Existing exploration rover actions and costs remain separate.
- Current proposal: `ideas/character-concepts-v3.md`: an on-screen Curiosity-inspired avatar for explanations, tour, source cards, and Ask Curio. This character role does not require a new live AI integration or physical bot model; exact presentation remains proposed.
- Same draft proposes Bram (dog, engineering background), Remy (rabbit, medical background), and Mica (squirrel monkey, geology background), with optional Belka/Strelka and Baker tributes. These are unapproved species/names/designs, not historical animals or a fixed NASA crew manifest.

## D-025: Character professions stay accurate; simplify duties for children
**Status:** decided (Bea's accuracy instruction, 2026-11-15); exact character identities remain open.
- Preserve the earlier research distinction: engineering, medicine, and geology are credible astronaut backgrounds, not three required positions on every NASA team. Our fictional crew may use those backgrounds, with shared training and overlapping duties.
- Use simple mission duty labels where useful to children; don't imply a degree is a flight assignment or that only one character can perform each kind of work. M4 in `ideas/storyline-v1.md` and fact F23 corrected/rechecked; HTML mockups not changed.
- Current character proposal: `ideas/character-concepts-v2.md`. Bea prefers a familiar rover spinoff such as Curiosity over the earlier CADRE recommendation; animal-history tributes remain exploratory. Agent recommends Curiosity inspiration + subtle optional tributes, not a locked choice. Real Curiosity uses radioisotope power; any solar-dependent Moon adaptation is fiction.

## D-024: Human player-commander; NASA-grounded bot direction
**Status:** decided (Bea, 2026-11-15); animal crew remains a preference, not a final selection.
- Commander is human and represents the player. Customization is a possible future addition if time permits, not a prototype requirement.
- Bot concept should connect to a robot NASA actually engineered, possibly a rover/drone adaptation. Exact reference and treatment remain open; distinguish a stylized real robot from an original inspired design.
- Bea is leaning toward cute, friendly animal astronauts for the three specialists. Species and names are not decided.
- Initial draft: `ideas/character-concepts-v1.md` (CADRE + beaver/rabbit/mole were agent proposals only). Current discussion: `ideas/character-concepts-v2.md`, following Bea's preference for a familiar rover's backstory and possible animal-history Easter eggs. Existing four-person crew and gameplay costs remain.

## Open: Main objective reconciled (brief + real NASA reasons + kids)
**Status:** proposed (2026-11-15, Bea was unsure what the main objective is). Would supersede D-020's "prove this ridge" wording and refine the "Junior Astronaut" proposal.
- `ideas/objective-v1.md`: "Be the first crew to live in the new Moon base. Keep everyone safe for a week, and prove the base does what it was built for." The 4 tests map to NASA's real reasons: living off Earth / testing for Mars (Light, Shelter), radiation research (Radiation), resources (Ice).
- 7 days = the base's first week (story choice). NASA's base concept has stays of about a month (F27). Never say "NASA plans 7-day stays". Correction: 7 days is not framed as a "first landing".
- Wrapper choice open: A. training simulator of real data (recommended; makes old storms and replays honest), or B. a straight future mission.

## Proposed: Fact registry is the single source list for in-game facts
**Status:** proposed (2026-11-15, Bea: "we cite sources when we display facts")
- `ideas/fact-sources.md`: one row per fact (ID, kid wording, source link, badge, where used, status). It becomes `src/content/facts.json` and feeds the D-008 source card. A fact with no row, or one marked ✗, doesn't ship.

## Proposed: Real events deck (7 real storms + lunar eclipse)
**Status:** proposed (2026-11-15, Bea likes real storms and events for variety)
- `ideas/real-events-deck.md`. Checked live: 7 storms with both DONKI events and CRaTER dose (Mar 2012, May 2012, Sep 2017, Oct 2021, Jan 2022, Feb 2024, May 2024). Feb 2024 is a real **false alarm** (X6.3 flare, no particle event, flat dose). May 2012 is a **sneaky** storm (particles, no X flare). RadLab has no CRaTER data after mid-2024, so Oct 2024 and Nov 2025 would need SIMULATED dose.
- Also a real dated lunar eclipse (Mar 3 2026, ~58 min total) as a forecast power dip. Moonquakes and impact flashes go in as labelled game events based on NASA findings.
- Risk: storm sizes range ~25x to ~1,600x. Scale the dose and check the sim win rate per storm.

## Proposed: Storyline v1 → v2 (final copy draft in `ideas/storyline-v2.md`; v1 is history)
**Status:** proposed (2026-11-14, Bea asked for a text draft)
- Draft: `ideas/storyline-v1.md`. Crew = 3 voices for the trade-off (Engineer/power, Doctor/dose, Geologist/ice). The intro storm card is replaced by a crew card, so the day 2 flare lands as a surprise.
- In play: morning brief + 1 crew ask + 1 evening line a day. Days 2-4 teach with Mission Control's help; days 5-7 test without it (Earth blackout). Day 6 surprise storm is the climax.
- v1.1 (Bea's feedback): 4-card prelude (Apollo visited, now we stay, Moon as practice for Mars), 5-card Mission 1 briefing, a Sun time-lapse to show the lesson, "Ask Base Bot" kid-question chips, a "Did you know?" fact each day, and variety options (recommend a real storm deck + event deck; base-spot choice later).
- Fact check: crew = real *backgrounds* (engineers, physician on Artemis III, geologist in the 2025 class, Schmitt on Apollo 17), not fixed job titles. 7 days is realistic for early landings (Artemis IV ~6 days, crew of 2); Base Camp stays are ~1-2 months for 4. Proposed "Long stay: 28 days" mode replaces "Harder: 14 days". The Sun skims the horizon because of the 1.5° tilt, **not** tidal locking. Tidal locking explains why Earth sits on the polar horizon and drops out of view (the libration part is TO VERIFY).
- Ending opens with Earth rising ("tell us everything"). Praise is built from logged key moments, then crew lines, tier, lesson, Mars tease. Needs small engine flags.

## Proposed: Objective reframed as Junior Astronaut training missions (would revise D-020)
**Status:** proposed (2026-11-14, from Bea: "not centred on the ridge storyline; it's a general lesson; a Mars level is planned")
- Frame: you are a junior astronaut doing training missions. Mission 1 = Moon south pole; Mission 2 = Mars (later, via site config, D-006).
- Goal on any planet: **keep the crew safe for 7 days + complete the mission's 4 tasks.** Moon tasks stay Light / Radiation / Shelter / Ice (main + 2 bonus each, D-021).
- Tiers renamed (same stars): MISSION COMPLETE (crew safe + 4 main tasks) / HONORS (11★) / GOLD PATCH (12★). Replaces "SITE APPROVED / prove this ridge can host a Moon base".
- The Connecting Ridge stays as Mission 1's real setting, not the plot. Story opens with the general lesson ("air, power and safety are never free"). Applied in `ideas/ui-mockups/all-screens.html`; engine/CLI text and `ideas/experience-arc-v1.md` not changed yet.

## D-023: Base scene is real-time 3D (three.js) with a vector look, at real scale
**Status:** decided (Bea, 2026-11-14). Refines D-022: still vector-styled, but rendered from a real 3D model instead of drawn 2D. The uncluttered-screen rule stays.
- Vector look in 3D: terrain in flat colour bands with crisp edges, cel-shaded (toon) base parts with dark outlines, crisp shadows, no textures. Main view: long lens from near the base. Site view (~5 km up) for briefing and crater trips, with a camera fly between them.
- Real scale: base ~50 m, Shackleton 21 km / 4 km deep, ~13 km away; small shadowed craters 1-2 km away are the rover targets. Terrain shadows baked from the Sun direction (soft edges).
- **Palette (Bea OK'd the taste fixes, 2026-11-14):** neutral cool-grey regolith + navy, no violet/lavender anywhere (truer to the Moon). One SVG icon set, no emoji.
  - **Exception (Bea, 2026-11-14):** title and story screens may use some purple shades (sky, nebula) if they pair with the space theme. Ground stays cool Moon grey.
- **Look (Bea, 2026-11-14):** the 3D uses the storybook palette and flat two-tone shading (no outlines, crisp per-pixel light bands, navy sky) so story → gameplay has no harsh style jump.
- **Look update (Bea, 2026-11-15):** the 3D base, rover and crew copy the crew clip-art style (D-029, `crew-v5` rules) as closely as 3D allows. That means squircle shapes; each part light on top fading to slate; soft, mostly flat light instead of hard two-tone bands; a lighter rim on metal; navy screens with a shine streak; cyan glow; small amber plates; soft contact shadows; chibi astronauts. The terrain keeps its banded shader for now. Draft: `ideas/ui-mockups/all-screens.html` (v8). **v8.1 (Bea, 2026-11-15):** add outlines for a more 2D look. Thin dark-slate (#27304C, not black) lines, constant width on screen, plus a crisper light inner rim. This is a deliberate exception to the Curio sheet's 'no dark outlines' rule, applied to the 3D only. The mockup has an Outlines on/off button for comparison.
- **Scope (Bea, 2026-11-14):** 3D is for gameplay screens only. Title, story cards and the ending story use a different graphic style (open, see `ideas/ui-screens-v1.md` v6 follow-up).
- Draft: `ideas/ui-mockups/ridge-3d.html`. Adds three.js to the D-016 stack (UI stays HTML on top). Risk: GPU load on old school Chromebooks; keep a low-quality setting.

## Proposed: Experience arc (intro story -> mission -> ending praise -> optional replay) + fun facts
**Status:** proposed (Bea's direction 2026-11-14, awaiting OK on details)
- Draft in `ideas/experience-arc-v1.md`. Endings for every tier praise the player's own choices. Fun facts are triggered by events, max 1 a day. Source labels extend D-008 with `[✎ Story]`; facts are never AI-generated or invented.

## D-022: Vector art style; base screen must be uncluttered
**Status:** decided (Bea, 2026-11-14)
- Vector (flat shapes, soft glow), not 16-bit pixel. First drafts were "too cluttered": the scene is the hero, few panels at once. Drafts: `ideas/ui-screens-v1.md`, `ideas/ui-mockups/`.

## D-021: Main goals + bonus goals; stamina costs raised
**Status:** decided (Bea). Refines D-020's objective.
- Each question has 1 **main goal** (first star) and 2 **bonus goals**. All 4 main goals + crew healthy = **SITE PROMISING**. 11 stars = **APPROVED**, 12 = **GOLD**. Shown on screen as a checklist (`[x]` main, `+[x]` bonus).
- Main goals: log sun 2x, measure once, shelter in a storm, rover sample. Skipping shelter or the crater trip means "not proven".
- Stamina was never binding (bots stayed at 74%+). Work costs raised: outside -6 and inside -2 per crew time (were -4 and -1). Now overworking outside drops crews to ~40% (lost crew time); paced play stays above 60%.
- Power left as is: it's already the tightest meter (good players still hit an emergency 45% of the time). If playtests find power too loose, raise **job** costs (keeps choices sharp), not daily upkeep (which punishes everyone the same and mostly bites in the dark).
- Low dose (under 25%) is reachable: planner 100%, careful 76%. It competes with a second crater sample.

## D-020: 7-day mission with one overarching objective: SITE APPROVED
**Status:** decided (Bea asked for 7 days, an overarching objective, and a real challenge). The 14-day game stays available as `full`; `week` is the default.
- **Objective:** "Prove this ridge can host a Moon base." SITE APPROVED = **11+ of 12 report-card stars, at least 1 on every question, whole crew healthy**. GOLD = 12. Below that: "not approved yet" with what was missing.
- **Week timeline:** day 1 arrive (possible short eclipse), day 2 real flare alert (May 8 2024), days 3-4 real storm (May 9 building, May 10 strong), days 5-6 long shadow, days 5-7 Earth below the horizon (forecast 3 days ahead, explained in game), 50% chance of an unannounced simulated storm on day 6 or 7 (onboard alarm only). Start power 60, oxygen 70.
- **Ice = survey evidence** (adopts option 1 of `ideas/ice-science-check.md`): no air-power discount. ICE stars: rover sample / drone map before it / ice found or 2 samples. A drone alone doesn't answer the ice question, so the core trade-off (leave the light for the dark crater) is required.
- Harder 3rd stars: RADIATION needs 4 measurements; SHELTER needs final dose under 25%.
- **Sim (1,000 games):** planner wins 81% (gold 30%), careful 61%, greedy / reckless / idle / random 0%. Details in `ideas/balance-pass-v2.md` (7-day addendum).
- Earth link blackout grounded in NASA/JPL: polar base sites see Earth only about half of each month (`ideas/research-setting-facts.md`).

## D-019: Day-based loop with crew time, stamina, grouped jobs, visible report card
**Status:** decided (from Bea's first terminal playtest feedback). Supersedes D-015's "2 shifts a day" pacing and the job list in D-018 (engine entry); replaces the Science points meter (D-007) with the on-screen report card (D-013).
- 1 turn = 1 day, 14 turns. Crew of 4 (FICTION, matches NASA's Base Camp concept of up to 4) = **8 crew time** a day; jobs cost 1/2/4. Unused time rests the crew.
- **Stamina** meter sets tomorrow's crew time (8/6/4). Outside work tires 4x more than inside.
- Jobs grouped GOAL / KEEP BASE ALIVE / KEEP CREW SAFE; goal jobs tagged with their report-card entry. Removed rock samples and daily report. Added Power-saving mode.
- Power emergency: shows a "how to recover" box with a sun countdown; cleaning allowed; cost is cold (stamina) not faster oxygen loss.
- Details and sim results: `ideas/balance-pass-v2.md`. Crew facts verified in `ideas/research-setting-facts.md`.

## Proposed: Short task branches and pull requests
**Status:** proposed (2026-11-14; recommendation, no repository settings changed)
- Keep `main` runnable; push work to short task branches and merge small, verified changes through PRs. See `ideas/git-workflow.md` for options and trade-offs.

## D-018: No agent collaborator or co-author attribution
**Status:** decided (Bea)
- Don't add agent accounts as GitHub collaborators or agent co-author trailers to commits. Use the user's configured Git identity.

## D-017: Git repository
**Status:** decided (Bea supplied the repository and requested setup)
- Repository: https://github.com/Kreipri/NASA2026-Flux; primary branch: `main`.
- Track project documents, archived data, and existing prototype files. Ignore dependencies, build output, environment secrets, and local Claude settings.

## D-016: Tech stack is Vite + TypeScript + React, engine in plain TS
**Status:** decided (agent pick at Bea's request; easy to swap the UI layer if the team prefers Svelte)
- Engine is framework-free TS (deterministic, seeded, testable with Vitest), with a `moon.json` site config (D-006). React only renders. Static hosting. Bundled ARCHIVE data by default.
- Rejected: Phaser and Godot (canvas text hurts accessibility, heavier load), vanilla TS (UI state gets messy), Svelte (fewer people know it).
- Thin prototype: 5 days x 2 shifts, 6 actions, one replayed May 2024 storm, one short eclipse, mini report card. Plan in `ideas/tech-stack-and-prototype-plan.md`.

## D-018: Engine + bot sim built; tuning from sim results; chat-play prototype
**Status:** decided (Bea approved starting step 1 and asked for chat-only play)
- `src/engine/engine.ts` (deterministic, seeded), `src/config/moon.json` + `scenarios.json`, `src/sim/bots.ts`, chat CLI `src/cli/play.ts`. No dependencies, Node 24 runs the TS directly. React/Vite UI comes later (D-016).
- Sim-driven changes: power-emergency oxygen drain 10 -> 6; diminishing returns on routine logs; full-game long shadow 4-6 shifts; slice has 7 actions (adds Log sunlight). Results in `ideas/balance-pass-v1.md` (v1.1).

## D-015: Balance v1 numbers, pacing of 2 shifts a day, spacewalk choice becomes an event
**Status:** decided (Bea approved 2026-11-14); numbers stay tunable by sim and playtest
- Full table in `ideas/balance-pass-v1.md`. Meters 0-100; all numbers SIMULATED, with real ratios where we have them (battery sized to the verified 73-117 h worst-case storage; ice odds 30% from "20-40% of Cabeus floor may be wet").
- **Pacing:** 14 days x 2 shifts = 28 turns (~15 min). Replaces "3-4 shifts a day" (too long for ages 7-12).
- **"Delay or end a spacewalk"** becomes an event prompt during a crater trip, not a menu button (13 pickable actions).
- Dose meter 100 = our mission plan, never presented as a NASA limit. Report card = 4 entries with 0-3 stars.

## D-014: Fact corrections from the verification pass (refines D-010, doesn't reverse it)
**Status:** decided (facts read on nasa.gov / NTRS pages, details in `ideas/research-setting-facts.md`)
- Shackleton: **21 km (13 mi) wide, 4 km (2.5 mi) deep**; the south pole sits on its rim. Connecting Ridge (Shackleton-de Gerlache) is **about 17 km (~10 mi) from the pole**, our arithmetic from NASA-hosted coordinates, so label it "worked out".
- **Eclipses:** D-010's "hours, not weeks" is mostly right but too rosy. Worst-case storage at the rim is **73-117 h**; the longest ground-level shadow at the ridge reaches **~6-13 days** in some studies. Game wording: "usually hours, worst case a few days". The game's "long shadow" is 2-4 days and forecast in advance.
- **Drop "-280 F"** (not on the cited page). Use "as low as -414 F" and "colder than Pluto".
- Ice: say "a few percent, patchy, maybe buried" (LCROSS 3-10 wt%, orbital ~1 wt%), not 5.6%.
- 600 mSv career / 250 mSv per solar particle event, in NASA's standard by Dec 2022. Regolith shield: "about 3 m".

## D-013: Objective is a "site report card", not just finding ice
**Status:** decided (Bea approved)
- Goal: keep the crew healthy for the whole stay and build the evidence for a site report card (NASA site choice weighs lighting, terrain, comms). Evidence includes ice samples, sunlight logs, shelter performance, and the dose log.
- Ice is one big entry, not a pass/fail. Ice samples convert to oxygen and water, lowering power cost later (an investment). Better prospecting (scouting with a hop-drone, careful power use) raises the odds. Bad runs still end with "here's where to look next."
- Why: ice amounts are scientifically uncertain, so a luck-based finish would punish good play and conflicts with "decisions determine success."
- Actions list (14 actions in 4 groups, tagged REAL vs GAME) and a tutorial mockup are in `ideas/story-and-core-loop-v1.md` (Revision v1.1).

## D-012: In-game space weather panel is called "SunWatch" (fictional)
**Status:** decided (Bea)
SunWatch is our invented outpost-console panel (not a wrist device) that shows space weather bulletins relayed from Earth. Real chain (see `ideas/research-setting-facts.md` addendum): NOAA forecasters -> NASA Johnson's Space Radiation Analysis Group in Mission Control -> flight controllers -> crew. M2M-SWAO at Goddard also analyzes events. So alerts come from mission control, not from a gadget that detects storms by itself. Crews also have an onboard radiation alarm and personal dosimeters, so SunWatch can include a "my dose" readout. If the Earth link drops, the onboard alarm is the backup (real, and a good gameplay twist). No official page was found on Moon base alert displays, so the console itself is fiction. The panel itself is fictional and carries no data badge. (An earlier "wrist-computer" idea was only a Fallout UI-style inspiration, not a real NASA device, and was dropped.) The real DONKI event records shown inside it do carry badges (D-008). Never describe DONKI itself as a warning or forecast service.

## D-011: Scope is outpost management only, no launch or landing gameplay
**Status:** decided (from the challenge brief, which asks players to "manage a lunar or Martian outpost"). At most a short non-interactive landing intro. Site: Shackleton Connecting Ridge (decided in D-010).

## D-010: Setting is a Phase-3-style outpost on a sunlit south pole ridge, ice in dark craters
**Status:** decided (Bea approved, including the Shackleton Connecting Ridge as the named site). Site size and distance from the pole still need a NASA source before we quote them. Facts and sources in `ideas/research-setting-facts.md`.
- Outpost on a Shackleton-ridge-like site: sunlit most of the year, with only **short eclipses (hours, not weeks)**. The "14-day night" idea is dropped for the pole (it applies away from poles).
- Water ice lives in **permanently shadowed craters**: extremely cold (about -280 F to -414 F), no sunlight. Trips there cost power for heaters and rover, and risk time in the dark. Ice amounts are uncertain, which is itself true to the science.
- Power: solar plus batteries early. Fission Surface Power (40 kW class) is a possible late-game upgrade, as it can run through darkness and inside shadowed regions.
- Radiation: no protection on the Moon. Regolith-covered shelter is the official defense. Real space weather events from the DONKI archive (a research log of past events, not an official warning service) drive "shelter or work." The in-game alert panel is our own fictional device (placeholder name "SunWatch"), and the event data inside it carries the DONKI badge.
- Oxygen/water: use ISS recycling (98%+ water recovery) as the real reference rate.
- Dust: real hazard, good for events.
- **Fiction boundary:** crew, story, mascot, exact dates are fictional and labeled so. Don't state exact Artemis dates or crew sizes as fact because the 2026 plan has changed and some details are unpublished.
- Effect on teaching goal (revises D-007): "Light is a resource. Where you work decides your power, cold, and radiation risk." Core meters stay Power, Oxygen, Radiation.

## D-009: The setting must match official NASA information
**Status:** decided (Bea)
Site, environment, equipment, and mission facts follow official NASA/Artemis sources, not invented sci-fi. Any fictional element (crew, story, mascot) must be clearly separated from the factual setting. Each setting fact should be traceable to a source, with the source listed in `ideas/research-setting-facts.md`. This resolves the open D-007 question toward a realistic **south pole** setting; the exact teaching goal gets finalized after the setting research.

## D-008: Every real-data element wears a visible source badge
**Status:** decided (Bea asked for it); visual design proposed below
Anything in the UI that comes from a real source shows a small tag so players (and judges) can see it's real. Three states:
- `[✓ NASA DONKI · LIVE]` = fetched just now. Solid green.
- `[✓ NASA RadLab · ARCHIVE May 2024]` = real but a saved snapshot, with the date. Amber.
- `[~ SIMULATED]` = made up by the game. Dashed grey outline.

Rules:
- Tapping a badge opens a short "Where is this from?" card: source name, date, what it measures, link. (Doubles as a mini science lesson.)
- If we scale or transform a real number for gameplay, say so: `[✓ NASA RadLab · ARCHIVE · scaled for the game]`.
- AI-written text never gets a data badge. Label it `[AI-written story]` so AI content isn't mistaken for NASA data.
- Say "NASA data", never "NASA approved". NASA doesn't endorse our app. Partner sources (CSA) get their own label.
- Badge style must fit the retro terminal UI (bracketed, monospace), and must be readable for ages 7-12 (check contrast, not just color: use the symbol and word too).

## D-007: Core resources are Power, Oxygen, Radiation dose; Science is the goal
**Status:** decided (Bea), open to change if a better resource emerges
- **Power** = shared budget. **Oxygen** = survival meter. **Radiation dose** = crew safety meter. **Science** = the tempting goal that tempts players to overspend.
- Food, comms delay, dust, and thermal are event-driven or added as Mars difficulty, not core Moon meters.
- Teaching goal: ~~power is shared and the lunar night is long~~ **superseded by D-010** (the pole is mostly sunlit). A DONKI solar storm still forces a shelter-or-work trade-off.
- Reason for coupling: every resource spends power, so no choice is free.

## D-006: Site is a data-driven config, not just an art swap
**Status:** decided (Bea approved)
Moon vs. Mars differ in more than looks: comms delay, day/night length, gravity, radiation environment, dust, and available local resources. Build one engine plus a `site` config file (parameters + art), so Mars = a different config and a harder difficulty. Needs the engine to expose these as parameters from day one.

## D-005: Moon first, Mars as a later higher-difficulty mode
**Status:** decided (Bea)
Prototype targets the Moon (Artemis, south pole). Mars comes after, as a harder mode.

## D-001: Genre is survival resource management
**Status:** decided (initial direction from Bea)
Players run an outpost and balance a few scarce resources over a short mission.

## D-002: Fallout-style UI, kid-friendly
**Status:** decided (initial direction from Bea)
Reference only the **visual UI style** of Fallout (retro green terminal, monospace type, CRT glow), made friendly. Do NOT borrow its game concepts or themes. Original mascot and art, no gore or dread, plain-language text. Don't reuse Fallout IP. (Clarified by Bea: UI only, not game concepts.)

## D-003: One short overarching storyline
**Status:** decided (initial direction from Bea)
A single short, meaningful narrative arc is preferred over open-ended content. AI adds variety inside the story, not instead of it.

## D-004: AI generates dynamic situations, but the sim stays deterministic
**Status:** decided (Bea approved)
- AI writes the situations (flavor, events, dilemmas). A rules engine owns the numbers, so the science stays accurate and testable.
- AI output must be validated against a schema and can't invent resource values freely.
- **Offline fallback is mandatory:** a bundled set of pre-written events so the demo works with no API or network during judging.
- Why: keeps replayability high without letting AI break accuracy or the "no free choice" rule.

## Advisory: Inspect other branches in a separate worktree
**Status:** proposed (2026-11-14)
- For local testing while current edits remain in place, use a separate worktree. Commands and alternatives: `ideas/checking-other-branches.md`. No Git state changed.

## Proposed: Publish current design work on design/mission-ui
**Status:** proposed (2026-11-14)
- Branch from current `cli-prototype` HEAD for the pending UI/story drafts and assets. See `ideas/git-workflow.md`. No branch or remote changes made.

## Proposed: Incremental branch cleanup
**Status:** proposed (2026-11-14)
- Keep main plus short-lived task branches. Preserve current work, integrate existing branches before deleting them, and avoid rewriting history merely to split old features. Plan: `ideas/git-workflow.md`.

## Proposed: Preserve post-merge drafts on design/mission-ui
**Status:** proposed (2026-11-15)
- Following Bea’s merge of cli-prototype into main, save current uncommitted drafts on a new design branch, then integrate origin/main. This preserves drafts before updating their base; no Git changes performed while advising.

## Built: Victory screen and ending story as a separate module
**Status:** built, awaiting Bea's review (2026-11-15)
- Implements `storyline-v2.md` §5 / `story-script-v2.md` Part 5 in `src/web/ending.js` (2D storybook style; gameplay stays 3D). Tiers use the renamed stamps (GOLD PATCH 12★, HONORS 11★, MISSION COMPLETE = crew safe + 4 main goals, NOT YET). Crew called home = no stamp, a tip, nobody hurt.
- Shown after the final recap ("See your story"); debrief offers Play again / Solar max. All 13 screens are reachable from the debug menu. Details and gaps in `HANDOFF.md`.

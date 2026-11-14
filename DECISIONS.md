# Decisions Log

Append new entries at the top. Agents: check here before proposing something that was already decided. Don't silently reverse a decision; add a new entry that supersedes it.

Status: `decided` | `proposed` | `open` | `superseded`

---

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

## D-024: Mission is real to the characters; fiction only compresses facts
**Status:** decided (Bea, 2026-11-15)
- In-world, the commander and crew are on a real mission (not a simulator). Only the player knows it's a game. Fiction compresses real facts into one mission. Real past storms are made honest by their ARCHIVE badge and source card (real date), not by the story.
- Ice purpose = **survey** (where is water, could future crews use it), not use. Matches D-020 and `ice-science-check.md`.

## Proposed: 7 weeks (1 turn = 1 week, alert days zoom in)
**Status:** proposed (2026-11-15; Bea suggested it, agent recommends it). 49 days fits NASA's base concept (~1-2 months, F27). Needs an engine rescale, a new timeline and a sim rerun. Details in `ideas/objective-v1.md` v1.1.

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

## Proposed: Storyline v1 (intro → in-game beats → personalized ending)
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

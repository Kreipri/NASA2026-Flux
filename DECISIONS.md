# Decisions Log

Append new entries at the top. Agents: check here before proposing something that was already decided. Don't silently reverse a decision; add a new entry that supersedes it.

Status: `decided` | `proposed` | `open` | `superseded`

---

## Open Questions
- [x] ~~Site~~ -> decided, see D-005 (Moon first, Mars later).
- [x] ~~Core resources~~ -> decided, see D-007 (revisitable).
- [x] ~~Teaching goal / one real constraint~~ -> decided, see D-010: "Light is a resource. Where you work decides your power, cold, and radiation risk."
- [x] ~~How AI is used~~ -> decided, see D-004.
- [x] ~~Story objective~~ -> decided, see D-013 (site report card). Story draft: `ideas/story-and-core-loop-v1.md` (awaiting Bea's full review).
- [x] ~~Action list and costs~~ -> decided v1, see D-015 + D-018 (`ideas/balance-pass-v1.md`). Bot sim done; needs kid playtest.
- [ ] **Crew names and mascot:** fictional, original, not Fallout. Crew is 4: you (commander) + engineer, doctor, geologist (D-019).
- [x] ~~Tech stack~~ -> see D-016 (Vite + TS + React, plain-TS engine).
- [ ] **Data plan:** DONKI can be called from the browser (verified). RadLab needs bundled snapshots. Decide live-vs-archive mix and the fallback. (Prototype: ARCHIVE only.)
- [x] ~~Source Shackleton's size and distance from the pole~~ -> verified, see D-014 and `ideas/research-setting-facts.md` (verification pass).
- [~] **Verify snippet-only facts:** most done (D-014). Still open: Chang'e-4 (non-NASA), Orion 150 mSv, ISS 6-month dose, 1.3 s delay, "Centennial" 10 cm.

---

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

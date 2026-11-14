# Gameplay Changes for the 7-Week Mission: build spec (2026-11-15)

**For:** the next agent or Bea's collaborator. **Status:** first playable pass implemented in the terminal. `weeks7` is now the default; `week` remains as the legacy 7-day scenario. Balance, story-copy wiring, and the complete archived storm deck still need follow-up.
**Read first:** `DECISIONS.md` (D-027, D-028), `ideas/timeline-7-weeks-v1.md` (the design), `ideas/real-events-deck.md` (storms), `ideas/fact-sources.md` (fact IDs), `ideas/balance-pass-v2.md` (current numbers and sim targets).
**Story owner:** the storyline is being finalized separately (`ideas/storyline-v2.md`). Use its text for briefs, crew asks and endings. Don't write new story copy in the engine.

## Must-do changes

| # | Change | Where | Notes |
|---|---|---|---|
| 1 | **New `weeks7` scenario**, 7 turns, 1 turn = 1 week. Make it the default; keep `week` (7-day) as `legacy` until the new one is tuned. | `src/config/scenarios.json` | Same shape as `week`: `days` → `turns` + `turnUnit: "week"` |
| 2 | **Per-week rates.** Rescale `perDay` upkeep, oxygen, stamina recovery and dose to per-week values. Crew time stays at 8 blocks per turn. | `src/config/moon.json`, `src/engine/engine.ts` | Rescale, don't multiply by 7 blindly; tune with the sim (#9) |
| 3 | **Alert days.** A mid-week interrupt with one choice (e.g. shelter now / keep working), resolved at once. Max 2 per week. | engine + `src/cli/play.ts` | Events: storm arrival, eclipse, quake, impact, dust. The CLI prints the alert and waits for a choice |
| 4 | **Earth link schedule.** Up weeks 1-2, down 3-4, up 5-6, down 7 (~27-day cycle, F20). While down: no Mission Control warnings (onboard alarm only), no `call` job. | `scenarios.json` `linkDown`, engine | Later (optional): random phase shift on replays |
| 5 | **Long shadow** 3-4 days inside week 4. Forecast in week 2 (by Mission Control, before the blackout). **Lunar eclipse** alert in week 5 (hours, small power dip, F39). | scenarios + engine | Short eclipses: random, hours |
| 6 | **Storm deck.** Bundle 7 real storms (DONKI + RadLab CRaTER) and draw per slot: S1 week 2 (Earth up, medium-big), S2 week 3-4 (Earth down, any), S3 week 5-6 (**normal:** small or medium, Jan 2022 or Oct 2021; **Solar max:** false alarm Feb 2024 or small, 50/50), S4 week 7 (50%, Earth down, sneaky or big). | `scripts/build-storm-data.ts` → `src/data/storms/*.json`; engine | Queries and peaks are in `real-events-deck.md`. RadLab has no CORS: bundle. Use 12 h windows. **Dose: log scale + cap** (raw peaks vary ~25x to ~1,600x) |
| 7 | **Forbidden combo:** Mar 2012 must never land in the long-shadow week. Re-draw instead. | engine draw rule | Prevents unwinnable runs |
| 8 | **New task rules** (main + 2 bonus each, same D-021 tiers). Light: sun logged in 2 weeks / through the long shadow / 4+ weeks. Radiation: measure during 1 storm / 2 storms / a quiet week. Shelter: shelter during a storm / final dose under 25% / regolith layer. Ice: rover sample / drone map first / 2 craters. | engine report card | Ice = survey evidence, no air discount (D-020, D-027) |
| 9 | **Sim.** Rerun all bots. Report the win rate **per storm draw** and overall. Targets: planner ~80% overall and ≥60% on every draw; careless styles ~0%. | `src/sim/bots.ts` | In Solar max, add a bot that over-shelters on false alarms; it should lose stars, not the mission. Report normal and Solar max separately |
| 10 | **Key-moment log** for the personalized ending: sheltered during storm X (real date), sheltered without Earth, ignored the false alarm (Solar max), batteries lasted the long shadow, drone before rover, crater samples, power never zero. | engine state → CLI end screen | Ending copy comes from `storyline-v2.md` |
| 11 | **Source labels on every fact or data line:** storm lines carry DONKI/RadLab ARCHIVE + the real date; facts carry their F-ID card; timings are `[~ Game timing]`; compressed storms note "placed closer together than real life". | CLI text, `src/content/lines.ts` | D-008, D-027 |
| 12 | **Replay mode** "Harder: 14 days" → **"Solar max"** (more and bigger storm draws, **plus the false alarm and the `call` job**, D-032). Retire `full`, or keep it hidden. | scenarios | |

## Story-driven changes (added 2026-11-15, from `story-script-v2.md`)
These come from the finished story script. They are must-dos unless marked otherwise.

| # | Change | Notes |
|---|---|---|
| 13 | **Speaker per line (D-031).** Every brief, warning and alert carries `speaker`. Earth up: Mission Control briefs and warns. Earth down: Curio reads the onboard alarm and plays "the plan Mission Control left". Crew lines name the crew member | The speaker follows the link schedule (#4). Curio never gives orders |
| 14 | **Every alert choice needs a real effect.** Week 1 dust: Clean now / Later. Week 4 shadow starts: Save power (= `powersave` for the shadow days) / Keep everything on. Week 5 eclipse: Save power / Carry on. Storms: Shelter now / Keep working. Week 6 crater trip: One more sample (+ice chance, +cold and power cost) / Head back | Extend the existing rover `back` choice. No choice is always right (the false alarm teaches this). Tune with the sim |
| 15 | **`call` home: Solar max only** (D-032). Unlocked in week 5 (Remy asks), only when Earth is up. Normal mode: Remy asks for check-ups and exercise instead (`rest`) | Small stamina/morale boost. F61 |
| 16 | **Forecast data for the UI.** Expose the link schedule, shadow week and eclipse week so week 2 can show the calendar ("week 3 no Earth, week 4 dark") | Read-only |
| 17 | **False-alarm wrap-up (Solar max only):** if the storm-3 draw is the Feb 2024 false alarm, emit a week-end event so Curio says "No storm came" | F38 |
| 18 | **Ending inputs:** pass `ended.reason` (complete, oxygen, dose), star tier and the Earth link at the moment it ended. Mission Control calls the crew home if Earth is up; Curio does it if Earth is down | Power at zero is **emergency (power-saving) mode**, not an ending (engine already does this; D-032 keeps it). Called-home copy is for air and radiation only |
| 19 | **Visual cue ids, not prose:** each beat and alert emits a `cue` (e.g. `dust-on-panels`, `earth-sets`, `last-sunbeam`) for the UI to animate. Text comes from the script | "Show, don't tell" |
| 20 | **Tappable words (UI/content):** lines mark hard words as `[[radiation]]`; a glossary file holds the pop-ups (script §6) | Not engine work |

## Still open (not final until these are done)
- Per-week numbers and choice effects (#2, #14) need more tuning with the sim (#9); the first pass is playable but does not yet hit the old planner target.
- The current engine uses a compact metadata deck/game-scaled profiles; bundle and wire all seven archived storm snapshots before calling every storm fully real.
- No kid playtest of the 7-week loop yet.
- Optional: on replays, start some runs in an Earth-down week.

## Nice-to-have (after the must-dos)
- ~~`call` job~~ → promoted to must-do #15.
- Moonquake (F41/F42) and impact flash (F43) as rare random alert events, labelled game events.
- Plant experiment job (F62 ⚠, verify first).

## Acceptance check
- `npm run play` starts the 7-week mission and finishes in ~15 min. Alert days appear; no Mission Control lines during blackout weeks.
- `npm run sim -- weeks7` and `npm run sim -- solarMax` print overall and per-draw results. Treat the current numbers as a tuning baseline, not final acceptance.
- No fact or data line without a label (spot-check the CLI transcript `.run/playlog.txt`).
- Update `ideas/balance-pass-v2.md` (or start v3) with the new numbers and sim results, and add a line to `HANDOFF.md`.

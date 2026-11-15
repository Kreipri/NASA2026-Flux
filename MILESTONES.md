# Team Plan: Goals, Milestones, Timeline

## Learning additions queued on 2026-11-15

Bea requested adding these to the to-do list. Statuses below reflect the latest code review; this does not change the three core systems.

- [ ] **First: two-question learning check**, before and after play; include it in the child playtest.
- [x] **Causal debrief: initial implementation**, now in the ending's player-specific “What you learned” cards.
- [ ] **Debrief accuracy review**, using actual action order/location before claiming drone-first preparation, charging before darkness or outside storm exposure.
- [ ] **One-page parent/teacher guide**, with the learning objective, measured session length, discussion prompts, sources and model limits.

Task details are saved in `/Users/bg/Coding/NASA2026-Flux/TODO.md`. The time estimates and older status snapshot below are historical.

NASA Space Apps 2026 · Junior Astronaut Mission Trainer · ~8 h plan, **~90% used, ~45 min left** (as of this update).
Pick a lane, put your name on it, and post in the team chat when you hit a checkpoint.

---

## 1. Where we are (one-minute version)
- **Game:** kids 7-12 run a Moon base on a real ridge near the south pole for 7 days. One lesson: *"Light is a resource. Where you work decides your power, cold, and radiation risk."*
- **Built:** a playable terminal game (`npm run play`, Node 24+, no install), a deterministic rules engine, and a bot test (`npm run sim`) that proves choices matter. Bots that plan well pass 81% of the time; careless bots never pass.
- **Real NASA data in the game:** the May 2024 solar storm (DONKI event records + RadLab CRaTER dose in lunar orbit), labeled ARCHIVE, never LIVE.
- **Designed but not built:** web version (vector mockups in `ideas/ui-mockups/main-screen-v2.html`), intro story + endings + fun facts (`ideas/experience-arc-v1.md`), AI-written events.
- **Missing for submission:** README, datasets write-up, form text, demo.

## 2. Goals (judging lens -> our status)
| # | Goal | Status |
|---|---|---|
| G1 | Kid learns one real constraint | ✅ designed + playable |
| G2 | Gameplay tied to real NASA data | ✅ May 2024 storm, ARCHIVE badges |
| G3 | No free choice; decisions decide success | ✅ proven by bot sim |
| G4 | Replayable | 🟡 seeded runs + surprise storm; AI events not built |
| G5 | Working prototype | 🟡 terminal game works; not in a browser yet |
| G6 | Clear, traceable dataset write-up | ❌ lane B today |

## 3. Milestones
| M | Milestone | Status |
|---|---|---|
| M1 | Brief, decision log, handoff system | ✅ |
| M2 | Setting + facts checked on NASA sources | ✅ |
| M3 | Core loop + balance (power, oxygen, dose, stamina, report card) | ✅ |
| M4 | Engine + bot sim + terminal game | ✅ |
| M5 | Real storm data in game | ✅ |
| M6 | Visual direction (vector, uncluttered) | ✅ drafts |
| **M7** | **Submission package** | 🔄 **now** |
| M8 | Story experience: intro, endings, fun facts | 🔄 stretch today / next |
| M9 | Web version (browser-playable) | ⏭ after hackathon |
| M10 | AI events, more real storms, Mars mode, kid playtests | ⏭ after hackathon |

---

## 4. Today: the last ~45 minutes, in 4 lanes
Lanes run in parallel. One person per lane. If you're alone in a lane, follow its order top to bottom.

### Lane A: Repo + final link (owner: ______ , Bea suggested)
1. Commit + push current work on `cli-prototype`.
2. Merge `cli-prototype` -> `main` once lanes B and C land (T-15).
3. Make sure the repo is public and `main` runs `npm run play` from a fresh clone.
4. Paste the repo link into the form.
- **Only lane A merges to `main`.** Everyone else pushes to their own branch or sends files to A. This avoids last-minute conflicts in `HANDOFF.md` / `DECISIONS.md`.

### Lane B: README + datasets write-up (owner: ______)
1. `README.md`: what it is (2 lines), how to run, how to play (3 lines), what's real vs simulated, link to mockup + write-up.
2. `docs/data-and-sources.md`: for each source, what it is, what we used, dates, why, ARCHIVE vs SIMULATED. Sources: DONKI, RadLab CRaTER, NASA pages for setting facts (`ideas/research-setting-facts.md`, verification table on top), CSA if used.
3. Must say: "NASA data, not NASA approved." Never call DONKI a warning or forecast service.
- **Done when:** a judge can trace every real number in the game to a link.

### Lane C: Submission form + demo (owner: ______)
1. Form text: title, high-level summary, project details (what it does, how it works, who it helps), NASA data used, partner resources, references. Check the live form for exact fields and limits.
2. AI-use disclosure: AI helped with research, code, docs, and mockups; facts were checked on NASA pages; in-game AI events are designed, not built.
3. Demo: screen recording of `npm run play` reaching the day 3 real storm + shelter choice, then the vector mockup and the story arc as "where it's going." Or a short slide deck if video is hard.
4. Frame the terminal game honestly: the engine is UI-free; the web skin is the next step.

### Lane D: Stretch, story text in the game (owner: ______ , only if someone is free)
1. Add the intro cards and the 4 endings from `ideas/experience-arc-v1.md` to the terminal game (`src/cli/play.ts`, `src/content/lines.ts`).
2. Add the 5 fun facts with their source labels.
3. Text only, no number changes. Run `npm run sim` to confirm results haven't changed.
- **Hard stop at T-20.** If it isn't working by then, drop it; it goes in the submission as "designed."

### Checkpoints
| When | What |
|---|---|
| T-45 | Lanes assigned, Lane A pushes current state |
| T-20 | Code freeze. Lane D stops. B + C drafts done |
| T-15 | Lane A merges everything to `main`, fresh-clone test |
| T-10 | Lane C fills the form with final links, team reads it once |
| T-5 | **Submit.** Don't wait for the deadline |

### Cut today (say "next steps" in the submission instead)
Web UI, AI event generation, second real storm, Mars mode, crew names/mascot art.

---

## 5. After the hackathon: the path
| Phase | What | Why first |
|---|---|---|
| P1 Story | Intro, endings, fun facts, source labels (if not done today) | Makes the lesson land; text only, cheap |
| P2 Web version | Vite + React skin over the same engine, vector bottom-tray layout (D-016, D-022) | Brief asks for browser play, no download |
| P3 Kid playtest | 3-5 kids aged 7-12, watch silently, tune `src/config/moon.json`, rerun sim | Numbers are tuned by bots, not kids yet |
| P4 More real data | Bundle a second archived storm so the surprise storm is real, not simulated | Stronger G2 |
| P5 AI events | AI writes event flavor; engine owns numbers; offline fallback (D-004) | Replayability (G4) |
| P6 Mars mode | Second site config: longer delay, dust, different light (D-006) | Older kids, harder mode |

## 6. Rules everyone follows
- **Facts are never made up or AI-generated.** Invented things are labeled `✎ Story` or `~ Game number`.
- ARCHIVE data is never called LIVE. Say "NASA data," never "NASA approved."
- No Artemis dates or crew sizes as fact (the plan changed in 2026).
- Ridge distance (~17 km) is our arithmetic: say "worked out."
- Before changing game numbers, run `npm run sim` and keep the results in `ideas/balance-pass-v2.md`.

## 7. Where things live
`CONTEXT.md` brief · `DECISIONS.md` decisions · `HANDOFF.md` current state · `ideas/experience-arc-v1.md` story plan · `ideas/ui-mockups/` visuals · `data/samples/` real NASA data · `src/` game.

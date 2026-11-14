# Tech Stack + Thin Prototype Plan (2026-11-14, session 2)

**Status:** stack picked (D-016), plan proposed. No code written yet. Ask Bea before starting `src/`.

## Stack options
| Option | Good | Bad |
|---|---|---|
| **A. Vite + TypeScript + React, engine in plain TS** (pick) | Most teammates already know React. Terminal UI is text + buttons, which DOM/CSS does best (screen readers, zoom, contrast). Static build, host anywhere. | React is more than a 1-screen game strictly needs. |
| B. Vite + TS + Svelte | Smaller and simpler than React. | Fewer people know it; slower to onboard mid-hackathon. |
| C. Vanilla TS, no framework | Zero deps, tiny. | Hand-rolled UI state gets messy past 2-3 screens. |
| D. Phaser (game engine) | Good for sprites and animation. | Canvas text is bad for accessibility and for a text-heavy terminal UI. Overkill. |
| E. Godot web export | Real game editor. | Big download, slow load on school laptops, weak text accessibility. Breaks "browser, no download" in spirit. |

**Pick A.** Why: the hard part is the rules engine and the data, not graphics. A framework-free TS engine stays testable and reusable for Mars (D-006); React is just the skin, and it's what most helpers can pick up fast.

## Architecture (small)
```
src/
  engine/        pure TS, no DOM. step(state, actions, seed) -> newState + log
  config/moon.json   site config: meters, rates, actions (numbers from balance-pass-v1.md)
  data/          bundled ARCHIVE snapshots (May 2024 DONKI + RadLab, from data/samples/)
  content/       pre-written event text (offline fallback, D-004)
  ui/            React components: Meters, SunWatch, MissionControl, ActionBar, Badge, LearnCard
  sim/           headless bot players (careful / greedy / reckless) for balance checks
```
- **Deterministic:** seeded RNG, seed in the URL (`?seed=42`) so judges can replay a run.
- **Data:** ARCHIVE snapshots by default. Optional live DONKI fetch (CORS OK) with a 3 s timeout; if it fails, fall back and keep the ARCHIVE badge. Never show LIVE unless the fetch succeeded this session.
- **AI (later, not in the thin prototype):** needs a tiny server proxy, since an API key can't live in browser code. Kids never type into the AI; we send only game state, no personal data (no accounts, nothing to collect).
- **Tests:** Vitest on the engine + the bot sim (runs 1,000 seeded games per style, prints win/fail rates).
- **Hosting:** static (GitHub Pages or Netlify). Works offline once loaded.
- **A11y basics:** min 16 px monospace, contrast check on green-on-black, keyboard keys 1-6 for actions, meters use icon + word + number (not color alone), "reduce glow" toggle for the CRT effect.

## Thin prototype (one vertical slice)
**Goal:** prove the core constraint in ~5 minutes of play: *light is a resource, and a storm makes you choose shelter or work.*

**In scope**
- One ridge screen (tutorial mockup layout), 3 meters + Science, SunWatch panel, Mission Control text, turn log.
- **5 days x 2 shifts = 10 turns.**
- **6 actions:** Clean dust, Tune air, Scout with drone, Rover to dark crater, Shelter in place, Measure radiation.
- **1 replayed storm:** May 2024 (flare on day 2 alert, particles day 3), real DONKI events + CRaTER values on a learn card, `ARCHIVE May 2024` badges.
- **1 short eclipse** (2 shifts) on day 4, forecast on day 3.
- End screen: mini report card (4 entries, stars) + "what to try next time".
- 2-3 learn cards with source badges.

**Out of scope:** AI text, live DONKI, regolith piling, comms drop, fatigue, Mars, sound, mascot art.

## Build order (each step playable)
1. Engine + `moon.json` + text-only turn loop in the console. Bot sim prints outcomes. **Check the 3 player styles split** (balance-pass-v1 section 8).
2. Terminal UI skin: meters, action bar, log.
3. SunWatch + storm replay from bundled May 2024 data, badges, learn cards.
4. Tutorial lines (Mission Control) + end report card.
5. Playtest with 2-3 kids aged 7-12: can they say *why* power dropped and *why* they hid? Tune numbers.

## Risks
- **Balance by hand is fragile.** Step 1's bot sim is the safety net; don't skip it.
- **Scope creep into visuals** (CRT shaders, animation). Brief warns polish isn't accuracy. Keep effects CSS-only until step 5 passes.
- **10 turns may be too short** to feel the dust and power squeeze. If so, go to 7 days before adding features.

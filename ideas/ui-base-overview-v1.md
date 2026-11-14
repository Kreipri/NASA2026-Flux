# UI draft v1: base overview screen (2026-11-14)

**Status:** proposed. Main game screen for the web UI (D-016), built over the v2 loop (D-019). Nothing built.

## Principle
The overview has to carry the lesson: "Light is a resource. Where you work decides your power, cold, and radiation risk" (D-010). A base picture that only decorates breaks the brief ("visual polish standing in for mechanics"). So the map shows **where the light is** and **where each job happens**.

## Options
| Option | Upside | Risk |
|---|---|---|
| **A. Ridge side-view + console (pick)** | Side profile shows the real low polar sun, the sunlit ridge and the always-dark crater in one picture. Places are tappable and open their jobs. | Must not look like a room cutaway (Fallout Shelter is a Fallout *game*, D-002). A landscape profile, not stacked rooms. |
| B. Top-down base map | Familiar "base builder" view; easy to add buildings later. | Hides the sun angle, which is the whole lesson. Reads as a city builder. |
| C. Pure terminal dashboard | Closest to the CLI, cheapest to build. | Abstract for ages 7-12; loses "where you work matters". |
| D. Room-by-room screens | Rich detail per module. | Too many screens; meters drop out of sight; scope. |

Why A: it's the only one where the picture itself teaches the constraint.

## Wireframe (option A, ALL NUMBERS PLACEHOLDERS)
```
┌ DAY 4/14 · SHACKLETON RIDGE ───────── ☀ SUNNY · crew time ●●●●●●○○ ┐
│ POWER ▓▓▓▓▓▓░ 72  OXYGEN ▓▓▓▓▓░░ 61  DOSE ▓▓░░░░░ 18  STAMINA ▓▓▓▓▓░ │
├──────────────────────────────────────────────────┬─────────────────┤
│   ☀ low sun skims the horizon  →                  │ REPORT CARD     │
│ ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ │ LIGHT     ★★☆   │
│  [SOLAR]   [HAB]   [SHELTER]                      │ RADIATION ★☆☆   │
│   ▥▥ dust▲   ▣      ⌒⌒ lvl 1                       │ SHELTER   ☆☆☆   │
│ ═══════════ RIDGE (sunlit) ═════╲                 │ ICE       ☆☆☆   │
│                                  ╲   [CRATER]     │ next: log while │
│                                   ╲___▒▒▒▒▒___    │ it's dark       │
│                       always dark, as cold as -414°F                │
├────────────────────────┬─────────────────────────┴─────────────────┤
│ SUNWATCH               │ TODAY'S PLAN  (tap a place to add jobs)    │
│ ⚠ Flare alert (MCC)    │ HAB     Tune air system      ●             │
│ [✓ NASA DONKI ·        │ CRATER  Rover trip           ●●●● OUTSIDE  │
│   ARCHIVE May 2024]    │ after today: power 72→12  O2 61→45         │
│ storm likely tomorrow  │                          [ END DAY ▶ ]     │
└────────────────────────┴────────────────────────────────────────────┘
```
- Places: SOLAR (clean, repair), HAB (air, power-saving, call MCC, rest, measure radiation), SHELTER (pile soil, shelter during peak), CRATER (scout, rover trip), SKY/sun (log sunlight).
- Shadow on the map moves with the day's light state (sunny / short eclipse / long shadow).
- Badges (D-008) sit on the things they describe: SunWatch events, CRaTER reading.

## Other suggestions
1. **Crew time as 8 astronaut chips** you drop on places. Makes the hidden budget physical; outside chips glow amber (tire 4x).
2. **"After today" preview** before END DAY: shows each meter's end value. Kids learn the trade-off before paying for it.
3. **Day playback:** END DAY runs a ~3 s replay (sun moves, meters tick, one-line "why" captions). This is where consequences become visible.
4. **14-day strip** with known events (forecast eclipse, storm alert) so planning ahead is possible.
5. **Louder low-oxygen warning** (sim note: random clickers fail on O2): meter pulses + plain sentence, not just red.

## Risks / constraints
- Art budget: draw the map as green line-art / ASCII-style vector (fits D-002, cheap, scales).
- CRT effects: keep scanlines/glow subtle and add a toggle; flicker hurts readability and some kids.
- Accessibility: text + symbol on every state, not just color; DOM buttons for places (not canvas).
- Open: target device (laptop/Chromebook landscape vs tablet touch) changes layout.

---

## Revision v1.1: angled top-down view (Bea's direction, 2026-11-14)
**Bea:** wants a real visual UI (not CLI); open to web or desktop; suggests top-down at an angle so space is still visible.

**Platform:** webapp (already D-016, and the brief says "browser-playable, no download, no account"). A desktop app would break that and need installs on school machines. If a desktop feel is wanted later, make it an installable web app (PWA), same code.

**View: angled 3/4 (isometric-style) map with a sky band on top.** Replaces option A as the pick. Keeps the lesson if the sky and shadows do the work:
- Sun sits **on the horizon** and moves sideways through the day; long shadows stretch across the ground (real: polar sun stays very low; exact max elevation ~1.5° TO VERIFY).
- Sky is **black with stars even in daylight** (no air). Good one-line fact card.
- **Earth low on the horizon** = comms link. Comms-drop days could show Earth dipping out of view (TO VERIFY: Earth visibility from the ridge, libration). Otherwise keep it as a dish icon.
- Crater = dark pit with frost shimmer; shadow never leaves it.

```
┌ DAY 4/14 · SHACKLETON RIDGE ───────────── crew time ●●●●●●○○ ┐
│ POWER 72 ▓▓▓▓▓░  OXYGEN 61 ▓▓▓▓░░  DOSE 18 ▓░░░░  STAMINA ▓▓▓▓░ │
├──────────────────────────────────────────────┬────────────────┤
│  ·   ✦    ·     ◐ Earth (link up)   ·   ✦  · │ REPORT CARD    │
│ ☀ ━━━━━━━━━━━━━━━━━━━━━━ horizon ━━━━━━━━━━━ │ LIGHT     ★★☆  │
│     ◇◇SOLAR◇◇ ═══▶            ╱‾‾‾╲          │ RADIATION ★☆☆  │
│    ◇◇◇◇◇◇◇  ═══▶ shadows     │ HAB │ ═══▶    │ SHELTER   ☆☆☆  │
│          ⌒⌒SHELTER⌒⌒ ═══▶     ╲___╱          │ ICE       ☆☆☆  │
│                    ░░ rover track ░░         │                │
│                         ◢████ CRATER ████◣   │ next: log while│
│                          always dark, -414°F │ it's dark      │
├──────────────────────┬───────────────────────┴────────────────┤
│ SUNWATCH  ⚠ flare    │ TODAY'S PLAN  (drop crew chips on map) │
│ [✓ NASA DONKI ·      │ HAB ●  CRATER ●●●● OUTSIDE             │
│   ARCHIVE May 2024]  │ after today: power 72→12  O2 61→45 [▶] │
└──────────────────────┴────────────────────────────────────────┘
```

**Render tech:** SVG in React (pre-drawn iso pieces, DOM-clickable, screen-reader labels, cheap). Rejected for now: three.js low-poly 3D (nicer camera, but heavier, slower to build, accessibility harder); canvas/Phaser (already rejected in D-016).

**Style fit (D-002):** draw the map as green line-art on a dark "base camera" monitor inside the console, so the terminal look holds. Amber for warnings/outside crew; real-data badges stay bracketed text.

**Risks:** iso art is the biggest time cost (keep to ~6 objects + 3 light states); shadows must be readable without color (hatched pattern); small tap targets on dense iso maps (make each place a big hit zone with a label).

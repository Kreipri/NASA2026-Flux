# UI screens v1 + visual drafts (2026-11-14)

**Status:** proposed. Builds on `ui-base-overview-v1.md` (v1.1). Webapp, 16:9 landscape, designed at 1280×720 and scaled.

## Visual drafts
`ideas/ui-mockups/main-screen.html` (open in a browser). Base screen in two styles, each with 3 camera angles and a Sunlight / Long shadow toggle. The scene is drawn by code, so these are layout and mood drafts, not final art.
- **A: Vector.** Flat shapes, soft glow, rounded cyan console panels, Nunito + Exo 2 fonts.
- **B: 16-bit pixel.** The same scene drawn at 320×180 and snapped to a 37-color palette with dithering. Notched panels, Pixelify Sans + Press Start 2P fonts.
- **Style source (Bea's references):** the UI follows Walkr's panels and speech bubble (bubble with a name tab plus a round portrait, resource stack top right). The scene follows the campfire illustration's low camera with a big sky. Only the style is borrowed: no Walkr dog, planet or layout copied. Mascot is an original placeholder robot ("Base Bot", name TBD).

**Recommendation: A (vector).** It scales cleanly to any screen or classroom projector. The sun and shadows can move smoothly, and moving light is the lesson. Fonts stay easy to read for 7-year-olds. B has more charm, but the pixel fonts and dithering make long text and the scene harder to read. If you prefer B, use a pixel scene with a clean font for text.

**Camera recommendation: Low (like the reference)** as the main view: big sky, sun on the horizon, long shadows. Use **Wide** as the zoom-out for rover trips to the crater. **High 3/4** gives bigger tap targets but only a thin strip of sky.

**Accuracy notes for the art:**
- The sun is drawn at 4° above the horizon so the picture reads. The real maximum at the pole is about 1.5° (TO VERIFY).
- The extra fill light that makes the base readable is an art choice, not physics.
- Vertical solar arrays that turn to follow the low sun (TO VERIFY, NASA VSAT).
- Earth shows as a crescent because it sits near the Sun in the sky.
- The crater is always dark inside.

## Screen map (keep it to 3 full screens + 1 hub)
```
TITLE ──▶ BRIEFING (story cards + guided day 1) ──▶ BASE (hub, 14 days) ──▶ DEBRIEF
                                                     │ overlays, never leave the base:
                                                     ├ Place jobs card   (tap a place)
                                                     ├ Day replay + results (End day)
                                                     ├ Event prompt      (dilemma)
                                                     ├ SunWatch panel
                                                     ├ Report card (full)
                                                     ├ Power emergency help
                                                     └ "Where is this from?" source card
```
Why: kids stay oriented when the base never disappears. Every overlay closes back to the same screen.

## Wireframes (16:9, ALL NUMBERS PLACEHOLDERS)

**1. Title**
```
┌──────────────────────────────────────────────────────────────┐
│  ✦      ·        [ridge scene, slow sun drift]      ◐ Earth  │
│                                                              │
│              MOON BASE: SHACKLETON RIDGE (name TBD)          │
│                   Keep your crew safe for 14 days            │
│                                                              │
│                     [ ▶ START MISSION ]                      │
│                [ How to play ]  [ Settings ]                 │
│  Uses real NASA data · no account needed    [ Data sources ] │
└──────────────────────────────────────────────────────────────┘
```

**2. Briefing (3-4 cards, skippable, then a guided day 1)**
```
┌──────────────────────────────────────────────────────────────┐
│ [scene zooms: Earth → Moon → south pole → ridge]   step 2/4  │
│                                                              │
│                                                              │
│ (bot) ┌──────────────────────────────────────────────┐       │
│  ◉    │ BASE BOT: This ridge gets sunlight almost all │       │
│       │ year. That dark crater never does. Ice may    │       │
│       │ hide there. [✓ NASA fact] [AI-written story]  │       │
│       └──────────────────────────────────────────────┘       │
│                                        [ Skip ]  [ Next ▶ ]  │
└──────────────────────────────────────────────────────────────┘
```
Guided day 1 = the real base screen with only 2 places active and arrows ("Tap the habitat → Tune air → End day").

**3. Base (hub)**: see the HTML draft. Zones: title/day top-left · 14-day strip top-center · meters top-right · report card right · job card left (when a place is tapped) · bot bubble bottom-left · SunWatch/Report/Help buttons · crew time + End day bottom-right.

**3a. Day replay + results (after End day)**
```
┌──────────────────────────────────────────────────────────────┐
│ DAY 4 → 5        [scene plays ~3 s: sun slides, shadows      │
│                   swing, rover drives out and back]          │
│        ┌──────────── WHAT HAPPENED ────────────┐             │
│        │ ⚡ Power   72 → 48   rover trip −50     │             │
│        │ O₂ Oxygen 61 → 83   air system +30     │             │
│        │ ☢ Dose    18 → 22   outside work +4    │             │
│        │ ★ New star: ICE (first crater trip)    │             │
│        │ Why: the crater is dark, so the rover  │             │
│        │ ran heaters the whole time.            │             │
│        └──────────────────[ Next day ▶ ]────────┘             │
└──────────────────────────────────────────────────────────────┘
```

**3b. Event prompt (one dilemma, 2-3 choices, every choice costs)**
```
┌──────────────────────────────────────────────────────────────┐
│ (scene dims, warning tint)                                   │
│      ┌──────────── ⚠ STORM WHILE OUTSIDE ────────────┐       │
│      │ Particles are rising and the rover is still   │       │
│      │ at the crater. [✓ NASA DONKI · ARCHIVE 2024]  │       │
│      │ [ Drive back now ]   lose the ice sample      │       │
│      │ [ Finish the dig ]   dose +8                  │       │
│      │ [ Wait in rover  ]   ⚡ −15, dose +3           │       │
│      └───────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

**3c. SunWatch panel (slides in from the right)**
```
┌──────────────────────────────────────────────┬───────────────┐
│                                              │ SUNWATCH      │
│            (base stays visible)              │ ⚠ Flare seen  │
│                                              │ from MCC, 2h  │
│                                              │ storm likely  │
│                                              │ tomorrow      │
│                                              │ [✓ DONKI·ARCH]│
│                                              │ MY DOSE ▓▓░ 22│
│                                              │ moon-orbit    │
│                                              │ reading ~~/\~ │
│                                              │ [✓ CRaTER·ARCH│
└──────────────────────────────────────────────┴───────────────┘
```

**3d. Power emergency help (replaces the bubble, can't be missed)**
```
│ ⚠ POWER EMERGENCY (battery empty)    sun back in ☀ 2 days  │
│ How to recover: 1) Clean dust off panels (needs no power)  │
│ 2) Turn on Power-saving mode  3) Rest the crew             │
│ Cost: the base gets cold, stamina −10 a day                │
```

**3e. Source card "Where is this from?" (tap any badge)**
```
│ ✓ NASA DONKI · ARCHIVE                                 ✕  │
│ What: a real record of a solar flare on 8 May 2024.       │
│ Who: NASA's space weather database (a research log,       │
│ not a warning service). Shown as saved data, not live.    │
│ [ Open the real record ↗ ]                                │
```

**4. Debrief (mission end)**
```
┌──────────────────────────────────────────────────────────────┐
│ MISSION COMPLETE: 14 days, crew safe ✓      (or: ended day 9)│
│ ┌ SITE REPORT CARD ─────┐  ┌ YOUR 14 DAYS ──────────────────┐│
│ │ Light      ★★★        │  │ ☀☀☀☀☀ ⚡☢☢ ◐◐ ☀ ✕✕ ☀☀           ││
│ │ Radiation  ★★☆        │  │ day 7: sheltered in a real     ││
│ │ Shelter    ★★☆        │  │ storm (May 2024)               ││
│ │ Ice        ★☆☆        │  └────────────────────────────────┘│
│ └───────────────────────┘                                    │
│ What you learned: light decides power, cold and safety.      │
│ Try next time: scout with the drone before a crater trip.    │
│            [ Play again ]   [ Real data we used ]            │
└──────────────────────────────────────────────────────────────┘
```

**5. Settings (from Title and Help)**: text size, screen effects (glow) on/off, reduce motion, sound, show tutorial again.

## Risks
- Overlays stack up. Rule: one overlay at a time, and the bot bubble is the only "voice".
- The job card covers part of the scene on the left. Fine on desktop. On tablets, test that the tap targets on places are big enough (≥44 px).
- Long shadow mode is very dark by design. Check text contrast and that places stay readable.
- Moving from green terminal (D-002) to a cyan console is a style change. Needs Bea's OK (see DECISIONS open question).

---

## v2: decluttered layouts (2026-11-14, after Bea: "too cluttered, go with vector", D-022)
Draft: `ideas/ui-mockups/main-screen-v2.html` (v1 `main-screen.html` kept as history). Matches the 7-day mission (D-020): day 2 = real flare alert, day 5 = long shadow + Earth below the horizon (Earth and its pin disappear).

**What got cut, in all three layouts**
- 14-day strip → 7 small dots.
- Report card panel → a `★ 3/12` pill. Tap it to open the full report card.
- Text place labels → 5 small icon pins. The name shows on hover or when tapped. Rover and crater share one pin ("Rover · crater trips").
- Job card → only when a pin is tapped, as a popover next to the pin.
- "After today" preview → planned to show on End day hover (not drawn yet).
- Bot bubble → one short line + badges.

| Layout | Idea | Upside | Risk |
|---|---|---|---|
| **1. Bottom tray (pick)** | Bubble, meters, crew time and End day in one strip at the bottom; sky empty | All decisions in one place; the sky and sun (the lesson) are untouched | Tray darkens the foreground; tray gets crowded if more meters are added |
| 2. Corners | Day top-left, ring gauges top-right, bubble bottom-left, End day bottom-right | Calmest middle | Ring gauges are harder for 7-year-olds to compare than bars; eyes jump between 4 corners |
| 3. Side rail | Vertical "fuel gauge" meters in a left rail; End day is a ring that fills with crew time | Fuel-gauge bars read instantly; the ring shows the crew-time budget well | Rail eats the left edge; centered bubble sits on the scene |

Worth stealing from 3: the End day ring that fills with crew time.

**Check against D-019/D-021:** those say the report checklist is shown every day. v2 shows only the star count, with the checklist one tap away. Needs Bea's OK, or show the 4 main goals as 4 small ticks beside the star pill.

---

## v3: base view styles (2026-11-14)
Draft: `ideas/ui-mockups/base-styles.html` (tabs, plus a Sunlight / Long shadow switch on each). Scene only, no HUD; the bottom-tray HUD from v2 sits on top of any of these.

| Style | Upside | Risk |
|---|---|---|
| **A. Side view, cross-section (pick)** | Shows *why* the crater is dark (the sun's ray skims the rim, drawn as a dashed line) and how thick the shelter's soil is (shelter cut open, "≈3 m soil"). Easiest to read, cheapest to animate. | No depth, places in one row. Cut open only the shelter; cut-open rooms everywhere would look like Fallout Shelter (D-002). |
| B. Top-down map | Long shadows and layout read best; route planning | No sky, needs a sun-direction dial; feels like a map |
| C. Flat storybook | Most charming, closest to the campfire reference | Light is just mood, not the mechanism |
| D. Iso diorama | Whole base at a glance with space behind; big tap targets | Floating island isn't real; shadows cut at the plate edge |
| E. 3D model rendered as flat vector (bonus) | One model, every angle; moving sun gives correct shadows automatically. A, B, D could all be rendered from it. Drag to rotate. | Needs a 3D pipeline (three.js + outline effect); heavier on old Chromebooks |

D and E use the same 3D base model as v1/v2 (orthographic + toon bands + outlines for D; perspective + toon + outlines for E).

**Accuracy notes:**
- The sun height and shadow lengths are exaggerated for readability in every style.
- The top-down crater is moved closer so it fits the map.
- At the pole "north" is nearly every direction, so the top-down dial shows the sun's direction, not a compass.

**v3 addendum: the 3D model seen from the side** (`ideas/ui-mockups/side-3d.html`; also tabs F and G in `base-styles.html`)
- **F. Long lens:** the camera sits far back and zooms in, so the 3D view flattens toward a side view. Sun at its true ~2° height, real horizon, long shadows toward the viewer. The crater can't be seen from ground level.
- **G. Cutaway slab:** orthographic camera tipped 9° down, ground cut at the front. It's A's layout drawn from the 3D model. The crater is a pit on the surface, not a cross-section.
- Takeaway: the 3D route can produce a side view. But A's best teaching bit (the ray over the crater rim, the soil cross-section) is easier to draw in 2D. Option: 3D for the base, plus a 2D cross-section overlay for the crater and shelter.

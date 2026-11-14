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

---

## v4: the Connecting Ridge at real scale (2026-11-14)
Draft: `ideas/ui-mockups/ridge-long-lens.html`. Bea is leaning toward the long-lens look and asked for the ridge to matter, at realistic scale (from her reference images: LRO oblique views, NASA candidate-region map, an elevation map with Connecting Ridge sites).
- **Terrain at true scale:** base ~50 m across on the ridge crest. Shackleton is 21 km wide and 4 km deep, centred ~13 km away. Small permanently shadowed craters sit on the flanks 1-2 km away. Moon curvature is included. The layout is read off Bea's elevation map, so distances are estimates.
- **Light is traced, not painted:** shadows are ray-cast over the terrain, with soft edges for the Sun's 0.5° width. Lit crest, dark craters and the sunlit band on Shackleton's far wall all come out of the model. On day 5 a far massif blocks the low Sun: the base goes dark while distant peaks stay lit. That is the real "long shadow" mechanism.
- **Two framings, because one frame can't do both at true scale:**
  - **Site view (5 km up):** shows why the ridge matters (high and sunlit, between Shackleton and the dark craters). The base is a marked dot. Use for the briefing and crater trips.
  - **Ground long lens:** base big, horizon real. From the crest you can't see down into Shackleton, which is realistic. Use for the day-to-day base screen. Swing/zoom between them.
- **Vector look:** brightness is split into 6 smooth bands per vertex (contour fills), with outlined toon objects for the base.
- **Design choice:** the Sun is placed low behind the camera so Shackleton's far wall catches light, as in the LRO view. The Sun itself is off screen; a chip says where it is.

**Accuracy flags (TO VERIFY):**
- Rover trips should be to small shadowed craters ~1-2 km away, not 100 m (the old base model was too close). Into Shackleton itself is not plausible (4 km deep).
- Distance from the Connecting Ridge sites to the pole reads as ~10 km on Bea's elevation map. D-014 says ~17 km (our arithmetic). Check which point each figure refers to before quoting either.
- Earth's angular size (~2°) is true, so it looks big through a long lens.

---

## v5: real-time 3D (2026-11-14, D-023)
Draft: `ideas/ui-mockups/ridge-3d.html` (three.js 0.160 from a CDN, no install). Same real-scale terrain as v4, rendered properly:
- **Terrain:** heightfield (~32k vertices, dense near the base). Lighting is baked per vertex from the low Sun with soft ray-traced shadows, plus a tiled regolith detail texture.
- **Base:** PBR materials, rounded parts, a 4096 px shadow map around the base (real-time shadows), emissive windows with bloom, warm lamps at night. Rocks are instanced.
- **Sky:** stars; Earth at true angular size (~2°), nearly full because the Sun is behind the camera.
- **Views:** Base (long lens, fov ~10°) and Site (5 km up), with an eased camera fly between them. Drag to orbit, scroll to zoom. HTML labels follow 3D anchors.
- **Day 5 long shadow:** a far massif blocks the 0.5° Sun, so the base and nearby ground go dark and distant peaks stay lit.

**Risks:**
- GPU load on school Chromebooks: needs a quality toggle (shadow map size, bloom off).
- The detail texture can tile visibly at mid distance.
- The CDN dependency needs a bundled fallback for offline judging (D-004 spirit).

---

## v5: real-time 3D (2026-11-14, D-023)
Draft: `ideas/ui-mockups/ridge-3d.html` (three.js 0.160 from a CDN, no install). Same real-scale terrain as v4, rendered properly:
- **Terrain:** heightfield (~32k vertices, dense near the base). Lighting is baked per vertex from the low Sun with soft ray-traced shadows, plus a tiled regolith detail texture.
- **Base:** PBR materials, rounded parts, a 4096 px shadow map around the base (real-time shadows), emissive windows with bloom, warm lamps at night. Rocks are instanced.
- **Sky:** stars; Earth at true angular size (~2°), nearly full because the Sun is behind the camera.
- **Views:** Base (long lens, fov ~10°) and Site (5 km up), with an eased camera fly between them. Drag to orbit, scroll to zoom. HTML labels follow 3D anchors.
- **Day 5 long shadow:** a far massif blocks the 0.5° Sun, so the base and nearby ground go dark and distant peaks stay lit.

**Risks:**
- GPU load on school Chromebooks: needs a quality toggle (shadow map size, bloom off).
- The detail texture can tile visibly at mid distance.
- The CDN dependency needs a bundled fallback for offline judging (D-004 spirit).

**v5.1 (same day):**
- **Vector look in 3D, per Bea:** banded terrain shader (6 flat tones, anti-aliased edges), toon materials with 3 light steps, dark outlines on the base, crisp PCF shadows, no tone mapping (exact palette).
- **Bug fixed:** a Gaussian tail from the widened day-5 blocking hill had lifted the base area ~35 m, so the camera and base sat underground ("terrain too up").
  - Now that hill is a narrow ridge 45 km out along the Sun line, and the crest is pinned to 0 m at the base.
  - Checked numerically: no nearby terrain rises above the base, and distant hills reach ≤0.9° above the long-lens horizon at ~47 km.
  - Day 2: base lit. Day 5: base and nearby ground dark.

**v5.2 (same day): smoother vector shading** (Bea: ridge shadows looked harsh and pixelated)
- **Cause:** hard band switches on a coarse grid (cells hundreds of metres away from the base) plus near-black shadows. The outlines were not the cause.
- **Fix:**
  - The light field is blurred (3 grid passes) before banding, so band edges flow instead of zig-zagging.
  - Softer blue-grey palette with short soft edges between bands.
  - Only permanently shadowed ground (Shackleton's floor and walls, the small polar craters) gets the deep near-black tone.
  - Quieter, wider ridge crest (fewer small bumps).
  - Sunlit flat ground is brighter, so the crest reads as the bright spine.

**v5.3 (same day): per-pixel shading, blended bands** (Bea: v5.2 still harsh, and the blur looked bad)
- **Root cause:** light was computed only at mesh vertices (hundreds of metres apart away from the base), so every shadow edge followed mesh cells, blurred or not.
- **Now:**
  - A 1024×1280 height map (~70 m per sample, covering 72×90 km) lives on the GPU.
  - Each pixel gets its own slope normal and a shadow ray-marched toward the Sun, with steps capped at 300 m so thin crater rims are never skipped. That removed the saw-tooth on Shackleton's far wall.
  - Colours blend smoothly through the same blue-grey palette (no hard bands). Deep tone only in permanently shadowed craters.
  - No CPU bake needed: switching light modes is instant.
- **Mesh:** more even density (~100k quads) so far geometry is smoother.
- **Cost:** up to ~300 texture reads per terrain pixel. Fine on laptop GPUs; a school Chromebook may need a low-quality mode (fewer steps, smaller canvas).

---

## v6: every screen, clickable (2026-11-14)
Draft: `ideas/ui-mockups/all-screens.html`. One page, one shared 3D scene (D-023, v5.3 shading). Each screen sets its own camera (with an eased flight between them), light, and HTML overlay. Follows `ideas/experience-arc-v1.md` (story → 7-day mission → ending → replay). Click the screen list, the ▶ arrows, or the buttons inside a screen.

| Group | Screen | Camera | Notes |
|---|---|---|---|
| Start | Title | high orbit over the site | working title "Ridge Command" (TBD); "Uses real NASA data"; data sources link |
| Start | Settings | base, dimmed | text size, **Graphics Low/High** (Chromebooks), glow, reduce motion, sound, tutorial again |
| Story | 1 Future · 2 You · 3 Light & ice · 4 Storms · 5 Goal | high → site → into Shackleton → sky/Earth → base | bot card + source label, 5 dots, Skip |
| Mission | Day 1 tutorial | base | HUD faded, only 2 pins active, coach bubble "Step 1 of 3" |
| Mission | Plan the day (hub) | base long lens | bottom tray: bot, meters, crew chips, End day; pins on 3D |
| Mission | Place jobs | base | job card beside the tapped pin, costs + report-card tags |
| Mission | SunWatch | base | alert relayed by Mission Control, DONKI/CRaTER ARCHIVE badges, my dose |
| Mission | Report card | base, dimmed | 4 questions × main + 2 bonus; tiers PROMISING → APPROVED 11★ → GOLD 12★ |
| Mission | Crater trip | flies out over the route | 1.2 km dashed route into permanent shadow, rover marker, ticking costs |
| Mission | Event choice | trip, dimmed | 3 choices, none free; real archived storm |
| Mission | Power emergency | base, day-5 dark | Earth hidden (below horizon, D-020); recovery steps replace the bubble |
| Mission | Day results | base, dimmed | deltas with reasons, new star, one fun fact with source |
| Mission | Source card | base, dimmed | "where is this from?"; DONKI is a research log, saved not live |
| Ending | Ending story | high orbit | tier stamp + praise naming the player's choices |
| Ending | Debrief & replay | site | final report, your week, the lesson, Play again / Harder 14 days / I'm done |

**Open:** game title, mascot name ("Base Bot" placeholder), and crew names are still TBD. The Day 1 tutorial needs its 3 steps written. "How to play" is folded into the tutorial (no separate screen).

**v6.1 (same day): storybook for story, 3D for play, Base Bot's 3D tour** (Bea: 3D only in gameplay; liked the bot walk-through)
- **Title, settings, story cards 1/3/4/5 and the ending story:** flat vector storybook scenes (2D SVG, gentle drift and twinkle animation). No 3D is drawn under them (saves the GPU).
  - Accuracy kept: the polar Sun always sits low, the sky is near-black, and the crater floor is dark.
- **Story card 2 is the one real photo:** an orbiter oblique of Shackleton and the Connecting Ridge (from Bea's references; `assets/shackleton-oblique.jpg`) with "Site 001" circled as "your base: near here". Badge: "Real orbiter image (NASA LRO) · credit to confirm". **Need the exact source and credit line before shipping.**
- **New Tutorial group: Base Bot's tour, 6 steps in 3D with camera flights.**
  1. Welcome (meters glow)
  2. Solar arrays (close-up)
  3. Habitat (crew-time chips glow)
  4. Shelter (close-up)
  5. Dark crater (camera rises over the 1.2 km route)
  6. Your turn (tap the habitat, then End day)
  - The top HUD is hidden during steps 1-5 so the bot card stays clear. "Skip tour" is on every step.
- The debrief stays on 3D (it's about the player's actual game).

**v6.2 (same day): general lesson + storybook-matched 3D**
- **Story reframed** (proposed objective change, see DECISIONS): Junior Astronaut training.
  - Title: "Mission: Outpost" (working title) with Mission 1 · Moon and a locked Mission 2 · Mars.
  - Card 1 is the general lesson (air, power and safety are never free), with Mars in the sky.
  - Card 2 introduces Mission 1 at a real place. Card 5's goal is "crew safe for 7 days + 4 mission tasks".
  - Ending: MISSION COMPLETE · with honors. The debrief has a locked "Mission 2: Mars" button.
- **3D restyled to match the storybook:**
  - Same navy sky gradient and lavender-grey ground palette.
  - Terrain light in crisp anti-aliased bands (computed per pixel, so no blockiness).
  - Two-tone toon shading on the base, no outlines; cream stars; storybook shadow colour.
  - Base shadows are hidden on distant shots (they aliased).

---

## Taste review of v6.2 (2026-11-14, via the `design-taste-frontend` skill)
The skill targets marketing websites. Its section, photo, footer and gate rules don't apply to a game UI and were skipped (no gate run). The transferable checks found:
1. **Lavender/violet palette.** The skill bans violet/lavender in a design. Our storybook and 3D ground are lavender-grey. Fix: neutral cool-grey regolith with navy shadows (also truer to the real Moon, D-009).
2. **Emoji and text glyphs as icons** (⚡ ☢ ♥ ☀ ⚙ 🔒) render differently per OS and Chromebook. Fix: one SVG icon set, like the pins already use.
3. **No reduced-motion handling.** Twinkle, drift, pulse and flow loops run forever; camera flights ignore the setting. Fix: `prefers-reduced-motion` stops loops; the Settings toggle turns flights into fades.
4. **Tap targets under 44 px:** pins (36), Skip, Skip tour, modal ✕, settings segments. Fix: 44 px hit areas (kids on touch).
5. **Accessibility:** controls are clickable divs, icon-only buttons have no names, there's no focus ring and no keyboard path. Fix: real `<button>`s with labels and a visible focus ring.
6. **Small text:** 11-12.5 px badges and sub-lines. Fix: ≥14 px for anything a child must read.
7. **Contrast:** text on panels passes (body 15:1, dimmed text ≥5.5:1). Text placed straight on the art can fail (white on the lit ground ≈2.6:1). Fix: keep text over the sky or add a soft scrim.
8. **One system:** three small-label styles (pill, badge, tag) and five corner radii. Fix: two label styles, three radii.

**v6.3: taste fixes applied** (the previous version is kept as `ideas/ui-mockups/all-screens-v6.2.html` for before/after)
1. **Palette:** lavender is now neutral cool grey regolith (#a7aab2 lit → #3d4352 shade) with navy shadows, in both the storybook art and the 3D. The dose meter and story badge no longer use violet (lime and coral instead). Truer to the real Moon.
2. **Icons:** one SVG icon set replaces every emoji and glyph (meters, tools, stars, warnings, lock, week icons), swapped in when each screen draws. Job costs use words ("power −10").
3. **Motion:**
   - `prefers-reduced-motion` stops twinkle, drift, flow and pulse loops.
   - The Settings "Reduce motion" switch now works: camera flights become a short fade and the title orbit stops.
4. **Tap targets:** pins, buttons, the close ✕ and settings segments are all ≥44 px.
5. **Accessibility:**
   - Every control is keyboard-reachable (role=button, tab stop, Enter/Space) with a yellow focus ring.
   - Icon-only buttons and pins have names; story art has a label; the 3D canvas is hidden from screen readers.
   - Still to do in the real build: real `<button>` elements.
6. **Text:** in-game text is ≥14 px (13 px only for small badges and tags).
7. **Contrast:** a soft dark scrim sits behind the title text over the art.
8. **One system:** radii cut to 16 (panels), 12 (buttons, tiles, segments), 8 (badges, labels), plus pills and circles.

## v7: base model + Earth polish (2026-11-15, proposed)
From Bea's 3 references (Mars lander-habitat, Blue Moon lander, Moon-base render), kept in the D-023 two-tone toon look:
- **Habitat:** 2 modules (lattice skin + porthole; panelled + orange band + windows) on a hex deck with 4 lander legs, footpads, foil tanks and a ladder. Story hook: the habitat landed here.
- **Tunnel to the shelter:** a ribbed walkway, so kids can see where the crew runs in a storm.
- **Comms tower:** a 9 m lattice mast with floodlights on the base and a dish that tracks Earth.
- **Solar:** 3 vertical masts, ~10 m (F65), cell grid visible, guy wires, cables to a power unit.
- **Rover:** pressurised, 6 wheels, big front window, roof panel. One worn path leads toward the dark crater.
- **Crew:** 2 placeholder astronauts (white suit, navy visor, orange/cyan arm band, as in v5).
- **Earth:** real continents from NASA Blue Marble maps, flattened to the palette (sea, shallows, green, desert, ice). Storybook clouds with soft shadows, a crisp day/night line, a blue rim and a slow spin (off with reduced motion). Lowered to 2.4° elevation (F20).
- **Reset view:** a pill button under the top-right tools that appears only when the camera is off its preset and flies back on tap.
- Risks: Chromebook GPU cost (domain-warped cloud noise, more meshes, 3 textures ~1 MB). The ground tracks barely show from the long-lens hub view; they're only visible in close-ups.

## v8: base in the crew clip-art style (2026-11-15, Bea's direction)
Translating the `crew-v5` rules to 3D:
- **Squircle shapes:** rounded-edge cylinders (lathe) and big-radius boxes; chunkier parts. No panel textures, guy wires, cables or thin lattice.
- **Gradient per part:** vertex colours run from the base colour on top to slate #4F5772 at the bottom. Screens go from navy #1D2B4C to #4465B2; amber plates from #F7C081 to #BF833E.
- **Light:** a soft toon ramp (0.7–1.0), strong ambient (2.6) and a weak, neutral sun (0.75), so backlit parts stay light. Ground shadows still show through the shadow catcher, plus soft blobs under every object.
- **Inner rim:** metal parts lighten near the silhouette (a shader rim).
- **Accents:** navy screens with a white shine streak (windows, porthole, solar panels, rover window, visors); cyan beacons with halos; the suit's chest panel (amber plate + cyan light + navy buttons) on module A and the power unit.
- **Crew:** chibi astronauts like the sprite: big helmet with side pods, cyan top light, navy boots, arm band.
- Open: the terrain still has its banded storybook shader. Softening it toward clip-art gradients is the next step if wanted. The HUD helper face is still the old Base Bot, not Curio.
- **v8.1 outlines (Bea's request):** inverted-hull outlines in dark slate #27304C, a constant ~3.6 px on screen (scales with frame width). The light rim is now a crisp band, so each part reads as dark line + light bevel, like a sticker. Screens, glows and tiny parts (<0.09 m) have no outline. The mockup has an Outlines on/off button for comparison. Note: this breaks the Curio sheet's 'no dark outlines' rule. Either keep the 3D as the exception, or add matching outlines to the 2D art later. Open: the Earth, rocks and terrain have no outlines yet.


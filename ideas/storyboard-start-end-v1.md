# Storyboard: game start + ending (v1, 2026-11-15)

**Status:** proposed. Text comes from `storyline-v2.md` (card IDs P1, M1, E1…). Facts are F-IDs in `fact-sources.md`. Styles: **story frames = flat vector storybook (2D)**, **gameplay frames = 3D base** (D-023). Cast: Curio (helper AI avatar), Bram, Remy, Mica (proposals, `character-concepts-v3.md`).

Per frame: **Shot** (what we see) · **Text** · **Motion/sound** · **Input** · **Time**.
Every story frame has a small **Skip ▸▸** (top right) and **Next ▶**. Fact badges are tappable and open the source card.

---

# PART A: START OF THE GAME (~2.5 min to the first decision)

### A1. Title (storybook)
```
┌──────────────────────────────────────────────┐
│ ✦   MISSION: OUTPOST            ·      ◐Earth│
│     Junior Astronaut                         │
│  ▁▂▃▄▃▂▁   low sun ☀ behind ridge   ⌂ warm   │
│ ▁▂▃▅▆▅▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 🐶🐰🐒 + Curio  │
│   ( ▶ Mission 1 · Moon )  ( 🔒 Mission 2 · Mars )
│ ⚙ Settings           Uses real NASA data · Sources│
└──────────────────────────────────────────────┘
```
- **Shot:** "Lamp on the Ridge" title (`title-screen-drafts-v1.md` A). Twilight: low sun behind the ridge, warm habitat glow, crew silhouettes.
- **Motion/sound:** stars twinkle, slow drift. Soft ambient pad.
- **Input:** Mission 1 → A2 (first play) or A6 (replay: prelude auto-skipped).

### A2-A5. Prelude "Why go?" (storybook, ~10 s each)
```
A2 P1                     A3 P2                     A4 P3                     A5 P4
┌───────────────┐         ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  ☾  1969      │         │  ☾   ⌂ ⌂ lights│        │  ☾ ─ ─ ─ ● Mars│        │ 🧑‍🚀 ──── · Earth│
│ 👣 lander     │         │   people STAY │         │  practice      │         │ 3 DAYS AWAY  │
│"Only 12 ever…"│         │"…live & work" │         │ "…reach Mars" │         │"Every choice  │
│ [✓F01 F02]    │         │ [✓F03]        │         │ [✓F04]        │         │  counts."     │
└───────────────┘         └───────────────┘         └───────────────┘         └───────────────┘
```
- **A2:** a footprint presses into dust, the 1969-style lander behind. A counter ticks "12".
- **A3:** the same view, now with a small base and warm windows. The word **stay** glows.
- **A4:** the camera pulls back. The Moon is in front, tiny red Mars far behind, and a dotted path links them.
- **A5:** an astronaut looks back at a tiny Earth. A "3 days" arc animates between them.
- **Sound:** a gentle 4-note motif that builds across the cards.

### A6. M1: The real place (real photo)
```
┌──────────────────────────────────────────────┐
│ [real LRO oblique of Shackleton + ridge]      │
│        ◯ ← "Your base: here"                  │
│ Curio▢ "Welcome, Commander! Your base sits on │
│        a real ridge near the south pole…"     │
│ [✓F06] [Real NASA image · credit]             │
└──────────────────────────────────────────────┘
```
- **Motion:** slow zoom toward the circled site.
- ⚠ The image credit line must be confirmed before shipping (`ui-screens-v1.md` v6.1).

### A7. M2: The Sun that never sets
- **Shot:** storybook polar sky. The Sun **slides sideways** along the horizon in a loop and shadows swing around the base.
- **Text:** M2. `[? Why?]` chip → F07 card (1.5° tilt vs 23.5°).
- **Motion:** a 4 s loop. The Sun's path is drawn as a glowing ring.

### A8. M3: The dark crater
- **Shot:** a bright rim on top, a black crater bowl below. A tiny ice sparkle blinks inside, then a question mark appears.
- **Text:** M3 (colder than Pluto; could people live here one day?). `[✓F09 F12 F29]`
- **Sound:** the music drops to a cold, thin tone.

### A9. M4: Meet the crew (one tap per character)
```
┌──────────────────────────────────────────────┐
│  [Bram 🐶]   [Remy 🐰]   [Mica 🐒]   [Curio ▢] │
│   base        crew        explores    helper  │
│   systems     health      rocks              │
│ ▶ speech bubble of the highlighted one        │
│ ⓘ "Real astronauts include engineers,         │
│    doctors and geologists." [✓F23]            │
└──────────────────────────────────────────────┘
```
- **Motion:** each portrait pops in with a small wave or gesture: Bram taps a labelled wrench, Remy waves, Mica holds up a rock, Curio's camera head tilts.
- **Text:** the M4 line + each character's line (Mica's rock line: ✓F63 F64).
- **Input:** Next shows the next character (4 taps), or Skip.

### A10. M5: The mission
```
┌──────────────────────────────────────────────┐
│     base at sunrise · crew in the doorway     │
│   ● ○ ○ ○ ○ ○ ○   7 weeks                     │
│ "You're the first crew to live in this base,  │
│  for 7 weeks. Keep everyone safe, and prove   │
│  the base can do its job. Ready?"             │
│ ⓘ crews stay ~1-2 months [✓F27]   ( READY ▶ ) │
└──────────────────────────────────────────────┘
```
- **Input:** **READY** is the only big button.

### A11. Transition: storybook → 3D (3 s)
- **Shot:** the storybook art dissolves into the same-palette 3D ridge. The camera **flies down from ~5 km** (site view) to the long lens at the base (D-023).
- **Sound:** the motif resolves; a soft radio click as Mission Control comes online.

### A12. The proof: Sun time-lapse (5 s, 3D)
```
┌──────────────────────────────────────────────┐
│            ☀ → → → (sliding along horizon)    │
│   long shadows swing around ⌂ ▮▮ panels       │
│ Curio▢ "See? It never sets. That's why the    │
│         base is here."  [✓F07]                │
└──────────────────────────────────────────────┘
```

### A13-A17. Curio's tour (3D, one camera stop each, ~8 s)
| Frame | Camera | Speaker | Highlight |
|---|---|---|---|
| A13 Meters | base | Curio | the 4 meters glow one by one |
| A14 Solar panels | close on the tall panels | Bram (✓F65) | panels, the Sun's low angle |
| A15 Crew time | habitat | Curio | 8 time blocks fill the week bar |
| A16 Shelter | regolith-covered shelter | Remy (✓F24) | a cutaway shows the soil layer |
| A17 Dark crater | long lens toward the crater | Mica | the crater outline; the rover parked |
- **Input:** Next, or **Skip tour**. The tour plays once; it's in Settings afterwards.

### A18. First decision: plan week 1 (gameplay starts)
```
┌──────────────────────────────────────────────┐
│ WEEK 1 / 7   Earth ● up    ☀ good             │
│ ⚡▮▮▮▮▯ O₂▮▮▮▮▯ ☢▯▯▯ ♥▮▮▮▮▮      ★ tasks 0/12 │
│              [3D base, pins on places]        │
│ Mission Control: "Welcome, first crew! This   │
│  week: get everything humming."               │
│ Mica: "Can we see the crater soon?"           │
│ Bram: "Base first, then rocks."               │
│ Crew time ▢▢▢▢▢▢▢▢          ( Start week ▶ )  │
└──────────────────────────────────────────────┘
```
- Curio's pointer hand suggests the first job (Tune the air system). After that, the player is on their own.

**Start timing:** title 5 s + prelude ~40 s + briefing ~60 s + transition and tour ~50 s ≈ **2.5 min** (first play). Replay: title → A10 → A18 in ~15 s.

---

# PART B: END OF THE GAME (~1.5 min, after week 7)

### B1. Week 7 summary (3D, normal week summary)
- The final week's cause → effect, the reaction line, "Did you know?" (✓F41).
- Then the button reads **"Finish mission ▶"** instead of "Next week".

### B2. The wait for Earth (3D → time skip, 4 s)
```
┌──────────────────────────────────────────────┐
│  ☀ circles once more (fast)    "1 week later" │
│  horizon: ── ── ◐ Earth rising ──             │
│  crew silhouettes at the window               │
└──────────────────────────────────────────────┘
```
- **Shot:** a time-lapse with the Sun circling fast. Then **Earth rises** over the horizon (✓F20).
- **Sound:** the radio crackles back to life.

### B3. E1: "Tell us everything!" (storybook)
- **Shot:** a storybook close-up of the console. The crew crowds in; Earth glows in the window.
- **Text:** E1, "First crew, tell us everything!"
- **Motion:** a signal arc travels from base to Earth.

### B4. E2: Your story (storybook, built from the player's log)
```
┌──────────────────────────────────────────────┐
│ Curio▢ "Here's your story:"                   │
│  ① 🛡 "You sheltered during a real solar storm │
│        from May 10, 2024."   [▣ DATA]         │
│  ② 🔔 "When Earth was gone and the alarm went  │
│        off, you made the call."               │
│  ③ 🔋 "Your batteries lasted the long shadow." │
└──────────────────────────────────────────────┘
```
- **Motion:** each moment appears as a small illustrated vignette card, one at a time (2-3 total).
- **Input:** tap a ▣ badge to see the real storm's source card.

### B5. E3: Crew thank-yous (storybook)
- **Shot:** three portraits in a row, each with a speech bubble that appears in turn.
- **Text:** E3 lines chosen by the final meters (Bram: power, Remy: dose, Mica: samples, ✓F66).
- **Rule:** honest but never mean. Every crew member says one positive thing, even on a bad run.

### B6. E4: The stamp
```
┌──────────────────────────────────────────────┐
│          Mission 1 · Moon south pole          │
│         ╔══════════════════════╗              │
│         ║   MISSION COMPLETE   ║  ← stamps    │
│         ║  with HONORS ★ 11/12 ║     down     │
│         ╚══════════════════════╝              │
│     Light ★★★  Radiation ★★☆  Shelter ★★★  Ice ★★★ │
└──────────────────────────────────────────────┘
```
- **Motion:** the stamp thumps down with a small dust puff. GOLD PATCH gets a stitched patch instead.
- **Variants:** NOT YET → "Here's what to try next" + tip. **Crew called home** → no stamp: a calm "Everyone is home safe" + tip (no one is ever hurt).

### B7. The next crew arrives (storybook, 4 s) [chosen ending]
- **Shot (updated, see `story-script-v2.md` 5e):** our crew lifts off; the base lights stay on (F69). Curio: "I'll keep the base running until the next crew comes." "Later…": a new lander lands, and the new crew finds Bram's note. Don't show both crews together (overlap not sourced).
- **Why this ending:** it proves the mission goal ("does the base do its job?") without words.
- **Fail variant:** skipped (the crew went home early).

### B8. E5: The lesson
- **Shot:** the storybook ridge with the Sun's ring of light around it, then the base, then the dark crater.
- **Text:** "**Sunlight is power.** Where you work decides your power, cold and radiation risk." Then: "Real crews will make these choices one day. Maybe one of them will be you."
- **Sound:** the full motif, warm.

### B9. E6: Mars teaser
```
┌──────────────────────────────────────────────┐
│        ● Mars (dusty orange, dimmer sun)      │
│  "Mission 2: Mars. Weaker sunlight, dust      │
│   storms, and messages that take up to        │
│   20 minutes."   [✓F50 F51 F52]               │
│               ( 🔒 Coming soon )               │
└──────────────────────────────────────────────┘
```

### B10. Debrief + replay (back to 3D, site view)
```
┌──────────────────────────────────────────────┐
│ YOUR 7 WEEKS  ▁▃▅▂▇▃▄ power  (week-by-week)    │
│ Storms you met: May 2024 ▣ · Feb 2024 (false alarm) ▣ │
│ Tasks ★ 11/12   Crew dose 18%   Samples 2     │
│ ( Play again: new storms )  ( Solar max )  ( I'm done ) │
│ Sources · How real is this?                   │
└──────────────────────────────────────────────┘
```
- **Shot:** the 3D camera rises to the site view. Pins mark where the crew went (crater trips).
- **Input:** replay draws new storms (the deck); "Solar max" = more and bigger storms; "How real is this?" lists what's real, what's data, and what's story.

**End timing:** B2-B9 ≈ 75 s; B10 stays until the player leaves.

---

## Notes and risks
- **Skip everywhere** in story frames; a young player's attention after 15 min is short. B4 (your story) and B6 (stamp) are the frames not to skip by default.
- **Accessibility:** text ≥ 16 px on story frames, scrim behind text over art, reduced-motion turns the time-lapses into fades (taste fixes in `ui-screens-v1.md`).
- **Art load:** 10 storybook scenes (A1-A10) + 6 ending scenes (B3-B9). Reuse: A1 = B8 base view; A10 = B7 doorway.
- **Open:** title still "Mission: Outpost" (working). LRO image credit (A6) to confirm. Cast names/species are proposals.

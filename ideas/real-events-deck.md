# Real Events Deck v1 (proposed, 2026-11-15)

**Goal:** every run replays different **real** events, so the mission feels real and isn't the same each time (Bea's direction). Companion to `storyline-v1.md` §7 option A/B.

All data checked 2026-11-15 by live API calls (DONKI, RadLab). Everything is ARCHIVE, never shown as live (D-008).

## 1. Storm deck (real solar storms, DONKI + CRaTER)

Per storm: DONKI gives the flare, particle event (SEP) and geomagnetic storm (Kp) times. RadLab gives the real hourly dose rate measured by CRaTER on LRO **in lunar orbit, not on the surface** ("scaled for the game", as now).

| # | Storm | What DONKI logged | CRaTER in lunar orbit (hourly max, µGy/h) | Size vs a quiet week* | Game role |
|---|---|---|---|---|---|
| 1 | **Mar 2012** | X5.4 flare Mar 7; particle events Mar 7-13; Kp 7 | ~29 quiet → **~46,700** (Mar 8) | ~1,600x | Monster storm: shelter is a must |
| 2 | **Sep 2017** | X9.3 flare Sep 6, then X8.2 Sep 10; particle events; Kp 8 | ~20 → **~23,000** (Sep 11) | ~1,200x | **Two waves**: comes back after you think it's over |
| 3 | **May 2024** (current) | many X flares (to X8.7); particle events May 9-13; Kp 9 | ~6 → **~3,150** (May 14) | ~600x | The default storm |
| 4 | **May 2012** | particle event May 17; no X flare logged that week | ~8 → **~2,000** (May 17) | ~250x | **Sneaky storm**: no big flare warning first |
| 5 | **Oct-Nov 2021** | X1.0 flare Oct 28; particle events; Kp 7 Nov 3 | ~11 → **~710** (Oct 29) | ~60x | Medium storm |
| 6 | **Jan 2022** | particle events Jan 20; no X flare | ~12 → **~320** (Jan 20) | ~25x | Small: OK to work inside |
| 7 | **Feb 2024** | X6.3 flare Feb 22 (plus X1.8, X1.7); **no particle event** | ~5 → ~13, basically flat | ~3x (noise) | **False alarm**: big flare, no radiation reached the Moon |

*Our arithmetic: peak ÷ the 10th-percentile hour of that window. Quiet levels differ between years. Label these "worked out".

**Not usable for real dose:** Oct 2024 (X9.0, Kp 8.7) and Nov 2025 (X5.1, Kp 8.7) are in DONKI, but RadLab has **no CRaTER data after mid-2024** (last seen: June 2024; none in Aug or Sep 2024). They could only be used with SIMULATED dose.

**Why this deck teaches well:**
- **Real timing:** particles arrive hours after the flare (e.g. Sep 2017: flare 12:02, particles ~11 h later). That makes "the flare is the warning" real.
- **The false alarm (Feb 2024) and the sneaky storm (May 2012)** teach the real lesson: a flare doesn't always mean radiation, and radiation can come without a big flare. So you watch the particle alarm, not just the headline.
- **Size varies ~25x to ~1,600x**, so shelter choices really matter differently each run.

**Engine/balance risks:**
- Dose spikes must be scaled (log scale + cap), or Mar 2012 ends every run. The sim must report the win rate **per storm**; target: a planner wins on every storm.
- RadLab returns some single-hour spikes. Use 12-hour windows like `scripts/build-storm-data.ts` does now.
- Bundle a snapshot per storm (RadLab has no CORS). Each is ~150-260 hourly rows, which is small.

## 2. Other real events (beyond storms)

| Event | Real basis (NASA) | Game effect | Label |
|---|---|---|---|
| **Earth goes below the horizon** (already in game) | The Moon is tidally locked, but it wobbles (libration): Earth moves up to ~6.9° up/down in the Moon's sky. From a polar base, direct contact with Earth is possible only about half of each month. NASA/JPL | Comms blackout, forecast ahead | ✓ NASA fact |
| **Lunar eclipse** (Earth's shadow covers the Moon) | Real dates, e.g. **Mar 3 2026**: total ~58 min, partial ~3 h 27 min (NASA eclipse tables). Earth blocks the sunlight reaching the Moon. | Forecast power dip of a few hours. Kid hook: "Earth is blocking our Sun!" (the red-glow line is not sourced, so it's dropped) | ✓ NASA data (date) |
| **Moonquake** | Apollo seismometers (1969-77) recorded shallow moonquakes up to magnitude ~5.5, some lasting up to 10 min. A 2024 NASA study links faults near the south pole to the shrinking Moon. | Random: base shakes, check seals (crew time) or risk a leak | ~ Game event, based on NASA findings |
| **Meteoroid impact flash** | NASA has seen 400+ impact flashes on the Moon since 2005. On Mar 17 2013 the brightest one made a new crater that LRO later found. | Random, rare: a distant flash, or a tiny pit on a panel (small power loss) | ~ Game event, based on NASA findings |
| **Dust on panels** (already) | Moon dust is sharp, clingy, and thinner than a hair. NASA | Panel output drops until cleaned | ✓ NASA fact |

**Recommendation:** for the prototype, add the storm deck (storms 1-7) and the lunar eclipse. Both are real, dated and forecastable. Moonquake and impact are cheap random events for the event deck. Label them game events, not real dated ones.

## 3. Sources
Per-fact source cards: `fact-sources.md` (F30-F43).
- DONKI: `https://ccmc.gsfc.nasa.gov/DONKI-API/get/{SEP|FLR|GST}` (max 60-day range per call)
- RadLab: `https://visualization.osdr.nasa.gov/radlab/api/?celestial_body=Moon&timestamp>=…&timestamp<…&absorbed_dose_rate&format=json`
- Libration and Earth visibility: JPL IPN Progress Report 42-176C; NASA Science "Earth and Sun from the Moon's South Pole"
- Eclipse: NASA eclipse tables (eclipse.gsfc.nasa.gov), NASA Science March 2026 eclipse Q&A
- Moonquakes: science.nasa.gov/moon/moonquakes; nasa.gov "Shrinking Moon Causing Moonquakes … Near Lunar South Pole"
- Impacts: NASA Meteoroid Environment Office, Lunar Impact Monitoring

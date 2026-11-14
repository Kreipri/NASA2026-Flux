# Research: Data Sources (2026-11-14)

## UPDATE: live tests (supersedes UNVERIFIED notes below where they conflict)
Tested with real HTTP calls on 2026-11-14.

**DONKI works directly from a browser. No key needed.**
- Base: `https://ccmc.gsfc.nasa.gov/DONKI-API/get/<TYPE>?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Types: `FLR`, `SEP`, `CME`, `CMEAnalysis`, `GST`, `IPS`, `HSS`, `RBE`, `MPC`, `WSAEnlilSimulations`, `notifications`. Full OpenAPI spec: `https://ccmc.gsfc.nasa.gov/DONKI-API/v3/api-docs`
- **CORS:** `Access-Control-Allow-Origin: *`, GET allowed, preflight OK. Browser JS can call it directly.
- **Rate limit:** responses carry `X-Rate-Limit-Remaining: 119` (window size not documented, so assume ~120 per window and cache).
- Response fields seen: FLR `classType` (e.g. "X1.0"), `beginTime`/`peakTime`/`endTime`, `sourceLocation`, `linkedEvents`. SEP `eventTime`, `linkedEvents`. GST `allKpIndex` (Kp readings over time, peaked at 9.0). CME `startTime`, `note` (plain-English analyst text), `cmeAnalyses`, `linkedEvents`.
- Sample May 2024 storm saved in `data/samples/` (76 flares, 14 SEP events, 2 geomagnetic storms, 17 CMEs over a few days).
- Note: the api.nasa.gov key is not needed for DONKI via this host.

**RadLab returns real Moon-orbit radiation data. Browser calls will probably be blocked.**
- Instrument: **CRaTER on LRO** (Lunar Reconnaissance Orbiter), `trajectory: "Lunar orbit"`, hourly `absorbed_dose_rate` in uGy/hour. `dose_equivalent_rate` is null for CRaTER.
- Coverage confirmed for 2009, 2015, 2020, Jan 2024, May 2024. Returned 0 rows for Jun 2025 onward, so the data seems to end sometime in 2024-2025 (end date not pinned down). It is archived, not live.
- **May 2024 storm:** dose rate rose from about **5 uGy/h** on May 8 to about **3,150 uGy/h** by May 14 (about 600x). Perfect for a "real solar storm hits the Moon" scenario. Saved in `data/samples/`.
- **CORS:** no `Access-Control-Allow-Origin` header was returned, so direct browser calls are likely blocked. Use bundled snapshots (or a tiny proxy). Always filter by time range; unfiltered queries exceed 10 MB.
- Caveat: LRO is in orbit, not on the surface. The orbit dose is a stand-in for surface exposure and the surface would differ. Say so in-game.

**Pairing idea:** DONKI says *what happened on the Sun* (flare -> CME -> SEP -> storm). RadLab CRaTER shows *what it did to the radiation around the Moon* for the same dates. Same storm, two real NASA datasets.

**Still unverified:** Moon Trek layers, OSDR terms, OSDR keyword results for bone/muscle/sleep, the exact RadLab data end date, api.nasa.gov key limits (not needed for DONKI).

---

Fetched with a plain page reader, so JavaScript-rendered pages came back empty. Items are marked **VERIFIED** (seen on a page or in a live response) or **UNVERIFIED** (still to check in a real browser or Swagger).

## DONKI (space weather) - https://ccmc.gsfc.nasa.gov/tools/DONKI/
**VERIFIED**
- Event types: FLR (flare), SEP (solar energetic particle), CME, IPS (interplanetary shock), MPC (magnetopause crossing), GST (geomagnetic storm), RBE (radiation belt enhancement), HSS (high speed stream), WSA-ENLIL model runs, notifications.
- Main analyst is the **Moon-to-Mars Space Weather Analysis Office (M2M-SWAO)**. Main catalog covers June 2020 to present.
- Events are causally linked (flare -> CME -> shock -> storm -> belt enhancement).
- CME severity uses the SCORE scale (speed and frequency based).
- Host/path pattern: `https://ccmc.gsfc.nasa.gov/DONKI-API/get/<EventType>/?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Migration:** DONKI moved from `kauai.ccmc.gsfc.nasa.gov` to `ccmc.gsfc.nasa.gov` on 30 Sep 2026. Old tutorials and the `api.nasa.gov/DONKI/...` proxy form may be stale.
- Data is "prototyping quality", provided as is. NOAA SWPC is the official forecast source. **Credit CCMC/M2M-SWAO in the game.**
- Page notes a password prompt can appear, and clicking the link again bypasses it. Possible gotcha for scripts.

**UNVERIFIED:** exact endpoint names and response fields, CORS, whether a key is needed, rate limits (DEMO_KEY vs registered), the api.nasa.gov API list (page is JS-only).
**Next:** read the Swagger UI at https://ccmc.gsfc.nasa.gov/DONKI-API/swagger-ui/index.html and test a real call from browser JS.

Other CCMC APIs worth a look: Earth CME Scoreboard (arrival predictions), ISWA HAPI (time series), SEP Scoreboard.

## RadLab (ISS radiation) - https://visualization.osdr.nasa.gov/radlab/gui/data-api/
**VERIFIED**
- Endpoint: `GET https://visualization.osdr.nasa.gov/radlab/api/` with `format=json` (default CSV).
- Filters: `celestial_body` (Earth, Moon, Sun...), `trajectory` (LEO, Orbit, Surface, BLEO...), `spacecraft`, `module`, `instrument`, `timestamp` (uppercase T in ISO strings).
- Fields: `absorbed_dose_rate` (uGy/hour), `dose_equivalent_rate` (uSv/hour), `flux`; ISS also has latitude, longitude, altitude.
- Instruments: TEPC, ALTEA, Lidal, DosTel, REM, TriTel, Liulin-5, DORELI.
- Example: `.../radlab/api/?spacecraft=ISS&instrument=DosTel&timestamp>=2022-04-01T23:00&timestamp<2022-04-02T01:05&absorbed_dose_rate>2&flux&format=json`
- **An unfiltered Moon query returned over 10 MB.** Always filter by time, instrument, spacecraft.

**UNVERIFIED:** JSON row shape, time coverage per instrument, which instruments are on the Moon or BLEO, CORS, limits, keys.
**Idea:** use `dose_equivalent_rate` (uSv/h x 24 for per day) as the basis of the Radiation meter. Scaling to game thresholds is a design choice. Bundle a small snapshot rather than hitting the API live.

## OSDR (space biology) - search API: `https://osdr.nasa.gov/osdr/data/search?term=KEYWORD`
**VERIFIED**
- Returns JSON (raw Elasticsearch shape, ~134 KB for `term=radiation`, 1064 hits). No key was needed.
- Useful fields: `Accession` (e.g. OSD-489), `Study Title`, `Study Description`, `Study Assay Measurement Type`, `organism`, `Mission`, `Project Type` (Spaceflight vs Ground).
- Example: OSD-489 is mouse bone structure after 37 days on the ISS. Fact: bone loss in microgravity is site-specific, mostly in weight-bearing bone.
- **Caveats:** most studies are **mice or cells, not astronauts**. Label them honestly. Most "radiation" hits are ground studies in Gy and not kid-suitable. Types are messy (string vs array, empty values, non-NASA sources mixed in).

**UNVERIFIED:** paging params, results for `bone` / `muscle` / `sleep` / `immune`, CORS. Terms and conditions: https://www.nasa.gov/reference/osdr-help-terms-and-conditions/ (not read).
**Idea:** "Science fact cards" curated from a handful of OSDR studies, shown as unlockable rewards. Pre-curate rather than live-query.

## Moon Trek / Mars Trek - https://trek.nasa.gov/moon/ , https://trek.nasa.gov/mars/
- Both sites exist (HTTP 200) but are JS apps. **Nothing else verified.** Imagery layers, tile/WMTS service, licensing, and south pole data all need a real browser check.
- Moon Trek is potentially more useful than Mars Trek for our Moon-first plan.

## CSA - Food Production toolkit and STEM resources
**VERIFIED (from linked CSA activity pages, a Grades 6-9 activity from 2019)**
- Crops and days to harvest: lettuce 21-28, soybean 45-65 (boil), tomato 50-90, carrot 70-80, basil 75, chickpea 80-100, dill 90, sweet potato 90-170 (cook), wheat 213-244 (grind).
- Prefer "pick and eat" crops because crews will have little food processing equipment.
- Moon growing challenges: scarce water (accessible near poles), light (equatorial day = ~14 days light + ~14 dark; **south pole has almost constant sunlight**), no magnetic field so plants need shielding, no atmosphere, extreme temps, regolith is nutrient-poor so hydroponics/aeroponics.
- Astronaut menus: 1,900-3,200 kcal/day. Plants also give oxygen, recycled water, and a morale boost.
- CSA toolkit and STEM pages are mostly link lists (activities, digital games, printables). Check https://www.asc-csa.gc.ca/eng/terms.asp#copyright before reusing anything.
- **No page gave numbers for power, crew time, or water per crop.** Food mechanics would need invented or separately sourced values.

## Feature Ideas Triggered by the Research
1. **Storm chain:** DONKI's causal links (flare -> CME -> shock -> storm) become an in-game event sequence. Players see the flare first and get time to prepare before the particles arrive. Note: DONKI is a research log of events, not an official warning service (NOAA SWPC is the official forecast source), so the game must not call DONKI a "warning system." The warning behavior is our fictional in-game panel; DONKI only supplies the real event records, replayed from the archive.
2. **Replay real storms:** bundle a few real historical DONKI events as static JSON. This doubles as the offline fallback.
3. **SCORE scale as storm severity** (simple 1-5 for kids).
4. **Real dose basis:** RadLab dose-equivalent rate shapes the Radiation meter.
5. **Fact cards:** curated OSDR findings (bone loss, sleep), honestly labeled as mouse studies where applicable.
6. **Greenhouse (Mars mode or optional on Moon):** crop table gives real growth times, so the delay between investing power and getting food is the mechanic.
7. **Sunlit ridge vs dark crater (south pole):** outposts sit on near-constant-light ridges, while water ice is in permanently shadowed craters. Going for the ice means leaving the light. See DECISIONS.md open question.

## Attribution Checklist
- DONKI: credit CCMC / M2M-SWAO; label as prototyping-quality data.
- RadLab / OSDR: check OSDR terms; credit NASA OSDR and the contributing agencies.
- Mark each data point in-game as **live**, **real but archived**, or **simulated**.

# Submission references, credits and disclosure — 2026-11-15

Registration and terms acceptance: confirmed complete by Bea. No further confirmation needed.

## Existing reference files
- `ideas/fact-sources.md`: scientific claims, source links, fact IDs and verification status.
- `data/samples/README.md`: exact archived NASA files, date ranges, API queries, units and attribution.
- `ideas/research-data-sources.md`: research notes; not everything researched is used.
- `scripts/build-storm-data.ts`: actual transformation into `src/data/storm-2024-05.json`.
These already compile most references. This document adds missing-source research, asset/tool credits and usable disclosure copy. Do not list every researched dataset as integrated.

## NASA data credit copy
**Space-weather records:** NASA Community Coordinated Modeling Center (CCMC), DONKI, with analyses from the Moon to Mars Space Weather Analysis Office (M2M-SWAO). Archived May 2024 FLR, SEP, CME and GST samples, retrieved November 14, 2026. https://ccmc.gsfc.nasa.gov/tools/DONKI/

**Radiation measurements:** NASA OSDR RadLab; CRaTER instrument, Lunar Reconnaissance Orbiter. Archived May 8–14, 2024 absorbed dose-rate readings in microgray per hour. https://visualization.osdr.nasa.gov/radlab/gui/data-api/

**Processing:** team processing script selects X-class flares, particle-event times and geomagnetic context, and groups hourly CRaTER records into 12-hour UTC windows retaining each maximum. Weekly hazard levels/exposure costs remain simplified game rules. Kp measures geomagnetic conditions at Earth, not dose at the Moon. CRaTER measures in lunar orbit, not at the fictional base or in human tissue.

**Acknowledgement:** We acknowledge NASA CCMC at Goddard Space Flight Center for use of DONKI and NASA OSDR RadLab for access to CRaTER/LRO radiation measurements. Preserve instrument/mission provider credits associated with the downloaded dataset; no claim that RadLab itself built CRaTER.

Official DONKI rules describe its data as prototyping quality for research and link to acknowledgement guidance: https://ccmc.gsfc.nasa.gov/publication-policy/ . Rechecked November 15, 2026. No message to researchers has been sent.

## Missing scientific sources researched
| Registry row | Result / recommended correction |
|---|---|
| F28 magnetic protection | Replace absolute “Moon is outside Earth’s magnetic field” with “The Moon has no global magnetic field and almost no atmosphere to shield its surface.” NASA explicitly supports this: https://science.nasa.gov/moon/solar-wind/ . NASA also explains passage into/out of Earth’s magnetotail: https://www.nasa.gov/science-research/heliophysics/nasa-spacecraft-helps-identify-solar-radiation-patterns-that-expose-the-moon/ . |
| F40 red Earth rim in lunar eclipse | Found direct NASA SVS support: https://svs.gsfc.nasa.gov/4341/ . From the Moon, Earth hides the Sun and its atmosphere appears as a red ring. This resolves the missing citation; does not authorize adding a new scene. |
| F62 instruments and plant experiment | Read NASA’s March 26, 2024 announcement: https://www.nasa.gov/news-release/nasa-selects-first-lunar-instruments-for-artemis-astronaut-deployment/ . Supports proposed instrument deployment and LEAF plant research. Treat as a 2024 selection announcement, not the current flight manifest; it alone does not support every task in the original compound sentence. |
| F26 present-day landing duration | Do not promote the old six-day description to a current plan. NASA’s Nov 4, 2026 update places Artemis III testing in 2027 and Artemis IV landing in 2028, without verifying a surface-stay duration: https://www.nasa.gov/missions/artemis/nasa-shares-plans-to-accelerate-artemis-return-to-moon/ . Omit a current duration claim; our seven weeks are fictional. |

## Asset inventory and exact outstanding gap
| Asset | Creator/source credit | Status |
|---|---|---|
| Layout wireframe and some vector graphics | Bea (user-confirmed). Curio original Figma source is documented in `ideas/character-designs/crew-v5/README.md`. | Confirmed contribution; do not assign every SVG to Bea. |
| Workflow and other vector assets | AI-assisted workflow and SVG/code-created artwork, under Bea’s direction. Include implementation/code assistance where applicable. | User-confirmed; record per-file authorship as human / AI-assisted / third-party when preparing the release. |
| Current story base | `ideas/base-designs/vector-v3/space-base.svg`, copied as `assets/space-base.svg`; editable SVG made by code. | Team project artwork with AI assistance, not a NASA engineering drawing. |
| Shackleton oblique image | **ETHZ / LPI / Valentin T. Bickel and David A. Kring.** Primary page: https://www.lpi.usra.edu/features/2022/082622/moon/ ; original image: https://www.lpi.usra.edu/features/2022/082622/moon/moon-shackleton-crater1.jpg . | Exact labelled composition identified (SP, Site 004, Site 001 and three scale bars). It is a 3D perspective made by draping LROC imagery over LOLA topography, not a single oblique photograph. Source page states CC BY 4.0 except where otherwise noted; preserve creator credit, source, license link and note project overlays/cropping. https://creativecommons.org/licenses/by/4.0/ |
| Earth day, specular and cloud maps | Current code fetches/copies three.js r160 example textures: https://github.com/mrdoob/three.js/tree/r160/examples/textures/planets ; filenames `earth_atmos_2048.jpg`, `earth_specular_2048.jpg`, `earth_clouds_1024.png`. | Distribution source confirmed in source code; original texture creator/license not conclusively established. Do not label these exact files NASA Blue Marble solely from filenames or the existing generic in-app link. Keep unresolved until upstream provenance is established or replace with explicitly credited NASA products. No replacement performed. |
| Retired raster drafts | `crew-sheet-v1.png` has a historical README claiming image-generation use. User clarifies final work used vector/code assets and no image-generation tool. Current build copies only `ideas/ui-mockups/assets/`, not this character-draft folder. | Preserve historical record; do not silently rewrite it or claim all historical experiments were vector-only. State final-asset scope. Audit unused `base-clipart.png`: story references are replaced with SVG, but the old PNG is still copied into dist by the broad asset-copy step. Remove unused draft files from release packaging in a later implementation pass. |

## Tool and font credits
- Three.js 0.160.0, © 2010–2023 three.js authors, MIT: https://raw.githubusercontent.com/mrdoob/three.js/r160/LICENSE . Build already copies its license to `vendor/LICENSE-three.txt`.
- Fredoka, Fredoka Project Authors; SIL Open Font License 1.1. Metadata credits designers Milena Brandão and Hafontia: https://github.com/google/fonts/blob/main/ofl/fredoka/METADATA.pb ; license https://github.com/google/fonts/blob/main/ofl/fredoka/OFL.txt .
- Lexend, Lexend Project Authors; SIL Open Font License 1.1: https://github.com/googlefonts/lexend/blob/main/OFL.txt . Include copyright and license when bundling fonts.
- Figma (human wireframing/vector work), Node.js, JavaScript/TypeScript, Python asset scripts, Git and GitHub. Project build is custom; React/Vite are not demonstrated dependencies of this release.
- Codex and Claude appear in development records: credit actual assistance with workflow, programming, debugging, research navigation, text and vector/code asset development. Do not invent model versions.
- No shipped audio library or music source identified in this pass. Recheck if sound/music is added to demo or game; credit/licence that separately.

## Suggested form disclosure
“Bea created the layout wireframe and some original vector graphics. AI tools assisted with the workflow, software implementation and other vector assets, with human direction and selection. Artwork for the submitted interface was created as editable vector/code graphics; no dedicated text-to-image generation tool was used to create the final vector assets. AI-assisted vector graphics are disclosed as AI-assisted artwork. NASA measurements and third-party scientific imagery retain their original source credits and are separate from AI-assisted game content.”

This wording follows Bea’s clarification and describes final production assets. A vector is still a graphic: SVG format is not a blanket exemption from AI-media rules. Exact organizer classification and any required labels/metadata remain to be checked against the current submission instructions. If asked about all development experiments, include the historical draft record rather than using the narrower final-assets statement as a denial.

## Short in-app / demo disclaimer
“An independent educational game inspired by NASA science. Fictional crew and mission; simplified game rules. NASA data shown here is archived, not live. Not a mission-planning or astronaut-health tool. Use of NASA resources does not imply NASA endorsement.”

Optional fuller science note: “Radiation points, resource costs, event timing and ice probabilities are simulated. Lunar-orbit measurements are not surface or personal-dose measurements. Historical events may be replayed in a compressed fictional timeline. The illustrated base and terrain are not a surveyed site or announced NASA mission.”

Optional evaluation note for project description: “Designed for ages 7–12; educational outcomes and child usability have not yet been validated through formal playtesting.”

Keep credits in a linked readable page; do not use disclaimer text to hide missing attribution. No unsupported privacy, copyright ownership or NASA certification claims.

# Credits and scientific sources

## Team and authorship
The Space Flux: Bea Margaret B. Ganotisi and Neo F. Mariñas.
Bea created the layout wireframe, original Curio vector design and selected other vectors. AI assistance contributed workflow, code, text and other vector/3D artwork. See [AI disclosure](AI_DISCLOSURE.md). Team-created game artwork is fictional and does not depict an announced NASA mission.

## NASA archive data
- NASA CCMC DONKI / Moon to Mars Space Weather Analysis Office, May 2024 FLR/SEP/CME/GST records. https://ccmc.gsfc.nasa.gov/tools/DONKI/
- NASA OSDR RadLab, CRaTER on Lunar Reconnaissance Orbiter, May 8–14, 2024 absorbed dose rate, microgray/hour. https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- Snapshots retrieved November 14, 2026. Queries and dates: [data notes](data/samples/README.md). Transform: `scripts/build-storm-data.ts`. Derived summary: `src/data/storm-2024-05.json`.
We acknowledge CCMC at NASA Goddard for DONKI and NASA OSDR RadLab for access to CRaTER/LRO measurements. DONKI is a research/prototyping resource. CRaTER readings describe lunar orbit, not personal doses at the fictional base. Kp describes geomagnetic conditions at Earth. Resource costs, ice probabilities and weekly exposure points are game rules.

## Lunar science and imagery
- NASA SVS, Visualizing Shackleton Crater: https://svs.gsfc.nasa.gov/4716/
- NASA SVS, cold polar craters: https://svs.gsfc.nasa.gov/11230/
- NASA Science, Moon Water and Ices: https://science.nasa.gov/moon/moon-water-and-ices/
- NASA space-radiation protection: https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/
- NASA/JPL south-pole communications study: https://ipnpr.jpl.nasa.gov/progress_report/42-176/176C.pdf . The game's link schedule is simulated and assumes no relay.
- NASA dust mitigation: https://www.nasa.gov/centers-and-facilities/kennedy/nasa-technology-helps-guard-against-lunar-dust/
- Shackleton perspective: ETHZ/LPI/Valentin T. Bickel and David A. Kring. https://www.lpi.usra.edu/features/2022/082622/moon/ . LROC imagery draped over LOLA topography. Source page states CC BY 4.0 except where noted: https://creativecommons.org/licenses/by/4.0/ . Project crops/overlays and site markers are illustrative, not an approved landing-site designation.
- Other individual science statements: [fact-source registry](ideas/fact-sources.md). Old NASA concepts and historical mission plans are not current manifest promises.

## Earth textures
`earth_atmos_2048.jpg`, `earth_specular_2048.jpg`, `earth_clouds_1024.png`: distributed in the three.js r160 examples. https://github.com/mrdoob/three.js/tree/r160/examples/textures/planets . Credit the three.js project distribution and retain its MIT notice. A-Frame's sample-assets manifest also assigns these names to the three.js MIT license: https://github.com/aframevr/sample-assets/blob/master/dist/images.json . Original individual texture authorship is not separately established; we do not claim these exact maps are NASA Blue Marble products. File-level hash comparisons are recorded in the submission package. The globe's palette, lighting and clouds are artistic treatments.

## Libraries, fonts and tools
- Three.js 0.160.0, Copyright 2010–2023 three.js authors, MIT. https://github.com/mrdoob/three.js/blob/r160/LICENSE . Runtime copy: `vendor/LICENSE-three.txt`.
- Fredoka: Fredoka Project Authors, designers Milena Brandão and Hafontia, SIL Open Font License 1.1. https://github.com/google/fonts/tree/main/ofl/fredoka
- Lexend: Lexend Project Authors, SIL Open Font License 1.1. https://github.com/googlefonts/lexend/blob/main/OFL.txt
- Figma, Node.js, TypeScript/JavaScript, Python, Git and GitHub supported development. Codex and Claude assistance is described above. The game uses a custom static build, not React/Vite.
- Submission deck: OpenAI Artifact Tool assisted presentation creation. Runtime/development tools are not represented as team-authored libraries.
- No music or generated audio is included in this submission package.

## Scope
Independent educational prototype. Fictional crew/mission and simplified rules. Archive data, not live. Not mission-planning or astronaut-health software. NASA resources do not imply NASA endorsement. Designed for ages 7–12; formal child usability and learning-gain evaluation remain future work.

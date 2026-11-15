# Space Base Commander — project submission

Team: The Space Flux  
Members: Bea Margaret B. Ganotisi; Neo F. Mariñas  
Challenge: Build a Junior Astronaut Mission Trainer  
Team page: https://www.spaceappschallenge.org/2026/find-a-team/space-flux/

## Project name
Space Base Commander

## High-level project summary
Space Base Commander is a browser game for children ages 7–12. Players command a fictional lunar outpost through seven weeks, balancing power, air and radiation while investigating sunlight, shelter and possible ice. Every job uses crew time, and results and weekly recaps reveal its consequences. NASA DONKI solar-event records, CRaTER/LRO radiation measurements accessed through NASA RadLab, and NASA lunar science ground the experience. Historical observations carry archive labels; resource costs and exposure points use simplified game rules. Curio guides the first week so young commanders can learn the controls, make a plan and try again.

## Short summary alternative
A Moon-base game for ages 7–12. Plan seven weeks, balance power, air and radiation, and investigate light, shelter and ice. NASA archives ground the story. Job results and recaps help children rethink their plans.

## Project demo link
Use the public seven-slide PDF URL recorded in RELEASE.md after publication. The PDF is the selected demonstration format; no separate video is needed for this package.

## Final project link
Use the verified public play URL in RELEASE.md. Repository: https://github.com/Kreipri/NASA2026-Flux

## Detailed project description
### The challenge
Living on the Moon means choosing how to spend limited time and supplies. A useful expedition can leave less power for the base, while sheltering the crew leaves less time for exploration. We address the Junior Astronaut Mission Trainer challenge with a game that makes these competing demands visible to children ages 7–12.

### The experience
The player commands a fictional crew near the Moon's south pole. Across seven weekly turns, they investigate sunlight, radiation, shelter and possible ice. Three core systems track power, air and accumulated radiation points. Crew energy limits available work time. Time blocks represent effort and duration, not individual calendar days.

Players choose Mission, Base or Crew jobs. They can check sunlight, measure radiation, fly a hop-drone, drive to a dark crater, cover the shelter with soil, clean panels, run the air system, repair equipment, rest or take shelter. Job previews show costs before commitment. Jobs run immediately and show their results; sunlight, life support and weekly conditions resolve when the week closes. Ice is survey evidence, not an instant source of oxygen or fuel.

Curio introduces the mission and guides the first week. A report card tracks investigations. Saves let players resume in the same browser, while the final story and debrief reflect the mission. A Solar max replay offers more storm pressure. The seven-week story, crew and base are fictional.

### NASA science and data
Our bundled May 2024 archive combines DONKI space-weather event records with CRaTER radiation measurements obtained through NASA OSDR RadLab. DONKI supplies event times and classifications. CRaTER measures absorbed dose rate in lunar orbit. A processing script selects records and summarizes radiation readings in 12-hour UTC windows. Source cards explain provenance and distinguish historical observations from game rules.

NASA lunar science informs low-angle sunlight, permanently shadowed craters, possible water ice and radiation shielding. The illustrated terrain is not a surveyed reconstruction. Historical storms can appear in a compressed fictional timeline. Other historical storms use simplified profiles; exact hourly measurements are not bundled for every scenario. Weekly exposure points and resource costs are not a physical dose model or NASA health limits.

### Implementation and current state
The playable prototype uses HTML, CSS, JavaScript, Three.js 0.160.0 and a shared deterministic TypeScript rules engine executed with Node.js tooling. The browser includes the opening story, guided first week, job costs/results, weekly recaps, report card, save/resume, endings and replay. Numerical outcomes come from the rules engine; Curio uses authored guidance rather than a live chatbot.

The existing browser tests and static build pass at the packaging checkpoint. Formal child playtesting and measured learning outcomes remain future work. Known limits include incomplete observation-to-weekly-hazard mapping and report-card/debrief evidence edge cases. Some alert shortcuts still need cost review. We do not claim that every alert decision already has a resource cost. Planned Mars play and runtime AI-written events are not part of this release.

### Intended benefit and next steps
We want players to explain why a useful job may need to wait, why shelter matters and how sunlight affects a base's options. Replay invites them to change their strategy after seeing consequences. Next steps are to strengthen evidence tracking and data mapping, review remaining choice costs and test understanding and usability with children.

## NASA data used
1. NASA CCMC DONKI / Moon to Mars Space Weather Analysis Office: archived May 2024 flare, solar energetic particle, coronal mass ejection and geomagnetic-storm records. These provide historical event context. https://ccmc.gsfc.nasa.gov/tools/DONKI/
2. NASA OSDR RadLab: CRaTER instrument on Lunar Reconnaissance Orbiter, May 8–14, 2024 absorbed dose rate in microgray per hour. These are lunar-orbit instrument readings, not surface crew doses. https://visualization.osdr.nasa.gov/radlab/gui/data-api/
3. NASA Scientific Visualization Studio, Visualizing Shackleton Crater: site/science context for sunlight and shadow. https://svs.gsfc.nasa.gov/4716/
4. NASA Science, Moon Water and Ices: context for ice exploration and potential future use. https://science.nasa.gov/moon/moon-water-and-ices/
5. NASA radiation shielding explanation: shelter and regolith concepts. https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/

Archived samples were retrieved November 14, 2026. Original observations retain NASA provenance. Derived summaries and simulated values remain separately identified. See the release credits and the repository fact registry for additional science references.

## Space-agency partner and other resources
No space-agency-partner dataset is confirmed as integrated. Do not list researched partner resources as used data. The Shackleton perspective image is credited to ETHZ/LPI/Valentin T. Bickel and David A. Kring. Three.js, Fredoka, Lexend, Figma, Node.js, Git/GitHub, TypeScript/JavaScript and Python supported development. The release includes full asset and tool credits and license notices.

## AI/SI use
Bea created the layout wireframe, Curio's original vector design and selected other vector graphics. AI tools, including Codex and Claude, assisted with workflow, design alternatives, programming, debugging, research navigation, text drafting and other vector/code assets under human direction. Final production artwork uses vector/code graphics rather than new text-to-image generation. AI-generated vector/3D artwork is visibly identified in the game and demo, with a machine-readable disclosure for AI-assisted code and derived summaries.

NASA observations and third-party scientific imagery are sourced records, not AI-generated observations. The deterministic engine controls numerical results. No live language model is required to play. An early unapproved raster concept sheet remains in the repository's design history and is excluded from the published game and deck; this disclosure distinguishes production assets from historical experiments.

## Scope disclaimer
Independent educational prototype. The crew and mission are fictional and the rules are simplified. NASA data shown is archived, not live. Radiation points are not astronaut health limits. This game is not mission-planning or astronaut-health software. Use of NASA resources does not imply NASA endorsement.

## Terms and registration
Completed by the team, as confirmed by Bea. This file does not submit the form or establish event eligibility. Copy the prepared answers into the registered team's Project tab, check the current field limits, attach the public demo/final-project links, and finish the official submission workflow.

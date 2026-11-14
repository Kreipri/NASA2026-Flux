# Project Context: Junior Astronaut Mission Trainer

**Event:** 2026 NASA Space Apps Challenge
**Challenge:** Build a Junior Astronaut Mission Trainer
**Difficulty:** Intermediate | **Audience:** Beginner/Youth (ages 7-12)
**Subjects:** Games, Planets & Moons, Software, Space Exploration, Sun

## The Challenge in One Paragraph
Design and build an interactive game or app where kids run a lunar or Martian outpost and balance competing demands (life support, radiation shielding, power, food production, communication delay). Players should feel how real mission trade-offs decide success or failure. The deliverable is a **working prototype** that makes one real deep-space constraint clear to a young player, not just a fun game.

## Why This Exists
- Space education for kids is either too abstract (posters, facts) or too technical.
- Real mission planners trade power, radiation exposure, and resources against each other every day. Kids rarely see that logic, only the outcomes.
- Pure edutainment loses accuracy. Pure entertainment loses the lesson. We need both.

## Objectives (from the brief)
1. Kids 7-12 manage a lunar or Martian outpost.
2. They make real decisions about life support, radiation shielding, power budgeting, food production, and communication delay.
3. They see how those choices play out over a simulated mission.
4. **No choice is free.** Every decision costs something (e.g. save power today, lose oxygen tomorrow).
5. Ground it in real NASA open data where possible.

## Real NASA Data (encouraged, not required)
| Source | What it gives us | Link |
|---|---|---|
| **NASA Open APIs** | Central portal: APOD, Mars Rover Photos, DONKI. Free API key (higher limits than the demo key). | https://api.nasa.gov/ |
| **DONKI** (Space Weather Database) | Solar flares, CMEs, space weather that drive radiation risk, comms disruption | https://ccmc.gsfc.nasa.gov/tools/DONKI/ |
| **OSDR** (Open Science Data Repository) | Space biology and astronaut health research (bone, muscle, immune, sleep). Searchable. | https://osdr.nasa.gov/bio/repo/ , search API: `https://osdr.nasa.gov/osdr/data/search?term=KEYWORD` |
| **RadLab** (OSDR Radiation Dosimetry) | Real ISS radiation dose measurements (e.g. absorbed dose rate) | https://visualization.osdr.nasa.gov/radlab/gui/data-api/ |
| **Mars Trek** | Real Mars surface imagery, elevation, terrain (for Mars mode) | https://trek.nasa.gov/mars/ |
| **CSA STEM & Youth resources** (partner) | Free bilingual youth and STEM activities | https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp |
| **CSA Food Production toolkit** (partner) | Food in space and on the Moon, tied to astronaut health | https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/ |

Links are as provided in the challenge. Exact API endpoints and parameters are not yet verified. NASA does not endorse non-U.S. Government sites; follow each site's data use terms.

Rules from the brief:
- Attribute data sources **inside the app** so players know it's real NASA science.
- If live API calls aren't feasible, embed a curated real dataset. **Never present static data as live.**
- Ship a short write-up of which datasets we used and why, so judges can verify.

## Design Guidance from the Brief
**Do**
- Plain language. Explain unavoidable terms in context (radiation dose, microgravity, sol).
- Browser-playable, no download, no account.
- Replayable: varied events and strategies; failure should teach, not punish.
- Show real-world consequences (e.g. link a shielding decision to actual current space weather).
- Can flex to older siblings, parents, and classrooms.

**Avoid**
- A "safe" choice with no cost.
- Visual polish standing in for mechanical accuracy.
- Too many systems at once. **2-3 core resources** beats 5-6.

## Our Direction (initial, see DECISIONS.md for status)
- **Format:** survival resource-management game.
- **Look and feel:** retro green-terminal UI style, inspired by the *visual interface* of Fallout only (layout, monospace type, glowing CRT feel), made kid-friendly. **No Fallout game concepts** (no wasteland, vaults, mutants, or radiation-as-sci-fi). The setting and all threats come from real NASA information (D-009). Original art and mascot only, no copied Fallout assets.
- **Dynamic content:** AI-generated situations for variety and replayability.
- **Story:** one short, overarching storyline that's valuable for kids, not an endless sandbox.

## Judging Lens (what makes us stand out)
1. A young player walks away understanding one real constraint.
2. Gameplay visibly tied to real NASA data.
3. Replayability.
4. Clear, traceable dataset explanation.
5. A working prototype beats a beautiful mockup.

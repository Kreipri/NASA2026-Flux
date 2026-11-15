# Draft C v2 — NASA science becomes a decision

2026-11-15. Bea is leaning toward C; this is a refined proposal, not a locked selection or finished presentation. Exactly seven slides including title and closing. Brings gameplay to slide 3 and pairs source provenance with an explicit account of model simplification.

## 1 — What would you do on the Moon?
**Main copy:**
Space Base Commander
A mission-planning game for children ages 7–12, inspired by NASA science.

**Visual:** Actual base scene, title, registered team/member names and challenge name. Start with the game rather than an API screenshot.

## 2 — Real missions begin with evidence
**Main copy:**
NASA DONKI records solar events.
CRaTER measures radiation near the Moon; NASA RadLab provides access to those records.
Our prototype includes a May 2024 archive.

**Visual:** Two readable source excerpts/cards with dates and units. Caption: “Historical observations—not live.” Footers link DONKI and RadLab. Do not fabricate a graph or imply lunar-orbit measurements are surface astronaut doses.

## 3 — Turn science into a choice
**Main copy:**
Explore outside, or spend time protecting the crew?
Jobs compete for crew time, power and air. Outside work adds radiation exposure.

**Visual:** Actual outside-job and paid Take shelter job previews, with readable costs. Mark numerical costs as game rules. Do not use the free shelter alert shortcut as proof that shelter costs time. This describes physical concepts translated into game choices, not a completed observation-to-weekly-dose formula.

## 4 — Make the call. See what changed.
**Main copy:**
Read the costs. Choose a job. See its result.
At week's end, a recap shows how your work and base conditions changed the mission.

**Visual:** One real job → result → recap sequence. Use the same run and actual numbers. Show no invented comparison outcome. If demonstrating shelter, show when storm exposure actually resolves rather than implying an immediate drop in accumulated radiation.

## 5 — Know what is real—and what we simplified
**Main copy:**
Real: archived observations and NASA lunar science.
Simulated: crew, mission schedule, resource costs and exposure points.
The game teaches planning, not astronaut health limits.

**Visual:** Two clear labelled areas: “NASA observations and science” / “Our game model”. A source card beside an actual meter makes the distinction concrete. Do not imply a complete numerical mapping from each observation to weekly exposure.

## 6 — Help young commanders learn by trying
**Main copy:**
Curio guides the first week.
A seven-week mission investigates sunlight, radiation, shelter and ice.
Results and recaps help players rethink their plan.

**Visual:** Tutorial and report card/ending. Small next-step line: “Next: refine data mapping and evidence tracking; test understanding with children.” Intended learning benefit, not a measured outcome. Do not call the game proven educationally effective.

## 7 — Your next mission starts with a question
**Main copy:**
What would you do differently?
Play Space Base Commander. Explore the sources. Try another plan.

**Visual:** Public playable URL/QR and linked repository/full credits. Keep last slide spacious and readable.

**Authorship footer:** “Layout wireframe and selected vectors: Bea. Workflow, implementation and other vectors: AI-assisted. Full sources and credits: [URL].”
**Scope footer:** “Independent educational prototype. Fictional mission; simplified rules. NASA archive data, not live. No NASA endorsement.”

## Narrative and trade-off
Evidence → choice → consequence → model transparency → learning loop → invitation. Recommend this revision because it demonstrates playable behavior before explaining limitations. Trade-off: technical provenance is concise; the linked references must carry dataset details and full asset/tool credits.

Use one continuous real example on slides 3–4. If shelter costs/behavior cannot be captured clearly in the submitted build, use the paid cleaning job, explain its dust/solar-power science and keep DONKI/RadLab as separate space-weather context. Never imply solar records caused the dust event.

## Sources and production notes
- NASA DONKI: https://ccmc.gsfc.nasa.gov/tools/DONKI/
- NASA RadLab: https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- Shelter science: https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/
- Full inventory/disclaimers: `submission-credits-and-disclaimers.md`.
- Keep actual source and third-party asset credits on the relevant slides as well as the full credits destination. Earth-map provenance remains unresolved; do not assume a screenshot clears that asset gap.
- Text only in this pass. No deck, graphics, video, deployment or new implementation.

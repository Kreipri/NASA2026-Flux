# Gameplay layout drafts

Open `index.html` to compare three arrangements of the Week 1 gameplay UI with its actual three.js base. **Historical comparison: Bea chose A.** Current refinement: `ideas/ui-mockups/gameplay-side-dock-v2/index.html`.

- A: side dock; B: bottom tray; C: focus window.
- Switch Jobs / Mission tasks, click a 3D pin or place tab, add/remove jobs, close the panel, or review the plan. Selections persist between layouts.
- Optional URL parameters: `?layout=b&place=shelter`, `?layout=c&view=missions`, `?panel=closed`.
- Requires internet for three.js and fonts; Earth images and character SVGs are bundled in the file.
- Game numbers are SIMULATED examples. Direct job changes only; there is no engine integration or weekly simulation.

Rebuild with `python3 ideas/ui-mockups/gameplay-layouts-v1/build.py` from the repository root. It reads **only this folder**, so it cannot pull in another agent's unfinished UI work.

`source/scene.snapshot.js`, `baseline.snapshot.css`, and `assets.snapshot.js` are frozen copies from the existing flow. `provenance.json` records the source hash. `jobs.snapshot.json` preserves the current game config for the task example. Work on this draft in `layouts.css`, `layouts.js`, and `draft.html`; it never rewrites the active flow, original model or game engine.

Reasoning and trade-offs: `ideas/gameplay-layouts-v1.md`.

Verification: visually checked the recommended side dock (jobs and mission tasks), bottom job tray and focus job window using the real WebGL scene. Checked task controls and panel geometry at 1280px and 728px, plus narrow-screen internal scrolling. Job add/remove, direct meter changes, eight-block budget guard, shared plan, task switching, review, Escape, pin handler and Curio passed interaction checks without JavaScript errors. Local interaction checks skipped GPU drawing; separate HTML previews checked the actual 3D rendering. Some headless rendering attempts exceeded the preview tool's 20-second load limit; the final recommended view rendered successfully. The weekly engine and low-end GPU performance were not tested by this layout study.

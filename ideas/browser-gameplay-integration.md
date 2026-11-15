# Browser gameplay integration

2026-11-15. Implemented at Bea's request to connect the finished screen to the new gameplay.

## Scope and design

Preserve the finished opening flow, close 3D base, original crew art and chosen side dock. The build reads `ideas/ui-mockups/flow-start-v1.html` and the latest side-dock CSS; it changes only its generated `dist/` copy. Source screen files and their builders are untouched. Latest screen work was merged from `origin/main` at `a1bafa7`; the handoff conflict was resolved by retaining both session entries.

Use the established navy #0a0e22 / #0d1433, cream #fbf9ff, purple #3a1f6e, amber #ffb547 and teal #5fd0c8. Fredoka carries controls and headings; Lexend carries supporting copy. Keep the scene as the main visual, jobs/help in the right dock, and compact current meters at lower left. New styles extend that layout rather than redraw the scene. Narrow views retain scrolling; small phones need landscape or horizontal scrolling.

## What works

- All seven weekly turns, normal and Solar max missions, shared engine validation, repeated light work, once-per-turn heavy jobs and instrument/power-saving order.
- Job previews with gains, costs and uncertainty. Current meters stay distinct from planned direct-job changes; full week effects apply only after confirmation and any alert decision.
- Available jobs, changing crew time, panel/scrubber faults, power emergency, air/dose failure, Earth-radio schedule, shadow and current storm conditions.
- Four main goals and their bonus checklists from the engine; final verdict and a week-end explanation log.
- Dust, storm, shadow/eclipse, extra crater-sample and legacy rover decisions as exposed by the engine. Alert choice does not advance the turn until resolved.
- In-dock Curio help, meter explanations, calendar (no future storm reveal), source notes and replay. False-alarm outcome is not disclosed in the current warning badge.
- Browser-local saves, including plans, pending alerts, recaps and ending. Older saves drop retired food controls in line with the concurrent food-removal decision.
- Local Three.js modules and existing local assets in `dist/`; fonts have system fallbacks. No account, live service or key required.

## Ownership and build

`src/web/model.js` is the session boundary around `src/engine/engine.ts`. `game.js` renders the HUD; `scene-bridge.js` changes framing, light and Earth visibility; `game.css` extends the finished screen. `scripts/build-web.ts` strips the engine's TypeScript using Node 24 and embeds config/data in its browser module. The build checks its integration anchors and fails explicitly if a future screen rewrite changes them.

`npm run dev` builds and serves at port 5173. `npm run build` produces `dist/`. Changes in `src/` and the selected screen sources rebuild the output; reload the browser afterward. If the scene's source template changes, run its existing builder first to refresh `flow-start-v1.html`.

## Verification

- `npm run test:web`: 8 integration tests. Covers planning without RNG mutation; engine validation; alert save/reload and exactly-once resolution; complete seven-week runs across both modes/several seeds; invalid saves; old supply-state migration; distinct air/dose failures and recoverable power emergency; extra crater-sample costs.
- `npm run sim`: completes 3,000 seeded normal-mode games. No balance tuning was done in this integration.
- Browser: actual WebGL rendering, selected jobs, preserved plan through Curio help, alert before commitment, seven-week progression, Earth-radio blackouts, final report, local scene-module requests, reload persistence and replay. Desktop and 728px layouts were inspected with Orca; all four main goals fit in the tablet overview. The console was clear. The separate test session used port 5183, preserving the mission open on port 5173.

## Existing limits

The imported engine still needs scientific/data and balance completion. Most non-May-2024 storm profiles lack bundled hourly snapshots; the UI labels them as game profiles. The default simulation remains planner 13% approved / careful 72%, below the documented planner target. Some alert choices (notably shelter/clean) still need explicit opportunity costs, as already recorded in the handoff. Integration preserves those imported rules; it does not certify the whole seven-week specification. Duplicate evidence jobs and survey-order criteria also need a dedicated rules review before claiming per-week/per-site scientific coverage.

No child playtest or public deployment was performed. Bea subsequently requested publishing the current work on a new branch: `feat/browser-gameplay`. This includes the food-removal changes and queued learning-task notes alongside the browser implementation. The earlier merge of finished screen work is committed separately; existing branches are preserved.

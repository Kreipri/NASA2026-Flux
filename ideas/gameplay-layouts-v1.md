# Gameplay layout study v1

2026-11-15 · **Historical comparison. Bea chose A (side dock).** Current refinement: `ui-mockups/gameplay-side-dock-v2/index.html`; exact meter/help treatments are still proposed.

Bea's brief: keep the current UI design and control sizes, but make task views less cramped. Include the actual 3D base. Another agent is working on the active mockups.

Baseline: the latest `flow-start-v1.html`, Week 1. Preserve its Fredoka/Lexend type, cream job cards, purple glass HUD, amber buttons, coloured meters and outlined v8.1 3D base. The older cyan console in `all-screens.html` is a different revision; this study uses the newer opening flow. No restyling or smaller text to fit content.

## Three arrangements

### A · Side dock — recommended

```
 Week / Earth link                      Jobs / Mission tasks
 ┌─────────────────────────────────┬──────────────────────┐
 │                                 │ Habitat  Solar       │
 │          3D base                 │ Shelter  Rover       │
 │       (reframed left)            │                      │
 │                                 │ Full-width job rows  │
 │                                 │ with costs below     │
 │ Ask Curio                       │                      │
 │ Meters                          │ Crew time            │
 │                                 │ Start week           │
 └─────────────────────────────────┴──────────────────────┘
```

- A stable place for tasks, with its own space for time and the action button. Meters move to bottom left; the large speech box closes while planning.
- The camera composition shifts the base into the uncovered part of the scene. Geometry, materials and lighting stay the same.
- Trade-off: less horizontal room for the world. Best balance between reading tasks and seeing the base.

### B · Bottom tray

```
 Week / Earth link                         Meters
 ┌────────────────────────────────────────────────────────┐
 │                      3D base                            │
 │                                                        │
 ├────────────────────────────────────────────────────────┤
 │ Habitat  Solar  Shelter  Rover                         │
 │ Job + costs                  Job + costs                │
 │ Crew time                              Start week      │
 └────────────────────────────────────────────────────────┘
```

- The task list opens across the bottom, with two jobs side by side. Mission tasks use four columns.
- Trade-off: keeps the full scene width, takes more of its height. The smallest landscape screens need scrolling within the tray.

### C · Focus window

```
 Week / Earth link                               Meters
 ┌────────────────────────────────────────────────────────┐
 │          ┌───────────────────────────────────┐         │
 │          │ Habitat │                         │         │
 │  3D      │ Solar   │  Big task reading area   │  3D     │
 │ behind   │ Shelter │  + every cost            │ behind  │
 │          │ Rover   │                         │         │
 │          │ Crew time             Start week  │         │
 │          └───────────────────────────────────┘         │
 └────────────────────────────────────────────────────────┘
```

- A larger centred planner removes competing pins and dialogue while open. Close it to return to the base.
- Trade-off: easiest reading; obscures more of the base and interrupts the spatial feeling of selecting a building.

## Draft boundaries

- Interactive file: `ui-mockups/gameplay-layouts-v1/index.html`. Switch A/B/C, Jobs/Mission tasks, or close the panel; click base pins or the place tabs, add/remove jobs, and review the plan. One shared plan persists when changing layouts.
- This is a layout sandbox. Direct job costs come from the existing `moon.json` snapshot; an unused time block or a job always has a time/resource trade-off. Normal mode omits the harder-mode call job (D-032).
- The meters show the starting example plus direct selected-job changes only. They do not run the week's upkeep, sunlight, storms or completion rules. All game numbers are visibly labelled **SIMULATED**. No live NASA feed is claimed.
- Source disclosure links to NASA for the reused Earth artwork and the south-pole setting; no invented NASA measurement is shown. Geometry remains the project's illustrative model.
- The study snapshots CSS, 3D code, assets and job costs into its own folder so another agent can continue changing the active flow safely. Rebuilding this study reads only its own sources. No engine/config changes, production integration, branch changes or commits.

## Visual rules

- Existing palette: panel `rgba(14,12,40,.86)`, card `#fbf9ff`, ink `#251b52`, amber `#ffb547`, teal `#5fd0c8`, line `#3a3f6e`.
- Existing type: Fredoka for game controls; Lexend for small cost chips and supporting text. Preserve existing sizes (job title 1.85cqw, panel title 2.3cqw, meters 1.5cqw, main action 2.2cqw).
- Alignment: left-aligned task names; costs on their own line; dedicated footer for crew time and start action. Never stack a task panel over a speech box.
- Review against brief: no new palette, fonts, decorative controls, or extra meters. The distinction between options is space allocation and disclosure, rather than art direction.

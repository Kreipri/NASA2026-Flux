# Gameplay branch integration

2026-11-15. Requested: latest main plus selected Added-Gameplay changes on gameplay-updates.

- Existing destination: `gameplay-updates` at `6948ea1`, already published as `origin/gameplay-updates`.
- Gameplay source: `Added-Gameplay` / `origin/Added-Gameplay` at `91e68e3`.
- Fetched main: `origin/main` at `238d80a`.
- The destination already contained exactly the six selected source files: `src/cli/play.ts`, `src/engine/engine.ts`, `src/config/moon.json`, `src/config/scenarios.json`, `src/content/lines.ts`, and `src/sim/bots.ts`.
- Merged latest main into the existing branch without conflicts, preserving published history and avoiding duplicate gameplay commits. Only integration documentation was edited; gameplay files still match the source branch.
- `npm run sim` completed successfully after merging: default `weeks7`, 500 seeds for each of six bots (3,000 games). Results matched the pre-merge baseline: careful 72% approved; planner 13%; no gold. These are balance observations, not full spec-coverage assertions.
- No engine-to-browser integration or balance tuning was performed. Review/playtest those separately before merging this branch into main.

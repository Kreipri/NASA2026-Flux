# Gameplay side dock v2

Bea chose the side-panel layout on 2026-11-15. This revision keeps the established cream/purple/amber UI, fonts and main control sizes. It stays separate from the other agent's active opening flow and preserves the v1 comparison.

Open `index.html`. Rebuild from the repository root with `python3 ideas/ui-mockups/gameplay-side-dock-v2/build.py`. The builder reads only this folder.

## What changed

- **Current 3D scene and closer camera:** refreshed from the latest `flow-start-v1.html`; crew-v5 Curio; base camera about 58 m away. A wider 38° field of view and horizontal framing keep the larger base beside the dock. The base-only view uses the flow's 34° lens. Same geometry, materials and light; the flow's softer VSM shadows use a cached 2048px map in this draft, with proportionally smaller blur for preview performance.
- **Compact named meters:** 2×2 grid for Power / Air / Radiation / Crew energy. Full words, icons, numeric values out of 100, short bars, and text status. Radiation explicitly says **Keep low**. Crew energy is visually separated and explained as tiredness. No reliance on colour alone. Tapping any meter opens its explanation inside Curio's dock.
- **Curio belongs to the side dock:** a persistent “Ask Curio” row opens help in the same panel. No floating speech popup over the base. Four short help topics, a targeted answer when a meter was tapped, and a return button that restores the current plan and place. Written examples, not a live chat service.
- **Child-facing communication status:** “Earth link” becomes **Earth radio: on**. Hover, keyboard focus or tap explains that Mission Control can send messages now; Curio still helps when Earth is out of view. Escape/outside click dismiss the explanation. This is status/help, not the harder-mode call job or a free resource action.
- **Simpler job copy:** “Air” instead of O₂, “Radiation” instead of Dose, “1 block / 4 blocks” instead of “1 time / 4 time,” Home / Panels tabs, and a single time-left display. Action IDs, costs, mission rules and saved example selections are preserved.
- **Four goals in view:** all four main mission tasks appear in the overview. A tap opens one task's main/bonus details, with “All 4 tasks” to return. This avoids an expanded bonus section pushing another goal out of sight.

## Resource options considered

1. **2×2 named mini meters — recommended and drafted:** shorter panel with visible labels and direction guidance; slightly wider than the old vertical stack.
2. **One horizontal strip:** leaves more vertical scene space, but four labels, bars and values compete across the base width.
3. **Icons/numbers only:** smallest footprint, but children must remember unfamiliar symbols and what each number means. Rejected for this readability goal.

The side dock itself is chosen. These exact meter/help treatments and copy are still a visual proposal for Bea to review; no production UI or engine integration is implied.

## Boundaries

All values are SIMULATED game points and preview direct job changes only. No week, upkeep, storm or win condition is run. No real NASA data is represented as live. Sources for reused Earth artwork and the setting are linked inside the draft. This does not change the number of core survival resources or make Curio the field rover.

The new scene and art are frozen in `source/`; `provenance.json` records the source hash and camera. Never copy this snapshot over newer shared scene work. Three.js and fonts still require internet. The draft is a landscape game layout; narrow portrait frames retain internal scrolling rather than silently shrinking task copy further.

## Verification

Real WebGL previews checked the closer scene, job dock, compact meters, Earth explanation, Curio answer and four-goal overview. Interaction/layout checks passed at 1280px and 728px: both jobs fit for every place, all four Curio topics fit, a meter opens the relevant answer, the plan survives help, radio help responds to hover/tap/Escape, and excess crew-time spending is blocked. No JavaScript errors in these checks. Local control checks skipped GPU drawing; separate HTML previews exercised actual rendering. Initial 4096px VSM previews exceeded the preview tool's 20-second load limit, so this draft caches a 2048px map with matched blur softness.

The four-goal overview also passed a fit check at the narrower 728px frame. Each goal opens its details; Escape/All 4 tasks returns keyboard focus to that goal; returning to Jobs preserves the selected plan. The mission footer puts Ask Curio beside Choose jobs to leave all four goals visible.

No child playtest has happened. Next validation should ask a child which meter should stay low, what a job costs, what Earth radio means, and how to ask Curio without losing their plan. The draft is not evidence yet that the wording works for every age from 7–12.

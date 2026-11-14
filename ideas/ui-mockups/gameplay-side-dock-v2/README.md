# Gameplay side dock v2

Bea chose the side-panel layout on 2026-11-15. This revision keeps the established cream/purple/amber UI, fonts and main control sizes. It stays separate from the other agent's active opening flow and preserves the v1 comparison.

Open `index.html`. Rebuild from the repository root with `python3 ideas/ui-mockups/gameplay-side-dock-v2/build.py`. The builder reads only this folder.

## What changed

- **Current 3D scene and closer camera:** refreshed from the latest `flow-start-v1.html`; crew-v5 Curio; base camera about 58 m away. A wider 38° field of view and horizontal framing keep the larger base beside the dock. The base-only view uses the flow's 34° lens. Same geometry, materials and light; the flow's softer VSM shadows use a cached 2048px map in this draft, with proportionally smaller blur for preview performance.
- **Compact named meters:** 2×2 grid for Power / Air / Radiation / Crew energy. Full words, icons, numeric values out of 100, short bars, and text status. Radiation explicitly says **Keep low**. Crew energy is visually separated and explained as tiredness. No reliance on colour alone. Tapping any meter opens its explanation inside Curio's dock.
- **Curio belongs to the side dock:** a persistent “Ask Curio” row opens help in the same panel. No floating speech popup over the base. Four short help topics, a targeted answer when a meter was tapped, and a return button that restores the current plan and place. Written examples, not a live chat service.
- **Child-facing communication status:** “Earth link” becomes **Earth radio: on**. Hover, keyboard focus or tap explains that Mission Control can send messages now; Curio still helps when Earth is out of view. Escape/outside click dismiss the explanation. This is status/help, not the harder-mode call job or a free resource action.
- **Simpler job copy:** “Air” instead of O₂, “Radiation” instead of Dose, “1 block / 4 blocks” instead of “1 time / 4 time,” Home / Panels tabs, and a single time-left display. Action IDs, costs, mission rules and saved example selections are preserved.

## Resource options considered

1. **2×2 named mini meters — recommended and drafted:** shorter panel with visible labels and direction guidance; slightly wider than the old vertical stack.
2. **One horizontal strip:** leaves more vertical scene space, but four labels, bars and values compete across the base width.
3. **Icons/numbers only:** smallest footprint, but children must remember unfamiliar symbols and what each number means. Rejected for this readability goal.

The side dock itself is chosen. These exact meter/help treatments and copy are still a visual proposal for Bea to review; no production UI or engine integration is implied.

## Boundaries

All values are SIMULATED game points and preview direct job changes only. No week, upkeep, storm or win condition is run. No real NASA data is represented as live. Sources for reused Earth artwork and the setting are linked inside the draft. This does not change the number of core survival resources or make Curio the field rover.

The new scene and art are frozen in `source/`; `provenance.json` records the source hash and camera. Never copy this snapshot over newer shared scene work. Three.js and fonts still require internet. The draft is a landscape game layout; narrow portrait frames retain internal scrolling rather than silently shrinking task copy further.

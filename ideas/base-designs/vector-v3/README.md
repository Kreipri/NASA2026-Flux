# Space base — no dark outlines

2026-11-15. Bea suggested removing the outlines to match the sprites. This is the current visual draft; v1 and the outlined v2 remain preserved.

- **Removed:** all added dark silhouette contours, outlined rods and dark tunnel edging from v2. No outline-weight controls in this draft.
- **Kept:** crew-v5's light-to-slate shading, broad pale inner rims on metal, navy glass, cyan lights, amber accents and quieter interior seams. Grey structural lines and panel grids describe equipment; they are not dark outer contours. Regolith stays matte. The actual astronaut and Curio sprite sources are untouched.
- `space-base.svg`: editable grouped vector, transparent, 1100 × 410.
- `space-base-without-crew.svg`: same without the astronaut.
- `space-base.png`: transparent 2200 × 820 export; `preview-navy.png`: 1650 × 615 preview.
- `review.html`: current/previous-outlined comparison beside the unchanged Curio and astronaut sprites, plus an isolated title-screen placement. `in-screen.html` contains that title placement; its typography retains the existing Google Fonts link.
- Rebuild the SVGs and review with `python3 ideas/base-designs/vector-v3/build.py`. PNGs are separate resvg exports. The builder reads the previous v2 SVG only for comparison, and current title/crew files as references; active assets and scene sources are not changed.

Actual vector shapes, gradients and clipped inner rims; no embedded raster, filters, scripts, fonts or external resources in either SVG. Fictional game art, not a NASA engineering diagram. The field rover remains separate from Curio.

Validation: both SVGs rendered; unique IDs and gradient/clip references checked; no added #27304C outline strokes; transparent export margins clear. Reviewed beside sprites, on navy/light and in the title screen. HTML preview has no console errors.

This supersedes the outlined v2 recommendation for the 2D base draft. D-023's gameplay 3D and all active screen/sprite files remain unchanged.

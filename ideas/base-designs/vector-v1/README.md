# Space base — vector draft v1

2026-11-15. Requested by Bea: “can you try vectorizing the space base?”

Editable SVG redraw of `ideas/ui-mockups/assets/base-clipart.png`, the project's existing original 3D base render. This is a visual draft for review; the active scenes and gameplay model still use their current assets.

## Files

- **`space-base.svg`** — recommended version. Transparent, 1100 × 410 viewBox, soft metal gradients, navy glass, cyan lights, amber accents. Buildings, solar array, shelter, tunnel, tower, deck, landing gear, ladder, rover and astronaut are named groups. Import directly into Figma or another SVG editor.
- **`space-base-without-crew.svg`** — same composition with the astronaut removed so a scene can add its own crew.
- **`space-base.png`** — transparent raster export, 2200 × 820, for quick placement where SVG is inconvenient.
- **`preview-navy.png`** — raster preview on a navy background, 1650 × 615.
- **`review.html`** — standalone comparison: vector/original toggle and navy/light/checker backgrounds. Both artworks embedded locally; no network requests.
- **`build.py`** — editable drawing source; Python standard library only. Run `python3 ideas/base-designs/vector-v1/build.py` from the project root to rebuild both SVGs and the comparison. PNG previews are separate exports, not inputs to the drawing.

## Three approaches considered

1. **Clean redraw — recommended and implemented.** Smooth curves, a small set of shared gradients, and component groups are practical to edit. Trade-off: simplified reconstruction rather than pixel-identical tracing.
2. **Automatic colour trace.** Closest to the original raster's shading. Trade-off: many small paths, including fuzzy edges and incidental rendering artefacts; harder to restyle.
3. **Projected 3D geometry.** Can follow the model's camera and proportions exactly. Trade-off: dense overlapping faces and limited matching of the original shader's soft shading.

The draft preserves the low camera, arrangement and recognizable equipment. It simplifies perspective, ribs, surface shading and rover detail. The astronaut reuses the project's `crew-v5/export/astronaut.svg`, with blur-only copies removed and all IDs prefixed. The field rover is separate from Curio (D-026).

The SVGs contain actual vector shapes and gradients: **no embedded raster, filters, fonts, external dependencies or scripts**. Glow uses transparent circles. The background stays transparent and scenes supply their own ground shadows. This is fictional game art, not a sourced NASA engineering diagram or a change to equipment facts.

## Review / next step

Compare with the original and review before replacing story-screen assets. Choosing this draft would concern the title/story illustration only; gameplay remains the 3D scene under D-023. Source PNG and all active scene/build files are preserved.

Validation: SVG XML and unique/reference IDs checked; both variants rendered with resvg; transparent export checked for clear edges; full illustration reviewed on navy and light backgrounds; comparison previewed at desktop and phone widths without console errors.

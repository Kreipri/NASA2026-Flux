# Fresh vectorization from the actual 3D model

Bea's clarified request: “just pull up the 3d model again and try to vectorize it.” This draft starts directly from the game's Three.js model. It does not read or revise any previous base SVG or reference PNG.

- **`space-base.svg`** — transparent vector export of the actual meshes: habitat, deck, legs, tunnel, shelter, tower, panels, power unit, six-wheel rover and 3D astronaut. Original model positions, rotations and proportions; authored close-base camera (~58 m, 34° field of view). No dark silhouette outlines are added.
- **`space-base.png`** — transparent 2200px-wide export. `preview-navy.png` is the review preview.
- **`review.html`** — vector/source comparison and light/navy backgrounds. **3D source** renders the actual model geometry and materials using the same camera; it loads Three.js 0.160 from jsDelivr.
- **`model-view.html`** — isolated original-model render. No active game or save-state changes.
- **`export.mjs`** — rebuild with `node ideas/base-designs/from-3d-v1/export.mjs` from the project root after installing the project's pinned Three.js dependency. PNGs are separate resvg exports.
- **`model-source.snapshot.js` / `provenance.json`** — source geometry snapshot, source SHA-256, camera and counts.

Method: reconstruct the actual base from `ideas/ui-mockups/flow-start-v1.html`; project 238 meshes / 58,895 front-facing triangles; resolve visible surfaces with a 4× geometry depth buffer; convert visible regions into simplified SVG paths. Solar grids are projected vector lines; glow is SVG radial gradients. Normal-based shade/rim bands and per-mesh gradients approximate the 3D materials. No rendered bitmap is embedded in the SVG.

Trade-off: the geometry and placement come from the model, while shader lighting is approximated. The dense SVG is less convenient to edit than the earlier hand drawing. Visibility boundaries are sampled at 4× and simplified, so this is not an exact analytic export of every curve. Sky, terrain, distant objects, ground shadows and the second distant astronaut are excluded from the cutout.

The original 3D files and the game's currently integrated v3 artwork are untouched. This is a new visual trial, not a production asset swap. The partial `vector-v4/` revision was withdrawn after the source clarification.

Validation: SVG XML, unique IDs and gradient references checked; no embedded bitmap/scripts. Rendered a 2200 × 844 transparent PNG with clear margins. Compared the vector and isolated source render at 728 px; the review uses the same camera for each. Browser preview reports software-WebGL performance warnings for the source viewer, with no application errors.

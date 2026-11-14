# Space base — screen and sprite style match

2026-11-15. Bea requested matching the screens and sprites, including outlines and line weight. This revises the first SVG draft; `vector-v1/` is preserved for comparison.

## Style references and changes

- **Screen contours:** `ideas/ui-mockups/all-screens.html`, v8.1 outline material: slate-navy **#27304C**, rounded joins, restrained silhouette lines. This colour comes from the screen source; the 3D renderer controls its own screen-space width.
- **Sprite materials:** `ideas/character-designs/crew-v5/build.mjs` and `export/astronaut.svg`: broad, pale **inside** rim on metal; fill #E3E5EA → #8A90A2 with gradient span 1.9; rim #EFF0F3 → #B4B8C4 with span 1.1. Mid-tone metal uses #A0A5B2 → #6F768C. Regolith stays matte.
- **Shared accents:** screen glass #1D2B4C → #4465B2; cyan #21DBE3; amber #F7C081 → #BF833E. The imported astronaut is unchanged, apart from the earlier removal of blur-only copies and ID prefixes.
- **Line hierarchy:** main contours **3.2 SVG units**, internal seams **1.6–2.2**, solar grid **1.1 at 42% opacity**. At 680 px illustration width, a 3.2-unit contour reads at about 2 px. All line weights scale with the SVG; they are not a claim of pixel-identical width to the 3D shader at every size.
- Outline each object's silhouette once. Inner bezels, hubs and amber plates stay quieter; no extra dark rings around every nested shape. Tunnel ribs reduced from eight to six; solar rows reduced from sixteen to twelve cells.

This combines the screen's ink with the sprite's bevel. The crew-v5 sprites themselves still use their established rim-only treatment; no crew files are edited.

## Three line-weight options

1. **Match — recommended, `space-base.svg`:** 3.2-unit main contour; balances the current screen outlines with the softer sprites.
2. **Fine — `space-base-fine.svg`:** 2.2; lighter, closer to the rim-only sprites, but small structures lose definition at title-screen size.
3. **Bold — `space-base-bold.svg`:** 4.2; clearer at small sizes, but the tower and tunnel read more like outlined cartoons.

Other files:

- `space-base-without-crew.svg`: recommended version without the astronaut, for independent crew placement.
- `space-base.png`: transparent 2200 × 820 PNG of the recommended version.
- `preview-navy.png`: 1650 × 615 preview on navy.
- `review.html`: comparison with the first pass, three weight options, unchanged Curio/astronaut sprites, a material close-up and an **In title screen** tab.
- `in-screen.html`: isolated copy of the actual title's art and CSS with this SVG placed into it. Placement moves down 10 title-viewBox units to align the feet with the existing contact shadow after accounting for SVG padding. Font loading retains the title's Google Fonts link; the artwork itself is embedded.
- `build.py`: standalone Python-stdlib drawing source. Run `python3 ideas/base-designs/vector-v2/build.py` to regenerate the four SVGs and two HTML comparisons. PNGs are separate resvg exports. It reads the v1 SVG only for the before comparison and reads current title/crew files as references; it never writes to them.

All delivered SVGs remain editable shapes, gradients and clip paths with named component groups; no raster images, filters, scripts, fonts or external resource references. Rims are explicit clipped vector strokes. Fictional game illustration, not a NASA engineering diagram.

Validation: all four SVG variants rendered, with transparent export margins; unique IDs and gradient/clip references checked. Comparison checked at 728 and 390 px; title placement checked at 728 px; navy and light-background artwork inspected. No console errors in the HTML previews.

Current draft only. Active mockups, 3D model, sprite assets and scene builders are preserved. Review before replacing active story artwork; D-023's gameplay 3D is unchanged.

# Curio-style crew + placeholder astronaut (v5)

**Status:** proposed. Bea designed Curio in Figma (file `YznDtv2gQnixiByOM5iPTQ`, node 4-183); this folder restyles the crew to match it and adds a placeholder astronaut sprite.

- `curio-figma.svg`: Bea's Curio, exported from Figma unchanged (source of truth for the style).
- `crew-curio-style.svg` + `preview/crew-curio-style.png`: overview sheet.
- `build.mjs`: generator (Node, no deps). `node ideas/character-designs/curio-style-v5/build.mjs`
- `export/`: drag-into-Figma SVGs with named layers (`tail`, `legs`, `body`, `arm-left`, `head`, `arm-right`, `prop`; astronaut adds `backpack`, `helmet`).
  - `crew/` bram, remy, mica-cat (role gear)
  - `astronaut/frames/` idle-1/2, walk-1/2, wave-1/2 (165×241 each, transparent)
  - `astronaut/astronaut-sheet.svg` all 6 frames in one 990×241 strip
  - `astronaut/variants/` generic + colour-band versions for bram, remy, mica, commander

## Style rules (read off Curio)
1. Squircle shapes (big rounded rects), no dark outlines.
2. Vertical gradient: base colour on top, cooler slate (#4F5772 mix) at the bottom.
3. A thick, lighter **inner** rim (bevel) on **metal only** (Curio, astronaut suit, props). Fur and cloth are matte: gradient fill, no rim (Bea: animals aren't shiny).
4. Navy screen gradient #1D2B4C → #4465B2; glowing cyan #21DBE3 / #09F5F9 accents.
5. One amber plate (#F7C081 → #BF833E) per character.
6. Crew (v5.1, Bea's notes): chibi, head ~145×120 on a ~60×48 body; face layout (v5.3) from Bea's star-mascot reference: features clustered just below the head's middle — short navy oval eyes (19×28, v5.4: bigger, no shine), round solid blush just under/outside each eye (tinted to the fur), nose set higher (between the eyes' lower half), small curve mouth below; no tails on Bram/Remy (read as extra paws/sticks); props at 72%; extra details removed.

## Notes / open
- Mica is a **single-colour grey-blue cat** (Bea: simpler than tuxedo); species pick still open. Export file is still `mica-cat.svg`.
- Placeholder astronaut is faceless (visor only), so one sprite covers any crew member or the player until suits are final. The colour band on the arms tells crew apart.
- Front-view walk only (leg lift + arm swing). No side-view walk yet.
- v5.5: Bram's muzzle enlarged to hold nose + mouth; Remy flat white fur (no gradient); Mica lighter with a gentle gradient; face features #141C33, stronger blush.
- Filters (blush, cyan glow) come into Figma as layer blur effects.

# Crew v5: Bram, Remy, Mica, Curio + placeholder astronaut

**Status:** proposed. Bea designed Curio in Figma (file `YznDtv2gQnixiByOM5iPTQ`, node 4-183); this folder draws the whole crew in that style and adds a placeholder astronaut. (Folder was `curio-style-v5` until 2026-11-15.)

- `curio-original.svg`: Bea's Curio, exported from Figma unchanged (source of truth for the style; `build.mjs` reads it).
- `crew-lineup.svg` + `preview/crew-lineup.png`: everyone side by side, astronaut frames and colour bands.
- `sheets/<name>-sheet.svg` + `preview/<name>-sheet.png` for bram, remy, mica, curio, astronaut: **character sheets**: hero pose, front/side/back turnaround, 6 expressions (happy, laugh, wow, worried, sleepy, thinking; the astronaut shows its 6 animation frames and arm-band colours instead), palette with hex, personality line (from `character-concepts-v3.md`). Curio's front is Bea's file unchanged; its side/back views and eye expressions are drafts built from her shapes and gradients.
- `export/`: drag-into-Figma SVGs, 165×241, transparent, named layers (`tail`, `legs`, `body`, `arm-left`, `head`, `arm-right`, `prop`; astronaut adds `backpack`, `helmet`).
  - `bram.svg`, `remy.svg`, `mica.svg`, `curio.svg`, `astronaut.svg`: one per crew member
  - `astronaut-frames/`: idle-1/2, walk-1/2, wave-1/2, plus `astronaut-frames-strip.svg` (all 6 in one 990×241 strip)
  - `astronaut-colours/`: generic + arm-band versions for bram, remy, mica, commander
- `build.mjs`: generator (Node, no deps). `node ideas/character-designs/crew-v5/build.mjs` rewrites everything except the README and `curio-original.svg`; previews are rendered separately.

## Style rules (read off Curio)
1. Squircle shapes (big rounded rects), no dark outlines.
2. Vertical gradient: base colour on top, cooler slate (#4F5772 mix) at the bottom.
3. A thick, lighter **inner** rim (bevel) on **metal only** (Curio, astronaut suit, props). Fur and cloth are matte: gradient fill, no rim (Bea: animals aren't shiny).
4. Navy screen gradient #1D2B4C → #4465B2; glowing cyan #21DBE3 / #09F5F9 accents.
5. One amber plate (#F7C081 → #BF833E) per character.
6. Crew (v5.1, Bea's notes): chibi, head ~145×120 on a ~60×48 body; face layout (v5.3) from Bea's star-mascot reference: features clustered just below the head's middle — short navy oval eyes (19×28, v5.4: bigger, no shine), round solid blush just under/outside each eye (tinted to the fur), nose set higher (between the eyes' lower half), small curve mouth below; no tails on Bram/Remy (read as extra paws/sticks); props at 72%; extra details removed.

## Notes / open
- Mica is a **single-colour grey-blue cat** (Bea: simpler than tuxedo); species pick still open. Export file: `export/mica.svg`.
- Placeholder astronaut is faceless (visor only), so one sprite covers any crew member or the player until suits are final. The colour band on the arms tells crew apart.
- Front-view walk only (leg lift + arm swing). No side-view walk yet.
- v5.5: Bram's muzzle enlarged to hold nose + mouth; Remy flat white fur (no gradient); Mica lighter with a gentle gradient; face features #141C33, stronger blush.
- Filters (blush, cyan glow) come into Figma as layer blur effects.

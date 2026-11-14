# Character design drafts

## Crew sheet v1 — 2026-11-15

**Status:** first visual proposal for Bea's review; not an approved final cast or production asset. Bea requested a child-friendly vector clip-art style, authorizing this visual pass beyond text ideation.

- Image: [crew-sheet-v1.png](crew-sheet-v1.png)
- Exact generation prompt: [crew-sheet-v1-prompt.txt](crew-sheet-v1-prompt.txt)
- Character brief: [character-concepts-v3.md](../character-concepts-v3.md)
- Method: built-in image generation tool, new generation, no reference images. Output is a raster PNG with a vector clip-art appearance; no editable vector source is claimed.
- Layout: Curio in a distinct help panel; Bram (dog, base systems), Remy (rabbit, crew health), Mica (squirrel monkey, exploring); one human commander example at right.
- Design: unified ivory/navy/teal suits, amber tools, clear adapted helmets, rounded shapes, restrained shading, distinct species silhouettes. Tiny original two-star/B details carry the proposed optional tributes; their meanings belong in sourced optional profiles, not invented history.
- Commander appearance is an illustrative placeholder, not a locked player identity. Names, species, proportions, and individual designs remain proposed.

Visual review: all five figures and labels are present; no cropped heads/feet, exposed animal ears/tails outside pressure gear, copied agency logos, or separate field rover. Curio's panel communicates its helper-avatar role. Shading is somewhat softer than strictly flat vector fills; if this direction is chosen, simplify those transitions when creating production vector assets. Confirm Mica's squirrel-monkey face markings during that pass. No UI/engine integration or new mechanics were added.

Next review: overall age appeal, species/name approval, and whether the avatar panel makes Curio's role sufficiently clear. Then refine selected characters rather than creating more full-team alternatives by default.

## Vector v2 — real SVG, three style versions — 2026-11-15

**Status:** rejected by Bea (too stiff, wanted cuter/smaller). Kept as history; see chibi v3. Hand-built, editable SVG (no image generation). Same cast, palette and props as sheet v1, so it's a style choice, not a redesign.

- Source: [vector-v2/build.mjs](vector-v2/build.mjs) (one shared part library; run `node ideas/character-designs/vector-v2/build.mjs` to regenerate). PNG previews in `vector-v2/preview/`.
- **A. Flat clip-art** — [crew-A-flat.svg](vector-v2/crew-A-flat.svg): no outlines, one soft shade; closest to v1. Single-character files `A-<name>.svg` for reuse.
- **B. Sticker** — [crew-B-sticker.svg](vector-v2/crew-B-sticker.svg): bigger helmets, ink outline, white die-cut edge. Outline comes from an SVG filter, so Figma/Illustrator import may flatten it; production would bake it as paths.
- **C. Portrait badges** — [crew-C-portraits.svg](vector-v2/crew-C-portraits.svg): helmet-as-badge head-and-shoulders, tested at 64/48/32/24 px, plus dialogue and Ask Curio bubble examples. Curio shrinks to its camera head, as the v3 brief asks.
- **Recommendation:** A for full-body story/crew cards + C for in-game dialogue/HUD (same parts, so they match). B suits a title/sticker reward moment but adds a third look; skip it unless you want collectible stickers.
- Known gaps: hands are simple mitts; Bram's two-star patch is tiny at sheet size; rabbit ears clip slightly at the dome top in C. Commander remains a placeholder.

## Chibi v3 — current — 2026-11-15

**Status:** draft for Bea's review (D-030). Bea's references: a screen-faced robot mascot set and a fox/duck/hedgehog children's character sheet. Only the style traits are used, not those characters.

- Sheet: [chibi-v3/crew-chibi.svg](chibi-v3/crew-chibi.svg) (preview: `chibi-v3/preview/crew-chibi.png`). Single files `chibi-<name>.svg`. Source: `chibi-v3/build.mjs` (faces take an expression: happy, smile, laugh, wow, worried, wink).
- Rows: **inside** (default, teal flight suit, no helmet) / **outside** (helmet + white suit; tails tucked in; Curio stays in its help panel) / **feelings**.
- Curio: rover body + mast; camera head with a dark screen showing pixel faces, a lens on top. Its face can show moods without a mouth or arms.
- Open: Mica's monkey read at small sizes; Bram's tail vs arm overlap; commander is still a placeholder; no side/back views yet.

## Chibi v4 — outfits + Mica fix — 2026-11-15

**Status:** options for Bea (she disliked v3's Mica and asked to redo suits and out-of-suit clothes). Sheet: [chibi-v4/crew-outfits.svg](chibi-v4/crew-outfits.svg), preview `chibi-v4/preview/crew-outfits.png`, source `chibi-v4/build.mjs`.

- **Mica redone** with real squirrel-monkey cues: grey-olive crown with a peak, white arches over each eye, small black muzzle, big pale ears, golden head/arms, black-tipped tail.
- **Personal colours:** Bram blue, Remy pink, Mica green, You orange. Always paired with species + an item.
- **Out of suit:** 1 crew polo (most real) / 2 cozy hoodie / **3 role gear (rec):** Bram tool vest + wrench, Remy jacket + stethoscope, Mica field vest + magnifier, You commander jacket + clipboard.
- **Suit:** A bubble helmet / **B visor helmet (rec):** hard shell + face window, ear pods, colour band / C colour suit (inaccurate: real suits are white; conflicts with D-009).
- No tool for vector generation exists in this setup; art is hand-built SVG. Image generation gives PNG only, and tracing gives messy paths.

## Mica species options — 2026-11-15

Bea still disliked the squirrel monkey and asked to see 3 replacements. Sheet: [chibi-v4/mica-options.svg](chibi-v4/mica-options.svg) (preview `chibi-v4/preview/mica-options.png`). Same name, job and personality; only the species changes.
- **Tortoise:** Zond 5 (1968) Moon-flyby nod; shell doubles as the suit backpack. Risk: can read as a frog or dinosaur; "slow" stereotype.
- **Cat (agent pick after drawing):** tuxedo nod to Félicette (1963). Strongest silhouette and cutest at small size. Risk: sad real ending (keep it in an optional profile); common mascot.
- **Simple monkey:** heart-shaped face. Readable, but loses the Baker nod anyway and drifts toward comic relief.
- All history nods are TO VERIFY and need fact-registry rows before display. If the cat wins, the Zond 5 tortoises can still be a "Did you know?" fact.

## Curio as a robot — 2026-11-15

Bea asked whether Curio should be a rover or a robot. Agent view: a small robot with a Curiosity-inspired head (camera box, round "eye" on top, side cameras, screen face), so it can't be confused with the field rover and can gesture. No floating (wrong on the Moon), no full humanoid (it would read as a 5th crewmate). Sheet: [chibi-v4/curio-options.svg](chibi-v4/curio-options.svg) (preview `chibi-v4/preview/curio-options.png`).
- **1 Wheels:** clearest rover link and best at tiny sizes; less able to hop or dance.
- **2 Wheel-feet (agent pick):** walks, but each foot is a tiny 3-wheel rover bogie. Keeps the nod and the expressiveness; the feet turn into dots at small sizes.
- **3 Little legs:** most expressive, but loses the rover link and sits closest to Bea's screen-face robot reference (avoid copying it).
- Shared pixel screen faces: happy, smile, think, wow, worried, laugh. Not decided; D-026 (Curio ≠ field rover) still holds.

# Character draft v3: Curio the helper AI + three astronaut crewmates

**2026-11-15.** Current draft, replacing v2's physical-Curio concept. **Confirmed by Bea:** Curio is the helper AI bot, separate from the rover used for exploration. Names, animal species, visual treatments, and backstories below remain proposals.

**First visual pass:** Bea requested child-friendly vector clip-art designs. See `character-designs/crew-sheet-v1.png` and `character-designs/README.md` for the generated concept sheet, prompt, and review notes. It includes an example human commander; no appearance or cast choice is finalized.

## Cast at a glance

| Character | Identity | Mission contribution |
|---|---|---|
| You / Commander | Human player | Decide priorities and assign the shared time/resources |
| Curio | Fictional helper AI with a Curiosity-inspired avatar | Tour, questions, explanations, source cards, recaps |
| Bram | Dog astronaut; engineering background | Leads base-systems work |
| Remy | Rabbit astronaut; medical background | Leads crew-health checks |
| Mica | Squirrel-monkey astronaut; geology background | Leads observations and sample planning |
| Exploration rover | Separate field equipment, not a speaking cast member | Mapping/sampling tasks with existing costs |

The crew stays four astronauts including the commander. The field rover's exact hardware/design is outside this character draft.

## 1. Curio — your curious console companion
- **Role:** the game's helper AI character. Appears beside dialogue, in the tutorial, and through Ask Curio (the current Ask Base Bot concept). The proposed presentation is an on-screen avatar, not a second physical robot to manage.
- **Look:** a compact rover-shaped avatar with six little wheels and a camera mast that reads as a head. Warm-white body, navy camera housing, amber accents. Simplify it to the camera head for tiny UI placements. No floating physical rover in the lunar scene.
- **Personality:** curious, patient, slightly literal. Finds small questions interesting; never acts disappointed when the player asks again. Humor comes from noticing details, not wrong readings.
- **Fictional hook:** a mission-training assistant built to turn confusing readings into questions a young commander can work through. Its real-world inspiration is Curiosity's exploration story, not a claim that Curiosity's actual software talks or has moved to the Moon.
- **Example:** "That job uses power. Shall we check how much we'll have left?"
- **Boundary:** Curio explains the field rover's readings; it does not drive to the crater, collect samples, automatically choose the best action, or replace any astronaut. It cannot invent measurements or facts. Unmeasured results stay unknown.
- **Implementation scope:** helper AI is a character role, not a new requirement for live AI chat. Vetted explanations and question chips work for the prototype; D-004 still governs any AI-written story text. Locally stored help can remain available during the Earth-link blackout; no new connectivity or bot-battery mechanic is proposed.

**Curio vs rover:** asking Curio a question is part of the existing help interface. Sending the exploration rover is a resource-costing game action. They need distinct names and visual treatments. Curio's decorative wheels do not imply a deployable unit. V2's rover recharge/sampling-arm discussion no longer applies to Curio.

## 2. Bram — dog astronaut, trained as an engineer
- **Focus label:** Base systems. A fictional responsibility within our crew, not a required NASA job slot.
- **Look:** warm tan fur, darker floppy ears, broad muzzle, square tool pouch. Deliberate, steady gestures. Species features fit inside adapted pressure gear.
- **Personality:** practical and reassuring; loves a well-made plan. Gets so absorbed in improving a system that someone sometimes needs to say, "Good enough for today."
- **Small personal detail:** carefully labels every tool, including a completely obvious wrench.
- **Useful tension:** sees why maintenance matters, but must weigh one more repair against the crew's other jobs.
- **Example:** "I can fix that panel. It'll take time we could use for exploring."
- **Optional Easter egg:** a small two-star keepsake patch honoring Belka and Strelka. The patch is our fictional design; an optional profile explicitly identifies the real Soviet dogs and their safe return. Bram is a separate fictional character, not either historical dog.

## 3. Remy — rabbit astronaut, trained as a doctor
- **Focus label:** Crew health. Shared safety procedures still apply to everyone.
- **Look:** pale-grey fur, long ears fully contained in an adapted helmet, compact medical pouch; upright, open posture. Avoid using color alone to identify the role.
- **Personality:** warm, brisk, and composed. Likes being outdoors and joining the work; does not exist just to say "no" to every expedition.
- **Small personal detail:** enjoys drawing the places the crew visits; wants everyone well enough to see the next one.
- **Useful tension:** wants meaningful progress while recognizing that tired astronauts need time to recover.
- **Example:** "We can try again tomorrow. Let's rest so we're ready."
- **Easter egg:** none required. Remy is an original character selected for silhouette and personality; no historical rabbit identity is implied. This keeps the references from becoming a compulsory theme for every character.

## 4. Mica — squirrel-monkey astronaut, trained as a geologist
- **Focus label:** Exploring. Profile explains geologist as "a scientist who studies rocks."
- **Look:** small rounded ears, dark muzzle, light face markings, compact sample case. Accommodate the tail in the suit design; no exposed fur on the lunar surface.
- **Personality:** observant and thoughtful, with sudden bursts of excitement over a tiny clue. A careful note-taker rather than automatic monkey comic relief.
- **Small personal detail:** sketches each sample and gives it an unofficial nickname alongside its proper label.
- **Useful tension:** knows another sample can improve the evidence, but curiosity can tempt them to ask for one more trip.
- **Example:** "We checked one spot. Another sample could tell us more—but it'll use power."
- **Optional Easter egg:** a little B-tag on the sample case honors Baker, the squirrel monkey who returned from a 1959 Army suborbital flight. Optional profile explains the tribute; Mica is not Baker and does not inherit Baker's history.

## Recommendation and trade-offs

**Recommend this ensemble for the next concept pass:** dog / rabbit / squirrel monkey, with a virtual rover-shaped Curio. Faces and helmet silhouettes differ, and each character has an interest beyond their profession. The dog and monkey provide two history connections without making the whole cast historical stand-ins.

Trade-offs: long ears/tails need deliberate suit shapes; the rabbit lacks a named history reference (intentional); Curio's rover-shaped avatar could still be confused with field equipment. Use Curio consistently within help UI and give the field rover a separate functional silhouette/name. If confusion persists, reduce Curio's avatar to a mast/head plus console pedestal rather than creating another bot body.

All three are astronauts with broad and overlapping training. Backgrounds are credible; these exact duty assignments and cast composition are our fiction. No species perks, profession-locked actions, extra meters, free rover actions, or story implication that historical animals chose to volunteer.

## Reference handling

The prior pass verified the engineering, profession, and animal-history sources; see `character-concepts-v2.md` for the full research notes. No new historical claim is introduced here.
- [NASA/JPL: Curiosity's name](https://www.jpl.nasa.gov/news/nasa-selects-students-entry-as-new-mars-rover-name/) — inspiration for Curio; the avatar/AI identity is fictional.
- [NASA: Animal spaceflight history](https://www.nasa.gov/history/a-brief-history-of-animals-in-space/) and [Belka/Strelka](https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question49.html) — use only the specific claims verified in v2; correct program attribution, no broad "first living creatures to return" claim.
- Professions/training: fact-registry F23 and v2's NASA references. History/profile facts need their own registry rows before any app display.

> **History.** Superseded by `storyline-v2.md` (final copy draft, 2026-11-15).

# Storyline v1.1: prelude → mission briefing → play → ending (proposed, 2026-11-14)

**Status:** draft for Bea's review. Builds on `experience-arc-v1.md` and the v6.2 story cards in `ui-mockups/all-screens.html`. Assumes the proposed Junior Astronaut framing (see DECISIONS, "Objective reframed"). Week timeline from D-020. Everything here is `[✎ Story]` unless it carries a NASA badge. **Every ✓ fact must have a row (F-ID) in `fact-sources.md`, which powers the tap-to-see source card.** Crew names, the mascot ("Base Bot") and the title are still placeholders.

**The through-line in one sentence:** *Your crew all want different things, the Sun doesn't care, and halfway through Earth goes quiet, so you have to make the calls yourself.*

**v1.1 changes (Bea's feedback):** added a prelude on why we go, did a fact check (crew roles, mission length, why the Sun doesn't set), added fun facts plus "Ask Base Bot" questions, added more emphasis, and added options for varied gameplay.

**Character accuracy follow-up (2026-11-15):** profiles describe astronaut backgrounds, not three mandatory NASA crew slots. M4 corrected below; Engineer/Doctor/Geologist in later beat tables are writing shorthand for these fictional characters, not formal flight assignments. Everyone shares training and can help across duties. Current cast draft: `character-concepts-v3.md`; Curio is the helper AI (the Base Bot placeholder), separate from the exploration rover. HTML mockups are not updated in this pass.

---

## 0. Fact check (2026-11-14, nasa.gov via web search)

| Claim | Verdict | Use in game |
|---|---|---|
| Crews have an engineer, a doctor and a geologist | **Plausible backgrounds, not a required crew composition.** NASA recruits across engineering, medicine, and science, with shared basic and mission-specific training. Geologist Harrison Schmitt's Apollo 17 assignment was lunar module pilot; Anil Menon is a physician-astronaut. A crew member with medical duties need not be a doctor; flight surgeons also support crews from Mission Control. Rechecked 2026-11-15; sources in `character-concepts-v2.md`. | Keep the 3 fictional astronauts, with these **backgrounds** ("trained as a doctor") and overlapping duties. Card label: `[✎ Story] crew is made up; real astronauts include engineers, doctors and geologists ✓ NASA (F23)` |
| Missions are 7 days | **True for the first landings, too short for a base.** Artemis IV: about 6 days on the surface, crew of 2. Base Camp concept: up to 4 crew for about a month, with a goal of about 2 months. A habitat study plans 2 crew for about 28 days, growing to 4 crew for about 60 days. | Keep 7 days (see §6). "7 weeks" isn't a NASA number. |
| The Sun never sets because the Moon is tidally locked | **No, that's a different fact.** The Sun skims the horizon because the Moon's axis tilts only **1.5°** (Earth tilts 23.5°). Tidal locking means the **same side always faces Earth**, so Earth hangs in nearly the same spot in the Moon's sky. | Use both, as two connected fun facts (see §5). |

Note: NASA's "9 phenomena" page says deep craters reach "minus 334 F". We already use "-414 F, colder than Pluto" from another NASA page (D-014). Both are NASA figures. The game uses "colder than Pluto" so the number doesn't need to match exactly.

---

## 1. Prelude: "Why go?" (4 cards, ~40 s, only before Mission 1, skippable on replay)

| # | Art | Text | Label |
|---|---|---|---|
| P1 | Storybook: footprint, 1969-style lander | "In 1969, astronauts walked on the Moon for the first time. 12 people have walked there, but the longest visit lasted only about 3 days." | ✓ NASA (F01, F02) |
| P2 | Same Moon, a small base with lights on | "Now NASA wants to go back and **stay**: to live and work on the Moon for weeks at a time." | ✓ NASA |
| P3 | Moon in front, small red Mars far behind | "Why? The Moon is our **practice ground**. What we learn there helps us reach **Mars** one day." | ✓ NASA (Moon to Mars) |
| P4 | Astronaut looking back at a tiny Earth | "The Moon is about **3 days away** by rocket. If you run low on air or power, no one can pop over with more. So you plan carefully, because **every choice costs something.** That's why astronauts train first. Welcome to training, Junior Astronaut!" | ✓ NASA (3 days, Apollo) + ✎ |

Why: it answers the question kids actually ask ("didn't we already go?") and makes the stakes concrete (*stay*, not *visit*). P4 carries the old card 1 lesson.

## 2. Mission 1 briefing (5 cards, ~60 s)

| # | Art | Text | Label |
|---|---|---|---|
| M1 | Real orbiter photo, base circled | "Mission 1: a real ridge near the Moon's **south pole**, on the rim of a giant crater called Shackleton." | ✓ NASA |
| M2 | Sun circling low around the horizon (animated) | "Here the Sun never rises high or sets. It **slides around the edge of the sky**. That means almost-endless **sunlight = power**." `[? Why?]` chip opens the tilt fact | ✓ NASA |
| M3 | Black crater below a lit rim | "Some craters here **never** see the Sun. They're colder than Pluto, and may hide **ice**. Ice could become water to drink, air to breathe, even rocket fuel." | ✓ NASA (Lunar Flashlight, lander refuelling pages) |
| M4 | Three crew portraits | "Your crew are all astronauts. They trained in **engineering, medicine, and rocks**. Everyone helps with different jobs. Their plans use the same power and time. **You make the call, Commander.**" | ✎ Story (+ real-backgrounds note, F23); profiles explain "geologist = rock scientist" |
| M5 | Base at sunrise, 7 day-dots | "Your mission: **7 weeks** as the first crew in the new base. Keep everyone safe and finish 4 tasks. Ready, Commander?" (D-028) | ✎ Story |

The storm card is dropped on purpose. The day 2 flare lands as a surprise, and Base Bot's tour shows the shelter.
Verified 2026-11-15: ice → water, oxygen and rocket fuel (NASA). Amounts are still uncertain, which the game already says. Mars teaser verified (§4).

---

## 3. Bridge into gameplay

### 3a. Hand-off (story art → 3D)
1. "Ready" → the storybook art fades into the same-palette 3D (D-023). The camera flies down to the base.
2. **Show, don't just tell:** a 5-second time-lapse plays as the Sun slides sideways around the horizon and the long shadows swing. Base Bot: "See? It never sets. **That's** why we built here." This is the core lesson, shown as proof.
3. Base Bot's 6-step tour (`ui-screens-v1.md` v6.1). It ends with the first real move: "Tap the habitat, add *Tune the air system*, then press End day."

### 3b. How the story keeps running (3 small pieces a day, about 50 words max)
1. **Morning brief:** one story line, scripted to the timeline.
2. **Crew ask:** one crew member asks for something that maps to a real job (Geologist → crater, Doctor → shelter, Engineer → panels or power-saving). Saying no is fine. They react, they don't punish.
3. **Evening line:** one crew reaction to what you did, plus at most one **"Did you know?"** fact tied to what just happened.

### 3c. Day-by-day beats (7-day week). **Superseded by `timeline-7-weeks-v1.md` (D-028)**

| Day | What happens (engine) | Story beat | Crew ask | "Did you know?" |
|---|---|---|---|---|
| 1 | Arrival, maybe a short eclipse | "First day. Let's get the base humming." | Geologist: "I want to see the crater!" Engineer: "Base first." | Shadows here are 25-50x longer than the thing casting them |
| 2 | Real flare alert (May 8 2024) `ARCHIVE` | Mission Control: "The Sun just flared. Particles may follow." | Doctor: "Let's ready the shelter." | The Moon has no air or magnetic shield to block radiation (from D-010; re-check wording before use) |
| 3 | Storm building (May 9) `ARCHIVE` | Base Bot shows real dose rising: "This really happened in May 2024." | Geologist: "One quick crater trip?" (the tempting no) | — |
| 4 | Strong storm (May 10) `ARCHIVE` | Quiet day in the shelter. The crew talks about home and looks at Earth. | Doctor: "Everyone inside. Good call." | Dose in lunar orbit jumped ~600x in hours |
| 5 | Long shadow starts; Earth sets | Mission Control: "Earth is sinking below your horizon. We'll lose you for 3 days. You're in charge now." | Engineer: "Batteries only. Let's be careful." | **Why Earth disappears** (tidal locking chain, §5) |
| 6 | Dark; no Earth; 50% surprise storm | **Climax.** No warning from Earth. "Our own alarm is beeping. Your call, Commander." | Doctor: "Shelter, or finish outside?" | — |
| 7 | Sun returns; Earth still down | Last day. One last push, or play it safe. | Geologist: "Last chance for the crater!" | The crater rim can reach 130 F while the floor is colder than Pluto |

Days 2-4 teach **with help** (Mission Control warns you). Days 5-7 test **without help** (Earth goes quiet). The story arc and the learning arc are the same arc.

### 3d. More emphasis, so kids understand
- **One bold keyword per card.** The same 3 words recur everywhere: **sunlight = power**, **shelter**, **every choice costs**.
- **The lesson repeats 3 times** in different forms: told in M2, felt on day 5 when the light goes, named in the ending.
- **Cause → effect replay:** at End day, the meter that moved most is circled with one line, e.g. "Power dropped because the rover left the sunlight."
- **Predict first** (once, on day 2): "What do you think happens if the crew stays outside?" Then show what happened. Kids remember answers they guessed.

---

## 4. Ending story (after day 7)

| # | Text | Built from |
|---|---|---|
| E1 | Earth rises over the horizon. Mission Control: "Commander, we hear you! Tell us everything." | Fixed. Your ending is your report home. |
| E2 | "Here's your story:" then 2-3 lines about the player's own key moments | Engine log |
| E3 | Each crew member says one line about their part | Final meters |
| E4 | Result stamp: MISSION COMPLETE / HONORS / GOLD PATCH / NOT YET | Report card |
| E5 | Lesson: "Sunlight is power. Where you work decides your power, cold, and radiation risk." Then a real-world link: "Real crews will face these same choices. Maybe one of them will be you." Then the Mars teaser. | Fixed |

**E2 templates:**
- "You moved your crew into the shelter during a **real** solar storm from May 2024." `✓ NASA data`
- "You mapped the crater with the drone before driving in. Smart and safe."
- "You kept the power on through 2 days of darkness."
- "When Earth went quiet and the alarm went off, you made the call yourself."
- "You found signs of ice in a crater colder than Pluto."

**E3 crew lines (honest, never mean):** Doctor: "Lowest dose I've seen!" / "Next time, let's hide sooner." Engineer: "Not one blackout!" / "Charge up before the shadow." Geologist: "Look at this sample!" / "Next time, let's make it to the crater."

**Tiers:**
- GOLD / HONORS: "That's real astronaut thinking."
- COMPLETE: "Crew safe, tasks done."
- NOT YET: "Real missions come back with 'not yet' too." + a tip + one thing done well.
- **Crew called home:** no one is ever hurt. "Mission Control brought everyone home safely. That's how astronauts learn." + a tip tied to the cause.

**Mars teaser (verified 2026-11-15):** "Mission 2: Mars. Mars is farther from the Sun, so sunlight is less than half as strong. Dust storms can bury solar panels, and messages from Earth take up to 20 minutes." Sources: F50-F52 in `fact-sources.md`.

---

## 5. Fun facts + "Ask Base Bot"

### Kid questions (curated, never AI-written; answers ≤30 words + source)
An **"Ask Base Bot"** button shows 3 question chips that fit the current screen. These are the questions kids are already thinking.

| Question chip | Answer (draft) | Source |
|---|---|---|
| Why doesn't the Sun set here? | The Moon barely tilts, only 1.5° (Earth tilts 23.5°). At the pole, the Sun just slides around the edge of the sky. | ✓ NASA |
| Why does the Moon always show us the same face? | It's **tidally locked**: it spins exactly once each time it circles Earth. | ✓ NASA |
| How long is one day on the Moon? | From sunrise to sunrise, about **29.5 Earth days**. A whole month! | ✓ NASA SVS |
| Why does Earth disappear sometimes? | The Moon always faces us, so Earth hangs almost still in its sky. But the Moon wobbles a little, so Earth bobs up and down. At the pole Earth sits on the horizon, so it dips out of sight about half of each month. | ✓ NASA/JPL (libration up to ~6.9°, contact about half of each month) |
| Why is the sky black in the daytime? | The Moon has almost no air to scatter blue light. | ✓ NASA |
| Can I jump really high? | Moon gravity is about 6 times weaker, so you'd weigh about 1/6 as much as on Earth. | ✓ NASA |
| Why is the horizon so close? | The Moon is small, so the horizon is only ~1.5 miles away (3 on Earth). | ✓ NASA |
| What does Earth look like from here? | It has phases too! When we see a new Moon, the Moon sees a **full Earth**. | ✓ NASA |
| Why is Moon dust bad? | It's sharp like tiny glass bits, thinner than a hair, and sticks to everything. | ✓ NASA |
| Is the Moon moving away? | Yes, about 4 cm a year. | ✓ NASA |
| Was there a scientist on the Moon? | Harrison Schmitt, a geologist, walked there in 1972. He was the 12th and last person so far. | ✓ NASA |

**The tidal-locking chain is the best "wow" in the set:**
> The Moon always faces Earth → Earth hangs still in the Moon's sky → at the pole it sits on the horizon → so it dips out of sight for part of each month → **that's why you lose contact on day 5.**

The fun fact *is* the gameplay event, so kids learn it by living it.

Rules: facts are never AI-generated. At most 1 "Did you know?" a day. Questions are always optional.

---

## 6. Mission length. **Superseded: 7 weeks decided (D-028)**
**Keep 7 days for Mission 1.** Add a longer mode later as the realistic "base" stay.
- 7 days is honest: the first Artemis landings plan about 6 days on the surface. One storm (2-3 days) plus one shadow fits inside it, and ~15 min suits ages 7-12.
- The mismatch: real early landings send **2** to the surface. Crews of **4** belong to the later Base Camp stays of about a month. Fix in the copy: "a training mission" (fiction, labelled) rather than a claim about a real mission.
- **Replace "Harder: 14 days" with "Long stay: 28 days"** (a NASA habitat-study number). It's more realistic: Earth can be gone for up to ~2 weeks, and it fits classrooms and older siblings. Cost: about 30 turns (~45 min), plus the engine timeline and balance need a new pass.
- Not "7 weeks": that's no NASA plan, and too long to play.

## 7. Making each run different (options)

| Option | What changes each run | Teaches? | Effort | Risk |
|---|---|---|---|---|
| **A. Real storm deck** | One of 7 real storms (2012-2024) each run, incl. a false alarm and a sneaky storm. **Checked, see `real-events-deck.md`** | Yes, real data | Medium (bundle 7 snapshots) | Must scale the dose; sim per storm |
| **B. Event deck** | 15-20 small events: dust on panels, a stuck rover wheel, a seal leak, a sore crew member, a surprise find. Each is a choice with a cost. AI rewords them (D-004), the engine sets the numbers. | Some | Low-medium | Can feel random; cap at 1 a day |
| **C. Pick your base spot** | Start by choosing a spot: sunnier but far from the crater, or closer but darker | **Yes, the core lesson** | Medium-high (needs terrain per spot) | More 3D work |
| **D. Mission Control orders** | One extra order per run ("test the drone by day 4") | Light | Low | Adds reading |
| **E. Crew moods** | The crew's personalities change how often and what they ask | No | Low | Cosmetic |

**Recommendation: A + B for the prototype, C as the first post-hackathon add.**
- A keeps variety tied to real NASA data (the judges' lens).
- B is cheap and makes every day feel alive.
- C is the best idea for teaching but costs the most.

---

## Trade-offs and risks
- **Length:** prelude + briefing is about 9 cards (~100 s). Prelude only plays before Mission 1 and can be skipped on replay. Voice-over would help younger readers (stretch).
- **Crew asks could feel like nagging:** offers only, no penalty for "no".
- **Personalized ending and event deck need engine work:** key-moment flags, and an event table in `scenarios.json`.
- **Day 4 can be dull:** the home/Earth-gazing beat plus inside jobs fill it.
- **Depends on the proposed Junior Astronaut objective.**
- **Fact checks done 2026-11-15:** libration ✓, Mars teaser ✓, ice → fuel ✓, Moon 3 days away ✓. The spacesuit line is dropped (not verified). Not sourced (don't use): the red glow on Earth's edge during a lunar eclipse. F21 and F50 confirmed 2026-11-15 (F50 reworded as a worked-out fact).

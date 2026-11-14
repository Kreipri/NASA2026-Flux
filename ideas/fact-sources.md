# Fact Sources Registry v1 (2026-11-15)

**Rule (D-008 / D-009):** every fact shown in the game carries a badge. Tapping the badge opens a "Where is this from?" card: source name, what it says, link, date checked. This file is that list. Later it becomes `src/content/facts.json`. **A fact without a row here doesn't ship.**

Status: ✓ = read on the source page (or in its search summary from a nasa.gov page) · ⚠ = source found, exact quote still to confirm · ✗ = not sourced, don't use.
Badge: `NASA fact` / `NASA data · ARCHIVE` / `Worked out` (our arithmetic from NASA data).

Used in: P = prelude card, M = mission briefing card, Q = Ask Base Bot, D = "Did you know?", E = ending, EV = real event (`storyline-v1.md`, `real-events-deck.md`).

## Moon and the south pole
| ID | Kid wording | Source | Badge | Used in | Status |
|---|---|---|---|---|---|
| F01 | 12 people have walked on the Moon. The last was in 1972. | NASA, Former Astronaut Harrison Schmitt: nasa.gov/former-astronaut-harrison-schmitt/ ; NASA GRC Moon: www1.grc.nasa.gov/beginners-guide-to-aeronautics/moon/ | NASA fact | P1, Q | ✓ |
| F02 | The longest Apollo visit lasted about 3 days (75 hours). | NASA, Apollo 17 Mission Details: nasa.gov/missions/apollo/apollo-17-mission-details/ | NASA fact | P1 | ✓ |
| F03 | NASA plans a base near the south pole to learn to live and work there. | NASA, Moon Base: nasa.gov/moonbase/ ; Artemis Base Camp concept (2020): nasa.gov/blogs/missions/2020/10/28/lunar-living-nasas-artemis-base-camp-concept/ | NASA fact | P2 | ✓ |
| F04 | The Moon is the best place to test for trips to Mars. | NASA, Moon Base: nasa.gov/moonbase/ ("the best place for us to test our deep space systems … before crewed trips to Mars") | NASA fact | P3 | ✓ |
| F05 | The Moon is about 3 days away by rocket (Apollo). | NASA Science, Journey to the Moon: science.nasa.gov/resource/journey-to-the-moon/ | NASA fact | P4 | ✓ |
| F06 | Shackleton Crater is 21 km (13 mi) wide and 4 km deep. The south pole sits on its rim. | nasa.gov/mission/promise/ ; science.nasa.gov/resource/illumination-map-of-the-moons-south-pole/ | NASA fact | M1, D | ✓ (D-014) |
| F07 | The Moon tilts only 1.5° (Earth 23.5°), so at the pole the Sun slides along the horizon. | NASA, The Lunar South Pole Region: nasa.gov/reference/moonbase-environment/ ; science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/ | NASA fact | M2, Q | ✓ |
| F08 | Shadows here are 25-50x longer than the thing casting them. | NASA Science, 9 Phenomena at the Moon's South Pole: science.nasa.gov/solar-system/moon/phenomena-nasa-astronauts-will-encounter-at-moons-south-pole/ | NASA fact | D day 1 | ✓ |
| F09 | Some craters never see sunlight, some not for up to 2 billion years. They can be as cold as -414 °F, colder than Pluto. | NASA SVS 11230: svs.gsfc.nasa.gov/11230 | NASA fact | M3, D | ✓ (D-014) |
| F10 | Crater rims in sunlight can reach 130 °F. | 9 Phenomena page (F08) | NASA fact | D day 7 | ✓ |
| F11 | Ice could become drinking water, breathable air, even rocket fuel. | NASA, Lunar Flashlight: nasa.gov/centers-and-facilities/goddard/nasas-lunar-flashlight-ready-to-search-for-the-moons-water-ice/ ; Ice to Fuel: nasa.gov/general/nasa-tests-lander-refueling-tech/ | NASA fact | M3 | ✓ |
| F12 | Ice here is a few percent and patchy. Nobody knows exactly how much. | See `research-setting-facts.md` (LCROSS, D-014) | NASA fact | M3, ice events | ✓ (D-014) |
| F13 | The daytime sky is black (almost no air to scatter light). | 9 Phenomena page (F08) | NASA fact | Q | ✓ |
| F14 | The horizon is only ~1.5 miles away (3 on Earth). | 9 Phenomena page (F08) | NASA fact | Q | ✓ |
| F15 | Moon gravity is about 6x weaker, so you weigh about 1/6 as much. | 9 Phenomena page (F08) | NASA fact | Q | ✓ |
| F16 | Moon dust is sharp, sticky, and thinner than a hair (~25 microns). | 9 Phenomena page (F08) | NASA fact | Q, dust event | ✓ |
| F17 | From the Moon, Earth has phases. When we see a new Moon, the Moon sees a full Earth. | 9 Phenomena page (F08) | NASA fact | Q | ✓ |
| F18 | The Moon is tidally locked: the same side always faces Earth. | NASA Science, Tidal Locking: science.nasa.gov/moon/tidal-locking/ | NASA fact | Q, D day 5 | ✓ |
| F19 | One Moon day (sunrise to sunrise) is about 29.5 Earth days. | NASA SVS 12739: svs.gsfc.nasa.gov/12739/ | NASA fact | Q | ✓ |
| F20 | Earth bobs up and down in the Moon's sky (libration), so a polar base can talk to Earth directly only about half of each month. | JPL IPN Progress Report 42-176C: ipnpr.jpl.nasa.gov/progress_report/42-176/176C.pdf | NASA fact | Q, D day 5, EV | ✓ |
| F21 | The Moon drifts about 4 cm (1.5 inches) a year away from Earth. | Tidal Locking page (F18): "about an inch-and-a-half (4 cm) per year" | NASA fact | Q | ✓ (2026-11-15) |
| F22 | Schmitt, a geologist, was the first scientist on the Moon (Apollo 17, 1972). | Schmitt page (F01) | NASA fact | Q, M4 note | ✓ |
| F23 | Real astronauts include engineers, doctors and geologists. | [NASA, Become an Astronaut](https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/); [physician-astronaut Anil Menon](https://www.nasa.gov/people/nasa-astronaut-anil-menon/); [geologist Harrison Schmitt](https://www.nasa.gov/former-astronaut-harrison-schmitt/) | NASA fact | M4 note | ✓ rechecked 2026-11-15. Backgrounds, not a required trio of crew positions; common training and mission duties overlap. Schmitt's flight assignment was lunar module pilot. |
| F24 | About 3 m (10 ft) of moon soil can shield a shelter from radiation. | NTRS 20130009378 | NASA fact | tour step 4 | ✓ (D-014) |
| F25 | The Space Station recycles 98% of its water. | nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/ | NASA fact | D | ✓ (D-014) |
| F26 | (Context only, not the game's framing) The first Moon landings of this era plan about a week on the surface. | NASA, Artemis IV page: nasa.gov/general/nasas-artemis-iv-building-first-lunar-space-station/ ("about six days", 2 crew on surface) | NASA fact | M5 note, Q | ⚠ page predates the 2026 plan change (Gateway paused). Say "about a week" and re-check before shipping |
| F27 | NASA's base concept: crews of up to 4, staying about a month, later about 2 months. | Artemis Base Camp concept (2020): nasa.gov/blogs/missions/2020/10/28/lunar-living-nasas-artemis-base-camp-concept/ ; NTRS 20220000524 (2 crew ~28 days → 4 crew ~60 days) | NASA fact | Q, Long-stay mode | ✓ as a concept. The current Moon Base page (updated Nov 12 2026) gives no stay length or crew size |

| F28 | The Moon is outside Earth's magnetic field, so it's a good place to study deep-space radiation. | NASA HRP, Step 3, Artemis: Moon Missions as an Astronaut Testbed for Mars: nasa.gov/humans-in-space/step-3-artemis-moon-missions-as-an-astronaut-testbed-for-mars/ | NASA fact | Radiation task, Q | ⚠ from the nasa.gov search summary; read the page before shipping |

| F29 | Ice may hold clues to how the Moon and solar system formed. Finding where it is, and how much, tells us if future crews could use it. | NASA Moon Base science: nasa.gov/moonbase-science/ ; NASA Science, Moon water and ices: science.nasa.gov/moon/moon-water-and-ices/ ; NASA ISRU overview: nasa.gov/overview-in-situ-resource-utilization/ ; Artemis objective "character and origin of lunar polar volatiles": nasa.gov/news-release/nasa-selects-first-lunar-instruments-for-artemis-astronaut-deployment/ | NASA fact | M3, Ice task | ✓ (ice-science-check.md + 2026-11-15 search) |
| F60 | Space Station crews exercise about 2.5 hours a day to keep bones and muscles strong. | nasa.gov/missions/station/faq-the-real-story-about-astronaut-health-care-in-space/ | NASA fact | stamina, Q | ✓ (D-019) |
| F61 | A Space Station day: work ~06:00-21:30, science, repairs, calls with Mission Control, ~8 h sleep, lighter weekends. | NASA fact sheet, Living and Working in Space: nasa.gov/wp-content/uploads/2015/05/167746main_fs_livingandworkinginspace508c.pdf | NASA fact | Q, week planner | ✓ (older sheet, 2015 upload) |
| F62 | On the Moon, astronauts plan to collect samples, set up science instruments, study the site, and test growing plants. | NASA, first lunar instruments for Artemis astronaut deployment (link in F29) ; science.nasa.gov/missions/artemis/nasa-names-scientists-to-support-lunar-south-pole-science/ | NASA fact | job list, Q | ⚠ from search summaries; read the pages before shipping |

| F63 | Moon rocks can be over 4 billion years old. The Moon's first crust formed about 4.4 billion years ago. | NASA Science, Genesis Rock (~4 billion yr): science.nasa.gov/solar-system/moon/genesis-rock/ ; NASA lunar sample curation (crust 4.4 billion yr): curator.jsc.nasa.gov/lunar/index.cfm | NASA fact | M4 (Mica), Q | ✓ (2026-11-15) |
| F64 | The dinosaurs died out about 65 million years ago, after a giant asteroid hit Earth. So Moon rocks are much older than the dinosaurs. | NASA Science, "Deep Impact and the Mass Extinction of Species 65 Million Years Ago": science.nasa.gov/earth/deep-impact-and-the-mass-extinction-of-species-65-million-years-ago/ ; comparison with F63 = our arithmetic | NASA fact + Worked out | M4 (Mica) | ✓ (sources say 65-66 million; use "about 65 million") |
| F65 | At the south pole the Sun is low, so NASA is developing tall, vertical solar panels on masts up to ~10 m (32 ft) high. | NASA, "Three Companies to Help NASA Advance Solar Array Technology for Moon": nasa.gov/news-release/three-companies-to-help-nasa-advance-solar-array-technology-for-moon/ ; NTRS 20220013210 (VSAT project) | NASA fact | tour (Bram), Q | ✓ (2026-11-15). Don't claim they "turn to follow the Sun" (not sourced) |
| F66 | Apollo astronauts brought back 2,196 samples. Scientists are still studying them 50 years later; one sealed tube was opened in 2022. | NASA Science, ANGSA: science.nasa.gov/lunar-science/programs/angsa/ ; nasa.gov/general/fifty-years-later-curators-unveil-one-of-last-sealed-apollo-samples/ | NASA fact | E3 (Mica), Q | ✓ (2026-11-15) |
| F67 | In a radiation storm, NASA's advice is to go to the most shielded place and delay or end spacewalks. | NASA SRAG, How we protect astronauts: srag.jsc.nasa.gov/SpaceRadiation/How/How.cfm | NASA fact | storm alerts, tips | ✓ (fetched, see research-setting-facts.md) |
| F68 | Moon dust on solar panels lowers the power they make. NASA is testing ways to clean it off. | NASA tech, Dust-Repelling Coating (KSC-TOPS-105): technology.nasa.gov/patent/KSC-TOPS-105 ; nasa.gov/centers-and-facilities/kennedy/nasa-technology-helps-guard-against-lunar-dust/ | NASA fact | week 1 dust alert, clean job | ✓ (2026-11-15) |

## Radiation and real events
| ID | Kid wording | Source | Badge | Used in | Status |
|---|---|---|---|---|---|
| F30 | In May 2024, radiation around the Moon jumped about 600x in hours. | RadLab CRaTER (LRO) archive, `data/samples/` ; ratio is ours | NASA data · ARCHIVE + Worked out | D day 4, E2 | ✓ |
| F31-F37 | One line per deck storm (Mar 2012 … Feb 2024 false alarm) | DONKI (flare/SEP/Kp links per event) + RadLab CRaTER, see `real-events-deck.md` | NASA data · ARCHIVE | storm days | ✓ data; kid lines to write |
| F38 | A big flare doesn't always send radiation our way (Feb 2024: X6.3 flare, no particle event). | DONKI FLR/SEP Feb 20-27 2024 + flat CRaTER | NASA data · ARCHIVE | false-alarm storm | ✓ |
| F39 | During a lunar eclipse, Earth blocks the sunlight reaching the Moon. Mar 3 2026: total for ~58 min. | NASA eclipse tables: eclipse.gsfc.nasa.gov/OH/OH2026.html ; NASA Space Place: spaceplace.nasa.gov/eclipses/en/ | NASA fact | eclipse event | ✓ |
| F40 | From the Moon, Earth's edge glows red during a lunar eclipse. | — | — | — | ✗ not sourced, don't use |
| F41 | Moonquakes up to magnitude ~5.5; some lasted up to 10 min (Apollo seismometers). | NASA Science, Moonquakes: science.nasa.gov/moon/moonquakes/ | NASA fact | quake event | ✓ (sources differ: "up to 10 min" vs ">10 min"; use "up to 10") |
| F42 | The Moon is slowly shrinking, which causes quakes near the south pole. | nasa.gov/solar-system/moon/shrinking-moon-causing-moonquakes-and-faults-near-lunar-south-pole/ | NASA fact | quake event | ✓ |
| F43 | NASA has seen 400+ flashes from space rocks hitting the Moon since 2005. | NASA Lunar Impact Monitoring: nasa.gov/meteoroid-environment-office/lunar-impact-monitoring/ | NASA fact | impact event | ✓ (count from an NTRS report; page count may differ) |

## Mars (ending teaser)
| ID | Kid wording | Source | Badge | Used in | Status |
|---|---|---|---|---|---|
| F50 | Mars is 1.5 times farther from the Sun than Earth, so its sunlight is less than half as strong. Mars solar panels must be bigger. | NASA Science, Mars Facts (1.5 AU): science.nasa.gov/mars/facts/ ; JPL InSight, "weaker sunlight … much farther away from the Sun": jpl.nasa.gov/news/news.php?feature=7294 ; "less than half" = our arithmetic (1 ÷ 1.5² ≈ 0.44) | NASA fact + Worked out | E5 | ✓ (2026-11-15). The "45 percent" quote in the ACR PDF couldn't be read, so it isn't used |
| F51 | Messages between Mars and Earth take up to 20 minutes one way. | NASA HRP, Hazard: Distance From Earth: nasa.gov/hrp/hazard-distance-from-earth/ | NASA fact | E5 | ✓ |
| F52 | A Mars dust storm in 2018 covered the Opportunity rover's solar panels, and its mission ended. | JPL: jpl.nasa.gov/edu/resources/teachable-moment/mars-rover-mission-comes-to-an-end-but-science-legacy-live-on/ | NASA fact | E5 | ✓ |

## Base, Mission Control and helpers
| ID | Kid wording | Source | Badge | Used in | Status |
|---|---|---|---|---|---|
| F69 | The base habitat stays on the Moon after a crew leaves, so later crews can live there. | NASA, "NASA's Plan for Sustained Lunar Exploration and Development" (2020), p.12: "The LTV, habitable mobility platform and foundation surface habitat will stay on the Moon enabling crews to live on the lunar surface for months at a time." nasa.gov/wp-content/uploads/2020/08/a_sustained_lunar_presence_nspc_report4220final.pdf | NASA fact | ending 5e | ✓ (read 2026-11-15). Crew overlap at handover NOT sourced for this design: don't show both crews together |
| F70 | Mission Control is staffed day and night. Its flight controllers watch the station all the time, and the capcom is the person who talks with the astronauts. | NASA, JSC Mission Control Center: nasa.gov/johnson/jsc-mission-control-center/ ("staffed 24/7 with flight controllers who constantly monitor…"; "the capcom is the person talking with the astronauts") | NASA fact | voice rules, glossary, Ask Curio | ✓ (2026-11-15). Not "the only voice": other controllers talk to crews too |
| F71 | Mission Control plans the astronauts' daily schedules. | NASA podcast, "Mission Control: Schedule and Inventory": nasa.gov/podcasts/houston-we-have-a-podcast/mission-control-schedule-and-inventory/ ("how they create astronauts' daily schedules") | NASA fact | weekly brief, glossary | ✓ (2026-11-15). A daily planning call exists but wasn't verified word-for-word: don't quote times |
| F72 | NASA plans base rovers and equipment that can run on their own and work with robot helpers. | Same 2020 report as F69, p.12: "designed to operate autonomously and to work with independent robotic assistants" | NASA fact | Curio's role, ending 5e | ✓ (read 2026-11-15) |
| F73 | A real talking AI helper, CIMON, was tested with an astronaut on the space station in 2018. | DLR (German Aerospace Center), "World premiere: CIMON and Alexander Gerst": dlr.de/en/latest/news/2018/4/20181116_cimon-alexander-gerst-iss ; CIMON project: dlr.de/en/research-and-transfer/projects-and-missions/horizons/cimon | Space agency fact (DLR, not NASA) | Ask Curio "Are you real?" | ✓ (search result + page title, 2026-11-15) |
| F74 | Word meanings: crater = big bowl-shaped dent in the ground; solar flare = burst of energy from the Sun; radiation storm = the Sun sends out lots of particles at once; too much space radiation is bad for the body. | NASA Space Place glossary: spaceplace.nasa.gov/glossary/en/ ; NASA, Why Space Radiation Matters: nasa.gov/missions/analog-field-testing/why-space-radiation-matters/ ; NASA LWS, What is space radiation: lws-set.gsfc.nasa.gov/space_radiation.html ("particles shot into space during solar flares (solar particle events)") | NASA fact | tappable words | ✓ (search results, 2026-11-15) |

## Not facts (no source card; labelled differently)
- Plain word meanings (ridge, engineer, sample) → `📖 word`, no source card
- Crew, Base Bot, dialogue, "training mission" framing → `[✎ Story]`
- Meter numbers, job costs, event odds → `[~ Game number]`
- Moonquake and impact *events in a run* → `[~ Game event]`, with the matching fact (F41-F43) as the "why" card
- AI-written lines → `[AI-written story]`, never a fact badge (D-008)

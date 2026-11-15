// Deterministic rules engine (D-004), v2: one turn = one day, crew time in blocks (D-019).
// No DOM, no network. Same seed + same choices = same run.
import moon from '../config/moon.json' with { type: 'json' };
import scenarios from '../config/scenarios.json' with { type: 'json' };
import storm from '../data/storm-2024-05.json' with { type: 'json' };

export type ActionId =
  | 'logsun' | 'measure' | 'scout' | 'rover' | 'regolith' | 'clean' | 'air'
  | 'repair' | 'powersave' | 'shelter' | 'rest' | 'call';
export type ScenarioId = 'weeks7' | 'solarMax' | 'week' | 'slice' | 'full';
export type StormLevel = 'none' | 'warning' | 'rising' | 'strong';
export type TripChoice = 'back' | 'finish';
export type AlertChoice = 'shelter' | 'continue' | 'save' | 'carry' | 'clean' | 'later' | 'sample';
export type StepChoice = TripChoice | AlertChoice;
export type Goal = 'LIGHT' | 'RADIATION' | 'SHELTER' | 'ICE';

export interface ActionDef {
  id: ActionId; group: 'goal' | 'alive' | 'safe'; goal?: Goal; label: string; blocks: number;
  power: number; o2: number; dose: number; outside: boolean; repeatable?: boolean; stamina?: number;
  needsLink?: boolean; needsPower?: boolean; emergencyOk?: boolean;
}

export interface Env {
  sun: 'full' | 'half' | 'dark';
  eclipse: 'none' | 'short' | 'long';
  storm: StormLevel;
  stormSource: 'archive' | 'sim' | null;
  stormOnset: boolean;
  realDay: string | null;   // archive date this day replays (RadLab/DONKI)
  stormName?: string;
  stormScale?: number;
  alert?: 'dust' | 'storm' | 'shadow' | 'eclipse' | 'sample' | null;
  link: boolean;
}

export interface Evidence {
  sunLogs: number; eclipseLogged: boolean; longShadowLogged: boolean; measures: number; stormMeasures: number;
  trips: number; scouts: number; iceFound: number; mappedEmpty: number;
  shelteredStormDays: number; outsideStormBlocks: number; powerHitZero: boolean;
}

export interface State {
  scenario: ScenarioId; seed: number; rng: number; turn: number;
  power: number; o2: number; dose: number; stamina: number;
  dust: number; shelterLevel: number; iceSamples: number; scoutBonus: number;
  faults: { panel: boolean; scrubber: boolean };
  emergency: boolean;
  evidence: Evidence;
  keyMoments: string[];
  timeline: Env[];
  pending: null | { type: 'tripChoice'; actions: ActionId[] } | { type: 'alertChoice'; actions: ActionId[]; alert: NonNullable<Env['alert']> };
  ended: null | { reason: 'complete' | 'oxygen' | 'dose' };
  history: { turn: number; actions: ActionId[]; choice?: StepChoice }[];
}

export const ACTIONS = moon.actions as ActionDef[];
export const actionDef = (id: ActionId) => ACTIONS.find((a) => a.id === id)!;
const SC = scenarios as Record<ScenarioId, any>;
export const scenarioOf = (s: State) => SC[s.scenario];
export const totalDays = (s: State): number => scenarioOf(s).days;
export const day = (s: State, turn = s.turn) => turn + 1;
export const turnUnit = (s: State): 'day' | 'week' => scenarioOf(s).turnUnit === 'week' ? 'week' : 'day';

// --- seeded RNG (mulberry32) ---
function next(st: number): [number, number] {
  const t = (st + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, t];
}
function rand(s: State): number { const [v, n] = next(s.rng); s.rng = n; return v; }
function makeRng(seed: number) {
  let st = seed | 0;
  return { int: (lo: number, hi: number) => { const [v, n] = next(st); st = n; return lo + Math.floor(v * (hi - lo + 1)); } };
}

/** Max hourly CRaTER dose rate (uGy/h) for a real calendar day of the May 2024 storm. */
export function realDayRate(date: string): number {
  const rates = storm.crater12h.filter((w) => w.start.startsWith(date)).map((w) => w.maxDoseRate);
  return rates.length ? Math.max(...rates) : 0;
}
export const QUIET_RATE = realDayRate('2024-05-08');
function levelFromRate(rate: number): StormLevel {
  return rate >= moon.storm.strongMinDoseRate ? 'strong' : rate >= moon.storm.risingMinDoseRate ? 'rising' : 'none';
}

function buildTimeline(sc: any, seed: number): Env[] {
  const r = makeRng(seed ^ 0x9e3779b9);
  const n = sc.days;
  const tl: Env[] = Array.from({ length: n }, () => ({
    sun: 'full', eclipse: 'none', storm: 'none', stormSource: null, stormOnset: false, realDay: null, stormName: undefined, stormScale: 1, alert: null, link: true,
  }));
  if (sc.turnUnit === 'week') {
    const up = new Set<number>(sc.earth.upTurns ?? []);
    for (let t = 0; t < n; t++) tl[t].link = up.has(t);
    if (sc.longShadow) {
      const len = r.int(sc.longShadow.length[0], sc.longShadow.length[1]);
      for (let t = sc.longShadow.startTurn; t < Math.min(n, sc.longShadow.startTurn + len); t++) Object.assign(tl[t], { sun: 'dark', eclipse: 'long', alert: 'shadow' });
    }
    for (let i = 0; i < sc.shortEclipses.count; i++) {
      const [a, b] = sc.shortEclipses.turnRanges[i % sc.shortEclipses.turnRanges.length];
      const t = r.int(a, b);
      if (tl[t].eclipse === 'none') Object.assign(tl[t], { sun: 'half', eclipse: 'short', alert: 'eclipse' });
    }
    if (n > 0) tl[0].alert = 'dust';
    if (n > 5) tl[5].alert = 'sample';
    const deck = [
      { name: 'May 2024', realDay: '2024-05-10', level: 'strong' as StormLevel, scale: 1.0 },
      { name: 'September 2017', realDay: null, level: 'strong' as StormLevel, scale: 1.25 },
      { name: 'October 2021', realDay: null, level: 'rising' as StormLevel, scale: 0.75 },
      { name: 'January 2022', realDay: null, level: 'rising' as StormLevel, scale: 0.45 },
      { name: 'May 2012', realDay: null, level: 'strong' as StormLevel, scale: 1.1 },
      { name: 'March 2012', realDay: null, level: 'strong' as StormLevel, scale: 1.5 },
    ];
    for (const slot of sc.stormSlots ?? []) {
      if (slot.chance !== undefined && r.int(0, 999) >= slot.chance * 1000) continue;
      if (slot.kind === 'false-alarm-or-small' && sc.mode === 'solarMax' && r.int(0, 1) === 0) {
        Object.assign(tl[slot.turn], { storm: 'warning', stormSource: 'archive', stormName: 'February 2024 false alarm', alert: 'storm' });
        continue;
      }
      const options = slot.kind === 'small-medium' ? deck.slice(2, 4) : slot.kind === 'sneaky-big' ? deck.slice(4) : deck.slice(0, 4);
      let pick = options[r.int(0, options.length - 1)];
      if (slot.turn === sc.longShadow?.startTurn && pick.name === 'March 2012') pick = deck[0];
      Object.assign(tl[slot.turn], { storm: pick.level, stormSource: 'archive', stormOnset: true, realDay: pick.realDay, stormName: pick.name, stormScale: pick.scale, alert: 'storm' });
    }
    return tl;
  }
  if (sc.longShadow) {
    const len = r.int(sc.longShadow.length[0], sc.longShadow.length[1]);
    for (let t = sc.longShadow.startTurn; t < Math.min(n, sc.longShadow.startTurn + len); t++) Object.assign(tl[t], { sun: 'dark', eclipse: 'long' });
  }
  for (let i = 0; i < sc.shortEclipses.count; i++) {
    const [a, b] = sc.shortEclipses.turnRanges[i % sc.shortEclipses.turnRanges.length];
    const t = r.int(a, b);
    if (tl[t].eclipse === 'none') Object.assign(tl[t], { sun: 'half', eclipse: 'short' });
  }
  const rs = sc.replayStorm;
  if (rs) {
    Object.assign(tl[rs.alertTurn], { storm: 'warning', stormSource: 'archive', realDay: rs.alertDay });
    rs.days.forEach((d: string, i: number) => {
      const lvl = levelFromRate(realDayRate(d));
      Object.assign(tl[rs.alertTurn + 1 + i], { storm: lvl === 'none' ? 'rising' : lvl, stormSource: 'archive', realDay: d, stormOnset: i === 0 });
    });
  }
  if (sc.linkDown) for (let t = sc.linkDown.startTurn; t < Math.min(n, sc.linkDown.startTurn + sc.linkDown.length); t++) tl[t].link = false;
  const ss = sc.simStorm;
  if (ss && r.int(0, 999) < (ss.chance ?? 1) * 1000) {
    const start = r.int(ss.startTurn[0], ss.startTurn[1]);
    const len = r.int(ss.length[0], ss.length[1]);
    if (!ss.noWarning && start - 1 >= 0 && tl[start - 1].storm === 'none') Object.assign(tl[start - 1], { storm: 'warning', stormSource: 'sim' });
    for (let t = start; t < Math.min(n, start + len); t++) Object.assign(tl[t], { storm: ss.level, stormSource: 'sim', stormOnset: t === start });
  }
  return tl;
}

export function newGame(scenario: ScenarioId, seed: number): State {
  return {
    scenario, seed, rng: seed | 0, turn: 0,
    ...moon.start, ...(SC[scenario].start ?? {}),
    dust: 0, shelterLevel: 0, iceSamples: 0, scoutBonus: 0,
    faults: { panel: false, scrubber: false }, emergency: false,
    evidence: { sunLogs: 0, eclipseLogged: false, longShadowLogged: false, measures: 0, stormMeasures: 0, trips: 0, scouts: 0, iceFound: 0, mappedEmpty: 0, shelteredStormDays: 0, outsideStormBlocks: 0, powerHitZero: false },
    keyMoments: [],
    timeline: buildTimeline(SC[scenario], seed),
    pending: null, ended: null, history: [],
  };
}

export const env = (s: State, turn = s.turn): Env => s.timeline[Math.min(turn, s.timeline.length - 1)];
export const stormActive = (e: Env) => e.storm === 'rising' || e.storm === 'strong';

/** Crew time today, from stamina (tired crews get less done). */
export function blocksFor(stamina: number): number {
  return moon.stamina.blocksByStamina.find((b) => stamina >= b.min)!.blocks;
}
export const blocksToday = (s: State) => blocksFor(s.stamina);

export function airPowerCost(s: State): number {
  const d = moon.ice.airDiscountPerSample * Math.min(s.iceSamples, moon.ice.maxDiscountSamples);
  return Math.min(-8, actionDef('air').power + d);
}
export const iceChance = (s: State) => Math.min(moon.ice.maxChance, moon.ice.baseChance + s.scoutBonus);
export const powerCost = (s: State, id: ActionId) => (id === 'air' ? airPowerCost(s) : actionDef(id).power);

/** Days until Earth is back above the horizon (0 = link up today). */
export function daysUntilLink(s: State): number | null {
  for (let t = s.turn; t < s.timeline.length; t++) if (s.timeline[t].link) return t - s.turn;
  return null;
}
/** Days until Earth goes below the horizon (null if not within the mission). */
export function daysUntilLinkLoss(s: State): number | null {
  for (let t = s.turn + 1; t < s.timeline.length; t++) if (!s.timeline[t].link) return t - s.turn;
  return null;
}

/** Days until the sun comes back on the panels (0 = sunny today). */
export function daysUntilSun(s: State): number | null {
  for (let t = s.turn; t < s.timeline.length; t++) if (s.timeline[t].sun !== 'dark') return t - s.turn;
  return null;
}

export function menu(s: State, avail?: number): { def: ActionDef; blocked: string | null }[] {
  const e = env(s), room = avail ?? blocksToday(s);
  return (scenarioOf(s).actions as ActionId[]).map((id) => {
    const def = actionDef(id);
    let blocked: string | null = null;
    if (def.needsLink && !e.link) blocked = 'Earth link down';
    else if (s.emergency && !def.emergencyOk) blocked = 'power emergency';
    else if (def.blocks > room) blocked = avail === undefined ? 'crew too tired' : 'not enough time left';
    else if (id === 'repair' && !s.faults.panel && !s.faults.scrubber) blocked = 'nothing broken';
    else if (id === 'regolith' && s.shelterLevel >= 3) blocked = 'shelter is full';
    return { def, blocked };
  });
}

export function validate(s: State, ids: ActionId[]): string | null {
  if (s.ended) return 'Mission is over.';
  if (!ids.length) return 'Pick at least one job.';
  const counts = new Map<ActionId, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, count] of counts) {
    if (count > 1 && actionDef(id).blocks >= 4 && !actionDef(id).repeatable) return `${actionDef(id).label}: heavy work can only be done once a day.`;
  }
  const m = menu(s);
  for (const id of ids) {
    const item = m.find((x) => x.def.id === id);
    if (!item) return `That job isn't available in this mission.`;
    if (item.blocked) return `${item.def.label}: ${item.blocked}.`;
  }
  const used = ids.reduce((n, id) => n + actionDef(id).blocks, 0);
  if (used > blocksToday(s)) return `Those jobs need ${used} crew time, your crew has ${blocksToday(s)} today.`;
  const powerSaveAt = ids.indexOf('powersave');
  if (powerSaveAt >= 0 && ids.slice(powerSaveAt + 1).some((id) => actionDef(id).needsPower)) return 'Power-saving mode turns off instruments after it starts. Do the drone or radiation meter first.';
  return null;
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/** One week in progress: jobs run one at a time, then `closeWeek` applies sunlight, breathing, rest and hazards. */
export interface Week {
  blocks: number; used: number; ids: ActionId[]; choice: StepChoice | null;
  outside: number; inside: number; sheltered: boolean; powerSave: boolean; emergency0: boolean; log: string[];
}
export const newWeek = (s: State): Week => ({ blocks: blocksToday(s), used: 0, ids: [], choice: null, outside: 0, inside: 0, sheltered: false, powerSave: false, emergency0: s.emergency, log: [] });

/** The decision this week opens with, if any (shadow, storm, dust). The crater "sample" alert waits for the rover job. */
export function weekAlert(s: State): NonNullable<Env['alert']> | null {
  const a = env(s).alert ?? null;
  return a && a !== 'sample' ? a : null;
}

/** Why a job can't be done right now, given the time left in the week (null = go ahead). */
export function jobBlocked(s: State, w: Week, id: ActionId): string | null {
  if (s.ended) return 'Mission is over.';
  const item = menu(s, w.blocks - w.used).find((x) => x.def.id === id);
  if (!item) return `That job isn't available in this mission.`;
  if (item.blocked) return item.blocked;
  if (item.def.blocks >= 4 && !item.def.repeatable && w.ids.includes(id)) return 'heavy work, once a week';
  return null;
}
/** Does starting this job open a decision first? */
export function jobPrompt(s: State, w: Week, id: ActionId): 'sample' | 'trip' | null {
  if (id !== 'rover' || w.choice) return null;
  const e = env(s);
  if (e.alert === 'sample') return 'sample';
  return stormActive(e) && e.stormOnset ? 'trip' : null;
}

function applyChoice(s: State, w: Week, choice: StepChoice, log: string[]) {
  w.choice = choice;
  if (choice === 'shelter') w.sheltered = true;
  if (choice === 'save') w.powerSave = true;
  if (choice === 'clean') { s.dust = 0; log.push('Alert choice: the crew cleaned the panels immediately.'); }
  if (choice === 'later') log.push('Alert choice: the crew postponed the extra work and kept the base steady.');
  if (choice === 'sample') { s.scoutBonus = Math.min(moon.ice.maxChance - moon.ice.baseChance, s.scoutBonus + 0.10); s.power -= 10; s.stamina -= 5; log.push('Alert choice: one more crater sample attempt. Power -10, stamina -5, ice chance improved.'); }
}
export function chooseOption(s0: State, w0: Week, choice: StepChoice): { state: State; week: Week; log: string[] } {
  const s = structuredClone(s0), w = structuredClone(w0), log: string[] = [];
  applyChoice(s, w, choice, log);
  w.log.push(...log);
  return { state: s, week: w, log };
}

function applyJob(s: State, w: Week, id: ActionId, log: string[]) {
  const e = env(s), a = actionDef(id), pd = moon.perDay, st = moon.stamina;
  w.ids.push(id); w.used += a.blocks;
  if (id === 'rover' && w.choice === 'back') {
    s.power += moon.trip.backPower; s.o2 += moon.trip.backO2; w.inside += a.blocks; s.stamina += a.blocks * st.insideBlock;
    log.push(`Rover turned back when the particles arrived. No sample, but the crew is safe inside. (power ${moon.trip.backPower}, oxygen ${moon.trip.backO2})`);
    return;
  }
  s.power += powerCost(s, id);
  s.o2 += a.o2;
  if (!stormActive(e)) s.dose += a.dose;   // on storm days the whole day's dose is worked out when the week closes
  if (a.outside) { w.outside += a.blocks; s.stamina += a.blocks * st.outsideBlock; } else { w.inside += a.blocks; s.stamina += a.blocks * st.insideBlock; }
  if (a.stamina) s.stamina += a.stamina;
  switch (id) {
    case 'logsun': {
      s.evidence.sunLogs++;
      if (e.eclipse !== 'none') s.evidence.eclipseLogged = true;
      if (e.eclipse === 'long') s.evidence.longShadowLogged = true;
      log.push(e.eclipse !== 'none' ? 'Logged the shadow: how long the ridge stays dark. Rare evidence! [LIGHT]' : 'Logged sunlight on the ridge. [LIGHT]');
      break;
    }
    case 'measure': {
      s.evidence.measures++;
      if (stormActive(e)) s.evidence.stormMeasures++;
      log.push(stormActive(e) ? 'Measured radiation DURING the storm. Great evidence! [RADIATION]' : 'Measured radiation on a quiet day. [RADIATION]');
      log.push(...radiationReading(e));
      break;
    }
    case 'scout':
      s.evidence.scouts++;
      s.scoutBonus = Math.min(moon.ice.maxChance - moon.ice.baseChance, s.scoutBonus + moon.ice.scoutBonus);
      log.push(`Hop-drone mapped the dark crater. Ice chance on the next rover trip: ${Math.round(iceChance(s) * 100)}%. [ICE]`);
      break;
    case 'rover': {
      const chance = iceChance(s);
      s.evidence.trips++;
      s.dust = Math.min(pd.maxDust, s.dust + 1);
      if (rand(s) < chance) {
        s.iceSamples++; s.evidence.iceFound++;
        log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): ICE FOUND! Proof that water is hiding near the ridge. Future crews could turn it into drinking water and oxygen (with big machines and lots of power). [ICE]`);
      } else {
        s.evidence.mappedEmpty++;
        log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): this spot is dry. That is still evidence: you mapped where NOT to look. [ICE]`);
      }
      s.scoutBonus = 0;
      break;
    }
    case 'regolith':
      s.shelterLevel++;
      log.push(`Two astronauts ran the digging machine all day: more moon soil on the shelter, level ${s.shelterLevel}/3. Storms hurt less in there now. [SHELTER]`);
      if (s.shelterLevel === 1) {
        log.push('  Real fact: moon soil blocks solar storm particles well. One NASA design uses about 3 m (10 ft) of soil to also stop most cosmic rays. [NASA Tech Briefs 2012]');
        log.push('  [~ SIMULATED] Game shortcut: real shielding means tonnes of soil moved by machines over many days. 3 levels stand for that 3 m.');
      }
      break;
    case 'clean': s.dust = 0; log.push('Two astronauts cleaned dust off the panels and seals. Full sunlight power again.'); break;
    case 'air': log.push(`Air system tuned: it splits water into oxygen using power. Oxygen +${a.o2}.`); break;
    case 'repair':
      if (s.faults.panel) { s.faults.panel = false; log.push('Fixed the jammed solar panel.'); }
      else { s.faults.scrubber = false; log.push('Fixed the clogged air scrubber.'); }
      break;
    case 'powersave': w.powerSave = true; log.push(`Power-saving mode: heaters and instruments turned down. Base uses ${pd.powerSaveUpkeep} power instead of ${pd.upkeepPower}, but the crew gets cold (stamina ${st.powerSaveCold}).`); break;
    case 'shelter': w.sheltered = true; log.push('Whole crew sheltered in the most shielded room during the worst hours.'); break;
    case 'rest': log.push(`Two astronauts took a rest day. Stamina +${a.stamina}.`); break;
    case 'call':
      if (scenarioOf(s).mode === 'solarMax' && s.turn >= 4) {
        s.stamina = clamp(s.stamina + 5);
        s.keyMoments.push('The crew called home during Solar max and checked in safely.');
        log.push('Call home completed: Mission Control checked the crew. Stamina +5.');
      } else log.push(...forecastLines(s));
      break;
  }
}
/** Do one job now. The caller has already checked `jobBlocked` and answered any `jobPrompt`. */
export function runJob(s0: State, w0: Week, id: ActionId): { state: State; week: Week; log: string[] } {
  const s = structuredClone(s0), w = structuredClone(w0), log: string[] = [];
  applyJob(s, w, id, log);
  w.log.push(...log);
  return { state: s, week: w, log };
}

/** End the week: sunlight, life support, breathing, radiation, recovery, dust and faults, then advance the day. */
export function closeWeek(s0: State, w0: Week): { state: State; log: string[] } {
  const s = structuredClone(s0), w = structuredClone(w0), log: string[] = [];
  const e = env(s), pd = moon.perDay, st = moon.stamina;
  s.pending = null;
  if (e.storm === 'warning' && e.stormName?.includes('false alarm')) log.push('False-alarm wrap-up: the flare did not bring a particle storm. [✓ NASA ARCHIVE / game placement]');

  // Power
  if (e.sun !== 'dark') {
    let solar = pd.solar - s.dust * pd.dustSolarPenalty - (s.faults.panel ? pd.panelFaultSolarPenalty : 0);
    if (e.sun === 'half') solar *= pd.shortEclipseSolarFactor;
    solar = Math.max(0, Math.round(solar));
    s.power += solar;
    log.push(`Sunlight charged the batteries +${solar}${e.sun === 'half' ? ' (short eclipse: half a day of sun)' : ''}${s.dust ? ` (dust blocked ${s.dust * pd.dustSolarPenalty})` : ''}.`);
  } else log.push('No sunlight today. The base ran on batteries.');
  const upkeep = w.powerSave || s.emergency ? pd.powerSaveUpkeep : pd.upkeepPower;
  s.power -= upkeep;
  log.push(`Life support, heaters and radios used ${upkeep} power.`);

  // Oxygen
  s.o2 -= s.emergency ? pd.emergencyO2 : pd.breathO2;
  if (s.faults.scrubber) s.o2 -= pd.scrubberFaultO2;

  // Dose (job dose on quiet days was added as each job ran)
  let dose: number;
  if (stormActive(e)) {
    const f = e.storm === 'rising' ? moon.storm.risingFactor : 1;
    const inside = w.sheltered ? moon.storm.shelterByLevel[s.shelterLevel] : moon.storm.habitat;
    const out = w.outside * moon.storm.outsidePerBlock;
    dose = Math.ceil((inside + out) * f);
    if (w.sheltered) {
      s.evidence.shelteredStormDays++;
      s.keyMoments.push(`Sheltered during ${e.stormName ?? e.realDay ?? 'a particle storm'}${e.link ? '' : ' without Earth link'}.`);
    }
    s.evidence.outsideStormBlocks += w.outside;
    log.push(`Particle storm (${e.storm === 'strong' ? 'strong' : 'building'}): ${w.sheltered ? 'crew sheltered for the peak' : 'crew stayed in the habitat, not the shelter'}${w.outside ? `, and astronauts were OUTSIDE` : ''}. Dose +${dose}.`);
  } else {
    dose = pd.baseDose;
  }
  s.dose += dose;

  // Stamina: work tired the crew as each job ran; sleep + daily exercise restore, free time relaxes
  const unused = w.blocks - w.used;
  s.stamina += st.dailyRecovery + unused * st.unusedBlock + (w.powerSave ? st.powerSaveCold : 0) + (w.emergency0 ? st.emergencyCold : 0);
  if (unused > 0) log.push(`Free crew time (${unused}) went to rest and chores. Stamina +${unused * st.unusedBlock}.`);

  // Dust builds up
  if ((s.turn + 1) % pd.dustEveryDays === 0 && s.dust < pd.maxDust) { s.dust++; log.push(`Dust settled on the panels (dust level ${s.dust}/3).`); }

  // Faults
  if (scenarioOf(s).features.faults) {
    const chance = moon.faults.baseChance + (s.dust >= pd.maxDust ? moon.faults.dustyChance : 0);
    if (rand(s) < chance) {
      if (!s.faults.panel && rand(s) < 0.5) { s.faults.panel = true; log.push('FAULT: dust jammed a solar panel joint. Less power until repaired.'); }
      else if (!s.faults.scrubber) { s.faults.scrubber = true; log.push('FAULT: the air scrubber is clogged. Oxygen drains faster until repaired.'); }
    }
  }

  // Clamp + power emergency
  s.o2 = clamp(s.o2); s.dose = Math.min(100, s.dose); s.stamina = clamp(s.stamina);
  if (s.power <= 0) {
    if (!s.emergency) log.push('POWER EMERGENCY: the batteries are empty.');
    s.power = 0; s.emergency = true; s.evidence.powerHitZero = true;
    s.keyMoments.push('Batteries reached zero; the base entered power-saving emergency mode.');
  } else {
    s.power = clamp(s.power);
    if (s.emergency && s.power >= moon.emergencyExitPower) { s.emergency = false; log.push('Power restored! Emergency over.'); }
  }

  s.history.push({ turn: s.turn, actions: w.ids, ...(w.choice ? { choice: w.choice } : {}) });
  s.turn++;
  if (s.o2 <= 0) s.ended = { reason: 'oxygen' };
  else if (s.dose >= 100) s.ended = { reason: 'dose' };
  else if (s.turn >= totalDays(s)) s.ended = { reason: 'complete' };
  return { state: s, log };
}

/**
 * Resolve a whole day from a finished plan (terminal play and bot simulation). Same rules as the browser's
 * job-by-job flow. If a storm starts while the rover is out and no choice was given,
 * returns with pending set and nothing resolved: call again with a TripChoice.
 */
export function step(s0: State, ids: ActionId[], choice?: StepChoice): { state: State; log: string[] } {
  const err = validate(s0, ids);
  if (err) return { state: s0, log: ['! ' + err] };
  const e = env(s0);
  if (e.alert && !choice && (e.alert !== 'sample' || ids.includes('rover'))) {
    return { state: { ...s0, pending: { type: 'alertChoice', actions: ids, alert: e.alert } }, log: [] };
  }
  if (ids.includes('rover') && stormActive(e) && e.stormOnset && !choice) {
    return { state: { ...s0, pending: { type: 'tripChoice', actions: ids } }, log: [] };
  }
  const s: State = structuredClone(s0);
  const w = newWeek(s0), log: string[] = [];
  if (choice) applyChoice(s, w, choice, log);
  for (const id of ids) applyJob(s, w, id, log);
  const closed = closeWeek(s, w);
  return { state: closed.state, log: [...log, ...closed.log] };
}

export function radiationReading(e: Env): string[] {
  if (e.stormSource === 'sim' && stormActive(e)) return ['  Reading: very high. [~ SIMULATED storm, not real data]'];
  const date = e.realDay ?? '2024-05-08';
  const rate = e.realDay ? realDayRate(date) : Math.round(QUIET_RATE * (e.stormScale ?? 1));
  const x = Math.round(rate / QUIET_RATE);
  if (e.stormName && !e.realDay) return [`  Archive event profile: ${e.stormName} (game-scaled from the real storm deck, about ${x}x a quiet week).`, '  [✓ NASA DONKI + RadLab · ARCHIVE] Game-scaled profile; exact hourly snapshot is not shown in this prototype.'];
  return [
    `  Real peak reading for ${date}: ${rate.toLocaleString('en-US')} uGy/h${x > 1 ? ` (about ${x}x a quiet day)` : ' (a quiet day)'}.`,
    '  [✓ NASA RadLab · CRaTER on LRO · ARCHIVE May 2024] Measured in lunar orbit, not on the surface.',
  ];
}

export function forecastLines(s: State): string[] {
  const out: string[] = ['Mission Control: "Here is what our forecasters and radiation team see:"'];
  for (let t = s.turn; t <= Math.min(s.turn + 2, totalDays(s) - 1); t++) {
    const e = env(s, t);
    const when = t === s.turn ? 'Today' : `Day ${day(s, t)}`;
    const what = e.storm === 'none' ? 'calm' : e.storm === 'warning' ? 'flare likely, particles may follow' : `particle storm (${e.storm === 'strong' ? 'strong' : 'building'})`;
    out.push(`  ${when}: ${what}${e.eclipse === 'long' ? ', ridge in shadow' : ''}`);
  }
  return out;
}

/** Final dose (% of plan) at or under this earns the 3rd SHELTER star. */
export const DOSE_STAR = 25;

export interface Check { label: string; done: boolean; main: boolean }

/** Report card checklist: per question, 1 MAIN goal + 2 BONUS goals (D-020). */
export function checklist(s: State): Record<Goal, Check[]> {
  const ev = s.evidence;
  const started = s.turn > 0;
  const c = (label: string, done: boolean, main = false): Check => ({ label, done, main });
  if (s.scenario === 'weeks7' || s.scenario === 'solarMax') {
    return {
      LIGHT: [c(`log sunlight in 2 weeks (${Math.min(ev.sunLogs, 2)}/2)`, ev.sunLogs >= 2, true), c('log through the long shadow', ev.longShadowLogged), c(`log 4+ weeks (${Math.min(ev.sunLogs, 4)}/4)`, ev.sunLogs >= 4)],
      RADIATION: [c('measure during 1 storm', ev.stormMeasures >= 1, true), c('measure during 2 storms', ev.stormMeasures >= 2), c('measure a quiet week', ev.measures > ev.stormMeasures)],
      SHELTER: [c('shelter during a storm', ev.shelteredStormDays >= 1, true), c(`dose under ${DOSE_STAR}%`, s.dose <= DOSE_STAR && started), c('add a regolith layer', s.shelterLevel >= 1)],
      ICE: [c('rover sample', ev.trips >= 1, true), c('drone map before rover', ev.trips >= 1 && ev.scouts >= 1), c('sample 2 craters', ev.trips >= 2)],
    };
  }
  return {
    LIGHT: [c(`log sun 2x (${Math.min(ev.sunLogs, 2)}/2)`, ev.sunLogs >= 2, true), c('log in the dark', ev.eclipseLogged), c(ev.powerHitZero ? 'power ran out' : 'keep power on', !ev.powerHitZero && started)],
    RADIATION: [c('measure once', ev.measures >= 1, true), c('measure in a storm', ev.stormMeasures >= 1), c(`measure 4x (${Math.min(ev.measures, 4)}/4)`, ev.measures >= 4)],
    SHELTER: [c('shelter in a storm', ev.shelteredStormDays >= 1, true), c('pile soil', s.shelterLevel >= 1), c(`dose under ${DOSE_STAR}%`, s.dose <= DOSE_STAR && started)],
    ICE: [c('rover sample', ev.trips >= 1, true), c('drone map + sample', ev.trips >= 1 && ev.scouts >= 1), c('ice or 2nd sample', ev.iceFound >= 1 || ev.trips >= 2)],
  };
}

/** Report card: 4 questions x 3 stars. */
export function reportCard(s: State): Record<Goal, number> {
  const cl = checklist(s);
  const out = {} as Record<Goal, number>;
  for (const g of Object.keys(cl) as Goal[]) out[g] = cl[g].filter((x) => x.done).length;
  return out;
}

export const totalStars = (s: State) => Object.values(reportCard(s)).reduce((a, b) => a + b, 0);

export type Tier = 'not-proven' | 'promising' | 'approved' | 'gold';
/**
 * The overarching objective. MAIN goals (first star of each question) + crew healthy = PROMISING.
 * Bonus goals push it to APPROVED (win.minStars) and GOLD (win.gold).
 */
export function verdict(s: State): { tier: Tier; mainDone: number; missingMain: Goal[]; bonus: number; stars: number } {
  const w = scenarioOf(s).win;
  const cl = checklist(s);
  const missingMain = (Object.keys(cl) as Goal[]).filter((g) => !cl[g][0].done);
  const stars = totalStars(s);
  const healthy = !s.ended || s.ended.reason === 'complete';
  const promising = healthy && missingMain.length === 0;
  const tier: Tier = !promising ? 'not-proven' : stars >= w.gold ? 'gold' : stars >= w.minStars ? 'approved' : 'promising';
  return { tier, mainDone: 4 - missingMain.length, missingMain, bonus: stars - (4 - missingMain.length), stars };
}

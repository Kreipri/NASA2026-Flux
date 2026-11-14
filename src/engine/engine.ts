// Deterministic rules engine (D-004), v2: one turn = one day, crew time in blocks (D-019).
// No DOM, no network. Same seed + same choices = same run.
import moon from '../config/moon.json' with { type: 'json' };
import scenarios from '../config/scenarios.json' with { type: 'json' };
import storm from '../data/storm-2024-05.json' with { type: 'json' };

export type ActionId =
  | 'logsun' | 'measure' | 'scout' | 'rover' | 'regolith' | 'clean' | 'air'
  | 'repair' | 'powersave' | 'shelter' | 'rest' | 'call';
export type ScenarioId = 'slice' | 'full';
export type StormLevel = 'none' | 'warning' | 'rising' | 'strong';
export type TripChoice = 'back' | 'finish';
export type Goal = 'LIGHT' | 'RADIATION' | 'SHELTER' | 'ICE';

export interface ActionDef {
  id: ActionId; group: 'goal' | 'alive' | 'safe'; goal?: Goal; label: string; blocks: number;
  power: number; o2: number; dose: number; outside: boolean; stamina?: number;
  needsLink?: boolean; needsPower?: boolean; emergencyOk?: boolean;
}

export interface Env {
  sun: 'full' | 'half' | 'dark';
  eclipse: 'none' | 'short' | 'long';
  storm: StormLevel;
  stormSource: 'archive' | 'sim' | null;
  stormOnset: boolean;
  realDay: string | null;   // archive date this day replays (RadLab/DONKI)
  link: boolean;
}

export interface Evidence {
  sunLogs: number; eclipseLogged: boolean; measures: number; stormMeasures: number;
  trips: number; iceFound: number; mappedEmpty: number;
  shelteredStormDays: number; outsideStormBlocks: number; powerHitZero: boolean;
}

export interface State {
  scenario: ScenarioId; seed: number; rng: number; turn: number;
  power: number; o2: number; dose: number; stamina: number;
  dust: number; shelterLevel: number; iceSamples: number; scoutBonus: number;
  faults: { panel: boolean; scrubber: boolean };
  emergency: boolean;
  evidence: Evidence;
  timeline: Env[];
  pending: null | { type: 'tripChoice'; actions: ActionId[] };
  ended: null | { reason: 'complete' | 'oxygen' | 'dose' };
  history: { turn: number; actions: ActionId[]; choice?: TripChoice }[];
}

export const ACTIONS = moon.actions as ActionDef[];
export const actionDef = (id: ActionId) => ACTIONS.find((a) => a.id === id)!;
const SC = scenarios as Record<ScenarioId, any>;
export const scenarioOf = (s: State) => SC[s.scenario];
export const totalDays = (s: State): number => scenarioOf(s).days;
export const day = (s: State, turn = s.turn) => turn + 1;

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
  return Math.max(...storm.crater12h.filter((w) => w.start.startsWith(date)).map((w) => w.maxDoseRate));
}
export const QUIET_RATE = realDayRate('2024-05-08');
function levelFromRate(rate: number): StormLevel {
  return rate >= moon.storm.strongMinDoseRate ? 'strong' : rate >= moon.storm.risingMinDoseRate ? 'rising' : 'none';
}

function buildTimeline(sc: any, seed: number): Env[] {
  const r = makeRng(seed ^ 0x9e3779b9);
  const n = sc.days;
  const tl: Env[] = Array.from({ length: n }, () => ({
    sun: 'full', eclipse: 'none', storm: 'none', stormSource: null, stormOnset: false, realDay: null, link: true,
  }));
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
  if (ss) {
    const start = r.int(ss.startTurn[0], ss.startTurn[1]);
    const len = r.int(ss.length[0], ss.length[1]);
    if (start - 1 >= 0 && tl[start - 1].storm === 'none') Object.assign(tl[start - 1], { storm: 'warning', stormSource: 'sim' });
    for (let t = start; t < Math.min(n, start + len); t++) Object.assign(tl[t], { storm: ss.level, stormSource: 'sim', stormOnset: t === start });
  }
  return tl;
}

export function newGame(scenario: ScenarioId, seed: number): State {
  return {
    scenario, seed, rng: seed | 0, turn: 0,
    ...moon.start,
    dust: 0, shelterLevel: 0, iceSamples: 0, scoutBonus: 0,
    faults: { panel: false, scrubber: false }, emergency: false,
    evidence: { sunLogs: 0, eclipseLogged: false, measures: 0, stormMeasures: 0, trips: 0, iceFound: 0, mappedEmpty: 0, shelteredStormDays: 0, outsideStormBlocks: 0, powerHitZero: false },
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

/** Days until the sun comes back on the panels (0 = sunny today). */
export function daysUntilSun(s: State): number | null {
  for (let t = s.turn; t < s.timeline.length; t++) if (s.timeline[t].sun !== 'dark') return t - s.turn;
  return null;
}

export function menu(s: State): { def: ActionDef; blocked: string | null }[] {
  const e = env(s);
  return (scenarioOf(s).actions as ActionId[]).map((id) => {
    const def = actionDef(id);
    let blocked: string | null = null;
    if (def.needsLink && !e.link) blocked = 'Earth link down';
    else if (s.emergency && !def.emergencyOk) blocked = 'power emergency';
    else if (def.blocks > blocksToday(s)) blocked = 'crew too tired';
    else if (id === 'repair' && !s.faults.panel && !s.faults.scrubber) blocked = 'nothing broken';
    else if (id === 'regolith' && s.shelterLevel >= 3) blocked = 'shelter is full';
    return { def, blocked };
  });
}

export function validate(s: State, ids: ActionId[]): string | null {
  if (s.ended) return 'Mission is over.';
  if (!ids.length) return 'Pick at least one job.';
  if (new Set(ids).size !== ids.length) return 'Each job can only be picked once a day.';
  const m = menu(s);
  for (const id of ids) {
    const item = m.find((x) => x.def.id === id);
    if (!item) return `That job isn't available in this mission.`;
    if (item.blocked) return `${item.def.label}: ${item.blocked}.`;
  }
  const used = ids.reduce((n, id) => n + actionDef(id).blocks, 0);
  if (used > blocksToday(s)) return `Those jobs need ${used} crew time, your crew has ${blocksToday(s)} today.`;
  if (ids.includes('powersave') && ids.some((id) => actionDef(id).needsPower)) return 'Power-saving mode turns off the instruments (no drone, no radiation meter).';
  return null;
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * Resolve one day. If a storm starts while the rover is out and no choice was given,
 * returns with pending set and nothing resolved: call again with a TripChoice.
 */
export function step(s0: State, ids: ActionId[], choice?: TripChoice): { state: State; log: string[] } {
  const err = validate(s0, ids);
  if (err) return { state: s0, log: ['! ' + err] };
  const e = env(s0);
  if (ids.includes('rover') && stormActive(e) && e.stormOnset && !choice) {
    return { state: { ...s0, pending: { type: 'tripChoice', actions: ids } }, log: [] };
  }
  const s: State = structuredClone(s0);
  s.pending = null;
  const log: string[] = [];
  const pd = moon.perDay;
  const st = moon.stamina;
  let outsideBlocks = 0, insideBlocks = 0, sheltered = false, powerSave = false;
  let doseFromJobs = 0;

  for (const id of ids) {
    const a = actionDef(id);
    if (id === 'rover' && choice === 'back') {
      s.power += moon.trip.backPower; s.o2 += moon.trip.backO2; insideBlocks += a.blocks;
      log.push(`Rover turned back when the particles arrived. No sample, but the crew is safe inside. (power ${moon.trip.backPower}, oxygen ${moon.trip.backO2})`);
      continue;
    }
    s.power += powerCost(s, id);
    s.o2 += a.o2;
    doseFromJobs += a.dose;
    if (a.outside) outsideBlocks += a.blocks; else insideBlocks += a.blocks;
    if (a.stamina) s.stamina += a.stamina;
    switch (id) {
      case 'logsun': {
        s.evidence.sunLogs++;
        if (e.eclipse !== 'none') s.evidence.eclipseLogged = true;
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
        s.scoutBonus = Math.min(moon.ice.maxChance - moon.ice.baseChance, s.scoutBonus + moon.ice.scoutBonus);
        log.push(`Hop-drone mapped the dark crater. Ice chance on the next rover trip: ${Math.round(iceChance(s) * 100)}%. [ICE]`);
        break;
      case 'rover': {
        const chance = iceChance(s);
        s.evidence.trips++;
        s.dust = Math.min(pd.maxDust, s.dust + 1);
        if (rand(s) < chance) {
          s.iceSamples++; s.evidence.iceFound++;
          log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): ICE SAMPLE FOUND! Ice can be split into oxygen, so tuning the air now costs less power. [ICE]`);
        } else {
          s.evidence.mappedEmpty++;
          log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): no ice in this spot. You mapped where NOT to look. [ICE]`);
        }
        s.scoutBonus = 0;
        break;
      }
      case 'regolith': s.shelterLevel++; log.push(`Piled moon soil on the shelter: level ${s.shelterLevel}/3 (about ${s.shelterLevel} m of soil). Storms hurt less in there now. [SHELTER]`); break;
      case 'clean': s.dust = 0; log.push('Two astronauts cleaned dust off the panels and seals. Full sunlight power again.'); break;
      case 'air': log.push(`Air system tuned: it splits water into oxygen using power. Oxygen +${a.o2}.`); break;
      case 'repair':
        if (s.faults.panel) { s.faults.panel = false; log.push('Fixed the jammed solar panel.'); }
        else { s.faults.scrubber = false; log.push('Fixed the clogged air scrubber.'); }
        break;
      case 'powersave': powerSave = true; log.push(`Power-saving mode: heaters and instruments turned down. Base uses ${pd.powerSaveUpkeep} power instead of ${pd.upkeepPower}, but the crew gets cold (stamina ${st.powerSaveCold}).`); break;
      case 'shelter': sheltered = true; log.push('Whole crew sheltered in the most shielded room during the worst hours.'); break;
      case 'rest': log.push(`Two astronauts took a rest day. Stamina +${a.stamina}.`); break;
      case 'call': log.push(...forecastLines(s)); break;
    }
  }

  // Power
  if (e.sun !== 'dark') {
    let solar = pd.solar - s.dust * pd.dustSolarPenalty - (s.faults.panel ? pd.panelFaultSolarPenalty : 0);
    if (e.sun === 'half') solar *= pd.shortEclipseSolarFactor;
    solar = Math.max(0, Math.round(solar));
    s.power += solar;
    log.push(`Sunlight charged the batteries +${solar}${e.sun === 'half' ? ' (short eclipse: half a day of sun)' : ''}${s.dust ? ` (dust blocked ${s.dust * pd.dustSolarPenalty})` : ''}.`);
  } else log.push('No sunlight today. The base ran on batteries.');
  const upkeep = powerSave || s.emergency ? pd.powerSaveUpkeep : pd.upkeepPower;
  s.power -= upkeep;
  log.push(`Life support, heaters and radios used ${upkeep} power.`);

  // Oxygen
  s.o2 -= s.emergency ? pd.emergencyO2 : pd.breathO2;
  if (s.faults.scrubber) s.o2 -= pd.scrubberFaultO2;

  // Dose
  let dose: number;
  if (stormActive(e)) {
    const f = e.storm === 'rising' ? moon.storm.risingFactor : 1;
    const inside = sheltered ? moon.storm.shelterByLevel[s.shelterLevel] : moon.storm.habitat;
    const out = outsideBlocks * moon.storm.outsidePerBlock;
    dose = Math.ceil((inside + out) * f);
    if (sheltered) s.evidence.shelteredStormDays++;
    s.evidence.outsideStormBlocks += outsideBlocks;
    log.push(`Particle storm (${e.storm === 'strong' ? 'strong' : 'building'}): ${sheltered ? 'crew sheltered for the peak' : 'crew stayed in the habitat, not the shelter'}${outsideBlocks ? `, and astronauts were OUTSIDE` : ''}. Dose +${dose}.`);
  } else {
    dose = pd.baseDose + doseFromJobs;
  }
  s.dose += dose;

  // Stamina: work tires, sleep + daily exercise restore, free time relaxes
  const unused = blocksToday(s0) - ids.reduce((n, id) => n + actionDef(id).blocks, 0);
  s.stamina += st.dailyRecovery + insideBlocks * st.insideBlock + outsideBlocks * st.outsideBlock + unused * st.unusedBlock + (powerSave ? st.powerSaveCold : 0) + (s0.emergency ? st.emergencyCold : 0);
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
  } else {
    s.power = clamp(s.power);
    if (s.emergency && s.power >= moon.emergencyExitPower) { s.emergency = false; log.push('Power restored! Emergency over.'); }
  }

  s.history.push({ turn: s.turn, actions: ids, ...(choice ? { choice } : {}) });
  s.turn++;
  if (s.o2 <= 0) s.ended = { reason: 'oxygen' };
  else if (s.dose >= 100) s.ended = { reason: 'dose' };
  else if (s.turn >= totalDays(s)) s.ended = { reason: 'complete' };
  return { state: s, log };
}

export function radiationReading(e: Env): string[] {
  if (e.stormSource === 'sim' && stormActive(e)) return ['  Reading: very high. [~ SIMULATED storm, not real data]'];
  const date = e.realDay ?? '2024-05-08';
  const rate = realDayRate(date);
  const x = Math.round(rate / QUIET_RATE);
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

/** Report card: 4 entries x 3 stars. This is the main objective (D-013). */
export function reportCard(s: State): Record<Goal, number> {
  const ev = s.evidence;
  const b = (x: boolean) => (x ? 1 : 0);
  return {
    LIGHT: b(ev.sunLogs >= 2) + b(ev.eclipseLogged) + b(!ev.powerHitZero && s.turn > 0),
    RADIATION: b(ev.measures >= 1) + b(ev.stormMeasures >= 1) + b(ev.measures >= 3),
    SHELTER: b(ev.shelteredStormDays >= 1) + b(s.shelterLevel >= 1) + b(s.dose <= 50 && s.turn > 0),
    ICE: ev.iceFound >= 2 ? 3 : ev.iceFound === 1 ? 2 : ev.trips >= 1 ? 1 : 0,
  };
}

/** One-line hints: how to earn each missing star. */
export function starHints(s: State): Record<Goal, string> {
  const ev = s.evidence;
  const j = (xs: (string | false)[]) => xs.filter(Boolean).join(', ') || 'done!';
  return {
    LIGHT: j([ev.sunLogs < 2 && 'log sun 2x', !ev.eclipseLogged && 'log while dark', ev.powerHitZero ? 'power ran out (star lost)' : 'never run out of power']),
    RADIATION: j([ev.measures < 1 && 'measure once', !ev.stormMeasures && 'measure in a storm', ev.measures < 3 && 'measure 3x']),
    SHELTER: j([!ev.shelteredStormDays && 'shelter in a storm', s.shelterLevel < 1 && 'pile soil once', 'end with dose under 50%']),
    ICE: ev.iceFound >= 2 ? 'done!' : ev.trips ? 'find ice (scout first!)' : 'make a rover trip',
  };
}

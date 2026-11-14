// Deterministic rules engine (D-004). No DOM, no network. Same seed + same choices = same run.
// Numbers live in src/config/moon.json; the timeline (eclipses, storms, comms) in scenarios.json.
import moon from '../config/moon.json' with { type: 'json' };
import scenarios from '../config/scenarios.json' with { type: 'json' };
import storm from '../data/storm-2024-05.json' with { type: 'json' };

export type ActionId =
  | 'clean' | 'air' | 'repair' | 'regolith' | 'shelter' | 'rest' | 'rover'
  | 'scout' | 'logsun' | 'measure' | 'samples' | 'call' | 'report';
export type ScenarioId = 'slice' | 'full';
export type StormLevel = 'none' | 'warning' | 'rising' | 'strong';
export type TripChoice = 'back' | 'finish';

export interface ActionDef {
  id: ActionId; label: string; slots: number; power: number; o2: number; dose: number;
  outside: boolean; needsLink?: boolean; emergencyOk?: boolean;
}

export interface Env {
  sun: boolean;            // panels lit this shift
  eclipse: 'none' | 'short' | 'long';
  storm: StormLevel;
  stormSource: 'archive' | 'sim' | null;
  stormOnset: boolean;     // first active storm shift
  doseRateWindow: string | null; // RadLab 12h window key, archive storms only
  link: boolean;           // Earth link up
}

export interface Evidence {
  sunLogs: number; eclipseLogged: boolean; measures: number; stormMeasures: number;
  trips: number; iceFound: number; mappedEmpty: number;
  shelteredStormShifts: number; outsideStormShifts: number; powerHitZero: boolean;
}

export interface State {
  scenario: ScenarioId; seed: number; rng: number; turn: number;
  power: number; o2: number; dose: number; science: number;
  dust: number; shelterLevel: number; iceSamples: number; scoutBonus: number;
  faults: { panel: boolean; scrubber: boolean };
  shiftsSinceRest: number; emergency: boolean;
  forecastUntil: number;   // Mission Control storm heads-up known up to this turn
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
export const totalTurns = (s: State) => scenarioOf(s).days * scenarioOf(s).shiftsPerDay;
export const dayShift = (s: State, turn = s.turn) => ({
  day: Math.floor(turn / scenarioOf(s).shiftsPerDay) + 1,
  shift: (turn % scenarioOf(s).shiftsPerDay) + 1,
});

// --- seeded RNG (mulberry32) ---
function next(seedState: number): [number, number] {
  let t = (seedState + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, t];
}
function rand(s: State): number { const [v, n] = next(s.rng); s.rng = n; return v; }
function makeRng(seed: number) {
  let st = seed | 0;
  return {
    f: () => { const [v, n] = next(st); st = n; return v; },
    int: (lo: number, hi: number) => { const [v, n] = next(st); st = n; return lo + Math.floor(v * (hi - lo + 1)); },
  };
}

export function stormLevelFromRate(rate: number): StormLevel {
  if (rate >= moon.storm.strongMinDoseRate) return 'strong';
  if (rate >= moon.storm.risingMinDoseRate) return 'rising';
  return 'none';
}
export const craterWindow = (key: string) => storm.crater12h.find((w) => w.start === key)!;

function buildTimeline(sc: any, seed: number): Env[] {
  const r = makeRng(seed ^ 0x9e3779b9);
  const n = sc.days * sc.shiftsPerDay;
  const tl: Env[] = Array.from({ length: n }, () => ({
    sun: true, eclipse: 'none', storm: 'none', stormSource: null, stormOnset: false, doseRateWindow: null, link: true,
  }));
  const ls = sc.longShadow;
  if (ls) {
    const len = r.int(ls.length[0], ls.length[1]);
    for (let t = ls.startTurn; t < Math.min(n, ls.startTurn + len); t++) Object.assign(tl[t], { sun: false, eclipse: 'long' });
  }
  for (let i = 0; i < sc.shortEclipses.count; i++) {
    const [a, b] = sc.shortEclipses.turnRanges[i % sc.shortEclipses.turnRanges.length];
    const t = r.int(a, b);
    if (tl[t].eclipse === 'none') Object.assign(tl[t], { sun: false, eclipse: 'short' });
  }
  const rs = sc.replayStorm;
  if (rs) {
    tl[rs.alertTurn].storm = 'warning'; tl[rs.alertTurn].stormSource = 'archive';
    tl[rs.alertTurn].doseRateWindow = rs.alertWindow;
    rs.windows.forEach((w: string, i: number) => {
      const lvl = stormLevelFromRate(craterWindow(w).maxDoseRate);
      Object.assign(tl[rs.alertTurn + 1 + i], { storm: lvl === 'none' ? 'rising' : lvl, stormSource: 'archive', doseRateWindow: w, stormOnset: i === 0 });
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
  const sc = SC[scenario];
  return {
    scenario, seed, rng: seed | 0, turn: 0,
    ...moon.start,
    dust: 0, shelterLevel: 0, iceSamples: 0, scoutBonus: 0,
    faults: { panel: false, scrubber: false },
    shiftsSinceRest: 0, emergency: false, forecastUntil: -1,
    evidence: { sunLogs: 0, eclipseLogged: false, measures: 0, stormMeasures: 0, trips: 0, iceFound: 0, mappedEmpty: 0, shelteredStormShifts: 0, outsideStormShifts: 0, powerHitZero: false },
    timeline: buildTimeline(sc, seed),
    pending: null, ended: null, history: [],
  };
}

export const env = (s: State, turn = s.turn): Env => s.timeline[Math.min(turn, s.timeline.length - 1)];
export const stormActive = (e: Env) => e.storm === 'rising' || e.storm === 'strong';

export function slotsAvailable(s: State): number {
  return scenarioOf(s).features.fatigue && s.shiftsSinceRest >= moon.fatigueShifts ? 1 : 2;
}

export function airPowerCost(s: State): number {
  const d = moon.ice.airDiscountPerSample * Math.min(s.iceSamples, moon.ice.maxDiscountSamples);
  return Math.min(-4, actionDef('air').power + d);
}
export const iceChance = (s: State) => Math.min(moon.ice.maxChance, moon.ice.baseChance + s.scoutBonus);

/** Actions in this scenario, with a reason if blocked right now. */
export function menu(s: State): { def: ActionDef; blocked: string | null }[] {
  const e = env(s);
  return (scenarioOf(s).actions as ActionId[]).map((id) => {
    const def = actionDef(id);
    let blocked: string | null = null;
    if (def.needsLink && !e.link) blocked = 'Earth link down';
    else if (s.emergency && !def.emergencyOk) blocked = 'power emergency';
    else if (def.slots > slotsAvailable(s)) blocked = 'crew too tired';
    else if (id === 'repair' && !s.faults.panel && !s.faults.scrubber) blocked = 'nothing broken';
    else if (id === 'regolith' && s.shelterLevel >= 3) blocked = 'shelter full';
    return { def, blocked };
  });
}

export function validate(s: State, ids: ActionId[]): string | null {
  if (s.ended) return 'Mission is over.';
  if (!ids.length) return 'Pick at least one job.';
  const m = menu(s);
  const slots = ids.reduce((n, id) => n + actionDef(id).slots, 0);
  if (slots > slotsAvailable(s)) return `That needs ${slots} crew slots, you have ${slotsAvailable(s)}.`;
  if (new Set(ids).size !== ids.length) return 'Pick two different jobs.';
  for (const id of ids) {
    const item = m.find((x) => x.def.id === id);
    if (!item) return `"${id}" isn't available in this mission.`;
    if (item.blocked) return `${item.def.label}: ${item.blocked}.`;
  }
  return null;
}

/** Routine evidence: full points for the first few, then a little (stops log spamming). */
const repeatPoints = (count: number, full: number) => (count <= moon.science.repeatFullCount ? full : moon.science.repeatAfter);

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * Resolve one shift. If a storm starts while the rover is out and no choice was given,
 * returns with s.pending set and nothing resolved: call again with a TripChoice.
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
  const sci = moon.science;
  const ps = moon.perShift;
  let outside = false, sheltered = false;
  let doseFromActions = 0;

  for (const id of ids) {
    const a = actionDef(id);
    if (id === 'rover' && choice === 'back') {
      s.power += moon.trip.backPower; s.o2 += moon.trip.backO2;
      log.push(`Rover turned back when the particles arrived. Trip cut short: no sample, but the crew is safe inside. (power ${moon.trip.backPower}, oxygen ${moon.trip.backO2})`);
      continue;
    }
    s.power += id === 'air' ? airPowerCost(s) : a.power;
    s.o2 += a.o2;
    doseFromActions += a.dose;
    if (a.outside) outside = true;
    switch (id) {
      case 'clean': s.dust = 0; log.push('Panels and seals cleaned. Full sunlight power again.'); break;
      case 'air': log.push(`Air system tuned: it splits water into oxygen using power. Oxygen +${a.o2}.`); break;
      case 'repair':
        if (s.faults.panel) { s.faults.panel = false; log.push('Fixed the solar panel fault.'); }
        else { s.faults.scrubber = false; log.push('Fixed the air scrubber fault.'); }
        break;
      case 'regolith': s.shelterLevel++; log.push(`Piled moon soil on the shelter. Shelter level ${s.shelterLevel}/3 (about ${s.shelterLevel} m of soil).`); break;
      case 'shelter': sheltered = true; log.push('Crew sheltered in the most shielded room. No science this shift.'); break;
      case 'rest': s.shiftsSinceRest = -1; log.push('Crew rested and exercised. Ready to work.'); break;
      case 'scout': {
        s.scoutBonus = Math.min(moon.ice.maxChance - moon.ice.baseChance, s.scoutBonus + moon.ice.scoutBonus);
        s.science += sci.scout;
        log.push(`Hop-drone mapped the crater. Ice chance on the next trip now ${Math.round(iceChance(s) * 100)}%. Science +${sci.scout}.`);
        break;
      }
      case 'rover': {
        const chance = iceChance(s);
        s.evidence.trips++;
        s.dust = Math.min(ps.maxDust, s.dust + 1);
        if (rand(s) < chance) {
          s.iceSamples++; s.evidence.iceFound++; s.science += sci.iceSample;
          log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): ICE SAMPLE FOUND! Science +${sci.iceSample}. Ice can be split into oxygen, so tuning air now costs less power.`);
        } else {
          s.evidence.mappedEmpty++; s.science += sci.noIce;
          log.push(`Rover trip to the dark crater (${Math.round(chance * 100)}% chance): no ice in this spot. You mapped where NOT to look. Science +${sci.noIce}.`);
        }
        s.scoutBonus = 0;
        break;
      }
      case 'logsun': {
        s.evidence.sunLogs++;
        const inDark = e.eclipse !== 'none';
        if (inDark) s.evidence.eclipseLogged = true;
        const pts = inDark ? sci.logsunEclipse : repeatPoints(s.evidence.sunLogs, sci.logsun);
        s.science += pts;
        log.push(inDark ? `Logged the eclipse: how long the ridge stays dark. Rare evidence! Science +${pts}.` : `Logged sunlight on the ridge. Science +${pts}.${pts < sci.logsun ? ' (We already have lots of sunny-day logs.)' : ''}`);
        break;
      }
      case 'measure': {
        s.evidence.measures++;
        const active = stormActive(e);
        if (active) s.evidence.stormMeasures++;
        const quietCount = s.evidence.measures - s.evidence.stormMeasures;
        const pts = active ? sci.measureStorm : repeatPoints(quietCount, sci.measure);
        s.science += pts;
        log.push(active ? `Measured radiation during the storm. Science +${pts}.` : `Measured radiation on a quiet day. Science +${pts}.${pts < sci.measure ? ' (Quiet days look alike, so less new science.)' : ''}`);
        log.push(...radiationReading(e));
        break;
      }
      case 'samples': s.science += sci.samples; log.push(`Collected rock and dust samples. Science +${sci.samples}.`); break;
      case 'call': {
        s.forecastUntil = s.turn + 2;
        log.push(...forecastLines(s));
        break;
      }
      case 'report': s.science += sci.report; log.push(`Daily report sent to Earth. Science +${sci.report}.`); break;
    }
  }

  // Background: power
  if (e.sun) {
    const solar = Math.max(0, ps.solar - s.dust * ps.dustSolarPenalty - (s.faults.panel ? ps.panelFaultSolarPenalty : 0));
    s.power += solar;
    log.push(`Sunlight charged the batteries +${solar}${s.dust ? ` (dust is blocking ${s.dust * ps.dustSolarPenalty})` : ''}.`);
  } else {
    log.push('No sunlight on the panels this shift. Batteries only.');
  }
  s.power -= ps.upkeepPower;
  // Oxygen
  s.o2 -= s.emergency ? ps.emergencyO2 : ps.breathO2;
  if (s.faults.scrubber) s.o2 -= ps.scrubberFaultO2;

  // Dose
  let dose: number;
  if (stormActive(e)) {
    const f = e.storm === 'rising' ? moon.storm.risingFactor : 1;
    // A rover that turned back doesn't count as outside (the loop skipped it).
    const where = sheltered ? 'shelter' : outside ? 'outside' : 'habitat';
    const base = where === 'shelter' ? moon.storm.shelterByLevel[s.shelterLevel] : where === 'outside' ? moon.storm.outside : moon.storm.habitat;
    dose = Math.ceil(base * f);
    if (where === 'shelter') s.evidence.shelteredStormShifts++;
    if (where === 'outside') s.evidence.outsideStormShifts++;
    log.push(`Storm ${e.storm === 'strong' ? '(strong)' : '(building)'}: crew was ${where === 'outside' ? 'OUTSIDE' : where === 'shelter' ? 'in the shelter' : 'inside the habitat'}. Dose +${dose}.`);
  } else {
    dose = ps.baseDose + doseFromActions;
  }
  s.dose += dose;

  // Dust builds up over time
  if ((s.turn + 1) % ps.dustEveryShifts === 0 && s.dust < ps.maxDust) { s.dust++; log.push('Dust settled on the panels (dust level ' + s.dust + ').'); }

  // Faults
  if (scenarioOf(s).features.faults) {
    const chance = moon.faults.baseChance + (s.dust >= ps.maxDust ? moon.faults.dustyChance : 0);
    if (rand(s) < chance) {
      if (!s.faults.panel && rand(s) < 0.5) { s.faults.panel = true; log.push('FAULT: a solar panel joint is jammed with dust. Less power until repaired.'); }
      else if (!s.faults.scrubber) { s.faults.scrubber = true; log.push('FAULT: the air scrubber is clogged. Oxygen drains faster until repaired.'); }
    }
  }

  // Fatigue
  s.shiftsSinceRest++;

  // Clamp + power emergency
  s.o2 = clamp(s.o2); s.dose = Math.min(100, s.dose);
  if (s.power <= 0) {
    if (!s.emergency) log.push('POWER EMERGENCY: batteries empty. Only shelter, rest and repairs until power is back above 10. Air runs on minimum, oxygen drains fast.');
    s.power = 0; s.emergency = true; s.evidence.powerHitZero = true;
  } else {
    s.power = clamp(s.power);
    if (s.emergency && s.power > moon.emergencyExitPower) { s.emergency = false; log.push('Power restored. Emergency over.'); }
  }

  s.history.push({ turn: s.turn, actions: ids, ...(choice ? { choice } : {}) });
  s.turn++;
  if (s.o2 <= 0) s.ended = { reason: 'oxygen' };
  else if (s.dose >= 100) s.ended = { reason: 'dose' };
  else if (s.turn >= totalTurns(s)) s.ended = { reason: 'complete' };
  return { state: s, log };
}

export function radiationReading(e: Env): string[] {
  if (e.stormSource === 'sim' && stormActive(e)) return ['  Reading: very high. [~ SIMULATED storm, not real data]'];
  const key = e.doseRateWindow ?? '2024-05-08T00Z';
  const w = craterWindow(key);
  const quiet = craterWindow('2024-05-08T00Z').maxDoseRate;
  const x = Math.round(w.maxDoseRate / quiet);
  return [
    `  Real reading for this moment of the May 2024 storm: ${w.maxDoseRate.toLocaleString('en-US')} uGy/h${x > 1 ? ` (about ${x}x a quiet day)` : ' (a quiet day)'}.`,
    '  [✓ NASA RadLab · CRaTER on LRO · ARCHIVE May 2024] Measured in lunar orbit, not on the surface.',
  ];
}

export function forecastLines(s: State): string[] {
  const out: string[] = ['Mission Control: "Here is what our forecasters and radiation team see:"'];
  for (let t = s.turn; t <= Math.min(s.turn + 2, totalTurns(s) - 1); t++) {
    const e = env(s, t);
    const { day, shift } = dayShift(s, t);
    const when = t === s.turn ? 'This shift' : `Day ${day} shift ${shift}`;
    const what = e.storm === 'none' ? 'calm' : e.storm === 'warning' ? 'flare likely, particles may follow' : `particles arriving (${e.storm === 'strong' ? 'strong' : 'building'})`;
    out.push(`  ${when}: ${what}`);
  }
  return out;
}

export function reportCard(s: State) {
  const ev = s.evidence;
  const b = (x: boolean) => (x ? 1 : 0);
  return {
    lighting: b(!ev.powerHitZero) + b(ev.sunLogs >= 2) + b(ev.eclipseLogged),
    radiation: b(ev.measures >= 1) + b(ev.stormMeasures >= 1) + b(ev.measures >= 3),
    shelter: b(ev.shelteredStormShifts >= 1) + b(ev.outsideStormShifts === 0) + b(s.dose <= 40),
    ice: ev.iceFound >= 2 ? 3 : ev.iceFound === 1 ? 2 : ev.trips >= 1 ? 1 : 0,
  };
}

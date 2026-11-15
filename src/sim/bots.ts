// Balance check (v2, day-based): seeded bot players run many games and we compare outcomes.
// Usage: node --no-warnings src/sim/bots.ts [full|slice] [games]
import {
  newGame, step, menu, env, stormActive, blocksToday, reportCard, actionDef, daysUntilSun, verdict,
  type State, type ActionId, type ScenarioId, type TripChoice, type AlertChoice,
} from '../engine/engine.ts';

type Bot = { name: string; pick: (s: State) => ActionId[]; trip: TripChoice };

/** Take jobs from a priority list while crew time lasts (and the combo is legal). */
function fill(s: State, wants: ActionId[]): ActionId[] {
  let left = blocksToday(s);
  const out: ActionId[] = [];
  const m = menu(s);
  for (const id of wants) {
    const item = m.find((x) => x.def.id === id);
    if (!item || item.blocked || (item.def.blocks >= 4 && !item.def.repeatable && out.includes(id)) || item.def.blocks > left) continue;
    if (id === 'powersave' && out.some((o) => actionDef(o).needsPower)) continue;
    if (out.includes('powersave') && actionDef(id).needsPower) continue;
    out.push(id); left -= item.def.blocks;
  }
  if (!out.length) out.push(m.find((x) => !x.blocked)!.def.id);
  return out;
}
const e = (s: State, k = 0) => env(s, s.turn + k);
const darkSoon = (s: State) => [0, 1, 2].some((k) => e(s, k).eclipse === 'long');

const careful: Bot = {
  name: 'careful', trip: 'back',
  pick: (s) => {
    const w: ActionId[] = [];
    const storm = stormActive(e(s));
    if (s.faults.panel || s.faults.scrubber) w.push('repair');
    if (storm) w.push('shelter', 'measure');
    if (s.o2 < 55) w.push('air');
    if (s.stamina < 55) w.push('rest');
    if (s.dust >= 2 && e(s).sun !== 'dark') w.push('clean');
    if (e(s).eclipse !== 'none' && !s.evidence.eclipseLogged) w.push('logsun');
    if (e(s).sun === 'dark' && s.power < 60) w.push('powersave');
    const calm = !storm && e(s).storm !== 'warning';
    if (calm && !darkSoon(s) && s.power >= 70 && s.scoutBonus >= 0.25 && s.evidence.iceFound < 2) w.push('rover');
    if (calm && !s.evidence.trips && s.power >= 55 && s.scoutBonus >= 0.25) w.push('rover');
    if (calm && s.shelterLevel < 1 && s.power >= 50) w.push('regolith');
    if (s.power >= 50 && s.scoutBonus < 0.5 && s.evidence.iceFound < 2) w.push('scout');
    if (s.evidence.measures < 4) w.push('measure');
    if (s.evidence.sunLogs < (s.scenario === 'weeks7' || s.scenario === 'solarMax' ? 4 : 2)) w.push('logsun');
    if (e(s).storm === 'warning' || (e(s).link && !e(s, 1).link)) w.push('call');
    if (!s.evidence.scouts) w.push('scout');
    return fill(s, w);
  },
};

// Plans around the forecast: trips early, saves power for the dark, shelters in storms.
const planner: Bot = {
  name: 'planner (plans for the dark)', trip: 'back',
  pick: (s) => {
    const w: ActionId[] = [];
    const storm = stormActive(e(s));
    const darkIn = [0, 1, 2, 3].findIndex((k) => e(s, k).eclipse === 'long');
    const reserve = darkIn >= 0 ? 50 : 10; // keep enough battery for 2 dark days
    if (s.faults.panel || s.faults.scrubber) w.push('repair');
    if (storm) w.push('shelter', 'measure');
    if (s.o2 < 40) w.push('air');
    if (s.dust >= 1 && e(s).sun !== 'dark' && !storm) w.push('clean');
    if (e(s).eclipse !== 'none' && !s.evidence.eclipseLogged) w.push('logsun');
    if (e(s).sun === 'dark') w.push('powersave');
    const calm = !storm && e(s).storm !== 'warning';
    if (!s.evidence.scouts) w.push('scout');
    if (calm && s.power - 50 >= reserve && s.scoutBonus > 0 && (s.evidence.trips < 1 || (!s.evidence.iceFound && s.evidence.trips < 2))) w.push('rover');
    if (calm && s.shelterLevel < 1 && s.power - 10 >= reserve) w.push('regolith');
    if (s.evidence.measures < 4 && e(s).sun !== 'dark') w.push('measure');
    if (s.evidence.sunLogs < (s.scenario === 'weeks7' || s.scenario === 'solarMax' ? 4 : 2)) w.push('logsun');
    if (s.stamina < 55) w.push('rest');
    return fill(s, w);
  },
};

const greedy: Bot = {
  name: 'greedy (blind trips, no clean)', trip: 'finish',
  pick: (s) => {
    const w: ActionId[] = [];
    if (s.o2 < 30) w.push('air');
    if (s.power >= 50) w.push('rover');
    w.push('measure', 'logsun', 'scout');
    return fill(s, w);
  },
};

const reckless: Bot = {
  name: 'reckless (ignores storms)', trip: 'finish',
  pick: (s) => {
    const w: ActionId[] = [];
    if (s.faults.panel || s.faults.scrubber) w.push('repair');
    if (s.o2 < 50) w.push('air');
    if (s.stamina < 50) w.push('rest');
    if (s.dust >= 2 && e(s).sun !== 'dark') w.push('clean');
    if (s.power >= 60 && s.scoutBonus >= 0.25) w.push('rover');
    if (s.power >= 40) w.push('scout');
    w.push('regolith', 'measure', 'logsun');
    return fill(s, w);
  },
};

const idle: Bot = {
  name: 'idle (inside jobs only)', trip: 'back',
  pick: (s) => fill(s, s.o2 < 40 ? ['air', 'logsun', 'measure'] : ['logsun', 'measure', 'rest']),
};

let lcg = 12345;
const random: Bot = {
  name: 'random clicks', trip: 'finish',
  pick: (s) => {
    const opts = menu(s).filter((m) => !m.blocked).map((m) => m.def.id);
    for (let i = opts.length - 1; i > 0; i--) { lcg = (lcg * 1103515245 + 12345) & 0x7fffffff; const j = lcg % (i + 1); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    return fill(s, opts.slice(0, 3));
  },
};

function play(bot: Bot, scenario: ScenarioId, seed: number) {
  let s = newGame(scenario, seed);
  let emergencies = 0, minStamina = 100, emergencyDays = 0;
  while (!s.ended) {
    const ids = bot.pick(s);
    let r = step(s, ids);
    if (r.state.pending) {
      const choice: TripChoice | AlertChoice = r.state.pending.type === 'alertChoice'
        ? (r.state.pending.alert === 'storm' ? 'shelter' : r.state.pending.alert === 'shadow' ? 'save' : r.state.pending.alert === 'eclipse' ? 'save' : r.state.pending.alert === 'dust' ? 'clean' : 'continue')
        : bot.trip;
      r = step(s, ids, choice);
    }
    if (r.log[0]?.startsWith('!')) throw new Error(`${bot.name} illegal move day ${s.turn + 1}: ${r.log[0]} [${ids}]`);
    if (r.state.emergency && !s.emergency) emergencies++;
    if (r.state.emergency) emergencyDays++;
    s = r.state;
    minStamina = Math.min(minStamina, s.stamina);
  }
  const rc = reportCard(s);
  const v = verdict(s);
  return { s, emergencies, emergencyDays, minStamina, stars: rc.LIGHT + rc.RADIATION + rc.SHELTER + rc.ICE, rc, v };
}

const scenario = (process.argv[2] as ScenarioId) ?? 'weeks7';
const N = Number(process.argv[3] ?? 500);
const pct = (x: number) => `${Math.round((x / N) * 100)}%`;
const avg = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
void daysUntilSun;

console.log(`Scenario: ${scenario}, ${N} seeded games per bot. Stars out of 12.\n`);
console.log('bot'.padEnd(31) + 'PROM+ APPR+ gold  O2fail doseFail emerg  dose  dose<=25 minStam  stars  L/R/S/I');
const allRuns = new Map<string, ReturnType<typeof play>[]>();
for (const bot of [planner, careful, greedy, reckless, idle, random]) {
  const runs = Array.from({ length: N }, (_, i) => play(bot, scenario, i + 1));
  allRuns.set(bot.name, runs);
  const end = (r: string) => runs.filter((x) => x.s.ended!.reason === r).length;
  const k = (g: 'LIGHT' | 'RADIATION' | 'SHELTER' | 'ICE') => avg(runs.map((x) => x.rc[g]));
  console.log(
    bot.name.padEnd(31) + pct(runs.filter((x) => x.v.tier !== 'not-proven').length).padEnd(6) + pct(runs.filter((x) => x.v.tier === 'approved' || x.v.tier === 'gold').length).padEnd(6) + pct(runs.filter((x) => x.v.tier === 'gold').length).padEnd(6) + pct(end('oxygen')).padEnd(7) + pct(end('dose')).padEnd(9)
    + pct(runs.filter((x) => x.emergencies > 0).length).padEnd(7) + avg(runs.map((x) => x.s.dose)).padEnd(6)
    + pct(runs.filter((x) => x.s.dose <= 25).length).padEnd(9) + avg(runs.map((x) => x.minStamina)).padEnd(9)
    + avg(runs.map((x) => x.stars)).padEnd(7) + `${k('LIGHT')}/${k('RADIATION')}/${k('SHELTER')}/${k('ICE')}`,
  );
}

if (scenario === 'weeks7' || scenario === 'solarMax') {
  const draws = [...new Set([...allRuns.values()].flatMap((runs) => runs.map((r) => r.s.timeline.find((e) => e.stormName)?.stormName ?? 'no storm draw')))];
  console.log('\nAPPROVED+ BY STORM DRAW');
  for (const draw of draws) {
    const cells = [...allRuns.entries()].map(([name, runs]) => {
      const selected = runs.filter((r) => (r.s.timeline.find((e) => e.stormName)?.stormName ?? 'no storm draw') === draw);
      return `${name}: ${selected.length ? pct(selected.filter((r) => r.v.tier === 'approved' || r.v.tier === 'gold').length) : 'n/a'}`;
    });
    console.log(`  ${draw.padEnd(28)} ${cells.join(' | ')}`);
  }
}

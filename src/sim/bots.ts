// Balance check: seeded bot players run many games and we compare outcomes.
// Usage: node --no-warnings src/sim/bots.ts [full|slice] [games]
import {
  newGame, step, menu, env, stormActive, slotsAvailable, reportCard, airPowerCost,
  type State, type ActionId, type ScenarioId, type TripChoice,
} from '../engine/engine.ts';

type Bot = { name: string; pick: (s: State) => ActionId[]; trip: TripChoice };

const can = (s: State, id: ActionId) => menu(s).some((m) => m.def.id === id && !m.blocked);
/** Fill remaining slots from a priority list. */
function fill(s: State, wants: ActionId[]): ActionId[] {
  let slots = slotsAvailable(s);
  const out: ActionId[] = [];
  for (const id of wants) {
    const m = menu(s).find((x) => x.def.id === id);
    if (!m || m.blocked || out.includes(id) || m.def.slots > slots) continue;
    out.push(id); slots -= m.def.slots;
    if (!slots) break;
  }
  if (!out.length) out.push(menu(s).find((m) => !m.blocked)!.def.id);
  return out;
}
const stormSoon = (s: State) => stormActive(env(s)) || env(s).storm === 'warning';
const darkSoon = (s: State) => [0, 1, 2].some((k) => env(s, s.turn + k).eclipse === 'long');

const careful: Bot = {
  name: 'careful', trip: 'back',
  pick: (s) => {
    if (stormActive(env(s))) return fill(s, s.evidence.stormMeasures ? ['shelter'] : ['measure', 'logsun']);
    const w: ActionId[] = [];
    if (s.faults.panel || s.faults.scrubber) w.push('repair');
    if (s.shiftsSinceRest >= 5) w.push('rest');
    if (s.o2 < 55) w.push('air');
    if (s.dust >= 2 && env(s).sun) w.push('clean');
    if (env(s).eclipse !== 'none' && !s.evidence.eclipseLogged) w.push('logsun');
    if (!stormSoon(s) && !darkSoon(s) && s.power >= 75 && s.scoutBonus >= 0.25) w.push('rover');
    if (!stormSoon(s) && s.shelterLevel < 2 && s.power >= 60 && s.turn < 12) w.push('regolith');
    if (s.power >= 50 && s.scoutBonus < 0.5) w.push('scout');
    w.push('measure', 'logsun', 'call', 'report', 'rest');
    return fill(s, w);
  },
};

const greedy: Bot = {
  name: 'greedy', trip: 'finish',
  pick: (s) => {
    const w: ActionId[] = [];
    if (s.o2 < 30) w.push('air');
    if (s.shiftsSinceRest >= 6) w.push('rest');
    if (s.power >= 40) w.push('rover');
    w.push('samples', 'measure', 'logsun', 'report', 'rest');
    return fill(s, w);
  },
};

const reckless: Bot = {
  name: 'reckless', trip: 'finish',
  pick: (s) => {
    const w: ActionId[] = [];
    if (s.faults.panel || s.faults.scrubber) w.push('repair');
    if (s.shiftsSinceRest >= 5) w.push('rest');
    if (s.o2 < 50) w.push('air');
    if (s.dust >= 2 && env(s).sun) w.push('clean');
    if (s.power >= 60 && s.scoutBonus >= 0.25) w.push('rover');
    if (s.power >= 45) w.push('scout');
    w.push('samples', 'measure', 'logsun', 'report');
    return fill(s, w); // never shelters, works outside in storms
  },
};

const idle: Bot = {
  name: 'idle (log + rest only)', trip: 'back',
  pick: (s) => fill(s, s.o2 < 40 ? ['air', 'logsun'] : ['logsun', 'measure', 'rest']),
};

let seedCounter = 0;
const random: Bot = {
  name: 'random', trip: 'finish',
  pick: (s) => {
    const opts = menu(s).filter((m) => !m.blocked).map((m) => m.def.id);
    const r = (n: number) => { seedCounter = (seedCounter * 1103515245 + 12345) & 0x7fffffff; return seedCounter % n; };
    const shuffled = opts.sort(() => r(3) - 1);
    return fill(s, shuffled);
  },
};

function play(bot: Bot, scenario: ScenarioId, seed: number) {
  let s = newGame(scenario, seed);
  let minPower = 100, emergencies = 0;
  while (!s.ended) {
    const ids = bot.pick(s);
    let r = step(s, ids);
    if (r.state.pending) r = step(s, ids, bot.trip);
    if (r.log[0]?.startsWith('!')) throw new Error(`${bot.name} illegal move turn ${s.turn}: ${r.log[0]} ${ids}`);
    if (r.state.emergency && !s.emergency) emergencies++;
    s = r.state;
    minPower = Math.min(minPower, s.power);
  }
  const rc = reportCard(s);
  return { s, minPower, emergencies, stars: rc.lighting + rc.radiation + rc.shelter + rc.ice, rc };
}

const scenario = (process.argv[2] as ScenarioId) ?? 'full';
const N = Number(process.argv[3] ?? 500);
const pct = (x: number) => `${Math.round((x / N) * 100)}%`.padStart(4);
const avg = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1).padStart(5);

console.log(`Scenario: ${scenario}, ${N} seeded games per bot. Stars out of 12. (air tune power cost at start: ${airPowerCost(newGame(scenario, 1))})\n`);
console.log('bot                     complete  O2fail doseFail emerg  dose  power(min) science ice  stars  L/R/S/I');
for (const bot of [careful, greedy, reckless, idle, random]) {
  const runs = Array.from({ length: N }, (_, i) => play(bot, scenario, i + 1));
  const end = (r: string) => runs.filter((x) => x.s.ended!.reason === r).length;
  const rcAvg = (k: 'lighting' | 'radiation' | 'shelter' | 'ice') => avg(runs.map((x) => x.rc[k])).trim();
  console.log(
    bot.name.padEnd(24),
    pct(end('complete')).padStart(8), pct(end('oxygen')).padStart(7), pct(end('dose')).padStart(8),
    pct(runs.filter((x) => x.emergencies > 0).length).padStart(5),
    avg(runs.map((x) => x.s.dose)), avg(runs.map((x) => x.minPower)).padStart(10),
    avg(runs.map((x) => x.s.science)).padStart(7), avg(runs.map((x) => x.s.evidence.iceFound)).padStart(4),
    avg(runs.map((x) => x.stars)).padStart(6), ` ${rcAvg('lighting')}/${rcAvg('radiation')}/${rcAvg('shelter')}/${rcAvg('ice')}`,
  );
}

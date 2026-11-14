// Chat-play prototype. State is saved in .run/state.json between commands.
//   node --no-warnings src/cli/play.ts new [slice|full] [seed]
//   node --no-warnings src/cli/play.ts act 1 4        (job numbers from the menu)
//   node --no-warnings src/cli/play.ts choose back|finish
//   node --no-warnings src/cli/play.ts show
//   npm run play   (no args) = interactive mode: just type job numbers at the prompt
import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import {
  newGame, step, menu, env, stormActive, slotsAvailable, dayShift, totalTurns, reportCard,
  iceChance, airPowerCost, type State, type ActionId, type ScenarioId, type TripChoice,
} from '../engine/engine.ts';
import { missionControl } from '../content/lines.ts';

const FILE = new URL('../../.run/state.json', import.meta.url);
const load = (): State => JSON.parse(readFileSync(FILE, 'utf8'));
const save = (s: State) => { mkdirSync(new URL('../../.run/', import.meta.url), { recursive: true }); writeFileSync(FILE, JSON.stringify(s)); };

const W = 74;
const line = '+' + '-'.repeat(W - 2) + '+';
const row = (t = '') => '| ' + t.padEnd(W - 4).slice(0, W - 4) + ' |';
const bar = (v: number) => '[' + '#'.repeat(Math.round(v / 10)) + '-'.repeat(10 - Math.round(v / 10)) + ']';
function wrap(t: string, width = W - 4): string[] {
  const out: string[] = []; let cur = '';
  for (const w of t.split(' ')) { if ((cur + ' ' + w).trim().length > width) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) out.push(cur);
  return out;
}

function screen(s: State): string {
  const e = env(s);
  const { day, shift } = dayShift(s);
  const sc = s.scenario === 'slice' ? 'SLICE' : 'FULL';
  const L: string[] = [line];
  L.push(row(`SHACKLETON RIDGE OUTPOST (${sc})`.padEnd(32) + `DAY ${day}/${totalTurns(s) / 2}  SHIFT ${shift}/2`.padStart(38)));
  L.push(line);
  const warn = (v: number, lim: number, low = true) => ((low ? v <= lim : v >= lim) ? ' LOW!' : '');
  L.push(row(`POWER  ${bar(s.power)} ${String(s.power).padStart(3)}%${warn(s.power, 20)}`.padEnd(36) + `OXYGEN ${bar(s.o2)} ${String(s.o2).padStart(3)}%${warn(s.o2, 25)}`));
  L.push(row(`DOSE   ${bar(s.dose)} ${String(s.dose).padStart(3)}% of plan${s.dose >= 75 ? ' HIGH!' : ''}`.padEnd(36) + `SCIENCE ${s.science}`));
  const extras = [
    `Dust ${'*'.repeat(s.dust) || 'none'}`,
    `Shelter lvl ${s.shelterLevel}`,
    `Ice samples ${s.iceSamples}`,
    `Next trip ice odds ${Math.round(iceChance(s) * 100)}%`,
  ];
  L.push(row(extras.join(' | ')));
  if (s.faults.panel || s.faults.scrubber || slotsAvailable(s) < 2) {
    L.push(row([s.faults.panel && 'FAULT: panel', s.faults.scrubber && 'FAULT: air scrubber', slotsAvailable(s) < 2 && 'CREW TIRED (1 job)'].filter(Boolean).join(' | ')));
  }
  L.push(line);
  L.push(row('SUNWATCH  (our outpost console - fiction)'));
  const sun = e.eclipse === 'long' ? 'DARK (long shadow)' : e.eclipse === 'short' ? 'DARK (short eclipse)' : 'UP, on the ridge';
  const alert = stormActive(e) ? (e.storm === 'strong' ? 'PARTICLE STORM - STRONG' : 'PARTICLE STORM - building') : e.storm === 'warning' && e.link ? 'FLARE ALERT' : 'none';
  L.push(row(` Sun: ${sun}`.padEnd(32) + `Earth link: ${e.link ? 'OK' : 'DOWN'}`));
  L.push(row(` Alerts: ${alert}`));
  L.push(line);
  L.push(row('MISSION CONTROL:'));
  for (const m of missionControl(s)) for (const w of wrap(m, W - 6)) L.push(row('  ' + w));
  L.push(line);
  L.push(row(`CHOOSE JOBS (crew time: ${slotsAvailable(s)} slot${slotsAvailable(s) > 1 ? 's' : ''})`));
  menu(s).forEach((m, i) => {
    const d = m.def;
    const cost: string[] = [];
    const p = d.id === 'air' ? airPowerCost(s) : d.power;
    if (p) cost.push(`pwr ${p > 0 ? '+' : ''}${p}`);
    if (d.o2) cost.push(`O2 ${d.o2 > 0 ? '+' : ''}${d.o2}`);
    if (d.dose) cost.push(`dose +${d.dose}${d.outside ? ' (out)' : ''}`);
    else if (d.outside) cost.push('outside');
    if (d.slots === 2) cost.push('uses 2');
    const label = `[${i + 1}] ${d.label}`;
    L.push(row((label.padEnd(31) + (m.blocked ? `(${m.blocked})` : cost.join(', '))).slice(0, W - 4)));
  });
  L.push(line);
  return L.join('\n');
}

function card(s: State): string {
  const rc = reportCard(s);
  const st = (n: number) => '*'.repeat(n) + '.'.repeat(3 - n);
  const head = s.ended?.reason === 'complete' ? 'MISSION COMPLETE' : s.ended?.reason === 'oxygen' ? 'MISSION PAUSED: crew called home safely (oxygen ran low)' : 'MISSION PAUSED: crew called home safely (dose plan used up)';
  const ev = s.evidence;
  const tips: string[] = [];
  if (ev.powerHitZero) tips.push('Charge batteries and clean dust BEFORE the long shadow.');
  if (ev.outsideStormShifts) tips.push('Stay inside or shelter when particles arrive.');
  if (!ev.stormMeasures) tips.push('Measuring radiation during a storm is great science.');
  if (!ev.iceFound && ev.trips) tips.push('Scout with the drone first to raise your ice odds.');
  if (!ev.trips) tips.push('The dark crater is where the big science is. Plan a trip when the sky is calm.');
  if (!ev.eclipseLogged) tips.push('Logging the dark stretch is rare evidence for the report card.');
  return [
    line, row(head), line,
    row('SITE REPORT CARD - Shackleton Connecting Ridge'),
    row(`  Lighting   ${st(rc.lighting)}  sun logs ${ev.sunLogs}, eclipse logged ${ev.eclipseLogged ? 'yes' : 'no'}, power ${ev.powerHitZero ? 'ran out' : 'never ran out'}`),
    row(`  Radiation  ${st(rc.radiation)}  measurements ${ev.measures} (${ev.stormMeasures} during storm)`),
    row(`  Shelter    ${st(rc.shelter)}  final dose ${s.dose}% of plan, outside in storms: ${ev.outsideStormShifts}x`),
    row(`  Ice        ${st(rc.ice)}  trips ${ev.trips}, ice found ${ev.iceFound}, spots ruled out ${ev.mappedEmpty}`),
    row(`  Science ${s.science}   Stars ${rc.lighting + rc.radiation + rc.shelter + rc.ice}/12`),
    line, row('NEXT TIME, TRY:'), ...tips.slice(0, 3).flatMap((t) => wrap('- ' + t, W - 6).map((w) => row('  ' + w))), line,
  ].join('\n');
}

function show(s: State, log: string[] = []) {
  if (log.length) console.log('WHAT HAPPENED:\n' + log.map((l) => (l.startsWith('  ') ? l : '- ' + l)).join('\n') + '\n');
  if (s.pending) {
    console.log([line, row('!! PARTICLES ARRIVING WHILE THE ROVER IS OUT !!'), row('  back   = turn back now: no sample, safe inside (pwr -20, O2 -3)'), row('  finish = finish the trip: chance of ice, but storm dose outside'), line].join('\n'));
    return;
  }
  console.log(s.ended ? card(s) : screen(s));
}

// Everything printed is also appended to .run/playlog.txt, so a playtest can be reviewed later.
const LOG = new URL('../../.run/playlog.txt', import.meta.url);
const print = console.log;
console.log = (...a: unknown[]) => { print(...a); mkdirSync(new URL('../../.run/', import.meta.url), { recursive: true }); appendFileSync(LOG, a.join(' ') + '\n'); };

function handle(cmd: string | undefined, args: string[]) {
  if (cmd === 'new') {
    const s = newGame((args[0] as ScenarioId) ?? 'full', Number(args[1] ?? Math.floor(Math.random() * 1e6)));
    console.log(`\n===== NEW GAME: ${s.scenario}, seed ${s.seed} =====`);
    save(s); show(s);
  } else if (cmd === 'note') {
    console.log(`>>> PLAYTEST NOTE: ${args.join(' ')}`);
  } else if (!existsSync(FILE)) {
    console.log('No game yet. Type: new full   (or: new slice)');
  } else if (cmd === 'act') {
    const s = load();
    if (s.pending) { console.log('Choose first: back or finish.'); show(s); return; }
    const m = menu(s);
    const ids = args.map((a) => m[Number(a) - 1]?.def.id).filter(Boolean) as ActionId[];
    if (!ids.length || ids.length !== args.length) { console.log('! Unknown job number.'); return; }
    const r = step(s, ids);
    const bad = r.log[0]?.startsWith('!');
    if (!bad) save(r.state);
    show(bad ? s : r.state, r.log);
  } else if (cmd === 'choose') {
    const s = load();
    if (!s.pending) { console.log('Nothing to choose right now.'); return; }
    if (args[0] !== 'back' && args[0] !== 'finish') { console.log('Type back or finish.'); return; }
    const r = step({ ...s, pending: null }, s.pending.actions, args[0] as TripChoice);
    save(r.state); show(r.state, r.log);
  } else {
    show(load());
  }
}

const HELP = `Type job numbers (e.g. "8 9", or "7" for a 2-slot job), "back"/"finish" when asked,
"note <text>" to jot playtest feedback, "show", "new full" / "new slice", "help", or "quit".`;

async function interactive() {
  const { createInterface } = await import('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '\ncommander> ' });
  print(HELP);
  if (existsSync(FILE)) handle('show', []); else handle('new', ['full']);
  rl.prompt();
  for await (const raw of rl) {
    const input = raw.trim();
    if (input) {
      appendFileSync(LOG, `> ${input}\n`); // log the command without echoing it twice
      const [w, ...rest] = input.split(/[\s,]+/);
      if (w === 'quit' || w === 'exit' || w === 'q') break;
      if (w === 'help') print(HELP);
      else if (w === 'back' || w === 'finish') handle('choose', [w]);
      else if (/^\d+$/.test(w)) handle('act', [w, ...rest]);
      else handle(w, rest);
    }
    rl.prompt();
  }
  rl.close();
  print('\nSaved. Run the same command to continue later. Your run is logged in .run/playlog.txt');
}

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || cmd === 'i') await interactive();
else handle(cmd, args);

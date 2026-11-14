// Terminal play prototype (v2, one turn = one day). State is saved in .run/state.json.
//   npm run play   = interactive: type job numbers at the prompt (recommended)
//   node --no-warnings src/cli/play.ts new [full|slice] [seed]
//   node --no-warnings src/cli/play.ts act 1 4 7 | choose back|finish | show
import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import {
  newGame, step, menu, env, stormActive, blocksToday, blocksFor, totalDays, reportCard, checklist, verdict, totalStars, scenarioOf, daysUntilLink,
  iceChance, powerCost, type State, type ActionId, type ScenarioId, type TripChoice, type Goal, type ActionDef,
} from '../engine/engine.ts';
import moon from '../config/moon.json' with { type: 'json' };
import { missionControl, emergencyHelp } from '../content/lines.ts';

const FILE = new URL('../../.run/state.json', import.meta.url);
const load = (): State => JSON.parse(readFileSync(FILE, 'utf8'));
const save = (s: State) => { mkdirSync(new URL('../../.run/', import.meta.url), { recursive: true }); writeFileSync(FILE, JSON.stringify(s)); };

const W = 80;
const line = '+' + '-'.repeat(W - 2) + '+';
const row = (t = '') => '| ' + t.padEnd(W - 4).slice(0, W - 4) + ' |';
const bar = (v: number) => '[' + '#'.repeat(Math.round(v / 10)) + '-'.repeat(10 - Math.round(v / 10)) + ']';
const stars = (n: number) => '*'.repeat(n) + '.'.repeat(3 - n);
function wrap(t: string, width = W - 6): string[] {
  const out: string[] = []; let cur = '';
  for (const w of t.split(' ')) { if ((cur + ' ' + w).trim().length > width) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) out.push(cur);
  return out;
}

/** What a job does for you, in a few words. */
function effect(s: State, d: ActionDef): string {
  switch (d.id) {
    case 'logsun': return 'LIGHT';
    case 'measure': return 'RADIATION';
    case 'scout': return 'ICE: odds +25%';
    case 'rover': return `ICE: ${Math.round(iceChance(s) * 100)}% chance`;
    case 'regolith': return 'SHELTER: +1 level';
    case 'clean': return 'solar back to full';
    case 'air': return 'oxygen +30';
    case 'repair': return 'fixes a fault';
    case 'powersave': return `saves ${moon.perDay.upkeepPower - moon.perDay.powerSaveUpkeep} power`;
    case 'shelter': return 'SHELTER: less dose';
    case 'rest': return 'stamina +20';
    case 'call': return 'storm forecast';
    default: return '';
  }
}
function costs(s: State, d: ActionDef): string {
  const c: string[] = [];
  const p = powerCost(s, d.id);
  if (p < 0) c.push(`pwr${p}`);
  if (d.o2 < 0) c.push(`O2${d.o2}`);
  if (d.dose) c.push(`dose+${d.dose}`);
  if (d.outside) c.push('OUT');
  if (d.id === 'powersave') c.push('stamina-10');
  return c.join(' ') || '-';
}

function screen(s: State): string {
  const e = env(s);
  const L: string[] = [line];
  L.push(row('SHACKLETON RIDGE OUTPOST'.padEnd(54) + `DAY ${s.turn + 1} / ${totalDays(s)}`.padStart(22)));
  L.push(line);
  const flag = (bad: boolean, w: string) => (bad ? ' ' + w : '');
  L.push(row(`BASE  POWER   ${bar(s.power)} ${String(s.power).padStart(3)}%${flag(s.power <= 25, 'LOW!')}`.padEnd(40) + `OXYGEN ${bar(s.o2)} ${String(s.o2).padStart(3)}%${flag(s.o2 <= 25, 'LOW!')}`));
  L.push(row(`CREW  STAMINA ${bar(s.stamina)} ${String(s.stamina).padStart(3)}%${flag(s.stamina < 50, 'TIRED')}`.padEnd(40) + `DOSE   ${bar(s.dose)} ${String(s.dose).padStart(3)}% of plan${flag(s.dose >= 75, 'HIGH!')}`));
  const bt = blocksToday(s);
  L.push(row(`CREW TIME TODAY: ${'#'.repeat(bt)}${'.'.repeat(8 - bt)} ${bt}   (stamina 50%+ = 8, 25-49% = 6, under 25% = 4)`));
  const faults = [s.faults.panel && 'solar panel jammed', s.faults.scrubber && 'air scrubber clogged'].filter(Boolean).join(', ') || 'none';
  L.push(row(`Dust ${s.dust}/3   Shelter level ${s.shelterLevel}/3   Ice samples ${s.iceSamples}   Faults: ${faults}`));
  L.push(line);
  const v = verdict(s); const w = scenarioOf(s).win; const cl = checklist(s);
  L.push(row(`MISSION: prove this ridge can host a Moon base.            Stars: ${v.stars}/12`));
  L.push(row(`  Main goals: ${v.mainDone}/4 -> SITE PROMISING.  Bonus -> APPROVED at ${w.minStars}, GOLD at ${w.gold}.`));
  const box = (c: { done: boolean; main: boolean; label: string }) => `${c.main ? '' : '+'}[${c.done ? 'x' : ' '}] ${c.label}`;
  for (const g of ['LIGHT', 'RADIATION', 'SHELTER', 'ICE'] as Goal[]) L.push(row(`  ${g.padEnd(10)} ${cl[g].map(box).join(' ')}`));
  L.push(line);
  const sun = e.eclipse === 'long' ? 'DARK (long shadow)' : e.eclipse === 'short' ? 'HALF (short eclipse)' : 'UP';
  const alert = stormActive(e) ? (e.storm === 'strong' ? 'PARTICLE STORM: STRONG' : 'PARTICLE STORM: building') : e.storm === 'warning' && e.link ? 'FLARE ALERT' : 'none';
  L.push(row(`SUNWATCH (our console, fiction)   Alert: ${alert}`));
  L.push(row(`  Sun: ${sun}   Earth link: ${e.link ? 'OK' : `DOWN (Earth below the hills${daysUntilLink(s) ? `, back in ${daysUntilLink(s)} day(s)` : ''})`}`));
  L.push(line);
  if (s.emergency) { for (const m of emergencyHelp(s)) wrap(m.trim(), W - 12).forEach((w, i) => L.push(row((m.startsWith('  ') ? (i ? '     ' : '  ') : '') + w))); L.push(line); }
  L.push(row('MISSION CONTROL:'));
  for (const m of missionControl(s)) for (const w of wrap(m)) L.push(row('  ' + w));
  L.push(line);
  L.push(row(`PLAN THE DAY: type job numbers, e.g. 1 3 4  (crew time ${bt}, unused = rest)`));
  L.push(row('     job                   time  costs                  gives'));
  let n = 0;
  const m = menu(s);
  for (const g of moon.groups) {
    L.push(row(g.title));
    for (const item of m) {
      n++;
      if (item.def.group !== g.id) continue;
      const d = item.def;
      const num = `[${m.indexOf(item) + 1}]`.padStart(4);
      const right = item.blocked ? `(blocked: ${item.blocked})` : `${costs(s, d).padEnd(22)} ${effect(s, d)}`;
      L.push(row(`${num} ${d.label.padEnd(22)} ${String(d.blocks).padStart(2)}   ${right}`));
    }
  }
  void n;
  L.push(line);
  return L.join('\n');
}

function card(s: State): string {
  const rc = reportCard(s);
  const v = verdict(s); const w = scenarioOf(s).win;
  const head = s.ended?.reason === 'oxygen' ? 'MISSION PAUSED: crew called home safely (oxygen ran low). Site not proven yet.'
    : s.ended?.reason === 'dose' ? 'MISSION PAUSED: crew called home safely (dose plan used up). Site not proven yet.'
    : v.tier === 'gold' ? '*** SITE APPROVED - GOLD! *** Every question answered with full evidence.'
    : v.tier === 'approved' ? '*** SITE APPROVED! *** NASA has strong evidence to build here.'
    : v.tier === 'promising' ? `SITE PROMISING! All 4 main goals done. ${w.minStars - v.stars} more bonus star(s) for APPROVED.`
    : `SITE NOT PROVEN YET: no main evidence on ${v.missingMain.join(', ')}.`;
  const ev = s.evidence;
  const tips: string[] = [];
  if (ev.powerHitZero) tips.push('Fill the batteries and clean dust BEFORE the long shadow. Power-saving mode stretches them.');
  if (ev.outsideStormBlocks) tips.push('Keep astronauts inside when particles arrive.');
  if (!ev.stormMeasures) tips.push('Measuring radiation during a storm is the best radiation evidence.');
  if (!ev.scouts) tips.push('Map the crater with the hop-drone: it is ICE evidence and raises your odds.');
  if (!ev.iceFound && ev.trips) tips.push('Scout with the drone before a rover trip to raise your ice odds.');
  if (!ev.trips) tips.push('The dark crater is where the ice might be. Plan a trip on a calm, sunny day.');
  if (!ev.eclipseLogged) tips.push('Logging the ridge while it is dark is rare evidence.');
  return [
    line, row(head), line,
    row('SITE REPORT CARD: Shackleton Connecting Ridge'),
    row(`  LIGHT      ${stars(rc.LIGHT)}  sun logs ${ev.sunLogs}, shadow logged ${ev.eclipseLogged ? 'yes' : 'no'}, power ${ev.powerHitZero ? 'ran out' : 'never ran out'}`),
    row(`  RADIATION  ${stars(rc.RADIATION)}  measurements ${ev.measures} (${ev.stormMeasures} during a storm)`),
    row(`  SHELTER    ${stars(rc.SHELTER)}  shelter level ${s.shelterLevel}/3, final dose ${s.dose}% of plan`),
    row(`  ICE        ${stars(rc.ICE)}  drone maps ${ev.scouts}, rover samples ${ev.trips}, ice found ${ev.iceFound}, dry spots ${ev.mappedEmpty}`),
    row(`  MAIN ${v.mainDone}/4   BONUS ${v.bonus}/8   TOTAL ${v.stars}/12   (promising: 4 main, approved: ${w.minStars}, gold: ${w.gold})`),
    line, row('NEXT TIME, TRY:'), ...tips.slice(0, 3).flatMap((t) => wrap('- ' + t).map((w) => row('  ' + w))), line,
  ].join('\n');
}

function show(s: State, log: string[] = []) {
  if (log.length) console.log('\nWHAT HAPPENED:\n' + log.map((l) => (l.startsWith('  ') ? l : '- ' + l)).join('\n') + '\n');
  if (s.pending) {
    console.log([line, row('!! PARTICLES ARRIVING WHILE THE ROVER IS OUT !!'), row(`  back   = turn back now: no sample, safe inside (pwr ${moon.trip.backPower}, O2 ${moon.trip.backO2})`), row('  finish = finish the trip: chance of ice, but extra storm dose outside'), line].join('\n'));
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
    const s = newGame((args[0] as ScenarioId) ?? 'week', Number(args[1] ?? Math.floor(Math.random() * 1e6)));
    console.log(`\n===== NEW GAME: ${s.scenario}, seed ${s.seed} =====`);
    save(s); show(s);
  } else if (cmd === 'note') {
    console.log(`>>> PLAYTEST NOTE: ${args.join(' ')}`);
  } else if (!existsSync(FILE)) {
    console.log('No game yet. Type: new week   (or: new full for 14 days)');
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

const HELP = `Type the job numbers for today in one line (e.g. "1 3 7"). Their crew time must fit today's total.
Type "back"/"finish" when asked, "note <text>" to jot playtest feedback, "show", "new week" (7 days) / "new full" (14 days), "help", or "quit".`;

async function interactive() {
  const { createInterface } = await import('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '\ncommander> ' });
  print(HELP);
  if (existsSync(FILE)) handle('show', []); else handle('new', ['week']);
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

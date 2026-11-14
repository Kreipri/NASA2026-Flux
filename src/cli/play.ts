// Terminal play prototype (v2, one turn = one day). State is saved in .run/state.json.
//   npm run play   = interactive: type job numbers at the prompt (recommended)
//   node --no-warnings src/cli/play.ts new [full|slice] [seed]
//   node --no-warnings src/cli/play.ts act 1 4 7 | choose back|finish | show
import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import {
  newGame, step, menu, env, stormActive, blocksToday, blocksFor, totalDays, reportCard, checklist, verdict, totalStars, scenarioOf, daysUntilLink, forecastLines,
  iceChance, powerCost, actionDef, validate, mealEffects, type State, type ActionId, type ScenarioId, type TripChoice, type Goal, type ActionDef, type MealMode,
} from '../engine/engine.ts';
import moon from '../config/moon.json' with { type: 'json' };
import { missionControl, emergencyHelp } from '../content/lines.ts';

const FILE = new URL('../../.run/state.json', import.meta.url);
const load = (): State => {
  const s = JSON.parse(readFileSync(FILE, 'utf8')) as State;
  // Older saved runs predate the food meter.
  if (typeof s.food !== 'number') s.food = 100;
  return s;
};
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
  if (d.blocks >= 4 && !d.repeatable) c.push('ONCE/DAY');
  return c.join(' ') || '-';
}

function environmentBrief(s: State): string[] {
  const e = env(s);
  const sun = e.eclipse === 'long' ? 'LONG SHADOW' : e.eclipse === 'short' ? 'SHORT ECLIPSE' : 'BRIGHT RIDGE';
  const weather = e.storm === 'strong' ? 'STORM PEAK' : e.storm === 'rising' ? 'STORM BUILDING' : e.storm === 'warning' ? 'FLARE ALERT' : 'QUIET SUN';
  const place = e.sun === 'dark' ? 'RIDGE DARK / CRATER ALWAYS DARK AND COLD' : 'RIDGE LIT / CRATER ALWAYS DARK AND COLD';
  const link = e.link ? 'VISIBLE' : `BELOW HORIZON${daysUntilLink(s) ? `, back in ${daysUntilLink(s)} day(s)` : ''}`;
  return [
    'OPERATING PICTURE (read this before choosing a job):',
    `  LIGHT: ${sun} — ${e.sun === 'dark' ? 'panels make no solar power today' : 'light can charge the batteries'}`,
    `  SPACE WEATHER: ${weather} — ${stormActive(e) ? 'particles can raise radiation dose' : 'the Sun is calm for now'}`,
    `  PLACE: ${place}`,
    `  EARTH LINK: ${link} — ${e.link ? 'Mission Control can send a forecast' : 'the onboard alarm is the backup'}`,
    `  DUST: ${s.dust}/3   CREW: ${blocksToday(s)} time blocks, ${s.stamina}% stamina`,
  ];
}

function dailyScenario(s: State): string {
  const e = env(s);
  if (e.storm === 'strong') return 'STORM PEAK: keep the crew inside or shelter during the worst particles.';
  if (e.storm === 'rising') return 'STORM BUILDING: gather evidence carefully; outside work is risky.';
  if (e.storm === 'warning') return 'FLARE ALERT: particles may arrive tomorrow; prepare the base.';
  if (e.eclipse === 'long') return 'LONG SHADOW: save battery power because the panels cannot charge.';
  if (e.eclipse === 'short') return 'SHORT ECLIPSE: half-day sunlight means less power than usual.';
  if (!e.link) return 'EARTH LINK DOWN: use the onboard alarm and manage without a new forecast.';
  if (s.dust >= 2) return 'DUSTY PANELS: clean the solar panels or lose charging power.';
  return 'BRIGHT RIDGE: use the sunlight to build evidence and prepare for harder days.';
}

function dailyTask(s: State): string {
  const e = env(s);
  if (e.storm === 'strong') return 'SHELTER DURING THE STORM PEAK';
  if (e.storm === 'rising' || e.storm === 'warning') return 'PREPARE THE BASE FOR THE STORM';
  if (e.eclipse === 'long') return 'SAVE POWER FOR THE LONG SHADOW';
  if (e.eclipse === 'short') return 'LOG THE SHORT ECLIPSE';
  if (!e.link) return 'MANAGE THE BASE WITHOUT EARTH LINK';
  if (s.dust >= 2) return 'CLEAN THE DUSTY SOLAR PANELS';
  return 'COLLECT EVIDENCE FOR THE SITE REPORT CARD';
}

function taskResult(s: State, id: ActionId): string[] {
  switch (id) {
    case 'logsun': return ['TASK RESULT: sunlight and shadow data recorded for the site report card.'];
    case 'measure': return ['TASK RESULT: radiation measurement recorded.', stormActive(env(s)) ? 'This measurement counts as storm evidence.' : 'A quiet-day measurement gives a baseline.'];
    case 'scout': return [`TASK RESULT: hop-drone map complete. The next rover trip has a ${Math.round(Math.min(0.8, iceChance(s) + 0.25) * 100)}% ice chance.`];
    case 'rover': return ['TASK RESULT: rover dispatched to the dark crater. Its sample result will be revealed when the day ends.'];
    case 'regolith': return [`TASK RESULT: shelter construction assigned. It will become level ${Math.min(3, s.shelterLevel + 1)} when the day resolves.`];
    case 'clean': return ['TASK RESULT: crew is cleaning the panels. Solar charging will improve when the day resolves.'];
    case 'air': return ['TASK RESULT: air system work assigned. Oxygen will increase when the day resolves.'];
    case 'repair': return ['TASK RESULT: repair crew assigned to the base fault.'];
    case 'powersave': return ['TASK RESULT: the base will use less power today, but the crew will get colder.'];
    case 'shelter': return ['TASK RESULT: the crew will spend the day in the strongest shelter during the storm peak.'];
    case 'rest': return ['TASK RESULT: rest time assigned. The crew will recover stamina when the day resolves.', 'Rest does not refill today\'s crew time or remove accumulated radiation dose.'];
    case 'call': return ['TASK RESULT: Mission Control sent the latest forecast.', ...forecastLines(s).slice(1)];
    default: return ['TASK RESULT: task added to today’s plan.'];
  }
}

function previewPlan(s: State, ids: ActionId[]): void {
  const used = ids.reduce((n, id) => n + actionDef(id).blocks, 0);
  console.log('\nBEFORE YOU COMMIT:');
  console.log(`  Plan uses ${used} of ${blocksToday(s)} crew-time blocks.`);
  for (const id of ids) {
    const d = actionDef(id);
    const p = powerCost(s, id);
    const stamina = d.outside ? -d.blocks * 6 : -d.blocks * 2;
    const gain = effect(s, d);
    const giveUp = d.blocks >= 4 ? 'uses most of the day; another big job may not fit' : 'uses time and leaves fewer resources for another job';
    console.log(`\n  ${d.label}`);
    console.log(`    WHERE: ${d.outside ? 'outside / dark crater or ridge' : 'inside the habitat'}`);
    console.log(`    EXPECTED: Power ${s.power} -> ${Math.max(0, s.power + p)}, Oxygen ${s.o2} -> ${Math.max(0, s.o2 + d.o2)}, Dose ${s.dose} -> ${Math.min(100, s.dose + d.dose)}, Stamina ${s.stamina} -> ${Math.max(0, s.stamina + stamina)}`);
    console.log(`    YOU GAIN: ${gain}`);
    console.log(`    YOU GIVE UP: ${giveUp}.`);
    if (id === 'rover') console.log(`    UNCERTAIN: ${Math.round(iceChance(s) * 100)}% chance of ice; the result is not guaranteed.`);
    if (d.outside) console.log('    RISK: OUTSIDE work can add exposure during a storm and tires the crew more.');
  }
  console.log('');
}

function projectPlan(s: State, ids: ActionId[]): State {
  const p = structuredClone(s);
  for (const id of ids) {
    const d = actionDef(id);
    p.power += powerCost(s, id);
    p.o2 += d.o2;
    p.dose += d.dose;
    p.stamina += d.outside ? -d.blocks * 6 : -d.blocks * 2;
    if (d.stamina) p.stamina += d.stamina;
    if (id === 'logsun') {
      p.evidence.sunLogs++;
      if (env(s).eclipse !== 'none') p.evidence.eclipseLogged = true;
    }
    if (id === 'measure') {
      p.evidence.measures++;
      if (stormActive(env(s))) p.evidence.stormMeasures++;
    }
    if (id === 'scout') {
      p.evidence.scouts++;
      p.scoutBonus = Math.min(0.5, p.scoutBonus + 0.25);
    }
    if (id === 'regolith') p.shelterLevel = Math.min(3, p.shelterLevel + 1);
    if (id === 'clean') p.dust = 0;
  }
  return p;
}

function screen(s: State, planned: ActionId[] = [], meal: MealMode = 'normal'): string {
  const e = env(s);
  const projected = projectPlan(s, planned);
  const L: string[] = [line];
  const plannedUsed = planned.reduce((n, id) => n + actionDef(id).blocks, 0);
  const displayPower = Math.max(0, projected.power);
  const displayO2 = Math.max(0, projected.o2);
  const displayFood = Math.max(0, projected.food);
  const displayDose = Math.min(100, projected.dose);
  const displayStamina = Math.max(0, projected.stamina);
  L.push(row('SHACKLETON RIDGE OUTPOST'.padEnd(54) + `DAY ${s.turn + 1} / ${totalDays(s)}`.padStart(22)));
  L.push(line);
  const flag = (bad: boolean, w: string) => (bad ? ' ' + w : '');
  L.push(row(`BASE  POWER   ${bar(displayPower)} ${String(displayPower).padStart(3)}%${flag(displayPower <= 25, 'LOW!')}`.padEnd(40) + `OXYGEN ${bar(displayO2)} ${String(displayO2).padStart(3)}%${flag(displayO2 <= 25, 'LOW!')}`));
  L.push(row(`CREW  STAMINA ${bar(displayStamina)} ${String(displayStamina).padStart(3)}%${flag(displayStamina < 50, 'TIRED')}`.padEnd(40) + `DOSE   ${bar(displayDose)} ${String(displayDose).padStart(3)}% of plan${flag(displayDose >= 75, 'HIGH!')}`));
  L.push(row(`FOOD  SUPPLY  ${bar(displayFood)} ${String(displayFood).padStart(3)}%${flag(displayFood <= 25, 'LOW!')}   (used by the crew each day)`));
  const bt = blocksToday(s);
  L.push(row(`CREW TIME LEFT: ${'#'.repeat(Math.max(0, bt - plannedUsed))}${'.'.repeat(8 - Math.max(0, bt - plannedUsed))} ${Math.max(0, bt - plannedUsed)} / ${bt}   (type end to resolve the day)`));
  if (planned.length) L.push(row(`PLANNED TASKS: ${planned.map((id) => actionDef(id).label).join(' + ')}`));
  L.push(row(`MEALS: ${mealEffects(meal).label} (food -${mealEffects(meal).food}, stamina ${mealEffects(meal).stamina >= 0 ? '+' : ''}${mealEffects(meal).stamina})`));
  L.push(row('  Change with: meal light | meal normal | meal full'));
  if (planned.length) L.push(row('RESOURCE VIEW: PROJECTED AFTER PLANNED TASKS; daily effects apply after END'));
  const faults = [s.faults.panel && 'solar panel jammed', s.faults.scrubber && 'air scrubber clogged'].filter(Boolean).join(', ') || 'none';
  L.push(row(`Dust ${projected.dust}/3   Shelter level ${projected.shelterLevel}/3   Ice samples ${projected.iceSamples}   Faults: ${faults}`));
  L.push(line);
  const v = verdict(projected); const w = scenarioOf(s).win; const cl = checklist(projected);
  L.push(row(`MISSION: prove this ridge can host a Moon base.            Stars: ${v.stars}/12`));
  for (const scenarioLine of wrap(`TODAY'S SCENARIO: ${dailyScenario(s)}`, W - 4)) L.push(row(scenarioLine));
  for (const taskLine of wrap(`TODAY'S MAIN TASK: ${dailyTask(s)}`, W - 4)) L.push(row(taskLine));
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
  const head = s.ended?.reason === 'oxygen' ? 'MISSION FAILED - LEVEL 1: LIFE SUPPORT. The crew came home safely because oxygen ran out.'
    : s.ended?.reason === 'dose' ? 'MISSION FAILED - LEVEL 2: RADIATION PLAN. The crew came home safely because the dose plan ran out.'
    : s.ended?.reason === 'food' ? 'MISSION FAILED - LEVEL 3: FOOD SUPPLY. The crew came home safely because food ran out.'
    : s.ended?.reason === 'complete' && v.tier === 'gold' ? '*** MISSION COMPLETE - SITE APPROVED - GOLD! *** Every question answered with full evidence.'
    : s.ended?.reason === 'complete' && v.tier === 'approved' ? '*** MISSION COMPLETE - SITE APPROVED! *** NASA has strong evidence to build here.'
    : s.ended?.reason === 'complete' && v.tier === 'promising' ? 'MISSION COMPLETE - SITE PROMISING. The crew is healthy, but more evidence is needed.'
    : s.ended?.reason === 'complete' ? 'MISSION INCOMPLETE - TIME RAN OUT. The crew is healthy, but the site was not proven.'
    : v.tier === 'gold' ? '*** SITE APPROVED - GOLD! *** Every question answered with full evidence.'
    : v.tier === 'approved' ? '*** SITE APPROVED! *** NASA has strong evidence to build here.'
    : v.tier === 'promising' ? `SITE PROMISING! All 4 main goals done. ${w.minStars - v.stars} more bonus star(s) for APPROVED.`
    : `SITE NOT PROVEN YET: no main evidence on ${v.missingMain.join(', ')}.`;
  const ev = s.evidence;
  const outcomeTier = s.ended?.reason === 'oxygen' ? 'LEVEL 1 FAILURE - OXYGEN' : s.ended?.reason === 'dose' ? 'LEVEL 2 FAILURE - RADIATION' : s.ended?.reason === 'food' ? 'LEVEL 3 FAILURE - FOOD' : s.ended?.reason === 'complete' && v.tier === 'gold' ? 'LEVEL 4 SUCCESS - GOLD' : s.ended?.reason === 'complete' && v.tier === 'approved' ? 'LEVEL 3 SUCCESS - SITE APPROVED' : s.ended?.reason === 'complete' && v.tier === 'promising' ? 'LEVEL 2 SUCCESS - SITE PROMISING' : 'LEVEL 1 - SITE NOT PROVEN';
  const tips: string[] = [];
  if (ev.powerHitZero) tips.push('Fill the batteries and clean dust BEFORE the long shadow. Power-saving mode stretches them.');
  if (ev.outsideStormBlocks) tips.push('Keep astronauts inside when particles arrive.');
  if (!ev.stormMeasures) tips.push('Measuring radiation during a storm is the best radiation evidence.');
  if (!ev.scouts) tips.push('Map the crater with the hop-drone: it is ICE evidence and raises your odds.');
  if (!ev.iceFound && ev.trips) tips.push('Scout with the drone before a rover trip to raise your ice odds.');
  if (!ev.trips) tips.push('The dark crater is where the ice might be. Plan a trip on a calm, sunny day.');
  if (!ev.eclipseLogged) tips.push('Logging the ridge while it is dark is rare evidence.');
  return [
    line, row(head), row(`OUTCOME TIER: ${outcomeTier}`), line,
    row('SITE REPORT CARD: Shackleton Connecting Ridge'),
    row(`  LIGHT      ${stars(rc.LIGHT)}  sun logs ${ev.sunLogs}, shadow logged ${ev.eclipseLogged ? 'yes' : 'no'}, power ${ev.powerHitZero ? 'ran out' : 'never ran out'}`),
    row(`  RADIATION  ${stars(rc.RADIATION)}  measurements ${ev.measures} (${ev.stormMeasures} during a storm)`),
    row(`  SHELTER    ${stars(rc.SHELTER)}  shelter level ${s.shelterLevel}/3, final dose ${s.dose}% of plan`),
    row(`  FOOD       ${s.food}% supply remaining`),
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
  } else if (cmd === 'preview') {
    const s = load();
    const m = menu(s);
    const ids = args.map((a) => m[Number(a) - 1]?.def.id).filter(Boolean) as ActionId[];
    if (!ids.length || ids.length !== args.length) { console.log('! Unknown job number.'); return; }
    console.log(environmentBrief(s).join('\n'));
    previewPlan(s, ids);
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

const HELP = `Type a job number to preview it, then type yes to add it to today's plan. You can select more jobs before the day ends.
Type "meal light|normal|full" to choose food and stamina trade-offs, "end" to resolve the day, "fast" to toggle confirmations for testing, "back"/"finish" when a rover choice is asked, "note <text>" to jot playtest feedback, "show", "new week" (7 days) / "new full" (14 days), "help", or "quit".`;

async function interactive() {
  const { createInterface } = await import('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '\ncommander> ' });
  let proposed: ActionId[] | null = null;
  let planned: ActionId[] = [];
  let confirmTasks = true;
  let meal: MealMode = 'normal';
  const resolvePlannedDay = () => {
    if (!planned.length) { print('No jobs selected. Choose a task first.'); return; }
    const s = load();
    const r = step(s, planned, undefined, meal);
    const bad = r.log[0]?.startsWith('!');
    if (!bad) save(r.state);
    show(bad ? s : r.state, r.log);
    if (!bad) planned = [];
    if (!bad && !r.state.pending) meal = 'normal';
  };
  const commitTasks = (ids: ActionId[]) => {
    const s = load();
    const combined = [...planned, ...ids];
    const error = validate(s, combined);
    if (error) { print(`! ${error}`); return; }
    planned = combined;
    const used = planned.reduce((n, id) => n + actionDef(id).blocks, 0);
    print(`Task confirmed. Today's plan uses ${used}/${blocksToday(s)} crew time.`);
    for (const id of ids) for (const message of taskResult(s, id)) print(`  ${message}`);
    print(screen(s, planned, meal));
    if (used >= blocksToday(s)) print('All crew time is assigned. Type end to finish the day.');
    else print('Choose another task, or type end when you are ready to finish the day.');
  };
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
      else if (w === 'meal') {
        const selected = rest[0] as MealMode;
        if (!['light', 'normal', 'full'].includes(selected)) print('Choose a meal: meal light, meal normal, or meal full.');
        else { meal = selected; print(`Meal plan set to ${mealEffects(meal).label}: food -${mealEffects(meal).food}, stamina ${mealEffects(meal).stamina >= 0 ? '+' : ''}${mealEffects(meal).stamina}.`); print(screen(load(), planned, meal)); }
      }
      else if (w === 'fast') { confirmTasks = !confirmTasks; print(`Fast testing mode ${confirmTasks ? 'OFF' : 'ON'}: ${confirmTasks ? 'type yes after previews' : 'job numbers commit immediately'}.`); }
      else if (w === 'new') { proposed = null; planned = []; meal = 'normal'; handle('new', rest); }
      else if ((w === 'yes' || w === 'y') && proposed) {
        commitTasks(proposed);
        proposed = null;
      }
      else if (w === 'no' || w === 'n') { proposed = null; print('Plan cancelled.'); }
      else if (w === 'end' || w === 'finishday') resolvePlannedDay();
      else if (w === 'back' || w === 'finish') {
        const current = load();
        if (current.pending) {
          const r = step({ ...current, pending: null }, current.pending.actions, w as TripChoice, meal);
          save(r.state); show(r.state, r.log);
          if (!r.state.pending) meal = 'normal';
        } else handle('choose', [w]);
      }
      else if (/^\d+$/.test(w)) {
        const s = load();
        const m = menu(s);
        const ids = [w, ...rest].map((a) => m[Number(a) - 1]?.def.id).filter(Boolean) as ActionId[];
        const combined = [...planned, ...ids];
        const error = ids.length !== [w, ...rest].length ? 'Unknown job number.' : validate(s, combined);
        if (error) print(`! ${error}`);
        else if (confirmTasks) { proposed = ids; print(environmentBrief(s).join('\n')); print(`TODAY'S SCENARIO: ${dailyScenario(s)}`); previewPlan(s, combined); print('Commit these task(s) to today? type yes or no.'); }
        else commitTasks(ids);
      }
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

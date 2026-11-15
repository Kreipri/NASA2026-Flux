import { newGame, env, actionDef, checklist, totalStars, verdict, totalDays, stormActive } from '../engine/engine.ts';
import { createMission, doJob, choose, endWeek, nextWeek, skipToWeek2, previewJob, jobPreview, jobStatus, jobsDone, timeLeft, environmentTitle, alertCard, readSaved } from './model.js';

const SAVE_KEY = 'lunar-ridge.browser.v2';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const sign = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;
const LABELS = { air:'Run the air system', rest:'Rest and exercise', logsun:'Check the sunlight', measure:'Check radiation', scout:'Fly the hop-drone', rover:'Drive to the dark crater', regolith:'Cover the shelter with Moon soil', clean:'Clean the solar panels', repair:'Fix what’s broken', shelter:'Take shelter' };
const jobName = id => LABELS[id] || actionDef(id).label;
const reason = t => t ? t[0].toUpperCase() + t.slice(1) + (/[.!]$/.test(t) ? '' : '.') : '';
// Three kinds of job: evidence for the report card, keeping the base running, looking after the crew.
const CATS = {
  mission:{ name:'Mission', icon:'star', blurb:'Evidence for your report card.', jobs:['logsun','measure','scout','rover','regolith'], place:'rover' },
  base:{ name:'Base', icon:'wrench', blurb:'Keep power and air healthy.', jobs:['clean','air','repair'], place:'solar' },
  crew:{ name:'Crew', icon:'rest', blurb:'Look after the astronauts.', jobs:['rest','shelter'], place:'hab' }
};
const PLACES = { hab:{ name:'Crew home', tab:'Home', cat:'crew' }, solar:{ name:'Solar panels', tab:'Panels', cat:'base' }, shelter:{ name:'Storm shelter', tab:'Shelter', cat:'crew' }, rover:{ name:'Rover', tab:'Rover', cat:'mission' } };
const HELP = { power:['Power','Runs the base and its machines. Sunlight charges the batteries. Keep power high.'], o2:['Air','Air keeps the crew breathing. The air system uses power to add air. Keep air high.'], dose:['Radiation','This adds up the radiation the crew receives. Keep it low. Rest cannot remove it. These are game points, not a NASA safety limit.'], stamina:['Crew energy','How rested your crew feels. Outside jobs tire them more. Rest and unused crew time help. A tired crew has fewer time blocks next week.'] };
const QUICKHELP = { power:'Runs the base. Sunlight charges it. Keep it high.', o2:'Keeps the crew breathing. Keep it high.', dose:'Adds up the radiation the crew gets. Keep it low. Game points, not a NASA limit.', stamina:'How rested the crew is. A tired crew gets less time next week.' };
const GOALS = { LIGHT:'Light', RADIATION:'Radiation', SHELTER:'Shelter', ICE:'Ice' };
const EFFECTS = { logsun:'Evidence about light and shadow.', measure:'A radiation reading for the report card.', scout:'A map that improves the next rover’s ice chance.', rover:'A crater survey. A dry sample still counts as evidence.', regolith:'A thick blanket of Moon soil over the shelter, so storm particles are blocked better.', clean:'Dust removed, so the panels can charge better.', air:'More air for the crew.', repair:'One broken base system fixed.', shelter:'The crew stays inside and gets no storm-particle dose.', rest:'A chance for the crew to recover.' };
// What each job does, why it matters, and a tip: concrete, in kid words, tied to the report card and the meters.
const INFO = {
  logsun:{ does:'Write down how bright the ridge is and how the shadows move.', why:'Fills in <b>Light</b> on your report card. Logging during the long shadow earns a bonus star.', tip:'Log it in two different weeks. Do one in the long shadow too, when the Sun can’t charge the panels.' },
  measure:{ does:'Read the radiation sensor and save the number.', why:'Fills in <b>Radiation</b> on your report card. A reading during a storm is the best evidence.', tip:'Wait for a storm warning, then measure. Storm readings count the most.' },
  scout:{ does:'Fly the drone over the dark crater to map it.', why:'A map makes your next rover trip more likely to find ice.', tip:'Fly the drone first. Then drive the rover when there is no storm.' },
  rover:{ does:'Drive the rover into the dark crater and take a sample.', why:'Fills in <b>Ice</b> on your report card. Even a dry spot is useful evidence.', tip:'It is far and cold, so it costs a lot. Fly the drone first, and go when it is calm.' },
  regolith:{ does:'Cover the shelter with Moon soil, like a thick blanket.', why:'Fills in <b>Shelter</b> on your report card. More soil means more protection.', tip:'Do it before a storm comes. It is outside work, so it tires the crew.' },
  clean:{ does:'Wipe the dust off the solar panels.', why:'Dusty panels make less power. Clean ones charge the batteries best.', tip:'Check the dust level in the conditions card, top left. Clean when it is above 0.' },
  air:{ does:'Run the machine that makes air from water.', why:'Air keeps the crew breathing. If the air runs out, the mission ends.', tip:'Top up before the air gets low. The machine uses power.' },
  repair:{ does:'Fix a stuck solar panel or a clogged air filter.', why:'Broken parts make your power or your air worse.', tip:'Only needed when something is broken. The conditions card tells you what.' },
  rest:{ does:'The crew rests and exercises.', why:'Brings crew energy back. A tired crew gets less time next week.', tip:'Rest when energy is low. Time you do not use also helps them recover.' },
  shelter:{ does:'The whole crew waits in the safest room.', why:'If everyone stays inside, storm particles cannot reach them. It also fills in <b>Shelter</b> on your report card.', tip:'When the radiation alarm sounds, choose shelter and do not send anyone outside.' },
};
// One short line per job, shown on the card so the player does not have to open a job to learn what it is.
const SHORTDESC = { logsun:'Record the sunlight and shadows.', measure:'Read the radiation sensor.', scout:'Map the dark crater with the drone.', rover:'Collect a sample from the dark crater.', regolith:'Cover the shelter with Moon soil.', clean:'Wipe the dust off the panels.', air:'Make fresh air for the crew.', repair:'Fix a broken panel or air filter.', rest:'Let the crew rest and recover.', shelter:'Wait out a storm inside the safest room.' };
const RESULT_FLAVOR = { logsun:'A new entry in the mission notebook! Your crew saved a record of the ridge’s light and shadows.', measure:'Sensor checked, reading saved. Your crew has more evidence about radiation at this site.', scout:'The drone is back. Its new map will help the crew plan the next rover trip.', rover:'The rover crew is back at base. Here is what happened on the trip.', regolith:'Moon soil now covers the shelter like a thick blanket. It will block more storm particles.', clean:'The crew brushed the panels clear. More sunlight can now reach the solar cells.', air:'The air machine has finished its run. Fresh oxygen is ready for the crew to breathe.', repair:'Tools packed away. The crew has finished work on a broken base system.', rest:'Exercise done, boots off. The crew has had time to recover for the jobs ahead.', shelter:'The crew is inside the safest room. If they stay inside, the storm gives them no storm-particle dose.' };
const ASKS = { LIGHT:'Check the sunlight on the ridge.', RADIATION:'Read the radiation sensor during a storm, then choose shelter and keep everyone inside.', ICE:'Find out if there is ice in the dark crater. Fly the hop-drone first!', SHELTER:'Cover the shelter with Moon soil before a storm. When the alarm sounds, choose shelter and stay inside.' };
const PATHS = {
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  alert:'<path d="M12 4 3 20h18z"/><path d="M12 10v5M12 18v.5"/>',
  power:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  o2:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  dose:'<g fill="currentColor" stroke="none"><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z"/><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z" transform="rotate(120 12 12)"/><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z" transform="rotate(240 12 12)"/><circle cx="12" cy="12" r="1.6"/></g>',
  stamina:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  star:'<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  dots:'<g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></g>',
  fast:'<path d="m5 6 7 6-7 6zM13 6l7 6-7 6z"/>',
  back:'<path d="m15 6-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  outside:'<circle cx="12" cy="11" r="8"/><rect x="7.5" y="8" width="9" height="6" rx="3"/><path d="M9 20h6"/>',
  transmitter:'<path d="M12 11.5V21M8 21h8M9.6 21l2.4-9.5 2.4 9.5"/><circle cx="12" cy="9.2" r="1.7" fill="currentColor"/><path d="M8.3 5.9a5.2 5.2 0 0 0 0 6.6M15.7 5.9a5.2 5.2 0 0 1 0 6.6M5.5 3.4a9 9 0 0 0 0 11.6M18.5 3.4a9 9 0 0 1 0 11.6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/>',
  down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m6 15 6-6 6 6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  half:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>',
  rest:'<path d="M17 14a6 6 0 0 1-8-8 7 7 0 1 0 8 8z"/><path d="M15 3h4l-4 4h4"/>',
  battery:'<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
  radio:'<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19a10 10 0 0 1 0-14"/>',
  clean:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17v4M17 19h4"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  mountain:'<path d="m3 20 6-11 4 7 3-4 5 8z"/>',
  gauge:'<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-5"/>',
  drone:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><rect x="9" y="9" width="6" height="6" rx="1.5"/><path d="m7 7 2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"/>',
  rover:'<path d="M3 14v-3l3-3h8l3 3h4v3z"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/>',
  ice:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v5h-5"/>',
  home:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  bug:'<path d="M8 8h8v8a4 4 0 0 1-8 0z"/><path d="M12 8V4M4 12h4M16 12h4M5 6l3 3M19 6l-3 3"/>',
};
const svg = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;
const SHORT = { power:'Power', o2:'Air', dose:'Radiation', stamina:'Energy' };
// Icon + soft tile colour per job and goal, so cards read as "things to do", not menu buttons.
const JOBICON = { air:['o2','#bfeeff'], rest:['rest','#ffd6df'], repair:['wrench','#ffe3a8'], clean:['clean','#c8f1e8'], logsun:['sun','#ffe9a0'], shelter:['shield','#d0dcff'], regolith:['mountain','#e6dccb'], measure:['gauge','#e3f3b5'], scout:['drone','#d4e4ff'], rover:['rover','#ffd9b8'] };
const GOALICON = { LIGHT:['sun','#ffe9a0'], RADIATION:['dose','#e3f3b5'], SHELTER:['shield','#d0dcff'], ICE:['ice','#cdeeff'] };
const tile = ([icon, bg], cls) => `<span class="${cls}" style="--bg:${bg}" aria-hidden="true">${svg(icon)}</span>`;
// Decision pop-ups: one icon and colour per kind of event, and one icon per choice, so the cards can be skimmed.
const ALERT_KIND = { dust:['clean','#ffe9a0'], storm:['dose','#ffd6df'], shadow:['half','#dcd6ff'], eclipse:['moon','#dcd6ff'], trip:['rover','#c8f1e8'], sample:['ice','#d2f0ff'] };
const CHOICE_ICON = { clean:'clean', later:'fast', shelter:'shield', continue:'outside', back:'back', finish:'rover', sample:'ice', save:'battery', carry:'power' };
// Reuse DOM nodes that stay the same so CSS transitions can run (bars, tabs, dropdowns). Only changed nodes are replaced.
function morphKids(a, b) {
  const ac = [...a.childNodes], bc = [...b.childNodes];
  bc.forEach((n, i) => ac[i] ? morph(ac[i], n) : a.append(n));
  ac.slice(bc.length).forEach(n => n.remove());
}
function morph(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b); return; }
  if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
  if (a.nodeType !== 1) return;
  if (a.matches('.review-shade,[role="dialog"]') || (a.dataset.key !== undefined && a.dataset.key !== b.dataset.key)) { if (a.outerHTML !== b.outerHTML) a.replaceWith(b); return; }
  for (const at of [...a.attributes]) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
  for (const at of b.attributes) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
  morphKids(a, b);
}

// Static panels for the opening tour, built from the same icons, names and rules as the game itself.
const TOUR_COLORS = { power:'#ffd34d', o2:'#7fe3ff', dose:'#b4e05c', stamina:'#ff7b8f' };
export function tourMeters() {
  const s = newGame('weeks7', 1);
  const cells = Object.keys(SHORT).map(k => `<div class="rc" style="--meter:${TOUR_COLORS[k]}"><span class="rc-ring"><svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="17"/><circle class="arc" cx="20" cy="20" r="17" pathLength="100" style="stroke-dashoffset:${100 - s[k]}"/></svg>${svg(k)}</span><span class="rc-v">${s[k]}</span><span class="rc-n">${SHORT[k]}</span></div>`).join('');
  return `<section class="res3 hl tour-res" aria-label="The four meters">${cells}</section>`;
}
const tourRow = (icon, bg, name, sub, end = '') => `<div class="tour-row"><span class="ti" style="--bg:${bg}">${svg(icon)}</span><div><b>${name}</b><span class="s">${sub}</span></div>${end}</div>`;
export function tourKinds() {
  const sub = { mission:'Collect evidence', base:'Keep power and air healthy', crew:'Look after the astronauts' }, bg = { mission:'#ffe9a0', base:'#c8f1e8', crew:'#ffd6df' };
  return `<div class="tour-panel"><h4>3 kinds of jobs</h4>${Object.entries(CATS).map(([id, c]) => tourRow(c.icon, bg[id], c.name, sub[id])).join('')}</div>`;
}
export function tourCard() {
  const sub = { LIGHT:'Check the sunlight', RADIATION:'Check the radiation', SHELTER:'Cover the shelter with Moon soil', ICE:'Look for ice in the dark crater' };
  return `<div class="tour-panel"><h4>Your report card</h4>${Object.keys(GOALS).map(g => tourRow(GOALICON[g][0], GOALICON[g][1], GOALS[g], sub[g], '<span class="st">☆</span>')).join('')}</div>`;
}
export function mountGameplay({ hud, frame, pins, assets, updateScene, updateLayout, onHome, onEnding, debugScreens = [], onDebugScreen }) {
  let mission, storage = true, resetting = false;
  try { mission = readSaved(localStorage.getItem(SAVE_KEY)); } catch { storage = false; }
  mission ||= createMission('weeks7', Math.floor(Math.random() * 0x7fffffff));
  const ui = { active:false, view:'jobs', place:'rover', cat:'mission', open:true, job:null, goal:null, question:'jobs', resource:null, returnView:'jobs', warning:'', seen:{}, modal:null, brief:false, res:false, quick:false, toast:null };
  const toggleFullscreen = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); } catch {} };
  const btn = (action, text, cls = '') => `<button class="${cls}" data-game-action="${action}">${text}</button>`;
  function save() { if (resetting) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify(mission)); } catch { storage = false; } }
  function current() { return env(mission.state); }
  function chip(text, c = '#5fd0c8') { return `<span class="jc" style="--c:${c}">${esc(text)}</span>`; }
  // Week 1 tutorial: the real rules with a guide. The step comes from what has been done, so it survives a reload.
  const TUT = { logsun:{ n:1, cat:'mission', pick:'When can we charge the batteries? <b>Check the sunlight</b> to help the next crew plan around shadows.', result:'Sunlight is our power supply. Recording the shadows helps the next crew know when they must rely on batteries.' },
    air:{ n:2, cat:'base', pick:'The crew uses air all week. Open <b>Base</b>, then run the <b>air system</b> to refill their supply.', result:'The crew needs oxygen even while resting. This machine uses battery power to make more, so air and power must be planned together.' },
    rest:{ n:3, cat:'crew', pick:'Tired astronauts can do less work. Open <b>Crew</b>, then choose <b>Rest and exercise</b>.', result:'Rest and exercise help the crew recover. Keeping their energy up protects next week’s work time.' },
    clean:{ result:'Dust blocks sunlight. Cleaning improves charging, but outside work uses crew time, air and energy, and adds radiation.' } };
  function tutorialStep() {
    if (!mission.tutorial || !mission.week || mission.week.prompt || ui.modal || briefingDue()) return null;
    const ids = mission.week.ids, mine = ids.filter(id => TUT_ORDER.includes(id)), next = TUT_ORDER.find(id => !ids.includes(id)), t = TUT[next];
    // Look-and-learn steps: one thing glows, the child taps Got it.
    if (!mine.length && !ui.seen.meters) return { ack: 'meters', text: 'These four rings show how the base is doing: <b>Power</b>, <b>Air</b>, <b>Radiation</b> and crew <b>Energy</b>. Keep Power, Air and Energy up. Radiation only goes up, so keep it low.', hl: '.res3' };
    if (mine.length === 1 && mine[0] === 'logsun' && !ui.seen.card) return { ack: 'card', text: 'Your sunlight check counts toward the <b>report card</b>. Tap it any time to see your goals. Mission Control’s weekly ask leads you to the next one.', hl: '.view-tabs [data-game-action="missions"]' };
    if (!next && !ui.seen.curio) return { ack: 'curio', text: 'Stuck? Tap <b>Ask Curio</b> any time. I can explain the meters, the jobs and the time blocks.', hl: '.curio-fab' };
    if (!ui.open) return { text: '<b>Open the job panel</b> to continue.', hl: '.open-curio' };
    if (ui.view !== 'jobs') return { text: 'Go <b>back to the jobs</b> to continue.', hl: '.view-tabs [data-game-action="jobs"]' };
    if (!next) return { text: 'Nice work! Now <b>end the week</b>. The Sun charges the batteries and the crew rests. Time you did not use gives the crew extra rest.', hl: '[data-game-action="end-week"]' };
    if (ui.job === next) return { job: next, text: 'This shows what the job <b>costs</b> and <b>gives</b>. Tap <b>Do this job</b>.', hl: '[data-game-action="do-job"]' };
    if (ui.job) return { job: next, text: 'Go <b>back</b> and tap the <b>glowing job</b>.', hl: '[data-game-action="back-jobs"]' };
    return { job: next, text: t.pick, hl: ui.cat === t.cat ? `[data-game-job="${next}"]` : `[data-game-cat="${t.cat}"]` };
  }
  // Seven steps: meters, sunlight, report card, air, rest, Ask Curio, end the week. Derived from what was done, so a reload resumes.
  const TUT_ORDER = ['logsun', 'air', 'rest'], TUT_STEPS = 7;
  function tutIndex() {
    const ids = mission.week.ids, mine = ids.filter(id => TUT_ORDER.includes(id));
    if (!mine.length && !ui.seen.meters) return 0;
    if (!ids.includes('logsun')) return 1;
    if (mine.length === 1 && !ui.seen.card) return 2;
    if (!ids.includes('air')) return 3;
    if (!ids.includes('rest')) return 4;
    return ui.seen.curio ? 6 : 5;
  }
  const tutNote = (text, label = 'Tutorial tip') => `<div class="tut-callout"><span class="tc-face"><img src="${assets.curio}" alt=""></span><div><small>${svg('bulb')}${label}</small><p>${text}</p></div></div>`;
  function coach() {
    const t = tutorialStep();
    if (!t) return '';
    const debug = document.documentElement.classList.contains('debug');
    const done = tutIndex(), next = ['logsun', 'air', 'rest'].find(id => !mission.week.ids.includes(id));
    const dots = Array.from({ length: TUT_STEPS }, (_, i) => `<i class="${i < done ? 'done' : i === done ? 'now' : ''}"></i>`).join('');
    const ACK_ICON = { meters: ['info', '#dff3ff'], card: ['star', '#fff0c2'], curio: ['bulb', '#e8e4ff'] };
    const what = t.ack ? tile(ACK_ICON[t.ack], 'ch-ic') : next ? tile(JOBICON[next] || ['wrench', '#e8e4ff'], 'ch-ic') : tile(['fast', '#ffe3a8'], 'ch-ic');
    return `<aside class="coach" role="status" aria-label="Tutorial, step ${done + 1} of ${TUT_STEPS}"><header class="coach-head"><span class="face"><img src="${assets.curio}" alt=""></span><div class="ch-t"><small>Tutorial · week 1</small><span class="ch-step">Step ${done + 1} of ${TUT_STEPS}</span></div><span class="dots" aria-hidden="true">${dots}</span></header><div class="coach-body">${what}<p>${t.text}</p></div>${t.ack ? btn('tut-ack', 'Got it', 'coach-ack') : ''}${debug ? btn('skip-tutorial', 'Skip to week 2 (debug)', 'coach-skip') : ''}</aside>`;
  }
  const METER_COLOR = { power:'#ffd34d', o2:'#7fe3ff', dose:'#b4e05c', stamina:'#ff7b8f' };
  function resources() {
    const p = ui.job ? previewJob(mission, ui.job) : null;
    const cells = Object.keys(SHORT).map(k => {
      const name = SHORT[k], value = Math.max(0, Math.min(100, Math.round(mission.state[k]))), diff = p ? Math.round(p[k] - value) : 0;
      const status = k === 'dose' ? 'Keep low' : k === 'stamina' && value < 50 ? 'Tired crew' : value <= 25 ? 'Low' : 'Good';
      const label = `${name}: ${value} out of 100. ${status}.${diff ? ` This job would change it by ${sign(diff)}.` : ''}`;
      const low = k !== 'dose' && value <= 25 ? ' low' : '';
      return `<div class="rc${low}" tabindex="0" data-tip="${name} · ${value} / 100" style="--meter:${METER_COLOR[k]}" aria-label="${label}"><span class="rc-ring" role="meter" aria-label="${name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="17"/><circle class="arc" cx="20" cy="20" r="17" pathLength="100" style="stroke-dashoffset:${100 - value}"/></svg>${svg(k)}</span><span class="rc-v">${value}</span>${diff ? `<em class="rc-d">${sign(diff)}</em>` : ''}</div>`;
    }).join('');
    return `<section class="res3" aria-label="Base and crew meters">${cells}<button class="res-info" data-game-action="meters-info" aria-label="What do the meters mean?" title="What do the meters mean?">${svg('info')}</button></section>`;
  }
  function topbar() {
    const s = mission.state, e = current(), wk = Math.min(s.turn + 1, 7);
    const on = v => ui.open && (Array.isArray(v) ? v : [v]).includes(ui.view) ? 'true' : 'false';
    const tab = (action, views, icon, text, badge = '') => `<button data-game-action="${action}" data-tip="${text}" aria-pressed="${on(views)}" aria-label="${text}${badge ? ' ' + badge : ''}">${svg(icon)}<span class="lbl">${text}</span>${badge ? `<span class="vt-n">${badge}</span>` : ''}</button>`;
    return `<div class="top3"><div class="wk" role="img" aria-label="Week ${wk} of 7"><span class="wk-t">Week <b>${wk}</b><small>/7</small></span><span class="dots" aria-hidden="true">${s.timeline.map((_, i) => `<i class="${i === s.turn ? 'now' : i < s.turn ? 'past' : ''}"></i>`).join('')}</span></div><button class="chip3 radio ${e.link?'':'radio-off'}" data-game-action="radio" data-tip="Earth radio ${e.link?'on':'off'}" aria-label="Earth radio is ${e.link?'on':'off'}. Tap to learn more.">${svg('transmitter')}<span class="d"></span></button><nav class="view-tabs" aria-label="Side dock view">${tab('jobs','jobs','wrench','Jobs')}${tab('missions','missions','star','Report card',`${verdict(s).mainDone}/4`)}${tab('more',['more','calendar','sources'],'dots','More')}</nav></div>`;
  }
  function sourceBadge() {
    const e = current();
    if (!e.stormName) return btn('sources', 'Simulated game conditions', 'source-tag');
    if (e.storm==='warning') return btn('sources','NASA archive · solar flare','source-tag');
    return btn('sources', `${e.realDay ? 'NASA archive' : 'Historic storm · game profile'}: ${esc(e.stormName)}`, 'source-tag');
  }
  function askText(s, e) {
    const todo = Object.entries(checklist(s)).find(([, c]) => !c[0].done)?.[0];
    return s.emergency ? 'The batteries are empty. Let sunlight recharge the base: clean the panels or rest.' : stormActive(e) ? 'Protect the crew first. If it is safe, check the radiation: storm readings are great evidence.' : e.sun === 'dark' ? 'Stretch the batteries through the long shadow. Checking the sunlight records it.' : todo ? ASKS[todo] : 'Every main goal is done! Keep the crew safe to earn bonus stars.';
  }
  // After the Week 1 walkthrough Curio stays quiet. She speaks up once, the first time something new happens that the player has not met.
  const seenTip = id => (mission.tips || []).includes(id);
  const markTip = id => { if (!seenTip(id)) mission = { ...mission, tips: [...(mission.tips || []), id] }; };
  const ALERT_TIPS = {
    dust: 'Dust is back! Now it is your call. A Base job can clean the panels later, but until then they make less power.',
    storm: 'A radiation alarm! Radiation only goes up, and outside jobs add to it. Think about the crew first.',
    shadow: 'The Sun is hidden, so the panels make less power. Saving power now keeps the batteries from running empty.',
    eclipse: 'The Sun is hidden, so the panels make less power. Saving power now keeps the batteries from running empty.',
  };
  const alertTipId = () => { const p = mission.week?.prompt; return !mission.tutorial && p?.type === 'alert' && ALERT_TIPS[p.alert] && !seenTip('alert-' + p.alert) ? p.alert : null; };
  function weekTip() {
    if (mission.tutorial || !mission.week || mission.week.prompt || mission.recap || ui.modal || briefingDue()) return null;
    const s = mission.state, e = current();
    if (!e.link && !seenTip('earth')) return { id: 'earth', hl: '[data-game-action="radio"]', text: 'Earth is below the horizon, so Mission Control cannot send us alerts right now. I will watch the base alarm for you.' };
    if ((s.faults.panel || s.faults.scrubber) && !seenTip('fault')) return { id: 'fault', hl: '[data-game-cat="base"]', text: 'Something is broken! Open <b>Base</b> and choose the repair job to fix it.' };
    return null;
  }
  // A ring drawn over the target (so scrolling panels can never clip it) and the guide card placed beside it.
  const guide = () => tutorialStep() || weekTip();
  const tutRing = () => guide()?.hl ? '<i class="tut-ring" aria-hidden="true"></i>' : '';
  function tipPop() {
    const t = weekTip();
    if (!t) return '';
    return `<aside class="coach curio-tip" role="status" aria-label="Curio has news"><header class="coach-head"><span class="face"><img src="${assets.curio}" alt=""></span><div class="ch-t"><small>Curio · new</small></div></header><div class="coach-body"><p>${t.text}</p></div>${btn('tip-ack', 'Got it', 'coach-ack')}</aside>`;
  }
  // Each week opens with a Mission Control briefing; the player confirms it to start the week.
  function briefingDue() { return !!mission.week && !mission.recap && !mission.state.ended && mission.briefedTurn !== mission.state.turn && !mission.week.ids.length; }
  function brief() {
    const s = mission.state, e = current();
    const todo = Object.entries(checklist(s)).find(([, c]) => !c[0].done)?.[0];
    const main = askText(s, e);
    const sunIcon = e.sun==='dark' ? 'moon' : e.sun==='half' ? 'half' : 'sun';
    const broken = [s.faults.panel&&'panel joint',s.faults.scrubber&&'air system'].filter(Boolean);
    return `<section class="mission-brief ${ui.brief?'open':''}" aria-label="This week’s conditions"><button class="brief-toggle" data-game-action="brief" aria-expanded="${ui.brief}"><span class="brief-ic">${svg(sunIcon)}</span><span class="brief-title">${environmentTitle(s)}</span>${broken.length?`<span class="brief-warn" role="img" aria-label="Repair needed">${svg('wrench')}</span>`:''}<span class="brief-chev">${svg('down')}</span></button><div class="brief-panel" aria-hidden="${!ui.brief}"><span class="brief-speaker">${e.link?'Mission Control':'Curio · onboard update'} · this week’s ask</span><p><b>MISSION:</b> Prove this ridge can host a Moon base.</p><p><b>THIS WEEK:</b> ${main}</p><p><b>HOW TO WIN:</b> Earn at least 1 star in Light, Radiation, Shelter and Ice. Keep air and power above zero. For radiation: measure during a storm, then shelter and keep everyone inside.</p><div class="condition-row">${chip(e.sun==='dark'?'No solar charging':e.sun==='half'?'Reduced solar charging':'Sunlight charges panels')}${chip(`Dust ${s.dust}/3`)}${chip(`Shelter ${s.shelterLevel}/3`)}</div>${sourceBadge()}${broken.length?`<p class="fault-note">Repair needed: ${broken.join(' and ')}.</p>`:''}${btn('rebrief','Hear the briefing again','text-button brief-again')}</div></section>`;
  }
  function time() {
    const available = mission.week?.blocks ?? 0, used = mission.week?.used ?? 0;
    return `<div class="crew3"><b class="tn" aria-label="Crew time left: ${available-used} of ${available}">${available-used} / ${available}</b><span class="clocks" role="img" aria-label="${used} of ${available} crew time used">${Array.from({length:available},(_,i)=>`<span class="tc ${i<used?'used':''}">${svg('clock')}</span>`).join('')}</span></div>`;
  }
  // Costs and gains as icon + number (same icons as the meters). `named` adds the word, for the detail view.
  function costs(id, named = false) {
    const p = jobPreview(mission, id), j = p.job;
    const cc = (icon, value, name, aria, c, kind = '') => `<span class="cc ${kind}" style="--c:${c}" data-tip="${aria}" role="img" aria-label="${aria}">${svg(icon)}${value !== '' ? `<b>${value}</b>` : ''}${named ? `<em>${name}</em>` : ''}</span>`;
    const kind = n => n > 0 ? 'gain' : 'cost';
    return cc('clock', j.blocks, 'Time', `${j.blocks} crew time ${j.blocks===1?'block':'blocks'}`, '#5fd0c8', 'time')
      + (p.power ? cc('power', sign(p.power), 'Power', `Power ${sign(p.power)}`, '#ffd34d', kind(p.power)) : '')
      + (j.o2 ? cc('o2', sign(j.o2), 'Air', `Air ${sign(j.o2)}`, '#7fe3ff', kind(j.o2)) : '')
      + (p.stamina ? cc('stamina', sign(p.stamina), 'Energy', `Energy ${sign(p.stamina)}`, '#ff7b8f', kind(p.stamina)) : '')
      + (p.dose ? cc('dose', `+${p.dose}`, 'Radiation', `Radiation +${p.dose}`, '#b4e05c', 'cost') : '')
      + (j.outside ? cc('outside', '', 'Outside', 'Outside job', '#c9b8ff', 'out') : '');
  }
  // Jobs Curio suggests right now, with a short reason. Never suggests a job that can't be done.
  function advice() {
    const s = mission.state, ev = s.evidence, e = current(), out = [];
    const once = ['logsun','measure','scout','rover','regolith','shelter'];
    const add = (id, why) => { if (out.length < 2 && !out.some(o => o.id === id) && !jobStatus(mission, id) && !(once.includes(id) && jobsDone(mission, id) > 0)) out.push({ id, why }); };
    if (s.o2 <= 40) add('air', 'Air is getting low.');
    if (s.faults.panel || s.faults.scrubber) add('repair', 'Something is broken.');
    if (stormActive(e)) { add('shelter', 'A storm is on. Stay safe.'); if (ev.stormMeasures < 1) add('measure', 'A storm reading is great evidence.'); }
    if (s.stamina < 45) add('rest', 'The crew is tired.');
    if (s.dust > 0 && s.power <= 55) add('clean', 'Dusty panels make less power.');
    if (!out.length && ev.sunLogs < 2) add('logsun', 'Your report card needs sunlight readings.');
    if (!out.length && ev.scouts < 1) add('scout', 'Map the crater before you drive there.');
    if (!out.length && ev.scouts >= 1 && ev.trips < 1) add('rover', 'Your report card needs an ice sample.');
    if (!out.length && s.shelterLevel < 1) add('regolith', 'Moon soil on the shelter protects the crew.');
    return out;
  }
  function jobs() {
    const cat = CATS[ui.cat], recs = new Map(advice().map(a => [a.id, a.why]));
    const list = [...cat.jobs].sort((a, b) => (jobsDone(mission, a) > 0) - (jobsDone(mission, b) > 0));
    return `<div class="cat-row"><p class="cat-blurb">${cat.blurb}</p><button class="quick-toggle" data-game-action="quick" aria-pressed="${ui.quick}" title="Quick do: a + button on each job does it right away">${svg('fast')}<span>Quick do</span></button></div><div class="job-grid">${list.map(id=>{
      const blocked = jobStatus(mission,id), count = jobsDone(mission,id), goal = actionDef(id).goal, rec = recs.get(id), ic = JOBICON[id] || ['wrench','#e8e4ff'];
      const note = count ? `<span class="jd ok">${svg('check')}Done this week</span>` : blocked ? `<span class="hint">${esc(blocked)}</span>` : `<span class="jd">${SHORTDESC[id] || ''}</span>`;
      const star = goal ? `<i class="jstar" role="img" aria-label="Counts for your report card: ${GOALS[goal]}" data-tip="Report card: ${GOALS[goal]}">${svg('star')}</i>` : '';
      const curio = rec ? `<span class="jrec" role="img" aria-label="Curio suggests this: ${esc(rec)}" data-tip="Curio suggests this: ${esc(rec)}"><img src="${assets.curio}" alt=""></span>` : '';
      return `<div class="job-row ${ui.quick?'q':''}"><button class="job ${count?'done':''} ${rec?'rec':''}" data-game-job="${id}"><span class="jicon" style="--bg:${ic[1]}">${svg(ic[0])}${star}</span><span class="jn">${jobName(id)}</span>${note}<span class="jcs">${costs(id)}</span>${curio}</button>${ui.quick?`<button class="ck ${blocked?'blocked':''}" data-game-quick="${id}" title="Do it now" aria-label="Do ${jobName(id)} now">${svg(count?'check':'plus')}</button>`:''}</div>`;
    }).join('')}</div>`;
  }
  // "Right now": the live number that tells the player whether this job is a good idea.
  function jobNow(id) {
    const s = mission.state, ev = s.evidence, n = Math.round;
    const broken = [s.faults.panel && 'a solar panel', s.faults.scrubber && 'the air filter'].filter(Boolean);
    return ({
      logsun:`Logged ${Math.min(ev.sunLogs,2)} of 2 weeks so far.`,
      measure:`${ev.stormMeasures} storm ${ev.stormMeasures===1?'reading':'readings'}, ${Math.max(0,ev.measures-ev.stormMeasures)} quiet.`,
      scout:`Drone flights so far: ${ev.scouts}.`,
      rover:`Crater trips so far: ${ev.trips}. Ice chance now: ${jobPreview(mission,'rover').chance}%.`,
      regolith:`Moon-soil shield: ${s.shelterLevel} of 3 layers.`,
      clean:`Dust on the panels: ${s.dust} of 3.`,
      air:`Air now: ${n(s.o2)} of 100.`,
      repair:broken.length?`Broken: ${broken.join(' and ')}.`:'Nothing is broken right now.',
      rest:`Crew energy now: ${n(s.stamina)} of 100.`,
      shelter:stormActive(current())?'A storm is on right now.':'No storm right now.',
    })[id] || '';
  }
  // Keep the current conditions and Curio's advice readable without hovering.
  function preview() {
    const id=ui.job,p=jobPreview(mission,id),I=INFO[id]||{ does:EFFECTS[id]||'', why:'', tip:'' };
    const ice=p.chance!==null?`<span class="cc" style="--c:#cdeeff" title="Ice chance on this trip: ${p.chance}%. A game chance, not a NASA estimate." role="img" aria-label="Ice chance ${p.chance} percent">${svg('ice')}<b>${p.chance}%</b></span>`:'';
    return `<div class="jcs preview-costs">${costs(id)}${ice}</div><p class="jdoes">${I.does}</p><div class="job-explain"><section class="job-now"><h3>${svg('gauge')}Right now</h3><p>${jobNow(id)}</p></section><section class="job-tip"><h3><img src="${assets.curio}" alt="">Curio’s tip</h3><p>${I.tip}</p></section><details class="job-why"><summary>${svg('star')}Why do it?${svg('down','explain-chevron')}</summary><p>${I.why}</p></details></div>`;
  }

  function missions() {
    const cl=checklist(mission.state);
    return `<div class="goal-progress" role="img" aria-label="${verdict(mission.state).mainDone} of 4 main goals done">${Object.values(cl).map(c=>`<i class="${c[0].done?'on':''}">${svg('star')}</i>`).join('')}</div><p class="mission-purpose">Your report card: proof that this ridge can host a Moon base. Jobs fill it in.</p><div class="missions">${Object.entries(cl).map(([g,checks])=>`<section class="mission ${ui.goal===g?'open':''}"><button data-game-goal="${g}" aria-expanded="${ui.goal===g}"><span class="goal-name">${tile(GOALICON[g],'gicon')}${GOALS[g]}<b class="goal-done ${checks[0].done?'yes':''}" role="img" aria-label="${checks[0].done?'Done':'Not done yet'}">${svg('check')}</b></span><span class="stars">${checks.map(c=>c.done?'★':'☆').join(' ')}</span></button><p class="main-goal">${esc(checks[0].label)}</p>${ui.goal===g?`<div class="mission-detail"><b>Main goal</b><p>${checks[0].done?'✓':'□'} ${esc(checks[0].label)}</p><b>Bonus goals</b>${checks.slice(1).map(c=>`<p>${c.done?'✓':'□'} ${esc(c.label)}</p>`).join('')}</div>`:''}</section>`).join('')}</div><p class="plan-note">4 main goals + safe crew = Promising. 11 stars = Approved. 12 = Gold. Stars can change as radiation rises.</p>`;
  }
  function helpAnswer() {
    if(ui.resource) { const [title,body]=HELP[ui.resource]; return `<h3>${title}</h3><p>${body}</p>`; }
    if(ui.question==='time') return `<h3>Plan your crew’s time</h3><p class="cp-status">${svg('clock','inl')}<b>${timeLeft(mission)} of ${mission.week?.blocks??8} blocks left</b> this week</p><ul class="cp-points"><li>Each job spends time right away.</li><li>Unused time helps the crew recover.</li><li>Rest uses time. It restores energy, not time blocks.</li><li>A tired crew may have fewer blocks next week.</li></ul>`;
    if(ui.question==='earth') return `<h3>Keeping in touch</h3><p class="cp-status">${svg('transmitter','inl')}Earth radio is <b>${current().link?'on':'off'} now</b></p><p>Mission Control sends messages when Earth is in view.</p><div class="cp-note"><b>When radio is off</b><p>The onboard alarm still works. I can still help.</p></div>`;
    if(ui.question==='meters') return `<ul class="meter-list">${Object.entries(HELP).map(([k,[n]])=>`<li style="--c:${METER_COLOR[k]}"><span class="ml-ic">${svg(k)}</span><span><b>${n}</b>${QUICKHELP[k]}</span></li>`).join('')}</ul>`;
    const picks = advice();
    const next = picks.length ? `<div class="cp-next"><b>Try next</b>${picks.map(a=>`<button class="cp-job" data-game-job="${a.id}"><span class="cp-jt" style="--bg:${(JOBICON[a.id]||[0,'#e8e4ff'])[1]}">${svg((JOBICON[a.id]||['wrench'])[0])}</span><span><b>${jobName(a.id)}</b>${a.why}</span></button>`).join('')}</div>` : `<p class="cp-next none">Nothing urgent. Pick a ${svg('star','inl')} job to fill in your report card.</p>`;
    return `<h3>Before you choose a job</h3><ul class="cp-points"><li>${svg('clock','inl')}Every job spends <b>crew time</b>.</li><li>Check the meter changes: <b class="gn">green +</b> adds to a meter; <b class="rd">orange −</b> spends it.</li><li>${svg('star','inl')}Star jobs fill in your report card.</li></ul>${next}`;
  }
  function help() {
    const tabs=(!ui.pop||ui.pop.tabs)?`<div class="question-tabs">${[['jobs','Doing jobs'],['time','Crew time'],['earth','Earth radio'],['meters','The meters']].map(([k,n])=>`<button data-game-question="${k}" aria-expanded="${!ui.resource&&ui.question===k}">${n}</button>`).join('')}</div>`:'';
    return `${tabs}<div class="curio-row"><span class="curio-av"><img src="${assets.curio}" alt=""></span><section class="curio-answer">${helpAnswer()}</section></div>`;
  }
  function calendar() {
    return `<h3>The mission calendar</h3><p>Game timing. Space weather may surprise you.</p><ol class="calendar">${mission.state.timeline.map((e,i)=>`<li class="${i===mission.state.turn?'current':''}"><b>Week ${i+1}</b><span>Earth ${e.link?'in view':'out of view'} · ${e.sun==='dark'?'Long shadow':e.sun==='half'?'Short eclipse':'Sunlight'}</span></li>`).join('')}</ol><p class="plan-note">Seven weekly turns compress the mission. Future storm draws stay hidden.</p>`;
  }
  function sources() {
    const e=current();
    return `<div class="data-guide"><p class="data-notice">${svg('info')}<span><b>This is a simulation.</b> No live feed is shown.</span></p><div class="data-sections"><section class="data-section data-rules"><h3>${svg('wrench')}Made for the game</h3><ul><li>Meters, job costs and ice chances use game rules.</li><li>Event timing is simplified. Storms are placed closer together for the game.</li><li>Radiation uses game points, not a NASA safety limit.</li></ul></section><section class="data-section data-science"><h3>${svg('globe')}Real NASA sources</h3>${e.stormName?`<div class="data-event"><b>Historical event</b><span>${esc(e.stormName.replace(' false alarm',' solar flare'))}</span>${e.realDay?`<time>${esc(e.realDay)}</time>`:''}</div>`:''}<p>${e.realDay?'The bundled May 2024 CRaTER/LRO measurements were recorded in lunar orbit, not at this base. Game radiation is scaled separately.':'Storm names refer to historical events. Their game profiles are simplified; exact hourly measurements are not bundled.'}</p><div class="data-links"><a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noopener"><b>NASA DONKI</b><span>Space-weather research archive ↗</span></a><a href="https://visualization.osdr.nasa.gov/radlab/gui/data-api/" target="_blank" rel="noopener"><b>NASA RadLab</b><span>Radiation data archive ↗</span></a></div></section></div><section class="data-art"><h3>Pictures and artwork</h3><p>Earth: <a href="https://science.nasa.gov/earth/earth-observatory/collections/blue-marble/" target="_blank" rel="noopener">NASA Blue Marble ↗</a>. The base, terrain and crew are illustrations.</p></section></div>`;
  }
  function more() {
    const row = (action, icon, text) => btn(action, `<span class="mo-ic">${svg(icon)}</span><span>${text}</span>`, 'menu-option');
    const debug = document.documentElement.classList.contains('debug');
    return `${mission.state.scenario==='solarMax'?'<p>Solar max · harder mission</p>':''}<div class="menu-grid">${row('calendar','calendar','Mission calendar')}${row('sources','info','NASA data and game rules')}${row('restart','refresh','Start a new mission')}${btn('reset',`<span class="mo-ic">${svg('trash')}</span><span>Reset all data</span>`,'menu-option danger')}${row('home','home','Back to opening story')}${row('fullscreen','expand','Full screen on / off (F)')}${row('debug','bug',`Debug: screen navigator ${debug?'ON':'off'}`)}${debug&&mission.state.turn===0?row('skip-tutorial','refresh','Debug: skip to week 2'):''}</div>${debug&&debugScreens.length?`<h3 class="menu-h">Debug · screens</h3><div class="menu-grid compact">${debugScreens.map(s=>`<button class="menu-option sm" data-game-action="debug-screen" data-screen="${s.id}"><span>${s.name}</span></button>`).join('')}</div>`:''}<p class="plan-note">${storage?'Your mission saves in this browser.':'Browser storage is unavailable. Keep this tab open to keep playing.'}</p>`;
  }
  // Fast-forward circle: ends the week early (it lights up and pulses when the crew is out of time).
  function endFab() {
    const left=timeLeft(mission), tip=left?'End the week early':'End the week';
    return `<button class="end-fab ${left?'':'ready'}" data-game-action="end-week" data-tip="${tip}" aria-label="${tip}">${svg('fast')}</button>`;
  }
  function footer() {
    if(ui.view==='help')return btn('return','Back to jobs','next');
    if(ui.view==='more')return '';
    if(ui.view==='calendar'||ui.view==='sources')return btn('more','‹ Menu','next');
    if(ui.view!=='jobs')return btn('jobs','Choose jobs','next');
    const blocked=ui.job?jobStatus(mission,ui.job):null;
    const doBtn=ui.job?(blocked?`<p class="plan-warning" role="status">${esc(reason(blocked))}</p>`:btn('do-job','Do this job','next')):'';
    return `${doBtn}<div class="foot-row">${time()}${endFab()}</div>`;
  }
  // Curio is a separate floating helper beside the dock, not another row in the job list.
  function curioFab() {
    return `<button class="curio-fab" data-game-action="help" aria-label="Ask Curio for help with meters and jobs"><span class="face"><img src="${assets.curio}" alt=""></span><b>Ask Curio</b><span class="q" aria-hidden="true">?</span></button>`;
  }
  // Meter changes as icon + number (names are in the tooltip).
  function diffChips(diff) {
    return ['power','o2','stamina','dose'].filter(k=>diff[k]).map(k=>`<span class="cc ${k==='dose'||diff[k]<0?'cost':'gain'}" style="--c:${METER_COLOR[k]}" title="${SHORT[k]} ${sign(diff[k])}" role="img" aria-label="${SHORT[k]} ${sign(diff[k])}">${svg(k)}<b>${sign(diff[k])}</b></span>`).join('');
  }
  function recapMeters() {
    const details=mission.recapDetails;
    return `<div class="week-meters">${[['power','Power'],['o2','Air'],['dose','Radiation'],['stamina','Crew energy']].map(([k,n])=>{
      const before=mission.before[k],after=mission.state[k],delta=Math.round(after-before),good=k==='dose'?delta<=0:delta>=0;
      const width=v=>Math.max(0,Math.min(100,v));
      return `<section class="week-meter"><h3>${svg(k)}${n}<span class="week-delta ${good?'better':'worse'}">${delta?sign(delta):'No change'}</span></h3><div class="week-values"><span>${before}</span>${svg('back','week-arrow')}<strong>${after}</strong></div><div class="week-bar" role="img" aria-label="${n}: ${before} at the start, ${after} at the end. ${k==='dose'?'Lower is better.':'Higher is better.'}"><span class="wb-before" style="width:${width(before)}%"></span><span class="wb-after ${good?'better':'worse'}" style="width:${width(after)}%"></span></div>${details?`<p><span>Jobs <strong>${sign(details.jobs[k])}</strong></span><span>Week end <strong>${sign(details.week[k])}</strong></span></p>`:''}</section>`;
    }).join('')}</div><p class="week-key">Faint bar = start · Solid bar = end · All values are game points</p>`;
  }
  function recapStory() {
    const d=mission.recapDetails;
    if(!d)return '';
    const plain=t=>t.replace(/\s*\[[^\]]*\]/g,'').replace(/Stamina/g,'Crew energy').replace(/stamina/g,'crew energy').replace(/Oxygen/g,'Air').replace(/oxygen/g,'air').replace(/today/g,'this week').replace(/half a day of sun/g,'reduced sunlight').replace(/^FAULT: /,'').replace(/^POWER EMERGENCY: /,'');
    const warnings=d.weekLog.filter(t=>/FAULT:|POWER EMERGENCY:|Power restored/.test(t));
    const lines=d.weekLog.filter(t=>!/FAULT:|POWER EMERGENCY:|Power restored/.test(t));
    return `<div class="week-story"><section><h3>${svg('wrench')}Your crew’s work</h3><p>${d.used} of ${d.blocks} time blocks used.</p><ul class="week-jobs">${[...new Set(d.ids)].map(id=>`<li>${svg('check')}${jobName(id)}${d.ids.filter(k=>k===id).length>1?` ×${d.ids.filter(k=>k===id).length}`:''}</li>`).join('')}</ul></section><section><h3>${svg('sun')}Around the base</h3><ul>${lines.map(t=>`<li>${esc(plain(t))}</li>`).join('')}<li>The crew used air to breathe. Radiation built up, and sleep and exercise helped energy recover.</li></ul></section>${warnings.length?`<section class="week-attention"><h3>${svg('alert')}Before the next week</h3><ul>${warnings.map(t=>`<li>${esc(plain(t))}</li>`).join('')}</ul></section>`:''}</div>`;
  }
  // Quick do: a small note that fades out, instead of a popup.
  function toast() {
    const t = ui.toast, m = [['power','#ffd34d'],['o2','#7fe3ff'],['stamina','#ff7b8f'],['dose','#b4e05c']];
    const chips = m.filter(([k]) => t.diff[k]).map(([k, c]) => `<span class="cc ${k==='dose'||t.diff[k]<0?'cost':'gain'}" style="--c:${c}" title="${SHORT[k]} ${sign(t.diff[k])}">${svg(k)}<b>${sign(t.diff[k])}</b></span>`).join('');
    return `<div class="qtoast" role="status">${svg('check')}<span class="qt-n"><b>${esc(jobName(t.id))}</b> done</span><span class="qt-chips">${chips}</span></div>`;
  }
  function dock() {
    const title=ui.view==='help'?'Ask Curio':ui.view==='missions'?'Report card':ui.view==='calendar'?'Plan ahead':ui.view==='sources'?'Data and game rules':ui.view==='more'?'Mission options':CATS[ui.cat].name+' jobs';
    const content=ui.view==='jobs'?(ui.job?preview():jobs()):ui.view==='missions'?missions():ui.view==='help'?help():ui.view==='calendar'?calendar():ui.view==='sources'?sources():more();
    const theme=ui.view==='help'?'curio':ui.view==='missions'?'goals':['more','calendar','sources'].includes(ui.view)?'menu':'jobs';
    const hic=theme==='curio'?'':svg(theme==='goals'?'star':theme==='menu'?'dots':'wrench');
    const tabs=`<nav class="place-tabs" aria-label="Kinds of job">${Object.entries(CATS).map(([id,c])=>`<button data-game-cat="${id}" aria-pressed="${ui.cat===id}">${svg(c.icon)}<span>${c.name}</span></button>`).join('')}</nav>`;
    const head=ui.view==='jobs'&&ui.job?`<div class="jh jh-prev"><button class="back" data-game-action="back-jobs" aria-label="Back to all jobs">${svg('back')}</button>${tile(JOBICON[ui.job]||['wrench','#e8e4ff'],'jicon inline')}<b>${jobName(ui.job)}</b><button class="x" data-game-action="close" aria-label="Close side dock">×</button></div>`:ui.view==='jobs'?`<div class="jh jh-tabs">${tabs}<button class="x" data-game-action="close" aria-label="Close side dock">×</button></div>`:`<div class="jh">${hic?`<span class="jh-ic" aria-hidden="true">${hic}</span>`:''}<div><b>${title}</b></div><button class="x" data-game-action="close" aria-label="Close side dock">×</button></div>`;
    return `<section class="jobs" data-theme="${theme}" data-view="${ui.view}" data-quick="${ui.view==='jobs'&&ui.quick?'on':'off'}" aria-label="${title}">${head}<div class="dock-body" data-key="${ui.view}|${ui.cat}|${ui.job}|${ui.question}|${ui.resource}|${ui.goal}" tabindex="-1">${ui.warning?`<p class="plan-warning" role="status">${esc(ui.warning)}</p>`:''}${content}</div>${ui.view==='jobs'&&ui.toast?toast():''}<div class="planner-footer">${footer()}</div>${ui.view==='jobs'?curioFab():''}</section>`;
  }
  function modal() {
    let body='',actions='',title='',badge='',kicker='',choices='';
    const s=mission.state,e=current(),alert=alertCard(mission);
    const due=briefingDue(), replay=!due&&ui.modal==='brief';
    if(due||replay) {
      const mc=!!e.link,broken=[s.faults.panel&&'panel joint',s.faults.scrubber&&'air system'].filter(Boolean);
      title=`Week ${s.turn+1} of 7`;badge=tile(['radio','#d7f3ff'],'ad-ic');kicker=`<span class="kick">${svg(mc?'radio':'bulb')}${mc?'Mission Control':'The plan Mission Control left'}</span>`;
      body=`${due&&mission.tutorial?tutNote('Mission Control sends one ask each week. Your jobs fill in the report card.'):''}<div class="dlg-say"><span class="dlg-who">${mc?`<span class="who-ic">${svg('radio')}</span>`:`<span class="who-face"><img src="${assets.curio}" alt=""></span>`}${mc?'Mission Control':'Curio · onboard update'} · this week’s ask</span><p>${askText(s,e)}</p></div><div class="condition-row">${chip(environmentTitle(s))}${chip(`Dust ${s.dust}/3`)}${chip(`Shelter ${s.shelterLevel}/3`)}</div>${broken.length?`<p class="fault-note">Repair needed: ${broken.join(' and ')}.</p>`:''}`;
      actions=due?btn('start-week',`Start week ${s.turn+1}`,'next'):btn('back','Back to work','next');
    } else if(alert) {
      const p=mission.week.prompt, auto=mission.tutorial&&p.type==='alert'&&p.alert==='dust', kind=ALERT_KIND[p.type==='alert'?p.alert:p.type]||['info','#e8e4ff'], mc=!!e.link;
      title=alert.title;badge=`<span class="ad-ic" style="--bg:${kind[1]}">${svg(kind[0])}</span>`;kicker=auto?`<span class="kick">${svg('bulb')}Curio's tip</span>`:`<span class="kick">${svg('alert')}Decision needed</span>`;choices=auto?'':' choices';
      body=`${alertTipId()?tutNote(ALERT_TIPS[mission.week.prompt.alert],'Curio · new'):''}<div class="dlg-say"><span class="dlg-who">${mc&&!auto?`<span class="who-ic">${svg('radio')}</span>`:`<span class="who-face"><img src="${assets.curio}" alt=""></span>`}${mc&&!auto?'Mission Control':'Curio · onboard alarm'}</span><p>${auto?'Dust landed on our solar panels. Dust blocks sunlight, so we would make less power. I will clear it before this week’s charging. Dust can come back later, and then it is up to you.':alert.body}</p></div><details class="week-log info-row"><summary>${svg('info')}<span>Data and game rules</span>${svg('down','explain-chevron')}</summary>${sources()}</details>`;
      actions=auto?`<button class="alert-option opt-0" data-game-choice="clean"><span class="ao-ic">${svg(CHOICE_ICON.clean||'check')}</span><span class="ao-t"><b>Clear the dust</b><span>Clears it before this week’s charging.</span></span></button>`:alert.options.map(([choice,label,detail],i)=>`<button class="alert-option opt-${i}" data-game-choice="${choice}"><span class="ao-ic">${svg(CHOICE_ICON[choice]||'check')}</span><span class="ao-t"><b>${label}</b><span>${detail}</span></span></button>`).join('');
    } else if(mission.recap && !['restart','reset'].includes(ui.modal)) {
      const ended=s.ended,v=verdict(s),reason=ended?.reason;
      title=ended?(reason==='complete'?({gold:'Gold mission!',approved:'Site approved!',promising:'A promising site', 'not-proven':'More evidence needed'}[v.tier]):'Time to bring the crew home'):`Week ${mission.before.turn+1} complete`;
      body=`${mission.tutorial?tutNote('A week includes your jobs, plus charging, breathing and recovery. Here’s what changed.'):''}${reason&&reason!=='complete'?`<p>${{oxygen:'The air supply ran out.',dose:'The radiation plan reached its limit.'}[reason]} Replay and try another plan.</p>`:''}${recapMeters()}<p class="week-score"><strong>${v.mainDone}/4 main goals · ${v.stars}/12 stars</strong></p><h3 class="week-story-title">What changed and why</h3>${recapStory()}<details class="week-log"><summary>Full week log</summary><ul>${mission.log.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details>${ended?`<div class="end-goals">${Object.entries(checklist(s)).map(([g,checks])=>`<p>${checks[0].done?'✓':'□'} ${GOALS[g]} ${checks.map(c=>c.done?'★':'☆').join('')}</p>`).join('')}</div>`:''}`;
      actions=ended?btn('ending','See your story','next'):btn('continue',mission.tutorial?`Start week ${s.turn+1}`:`Plan week ${s.turn+1}`,'next');
    } else if(ui.modal==='result'&&mission.result&&mission.week) {
      const r=mission.result,left=timeLeft(mission),meters=[['power','Power','#ffd34d'],['o2','Air','#7fe3ff'],['stamina','Energy','#ff7b8f'],['dose','Radiation','#b4e05c']];
      title=jobName(r.id);badge=tile(JOBICON[r.id]||['wrench','#e8e4ff'],'ad-ic');
      const spent=r.timeUsed??actionDef(r.id).blocks;
      const outcome=['repair','rover','scout','measure'].includes(r.id)?r.lines.slice(0,2):r.lines.slice(1,2);
      body=`<p class="result-flavor">${RESULT_FLAVOR[r.id]||''}</p><div class="result-summary"><span>${svg('clock')}<strong>${spent} time ${spent===1?'block':'blocks'} used</strong></span><div class="result-chips">${diffChips(r.diff)||'<span class="plan-note">No meters changed.</span>'}</div></div>${outcome.length?`<ul class="result-lines">${outcome.map(t=>`<li>${svg('check')}<span>${esc(t)}</span></li>`).join('')}</ul>`:''}${mission.tutorial&&TUT[r.id]?tutNote(TUT[r.id].result):''}${left?'':'<p class="result-next-note">No crew time left. End the week from the job panel when you’re ready.</p>'}`;
      actions=btn('result-next','Got it','next');
    } else if(ui.modal==='end') {
      title='End the week now?';body=`<p>Your crew still has <strong>${timeLeft(mission)} time blocks</strong> left.</p><p>Ending now gives the crew more recovery time. Sunlight, breathing and radiation are worked out for the whole week.</p>`;actions=btn('back','Keep working','text-button')+btn('end-now','End week','next');
    } else if(ui.modal==='restart') {
      title='Start a new mission?';body='<p>This replaces the saved mission in this browser.</p>';actions=btn('back','Keep my mission','text-button')+btn('new-normal','Seven-week mission','next')+btn('new-solar','Solar max · harder','text-button');
    } else if(ui.modal==='reset') {
      title='Reset all data?';badge=`<span class="ad-ic" style="--bg:#ffd6df">${svg('trash')}</span>`;
      body=`<div class="dlg-say"><p>This erases the game and takes you back to the very start of the intro.</p></div><ul class="result-lines"><li>${svg('info')}<span>Your saved mission and report card are deleted.</span></li><li>${svg('info')}<span>You will see the opening story and the tutorial again.</span></li></ul>`;
      actions=btn('back','Keep my mission','text-button')+btn('reset-confirm','Reset and go to the intro','next danger');
    } else return '';
    return `<div class="review-shade"></div><section class="endc review3 game-dialog${ui.modal==='result'&&!alert?' job-result-dialog':''}" role="dialog" aria-modal="true" aria-labelledby="game-dialog-title" tabindex="-1"><div class="dialog-head">${badge}<h2 id="game-dialog-title">${title}</h2>${kicker}</div><div class="dialog-body">${body}</div><div class="dialog-actions${choices}">${actions}</div></section>`;
  }
  function render(focus) {
    ui.active=true;const s=mission.state;
    frame.classList.add('mission-gameplay','layout-a');frame.classList.toggle('has-panel',ui.open);frame.classList.toggle('no-panel',!ui.open);
    // One pin per job category, standing where that kind of work happens: Mission at the rover, Base at the panels, Crew at the habitat.
    const pinsHTML=Object.entries(CATS).map(([id,c])=>`<button class="pin3 ${ui.cat===id&&ui.open?'selected':''}" data-game-pin="${c.place}" data-pin="${c.place}" aria-label="Open ${c.name} jobs"><span class="o">${svg(c.icon)}</span><span class="stem"></span><span class="nm">${c.name}</span></button>`).join('');
    const next=document.createElement('div');next.innerHTML=`${topbar()}${brief()}${pinsHTML}${resources()}${ui.open?dock():btn('jobs','Open my plan','open-curio')}${coach()}${tipPop()}${tutRing()}${modal()}${pop()}`;morphKids(hud,next);
    hud.querySelectorAll('.tut-hl').forEach(el=>el.classList.remove('tut-hl'));
    const tut=tutorialStep();if(tut?.hl)hud.querySelector(tut.hl)?.classList.add('tut-hl');
    document.getElementById('note').textContent=`${s.scenario==='solarMax'?'Solar max':'Seven-week mission'} · ${totalStars(s)}/12 stars · All resource values are simulated game points.`;
    updateScene(current());updateLayout(ui.open);placePop();scheduleGuide();
    const dialog=hud.querySelector('[role="dialog"]');
    for(const child of hud.children)child.inert=!!dialog&&!child.matches('.review-shade,[role="dialog"]');
    if(dialog) { dialog.focus({preventScroll:true}); }
    else if(focus) hud.querySelector(focus)?.focus({preventScroll:true});
    save();
  }
  // Dropdowns change in place (no re-render) so they can animate.
  function toggleDrop(k, open = !ui[k]) {
    ui[k] = open;
    const box = hud.querySelector(k === 'brief' ? '.mission-brief' : '.res3'); if (!box) return;
    box.classList.toggle('open', open);
    box.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', open);
    box.querySelector('[aria-hidden]')?.setAttribute('aria-hidden', !open);
  }
  // Ask Curio is a small pop-up tab next to whatever was clicked (a meter, the Curio button, the radio), not a dock page.
  function showHelp(resource, sel = '.curio-fab') {
    if (ui.pop && ui.pop.sel === sel && (ui.resource || null) === (resource || null)) { closePop(); return; }
    ui.pop = { sel, tabs: sel === '.curio-fab' }; ui.resource = resource || null; ui.warning = ''; render('.curio-pop .cp-x');
  }
  function closePop() { const sel = ui.pop?.sel; ui.pop = null; ui.resource = null; render(); hud.querySelector(sel || '.curio-fab')?.focus({ preventScroll: true }); }
  function pop() {
    if (!ui.pop) return '';
    const wide = ui.question==='meters'&&!ui.resource;
    const title = ui.pop.tabs ? 'Ask Curio' : ui.question==='meters' ? 'The meters' : ui.question==='earth' ? 'Earth radio' : 'Curio';
    const tabs = ui.pop.tabs ? `<nav class="cp-tabs" aria-label="Questions">${[['jobs','Doing jobs'],['time','Crew time'],['earth','Earth radio'],['meters','The meters']].map(([k,n])=>`<button data-game-question="${k}" aria-expanded="${!ui.resource&&ui.question===k}">${n}</button>`).join('')}</nav>` : '';
    return `<section class="curio-pop${wide?' wide':''}${ui.pop.tabs?'':' notabs'}" role="region" aria-label="${title}"><span class="cp-arrow" aria-hidden="true"></span><header class="cp-head"><span class="cp-av"><img src="${assets.curio}" alt=""></span><span class="cp-t"><small>CURIO</small><b>${title}</b></span><button class="cp-x" data-game-action="pop-close" aria-label="Close Curio">×</button></header>${tabs}<div class="cp-body"><section class="cp-answer">${helpAnswer()}</section></div></section>`;
  }
  function placeGuide() {
    const ring = hud.querySelector('.tut-ring'), card = hud.querySelector('.coach');
    const g = guide(), el = g?.hl ? hud.querySelector(g.hl) : null, h = hud.getBoundingClientRect();
    if (!h.width) return;
    if (!el || !el.offsetWidth) { if (ring) ring.style.opacity = '0'; if (card) { card.style.left = card.style.top = ''; card.removeAttribute('data-side'); } return; }
    el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    const r = el.getBoundingClientRect(), pad = 7, gap = 20, m = 12;
    const rad = getComputedStyle(el).borderRadius;
    if (ring) {
      Object.assign(ring.style, { opacity: '1', left: r.left - h.left - pad + 'px', top: r.top - h.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px', borderRadius: !rad || rad === '0px' ? '12px' : rad });
    }
    if (!card) return;
    const w = card.offsetWidth, ch = card.offsetHeight, cx = r.left + r.width / 2 - h.left, cy = r.top + r.height / 2 - h.top;
    const room = { below: h.bottom - r.bottom - gap - m, above: r.top - h.top - gap - m, right: h.right - r.right - gap - m, left: r.left - h.left - gap - m };
    const fits = { below: room.below >= ch, above: room.above >= ch, right: room.right >= w, left: room.left >= w };
    // Targets in the right-hand dock get the card on their left, over the 3D scene, so it never covers the dock's own tabs.
    const order = cx > h.width / 2 ? ['left', 'above', 'below', 'right'] : (cy > h.height / 2 ? ['above', 'right', 'below', 'left'] : ['below', 'right', 'above', 'left']);
    let side = order.find(k => fits[k]) || order.sort((a, b) => room[b] - room[a])[0];
    let x, y;
    if (side === 'below' || side === 'above') { x = Math.max(m, Math.min(h.width - w - m, cx - w / 2)); y = side === 'below' ? r.bottom - h.top + gap : r.top - h.top - gap - ch; }
    else { y = Math.max(m, Math.min(h.height - ch - m, cy - ch / 2)); x = side === 'right' ? r.right - h.left + gap : r.left - h.left - gap - w; }
    x = Math.max(m, Math.min(h.width - w - m, x)); y = Math.max(m, Math.min(h.height - ch - m, y));
    card.style.left = x + 'px'; card.style.top = y + 'px'; card.dataset.side = side;
    card.style.setProperty('--ax', Math.max(22, Math.min(w - 22, cx - x)) + 'px');
    card.style.setProperty('--ay', Math.max(22, Math.min(ch - 22, cy - y)) + 'px');
  }
  let guideTimer = 0;
  const scheduleGuide = () => { placeGuide(); clearTimeout(guideTimer); guideTimer = setTimeout(placeGuide, 420); };
  addEventListener('resize', scheduleGuide);
  function placePop() {
    const el = hud.querySelector('.curio-pop'); if (!el) return;
    const a = hud.querySelector(ui.pop.sel), h = hud.getBoundingClientRect(); if (!h.width) return;
    const w = el.offsetWidth; let above = true, edge = h.height * .14, cx = h.width / 2;
    if (a) { const r = a.getBoundingClientRect(); cx = r.left + r.width / 2 - h.left; above = r.top + r.height / 2 - h.top > h.height / 2; edge = above ? h.bottom - r.top + 14 : r.bottom - h.top + 14; }
    const left = Math.max(12, Math.min(h.width - w - 12, cx - w / 2));
    const room = h.height - edge - 14, body = el.querySelector('.cp-body'); if (body) body.style.maxHeight = Math.max(140, room - 30) + 'px';
    el.style.left = left + 'px'; el.style.top = above ? 'auto' : edge + 'px'; el.style.bottom = above ? edge + 'px' : 'auto';
    el.style.setProperty('--ax', Math.max(18, Math.min(w - 18, cx - left)) + 'px'); el.classList.toggle('below', !above);
    const r = el.getBoundingClientRect();
    if (body) {
      const over = above ? (h.top + 8) - r.top : r.bottom - (h.bottom - 8);
      if (over > 0) body.style.maxHeight = Math.max(80, body.offsetHeight - over) + 'px';
    }
  }
  function apply(result) { if(result.error)ui.warning=result.error;else{mission=result.mission;ui.warning='';} }
  hud.addEventListener('click',event=>{
    if(!ui.active)return;
    if(ui.brief&&!event.target.closest('.mission-brief'))toggleDrop('brief',false);
    if(ui.pop&&!event.target.closest('.curio-pop,.res-info,.curio-fab,.chip3.radio')){ui.pop=null;ui.resource=null;hud.querySelector('.curio-pop')?.remove();}
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.gamePin){ui.place=target.dataset.gamePin;ui.cat=PLACES[ui.place].cat;ui.view='jobs';ui.job=null;ui.open=true;ui.warning='';render('.jobs .x');return;}
    if(target.dataset.gameCat){ui.cat=target.dataset.gameCat;ui.place=CATS[ui.cat].place;ui.view='jobs';ui.job=null;ui.open=true;ui.warning='';render('.jobs .x');return;}
    if(target.dataset.gameResource){showHelp(target.dataset.gameResource,`[data-game-resource="${target.dataset.gameResource}"]`);return;}
    if(target.dataset.gameQuick){
      const id=target.dataset.gameQuick;ui.warning='';const result=doJob(mission,id);apply(result);
      if(!result.error){
        ui.job=null;const r=result.mission.result;
        if(r){const k=Date.now();ui.toast={id:r.id,diff:r.diff,k};setTimeout(()=>{if(ui.toast&&ui.toast.k===k){ui.toast=null;if(ui.active)render();}},3800);}
        if(timeLeft(mission)===0&&mission.result)ui.modal='result';
      }
      render(`[data-game-quick="${id}"]`);return;
    }
    if(target.dataset.gameJob){const st=tutorialStep();if(st?.job&&target.dataset.gameJob!==st.job){ui.warning='Tutorial: tap the glowing job first.';render();return;}const id=target.dataset.gameJob,c=Object.entries(CATS).find(([,v])=>v.jobs.includes(id));if(c){ui.cat=c[0];ui.place=c[1].place;}ui.view='jobs';ui.open=true;ui.job=id;ui.warning='';ui.pop=null;ui.resource=null;render('.dock-body');return;}
    if(target.dataset.gameQuestion){ui.resource=null;ui.question=target.dataset.gameQuestion;render(`[data-game-question="${ui.question}"]`);return;}
    if(target.dataset.gameGoal){ui.goal=ui.goal===target.dataset.gameGoal?null:target.dataset.gameGoal;render(`[data-game-goal="${target.dataset.gameGoal}"]`);return;}
    if(target.dataset.gameChoice){const tipId=alertTipId();if(tipId)markTip('alert-'+tipId);const r=choose(mission,target.dataset.gameChoice);apply(r);if(r.mission?.result)ui.modal='result';render();return;}
    const action=target.dataset.gameAction;if(!action)return;
    ui.warning='';
    if(['jobs','missions','calendar','sources','more'].includes(action)){ui.view=action;ui.job=null;ui.open=true;if(ui.modal==='result'||ui.modal==='end')ui.modal=null;}
    else if(action==='tip-ack'){const t=weekTip();if(t)markTip(t.id);}
    else if(action==='tut-ack'){const st=tutorialStep();if(st?.ack)ui.seen[st.ack]=true;}
    else if(action==='help'){if(mission.tutorial)ui.seen.curio=true;ui.question='jobs';ui.resource=null;showHelp(undefined,'.curio-fab');return;}
    else if(action==='meters-info'){ui.question='meters';ui.resource=null;showHelp(undefined,'.res-info');return;}
    else if(action==='quick'){ui.quick=!ui.quick;ui.toast=null;render('[data-game-action="quick"]');return;}
    else if(action==='radio'){ui.question='earth';ui.resource=null;showHelp(undefined,'.chip3.radio');return;}
    else if(action==='pop-close'){closePop();return;}
    else if(action==='return'){ui.view=ui.returnView;ui.resource=null;}
    else if(action==='close'){ui.open=false;}
    else if(action==='back-jobs'){ui.job=null;}
    else if(action==='do-job'){const result=doJob(mission,ui.job);apply(result);if(!result.error){ui.job=null;if(result.mission.result)ui.modal='result';}}
    else if(action==='result-next'||action==='back'){ui.modal=null;ui.view='jobs';}
    else if(action==='end-week'){if(mission.tutorial&&!['logsun','air','rest'].every(id=>mission.week.ids.includes(id)))ui.warning='Tutorial: finish the three jobs first.';else if(timeLeft(mission)&&!mission.tutorial)ui.modal='end';else{apply(endWeek(mission));ui.modal=null;}}
    else if(action==='end-now'){apply(endWeek(mission));ui.modal=null;if(!mission.recap&&ui.warning){ui.open=true;}}
    else if(action==='continue'){mission=nextWeek(mission);ui.modal=null;ui.view='jobs';ui.job=null;ui.open=true;}
    else if(action==='start-week'){mission={...mission,briefedTurn:mission.state.turn};ui.modal=null;ui.view='jobs';ui.open=true;}
    else if(action==='rebrief'){ui.brief=false;ui.modal='brief';}
    else if(action==='restart'){ui.modal='restart';}
    else if(action==='reset'){ui.modal='reset';}
    else if(action==='reset-confirm'){resetting=true;try{Object.keys(localStorage).filter(k=>k.startsWith('lunar-ridge.')).forEach(k=>localStorage.removeItem(k));}catch{}location.replace(location.pathname);return;}
    else if(action==='new-normal'||action==='new-solar'){mission=createMission(action==='new-solar'?'solarMax':'weeks7',Math.floor(Math.random()*0x7fffffff));ui.modal=null;ui.view='jobs';ui.open=true;ui.job=null;ui.place='rover';ui.cat='mission';}
    else if(action==='brief'){toggleDrop('brief');return;}
    else if(action==='skip-tutorial'){mission=skipToWeek2(mission);ui.modal=null;ui.view='jobs';ui.job=null;ui.open=true;ui.cat='mission';ui.place='rover';}
    else if(action==='fullscreen'){toggleFullscreen();}
    else if(action==='debug'){const on=document.documentElement.classList.toggle('debug');try{localStorage.setItem('sbc-debug',on?'1':'0');}catch{}}
    else if(action==='ending'){onEnding?.(structuredClone(mission));return;}
    else if(action==='debug-screen'){onDebugScreen?.(target.dataset.screen);return;}
    else if(action==='home'){onHome();return;}
    render(action==='back-jobs'?'.jobs .x':undefined);
  });
  hud.addEventListener('keydown',event=>{
    if(!ui.active)return;
    const dialog=hud.querySelector('[role="dialog"]');
    if(event.key==='Tab'&&dialog){const controls=[...dialog.querySelectorAll('button,a,summary,select')].filter(el=>!el.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first?.focus();}}
    if(event.key==='Escape'&&ui.pop){closePop();return;}
    if(event.key==='Escape'){if(mission.week?.prompt||mission.recap)return;if(ui.modal)ui.modal=null;else if(ui.job)ui.job=null;else if(ui.view==='help')ui.view=ui.returnView;else ui.open=false;render('[data-game-action="jobs"]');}
  });
  return {render, openView(view){ui.view=view;ui.job=null;ui.open=true;ui.modal=null;}, deactivate(){if(ui.active)updateScene({sun:'full',link:true});ui.active=false;frame.classList.remove('mission-gameplay','layout-a','has-panel','no-panel');}, getState(){return structuredClone(mission);}};
}

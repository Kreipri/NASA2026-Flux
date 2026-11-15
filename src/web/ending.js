// Victory + ending story (storyline-v2 §5, story-script-v2 Part 5). Self-contained: renders its own full-frame layer.
// Reads a finished mission (engine state) and builds the cards from what the player actually did. No numbers are invented here.
import * as E from '../engine/engine.ts';
import { createMission } from './model.js';

const P = {
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
  calm:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.2 4.2 0 0 0 7 0M9 9.5v.5M15 9.5v.5"/>',
  battery:'<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
  drone:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><rect x="9" y="9" width="6" height="6" rx="1.5"/><path d="m7 7 2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"/>',
  rock:'<path d="m3 18 4-8 5-3 6 4 3 7z"/><path d="m7 10 5 3 6-2"/>',
  star:'<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  snow:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
  dose:'<g fill="currentColor" stroke="none"><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z"/><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z" transform="rotate(120 12 12)"/><path d="M12 3A9 9 0 0 1 19.8 7.5L15 10.3A3.5 3.5 0 0 0 12 8.5Z" transform="rotate(240 12 12)"/><circle cx="12" cy="12" r="1.6"/></g>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  half:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>',
  radio:'<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19a10 10 0 0 1 0-14"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v5h-5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  home:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  back:'<path d="m15 6-6 6 6 6"/>',
  wind:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  flame:'<path d="M12 2.5c.8 3.4 5.5 5.6 5.5 10.8a5.5 5.5 0 0 1-11 0c0-2.2 1-3.6 2.2-4.8.2 2 1 3 2.2 3.4-.6-3.4-.4-6 1.1-9.4z"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v5M12 17.5v.5"/>',
  gauge:'<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-5"/>',
  down:'<path d="M12 4v15M6 13l6 6 6-6"/>',
  rover:'<path d="M3 14v-3l3-3h8l3 3h4v3z"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/>',
};
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const NAME = { curio:'CURIO', mc:'MISSION CONTROL', bram:'BISCUIT', remy:'MOCHI', mica:'PEBBLE' };

// Fact registry rows used here (ideas/fact-sources.md). Kid wording, source, link. Story lines are marked ✎ Story instead.
const SRC = {
  F20:['Earth bobs up and down in the Moon’s sky, so a polar base can talk to Earth directly only about half of each month.', 'NASA JPL, IPN Progress Report 42-176C', 'https://ipnpr.jpl.nasa.gov/progress_report/42-176/176C.pdf'],
  F09:['Some craters never see sunlight. They can be as cold as −414 °F, colder than Pluto.', 'NASA SVS 11230', 'https://svs.gsfc.nasa.gov/11230'],
  F66:['Scientists are still studying Apollo Moon samples 50 years later. One sealed tube was opened in 2022.', 'NASA Science, ANGSA', 'https://science.nasa.gov/lunar-science/programs/angsa/'],
  F67:['In a radiation storm, NASA’s advice is to go to the most shielded place.', 'NASA SRAG, How we protect astronauts', 'https://srag.jsc.nasa.gov/SpaceRadiation/How/How.cfm'],
  F69:['The base habitat stays on the Moon after a crew leaves, so later crews can live there.', 'NASA, Plan for Sustained Lunar Exploration and Development (2020)', 'https://www.nasa.gov/wp-content/uploads/2020/08/a_sustained_lunar_presence_nspc_report4220final.pdf'],
  F50:['Mars is farther from the Sun than Earth, so its sunlight is less than half as strong.', 'NASA Science, Mars Facts', 'https://science.nasa.gov/mars/facts/'],
  F51:['Messages between Mars and Earth take up to 20 minutes one way.', 'NASA Human Research Program', 'https://www.nasa.gov/hrp/hazard-distance-from-earth/'],
  F52:['A Mars dust storm in 2018 covered the Opportunity rover’s solar panels, and its mission ended.', 'NASA JPL', 'https://www.jpl.nasa.gov/edu/resources/teachable-moment/mars-rover-mission-comes-to-an-end-but-science-legacy-live-on/'],
  storm:['This storm is based on a real one from NASA’s DONKI space-weather archive. In this game, storms happen closer together than in real life, and the radiation numbers are simplified.', 'NASA DONKI', 'https://ccmc.gsfc.nasa.gov/tools/DONKI/'],
};
const badge = (id, label = 'NASA fact') => `<button class="e-badge" data-src="${id}">${ic('check')}${label}</button>`;

const TIERS = {
  gold:{ label:'GOLD PATCH', line:'You think like a real astronaut!' },
  honors:{ label:'HONORS', line:'You think like a real astronaut!' },
  complete:{ label:'MISSION COMPLETE', line:'Crew safe. Tasks done. The base works!' },
  notyet:{ label:'NOT YET', line:'Real missions say “not yet” too.' },
};
const GOAL_NAME = { LIGHT:'Light', RADIATION:'Radiation', SHELTER:'Shelter', ICE:'Ice' };
const GOAL_ICON = { LIGHT:'sun', RADIATION:'dose', SHELTER:'shield', ICE:'snow' };
const TIP = { LIGHT:'Log the sunlight, and the long shadow too.', RADIATION:'Measure radiation while a storm is happening.', SHELTER:['When the alarm sounds, go to the shelter first.', 'F67'], ICE:'Send the drone first, then the rover in good light.' };

/** Everything the cards need, from the finished mission. */
export function summarize(mission) {
  const s = mission.state, v = E.verdict(s), cl = E.checklist(s), ev = s.evidence, reason = s.ended?.reason;
  const home = reason === 'oxygen' || reason === 'dose';
  const tier = home ? 'home' : { gold:'gold', approved:'honors', promising:'complete' }[v.tier] || 'notyet';
  const weeks = s.timeline.map((e, i) => {
    const h = s.history.find(x => x.turn === i);
    return { e, played: !!h, sheltered: !!h && (h.actions.includes('shelter') || h.choice === 'shelter'), storm: E.stormActive(e) };
  });
  const sheltered = weeks.filter(w => w.sheltered && w.storm);
  const real = sheltered.find(w => w.e.stormSource === 'archive') || sheltered[0];
  const m = [];
  if (sheltered.length || ev.shelteredStormDays > 0) m.push({ icon:'shield', text:`You hid from a storm based on a real one${real?.e.stormName ? ` (${esc(real.e.stormName)})` : ''}.`, src:'storm' });
  if (sheltered.some(w => !w.e.link)) m.push({ icon:'bell', text:'Earth was gone. The alarm rang. <b>You</b> made the call.' });
  const fa = weeks.findIndex(w => /false alarm/i.test(w.e.stormName || ''));
  if (fa >= 0 && weeks[fa].played && !weeks[fa].sheltered) m.push({ icon:'calm', text:'A big flare, but no storm. You stayed calm.', src:'storm' });
  if (ev.trips > 0) m.push({ icon:'rock', text:'You brought back rocks from a crater colder than Pluto.', src:'F09' });
  if (ev.scouts > 0 && ev.trips > 0) m.push({ icon:'drone', text:'You sent the drone first. Smart!' });
  if (!ev.powerHitZero && weeks.some(w => w.played && w.e.sun === 'dark')) m.push({ icon:'battery', text:'Your batteries lasted through the dark.' });
  if (!m.length) m.push({ icon:'star', text:`You kept the crew safe on the Moon${s.history.length ? ` for ${s.history.length} ${s.history.length === 1 ? 'week' : 'weeks'}` : ''}.` });
  const doseOk = s.dose <= (E.DOSE_STAR ?? 25);
  const crew = {
    bram: ev.powerHitZero ? 'The dark was close. Charge up sooner next time.' : 'No blackouts. Nice planning!',
    remy: home ? 'Everyone’s okay. That’s what matters.' : doseOk ? 'Lowest radiation dose I’ve seen!' : 'We took lots of radiation. Come in sooner next time.',
    mica: ev.trips > 0 ? ['Scientists still study Apollo rocks today. They’ll study ours too!', 'F66'] : ['Next time, let’s reach the crater.'],
  };
  const miss = v.missingMain[0];
  const tip = home ? (reason === 'oxygen' ? ['Keep the air machine fixed, and fill the batteries before the dark.'] : TIP.SHELTER) : miss ? [].concat(TIP[miss]) : [];
  return { s, v, cl, ev, reason, home, tier, weeks, moments: m.slice(0, 3), crew, tip, link: E.env(s).link, stars: E.totalStars(s) };
}

const face = (who, a) => who === 'mc' ? `<span class="e-face mc">${ic('radio')}</span>` : `<span class="e-face"><img src="${a[who]}" alt=""></span>`;
const cap = (who, a, text, extra = '') => `<div class="e-cap">${face(who, a)}<div><span class="e-who ${who}">${NAME[who]}</span><p>${text}</p>${extra}</div></div>`;
const stars = n => `<span class="e-stars" aria-label="${n} of 12 stars">${ic('star')}<b>${n}</b><small>/12</small></span>`;

const SEQ = ['earth', 'story', 'crew', 'stamp', 'next', 'learn', 'mars', 'debrief'];
const SEQ_HOME = ['earth', 'crew', 'learn', 'mars', 'debrief'];
const STEPS = { next:2, learn:2 };

// One function per card. `d` is summarize(); `a` the crew/Curio images; `step` the sub-step inside a card.

/** "What you learned": the rule, then what happened in THIS mission and what it caused. Built from the engine record only. */
function lessons(d) {
  const { ev, s, weeks, reason } = d;
  const stormMet = weeks.some(w => w.played && w.storm), dark = weeks.some(w => w.played && w.e.sun === 'dark');
  const A = reason === 'oxygen' ? { icon:'wind', rule:'Air needs power.', did:'The air ran out.', so:'Keep the air machine fixed and the batteries full.', good:false }
    : ev.powerHitZero ? { icon:'bolt', rule:'Sunlight is power.', did:'Your batteries ran out once.', so:'No sunlight, no power. Charge up before the long shadow.', good:false }
    : dark ? { icon:'bolt', rule:'Sunlight is power.', did:'You charged up before the long shadow.', so:'The lights stayed on.', good:true }
    : { icon:'bolt', rule:'Sunlight is power.', did:'The panels charged in the sunlight.', so:'In the long shadow they can’t, so plan ahead.', good:true };
  const doseOk = s.dose <= (E.DOSE_STAR ?? 25);
  const B = reason === 'dose' ? { icon:'shield', rule:'Shelter blocks radiation.', did:'Radiation climbed too high.', so:'When the alarm sounds, go to the shelter first.', good:false, src:'F67' }
    : ev.shelteredStormDays > 0 ? { icon:'shield', rule:'Shelter blocks radiation.', did:'You went to the shelter in a storm.', so:`Your crew finished with ${Math.round(s.dose)} radiation points.`, good:doseOk, src:'F67' }
    : stormMet ? { icon:'shield', rule:'Shelter blocks radiation.', did:'A storm came and the crew stayed out.', so:'Next time, go to the shelter first.', good:false, src:'F67' }
    : { icon:'shield', rule:'Shelter blocks radiation.', did:'No storm hit this time.', so:'When one does, the shelter protects the crew.', good:true, src:'F67' };
  const C = ev.trips > 0 && ev.iceFound > 0 ? { icon:'rover', rule:'Where you go has a cost.', did:ev.scouts > 0 ? 'You mapped with the drone, then drove to the dark crater.' : 'You drove to the dark crater.', so:'It cost power and air, and you found ice!', good:true }
    : ev.trips > 0 ? { icon:'rover', rule:'Where you go has a cost.', did:ev.scouts > 0 ? 'You mapped with the drone, then drove to the dark crater.' : 'You drove to the dark crater.', so:'It cost power and air. A dry spot is still evidence.', good:true }
    : { icon:'rover', rule:'Where you go has a cost.', did:'You stayed near the base.', so:'Trips to the dark crater cost a lot, so plan each one.', good:true };
  return [A, B, C];
}

// The Moon: a lit horizon, regolith grain and craters with lit rims. Sits flush with the bottom of the stage.
const MOON = (() => {
  const craters = [[250, 262, 96, 17], [640, 318, 150, 24], [1060, 238, 74, 12], [1330, 336, 118, 19], [830, 206, 42, 8], [95, 352, 76, 13], [1490, 244, 54, 10], [470, 372, 58, 9]];
  const rocks = [[180, 224, 9, 4], [560, 232, 7, 3], [940, 300, 11, 5], [1190, 214, 8, 3], [1420, 300, 9, 4], [740, 380, 12, 5]];
  const shape = 'M0 150 Q800 36 1600 150 V430 H0Z';
  return `<svg class="e-moon" viewBox="0 0 1600 430" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8d6ea"/><stop offset=".14" stop-color="#a8a6c0"/><stop offset=".55" stop-color="#6b6987"/><stop offset="1" stop-color="#4a4864"/></linearGradient>
    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58567a"/><stop offset="1" stop-color="#8e8caa"/></linearGradient>
    <clipPath id="mclip"><path d="${shape}"/></clipPath>
    <filter id="mn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .16  0 0 0 0 .15  0 0 0 0 .26  0 0 0 .55 0"/></filter></defs>
    <path d="${shape}" fill="url(#mg)"/>
    <g clip-path="url(#mclip)"><rect width="1600" height="430" filter="url(#mn)" opacity=".5"/>
      ${craters.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#cg)"/><path d="M${x - rx} ${y}A${rx} ${ry} 0 0 1 ${x + rx} ${y}" fill="none" stroke="#e4e2f4" stroke-width="3" opacity=".55"/><path d="M${x - rx} ${y}A${rx} ${ry} 0 0 0 ${x + rx} ${y}" fill="none" stroke="#2f2d48" stroke-width="2.5" opacity=".35"/>`).join('')}
      ${rocks.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#5f5d7c"/><ellipse cx="${x - rx * .3}" cy="${y - ry * .4}" rx="${rx * .5}" ry="${ry * .4}" fill="#c9c7de" opacity=".6"/>`).join('')}
    </g>
    <path d="M0 150 Q800 36 1600 150" fill="none" stroke="#f1effc" stroke-width="3.5" opacity=".75"/></svg>`;
})();

// A real mission patch: stitched border, curved lettering, a tiny scene, and a ribbon with the result.
const PATCH = {
  gold:{ thread:'#ffd24a', shade:'#b87d12', field:'#161048', field2:'#33288a', ink:'#2a1a06' },
  honors:{ thread:'#eaf3ff', shade:'#86a4d2', field:'#101a48', field2:'#27418c', ink:'#10243a' },
  complete:{ thread:'#86eadf', shade:'#2b9288', field:'#0e2646', field2:'#1d4f7c', ink:'#062b2a' },
  notyet:{ thread:'#dcd0ff', shade:'#8672c8', field:'#171348', field2:'#34297a', ink:'#251b52' },
};
function patch(tier) {
  const c = PATCH[tier], label = TIERS[tier].label, fs = Math.min(27, 226 / (label.length * .66)), id = `pt-${tier}`;
  const dots = [[96, 66], [140, 54], [214, 70], [236, 98], [118, 96], [180, 62], [100, 118]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.5}" fill="#fff" opacity=".85"/>`).join('');
  const sparkle = ([x, y, r]) => `<path class="tw" d="M${x} ${y - r}L${x + r * .28} ${y - r * .28}L${x + r} ${y}L${x + r * .28} ${y + r * .28}L${x} ${y + r}L${x - r * .28} ${y + r * .28}L${x - r} ${y}L${x - r * .28} ${y - r * .28}Z" fill="${c.thread}"/>`;
  return `<svg class="e-patchsvg" viewBox="0 0 320 312" role="img" aria-label="${label} mission patch"><defs>
    <linearGradient id="${id}-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.thread}"/><stop offset="1" stop-color="${c.shade}"/></linearGradient>
    <radialGradient id="${id}-f" cx=".5" cy=".28" r=".85"><stop offset="0" stop-color="${c.field2}"/><stop offset="1" stop-color="${c.field}"/></radialGradient>
    <linearGradient id="${id}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f33"/><stop offset="1" stop-color="#4b2f80"/></linearGradient>
    <radialGradient id="${id}-e" cx=".35" cy=".3"><stop offset="0" stop-color="#8fd3ff"/><stop offset=".6" stop-color="#2f78c8"/><stop offset="1" stop-color="#16408a"/></radialGradient>
    <clipPath id="${id}-c"><circle cx="160" cy="150" r="82"/></clipPath>
    <path id="${id}-a" d="M 66 150 A 94 94 0 0 1 254 150"/><path id="${id}-b" d="M 50 150 A 110 110 0 0 0 270 150"/></defs>
    <circle cx="160" cy="150" r="142" fill="${c.shade}" opacity=".5" transform="translate(0 4)"/>
    <circle cx="160" cy="150" r="141" fill="url(#${id}-t)"/>
    <circle cx="160" cy="150" r="135" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="2.2" stroke-dasharray="2.4 3.1"/>
    <circle cx="160" cy="150" r="129" fill="url(#${id}-f)"/>
    <circle cx="160" cy="150" r="121" fill="none" stroke="url(#${id}-t)" stroke-width="2.6"/>
    <text font-family="Lexend,Fredoka,sans-serif" font-weight="700" font-size="14.5" letter-spacing="3.2" fill="${c.thread}"><textPath href="#${id}-a" startOffset="50%" text-anchor="middle">JUNIOR ASTRONAUT</textPath></text>
    <text font-family="Lexend,Fredoka,sans-serif" font-weight="700" font-size="12.5" letter-spacing="3" fill="${c.thread}"><textPath href="#${id}-b" startOffset="50%" text-anchor="middle">MOON · MISSION 1</textPath></text>
    <circle cx="66" cy="150" r="3.2" fill="${c.thread}"/><circle cx="254" cy="150" r="3.2" fill="${c.thread}"/>
    <g clip-path="url(#${id}-c)"><rect x="76" y="64" width="168" height="172" fill="url(#${id}-s)"/>${dots}
      <circle cx="206" cy="92" r="19" fill="url(#${id}-e)"/><path d="M196 88q6-8 14-4 4 6-2 10-8 2-12-6z" fill="#7fcf8a" opacity=".85"/>
      <path d="M70 176Q160 142 250 176V240H70Z" fill="#b2b0c8"/><path d="M70 176Q160 142 250 176" fill="none" stroke="#f0eefb" stroke-width="2" opacity=".8"/>
      <ellipse cx="116" cy="204" rx="22" ry="5.5" fill="#7d7b98"/><ellipse cx="208" cy="214" rx="30" ry="7" fill="#7d7b98"/>
      <path d="M138 170a22 18 0 0 1 44 0z" fill="#f0eefb"/><circle cx="160" cy="161" r="5.5" fill="#7fe3ff"/><path d="M160 152v-16" stroke="#e4e2f4" stroke-width="2.4" stroke-linecap="round"/><circle cx="160" cy="135" r="2.8" fill="#ffd34d"/>
      <rect x="104" y="150" width="14" height="22" rx="1.5" fill="#3f64b0"/><rect x="200" y="150" width="14" height="22" rx="1.5" fill="#3f64b0"/></g>
    <circle cx="160" cy="150" r="83" fill="none" stroke="url(#${id}-t)" stroke-width="3"/>
    ${tier === 'gold' ? [[42, 52, 11], [278, 52, 11], [34, 228, 8], [286, 228, 8]].map(sparkle).join('') : tier === 'honors' ? [[44, 58, 8], [276, 58, 8]].map(sparkle).join('') : ''}
    <g transform="translate(0 4)"><path d="M18 238H50V284H18L32 261Z" fill="${c.shade}"/><path d="M302 238H270V284H302L288 261Z" fill="${c.shade}"/>
    <path d="M44 226H276V272H44Z" fill="#000" opacity=".25" transform="translate(0 3)"/>
    <path d="M44 224H276V270H44Z" fill="url(#${id}-t)"/><path d="M44 224H276V270H44Z" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.6" stroke-dasharray="2.4 3"/>
    <path d="M44 270 34 284 50 284Z M276 270 286 284 270 284Z" fill="#000" opacity=".28"/>
    <text x="160" y="255" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="${fs}" letter-spacing="1.2" fill="${c.ink}">${label}</text></g></svg>`;
}

const CARDS = {
  earth(d, a) {
    if (d.home) {
      const why = d.reason === 'oxygen' ? 'Air is too low' : 'Radiation is too high';
      return { cls:'c-home', art:`<div class="e-alarm">${ic(d.reason === 'oxygen' ? 'wind' : 'dose')}</div><i class="e-ring"></i>`,
        cap: d.link ? cap('mc', a, 'Commander, we’re bringing you home. Safety first.') : cap('curio', a, `${why} to stay safe. Time for the safety plan.`) };
    }
    return { cls:'c-earth', art:`<span class="e-later">1 week later…</span><div class="e-earth"><i></i></div><span class="e-wave"></span><span class="e-wave w2"></span><span class="e-wave w3"></span>`,
      cap: cap('mc', a, 'First crew! We hear you. <b>Tell us everything!</b>', badge('F20')) };
  },
  story(d, a) {
    return { cls:'c-story', art:`<ul class="e-moments">${d.moments.map((m, i) => `<li style="--i:${i}"><span class="e-mi">${ic(m.icon)}</span><span>${m.text}${m.src ? badge(m.src, m.src === 'storm' ? 'Real storm data' : 'NASA fact') : ''}</span></li>`).join('')}</ul>`, cap: cap('curio', a, 'Here’s your story!') };
  },
  crew(d, a) {
    const one = (who, line, i) => { const [t, f] = [].concat(line); return `<div class="e-crew" style="--i:${i}"><img src="${a[who]}" alt=""><span class="e-nm ${who}">${NAME[who]}</span><p class="e-bub">${t}${f ? badge(f) : ''}</p></div>`; };
    if (d.home) return { cls:'c-crew', art:`<div class="e-crewrow one">${one('remy', d.crew.remy, 0)}</div>`,
      cap: cap('curio', a, `Here’s a tip: ${d.tip[0]} Want to try again?`, d.tip[1] ? badge(d.tip[1]) : '') };
    return { cls:'c-crew', art:`<div class="e-crewrow">${one('bram', d.crew.bram, 0)}${one('remy', d.crew.remy, 1)}${one('mica', d.crew.mica, 2)}</div>`, cap: '' };
  },
  stamp(d, a) {
    const T = TIERS[d.tier], top = d.tier === 'gold' || d.tier === 'honors';
    const goals = Object.entries(d.cl).map(([g, c]) => `<li class="${c[0].done ? 'on' : ''}"><span class="e-gi">${ic(GOAL_ICON[g])}</span><b>${GOAL_NAME[g]}</b><span class="e-gs">${c.map(x => `<i class="${x.done ? 'on' : ''}">${ic('star')}</i>`).join('')}</span></li>`).join('');
    const yes = d.moments[0], why = d.tier === 'notyet' ? `<p class="e-try">Try this next: ${d.tip[0] || 'Plan one more goal.'}${d.tip[1] ? badge(d.tip[1]) : ''}</p><p class="e-try ok">You did well: ${yes.text}</p>` : '';
    return { cls:`c-stamp t-${d.tier}`, art:`${top ? '<div class="e-confetti" aria-hidden="true">' + Array.from({ length:18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * .35}s;--c:${['#ffb347', '#5fd0c8', '#ff7b8f', '#fff2a8'][i % 4]}"></i>`).join('') + '</div>' : ''}
      <div class="e-patchwrap"><div class="e-patch">${patch(d.tier)}</div><i class="e-puff"></i><i class="e-puff p2"></i></div>
      <div class="e-side"><p class="e-line">${T.line}</p>${stars(d.stars)}${why}<ul class="e-goals">${goals}</ul></div>`, cap: '' };
  },
  next(d, a, step) {
    const later = step === 1;
    const line = later ? 'Welcome, new crew! The base is ready.' : d.tier === 'notyet' ? 'The base kept you safe. The next crew will finish the job.' : 'I’ll keep the base running until the next crew comes.';
    return { cls:`c-next ${later ? 'later' : ''}`,
      art:`<img class="e-base" src="assets/space-base.svg" alt=""><div class="e-lander out">${lander()}</div>${later ? `<div class="e-lander in">${lander()}</div><div class="e-note"><small>on the console</small><b>Clean the panels!</b><span>– BISCUIT</span></div><span class="e-later">Later…</span>` : ''}<span class="e-tag">✎ Story: the next crew and the note are made up.</span>`,
      cap: cap('curio', a, line, later ? '' : badge('F69')) };
  },
  learn(d, a, step) {
    const items = lessons(d).map((l, i) => `<li class="les" style="--i:${i}"><div class="les-h"><span class="e-lt">${ic(l.icon)}</span><h3>${l.rule}</h3></div>
      <p class="did"><small>In your mission</small>${l.did}</p><span class="arrow" aria-hidden="true">${ic('down')}</span>
      <p class="so ${l.good ? 'good' : 'warn'}">${ic(l.good ? 'check' : 'alert')}<span>${l.so}</span></p>${l.src ? badge(l.src) : ''}</li>`).join('');
    return { cls:`c-learn s${step}`, art:`<div class="e-idea"><small>THE BIG IDEA · ✎ our lesson from the game</small><p>Light is a resource. Where you work decides your <b>power</b>, <b>cold</b> and <b>radiation</b> risk.</p></div><ul class="e-lessons">${items}</ul>`,
      cap: step ? cap('curio', a, 'That’s the big idea. One day, real crews will make these choices. <b>Maybe you!</b>') : cap('curio', a, 'Here’s what <b>your</b> mission showed you.') };
  },
  mars(d, a) {
    return { cls:'c-mars', art:`<div class="e-mars"></div><div class="e-minisun"></div><div class="e-next-title"><small>NEXT MISSION</small><b>Mars</b><span>${ic('lock')} Coming soon</span></div>
      <ul class="e-facts">${[['sun', 'F50'], ['radio', 'F51'], ['wind', 'F52']].map(([i, f]) => `<li><span>${ic(i)}</span><span>${SRC[f][0]}</span>${badge(f)}</li>`).join('')}</ul>`, cap: '' };
  },
  debrief(d, a) {
    const wk = d.weeks.map((w, i) => `<li class="${w.played ? '' : 'off'} ${w.storm ? 'storm' : ''}"><small>Week ${i + 1}</small><span class="s">${ic(w.e.sun === 'dark' ? 'moon' : w.e.sun === 'half' ? 'half' : 'sun')}</span><span class="r ${w.e.link ? 'on' : ''}" title="Earth radio ${w.e.link ? 'on' : 'off'}">${ic('radio')}</span>${w.storm ? `<span class="z">${ic(w.sheltered ? 'shield' : 'alert')}</span>` : '<span class="z"></span>'}</li>`).join('');
    const storms = [...new Set(d.weeks.filter(w => w.played && w.storm).map(w => esc(w.e.stormName || 'A storm')))];
    const badged = d.tier !== 'home';
    return { cls:'c-debrief', art:`<div class="e-deb ${badged ? 'hasbadge' : ''}">${badged ? `<div class="e-deb-patch" aria-hidden="false">${patch(d.tier)}</div>` : ''}<h2>Your ${d.s.history.length || d.weeks.length} weeks</h2>
      <ul class="e-weeks" aria-label="Each week: sunlight, Earth radio, storms">${wk}</ul>
      <p class="e-key"><span>${ic('sun')} sunlight</span><span>${ic('radio')} Earth radio</span><span>${ic('shield')} sheltered</span><span>${ic('alert')} storm, no shelter</span></p>
      <div class="e-tiles"><div>${ic('star')}<b>${d.stars}<small>/12</small></b><span>stars</span></div><div>${ic('check')}<b>${d.v.mainDone}<small>/4</small></b><span>main goals</span></div><div>${ic('dose')}<b>${Math.round(d.s.dose)}</b><span>radiation points</span></div><div>${ic('rock')}<b>${d.ev.trips}</b><span>crater trips</span></div></div>
      <p class="e-storms">${storms.length ? `Storms you met: <b>${storms.join(' · ')}</b> ${badge('storm', 'Real storm data')}` : 'No storms this time. Try again for new weather.'}</p>
      <div class="e-actions">
        <button class="e-again" data-end="again"><span class="ic">${ic('refresh')}</span><span><b>Play again</b><small>Same mission, new storms</small></span></button>
        <button class="e-hard" data-end="solar"><span class="ic">${ic('flame')}</span><span><b>Solar max <em>HARDER</em></b><small>A busier Sun. A big surprise storm is sure to come.</small></span><span class="pips" aria-label="Difficulty: hard">${ic('flame')}${ic('flame')}${ic('flame')}</span></button>
      </div>
      <div class="e-foot"><button class="e-real-btn" data-end="real">${ic('info')}How real is this?</button><button class="e-done" data-end="done">I’m done <span aria-hidden="true">›</span></button></div>
      </div>
      <div class="e-sheet" hidden><div class="e-scrim" data-end="real"></div><div class="e-sheetbox" role="dialog" aria-label="How real is this?"><button class="e-x" data-end="real" aria-label="Close">×</button><h3>How real is this?</h3>
        <div class="e-cols"><section class="real"><h4>${ic('check')} Real</h4><ul><li>The Moon’s south pole and Shackleton Crater</li><li>Sunlight on the ridge, and Earth’s changing view</li><li>The storms: names and dates from NASA’s DONKI archive</li></ul></section>
        <section class="sim"><h4>${ic('gauge' in P ? 'gauge' : 'info')} Simulated</h4><ul><li>Every meter and job cost</li><li>Your ice chances</li><li>When events happen. Storms come closer together than in real life.</li></ul></section>
        <section class="story"><h4>✎ Story</h4><ul><li>The crew and Curio</li><li>The next crew</li><li>Biscuit’s note</li></ul></section></div>
        <a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noopener">NASA DONKI space-weather archive</a></div></div>`, cap: '' };
  },
};
const lander = () => `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M50 74h20l-4 14H54z" class="fl"/><path d="M30 40h60l8 32H22z" fill="#ddd8ee"/><rect x="40" y="20" width="40" height="22" rx="7" fill="#bfb7da"/><circle cx="60" cy="31" r="6" fill="#7fe3ff"/><path d="M32 72 14 106M88 72l18 34M60 72v26" stroke="#bfb7da" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`;

/** Fake finished missions for the debug menu, built from a real fresh mission so the shapes always match the engine. */
export function mockMission(kind) {
  const m = createMission('weeks7', 11), s = m.state, ev = s.evidence;
  s.turn = s.timeline.length - 1;
  s.history = s.timeline.map((e, i) => ({ turn: i, actions: i === 2 || i === 6 ? ['shelter', 'rest'] : ['logsun', 'rest'], choice: i === 2 ? 'shelter' : undefined }));
  Object.assign(ev, { sunLogs:5, longShadowLogged:true, eclipseLogged:true, measures:4, stormMeasures:2, trips:2, scouts:1, iceFound:1, mappedEmpty:0, shelteredStormDays:2, powerHitZero:false });
  s.shelterLevel = 2; s.dose = 18; s.o2 = 70; s.power = 60; s.stamina = 70; s.ended = { reason:'complete' };
  if (kind === 'honors') ev.trips = 1;
  if (kind === 'complete') Object.assign(ev, { sunLogs:2, longShadowLogged:false, eclipseLogged:false, measures:1, stormMeasures:1, trips:1, scouts:0, iceFound:0, shelteredStormDays:1 }), s.shelterLevel = 0, s.dose = 45;
  if (kind === 'notyet') Object.assign(ev, { sunLogs:2, measures:1, stormMeasures:1, trips:0, scouts:0, iceFound:0, shelteredStormDays:1, longShadowLogged:false }), s.shelterLevel = 0, s.dose = 45;
  if (kind === 'home-air') s.ended = { reason:'oxygen' }, s.o2 = 0, ev.powerHitZero = true;
  if (kind === 'home-dose') s.ended = { reason:'dose' }, s.dose = 100;
  return m;
}
/** Screens listed in the debug menu: each opens the ending at that card with a matching mock mission. */
export const ENDING_SCREENS = [
  { id:'end-gold', name:'Ending: full story (Gold)', kind:'gold', card:'earth' },
  { id:'end-story', name:'Your story (moments)', kind:'gold', card:'story' },
  { id:'end-crew', name:'The crew', kind:'gold', card:'crew' },
  { id:'end-gold-stamp', name:'Victory: Gold patch', kind:'gold', card:'stamp' },
  { id:'end-honors', name:'Victory: Honors', kind:'honors', card:'stamp' },
  { id:'end-complete', name:'Victory: Mission complete', kind:'complete', card:'stamp' },
  { id:'end-notyet', name:'Result: Not yet', kind:'notyet', card:'stamp' },
  { id:'end-next', name:'Home + next crew', kind:'gold', card:'next' },
  { id:'end-learn', name:'What you learned', kind:'gold', card:'learn' },
  { id:'end-mars', name:'Mars teaser', kind:'gold', card:'mars' },
  { id:'end-debrief', name:'Debrief', kind:'gold', card:'debrief' },
  { id:'end-home-air', name:'Crew called home (air)', kind:'home-air', card:'earth' },
  { id:'end-home-dose', name:'Crew called home (radiation)', kind:'home-dose', card:'earth' },
];

export function mountEnding({ frame, assets, onPlayAgain, onDone }) {
  const layer = document.createElement('section');
  layer.className = 'end3'; layer.hidden = true; layer.setAttribute('aria-label', 'Mission ending'); layer.tabIndex = -1;
  frame.append(layer);
  let d = null, seq = SEQ, i = 0, step = 0, open = false, srcId = null;
  const card = () => CARDS[seq[i]](d, assets, step);
  function paint(focus = true) {
    const id = seq[i], c = card(), last = i === seq.length - 1;
    const dots = seq.map((_, k) => `<i class="${k === i ? 'now' : k < i ? 'past' : ''}"></i>`).join('');
    layer.innerHTML = `<div class="e-sky"></div>${MOON}<div class="e-card ${c.cls}" data-card="${id}">${c.art}</div>
      <div class="e-top"><span class="e-prog" role="img" aria-label="Step ${i + 1} of ${seq.length}">${dots}</span>${i || step ? `<button class="e-back" data-end="back" aria-label="Back">${ic('back')}</button>` : ''}${last ? '' : '<button class="e-skip" data-end="skip">Skip ▸▸</button>'}</div>
      ${c.cap}<div class="e-srcbox" hidden></div>${last ? '' : `<button class="e-next" data-end="next">${nextLabel(id)} ▶</button>`}`;
    if (srcId) showSrc(srcId);
    if (focus) (layer.querySelector('.e-next') || layer.querySelector('.e-btn.main'))?.focus({ preventScroll: true });
  }
  const nextLabel = id => id === 'next' && step === 0 ? 'Later…' : id === 'learn' && step === 0 ? 'Next' : id === 'stamp' ? 'Next' : 'Next';
  function showSrc(id) {
    const box = layer.querySelector('.e-srcbox'), r = SRC[id]; if (!box || !r) return;
    srcId = id; box.hidden = false;
    box.innerHTML = `<b>${ic('check')} Where is this from?</b><p>${r[0]}</p><a href="${r[2]}" target="_blank" rel="noopener">${esc(r[1])}</a><button class="e-x" data-end="closesrc" aria-label="Close">×</button>`;
  }
  function go(n) { i = Math.max(0, Math.min(seq.length - 1, n)); step = 0; srcId = null; paint(); }
  function next() { if (step + 1 < (STEPS[seq[i]] || 1)) { step++; srcId = null; paint(); } else if (i < seq.length - 1) go(i + 1); }
  function back() { if (step > 0) { step--; srcId = null; paint(); } else go(i - 1); }
  layer.addEventListener('click', e => {
    const b = e.target.closest('[data-end],[data-src]'); if (!b) return;
    if (b.dataset.src) { srcId === b.dataset.src && !layer.querySelector('.e-srcbox').hidden ? (srcId = null, layer.querySelector('.e-srcbox').hidden = true) : showSrc(b.dataset.src); return; }
    const a = b.dataset.end;
    if (a === 'next') next(); else if (a === 'back') back();
    else if (a === 'closesrc') { srcId = null; layer.querySelector('.e-srcbox').hidden = true; }
    else if (a === 'skip') go(seq.indexOf(seq.includes('stamp') && i < seq.indexOf('stamp') ? 'stamp' : 'debrief'));
    else if (a === 'real') { const r = layer.querySelector('.e-sheet'); r.hidden = !r.hidden; if (!r.hidden) r.querySelector('.e-x')?.focus(); else layer.querySelector('.e-real-btn')?.focus(); }
    else if (a === 'again') { hide(); onPlayAgain?.('weeks7'); }
    else if (a === 'solar') { hide(); onPlayAgain?.('solarMax'); }
    else if (a === 'done') { hide(); onDone?.(); }
  });
  layer.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    else if (e.key === 'Escape') { const sh = layer.querySelector('.e-sheet'); if (sh && !sh.hidden) { sh.hidden = true; layer.querySelector('.e-real-btn')?.focus(); } else if (srcId) { srcId = null; layer.querySelector('.e-srcbox').hidden = true; } }
  });
  function show(mission, { card: start } = {}) {
    d = summarize(mission); seq = d.home ? SEQ_HOME : SEQ; open = true; layer.hidden = false; frame.classList.add('end-open'); const nt = document.getElementById('note'); if (nt) nt.style.visibility = 'hidden';
    for (const el of frame.children) if (el !== layer) el.inert = true;
    const at = seq.indexOf(start); i = at < 0 ? 0 : at; step = 0; srcId = null; paint();
  }
  function hide() {
    if (!open) return; open = false; layer.hidden = true; layer.innerHTML = ''; frame.classList.remove('end-open'); const nt = document.getElementById('note'); if (nt) nt.style.visibility = '';
    for (const el of frame.children) el.inert = false;
  }
  return { show, hide, isOpen: () => open, showDebug(id) { const s = ENDING_SCREENS.find(x => x.id === id); if (s) show(mockMission(s.kind), { card: s.card }); } };
}

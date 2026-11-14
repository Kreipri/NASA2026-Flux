// Crew + placeholder astronaut redrawn in the style of Bea's Figma Curio (curio-figma.svg).
// Style rules taken from that file:
//   - soft squircle shapes (big rounded rects), no dark outlines
//   - vertical gradient: base colour on top -> cooler slate at the bottom
//   - a thick, lighter INNER rim (bevel) on every main part
//   - navy "screen" gradient #1D2B4C -> #4465B2, glowing cyan (#21DBE3 / #09F5F9) accents
//   - one amber plate (#F7C081 -> #BF833E)
// Run: node ideas/character-designs/curio-style-v5/build.mjs
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
const FONT = `font-family="Nunito, 'Arial Rounded MT Bold', system-ui, sans-serif" font-weight="800"`;
const BODYFONT = `font-family="Nunito, system-ui, sans-serif" font-weight="700"`;

const K = {
  navy: '#1D2B4C', navyDeep: '#0E214B', screenA: '#1D2B4C', screenB: '#4465B2',
  cyan: '#21DBE3', cyanHi: '#09F5F9', amberA: '#F7C081', amberB: '#BF833E',
  metal: '#D9D9D9', metalDark: '#A0A5B2', slate: '#4F5772', blush: '#FF8FA6', suit: '#E3E5EA',
};
// personal colours, muted to sit next to Curio's greys
const PC = { generic: '#8C93A8', bram: '#4F7BD9', remy: '#EE7F98', mica: '#45B07F', cmdr: '#F08A4B' };

// ---------- colour + defs helpers ----------
const h2r = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const r2h = (a) => '#' + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => { const B = h2r(b); return r2h(h2r(a).map((v, i) => v + (B[i] - v) * t)); };
const lum = (c) => { const [r, g, b] = h2r(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

let uid = 0, defs = [], cache = {};
function begin() {
  defs = [`<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>`,
    `<filter id="softer" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter>`];
  cache = {};
}
function finish(w, h, body, vb = `0 0 ${w} ${h}`) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none">\n<defs>${defs.join('\n')}</defs>\n${body}\n</svg>\n`;
}
// linear gradient in bounding-box units; span > 1 runs past the shape, like Curio's
function lg(a, b, span = 1, diag = false) {
  const key = [a, b, span, diag].join();
  if (cache[key]) return cache[key];
  const id = `g${++uid}`;
  const [x1, x2] = diag ? [0.25, 0.25 + span * 0.45] : [0, 0];
  defs.push(`<linearGradient id="${id}" x1="${x1}" y1="0" x2="${x2}" y2="${span}"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`);
  return (cache[key] = `url(#${id})`);
}
function mat(c) {
  if (lum(c) < 0.32) return { fill: lg(mix(c, '#FFFFFF', 0.1), mix(c, '#080C1A', 0.5), 1.6), rim: lg(mix(c, '#FFFFFF', 0.3), mix(c, '#FFFFFF', 0.06), 1.1) };
  return { fill: lg(c, mix(c, K.slate, 0.6), 1.9), rim: lg(mix(c, '#FFFFFF', 0.42), mix(c, K.slate, 0.32), 1.1) };
}
const withAttr = (el, attrs) => el.replace(/\s*\/>$/, ` ${attrs}/>`);
// a filled shape with Curio's inner bevel rim (clip + double-width stroke = inside stroke)
function S(el, c, rim = 6, op = 0.8, fill = null) {
  const m = mat(c);
  let s = withAttr(el, `fill="${fill || m.fill}"`);
  if (rim > 0) {
    const cid = `c${++uid}`;
    defs.push(`<clipPath id="${cid}">${el}</clipPath>`);
    s += `<g clip-path="url(#${cid})">${withAttr(el, `fill="none" stroke="${m.rim}" stroke-width="${rim * 2}" stroke-opacity="${op}"`)}</g>`;
  }
  return s;
}
const F = (el, a, b, span = 1, diag = false) => withAttr(el, `fill="${lg(a, b, span, diag)}"`);
function clipTo(el, inner) { const cid = `c${++uid}`; defs.push(`<clipPath id="${cid}">${el}</clipPath>`); return `<g clip-path="url(#${cid})">${inner}</g>`; }
const glow = (el, col = K.cyan) => `${withAttr(el, `fill="${col}"`)}<g filter="url(#soft)" opacity=".9">${withAttr(el, `fill="${col}"`)}</g>`;
const G = (name, inner) => (inner && inner.trim() ? `<g id="${name}">${inner}</g>` : '');
const screen = (el) => F(el, K.screenA, K.screenB, 1.4, true);
const amberPlate = (x, y, w = 22, h = 8) => F(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3.5"/>`, K.amberA, K.amberB, 1.3, true);
const blush = (xs, y) => `<g filter="url(#softer)" opacity=".55">${xs.map((x) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5.5" fill="${K.blush}"/>`).join('')}</g>`;
const mouth = (cx, y, col = K.navy) => `<path d="M${cx - 8} ${y} q4 4.6 8 0 q4 4.6 8 0" stroke="${col}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
// tall pill eyes: Curio's eye shape, in navy, with a small shine
const pillEye = (cx, y, h = 21, col = K.navy) => `<rect x="${cx - 5}" y="${y}" width="10" height="${h}" rx="5" fill="${col}"/><circle cx="${cx + 1.5}" cy="${y + 5}" r="2.1" fill="#FFFFFF" opacity=".9"/>`;
const eyes = (y, h) => pillEye(60, y, h) + pillEye(105, y, h);

// ---------- shared body (canvas 165 x 241, like Curio) ----------
const CX = 82.5;
const TORSO = '<rect x="44" y="122" width="77" height="64" rx="22"/>';
const SH = { L: [50, 134], R: [115, 134] };
const handAt = (side, a, len = 34) => [SH[side][0] - len * Math.sin(a * Math.PI / 180), SH[side][1] + len * Math.cos(a * Math.PI / 180)];
const boot = (x, y = 208) => S(`<rect x="${x - 14}" y="${y}" width="28" height="24" rx="11"/>`, '#2A3A66', 4, 0.5)
  + F(`<rect x="${x - 12}" y="${y + 18}" width="24" height="5" rx="2.5"/>`, K.metalDark, K.slate);
function legs(pants, lift = [0, 0]) {
  return [66, 99].map((x, i) => `<g transform="translate(0 ${-lift[i]})">${S(`<rect x="${x - 10}" y="176" width="20" height="38" rx="10"/>`, pants, 4, 0.7)}${boot(x)}</g>`).join('');
}
// sleeve + paw, rotated about the shoulder
function arm(side, a, sleeve, paw, { w = 18, len = 38, band = null } = {}) {
  const pill = `<rect x="${-w / 2}" y="-6" width="${w}" height="${len}" rx="${w / 2}"/>`;
  const b = band ? clipTo(pill, `<rect x="${-w / 2}" y="6" width="${w}" height="7" fill="${band}"/>`) : '';
  return `<g transform="translate(${SH[side]}) rotate(${a})">${S(pill, sleeve, 4, 0.75)}${b}${S(`<circle cx="0" cy="${len - 4}" r="${w / 2 + 1}"/>`, paw, 3, 0.7)}</g>`;
}

// ---------- chibi crew (v5.1): big head, small body, simple shapes ----------
// Head ~145x120 on a ~60x48 body. Eyes: big plain navy pills (no shine). Small nose/mouth/props.
// fur and cloth are matte: gradient fill, no shiny bevel rim (that stays on metal only)
// Remy is flat (no gradient) and Mica's gradient is gentle, so the face keeps contrast
const M = (el, c) => c === FUR5.remy ? withAttr(el, `fill="${c}"`)
  : c === FUR5.mica ? withAttr(el, `fill="${lg(c, mix(c, K.slate, 0.28), 1.9)}"`)
  : S(el, c, 0);
const INK = '#141C33'; // face features: a touch darker than Curio's navy
const HEADBOX = (y) => `<ellipse cx="${CX}" cy="${y + 61}" rx="72" ry="62"/>`; // v5.6: rounder head
// face layout (v5.3, from Bea's star-mascot reference): small features clustered just below the head's middle.
// Short oval eyes set close, round blush just under/outside each eye, tiny nose + mouth between them.
const bigEyes = (y) => [55.5, 109.5].map((x) => `<rect x="${x - 9.5}" y="${y}" width="19" height="28" rx="9.5" fill="${INK}"/>`).join(''); // no shine (v5.4)
const tinyMouth = (y) => `<path d="M${CX - 7} ${y} q7 6 14 0" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`;
// solid round blush, behind the eyes, tinted toward the fur colour
const softBlush = (y, fur) => [41.5, 123.5].map((x) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="9.5" fill="${mix(fur, K.blush, 0.75)}"/>`).join('');
const tinyNose = (y, col) => F(`<path d="M${CX - 6.5} ${y} h13 q-2 5.5 -6.5 7 q-4.5 -1.5 -6.5 -7Z"/>`, col, mix(col, K.slate, 0.35));
const FUR5 = { bram: '#E6A65D', remy: '#EEF0F5', mica: '#A9B1C8' };
const HEAD = {
  bram() {
    const y = 44, ear = '#A9693B';
    const earEl = (x, r) => `<rect x="${x}" y="${y + 12}" width="30" height="62" rx="15" transform="rotate(${r} ${x + 15} ${y + 16})"/>`;
    return M(HEADBOX(y), FUR5.bram)
      + M(`<ellipse cx="${CX}" cy="${y + 87}" rx="20" ry="15"/>`, '#F7E6CC')
      + softBlush(y + 88, FUR5.bram) + bigEyes(y + 56)
      + S(`<rect x="${CX - 6.5}" y="${y + 75}" width="13" height="9" rx="4.5"/>`, INK, 1.5, 0.4) + tinyMouth(y + 91)
      + M(earEl(5, 3), ear) + M(earEl(130, -3), ear);
  },
  remy() {
    const y = 50, inner = '#F5A9BA';
    const ear = (x, r) => `<g transform="rotate(${r} ${x + 14} 66)">${M(`<rect x="${x}" y="0" width="28" height="72" rx="14"/>`, FUR5.remy)}${F(`<rect x="${x + 9}" y="12" width="10" height="44" rx="5"/>`, inner, mix(inner, K.slate, 0.25))}</g>`;
    return ear(36, -10) + ear(101, 10)
      + M(HEADBOX(y), FUR5.remy)
      + softBlush(y + 88, FUR5.remy) + bigEyes(y + 56)
      + tinyNose(y + 74, '#FF9AB0') + tinyMouth(y + 89);
  },
  mica() { // single-colour grey-blue cat (species pick still open)
    const y = 46;
    const earL = `<path d="M16 ${y + 44} L22 ${y - 22} Q24 ${y - 32} 34 ${y - 26} L78 ${y + 6}Z"/>`, earLin = `<path d="M28 ${y + 22} L31 ${y - 10} L58 ${y + 8}Z"/>`;
    const flip = (el) => `<g transform="translate(165 0) scale(-1 1)">${el}</g>`;
    const ears = M(earL, FUR5.mica) + F(earLin, '#F5A9BA', '#D9839A');
    return ears + flip(ears)
      + M(HEADBOX(y), FUR5.mica)
      + softBlush(y + 88, FUR5.mica) + bigEyes(y + 56)
      + tinyNose(y + 74, '#FF9AB0') + tinyMouth(y + 89);
  },
};
const TAIL = {
  bram: () => '', // dropped: read as a held stick (front view hides it anyway)
  remy: () => '', // dropped: read as a second paw beside the tablet
  mica: () => `<path d="M106 204 Q140 208 138 180 Q137 166 127 168" stroke="${lg(FUR5.mica, mix(FUR5.mica, K.slate, 0.35), 1)}" stroke-width="10" stroke-linecap="round"/>`,
};
const BODY = '<rect x="52" y="158" width="61" height="48" rx="20"/>';
const SH5 = { L: [57, 168], R: [108, 168] };
const hand5 = (side, a, len = 26) => [SH5[side][0] - len * Math.sin(a * Math.PI / 180), SH5[side][1] + len * Math.cos(a * Math.PI / 180)];
const arm5 = (side, a, sleeve, paw) => `<g transform="translate(${SH5[side]}) rotate(${a})">${M('<rect x="-8" y="-5" width="16" height="30" rx="8"/>', sleeve)}${M('<circle cx="0" cy="26" r="9"/>', paw)}</g>`;
const legs5 = (pants) => [70, 95].map((x) => M(`<rect x="${x - 9}" y="196" width="18" height="22" rx="9"/>`, pants)
  + S(`<rect x="${x - 13}" y="212" width="26" height="21" rx="10"/>`, '#2A3A66', 3, 0.5)).join('');
// props stay in the style but smaller (scaled in crew())
const PROP = {
  wrench: () => S('<rect x="-3.5" y="-32" width="7" height="34" rx="3.5"/>', K.metal, 2, 0.7)
    + S('<path d="M-11 -40 v-9 a3.2 3.2 0 0 1 6.4 0 v5 h9.2 v-5 a3.2 3.2 0 0 1 6.4 0 v9 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6Z"/>', K.metal, 2.5, 0.7),
  tablet: () => S('<rect x="-16" y="-38" width="32" height="40" rx="8"/>', K.metal, 3, 0.8)
    + screen('<rect x="-11.5" y="-33" width="23" height="30" rx="5"/>')
    + glow('<rect x="-7" y="-20" width="14" height="4" rx="2"/>') ,
  magnifier: () => S('<rect x="-3.5" y="-16" width="7" height="20" rx="3.5"/>', K.metalDark, 2, 0.6)
    + S('<circle cx="0" cy="-29" r="14"/>', K.metal, 4, 0.9) + screen('<circle cx="0" cy="-29" r="9"/>'),
};
const OUTFIT = {
  bram: { top: PC.bram, pants: '#3E4B70', prop: 'wrench', extra: () => clipTo(BODY, F('<rect x="52" y="190" width="61" height="7"/>', '#2A3A66', K.navy)) },
  remy: { top: PC.remy, pants: '#3E4B70', prop: 'tablet', extra: () => clipTo(BODY, '<rect x="81" y="158" width="3" height="48" fill="#FFFFFF" opacity=".7"/>') },
  mica: { top: PC.mica, pants: '#3E4B70', prop: 'magnifier', extra: () => '' },
};
function crew(w, { aL = 16, aR = -40 } = {}) {
  const o = OUTFIT[w], fur = FUR5[w];
  const [hx, hy] = hand5('R', aR);
  return G('tail', TAIL[w]()) + G('legs', legs5(o.pants))
    + G('body', M(BODY, o.top) + o.extra() + amberPlate(86, 168, 16, 6) + glow('<circle cx="66" cy="171" r="3"/>'))
    + G('arm-left', arm5('L', aL, o.top, fur))
    + G('head', HEAD[w]())
    + G('arm-right', arm5('R', aR, o.top, fur))
    + G('prop', `<g transform="translate(${hx.toFixed(1)} ${(hy + 3).toFixed(1)}) rotate(14) scale(.72)">${PROP[o.prop]()}</g>`
      + M(`<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="9"/>`, fur));
}
// ---------- generic astronaut (placeholder for any crew member / the player) ----------
function astronaut(band = PC.generic, { aL = 10, aR = -10, lift = [0, 0], bob = 0, tilt = 0 } = {}) {
  const suit = K.suit;
  const helmet = '<rect x="22" y="18" width="121" height="102" rx="44"/>';
  const legsA = [66, 99].map((x, i) => `<g transform="translate(0 ${-lift[i]})">${S(`<rect x="${x - 11}" y="172" width="22" height="38" rx="11"/>`, suit, 4, 0.8)}${boot(x, 206)}</g>`).join('');
  const armA = (side, a) => arm(side, a, suit, K.metalDark, { w: 20, len: 40, band });
  const head = `<g transform="rotate(${tilt} ${CX} 120)">`
    + S('<rect x="8" y="54" width="18" height="42" rx="6"/>', K.metalDark, 5, 0.8) + S('<rect x="139" y="54" width="18" height="42" rx="6"/>', K.metalDark, 5, 0.8)
    + S(helmet, suit, 10, 1)
    + screen('<rect x="36" y="34" width="93" height="70" rx="28"/>')
    + '<rect x="46" y="44" width="30" height="8" rx="4" fill="#FFFFFF" opacity=".28" transform="rotate(-14 61 48)"/><circle cx="85" cy="43" r="3.4" fill="#FFFFFF" opacity=".25"/>'
    + S('<rect x="69" y="10" width="27" height="11" rx="5.5"/>', K.metalDark, 2.5, 0.8) + glow('<rect x="75" y="13" width="15" height="5" rx="2.5"/>')
    + '</g>';
  return G('legs', legsA)
    + `<g transform="translate(0 ${bob})">`
    + G('backpack', S('<rect x="34" y="116" width="97" height="64" rx="18"/>', K.metalDark, 5, 0.7))
    + G('body', S('<rect x="44" y="122" width="77" height="64" rx="24"/>', suit, 7, 0.9)
      + S('<rect x="52" y="112" width="61" height="16" rx="8"/>', K.metalDark, 3, 0.7)
      + S('<rect x="62" y="140" width="41" height="25" rx="8"/>', '#C6CAD3', 3, 0.8)
      + amberPlate(67, 146, 20, 6) + glow('<circle cx="95" cy="149" r="3.2"/>')
      + `<rect x="68" y="156" width="7" height="4" rx="2" fill="${K.navy}"/><rect x="78" y="156" width="7" height="4" rx="2" fill="${K.navy}"/><rect x="88" y="156" width="10" height="4" rx="2" fill="${band}"/>`)
    + G('arm-left', armA('L', aL)) + (aR > -90 ? G('arm-right', armA('R', aR)) : '')
    + G('helmet', head)
    + (aR <= -90 ? G('arm-right', armA('R', aR)) : '') // a raised (waving) arm goes in front of the helmet
    + '</g>';
}
const FRAMES = {
  'idle-1': {}, 'idle-2': { bob: 1.5, aL: 12, aR: -12 },
  'walk-1': { aL: 22, aR: -5, lift: [7, 0], bob: -2 }, 'walk-2': { aL: 5, aR: -22, lift: [0, 7], bob: -2 },
  'wave-1': { aR: -118, tilt: -4 }, 'wave-2': { aR: -150, tilt: -4 },
};

// ---------- overview sheet ----------
const curioSrc = readFileSync(join(OUT, 'curio-figma.svg'), 'utf8');
const curioInner = curioSrc.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const place = (x, y, inner, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const shadow = (x, y, s = 1) => `<ellipse cx="${x + CX * s}" cy="${y + 238 * s}" rx="${46 * s}" ry="${4.5 * s}" fill="${K.navy}" opacity=".13"/>`;
const label = (x, y, t, sub, col = K.navy, subCol = '#6B7387') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="20" fill="${col}" ${FONT}>${t}</text>`
  + (sub ? `<text x="${x}" y="${y + 20}" text-anchor="middle" font-size="13" fill="${subCol}" ${BODYFONT}>${sub}</text>` : '');

function sheet() {
  begin();
  const W = 1240; let b = `<rect width="${W}" height="1130" fill="#F4F5F8"/>`;
  b += `<text x="40" y="52" font-size="30" fill="${K.navy}" ${FONT}>Crew in Curio's style</text>`
    + `<text x="40" y="78" font-size="15" fill="#6B7387" ${BODYFONT}>Squircle shapes · light-to-slate gradients · soft inner rim · navy screens · cyan glow · one amber plate. Chibi: head bigger than body.</text>`;
  const row1 = [['Curio', "Bea's Figma original", `<svg width="165" height="241" viewBox="0 0 165 241">${curioInner}</svg>`],
    ['Bram', 'dog · base systems', crew('bram')], ['Remy', 'rabbit · crew health', crew('remy')], ['Mica', 'cat · exploring (pick open)', crew('mica')]];
  row1.forEach(([n, sub, art], i) => { const x = 70 + i * 290; b += shadow(x, 110) + place(x, 110, art) + label(x + CX, 385, n, sub); });

  b += `<text x="40" y="460" font-size="26" fill="${K.navy}" ${FONT}>Placeholder astronaut sprite</text>`
    + `<text x="40" y="484" font-size="15" fill="#6B7387" ${BODYFONT}>Faceless visor, so it can stand in for anyone. 6 frames: idle ×2, walk ×2, wave ×2. Same 165×241 canvas as Curio.</text>`;
  Object.entries(FRAMES).forEach(([n, p], i) => { const x = 40 + i * 197; b += shadow(x, 505) + place(x, 505, astronaut(PC.generic, p)) + label(x + CX, 775, n); });

  b += `<rect x="0" y="815" width="${W}" height="315" fill="#141B33"/>`
    + `<text x="40" y="855" font-size="22" fill="#FFFFFF" ${FONT}>Colour-band variants, on a dark game background</text>`;
  Object.entries(PC).forEach(([k, c], i) => { const x = 70 + i * 225; b += place(x, 870, astronaut(c), 0.9) + label(x + CX * 0.9, 1110, k === 'cmdr' ? 'commander' : k, null, '#FFFFFF'); });
  return finish(W, 1130, b);
}

// ---------- write files ----------
const write = (rel, svg) => { const p = join(OUT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, svg); return 1; };
let n = 0;
n += write('crew-curio-style.svg', sheet());
for (const w of ['bram', 'remy', 'mica']) { begin(); n += write(`export/crew/${w === 'mica' ? 'mica-cat' : w}.svg`, finish(165, 241, G(w, crew(w)))); }
for (const [f, p] of Object.entries(FRAMES)) { begin(); n += write(`export/astronaut/frames/astronaut-${f}.svg`, finish(165, 241, G(`astronaut-${f}`, astronaut(PC.generic, p)))); }
begin();
n += write('export/astronaut/astronaut-sheet.svg', finish(165 * 6, 241, Object.entries(FRAMES).map(([f, p], i) => G(`frame-${i + 1}-${f}`, place(i * 165, 0, astronaut(PC.generic, p)))).join('')));
for (const [k, c] of Object.entries(PC)) { begin(); n += write(`export/astronaut/variants/astronaut-${k === 'cmdr' ? 'commander' : k}.svg`, finish(165, 241, G(`astronaut-${k}`, astronaut(c)))); }
console.log(`curio-style-v5: ${n} files`);

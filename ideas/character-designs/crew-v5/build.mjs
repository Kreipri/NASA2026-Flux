// Crew + placeholder astronaut redrawn in the style of Bea's Figma Curio (curio-original.svg).
// Style rules taken from that file:
//   - soft squircle shapes (big rounded rects), no dark outlines
//   - vertical gradient: base colour on top -> cooler slate at the bottom
//   - a thick, lighter INNER rim (bevel) on every main part
//   - navy "screen" gradient #1D2B4C -> #4465B2, glowing cyan (#21DBE3 / #09F5F9) accents
//   - one amber plate (#F7C081 -> #BF833E)
// Run: node ideas/character-designs/crew-v5/build.mjs   (folder was curio-style-v5)
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

// ---------- chibi crew (v5.6) ----------
// Big round head on a small body. Face (from Bea's star-mascot ref): features clustered just below the
// head's middle, short navy oval eyes, solid blush behind/under the eyes, tiny nose + mouth.
// Fur and cloth are matte (no bevel rim; that stays on metal). Remy is flat; Mica has a gentle gradient.
const FUR5 = { bram: '#E6A65D', remy: '#EEF0F5', mica: '#A9B1C8' };
const HY = { bram: 44, remy: 50, mica: 46 }; // head top
const M = (el, c) => c === FUR5.remy ? withAttr(el, `fill="${c}"`)
  : c === FUR5.mica ? withAttr(el, `fill="${lg(c, mix(c, K.slate, 0.28), 1.9)}"`)
  : S(el, c, 0);
const INK = '#141C33'; // face features: a touch darker than Curio's navy
const HEADBOX = (y) => `<ellipse cx="${CX}" cy="${y + 61}" rx="72" ry="62"/>`;
const softBlush = (y, fur) => [41.5, 123.5].map((x) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="9.5" fill="${mix(fur, K.blush, 0.75)}"/>`).join('');
const tinyNose = (y, col) => F(`<path d="M${CX - 6.5} ${y} h13 q-2 5.5 -6.5 7 q-4.5 -1.5 -6.5 -7Z"/>`, col, mix(col, K.slate, 0.35));
const EYE_X = [55.5, 109.5];
const EXPR = ['happy', 'laugh', 'wow', 'worried', 'sleepy', 'think'];
function eyesEx(ey, ex) { // ey = top of a normal eye
  const cy = ey + 14;
  const pill = (x, dx = 0, dy = 0, h = 28) => `<rect x="${x - 9.5 + dx}" y="${cy - h / 2 + dy}" width="19" height="${h}" rx="9.5" fill="${INK}"/>`;
  const arc = (x, up) => `<path d="M${x - 10} ${cy + (up ? 5 : -2)} q10 ${up ? -14 : 12} 20 0" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  const brow = (d) => `<path d="${d}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  switch (ex) {
    case 'laugh': return EYE_X.map((x) => arc(x, true)).join('');
    case 'wow': return EYE_X.map((x) => `<ellipse cx="${x}" cy="${cy}" rx="11.5" ry="16" fill="${INK}"/>`).join('');
    case 'worried': return EYE_X.map((x) => pill(x, 0, 3, 24)).join('') + brow(`M46 ${ey - 2} L63 ${ey - 8}`) + brow(`M102 ${ey - 8} L119 ${ey - 2}`);
    case 'sleepy': return EYE_X.map((x) => arc(x, false)).join('');
    case 'think': return EYE_X.map((x) => pill(x, 4, -4, 26)).join('') + brow(`M103 ${ey - 9} q8 -6 16 -1`);
    default: return EYE_X.map((x) => pill(x)).join('');
  }
}
function mouthEx(my, ex) {
  const st = (d, w = 2.8) => `<path d="${d}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  switch (ex) {
    case 'laugh': return `<path d="M${CX - 9} ${my} h18 q-1 11 -9 11 q-8 0 -9 -11Z" fill="${INK}"/><ellipse cx="${CX}" cy="${my + 8}" rx="4.5" ry="2.6" fill="#FF8FA6"/>`;
    case 'wow': return `<ellipse cx="${CX}" cy="${my + 4}" rx="5" ry="6" fill="${INK}"/>`;
    case 'worried': return st(`M${CX - 8} ${my + 3} q2 -3 4 0 t4 0 t4 0 t4 0`, 2.4);
    case 'sleepy': return `<ellipse cx="${CX}" cy="${my + 3}" rx="3" ry="3.5" fill="${INK}"/>`;
    case 'think': return st(`M${CX - 3} ${my + 3} h9`);
    default: return st(`M${CX - 7} ${my} q7 6 14 0`);
  }
}
function face(w, ex) {
  const y = HY[w], fur = FUR5[w];
  if (w === 'bram') return M(`<ellipse cx="${CX}" cy="${y + 87}" rx="20" ry="15"/>`, '#F7E6CC') + softBlush(y + 88, fur) + eyesEx(y + 56, ex)
    + S(`<rect x="${CX - 6.5}" y="${y + 75}" width="13" height="9" rx="4.5"/>`, INK, 1.5, 0.4) + mouthEx(y + 91, ex);
  return softBlush(y + 88, fur) + eyesEx(y + 56, ex) + tinyNose(y + 74, '#FF9AB0') + mouthEx(y + 89, ex);
}
const flip = (el) => `<g transform="translate(165 0) scale(-1 1)">${el}</g>`;
const dogEar = (x, r) => M(`<rect x="${x}" y="56" width="30" height="62" rx="15" transform="rotate(${r} ${x + 15} 60)"/>`, '#A9693B');
const rabbitEar = (x, r, inner = true, c = FUR5.remy) => `<g transform="rotate(${r} ${x + 14} 66)">${M(`<rect x="${x}" y="0" width="28" height="72" rx="14"/>`, c)}`
  + (inner ? F(`<rect x="${x + 9}" y="12" width="10" height="44" rx="5"/>`, '#F5A9BA', mix('#F5A9BA', K.slate, 0.25)) : '') + '</g>';
const catEar = (inner = true, c = FUR5.mica) => M('<path d="M16 90 L22 24 Q24 14 34 20 L78 52Z"/>', c) + (inner ? F('<path d="M28 68 L31 36 L58 54Z"/>', '#F5A9BA', '#D9839A') : '');
function headFront(w, ex = 'happy', back = false) {
  const hb = M(HEADBOX(HY[w]), FUR5[w]), f = back ? '' : face(w, ex);
  if (w === 'bram') return hb + f + dogEar(5, 3) + dogEar(130, -3);
  if (w === 'remy') return rabbitEar(36, -10, !back) + rabbitEar(101, 10, !back) + hb + f;
  return catEar(!back) + flip(catEar(!back)) + hb + f;
}
function headSide(w) { // facing right
  const y = HY[w], fur = FUR5[w], hb = M(HEADBOX(y), fur), bl = mix(fur, K.blush, 0.75);
  const mouth = (x, my) => `<path d="M${x} ${my} q5 5 10 0" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`;
  if (w === 'bram') return hb + `<ellipse cx="127" cy="${y + 90}" rx="10" ry="9" fill="${bl}"/>`
    + `<rect x="109" y="${y + 56}" width="16" height="28" rx="8" fill="${INK}"/>`
    + M(`<ellipse cx="141" cy="${y + 86}" rx="14" ry="11"/>`, '#F7E6CC')
    + S(`<rect x="148" y="${y + 77}" width="10" height="8" rx="4"/>`, INK, 1.5, 0.4) + mouth(136, y + 92)
    + dogEar(44, 10);
  const ears = w === 'remy'
    ? rabbitEar(48, -18, false, mix(fur, K.slate, 0.14)) + rabbitEar(64, -8)
    : `<g transform="translate(14 0)">${catEar(false, mix(fur, K.slate, 0.2))}</g><g transform="translate(-22 0)">${flip(catEar())}</g>`;
  return ears + hb + `<ellipse cx="127" cy="${y + 90}" rx="10" ry="9" fill="${bl}"/>`
    + `<rect x="109" y="${y + 56}" width="16" height="28" rx="8" fill="${INK}"/>`
    + F(`<ellipse cx="149" cy="${y + 77}" rx="4.5" ry="3.8"/>`, '#FF9AB0', '#E46F8C') + mouth(138, y + 89);
}
const catTail = (d) => `<path d="${d}" stroke="${lg(FUR5.mica, mix(FUR5.mica, K.slate, 0.35), 1)}" stroke-width="10" stroke-linecap="round"/>`;
const TAIL = { // front view: only the cat's tail shows (the others read as extra paws)
  bram: () => '', remy: () => '',
  mica: () => catTail('M106 204 Q140 208 138 180 Q137 166 127 168'),
};
const SIDE_TAIL = {
  bram: () => M('<rect x="54" y="162" width="12" height="32" rx="6" transform="rotate(-30 60 194)"/>', FUR5.bram),
  remy: () => M('<circle cx="58" cy="194" r="10"/>', FUR5.remy),
  mica: () => catTail('M64 200 Q30 206 32 176 Q33 160 44 162'),
};
const BACK_TAIL = {
  bram: () => M('<rect x="76.5" y="166" width="12" height="32" rx="6" transform="rotate(12 82.5 198)"/>', FUR5.bram),
  remy: () => M('<circle cx="82.5" cy="196" r="11"/>', FUR5.remy),
  mica: () => catTail('M82.5 200 Q47 206 49 176 Q50 160 61 162'),
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
    + glow('<rect x="-7" y="-20" width="14" height="4" rx="2"/>'),
  magnifier: () => S('<rect x="-3.5" y="-16" width="7" height="20" rx="3.5"/>', K.metalDark, 2, 0.6)
    + S('<circle cx="0" cy="-29" r="14"/>', K.metal, 4, 0.9) + screen('<circle cx="0" cy="-29" r="9"/>'),
};
const belt = (el, x, w) => clipTo(el, F(`<rect x="${x}" y="190" width="${w}" height="7"/>`, '#2A3A66', K.navy));
const OUTFIT = {
  bram: { top: PC.bram, pants: '#3E4B70', prop: 'wrench', extra: () => belt(BODY, 52, 61) },
  remy: { top: PC.remy, pants: '#3E4B70', prop: 'tablet', extra: () => clipTo(BODY, '<rect x="81" y="158" width="3" height="48" fill="#FFFFFF" opacity=".7"/>') },
  mica: { top: PC.mica, pants: '#3E4B70', prop: 'magnifier', extra: () => '' },
};
function crew(w, { aL = 16, aR = -40, ex = 'happy', prop = true } = {}) {
  const o = OUTFIT[w], fur = FUR5[w];
  const aRr = prop ? aR : -16;
  const [hx, hy] = hand5('R', aRr);
  const armL = G('arm-left', arm5('L', aL, o.top, fur)), raised = aL > 60; // a waving arm goes in front of the head
  return G('tail', TAIL[w]()) + G('legs', legs5(o.pants))
    + G('body', M(BODY, o.top) + o.extra() + amberPlate(86, 168, 16, 6) + glow('<circle cx="66" cy="171" r="3"/>'))
    + (raised ? '' : armL) + G('head', headFront(w, ex)) + (raised ? armL : '')
    + G('arm-right', arm5('R', aRr, o.top, fur))
    + (prop ? G('prop', `<g transform="translate(${hx.toFixed(1)} ${(hy + 3).toFixed(1)}) rotate(14) scale(.72)">${PROP[o.prop]()}</g>`
      + M(`<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="9"/>`, fur)) : '');
}
function crewSide(w) {
  const o = OUTFIT[w], fur = FUR5[w], torso = '<rect x="60" y="158" width="46" height="48" rx="20"/>';
  const legs = [[78, '#33405F', '#1F2C52'], [90, o.pants, '#2A3A66']].map(([x, p, bt]) =>
    M(`<rect x="${x - 9}" y="196" width="18" height="22" rx="9"/>`, p) + S(`<rect x="${x - 11}" y="212" width="30" height="21" rx="10"/>`, bt, 3, 0.5)).join('');
  return G('tail', SIDE_TAIL[w]()) + G('legs', legs)
    + G('body', M(torso, o.top) + (w === 'bram' ? belt(torso, 60, 46) : ''))
    + G('head', headSide(w))
    + G('arm', `<g transform="translate(86 168) rotate(-8)">${M('<rect x="-8" y="-5" width="16" height="30" rx="8"/>', o.top)}${M('<circle cx="0" cy="26" r="9"/>', fur)}</g>`);
}
function crewBack(w) {
  const o = OUTFIT[w], fur = FUR5[w];
  return G('legs', legs5(o.pants)) + G('body', M(BODY, o.top) + (w === 'bram' ? belt(BODY, 52, 61) : ''))
    + G('arms', arm5('L', 16, o.top, fur) + arm5('R', -16, o.top, fur))
    + G('head', headFront(w, 'happy', true)) + G('tail', BACK_TAIL[w]());
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
// ---------- astronaut side + back views (for its character sheet) ----------
function astroSide(band = PC.generic) { // facing right, like the crew
  const suit = K.suit;
  const legs = [[78, '#C9CCD4', '#1F2C52'], [90, suit, '#2A3A66']].map(([x, c, bt]) =>
    S(`<rect x="${x - 11}" y="172" width="22" height="38" rx="11"/>`, c, 4, 0.8)
    + S(`<rect x="${x - 13}" y="206" width="34" height="26" rx="11"/>`, bt, 4, 0.5) + F(`<rect x="${x - 11}" y="224" width="30" height="5" rx="2.5"/>`, K.metalDark, K.slate)).join('');
  const armEl = '<rect x="-10" y="-6" width="20" height="40" rx="10"/>';
  return G('legs', legs)
    + G('backpack', S('<rect x="28" y="114" width="34" height="68" rx="13"/>', K.metalDark, 5, 0.7))
    + G('body', S('<rect x="54" y="122" width="60" height="64" rx="24"/>', suit, 7, 0.9)
      + S('<rect x="56" y="112" width="54" height="16" rx="8"/>', K.metalDark, 3, 0.7)
      + S('<rect x="104" y="140" width="13" height="25" rx="5"/>', '#C6CAD3', 2, 0.8))
    + G('helmet', S('<rect x="78" y="10" width="24" height="11" rx="5.5"/>', K.metalDark, 2.5, 0.8) + glow('<rect x="96" y="13" width="6" height="5" rx="2.5"/>')
      + S('<rect x="30" y="18" width="108" height="102" rx="44"/>', suit, 10, 1)
      + screen('<rect x="96" y="34" width="38" height="70" rx="19"/>')
      + '<rect x="104" y="44" width="16" height="7" rx="3.5" fill="#FFFFFF" opacity=".28"/>'
      + S('<rect x="50" y="52" width="30" height="44" rx="10"/>', K.metalDark, 5, 0.8))
    + G('arm', `<g transform="translate(84 134) rotate(-6)">${S(armEl, suit, 4, 0.75)}${clipTo(armEl, `<rect x="-10" y="6" width="20" height="7" fill="${band}"/>`)}${S('<circle cx="0" cy="36" r="11"/>', K.metalDark, 3, 0.7)}</g>`);
}
function astroBack(band = PC.generic) {
  const suit = K.suit;
  const armA = (side, a) => arm(side, a, suit, K.metalDark, { w: 20, len: 40, band });
  return G('legs', [66, 99].map((x) => S(`<rect x="${x - 11}" y="172" width="22" height="38" rx="11"/>`, suit, 4, 0.8) + boot(x, 206)).join(''))
    + G('body', S('<rect x="44" y="122" width="77" height="64" rx="24"/>', suit, 7, 0.9))
    + G('arm-left', armA('L', 10)) + G('arm-right', armA('R', -10))
    + G('helmet', S('<rect x="8" y="54" width="18" height="42" rx="6"/>', K.metalDark, 5, 0.8) + S('<rect x="139" y="54" width="18" height="42" rx="6"/>', K.metalDark, 5, 0.8)
      + S('<rect x="69" y="10" width="27" height="11" rx="5.5"/>', K.metalDark, 2.5, 0.8)
      + S('<rect x="22" y="18" width="121" height="102" rx="44"/>', suit, 10, 1))
    + G('backpack', S('<rect x="38" y="108" width="89" height="76" rx="20"/>', K.metalDark, 6, 0.75)
      + [124, 136].map((y) => `<rect x="58" y="${y}" width="49" height="6" rx="3" fill="#7F869D"/>`).join('')
      + amberPlate(60, 154, 22, 7) + glow('<circle cx="100" cy="157.5" r="3.4"/>')
      + `<rect x="58" y="168" width="49" height="6" rx="3" fill="${band}"/>`);
}
const FRAMES = {
  'idle-1': {}, 'idle-2': { bob: 1.5, aL: 12, aR: -12 },
  'walk-1': { aL: 22, aR: -5, lift: [7, 0], bob: -2 }, 'walk-2': { aL: 5, aR: -22, lift: [0, 7], bob: -2 },
  'wave-1': { aR: -118, tilt: -4 }, 'wave-2': { aR: -150, tilt: -4 },
};

// ---------- overview sheet ----------
const curioSrc = readFileSync(join(OUT, 'curio-original.svg'), 'utf8');
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

// ---------- Curio parts, cut from Bea's Figma export (exact shapes + gradients) ----------
const cPart = (a, b) => { const i = curioInner.indexOf(a), j = curioInner.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error(`curio part ${a}`); return curioInner.slice(i, j); };
const C_NECK = cPart('<g id="Rectangle 6">', '<g id="Rectangle 6_2">');
const C_BODY = cPart('<g id="Rectangle 6_2">', '<g id="Group 6">');
const C_TREAD = cPart('<g id="Group 6">', '<g id="Head">');
const C_ANT = cPart('<g id="Rectangle 6_3">', '<rect id="Rectangle 4"');
const C_PODS = cPart('<rect id="Rectangle 4"', '<rect id="Rectangle 1"');
const C_SHELL = curioInner.match(/<rect id="Rectangle 1"[^>]*\/>/)[0];
const C_SCREEN = curioInner.match(/<rect id="Rectangle 3"[^>]*\/>/)[0];
const C_PLATE = curioInner.match(/<rect id="Rectangle 8"[^>]*\/>/)[0];
const C_DEFS = curioInner.slice(curioInner.indexOf('<defs>'));
const C_FACE = curioInner.match(/<g id="Face 2">[\s\S]*?<g id="Group 2"[\s\S]*?<\/g>\s*<\/g>/)[0];
const curioSvg = (inner) => `<svg width="165" height="241" viewBox="0 0 165 241" fill="none">${inner}${C_DEFS}</svg>`;
const cGlowStroke = (d, w = 7) => `<path d="${d}" stroke="${K.cyan}" stroke-width="${w}" stroke-linecap="round"/><g filter="url(#soft)" opacity=".9"><path d="${d}" stroke="${K.cyanHi}" stroke-width="${w}" stroke-linecap="round"/></g>`;
function curioFace(ex) { // eye shapes on the screen; Curio has no mouth
  const cy = 81, xs = [60.5, 104.5];
  switch (ex) {
    case 'laugh': return cGlowStroke(xs.map((x) => `M${x - 10} ${cy + 6} q10 -18 20 0`).join(' '));
    case 'wow': return xs.map((x) => `<circle cx="${x}" cy="${cy}" r="11" stroke="${K.cyan}" stroke-width="6"/><g filter="url(#soft)"><circle cx="${x}" cy="${cy}" r="11" stroke="${K.cyanHi}" stroke-width="6"/></g>`).join('');
    case 'worried': return glow(`<rect x="56" y="67" width="9" height="28" rx="4.5" transform="rotate(20 60.5 81)"/>`) + glow(`<rect x="100" y="67" width="9" height="28" rx="4.5" transform="rotate(-20 104.5 81)"/>`);
    case 'sleepy': return cGlowStroke(xs.map((x) => `M${x - 10} ${cy + 2} h20`).join(' '));
    case 'think': return glow('<rect x="56" y="65" width="9" height="32" rx="4.5"/>') + glow('<rect x="100" y="76" width="9" height="12" rx="4.5"/>');
    default: return C_FACE;
  }
}
const curioFront = (ex = 'happy') => curioSvg(curioInner.replace(/<defs>[\s\S]*$/, '').replace(C_FACE, curioFace(ex)));
const curioSide = () => curioSvg(C_NECK + C_BODY + C_TREAD + C_ANT
  + '<rect x="47" y="42" width="70" height="78" rx="25" fill="url(#paint16_linear_4_183)" stroke-width="10" stroke="url(#paint17_linear_4_183)"/>'
  + '<rect x="66" y="58" width="30" height="45" rx="11" fill="url(#paint14_linear_4_183)" stroke-width="8" stroke="url(#paint15_linear_4_183)"/>'
  + '<rect x="108" y="50" width="10" height="62" rx="5" fill="url(#paint18_linear_4_183)"/>' + glow('<rect x="111" y="64" width="4" height="34" rx="2"/>'));
const curioBack = () => curioSvg(C_NECK + C_BODY + C_TREAD + C_ANT + C_PODS + C_SHELL
  + '<rect x="34" y="49" width="97" height="64" rx="21" fill="#C3C7D0"/>'
  + [66, 78, 90].map((y) => `<rect x="56" y="${y}" width="53" height="5" rx="2.5" fill="#9AA0AE"/>`).join(''));
void C_SCREEN; void C_PLATE;

// ---------- character sheets ----------
const SHEET = {
  bram: { name: 'Bram', accent: PC.bram, info: 'Dog · base systems (engineering background)',
    about: 'Practical and reassuring; loves a well-made plan. Labels every tool, even the obvious wrench.',
    palette: [['fur', FUR5.bram], ['ears', '#A9693B'], ['muzzle', '#F7E6CC'], ['top', PC.bram], ['pants', '#3E4B70'], ['boots', '#2A3A66'], ['blush', mix(FUR5.bram, K.blush, 0.75)], ['face', INK]] },
  remy: { name: 'Remy', accent: PC.remy, info: 'Rabbit · crew health (medical background)',
    about: 'Warm, brisk and composed. Likes joining the work outside; draws the places the crew visits.',
    palette: [['fur (flat)', FUR5.remy], ['inner ear', '#F5A9BA'], ['nose', '#FF9AB0'], ['top', PC.remy], ['pants', '#3E4B70'], ['boots', '#2A3A66'], ['blush', mix(FUR5.remy, K.blush, 0.75)], ['face', INK]] },
  mica: { name: 'Mica', accent: PC.mica, info: 'Cat · exploring (geology background) · species still open',
    about: 'Observant and thoughtful, with bursts of excitement over a tiny clue. Nicknames every rock sample.',
    palette: [['fur', FUR5.mica], ['inner ear', '#F5A9BA'], ['nose', '#FF9AB0'], ['top', PC.mica], ['pants', '#3E4B70'], ['boots', '#2A3A66'], ['blush', mix(FUR5.mica, K.blush, 0.75)], ['face', INK]] },
  astro: { name: 'Astronaut', accent: '#5D6785', info: 'Placeholder suit · stands in for any crew member or the player until suits are final',
    about: '', bands: Object.entries(PC),
    palette: [['suit', K.suit], ['suit shade', '#A5ABB7'], ['dark metal', K.metalDark], ['chest box', '#C6CAD3'], ['visor', K.screenA], ['visor light', K.screenB], ['lamp + light', K.cyan], ['plate', K.amberA]] },
  curio: { name: 'Curio', accent: K.screenB, info: 'Helper AI robot · original design by Bea (Figma)',
    about: 'Curious, patient, slightly literal. Turns confusing readings into questions; never drives or decides.',
    palette: [['shell', '#D9D9D9'], ['shade', '#7F869D'], ['dark metal', '#4F5772'], ['tread', '#626570'], ['screen', K.screenA], ['screen light', K.screenB], ['eyes', K.cyan], ['plate', K.amberA]] },
};
const EXLABEL = { happy: 'happy', laugh: 'laugh', wow: 'wow', worried: 'worried', sleepy: 'sleepy', think: 'thinking' };
const sec = (x, y, t) => `<text x="${x}" y="${y}" font-size="15" letter-spacing="2.5" fill="#8A91A5" ${FONT}>${t}</text>`;
function exprTile(x, y, key, ex, size = 190) {
  const tint = mix(SHEET[key].accent, '#FFFFFF', 0.8);
  const art = key === 'curio'
    ? `<g transform="translate(${size / 2} ${size / 2 + 6}) scale(1.05) translate(-82.5 -81)">${curioFront(ex)}</g>`
    : `<g transform="translate(${size / 2} 100) translate(${-CX} ${-(HY[key] + 61)})">${crew(key, { ex, prop: false })}</g>`;
  const halo = 'stroke="#FFFFFF" stroke-width="5" paint-order="stroke" stroke-linejoin="round"'; // readable over ears
  const deco = { sleepy: `<text x="${size - 52}" y="46" font-size="30" fill="${INK}" opacity=".6" ${halo} ${FONT}>z</text><text x="${size - 32}" y="30" font-size="20" fill="${INK}" opacity=".5" ${halo} ${FONT}>z</text>`,
    think: `<text x="${size - 44}" y="48" font-size="36" fill="${INK}" ${halo} ${FONT}>?</text>`,
    wow: `<text x="${size - 40}" y="48" font-size="36" fill="${INK}" ${halo} ${FONT}>!</text>` }[ex] || '';
  const box = `<rect x="0" y="0" width="${size}" height="${size}" rx="40"/>`;
  return `<g transform="translate(${x} ${y})">${clipTo(box, `<rect width="${size}" height="${size}" fill="${tint}"/>${art}${deco}`)}</g>`
    + `<text x="${x + size / 2}" y="${y + size + 30}" text-anchor="middle" font-size="18" fill="#3A4258" ${FONT}>${EXLABEL[ex]}</text>`;
}
function frameTile(x, y, f, p, size = 190) {
  const box = `<rect x="0" y="0" width="${size}" height="${size}" rx="40"/>`;
  return `<g transform="translate(${x} ${y})">${clipTo(box, `<rect width="${size}" height="${size}" fill="${mix('#5D6785', '#FFFFFF', 0.82)}"/>`
    + `<ellipse cx="${size / 2}" cy="${size - 14}" rx="38" ry="4" fill="${K.navy}" opacity=".12"/>` + place(size / 2 - CX * 0.72, 8, astronaut(PC.generic, p), 0.72))}</g>`
    + `<text x="${x + size / 2}" y="${y + size + 30}" text-anchor="middle" font-size="18" fill="#3A4258" ${FONT}>${f}</text>`;
}
function charSheet(key) {
  begin();
  const d = SHEET[key], W = 1500, H = 900, tint = mix(d.accent, '#FFFFFF', 0.75);
  const isC = key === 'curio', isA = key === 'astro';
  const hero = isA ? astronaut(PC.generic, FRAMES['wave-2']) : isC ? curioFront('laugh') : crew(key, { ex: 'laugh', aL: 112 });
  const views = isA ? [astronaut(), astroSide(), astroBack()] : isC ? [curioFront(), curioSide(), curioBack()] : [crew(key, { prop: false }), crewSide(key), crewBack(key)];
  let b = `<rect width="${W}" height="${H}" fill="#F7F8FB"/><rect width="${W}" height="10" fill="${d.accent}"/>`
    + `<text x="60" y="98" font-size="64" fill="${d.accent}" ${FONT}>${d.name}</text>`
    + `<text x="62" y="132" font-size="20" fill="#5B6378" ${BODYFONT}>${d.info}</text>`;
  // hero
  b += `<ellipse cx="${65 + CX * 1.5}" cy="${172 + 236 * 1.5}" rx="75" ry="8" fill="${K.navy}" opacity=".12"/>` + place(65, 172, hero, 1.5);
  // turnaround
  b += sec(400, 172, 'TURNAROUND');
  [214, 214 + 132, 424].forEach((gy) => { b += `<line x1="390" y1="${gy}" x2="1010" y2="${gy}" stroke="${tint}" stroke-width="3" stroke-linecap="round"/>`; });
  views.forEach((v, i) => { const x = 405 + i * 210; b += place(x, 190, v) + `<text x="${x + CX}" y="458" text-anchor="middle" font-size="17" fill="#3A4258" ${FONT}>${['front', 'side', 'back'][i]}</text>`; });
  // palette
  b += sec(1075, 172, 'PALETTE');
  d.palette.forEach(([n, c], i) => { const x = 1075 + (i % 2) * 190, y = 215 + Math.floor(i / 2) * 64;
    b += `<circle cx="${x + 20}" cy="${y}" r="20" fill="${c}" stroke="#000" stroke-opacity=".08"/>`
      + `<text x="${x + 50}" y="${y - 3}" font-size="16" fill="#3A4258" ${FONT}>${n}</text><text x="${x + 50}" y="${y + 16}" font-size="13" fill="#8A91A5" ${BODYFONT}>${c}</text>`; });
  if (d.bands) { b += sec(1075, 470, 'ARM-BAND COLOURS'); d.bands.forEach(([k, c], i) => { const x = 1095 + i * 72; b += `<circle cx="${x}" cy="502" r="16" fill="${c}"/><text x="${x}" y="538" text-anchor="middle" font-size="13" fill="#5B6378" ${BODYFONT}>${k === 'cmdr' ? 'you' : k}</text>`; }); }
  if (d.about) b += `<text x="1075" y="${215 + 4 * 64 + 4}" font-size="15" fill="#5B6378" ${BODYFONT}>`
    + wrapLines(d.about, 44).map((l, i) => `<tspan x="1075" dy="${i ? 21 : 0}">${l}</tspan>`).join('') + '</text>';
  // expressions
  b += sec(60, 580, isA ? 'ANIMATION FRAMES' : 'EXPRESSIONS');
  if (isA) Object.entries(FRAMES).forEach(([f, p], i) => { b += frameTile(60 + i * 228, 600, f, p); });
  else EXPR.forEach((ex, i) => { b += exprTile(60 + i * 228, 600, key, ex); });
  const note = isA ? 'Faceless visor, so one sprite fits anyone · the arm band (and backpack stripe) carries the crew colour · 165×241 canvas, same as Curio.'
    : isC ? 'Front view is Bea\'s Figma file, unchanged. Side, back and eye expressions are drafts in her style. Eyes only, no mouth.'
    : 'Round head ≈ 2.4× the body · face sits just below the middle · matte fur and cloth (no shine rim) · metal keeps Curio\'s bevel.';
  b += `<text x="60" y="${H - 28}" font-size="15" fill="#8A91A5" ${BODYFONT}>${note}</text>`;
  return finish(W, H, b);
}
function wrapLines(t, n) { const out = []; let cur = ''; for (const w of t.split(' ')) { if ((cur + ' ' + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += ' ' + w; } if (cur.trim()) out.push(cur.trim()); return out; }

// ---------- write files ----------
const write = (rel, svg) => { const p = join(OUT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, svg); return 1; };
const NAME = { cmdr: 'commander', astro: 'astronaut' };
let n = 0;
n += write('crew-lineup.svg', sheet());
// export/: one Figma-ready SVG per crew member (165x241, transparent, named layers)
for (const w of ['bram', 'remy', 'mica']) { begin(); n += write(`export/${w}.svg`, finish(165, 241, G(w, crew(w)))); }
begin(); n += write('export/curio.svg', finish(165, 241, G('curio', curioFront())));
begin(); n += write('export/astronaut.svg', finish(165, 241, G('astronaut', astronaut())));
for (const [f, p] of Object.entries(FRAMES)) { begin(); n += write(`export/astronaut-frames/astronaut-${f}.svg`, finish(165, 241, G(`astronaut-${f}`, astronaut(PC.generic, p)))); }
begin();
n += write('export/astronaut-frames/astronaut-frames-strip.svg', finish(165 * 6, 241, Object.entries(FRAMES).map(([f, p], i) => G(`frame-${i + 1}-${f}`, place(i * 165, 0, astronaut(PC.generic, p)))).join('')));
for (const [k, c] of Object.entries(PC)) { begin(); n += write(`export/astronaut-colours/astronaut-${NAME[k] || k}.svg`, finish(165, 241, G(`astronaut-${NAME[k] || k}`, astronaut(c)))); }
for (const k of ['bram', 'remy', 'mica', 'curio', 'astro']) n += write(`sheets/${NAME[k] || k}-sheet.svg`, charSheet(k));
console.log(`crew-v5: ${n} files`);

// Chibi crew (v3): small, cute, flat. Run: node ideas/character-designs/chibi-v3/build.mjs
// Style traits taken from Bea's references (not their characters): big head ~60% of height,
// tiny stub body/limbs, dot eyes, blush, no outlines, bright flat fills, one darker tone.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
const FONT = `font-family="Nunito, 'Arial Rounded MT Bold', system-ui, sans-serif" font-weight="800"`;

const C = {
  eye: '#2B1F1A', blush: '#FF8FA0', ink: '#1F2B4A',
  suit: '#2DAAB5', suitDark: '#21899A', shoe: '#FFFFFF',
  eva: '#F8F6F1', evaShade: '#E2DDD2', evaNavy: '#2A3A66', glass: '#BDEBF5',
  amber: '#FFB838', amberDark: '#E08E12', pink: '#FF7F9E', screen: '#1F2B4A', pixel: '#6FE7EF',
};
const FUR = {
  bram: { main: '#F0A04F', dark: '#A65A26', light: '#FFE6C4', patch: '#D9852F', nose: '#3A2418' },
  remy: { main: '#CDD2DD', dark: '#A8AEBD', light: '#FFFFFF', inner: '#FFAFC0', nose: '#FF8FA6' },
  mica: { main: '#E2B93E', dark: '#7D6A23', light: '#FFF6E0', inner: '#F4D7B6', muzzle: '#3B2C26' },
  cmdr: { main: '#B9794C', dark: '#2A1D16', light: '#B9794C' },
};

// ---------- faces ----------
const ell = (cx, cy, rx, ry, f, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
const line = (d, col = C.eye, w = 3.2) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

function eyes(kind, cx, y, dx) {
  const L = cx - dx, R = cx + dx;
  const bean = (x, s = 1) => ell(x, y, 4.6 * s, 5.6 * s, C.eye);
  switch (kind) {
    case 'smile': return [L, R].map((x) => line(`M${x - 6} ${y + 2} Q${x} ${y - 6} ${x + 6} ${y + 2}`)).join('');
    case 'laugh': return line(`M${L - 5} ${y - 5} L${L + 4} ${y} L${L - 5} ${y + 5}`) + line(`M${R + 5} ${y - 5} L${R - 4} ${y} L${R + 5} ${y + 5}`);
    case 'wow': return [L, R].map((x) => bean(x, 1.25) + `<circle cx="${x + 2}" cy="${y - 2.5}" r="2" fill="#fff"/>`).join('');
    case 'worried': return bean(L) + bean(R) + line(`M${L - 7} ${y - 9} L${L + 5} ${y - 13}`, C.eye, 2.6) + line(`M${R + 7} ${y - 9} L${R - 5} ${y - 13}`, C.eye, 2.6);
    case 'wink': return bean(L) + line(`M${R - 6} ${y + 1} Q${R} ${y - 5} ${R + 6} ${y + 1}`);
    default: return bean(L) + bean(R);
  }
}
function mouth(kind, m, y, col = C.eye) {
  switch (kind) {
    case 'w': return line(`M${m - 7} ${y} Q${m - 3.5} ${y + 5} ${m} ${y} Q${m + 3.5} ${y + 5} ${m + 7} ${y}`, col, 2.6);
    case 'open': return `<path d="M${m - 9} ${y - 1} Q${m} ${y + 15} ${m + 9} ${y - 1}Z" fill="#7A2E3A"/>${ell(m, y + 6.5, 4.5, 2.6, '#FF8FA6')}`;
    case 'o': return ell(m, y + 3, 4, 5, '#7A2E3A');
    case 'wavy': return line(`M${m - 8} ${y + 2} q4 -4 8 0 q4 4 8 0`, col, 2.6);
    default: return line(`M${m - 7} ${y} Q${m} ${y + 7} ${m + 7} ${y}`, col, 2.8);
  }
}
const EXPR = {
  happy: ['dot', 'w'], smile: ['smile', 'smile'], laugh: ['laugh', 'open'],
  wow: ['wow', 'o'], worried: ['worried', 'wavy'], wink: ['wink', 'w'],
};
const blush = (cx, y, dx) => ell(cx - dx, y, 7, 4.5, C.blush, 'opacity=".55"') + ell(cx + dx, y, 7, 4.5, C.blush, 'opacity=".55"');

// ---------- heads (centre 100,108) ----------
const HEAD = {
  bram(ex) {
    const f = FUR.bram, [e, m] = EXPR[ex];
    return `${ell(100, 108, 49, 43, f.main)}
      ${ell(117, 101, 13, 12, f.patch)}
      ${ell(100, 128, 22, 15, f.light)}
      ${eyes(e, 100, 104, 17)}${blush(100, 120, 30)}
      ${ell(100, 119, 7.5, 5.2, f.nose)}
      ${mouth(m === 'w' ? 'w' : m, 100, 128)}
      <ellipse cx="58" cy="110" rx="14" ry="26" fill="${f.dark}" transform="rotate(14 58 110)"/>
      <ellipse cx="142" cy="110" rx="14" ry="26" fill="${f.dark}" transform="rotate(-14 142 110)"/>`;
  },
  remy(ex) {
    const f = FUR.remy, [e, m] = EXPR[ex];
    return `<g transform="rotate(-9 82 80)">${ell(82, 48, 13, 32, f.main)}${ell(82, 52, 6.5, 22, f.inner)}</g>
      <g transform="rotate(12 118 80)">${ell(118, 48, 13, 32, f.main)}${ell(118, 52, 6.5, 22, f.inner)}</g>
      ${ell(100, 110, 48, 42, f.main)}
      ${ell(90, 127, 12, 9, f.light)}${ell(110, 127, 12, 9, f.light)}
      ${eyes(e, 100, 106, 18)}${blush(100, 120, 31)}
      <path d="M95 117 h10 q-1.5 5 -5 6 q-3.5 -1 -5 -6Z" fill="${f.nose}"/>
      ${mouth(m, 100, 128)}`;
  },
  mica(ex) {
    const f = FUR.mica, [e, m] = EXPR[ex];
    return `${ell(56, 110, 11, 11, f.light)}${ell(56, 110, 5.5, 5.5, f.inner)}${ell(144, 110, 11, 11, f.light)}${ell(144, 110, 5.5, 5.5, f.inner)}
      ${ell(100, 108, 47, 43, f.main)}
      ${ell(100, 115, 35, 26, f.light)}
      <path d="M55 104 Q56 64 100 64 Q144 64 145 104 Q130 92 116 96 Q106 88 100 101 Q94 88 84 96 Q70 92 55 104Z" fill="${f.dark}"/>
      ${eyes(e, 100, 110, 16)}${blush(100, 122, 29)}
      ${ell(100, 130, 13, 10, f.muzzle)}
      ${mouth(m, 100, 130, f.light)}`;
  },
  cmdr(ex) {
    const f = FUR.cmdr, [e, m] = EXPR[ex];
    return `${ell(100, 100, 49, 45, f.dark)}
      ${ell(55, 114, 8.5, 9, f.main)}${ell(145, 114, 8.5, 9, f.main)}
      ${ell(100, 112, 44, 41, f.main)}
      <path d="M56 106 Q52 62 100 60 Q148 62 144 104 Q136 84 116 86 Q106 76 92 88 Q72 84 56 106Z" fill="${f.dark}"/>
      ${eyes(e, 100, 113, 17)}${blush(100, 127, 28)}
      ${mouth(m === 'w' ? 'smile' : m, 100, 128)}`;
  },
};

// ---------- bodies ----------
const ARM_LEN = 26;
const hand = (s, a) => [s[0] - ARM_LEN * Math.sin(a * Math.PI / 180), s[1] + ARM_LEN * Math.cos(a * Math.PI / 180)];
const SH = { L: [75, 160], R: [125, 160] };
const armG = (side, a, sleeve, paw) => `<g transform="translate(${SH[side]}) rotate(${a})"><rect x="-8.5" y="-6" width="17" height="32" rx="8.5" fill="${sleeve}" ${sleeve === C.eva ? `stroke="${C.evaShade}" stroke-width="2.5"` : ''}/><circle cx="0" cy="${ARM_LEN}" r="8.5" fill="${paw}"/></g>`;

const POSE = { rest: [16, -16], wave: [16, -125], up: [128, -128], hold: [16, -60], point: [16, -130] };

function tail(who, eva) {
  if (who === 'mica' && !eva) {
    const col = eva ? C.eva : FUR.mica.main;
    return `<path d="M124 196 Q172 204 170 160 Q168 128 146 134" stroke="${col}" stroke-width="11" fill="none" stroke-linecap="round"/>${eva ? '' : `<circle cx="146" cy="134" r="7" fill="${FUR.mica.dark}"/>`}`;
  }
  if (who === 'bram' && !eva) return `<path d="M128 194 Q152 192 152 170" stroke="${FUR.bram.main}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  return '';
}
const patch = (who) => ({
  bram: `<circle cx="114" cy="174" r="8" fill="#fff"/><path d="M110 172 l1 2 2.2 .3 -1.6 1.5 .4 2.2 -2 -1.1 -2 1.1 .4 -2.2 -1.6 -1.5 2.2 -.3Z M118 172 l1 2 2.2 .3 -1.6 1.5 .4 2.2 -2 -1.1 -2 1.1 .4 -2.2 -1.6 -1.5 2.2 -.3Z" fill="${C.amberDark}" transform="translate(0 -2)"/>`,
  remy: `<circle cx="114" cy="174" r="8" fill="#fff"/><path d="M114 179 l-5 -5 a2.8 2.8 0 0 1 5 -3.5 a2.8 2.8 0 0 1 5 3.5Z" fill="${C.pink}"/>`,
  mica: `<circle cx="114" cy="174" r="8" fill="#fff"/><path d="M109 177 l2 -5 4 -2 4 3 1 4Z" fill="#8E96A3"/>`,
  cmdr: `<circle cx="114" cy="174" r="8" fill="#fff"/><path d="M114 168 l1.8 3.6 4 .5 -2.9 2.8 .7 4 -3.6 -1.9 -3.6 1.9 .7 -4 -2.9 -2.8 4 -.5Z" fill="${C.amberDark}"/>`,
}[who]);

const helmetShape = (who) => who === 'remy' ? '<ellipse cx="100" cy="92" rx="60" ry="78"/>' : '<circle cx="100" cy="106" r="61"/>';

function crew(who, { ex = 'happy', pose = 'rest', eva = false, props = '', back = '', lift = 0 } = {}) {
  const f = FUR[who];
  const sleeve = eva ? C.eva : C.suit, paw = eva ? C.evaNavy : (who === 'cmdr' ? f.main : (who === 'mica' ? f.light : f.main));
  const [aL, aR] = POSE[pose];
  const body = `
    ${eva ? `<rect x="60" y="146" width="80" height="54" rx="18" fill="${C.evaShade}"/>` : ''}
    ${tail(who, eva)}
    <rect x="80" y="192" width="16" height="26" rx="8" fill="${eva ? C.eva : C.suitDark}"/>
    <rect x="104" y="192" width="16" height="26" rx="8" fill="${eva ? C.eva : C.suitDark}"/>
    ${ell(87, 220, 11.5, 7, eva ? C.evaNavy : C.shoe)}${ell(113, 220, 11.5, 7, eva ? C.evaNavy : C.shoe)}
    <rect x="68" y="140" width="64" height="66" rx="27" fill="${eva ? C.eva : C.suit}"/>
    ${eva ? `<rect x="86" y="176" width="28" height="8" rx="4" fill="${C.suit}"/><rect x="70" y="196" width="60" height="7" rx="3.5" fill="${C.evaNavy}"/>` : patch(who)}`;
  const head = HEAD[who](ex);
  const hs = helmetShape(who);
  const headPart = eva
    ? `${ell(100, 156, 34, 8, C.evaNavy)}<g transform="translate(0 -8) translate(100 108) scale(.9) translate(-100 -108)"><g fill="${C.glass}" opacity=".45">${hs}</g>${head}
       <g fill="none" stroke="#fff" stroke-width="4.5" opacity=".9">${hs}</g>
       <path d="${who === 'remy' ? 'M54 62 Q64 30 92 20' : 'M52 86 Q60 58 86 50'}" stroke="#fff" stroke-width="5.5" fill="none" stroke-linecap="round" opacity=".9"/></g>`
    : head;
  return `<g transform="translate(0 ${-lift})">${back}${body}${headPart}${armG('L', aL, sleeve, paw)}${armG('R', aR, sleeve, paw)}${props}</g>`;
}
const shadow = (lift = 0) => ell(100, 226, 42 - lift / 3, 5.5, '#000', 'opacity=".08"');

// ---------- props (placed at a hand) ----------
const at = ([x, y], inner, rot = 0) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">${inner}</g>`;
const P = {
  wrench: `<rect x="-3.5" y="-28" width="7" height="24" rx="3.5" fill="${C.amber}"/><path d="M-9 -28 v-9 a3 3 0 0 1 6 0 v5 h6 v-5 a3 3 0 0 1 6 0 v9 a5 5 0 0 1 -5 5 h-8 a5 5 0 0 1 -5 -5Z" fill="#9AA3B0"/>`,
  rock: `<path d="M-11 4 l3 -11 9 -5 9 5 2 11Z" fill="#8E96A3"/><path d="M-8 -7 l9 -5 4 7Z" fill="#B7BDC7"/>`,
  case: `<path d="M-6 -4 v-5 a4 4 0 0 1 4 -4 h4 a4 4 0 0 1 4 4 v5" stroke="${C.amberDark}" stroke-width="3.5" fill="none"/><rect x="-16" y="-4" width="32" height="24" rx="6" fill="${C.amber}"/><rect x="-11" y="1" width="16" height="13" rx="3" fill="#DDF4F7"/><rect x="7" y="1" width="8" height="9" rx="2" fill="#fff"/><text x="11" y="8.6" text-anchor="middle" font-size="7.5" fill="${C.ink}" ${FONT}>B</text>`,
  sparkle: (s = 1, col = C.amber) => `<path transform="scale(${s})" d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10Z" fill="${col}"/>`,
  heart: (col = C.pink) => `<path d="M0 9 l-9 -9 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6Z" fill="${col}"/>`,
  sweat: `<path d="M0 -8 Q7 2 0 6 Q-7 2 0 -8Z" fill="#8FD8F2"/>`,
  medPouch: `<rect x="96" y="194" width="24" height="18" rx="5" fill="${C.pink}"/><path d="M108 208 l-4.5 -4.5 a2.6 2.6 0 0 1 4.5 -3.2 a2.6 2.6 0 0 1 4.5 3.2Z" fill="#fff"/>`,
};

// ---------- Curio (helper AI avatar) ----------
const BITS = {
  eye: ['XXX', 'XXX', 'XXX'], arc: ['.X.', 'X.X'], gt: ['X..', '.X.', 'X..'], lt: ['..X', '.X.', '..X'],
  big: ['XXXX', 'XXXX', 'XXXX', 'XXXX'],
  smile: ['X....X', '.XXXX.'], open: ['XXXXXX', '.XXXX.'], o: ['XX', 'XX'], wavy: ['.X..X.', 'X.XX.X'],
};
const px = (bits, x0, y0, s = 4, col = C.pixel) => bits.flatMap((row, r) => [...row].map((ch, c) => ch === 'X' ? `<rect x="${x0 + c * s}" y="${y0 + r * s}" width="${s}" height="${s}" fill="${col}"/>` : '')).join('');
const CURIO_FACE = {
  happy: ['eye', 'eye', 'smile'], smile: ['arc', 'arc', 'smile'], laugh: ['gt', 'lt', 'open'],
  wow: ['big', 'big', 'o'], worried: ['eye', 'eye', 'wavy'],
};
function curioFace(ex) {
  const [l, r, m] = CURIO_FACE[ex];
  const w = (b) => BITS[b][0].length * 4, h = (b) => BITS[b].length * 4;
  return px(BITS[l], 82 - w(l) / 2, 88 - h(l) / 2) + px(BITS[r], 118 - w(r) / 2, 88 - h(r) / 2)
    + px(BITS[m], 100 - w(m) / 2, 102) + `<rect x="68" y="98" width="8" height="4" fill="${C.pink}" opacity=".7"/><rect x="124" y="98" width="8" height="4" fill="${C.pink}" opacity=".7"/>`;
}
function curio(ex = 'happy', { tilt = -6, lift = 0 } = {}) {
  return `<g transform="translate(0 ${-lift})">
    <rect x="95" y="124" width="10" height="56" rx="5" fill="${C.evaShade}"/>
    <rect x="48" y="172" width="104" height="34" rx="15" fill="${C.eva}"/>
    <rect x="48" y="192" width="104" height="14" rx="7" fill="${C.evaShade}"/>
    <rect x="112" y="180" width="28" height="7" rx="3.5" fill="${C.suit}"/>
    <path d="M62 172 a9 9 0 0 1 18 0Z" fill="${C.amber}"/>
    ${[62, 100, 138].map((x) => `<circle cx="${x}" cy="212" r="14" fill="${C.ink}"/><circle cx="${x}" cy="212" r="5" fill="${C.eva}"/>`).join('')}
    <g transform="rotate(${tilt} 100 124)">
      <circle cx="100" cy="50" r="10" fill="${C.eva}"/><circle cx="100" cy="50" r="4.5" fill="${C.screen}"/>
      <rect x="46" y="54" width="108" height="78" rx="28" fill="${C.eva}"/>
      <rect x="40" y="80" width="10" height="22" rx="5" fill="${C.evaShade}"/><rect x="150" y="80" width="10" height="22" rx="5" fill="${C.evaShade}"/>
      <rect x="56" y="64" width="88" height="58" rx="20" fill="${C.screen}"/>
      ${curioFace(ex)}
    </g></g>`;
}
const curioPanel = (ex) => `<rect x="14" y="20" width="172" height="210" rx="30" fill="${C.ink}"/>
  <rect x="26" y="32" width="148" height="186" rx="22" fill="none" stroke="${C.pixel}" stroke-width="2" stroke-dasharray="3 6" opacity=".45"/>
  <g transform="translate(100 140) scale(.78) translate(-100 -130)">${curio(ex)}</g>
  <path d="M120 30 h40 a12 12 0 0 1 12 12 v10 a12 12 0 0 1 -12 12 h-22 l-8 8 v-8 h-10 a12 12 0 0 1 -12 -12 v-10 a12 12 0 0 1 12 -12Z" fill="#fff"/>
  <text x="140" y="56" text-anchor="middle" font-size="20" fill="${C.ink}" ${FONT}>?</text>`;

// ---------- sheet ----------
const ORDER = ['curio', 'bram', 'remy', 'mica', 'cmdr'];
const NAME = { curio: ['Curio', 'helper AI'], bram: ['Bram', 'base systems'], remy: ['Remy', 'crew health'], mica: ['Mica', 'exploring'], cmdr: ['You', 'commander'] };
const COLW = 236, X0 = 30;

function row1(w) {
  return w === 'curio' ? curio('happy') : crew(w, { ex: 'happy' });
}
function row2(w) {
  if (w === 'curio') return curioPanel('wow');
  if (w === 'bram') return crew(w, { eva: true, pose: 'hold', ex: 'happy', props: at(hand(SH.R, -60), P.wrench, 20) });
  if (w === 'remy') return crew(w, { eva: true, pose: 'wave', ex: 'smile', props: P.medPouch });
  if (w === 'mica') return crew(w, { eva: true, pose: 'hold', ex: 'happy', props: at(hand(SH.R, -60), P.case, 0) });
  return crew(w, { eva: true, pose: 'point', ex: 'happy', props: at([166, 64], P.sparkle(0.9)) });
}
function row3(w) {
  if (w === 'curio') return curio('laugh', { tilt: 6 }) + at([162, 44], P.sparkle(0.8)) + at([40, 64], P.sparkle(0.55, C.pink));
  if (w === 'bram') return crew(w, { ex: 'worried', pose: 'hold', props: at(hand(SH.R, -60), P.wrench, 25) + at([150, 70], P.sweat) });
  if (w === 'remy') return crew(w, { ex: 'smile', pose: 'rest', props: at([150, 66], P.heart()) + at([46, 82], P.heart('#FFB3C4'), -15) });
  if (w === 'mica') return crew(w, { ex: 'wow', pose: 'hold', props: at(hand(SH.R, -60), P.rock) + at([156, 128], P.sparkle(0.7)) + at([168, 150], P.sparkle(0.45, C.pixel)) });
  return crew(w, { ex: 'laugh', pose: 'up', lift: 12, props: at([40, 60], P.sparkle(0.8)) + at([162, 54], P.sparkle(0.6, C.pink)) });
}

function sheet() {
  const heading = (y, t, sub) => `<text x="${X0 + 10}" y="${y}" font-size="17" fill="${C.ink}" ${FONT} letter-spacing="1.5">${t}</text>
    <text x="${X0 + 10}" y="${y + 20}" font-size="13" fill="#7A8090" font-family="Nunito, system-ui, sans-serif" font-weight="600">${sub}</text>`;
  const rowAt = (y, fn, shadows = true) => ORDER.map((w, i) => `<g transform="translate(${X0 + i * COLW + 18} ${y})">${shadows && !(w === 'curio' && fn === row2) ? shadow() : ''}${fn(w)}</g>`).join('');
  const names = ORDER.map((w, i) => {
    const cx = X0 + i * COLW + 118;
    return `<text x="${cx}" y="418" text-anchor="middle" font-size="26" fill="${C.ink}" ${FONT}>${NAME[w][0]}</text>
      <text x="${cx}" y="440" text-anchor="middle" font-size="14" fill="#7A8090" font-family="Nunito, system-ui, sans-serif" font-weight="700">${NAME[w][1]}</text>`;
  }).join('');
  const sw = ['#2DAAB5', '#F8F6F1', '#2A3A66', '#FFB838', '#FF7F9E', '#6FE7EF', '#F0A04F', '#CDD2DD', '#E2B93E', '#B9794C']
    .map((c, i) => `<rect x="${X0 + 10 + i * 46}" y="1100" width="38" height="22" rx="6" fill="${c}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1150" width="1240" height="1150">
  <rect width="1240" height="1150" fill="#F3F1EC"/>
  <rect width="1240" height="96" fill="${C.suit}"/>
  <text x="${X0 + 10}" y="62" font-size="40" fill="#fff" ${FONT} letter-spacing="1">Meet the crew</text>
  <text x="1210" y="58" text-anchor="end" font-size="15" fill="#E6FBFF" font-family="Nunito, system-ui, sans-serif" font-weight="700">chibi v3 · draft for review</text>
  ${heading(134, 'INSIDE THE BASE', 'Default look. Flight suit, no helmet.')}
  ${rowAt(150, row1)}${names}
  ${heading(490, 'OUTSIDE', 'Helmet + white suit. Curio stays on screen in its help panel.')}
  ${rowAt(516, row2)}
  ${heading(800, 'FEELINGS', 'Worried · happy · wow · cheering. Curio uses pixel faces.')}
  ${rowAt(830, row3)}
  ${sw}
</svg>\n`;
}

writeFileSync(join(OUT, 'crew-chibi.svg'), sheet());
for (const w of ORDER) writeFileSync(join(OUT, `chibi-${w}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 10 160 225" width="160" height="225">${row1(w)}</svg>\n`);
console.log('wrote', OUT);

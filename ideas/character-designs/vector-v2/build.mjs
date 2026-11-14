// Generates the crew clip-art SVGs (vector-v2). Run: node ideas/character-designs/vector-v2/build.mjs
// All characters share one part library so the three style versions stay consistent.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));

const C = {
  ivory: '#F5EFE2', ivoryShade: '#E1D6BF', navy: '#1F2B4A', ink: '#18213A',
  teal: '#2E9E95', tealLight: '#A6DCD7', amber: '#F2A93B', amberDark: '#C98420',
  glass: '#D6EAF0', glassRim: '#EEF6F8', steel: '#8F9AA8', paper: '#FBF8F2', eye: '#1D1A1A',
};
const FONT = `font-family="Nunito, 'Arial Rounded MT Bold', 'Helvetica Rounded', system-ui, sans-serif" font-weight="800"`;

let uid = 0;
const id = (p) => `${p}${++uid}`;

// ---------- heads (drawn around helmet centre 130,118) ----------
const eyes = (y, dx = 15, r = 5.2, cx = 130) => [cx - dx, cx + dx].map((x) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.eye}"/><circle cx="${x + 1.8}" cy="${y - 1.9}" r="${r * 0.33}" fill="#fff"/>`).join('');

const HEADS = {
  bram: () => `
    <ellipse cx="130" cy="118" rx="40" ry="37" fill="#D9A15F"/>
    <path d="M100 96 Q130 86 160 96 Q150 106 130 104 Q110 106 100 96Z" fill="#C88C4C"/>
    <ellipse cx="130" cy="139" rx="24" ry="17" fill="#F3D5A6"/>
    ${eyes(114)}
    <path d="M108 104 q6 -4 12 -1 M140 103 q6 -3 12 1" stroke="#7A4A28" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="130" cy="130" rx="8.5" ry="6" fill="#2A1D18"/><ellipse cx="127.5" cy="128" rx="2.4" ry="1.4" fill="#fff" opacity=".7"/>
    <path d="M130 136 v5 M119 141 Q124.5 148 130 141 Q135.5 148 141 141" stroke="#2A1D18" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 98 Q84 100 86 132 Q88 156 100 150 Q104 128 104 104Z" fill="#7E4B2A"/>
    <path d="M160 98 Q176 100 174 132 Q172 156 160 150 Q156 128 156 104Z" fill="#7E4B2A"/>`,
  remy: () => `
    <g transform="rotate(-7 113 92)"><ellipse cx="113" cy="66" rx="12.5" ry="35" fill="#B9BEC9"/><ellipse cx="113" cy="69" rx="6" ry="25" fill="#F0B4BF"/></g>
    <g transform="rotate(7 147 92)"><ellipse cx="147" cy="66" rx="12.5" ry="35" fill="#B9BEC9"/><ellipse cx="147" cy="69" rx="6" ry="25" fill="#F0B4BF"/></g>
    <ellipse cx="130" cy="126" rx="40" ry="35" fill="#BDC2CC"/>
    <ellipse cx="121" cy="142" rx="13" ry="10" fill="#F3F4F6"/><ellipse cx="139" cy="142" rx="13" ry="10" fill="#F3F4F6"/>
    ${eyes(121)}
    <circle cx="104" cy="134" r="5" fill="#F0B4BF" opacity=".55"/><circle cx="156" cy="134" r="5" fill="#F0B4BF" opacity=".55"/>
    <path d="M125 133 h10 q-1 6 -5 7 q-4 -1 -5 -7Z" fill="#E98A9C"/>
    <path d="M130 140 v3 M123 145 Q126.5 149 130 143 Q133.5 149 137 145" stroke="#5B5560" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  mica: () => `
    <circle cx="89" cy="124" r="13" fill="#F4E6C8"/><circle cx="89" cy="124" r="6.5" fill="#E2C2A0"/>
    <circle cx="171" cy="124" r="13" fill="#F4E6C8"/><circle cx="171" cy="124" r="6.5" fill="#E2C2A0"/>
    <ellipse cx="130" cy="120" rx="41" ry="38" fill="#B09A3E"/>
    <ellipse cx="130" cy="129" rx="34" ry="28" fill="#F6EAD2"/>
    <path d="M90 116 Q90 80 130 80 Q170 80 170 116 Q160 104 148 108 Q138 102 130 116 Q122 102 112 108 Q100 104 90 116Z" fill="#9A852F"/>
    ${eyes(122, 15, 5.6)}
    <ellipse cx="130" cy="142" rx="14" ry="11" fill="#3B2C26"/>
    <circle cx="127" cy="137" r="1.5" fill="#6B5A50"/><circle cx="133" cy="137" r="1.5" fill="#6B5A50"/>
    <path d="M123 144 Q130 150 137 144" stroke="#F6EAD2" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  cmdr: () => `
    <ellipse cx="130" cy="112" rx="42" ry="40" fill="#2B1E17"/>
    <circle cx="93" cy="126" r="8" fill="#9E6643"/><circle cx="167" cy="126" r="8" fill="#9E6643"/>
    <ellipse cx="130" cy="125" rx="36" ry="37" fill="#A8704A"/>
    <path d="M92 122 Q88 80 130 79 Q172 80 168 120 Q162 100 146 101 Q136 92 124 103 Q106 98 92 122Z" fill="#2B1E17"/>
    <path d="M110 116 q6 -4 12 -1 M138 115 q6 -3 12 1" stroke="#2B1E17" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${eyes(127, 14, 4.8)}
    <circle cx="110" cy="140" r="6" fill="#C2734F" opacity=".45"/><circle cx="150" cy="140" r="6" fill="#C2734F" opacity=".45"/>
    <path d="M130 128 q2 6 -2 8" stroke="#7F4E31" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M120 144 Q130 152 140 144" stroke="#4A2A1C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
};

// helmet shape per character (rabbit gets a taller dome for the ears)
const HELMET = { bram: 'c', mica: 'c', cmdr: 'c', remy: 'tall' };
const helmetPath = (kind) => kind === 'tall'
  ? '<ellipse cx="130" cy="106" rx="70" ry="86"/>'
  : '<circle cx="130" cy="118" r="72"/>';

function helmet(who, { rim = C.glassRim, rimStroke = null } = {}) {
  const clip = id('hc');
  const shape = helmetPath(HELMET[who]);
  const tall = HELMET[who] === 'tall';
  return `
  <clipPath id="${clip}">${shape}</clipPath>
  <g fill="${C.glass}">${shape}</g>
  <g clip-path="url(#${clip})"><g transform="translate(130 124) scale(${tall ? 1.05 : 1.13}) translate(-130 -124)">${HEADS[who]()}</g></g>
  <g fill="none" stroke="${rim}" stroke-width="5">${shape}</g>
  ${rimStroke ? `<g fill="none" stroke="${rimStroke}" stroke-width="3">${shape}</g>` : ''}
  <path d="${tall ? 'M84 70 Q96 38 124 30' : 'M82 92 Q92 64 118 56'}" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>
  <circle cx="${tall ? 80 : 78}" cy="${tall ? 84 : 106}" r="3.5" fill="#fff" opacity=".85"/>`;
}

// ---------- body ----------
const S = { L: [88, 206], R: [172, 206] };
const POSES = {
  down: { L: [[68, 248], [72, 290]], R: [[192, 248], [188, 290]] },
  wrench: { R: [[198, 246], [206, 212]] },
  wave: { R: [[206, 196], [214, 150]] },
  hips: { L: [[60, 244], [88, 276]], R: [[200, 244], [172, 276]] },
  notebook: { R: [[198, 252], [186, 226]] },
};
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t].map((v) => +v.toFixed(1));
function arm(side, pts) {
  const [s, e, h] = [S[side], pts[0], pts[1]];
  const d = `M${s} L${e} L${h}`;
  return `<path d="${d}" stroke="${C.ivoryShade}" stroke-width="29" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" stroke="${C.ivory}" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${lerp(s, e, 0.52)} L${lerp(s, e, 0.68)}" stroke="${C.navy}" stroke-width="24.5" fill="none"/>
    <path d="M${lerp(e, h, 0.6)} L${h}" stroke="${C.navy}" stroke-width="25" fill="none" stroke-linecap="round"/>`;
}
const glove = (p) => `<circle cx="${p[0]}" cy="${p[1]}" r="13.5" fill="${C.navy}"/>`;

const PATCH = {
  twoStar: `<path d="M142 200 h20 v12 q0 9 -10 13 q-10 -4 -10 -13Z" fill="${C.navy}"/>
    <path d="M147.5 206.5 l1.6 3.2 3.4 .4 -2.5 2.3 .7 3.4 -3.2 -1.7 -3.1 1.7 .7 -3.4 -2.5 -2.3 3.4 -.4Z" fill="${C.amber}" transform="translate(-1 0) scale(1)"/>
    <path d="M156.5 206.5 l1.6 3.2 3.4 .4 -2.5 2.3 .7 3.4 -3.2 -1.7 -3.1 1.7 .7 -3.4 -2.5 -2.3 3.4 -.4Z" fill="${C.amber}" transform="translate(1 0)"/>`,
  moon: `<circle cx="152" cy="210" r="10" fill="${C.navy}"/><path d="M155 203 a7.5 7.5 0 1 0 0 14 a6 6 0 1 1 0 -14Z" fill="${C.tealLight}"/>`,
  cmdr: `<path d="M142 200 h20 v12 q0 9 -10 13 q-10 -4 -10 -13Z" fill="${C.navy}"/>
    <path d="M152 203.5 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2.1 -4 2.1 .8 -4.4 -3.2 -3 4.4 -.6Z" fill="${C.amber}"/>
    <path d="M146 218 l6 3 6 -3" stroke="${C.amber}" stroke-width="1.8" fill="none"/>`,
};

const PROPS = {
  wrench: `<g transform="translate(206 212) rotate(18)">
      <rect x="-4.5" y="-50" width="9" height="46" rx="4.5" fill="${C.amber}"/>
      <path d="M-12 -52 v-14 a4 4 0 0 1 8 0 v8 h8 v-8 a4 4 0 0 1 8 0 v14 a6 6 0 0 1 -6 6 h-12 a6 6 0 0 1 -6 -6Z" fill="${C.steel}"/></g>`,
  toolPouch: `<rect x="138" y="292" width="32" height="27" rx="6" fill="${C.amber}"/>
    <path d="M138 298 a6 6 0 0 1 6 -6 h20 a6 6 0 0 1 6 6 v6 h-32Z" fill="${C.amberDark}"/>
    <circle cx="154" cy="304" r="2.6" fill="${C.navy}"/>`,
  medPouch: `<rect x="138" y="291" width="32" height="27" rx="7" fill="${C.teal}"/>
    <path d="M154 312 l-7 -7 a4 4 0 0 1 7 -5 a4 4 0 0 1 7 5Z" fill="#fff"/>`,
  sampleCase: `<path d="M58 296 v-8 a6 6 0 0 1 6 -6 h10 a6 6 0 0 1 6 6 v8" stroke="${C.amberDark}" stroke-width="5" fill="none"/>
    <rect x="38" y="294" width="62" height="42" rx="9" fill="${C.amber}"/>
    <rect x="45" y="302" width="36" height="26" rx="5" fill="#DDF0F3"/>
    <path d="M53 324 l4 -10 9 -4 8 5 2 9Z" fill="#9AA1AB"/><path d="M57 314 l9 -4 3 6Z" fill="#BCC2CA"/>
    <rect x="84" y="301" width="12" height="13" rx="2.5" fill="#fff"/>
    <text x="90" y="311.5" text-anchor="middle" font-size="9.5" fill="${C.navy}" ${FONT}>B</text>`,
  notebook: `<g transform="rotate(14 196 214)"><rect x="180" y="190" width="32" height="42" rx="4" fill="${C.amber}"/>
    <rect x="184" y="196" width="24" height="31" rx="2" fill="${C.paper}"/>
    <path d="M188 205 h16 M188 211 h16 M188 217 h10" stroke="${C.tealLight}" stroke-width="2"/>
    <circle cx="188" cy="190" r="2.4" fill="${C.navy}"/><circle cx="196" cy="190" r="2.4" fill="${C.navy}"/><circle cx="204" cy="190" r="2.4" fill="${C.navy}"/></g>`,
};

const CREW = {
  bram: { name: 'BRAM', role: 'BASE SYSTEMS', arms: { L: 'down', R: 'wrench' }, patch: 'twoStar', behind: ['toolPouch'], props: ['wrench'] },
  remy: { name: 'REMY', role: 'CREW HEALTH', arms: { L: 'down', R: 'wave' }, patch: 'moon', behind: ['medPouch'], props: [] },
  mica: { name: 'MICA', role: 'EXPLORING', arms: { L: 'down', R: 'notebook' }, patch: 'moon', behind: [], props: ['sampleCase', 'notebook'] },
  cmdr: { name: 'COMMANDER', role: 'YOU', arms: { L: 'hips', R: 'hips' }, patch: 'cmdr', behind: [], props: [] },
};

function body(who, { shading = true, relaxed = false } = {}) {
  const c = relaxed ? { ...CREW[who], arms: { L: 'down', R: 'down' }, props: [], behind: [] } : CREW[who];
  const tc = id('tc');
  const armPts = (side) => POSES[c.arms[side]][side];
  const lp = armPts('L'), rp = armPts('R');
  return `
  <rect x="72" y="186" width="116" height="114" rx="26" fill="${C.ivoryShade}"/>
  <rect x="94" y="290" width="33" height="94" rx="15" fill="${C.ivory}"/>
  <rect x="133" y="290" width="33" height="94" rx="15" fill="${C.ivory}"/>
  ${shading ? `<rect x="153" y="296" width="13" height="84" rx="6" fill="${C.navy}" opacity=".07"/>` : ''}
  <rect x="94" y="330" width="33" height="17" rx="8.5" fill="${C.navy}"/>
  <rect x="133" y="330" width="33" height="17" rx="8.5" fill="${C.navy}"/>
  <path d="M88 400 v-10 a14 14 0 0 1 14 -14 h14 a12 12 0 0 1 12 12 v12Z" fill="${C.navy}"/>
  <path d="M132 400 v-12 a12 12 0 0 1 12 -12 h14 a14 14 0 0 1 14 14 v10Z" fill="${C.navy}"/>
  <clipPath id="${tc}"><rect x="84" y="186" width="92" height="118" rx="32"/></clipPath>
  <rect x="84" y="186" width="92" height="118" rx="32" fill="${C.ivory}"/>
  ${shading ? `<rect x="160" y="186" width="30" height="120" fill="${C.navy}" opacity=".07" clip-path="url(#${tc})"/>` : ''}
  <rect x="108" y="228" width="44" height="13" rx="6.5" fill="${C.teal}"/>
  <rect x="86" y="284" width="88" height="12" rx="6" fill="${C.navy}"/>
  <rect x="122" y="282" width="16" height="16" rx="4" fill="${C.tealLight}"/>
  ${PATCH[c.patch]}
  ${c.behind.map((p) => PROPS[p]).join('')}
  ${arm('L', lp)}${arm('R', rp)}
  ${c.props.map((p) => PROPS[p]).join('')}
  ${glove(lp[1])}${glove(rp[1])}
  <ellipse cx="130" cy="190" rx="52" ry="13" fill="${C.navy}"/>`;
}

const astronaut = (who, opts = {}) => `${body(who, opts)}${helmet(who, opts)}`;

// ---------- Curio (helper AI avatar, always inside its panel) ----------
function curioRover({ wheelHub = C.ivory } = {}) {
  return `
  <rect x="166" y="248" width="9" height="50" rx="4" fill="${C.ivoryShade}"/>
  <g transform="rotate(-9 170 236)">
    <rect x="128" y="208" width="84" height="44" rx="17" fill="${C.ivory}"/>
    <rect x="136" y="214" width="68" height="32" rx="14" fill="${C.navy}"/>
    <circle cx="154" cy="230" r="11" fill="${C.teal}"/><circle cx="154" cy="230" r="5.5" fill="${C.ink}"/><circle cx="156.5" cy="227.5" r="2" fill="#fff"/>
    <circle cx="186" cy="230" r="11" fill="${C.teal}"/><circle cx="186" cy="230" r="5.5" fill="${C.ink}"/><circle cx="188.5" cy="227.5" r="2" fill="#fff"/>
  </g>
  <rect x="62" y="292" width="132" height="46" rx="16" fill="${C.ivory}"/>
  <rect x="62" y="318" width="132" height="20" rx="10" fill="${C.ivoryShade}"/>
  <rect x="148" y="302" width="34" height="9" rx="4.5" fill="${C.teal}"/>
  <path d="M84 292 a10 10 0 0 1 20 0Z" fill="${C.amber}"/>
  ${[80, 128, 176].map((x) => `<circle cx="${x}" cy="346" r="18" fill="${C.ink}"/><circle cx="${x}" cy="346" r="7" fill="${wheelHub}"/>`).join('')}`;
}
const curioBubble = `<path d="M50 168 h64 a18 18 0 0 1 18 18 v14 a18 18 0 0 1 -18 18 h-34 l-12 12 v-12 h-18 a18 18 0 0 1 -18 -18 v-14 a18 18 0 0 1 18 -18Z" fill="${C.paper}"/>
  <text x="82" y="210" text-anchor="middle" font-size="30" fill="${C.navy}" ${FONT}>?</text>`;
const curioPanel = (fill = C.navy) => `<rect x="20" y="140" width="220" height="244" rx="34" fill="${fill}"/>${curioBubble}${curioRover()}`;

// ---------- sheet helpers ----------
const label = (cx, name, role, y = 438) => `
  <text x="${cx}" y="${y}" text-anchor="middle" font-size="30" fill="${C.ink}" ${FONT} letter-spacing=".5">${name}</text>
  <rect x="${cx - (role.length * 9 + 28) / 2}" y="${y + 12}" width="${role.length * 9 + 28}" height="28" rx="14" fill="${C.teal}"/>
  <text x="${cx}" y="${y + 31}" text-anchor="middle" font-size="13" fill="#fff" ${FONT} letter-spacing="1">${role}</text>`;

const svg = (w, h, inner, bg = C.paper) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${bg}"/>${inner}
</svg>\n`;

const ORDER = ['curio', 'bram', 'remy', 'mica', 'cmdr'];
const NAMES = { curio: ['CURIO', 'HELPER AI'], ...Object.fromEntries(Object.entries(CREW).map(([k, v]) => [k, [v.name, v.role]])) };

// ===== A. Flat clip-art (closest to sheet v1) =====
function sheetA() {
  const cells = ORDER.map((w, i) => `<g transform="translate(${40 + i * 270} 100)">
    ${w === 'curio' ? curioPanel() : astronaut(w)}
    <ellipse cx="130" cy="404" rx="70" ry="7" fill="${C.navy}" opacity=".08"/>
    ${label(130, ...NAMES[w])}</g>`).join('');
  return svg(1430, 660, `<text x="715" y="62" text-anchor="middle" font-size="40" fill="${C.ink}" ${FONT} letter-spacing="2">MEET THE CREW</text>
    <text x="715" y="88" text-anchor="middle" font-size="14" fill="#6B7280" ${FONT}>A · FLAT CLIP-ART — no outlines, one soft shade</text>${cells}`);
}

// ===== B. Sticker / chibi (big helmet, ink outline, white die-cut edge) =====
function stickerFilter(fid) {
  return `<filter id="${fid}" x="-25%" y="-25%" width="150%" height="150%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="a"/>
    <feFlood flood-color="${C.ink}"/><feComposite in2="a" operator="in" result="ink"/>
    <feMorphology in="SourceAlpha" operator="dilate" radius="11" result="b"/>
    <feFlood flood-color="#fff"/><feComposite in2="b" operator="in" result="paper"/>
    <feOffset in="b" dy="5" result="sb"/><feFlood flood-color="${C.navy}" flood-opacity=".18"/><feComposite in2="sb" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="paper"/><feMergeNode in="ink"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}
function chibi(who) {
  // bigger helmet, shorter body: scale around the collar so the parts stay joined
  return `<g transform="translate(130 190) scale(0.82 0.74) translate(-130 -190)">${body(who, { shading: false })}</g>
    <g transform="translate(130 190) scale(1.2) translate(-130 -190)">${helmet(who, { rimStroke: C.ink })}</g>`;
}
function sheetB() {
  const f = id('stk');
  const cells = ORDER.map((w, i) => {
    const art = w === 'curio'
      ? `<g transform="translate(130 262) scale(1.05) translate(-130 -262)">${curioBubble}${curioRover()}</g>`
      : `<g transform="translate(0 4)">${chibi(w)}</g>`;
    return `<g transform="translate(${40 + i * 270} 130)"><g filter="url(#${f})">${art}</g>${label(130, ...NAMES[w], 410)}</g>`;
  }).join('');
  return svg(1430, 640, `<defs>${stickerFilter(f)}</defs>
    <text x="715" y="62" text-anchor="middle" font-size="40" fill="${C.ink}" ${FONT} letter-spacing="2">MEET THE CREW</text>
    <text x="715" y="88" text-anchor="middle" font-size="14" fill="#6B7280" ${FONT}>B · STICKER — big helmets, ink outline, die-cut white edge</text>${cells}`, '#E9EEF2');
}

// ===== C. Portrait badges for dialogue / HUD =====
const BADGE_BG = { curio: C.navy, bram: '#F6D59A', remy: C.tealLight, mica: '#E7DDB4', cmdr: '#B9C7E6' };
function badge(who, size) {
  const k = size / 180, clip = id('bc');
  const art = who === 'curio'
    ? `<g transform="translate(90 112) scale(1.55) translate(-170 -232)">${curioRover()}</g>`
    : `<g transform="translate(90 112) scale(1.05) translate(-130 -150)">${body(who, { shading: false, relaxed: true })}${helmet(who)}</g>`;
  return `<g transform="scale(${k})">
    <clipPath id="${clip}"><circle cx="90" cy="90" r="84"/></clipPath>
    <circle cx="90" cy="90" r="90" fill="#fff"/>
    <circle cx="90" cy="90" r="84" fill="${BADGE_BG[who]}"/>
    <g clip-path="url(#${clip})">${art}</g>
    <circle cx="90" cy="90" r="84" fill="none" stroke="${C.ink}" stroke-width="5"/></g>`;
}
function sheetC() {
  const big = ORDER.map((w, i) => `<g transform="translate(${60 + i * 260} 120)">${badge(w, 180)}${label(90, ...NAMES[w], 232)}</g>`).join('');
  const sizes = [64, 48, 32, 24];
  let x = 60;
  const small = sizes.map((s) => {
    const row = ORDER.map((w, i) => `<g transform="translate(${x + i * (s + 8)} ${470 + (64 - s) / 2})">${badge(w, s)}</g>`).join('');
    const t = `<text x="${x}" y="${560}" font-size="13" fill="#6B7280" ${FONT}>${s}px</text>`;
    x += 5 * (s + 8) + 50;
    return row + t;
  }).join('');
  const dlg = `<g transform="translate(60 600)">
    <rect width="760" height="120" rx="22" fill="${C.navy}"/>
    <g transform="translate(18 14)">${badge('bram', 92)}</g>
    <text x="128" y="44" font-size="18" fill="${C.amber}" ${FONT} letter-spacing="1">BRAM</text>
    <text x="128" y="76" font-size="20" fill="#fff" font-family="Nunito, system-ui, sans-serif" font-weight="600">I can fix that panel. It'll take time we</text>
    <text x="128" y="102" font-size="20" fill="#fff" font-family="Nunito, system-ui, sans-serif" font-weight="600">could use for exploring.</text></g>
    <g transform="translate(860 600)">
    <rect width="500" height="120" rx="22" fill="${C.paper}" stroke="${C.navy}" stroke-width="3"/>
    <g transform="translate(18 14)">${badge('curio', 92)}</g>
    <text x="128" y="44" font-size="18" fill="${C.teal}" ${FONT} letter-spacing="1">ASK CURIO</text>
    <text x="128" y="76" font-size="20" fill="${C.ink}" font-family="Nunito, system-ui, sans-serif" font-weight="600">That job uses power. Shall we</text>
    <text x="128" y="102" font-size="20" fill="${C.ink}" font-family="Nunito, system-ui, sans-serif" font-weight="600">check how much we'll have left?</text></g>`;
  return svg(1430, 760, `<text x="715" y="62" text-anchor="middle" font-size="40" fill="${C.ink}" ${FONT} letter-spacing="2">CREW PORTRAITS</text>
    <text x="715" y="88" text-anchor="middle" font-size="14" fill="#6B7280" ${FONT}>C · BADGES — head-and-shoulders for dialogue, HUD and source cards (shown at real sizes below)</text>
    ${big}${small}${dlg}`);
}

// ---------- single-character assets (style A) ----------
function single(who) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 20 260 390" width="260" height="390">${who === 'curio' ? curioPanel() : astronaut(who)}</svg>\n`;
}

writeFileSync(join(OUT, 'crew-A-flat.svg'), sheetA());
writeFileSync(join(OUT, 'crew-B-sticker.svg'), sheetB());
writeFileSync(join(OUT, 'crew-C-portraits.svg'), sheetC());
for (const w of ORDER) writeFileSync(join(OUT, `A-${w}.svg`), single(w));
console.log('wrote', OUT);

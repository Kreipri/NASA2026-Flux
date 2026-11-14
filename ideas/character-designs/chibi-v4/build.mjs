// Chibi v4: Mica redesign + 3 clothing options + 3 astronaut-suit options.
// Run: node ideas/character-designs/chibi-v4/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
const FONT = `font-family="Nunito, 'Arial Rounded MT Bold', system-ui, sans-serif" font-weight="800"`;
const BODYFONT = `font-family="Nunito, system-ui, sans-serif" font-weight="700"`;

const C = {
  eye: '#2B1F1A', blush: '#FF8FA0', ink: '#1F2B4A', navy: '#2A3A66', white: '#FBF9F4', shade: '#E1DCD1',
  glass: '#BDEBF5', amber: '#FFB838', amberDark: '#E08E12', steel: '#9AA3B0', pink: '#FF7F9E', teal: '#2DAAB5',
};
// personal colours: species + colour + item identify each character (never colour alone)
const PC = {
  bram: { c: '#4C7EF0', d: '#3461C9', l: '#C9D8FF' },
  remy: { c: '#FF7C93', d: '#E05A74', l: '#FFD3DC' },
  mica: { c: '#34B97C', d: '#23935F', l: '#C3F0DA' },
  cmdr: { c: '#FF8A3D', d: '#E06A1F', l: '#FFDCC4' },
};
const FUR = {
  bram: { main: '#F0A04F', dark: '#A65A26', light: '#FFE6C4', patch: '#D9852F', nose: '#3A2418', limb: '#F0A04F' },
  remy: { main: '#CDD2DD', inner: '#FFAFC0', light: '#FFFFFF', nose: '#FF8FA6', limb: '#CDD2DD' },
  // squirrel monkey: dark crown with a peak, white arched eye mask, black muzzle, big white ears, golden limbs, black-tipped tail
  mica: { head: '#C9A845', crown: '#6F6A55', mask: '#FFF9EE', muzzle: '#3A2E28', ear: '#FFF4DE', earIn: '#E9C77A', limb: '#E8B23F', tip: '#2B2420' },
  cmdr: { main: '#B9794C', dark: '#2A1D16', limb: '#B9794C' },
};

// named layer group (Figma uses the id as the layer name); skips empty parts
const G = (name, inner) => inner && inner.trim() ? `<g id="${name}">${inner}</g>` : '';
const ell = (cx, cy, rx, ry, f, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
const line = (d, col = C.eye, w = 3) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const dots = (cx, y, dx) => ell(cx - dx, y, 4.6, 5.6, C.eye) + ell(cx + dx, y, 4.6, 5.6, C.eye);
const blush = (cx, y, dx) => ell(cx - dx, y, 7, 4.5, C.blush, 'opacity=".55"') + ell(cx + dx, y, 7, 4.5, C.blush, 'opacity=".55"');
const wMouth = (m, y, col = C.eye) => line(`M${m - 7} ${y} Q${m - 3.5} ${y + 5} ${m} ${y} Q${m + 3.5} ${y + 5} ${m + 7} ${y}`, col, 2.6);

// ---------- heads (centre 100,108) ----------
const HEAD = {
  bram: () => { const f = FUR.bram; return `${ell(100, 108, 49, 43, f.main)}${ell(117, 101, 13, 12, f.patch)}${ell(100, 128, 22, 15, f.light)}
    ${dots(100, 104, 17)}${blush(100, 120, 30)}${ell(100, 119, 7.5, 5.2, f.nose)}${wMouth(100, 128)}
    <ellipse cx="58" cy="110" rx="14" ry="26" fill="${f.dark}" transform="rotate(14 58 110)"/><ellipse cx="142" cy="110" rx="14" ry="26" fill="${f.dark}" transform="rotate(-14 142 110)"/>`; },
  remy: () => { const f = FUR.remy; return `<g transform="rotate(-9 82 80)">${ell(82, 48, 13, 32, f.main)}${ell(82, 52, 6.5, 22, f.inner)}</g>
    <g transform="rotate(12 118 80)">${ell(118, 48, 13, 32, f.main)}${ell(118, 52, 6.5, 22, f.inner)}</g>
    ${ell(100, 110, 48, 42, f.main)}${ell(90, 127, 12, 9, f.light)}${ell(110, 127, 12, 9, f.light)}
    ${dots(100, 106, 18)}${blush(100, 120, 31)}<path d="M95 117 h10 q-1.5 5 -5 6 q-3.5 -1 -5 -6Z" fill="${f.nose}"/>${wMouth(100, 128)}`; },
  mica: () => { const f = FUR.mica; return `
    ${ell(52, 108, 17, 18, f.ear)}${ell(53, 110, 9, 10, f.earIn)}${ell(148, 108, 17, 18, f.ear)}${ell(147, 110, 9, 10, f.earIn)}
    ${ell(100, 108, 46, 43, f.head)}
    <path d="M64 124 Q61 96 79 90 Q95 86 99 106 Q99 124 88 131 Q70 135 64 124Z" fill="${f.mask}"/>
    <path d="M136 124 Q139 96 121 90 Q105 86 101 106 Q101 124 112 131 Q130 135 136 124Z" fill="${f.mask}"/>
    <path d="M57 100 Q58 64 100 64 Q142 64 143 100 Q134 84 120 84 Q106 86 100 104 Q94 86 80 84 Q66 84 57 100Z" fill="${f.crown}"/>
    ${dots(100, 112, 18)}${blush(100, 132, 34)}
    ${ell(100, 140, 15, 8, f.mask)}
    <path d="M90 130 Q90 121 100 121 Q110 121 110 130 Q109 140 100 140 Q91 140 90 130Z" fill="${f.muzzle}"/>
    <circle cx="97" cy="126" r="1.4" fill="#7A6E66"/><circle cx="103" cy="126" r="1.4" fill="#7A6E66"/>
    ${line('M95 133 Q100 137 105 133', f.mask, 2.2)}`; },
  cmdr: () => { const f = FUR.cmdr; return `${ell(100, 100, 49, 45, f.dark)}${ell(55, 114, 8.5, 9, f.main)}${ell(145, 114, 8.5, 9, f.main)}
    ${ell(100, 112, 44, 41, f.main)}<path d="M56 106 Q52 62 100 60 Q148 62 144 104 Q136 84 116 86 Q106 76 92 88 Q72 84 56 106Z" fill="${f.dark}"/>
    ${dots(100, 113, 17)}${blush(100, 127, 28)}${line('M93 128 Q100 135 107 128', C.eye, 2.8)}`; },
};
// v3 Mica, kept only for the before/after strip
const OLD_MICA = `<circle cx="56" cy="110" r="11" fill="#FFF6E0"/><circle cx="144" cy="110" r="11" fill="#FFF6E0"/>${ell(100, 108, 47, 43, '#E2B93E')}${ell(100, 115, 35, 26, '#FFF6E0')}
  <path d="M55 104 Q56 64 100 64 Q144 64 145 104 Q130 92 116 96 Q106 88 100 101 Q94 88 84 96 Q70 92 55 104Z" fill="#7D6A23"/>${dots(100, 110, 16)}${ell(100, 130, 13, 10, '#3B2C26')}${wMouth(100, 130, '#FFF6E0')}`;

// ---------- limbs ----------
const SH = { L: [75, 160], R: [125, 160] };
const hand = (s, a, len = 26) => [s[0] - len * Math.sin(a * Math.PI / 180), s[1] + len * Math.cos(a * Math.PI / 180)];
// arm = fur underneath, sleeve over it (len = sleeve length), paw/glove at the end
function arm(side, a, { sleeve, sleeveLen = 32, paw, cuff = null, band = null, outline = null }) {
  return `<g transform="translate(${SH[side]}) rotate(${a})">
    <rect x="-8.5" y="-6" width="17" height="32" rx="8.5" fill="${paw}"/>
    <rect x="-9" y="-6" width="18" height="${sleeveLen}" rx="9" fill="${sleeve}" ${outline ? `stroke="${outline}" stroke-width="2.5"` : ''}/>
    ${band ? `<rect x="-9" y="6" width="18" height="5" fill="${band}"/>` : ''}
    ${cuff ? `<rect x="-9" y="${sleeveLen - 10}" width="18" height="6" rx="3" fill="${cuff}"/>` : ''}
    <circle cx="0" cy="26" r="8.5" fill="${paw}"/></g>`;
}
function legs({ pants, pantsLen = 26, skin, sock = null, shoe = '#fff', sole = null }) {
  return [80, 104].map((x) => `
    <rect x="${x}" y="190" width="16" height="28" rx="8" fill="${skin}"/>
    <rect x="${x}" y="188" width="16" height="${pantsLen}" rx="8" fill="${pants}"/>
    ${sock ? `<rect x="${x}" y="208" width="16" height="9" rx="3" fill="${sock}"/>` : ''}
    ${ell(x + 7 + (x === 80 ? 0 : 2), 220, 11.5, 7, shoe)}${sole ? `<rect x="${x - 4 + (x === 80 ? 0 : 2)}" y="222" width="23" height="4" rx="2" fill="${sole}"/>` : ''}`).join('');
}
let MICA = null; // species variant override (mica-options sheet)
function tail(who, suit) {
  if (who === 'mica' && MICA) return MICA.tail(suit);
  if (who === 'mica') return suit
    ? `<path d="M126 196 Q160 200 158 170 Q156 150 142 154" stroke="${suit}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="142" cy="154" r="7" fill="${C.navy}"/>`
    : `<path d="M126 196 Q174 204 172 160 Q170 128 146 134" stroke="${FUR.mica.limb}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M152 132 Q146 132 144 136" stroke="${FUR.mica.tip}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  if (who === 'bram' && !suit) return `<path d="M128 194 Q154 192 154 170" stroke="${FUR.bram.main}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  return '';
}
const TORSO = '<rect x="68" y="140" width="64" height="66" rx="27"/>';
let uid = 0;
const clipTorso = (inner) => { const id = `t${++uid}`; return `<clipPath id="${id}">${TORSO}</clipPath><g clip-path="url(#${id})">${inner}</g>`; };
const star = (x, y, s, col) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -6 l1.8 3.6 4 .5 -2.9 2.8 .7 4 -3.6 -1.9 -3.6 1.9 .7 -4 -2.9 -2.8 4 -.5Z" fill="${col}"/>`;
const heartP = (x, y, s, col) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 5 l-5 -5 a2.8 2.8 0 0 1 5 -3.5 a2.8 2.8 0 0 1 5 3.5Z" fill="${col}"/>`;
const at = ([x, y], inner, rot = 0) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">${inner}</g>`;
const PROP = {
  wrench: `<rect x="-3.5" y="-28" width="7" height="24" rx="3.5" fill="${C.amber}"/><path d="M-9 -28 v-9 a3 3 0 0 1 6 0 v5 h6 v-5 a3 3 0 0 1 6 0 v9 a5 5 0 0 1 -5 5 h-8 a5 5 0 0 1 -5 -5Z" fill="${C.steel}"/>`,
  magnifier: `<rect x="-3" y="-8" width="6" height="16" rx="3" fill="${C.amberDark}"/><circle cx="0" cy="-17" r="11" fill="#DDF4F7" stroke="${C.navy}" stroke-width="4"/>`,
  clipboard: `<rect x="-11" y="-16" width="22" height="28" rx="4" fill="${C.amber}"/><rect x="-7" y="-11" width="14" height="19" rx="2" fill="#fff"/><rect x="-5" y="-19" width="10" height="6" rx="2" fill="${C.navy}"/>`,
};

// ---------- clothing options ----------
const paw = (w) => w === 'mica' ? FUR.mica.limb : FUR[w].limb;
const CLOTHES = {
  // 1. Crew polo: closest to what real station crews wear day to day
  polo(w) {
    const p = PC[w];
    return {
      legs: legs({ pants: C.navy, skin: paw(w), shoe: '#fff', sole: p.c }),
      torso: `<g fill="${p.c}">${TORSO}</g>
        <path d="M86 146 L100 162 L94 166 L82 152Z M114 146 L100 162 L106 166 L118 152Z" fill="#fff"/>
        <rect x="98.5" y="160" width="3" height="16" rx="1.5" fill="${p.d}"/><circle cx="100" cy="166" r="1.8" fill="#fff"/><circle cx="100" cy="173" r="1.8" fill="#fff"/>
        <circle cx="117" cy="180" r="7" fill="#fff"/>${star(117, 180, 0.8, C.amberDark)}`,
      arms: (aL, aR) => arm('L', aL, { sleeve: p.c, sleeveLen: 17, paw: paw(w) }) + arm('R', aR, { sleeve: p.c, sleeveLen: 17, paw: paw(w) }),
    };
  },
  // 2. Cozy hoodie + shorts
  hoodie(w) {
    const p = PC[w];
    return {
      under: ell(100, 150, 40, 15, p.d),
      legs: legs({ pants: '#5B6B8C', pantsLen: 13, skin: paw(w), sock: '#fff', shoe: '#fff', sole: C.navy }),
      torso: `<g fill="${p.c}">${TORSO}</g>${clipTorso(`<rect x="60" y="196" width="80" height="12" fill="${p.d}"/>`)}
        <rect x="82" y="178" width="36" height="15" rx="7" fill="${p.d}"/>
        ${line('M93 154 L92 170', '#fff', 2.4)}${line('M107 154 L108 170', '#fff', 2.4)}`,
      arms: (aL, aR) => arm('L', aL, { sleeve: p.c, paw: paw(w), cuff: p.d }) + arm('R', aR, { sleeve: p.c, paw: paw(w), cuff: p.d }),
    };
  },
  // 3. Role gear: a tee plus one layer that says what they do
  role(w) {
    const p = PC[w];
    const tee = `<g fill="#F4F1EA">${TORSO}</g>`;
    const base = { legs: legs({ pants: C.navy, skin: paw(w), shoe: '#fff', sole: p.c }) };
    if (w === 'bram') return { ...base, // utility vest, pockets, pencil
      torso: tee + clipTorso(`<rect x="60" y="140" width="33" height="70" fill="${C.amber}"/><rect x="107" y="140" width="33" height="70" fill="${C.amber}"/>
        <rect x="74" y="172" width="16" height="13" rx="3" fill="${C.amberDark}"/><rect x="110" y="172" width="16" height="13" rx="3" fill="${C.amberDark}"/>
        <rect x="114" y="160" width="4" height="14" rx="2" fill="${p.c}"/><rect x="60" y="196" width="80" height="8" fill="${p.c}"/>`) + star(100, 160, 0.7, p.c),
      arms: (aL, aR) => arm('L', aL, { sleeve: '#F4F1EA', sleeveLen: 15, paw: paw(w) }) + arm('R', aR, { sleeve: '#F4F1EA', sleeveLen: 15, paw: paw(w) }),
      hold: PROP.wrench, holdRot: 20 };
    if (w === 'remy') return { ...base, // zip jacket + stethoscope (not a nurse costume)
      torso: `<g fill="${p.c}">${TORSO}</g>${clipTorso(`<rect x="98" y="140" width="4" height="70" fill="${p.l}"/>`)}
        <path d="M84 150 Q82 176 92 182 M116 150 Q118 176 108 182" stroke="${C.steel}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="92" cy="184" r="4.5" fill="${C.steel}"/><circle cx="117" cy="184" r="7" fill="#fff"/>${heartP(117, 184, 0.9, p.c)}`,
      arms: (aL, aR) => arm('L', aL, { sleeve: p.c, paw: paw(w), cuff: p.d }) + arm('R', aR, { sleeve: p.c, paw: paw(w), cuff: p.d }) };
    if (w === 'mica') return { ...base, // field vest, notebook pocket, magnifier
      torso: tee + clipTorso(`<rect x="60" y="140" width="34" height="70" fill="${p.c}"/><rect x="106" y="140" width="34" height="70" fill="${p.c}"/>
        <rect x="72" y="164" width="18" height="12" rx="3" fill="${p.d}"/><rect x="72" y="182" width="18" height="12" rx="3" fill="${p.d}"/>
        <rect x="110" y="182" width="18" height="12" rx="3" fill="${p.d}"/><rect x="111" y="166" width="14" height="17" rx="2" fill="${C.amber}"/><rect x="113" y="169" width="10" height="2" fill="#fff"/>`),
      arms: (aL, aR) => arm('L', aL, { sleeve: '#F4F1EA', sleeveLen: 15, paw: paw(w) }) + arm('R', aR, { sleeve: '#F4F1EA', sleeveLen: 15, paw: paw(w) }),
      hold: PROP.magnifier, holdRot: 15 };
    return { ...base, // commander: bomber jacket + clipboard
      torso: `<g fill="${p.c}">${TORSO}</g>${clipTorso(`<rect x="60" y="198" width="80" height="10" fill="${C.navy}"/><rect x="98" y="140" width="4" height="60" fill="${p.d}"/>`)}
        ${ell(100, 152, 26, 8, C.navy)}<circle cx="83" cy="174" r="7.5" fill="${C.navy}"/>${star(83, 174, 0.85, C.amber)}`,
      arms: (aL, aR) => arm('L', aL, { sleeve: p.c, paw: paw(w), cuff: C.navy }) + arm('R', aR, { sleeve: p.c, paw: paw(w), cuff: C.navy }),
      hold: PROP.clipboard, holdRot: 0 };
  },
};

function dressed(w, opt) {
  const o = CLOTHES[opt](w);
  const [aL, aR] = o.hold ? [16, -60] : [16, -16];
  const prop = o.hold ? at(hand(SH.R, aR), o.hold, o.holdRot) : '';
  return `${G('tail', tail(w, null))}${G('hood', o.under || '')}${G('legs', o.legs)}${G('body', o.torso)}${G('head', HEAD[w]())}${G('arms', o.arms(aL, aR))}${G('prop', prop)}`;
}

// ---------- suit options ----------
const BUBBLE = (w) => w === 'remy' ? '<ellipse cx="100" cy="90" rx="57" ry="74"/>' : '<circle cx="100" cy="104" r="57"/>';
function bubbleHelmet(w) {
  const s = BUBBLE(w);
  return `${ell(100, 152, 36, 9, C.navy)}<g fill="${C.glass}" opacity=".45">${s}</g>${HEAD[w]()}
    <g fill="none" stroke="#fff" stroke-width="4.5" opacity=".95">${s}</g>
    <path d="${w === 'remy' ? 'M56 64 Q64 34 90 24' : 'M56 88 Q62 62 86 54'}" stroke="#fff" stroke-width="5.5" fill="none" stroke-linecap="round" opacity=".9"/>`;
}
function visorHelmet(w) {
  const p = PC[w], id = `v${++uid}`;
  const win = '<rect x="52" y="68" width="96" height="84" rx="40"/>';
  const pods = {
    remy: `<g transform="rotate(-8 84 60)"><rect x="72" y="8" width="24" height="60" rx="12" fill="${C.white}"/><rect x="72" y="22" width="24" height="6" fill="${p.c}"/></g>
           <g transform="rotate(10 116 60)"><rect x="104" y="8" width="24" height="60" rx="12" fill="${C.white}"/><rect x="104" y="22" width="24" height="6" fill="${p.c}"/></g>`,
    bram: `<rect x="30" y="86" width="18" height="44" rx="9" fill="${C.shade}"/><rect x="152" y="86" width="18" height="44" rx="9" fill="${C.shade}"/>`,
    mica: `<circle cx="38" cy="104" r="15" fill="${C.white}"/><circle cx="38" cy="104" r="7" fill="${p.c}"/><circle cx="162" cy="104" r="15" fill="${C.white}"/><circle cx="162" cy="104" r="7" fill="${p.c}"/>`,
    cmdr: `<rect x="34" y="96" width="10" height="20" rx="5" fill="${C.shade}"/><rect x="156" y="96" width="10" height="20" rx="5" fill="${C.shade}"/>`,
  }[w];
  const podsOut = w === 'mica' && MICA ? MICA.pods(p) : pods;
  return `${podsOut}<rect x="40" y="46" width="120" height="118" rx="56" fill="${C.white}"/>
    <clipPath id="${id}s"><rect x="40" y="46" width="120" height="118" rx="56"/></clipPath><rect x="40" y="58" width="120" height="7" fill="${p.c}" clip-path="url(#${id}s)"/>
    <rect x="90" y="48" width="20" height="8" rx="4" fill="${C.amber}"/>
    <clipPath id="${id}">${win}</clipPath><g fill="${C.glass}">${win}</g>
    <g clip-path="url(#${id})"><g transform="translate(100 112) scale(.88) translate(-100 -110)">${HEAD[w]()}</g></g>
    <path d="M62 96 Q66 78 84 74" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
    <g fill="none" stroke="${C.shade}" stroke-width="3">${win}</g>`;
}
function suit(w, kind) {
  const p = PC[w];
  const body = kind === 'colour' ? p.l : C.white;
  const trim = kind === 'colour' ? p.c : p.c;
  const legsS = [78, 102].map((x) => `<rect x="${x}" y="186" width="20" height="28" rx="10" fill="${body}" stroke="${C.shade}" stroke-width="2"/>
    <rect x="${x}" y="198" width="20" height="5" fill="${trim}"/><rect x="${x - 3}" y="211" width="26" height="14" rx="7" fill="${C.navy}"/>`).join('');
  const torso = `<rect x="56" y="146" width="88" height="56" rx="18" fill="${C.shade}"/>
    <rect x="64" y="140" width="72" height="68" rx="28" fill="${body}"/>
    ${kind === 'colour' ? clipTorso(`<rect x="60" y="186" width="80" height="22" fill="${p.c}"/>`) : ''}
    <rect x="84" y="168" width="32" height="18" rx="6" fill="${C.shade}"/>
    <circle cx="92" cy="177" r="3" fill="${C.amber}"/><circle cx="100" cy="177" r="3" fill="${C.teal}"/><circle cx="108" cy="177" r="3" fill="${p.c}"/>`;
  const head = kind === 'visor' ? visorHelmet(w) : bubbleHelmet(w);
  const a = (side, ang) => arm(side, ang, { sleeve: body, paw: C.navy, band: trim, outline: C.shade });
  return `${G('tail', tail(w, kind === 'colour' ? p.l : C.white))}${G('legs', legsS)}${G('suit-body', torso)}${G('helmet', head)}${G('arm-left', a('L', 18))}${G('arm-right', a('R', -18))}`;
}

// ---------- sheet ----------
const CREW = ['bram', 'remy', 'mica', 'cmdr'];
const NAME = { bram: 'Bram', remy: 'Remy', mica: 'Mica', cmdr: 'You' };
const W = 1200, LX = 40, COL0 = 300, COLW = 225;
const shadow = ell(100, 228, 42, 5, '#000', 'opacity=".08"');
function optionRow(y, letter, title, lines, draw, rec = false) {
  const txt = lines.map((t, i) => `<text x="${LX}" y="${y + 92 + i * 20}" font-size="14" fill="#5E6575" ${BODYFONT}>${t}</text>`).join('');
  const figs = CREW.map((w, i) => `<g transform="translate(${COL0 + i * COLW} ${y})">${shadow}${draw(w)}</g>`).join('');
  return `<rect x="20" y="${y - 6}" width="${W - 40}" height="250" rx="24" fill="${rec ? '#FFFFFF' : '#F8F6F1'}" ${rec ? `stroke="${C.teal}" stroke-width="3"` : ''}/>
    <text x="${LX}" y="${y + 40}" font-size="30" fill="${C.teal}" ${FONT}>${letter}</text>
    <text x="${LX + 34}" y="${y + 40}" font-size="22" fill="${C.ink}" ${FONT}>${title}</text>
    ${rec ? `<rect x="${LX}" y="${y + 54}" width="118" height="22" rx="11" fill="${C.teal}"/><text x="${LX + 59}" y="${y + 69}" text-anchor="middle" font-size="12" fill="#fff" ${FONT} letter-spacing="1">RECOMMENDED</text>` : ''}
    ${txt}${figs}`;
}
const section = (y, t, sub) => `<text x="${LX - 10}" y="${y}" font-size="26" fill="${C.ink}" ${FONT}>${t}</text><text x="${LX - 10}" y="${y + 24}" font-size="15" fill="#7A8090" ${BODYFONT}>${sub}</text>`;
const names = (y) => CREW.map((w, i) => `<text x="${COL0 + i * COLW + 100}" y="${y}" text-anchor="middle" font-size="20" fill="${C.ink}" ${FONT}>${NAME[w]}</text>`).join('');

function sheet() {
  let y = 130, s = '';
  s += section(y, 'Out of suit', 'Inside the base. Each crewmate gets a personal colour (plus species and an item, so colour is never the only clue).');
  s += names(y + 56);
  y += 70;
  s += optionRow(y, '1', 'Crew polo', ['Polo + cargo pants.', 'Closest to real station crews.', 'Risk: a bit plain.'], (w) => dressed(w, 'polo'));
  y += 262;
  s += optionRow(y, '2', 'Cozy hoodie', ['Hoodie + shorts + socks.', 'Most relatable for kids.', 'Risk: less "astronaut".'], (w) => dressed(w, 'hoodie'));
  y += 262;
  s += optionRow(y, '3', 'Role gear', ['Tee + one role layer: tool vest,', 'jacket + stethoscope, field vest,', 'commander jacket. Job readable', 'at a glance.'], (w) => dressed(w, 'role'), true);
  y += 300;
  s += section(y, 'Astronaut suit', 'Outside. Real moonwalk suits are white to reflect sunlight; colour bands tell crewmates apart.');
  y += 50;
  s += optionRow(y, 'A', 'Bubble helmet', ['Clear dome, whole face visible.', 'Cutest, simplest to animate.', 'Risk: less like real helmets.'], (w) => suit(w, 'bubble'));
  y += 262;
  s += optionRow(y, 'B', 'Visor helmet', ['Hard shell + big face window,', 'closer to real Artemis-era suits.', 'Ear pods for Remy and Mica,', 'colour band per crewmate.'], (w) => suit(w, 'visor'), true);
  y += 262;
  s += optionRow(y, 'C', 'Colour suit', ['Suit in each personal colour.', 'Easiest to tell apart far away.', 'Risk: not accurate (real suits', 'are white). Clashes with D-009.'], (w) => suit(w, 'colour'));
  y += 300;
  // Mica before / after
  s += section(y, 'Mica fix', 'Real squirrel-monkey cues: dark crown with a peak, white arches over the eyes, black muzzle, big white ears, golden arms, black-tipped tail.');
  y += 44;
  s += `<rect x="20" y="${y}" width="${W - 40}" height="230" rx="24" fill="#F8F6F1"/>
    <g transform="translate(70 ${y + 10}) scale(1.2) translate(-40 -50)">${OLD_MICA}</g>
    <text x="150" y="${y + 214}" text-anchor="middle" font-size="16" fill="#9AA0AC" ${FONT}>v3 (before)</text>
    <path d="M300 ${y + 110} h60 m-14 -12 l14 12 -14 12" stroke="${C.teal}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(420 ${y + 10}) scale(1.2) translate(-40 -50)">${HEAD.mica()}</g>
    <text x="500" y="${y + 214}" text-anchor="middle" font-size="16" fill="${C.ink}" ${FONT}>v4 (after)</text>
    <g transform="translate(680 ${y - 4})">${shadow}${dressed('mica', 'role')}</g>
    <g transform="translate(900 ${y - 4})">${shadow}${suit('mica', 'visor')}</g>`;
  y += 250;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${y}" width="${W}" height="${y}">
  <rect width="${W}" height="${y}" fill="#EEEBE4"/>
  <rect width="${W}" height="90" fill="${C.teal}"/>
  <text x="${LX - 10}" y="58" font-size="36" fill="#fff" ${FONT}>Crew outfits</text>
  <text x="${W - 30}" y="56" text-anchor="end" font-size="15" fill="#E6FBFF" ${BODYFONT}>chibi v4 · pick 1 clothing + 1 suit</text>
  ${s}</svg>\n`;
}

const svg = sheet();
writeFileSync(join(OUT, 'crew-outfits.svg'), svg);
console.log('wrote', OUT, svg.match(/height="(\d+)"/)[1]);

// ================= Mica species options: tortoise / cat / simple monkey =================
const V = {
  tortoise: {
    title: '1 · Tortoise', fur: { limb: '#9DBE72' },
    note: ['Nod: two tortoises flew around the', 'Moon and back on Zond 5 (1968).', 'Shell = built-in backpack.', 'Risk: "slow" stereotype.'],
    head: () => `
      ${ell(100, 110, 46, 42, '#9DBE72')}
      <path d="M78 80 l7 -4 7 4 v7 l-7 4 -7 -4Z M108 80 l7 -4 7 4 v7 l-7 4 -7 -4Z M93 70 l7 -4 7 4 v6 l-7 4 -7 -4Z" fill="#83A75A"/>
      ${ell(100, 133, 31, 15, '#DCE8B8')}
      ${dots(100, 110, 19)}${blush(100, 125, 31)}
      <circle cx="96" cy="124" r="1.6" fill="#5E7A3E"/><circle cx="104" cy="124" r="1.6" fill="#5E7A3E"/>
      ${line('M84 130 Q100 142 116 130', C.eye, 2.8)}`,
    tail: (suit) => {
      const shell = suit ? C.white : '#8A6234', sc = suit ? C.shade : '#E2B85A';
      const hex = (x, y, r) => `<path d="M${x - r} ${y} l${r / 2} ${-r * 0.87} h${r} l${r / 2} ${r * 0.87} l${-r / 2} ${r * 0.87} h${-r}Z" fill="${shell}" stroke="${sc}" stroke-width="3"/>`;
      return `${ell(100, 170, 56, 48, sc)}${ell(100, 170, 51, 43, shell)}
        ${hex(62, 150, 12)}${hex(62, 176, 12)}${hex(66, 200, 10)}${hex(138, 150, 12)}${hex(138, 176, 12)}${hex(134, 200, 10)}${hex(100, 132, 12)}
        ${suit ? `<rect x="44" y="166" width="112" height="6" fill="${PC.mica.c}"/>` : ''}`;
    },
    pods: (p) => `<rect x="34" y="96" width="10" height="20" rx="5" fill="${C.shade}"/><rect x="156" y="96" width="10" height="20" rx="5" fill="${C.shade}"/>`,
  },
  cat: {
    title: '2 · Cat', fur: { limb: '#FFFFFF' },
    note: ['Nod: Félicette, tuxedo cat who', 'flew on a French rocket (1963).', 'Pointy ears read at any size.', 'Risk: sad ending; common mascot.'],
    head: () => `
      <path d="M58 96 L56 52 L90 74Z" fill="#2F2E3B"/><path d="M142 96 L144 52 L110 74Z" fill="#2F2E3B"/>
      <path d="M63 86 L62 62 L82 76Z" fill="#FFAFC0"/><path d="M137 86 L138 62 L118 76Z" fill="#FFAFC0"/>
      ${ell(100, 110, 48, 42, '#2F2E3B')}
      <path d="M96 70 Q100 66 104 70 L112 110 Q100 106 88 110Z" fill="#FFFFFF"/>
      ${ell(89, 128, 15, 12, '#FFFFFF')}${ell(111, 128, 15, 12, '#FFFFFF')}${ell(100, 138, 12, 9, '#FFFFFF')}
      ${[81, 119].map((x) => `${ell(x, 108, 7, 8, '#CFE87A')}${ell(x, 109, 3.6, 5.5, C.eye)}<circle cx="${x + 2}" cy="${105}" r="1.6" fill="#fff"/>`).join('')}
      ${ell(68, 124, 7, 4.5, C.blush, 'opacity=".6"')}${ell(132, 124, 7, 4.5, C.blush, 'opacity=".6"')}
      <path d="M95 121 h10 q-1.5 5 -5 6 q-3.5 -1 -5 -6Z" fill="#FF8FA6"/>${wMouth(100, 130)}
      ${line('M60 128 h-14 M61 134 l-13 4 M140 128 h14 M139 134 l13 4', '#C9C9D3', 1.8)}`,
    tail: (suit) => suit
      ? `<path d="M126 196 Q162 198 160 168 Q158 148 146 150" stroke="${C.white}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="146" cy="150" r="7" fill="${PC.mica.c}"/>`
      : `<path d="M126 196 Q174 202 170 160 Q166 132 150 140" stroke="#2F2E3B" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="150" cy="140" r="6" fill="#fff"/>`,
    pods: (p) => `<path d="M48 80 L50 30 L90 56Z" fill="${C.white}"/><path d="M152 80 L150 30 L110 56Z" fill="${C.white}"/><path d="M58 64 L59 44 L76 56Z" fill="${p.c}"/><path d="M142 64 L141 44 L124 56Z" fill="${p.c}"/>`,
  },
  monkey: {
    title: '3 · Simple monkey', fur: { limb: '#F3D2A8' },
    note: ['Classic heart-shaped face.', 'Very readable and cute.', 'Risk: loses the Baker nod anyway;', 'drifts toward comic relief.'],
    head: () => `
      ${ell(52, 110, 15, 15, '#9A6338')}${ell(52, 110, 8, 8, '#F3D2A8')}${ell(148, 110, 15, 15, '#9A6338')}${ell(148, 110, 8, 8, '#F3D2A8')}
      ${ell(100, 108, 47, 43, '#9A6338')}
      <path d="M100 98 Q90 82 78 88 Q60 96 64 120 Q68 146 100 148 Q132 146 136 120 Q140 96 122 88 Q110 82 100 98Z" fill="#F3D2A8"/>
      <path d="M92 66 Q100 52 104 66 Q110 56 112 68" stroke="#9A6338" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${dots(100, 110, 16)}${blush(100, 126, 27)}
      <circle cx="96" cy="124" r="1.8" fill="#7A4A2A"/><circle cx="104" cy="124" r="1.8" fill="#7A4A2A"/>
      ${line('M90 132 Q100 141 110 132', C.eye, 2.8)}`,
    tail: (suit) => suit
      ? `<path d="M126 196 Q160 200 158 170 Q156 150 142 154" stroke="${C.white}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="142" cy="154" r="7" fill="${PC.mica.c}"/>`
      : `<path d="M126 196 Q174 204 172 160 Q170 132 150 140" stroke="#9A6338" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    pods: (p) => `<circle cx="38" cy="104" r="15" fill="${C.white}"/><circle cx="38" cy="104" r="7" fill="${p.c}"/><circle cx="162" cy="104" r="15" fill="${C.white}"/><circle cx="162" cy="104" r="7" fill="${p.c}"/>`,
  },
};
const ORIG = { head: HEAD.mica, limb: FUR.mica.limb };
function useVariant(k) { const v = V[k]; MICA = v; HEAD.mica = v.head; FUR.mica.limb = v.fur.limb; }

function micaSheet() {
  const keys = ['tortoise', 'cat', 'monkey'], CW = 380, X = 30;
  let body = '';
  keys.forEach((k, i) => {
    useVariant(k);
    const x = X + i * CW;
    body += `<rect x="${x}" y="110" width="${CW - 20}" height="780" rx="26" fill="${k === 'cat' ? '#fff' : '#F8F6F1'}" ${k === 'cat' ? `stroke="${C.teal}" stroke-width="3"` : ''}/>
      <text x="${x + 24}" y="152" font-size="24" fill="${C.ink}" ${FONT}>${V[k].title}</text>
      ${k === 'cat' ? `<rect x="${x + 230}" y="134" width="110" height="22" rx="11" fill="${C.teal}"/><text x="${x + 285}" y="149" text-anchor="middle" font-size="11" fill="#fff" ${FONT} letter-spacing="1">MY PICK</text>` : ''}
      <g transform="translate(${x + 180} 270) scale(1.45) translate(-100 -108)">${HEAD.mica()}</g>
      <g transform="translate(${x + 4} 380)">${shadow}${dressed('mica', 'role')}</g>
      <g transform="translate(${x + 176} 380)">${shadow}${suit('mica', 'visor')}</g>
      ${V[k].note.map((t, j) => `<text x="${x + 24}" y="${660 + j * 22}" font-size="15" fill="#5E6575" ${BODYFONT}>${t}</text>`).join('')}
      <g transform="translate(${x + 30} 750) scale(.42)">${['bram', 'remy', 'mica', 'cmdr'].map((w, j) => `<g transform="translate(${j * 175} 0)">${dressed(w, 'role')}</g>`).join('')}</g>
      <text x="${x + 24}" y="${872}" font-size="12" fill="#9AA0AC" ${BODYFONT}>with the crew at small size</text>`;
  });
  MICA = null; HEAD.mica = ORIG.head; FUR.mica.limb = ORIG.limb;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 910" width="1170" height="910">
  <rect width="1170" height="910" fill="#EEEBE4"/><rect width="1170" height="90" fill="${C.teal}"/>
  <text x="30" y="58" font-size="34" fill="#fff" ${FONT}>Mica: new species options</text>
  <text x="1140" y="56" text-anchor="end" font-size="15" fill="#E6FBFF" ${BODYFONT}>same name, job and personality · history nods TO VERIFY</text>
  ${body}</svg>\n`;
}
writeFileSync(join(OUT, 'mica-options.svg'), micaSheet());

// ================= Curio as a small robot: wheels / legs / wheel-feet =================
const PIX = {
  eye: ['XXX', 'XXX', 'XXX'], arc: ['.X.', 'X.X'], big: ['XXXX', 'XXXX', 'XXXX', 'XXXX'], gt: ['X..', '.X.', 'X..'], lt: ['..X', '.X.', '..X'],
  smile: ['X....X', '.XXXX.'], open: ['XXXXXX', '.XXXX.'], o: ['XX', 'XX'], wavy: ['.X..X.', 'X.XX.X'], flat: ['XXXX'],
  q: ['.XXX.', 'X...X', '...X.', '..X..', '.....', '..X..'],
};
const PFACE = {
  happy: ['eye', 'eye', 'smile'], smile: ['arc', 'arc', 'smile'], wow: ['big', 'big', 'o'], laugh: ['gt', 'lt', 'open'],
  worried: ['eye', 'eye', 'wavy'], think: ['eye', 'flat', null],
};
const pix = (b, x0, y0, s = 4, col = '#6FE7EF') => PIX[b].flatMap((r, i) => [...r].map((ch, j) => ch === 'X' ? `<rect x="${x0 + j * s}" y="${y0 + i * s}" width="${s}" height="${s}" fill="${col}"/>` : '')).join('');
function screenFace(ex) {
  const [l, r, m] = PFACE[ex];
  const w = (b) => PIX[b][0].length * 4, h = (b) => PIX[b].length * 4;
  return pix(l, 86 - w(l) / 2, 86 - h(l) / 2) + pix(r, 114 - w(r) / 2, 86 - h(r) / 2) + (m ? pix(m, 100 - w(m) / 2, 98) : '')
    + `<rect x="72" y="96" width="7" height="4" fill="${C.pink}" opacity=".75"/><rect x="121" y="96" width="7" height="4" fill="${C.pink}" opacity=".75"/>`;
}
// head modelled loosely on Curiosity's mast head: wide camera box, round "eye" on top, side cameras
function robotHead(ex, tilt = 0) {
  return `<g transform="rotate(${tilt} 100 122)">
    <rect x="94" y="114" width="12" height="18" rx="4" fill="${C.shade}"/>
    <rect x="93" y="40" width="14" height="14" rx="4" fill="${C.shade}"/>
    <circle cx="100" cy="38" r="11" fill="${C.white}"/><circle cx="100" cy="38" r="5.5" fill="${C.navy}"/><circle cx="102" cy="36" r="1.8" fill="#fff"/>
    <rect x="48" y="70" width="10" height="24" rx="5" fill="${C.shade}"/><rect x="142" y="70" width="10" height="24" rx="5" fill="${C.shade}"/>
    <rect x="56" y="52" width="88" height="66" rx="24" fill="${C.white}"/><rect x="56" y="104" width="88" height="14" rx="7" fill="${C.shade}" opacity=".8"/>
    <rect x="64" y="60" width="72" height="50" rx="18" fill="${C.ink}"/>
    ${screenFace(ex)}</g>`;
}
const RSH = { L: [72, 148], R: [128, 148] };
const rArm = (side, a) => `<g transform="translate(${RSH[side]}) rotate(${a})"><rect x="-7" y="-5" width="14" height="26" rx="7" fill="#CFC8BA"/><circle cx="0" cy="22" r="7.5" fill="${C.navy}"/></g>`;
const BASE = {
  wheels: `<rect x="76" y="186" width="48" height="10" rx="5" fill="${C.shade}"/>
    ${[70, 130].map((x) => `<circle cx="${x}" cy="206" r="19" fill="${C.navy}"/>${[0, 45, 90, 135].map((r) => `<rect x="${x - 2}" y="187" width="4" height="38" rx="2" fill="#3A4C80" transform="rotate(${r} ${x} 206)"/>`).join('')}<circle cx="${x}" cy="206" r="8" fill="${C.white}"/>`).join('')}`,
  legs: [84, 116].map((x) => `<rect x="${x - 7}" y="184" width="14" height="24" rx="7" fill="${C.white}" stroke="${C.shade}" stroke-width="2"/>${ell(x, 214, 13, 8, C.navy)}`).join(''),
  bogie: [84, 116].map((x) => `<rect x="${x - 7}" y="184" width="14" height="20" rx="7" fill="${C.white}" stroke="${C.shade}" stroke-width="2"/>
    <rect x="${x - 15}" y="200" width="30" height="9" rx="4.5" fill="${C.shade}"/>${[-10, 0, 10].map((d) => `<circle cx="${x + d}" cy="214" r="6" fill="${C.navy}"/><circle cx="${x + d}" cy="214" r="2" fill="${C.white}"/>`).join('')}`).join(''),
};
const RPOSE = { rest: [18, -18], point: [18, -140], cheer: [140, -140], worry: [150, -150] };
function robot(base, { ex = 'happy', pose = 'rest', tilt = 0, extra = '' } = {}) {
  const [aL, aR] = RPOSE[pose];
  return `${G(base === 'wheels' ? 'wheels' : 'feet', BASE[base])}<g id="body">
    <clipPath id="rb${++uid}"><rect x="68" y="128" width="64" height="64" rx="26"/></clipPath>
    <rect x="68" y="128" width="64" height="64" rx="26" fill="${C.white}"/>
    <g clip-path="url(#rb${uid})"><rect x="116" y="128" width="20" height="64" fill="${C.shade}" opacity=".7"/><rect x="60" y="178" width="80" height="16" fill="${C.shade}"/></g>
    <rect x="86" y="146" width="28" height="18" rx="6" fill="${C.teal}"/>
    <circle cx="93" cy="155" r="3" fill="${C.amber}"/><circle cx="107" cy="155" r="3" fill="#fff"/>
    </g>${G('head', robotHead(ex, tilt))}${G('arm-left', rArm('L', aL))}${G('arm-right', rArm('R', aR))}${G('extras', extra)}`;
}
const spark = (x, y, s, col = C.amber) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10Z" fill="${col}"/>`;
const bubble = (x, y, t) => `<g transform="translate(${x} ${y})"><rect x="-20" y="-20" width="40" height="32" rx="12" fill="#fff" stroke="${C.shade}" stroke-width="2"/><path d="M-6 12 l-6 9 v-9Z" fill="#fff"/><text x="0" y="3" text-anchor="middle" font-size="20" fill="${C.ink}" ${FONT}>${t}</text></g>`;

function curioSheet() {
  useVariant('cat');
  const opts = [
    ['wheels', '1 · Wheels', ['Rolls like a rover: clear Curiosity', 'link, simple to animate.', 'Risk: still a bit "vehicle"; can', "hop or dance less."]],
    ['bogie', '2 · Wheel-feet', ['Walks, but each foot is a tiny', '3-wheel rover bogie. Keeps the', 'Curiosity nod and the cuteness.', 'Risk: more detail at small size.']],
    ['legs', '3 · Little legs', ['Most expressive: hops, dances.', 'Matches the crew best.', 'Risk: loses the rover link;', 'reads as a generic robot.']],
  ];
  const CW = 380, X = 30;
  let body = '';
  opts.forEach(([b, title, note], i) => {
    const x = X + i * CW, pick = b === 'bogie';
    body += `<rect x="${x}" y="110" width="${CW - 20}" height="800" rx="26" fill="${pick ? '#fff' : '#F8F6F1'}" ${pick ? `stroke="${C.teal}" stroke-width="3"` : ''}/>
      <text x="${x + 24}" y="152" font-size="24" fill="${C.ink}" ${FONT}>${title}</text>
      ${pick ? `<rect x="${x + 230}" y="134" width="110" height="22" rx="11" fill="${C.teal}"/><text x="${x + 285}" y="149" text-anchor="middle" font-size="11" fill="#fff" ${FONT} letter-spacing="1">MY PICK</text>` : ''}
      <g transform="translate(${x + 180} 330) scale(1.2) translate(-100 -140)">${ell(100, 226, 46, 6, '#000', 'opacity=".08"')}${robot(b, { ex: 'happy', tilt: -5 })}</g>
      <g transform="translate(${x + 30} 450) scale(.72)">${ell(100, 226, 40, 5, '#000', 'opacity=".08"')}${robot(b, { ex: 'think', pose: 'point', tilt: 6, extra: bubble(160, 40, '?') })}</g>
      <g transform="translate(${x + 190} 450) scale(.72)">${ell(100, 226, 40, 5, '#000', 'opacity=".08"')}${robot(b, { ex: 'laugh', pose: 'cheer', extra: spark(40, 60, .9) + spark(166, 46, .7, C.pink) })}</g>
      <text x="${x + 100}" y="${630}" text-anchor="middle" font-size="13" fill="#9AA0AC" ${BODYFONT}>explaining</text>
      <text x="${x + 262}" y="${630}" text-anchor="middle" font-size="13" fill="#9AA0AC" ${BODYFONT}>cheering</text>
      ${note.map((t, j) => `<text x="${x + 24}" y="${666 + j * 22}" font-size="15" fill="#5E6575" ${BODYFONT}>${t}</text>`).join('')}
      <g transform="translate(${x + 18} 768) scale(.42)">
        ${['cmdr', 'bram', 'remy', 'mica'].map((w, j) => `<g transform="translate(${j * 150} 0)">${dressed(w, 'role')}</g>`).join('')}
        <g transform="translate(600 ${226 - 226 * 0.72}) scale(.72)">${robot(b, { ex: 'smile' })}</g></g>
      <text x="${x + 24}" y="${896}" font-size="12" fill="#9AA0AC" ${BODYFONT}>size next to the crew</text>`;
  });
  const faces = ['happy', 'smile', 'think', 'wow', 'worried', 'laugh'];
  const strip = `<rect x="${X}" y="930" width="1120" height="190" rx="26" fill="#F8F6F1"/>
    <text x="${X + 24}" y="968" font-size="20" fill="${C.ink}" ${FONT}>Screen faces (all versions)</text>
    ${faces.map((f, i) => `<g transform="translate(${X + 40 + i * 180} 990) scale(.9) translate(-40 -30)">${robotHead(f)}</g><text x="${X + 100 + i * 180} " y="1104" text-anchor="middle" font-size="13" fill="#9AA0AC" ${BODYFONT}>${f}</text>`).join('')}`;
  MICA = null; HEAD.mica = ORIG.head; FUR.mica.limb = ORIG.limb;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 1150" width="1170" height="1150">
  <rect width="1170" height="1150" fill="#EEEBE4"/><rect width="1170" height="90" fill="${C.teal}"/>
  <text x="30" y="58" font-size="34" fill="#fff" ${FONT}>Curio as a robot</text>
  <text x="1140" y="56" text-anchor="end" font-size="15" fill="#E6FBFF" ${BODYFONT}>head inspired by Curiosity's camera mast · crew shown with cat Mica</text>
  ${body}${strip}</svg>\n`;
}
writeFileSync(join(OUT, 'curio-options.svg'), curioSheet());

// ================= Figma export: one clean SVG per character / version =================
import { mkdirSync } from 'node:fs';
const EXP = join(OUT, '..', 'figma-export');
const one = (name, inner, vb = '0 0 200 240') => {
  const file = join(EXP, `${name}.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${vb.split(' ')[2]}" height="${vb.split(' ')[3]}"><g id="${name.split('/').pop()}">${inner}</g></svg>\n`);
};
const NAMES = { bram: 'bram', remy: 'remy', cmdr: 'commander' };
let n = 0;
for (const w of ['bram', 'remy', 'cmdr']) {
  for (const o of ['polo', 'hoodie', 'role']) { one(`crew/${NAMES[w]}-clothes-${o}`, dressed(w, o)); n++; }
  for (const k of ['bubble', 'visor', 'colour']) { one(`crew/${NAMES[w]}-suit-${k}`, suit(w, k)); n++; }
}
for (const sp of ['cat', 'tortoise', 'monkey']) {
  useVariant(sp);
  for (const o of ['polo', 'hoodie', 'role']) { one(`mica/mica-${sp}-clothes-${o}`, dressed('mica', o)); n++; }
  for (const k of ['bubble', 'visor', 'colour']) { one(`mica/mica-${sp}-suit-${k}`, suit('mica', k)); n++; }
  one(`mica/mica-${sp}-head`, G('head', HEAD.mica()), '0 0 200 170'); n++;
}
MICA = null; HEAD.mica = ORIG.head; FUR.mica.limb = ORIG.limb;
for (const b of ['bogie', 'wheels', 'legs']) {
  const nm = { bogie: 'wheel-feet', wheels: 'wheels', legs: 'legs' }[b];
  one(`curio/curio-${nm}-happy`, robot(b, { ex: 'happy', tilt: -5 }));
  one(`curio/curio-${nm}-explaining`, robot(b, { ex: 'think', pose: 'point', tilt: 6, extra: bubble(160, 40, '?') }));
  one(`curio/curio-${nm}-cheering`, robot(b, { ex: 'laugh', pose: 'cheer', extra: spark(40, 60, .9) + spark(166, 46, .7, C.pink) }));
  n += 3;
}
for (const f of ['happy', 'smile', 'think', 'wow', 'worried', 'laugh']) { one(`curio/faces/curio-face-${f}`, G('head', robotHead(f)), '40 20 120 120'); n++; }
console.log('figma export:', n, 'files');

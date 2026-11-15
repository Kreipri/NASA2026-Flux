import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { writeSubmissionResources } from './submission-resources.ts';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
export function buildWeb() {
  const out = resolve(root, 'dist');
  mkdirSync(out, { recursive: true });
  const json = (p: string) => JSON.stringify(JSON.parse(read(p)));
  let engine = stripTypeScriptTypes(read('src/engine/engine.ts'));
  for (const [name, path] of [['moon', 'config/moon.json'], ['scenarios', 'config/scenarios.json'], ['storm', 'data/storm-2024-05.json']]) {
    engine = engine.replace(new RegExp(`import ${name} from [^;]+;`), `const ${name} = ${json('src/' + path)};`);
  }
  writeFileSync(resolve(out, 'engine.js'), engine);
  for (const file of ['model.js', 'game.js', 'ending.js', 'panels.js']) {
    let source = read('src/web/' + file).replaceAll('../engine/engine.ts', './engine.js');
    source = source.replace(/import moon from [^;]+;/, `const moon = ${json('src/config/moon.json')};`);
    writeFileSync(resolve(out, file), source);
  }
  const dock = 'ideas/ui-mockups/gameplay-side-dock-v2/source/';
  // Adapt the finished opening flow in memory. Its source and generated design files stay intact.
  let html = read('ideas/ui-mockups/flow-start-v1.html');
  const replace = (from: string, to: string) => {
    if (!html.includes(from)) throw new Error(`Opening-flow integration point changed: ${from.slice(0, 80)}`);
    html = html.replace(from, to);
  };
  replace('<title>Opening Flow</title>', '<title>Space Base Commander</title>');
  replace("id:'week1',name:'Week 1'", "id:'week1',name:'Mission'");
  html = html.replaceAll('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', './vendor/three.module.js')
    .replaceAll('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/', './vendor/addons/');
  replace('</head>', `<style>${read(dock + 'layouts.css')}\n${read('src/web/game.css')}\n${read('src/web/ending.css')}</style></head>`);
  replace("import * as THREE from 'three';", "import { mountGameplay } from './game.js';\nimport { mountEnding, ENDING_SCREENS } from './ending.js';\nimport { mountPanels } from './panels.js';\nimport * as THREE from 'three';");
  replace("hud.addEventListener('click',e=>{", "hud.addEventListener('click',e=>{\n  if(cur?.week)return;");
  replace('function paint(){const S=cur;', 'function paint(){const S=cur; if(S.week){gameplay.render();return;}');
  replace('const S=SCREENS.find(s=>s.id===id),prev=cur;cur=S;', "const S=SCREENS.find(s=>s.id===id)||SCREENS[0],prev=cur;cur=S;gameplay.deactivate();ending.hide();camera.clearViewOffset();");
  replace("const START_ID=new URLSearchParams(location.search).get('s')||'title';", read('src/web/scene-bridge.js') + "\nconst START_ID=new URLSearchParams(location.search).get('s')||'title';");
  // The player's keyboard handler already handles native buttons correctly; avoid double Enter activation.
  replace("[data-act],[data-pin]'))", "[data-act]'))");
  replace('<div id="note"></div>', '<div id="note" aria-live="polite"></div>');
  // Intro scenes use the rim-only vector base (same composition and ground line as the old PNG, so placement is scaled to match).
  const VB_W = 1100, VB_H = 410, FILL = 0.94, BOTTOM = 0.05; // drawing fills ~94% of the SVG width; ~5% empty below the ground line
  let swapped = 0;
  html = html.replace(/<image href="assets\/base-clipart\.png" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"\/>/g, (_m, x, y, w, h) => {
    swapped++;
    const W = +w / FILL, H = W * VB_H / VB_W;
    const fx = (n: number) => Math.round(n * 10) / 10;
    return `<image href="assets/space-base.svg" x="${fx(+x - (W - +w) / 2)}" y="${fx(+y + +h - H * (1 - BOTTOM))}" width="${fx(W)}" height="${fx(H)}"/>`;
  });
  if (swapped !== 3) throw new Error(`Expected 3 base images in the opening flow, found ${swapped}`);
  // Skip on the story screens goes straight to the playable mission.
  replace("go(cur.id.startsWith('p')?'m1':'arrive')", "go('week1')");
  // The post-processing chain renders into its own target, which loses the canvas's MSAA: edges, outlines and the horizon looked stair-stepped. Give it 4x multisampling.
  replace('const composer=new EffectComposer(renderer);', 'const composer=new EffectComposer(renderer,new THREE.WebGLRenderTarget(1280,720,{type:THREE.HalfFloatType,samples:4}));');
  // Moon surface: soft regolith grain (octaves fade out when a pixel covers more than the feature, so it never shimmers) instead of flat grey bands.
  replace('    float H(vec2 p){vec2 uv=(p-hdom.xy)/hdom.zw;', `    float hsh(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}
    float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hsh(i),hsh(i+vec2(1.0,0.0)),f.x),mix(hsh(i+vec2(0.0,1.0)),hsh(i+vec2(1.0,1.0)),f.x),f.y);}
    float grain(vec2 w,float foot){float s=0.0,a=0.5,wl=40.0;for(int o=0;o<5;o++){s+=a*(vn(w/wl+float(o)*17.0)-0.5)*(1.0-smoothstep(0.25*wl,0.9*wl,foot));wl*=0.38;a*=0.62;}return s;}
    float H(vec2 p){vec2 uv=(p-hdom.xy)/hdom.zw;`);
  replace('c=mix(c,deep,vC*(1.0-smoothstep(0.1-fw,0.1+fw,v)));', 'c=mix(c,deep,vC*(1.0-smoothstep(0.1-fw,0.1+fw,v)));c*=1.0+0.6*grain(vT.xz,length(fwidth(vT.xz)))*(1.0-0.7*vC);');
  // Title menu: "Real NASA data" and "Settings" were look-alike buttons with no action. They now open the mission's Sources and Mission options panels.
  replace('/* 3D controls: data-go', `storyEl.querySelectorAll('.menu span:not(.go)').forEach((el,i)=>{el.dataset.menu=i?'more':'sources';el.setAttribute('role','button');el.tabIndex=0;el.style.cursor='pointer'});
const openMenu=m=>{go('week1');gameplay.openView(m.dataset.menu);gameplay.render('.jobs .x')};
storyEl.addEventListener('click',e=>{const m=e.target.closest('.menu span[data-menu]');if(m)openMenu(m)});
storyEl.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.menu span[data-menu]')){e.preventDefault();openMenu(e.target)}});
/* 3D controls: data-go`);
  // Tutorial -> gameplay transition: fade to a short "Mission start" card, cut to the base while hidden, then reveal while the panels slide in.
  replace('function go(id,instant){', `let missionIntro=false;
function go(id,instant){
  if(id==='week1'&&cur&&cur.id!=='week1'&&!instant&&!missionIntro&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    missionIntro=true;
    fadeEl.className='mission-card-fade';fadeEl.innerHTML='<div class="mission-card"><small>Mission start</small><b>Week 1 of 7</b><span>Take command of the base</span></div>';
    fadeEl.style.pointerEvents='auto';fadeEl.style.opacity=1;
    setTimeout(()=>{goNow(id,true);frame.classList.add('mission-enter');
      setTimeout(()=>{fadeEl.style.opacity=0;setTimeout(()=>{fadeEl.style.pointerEvents='';fadeEl.className='';fadeEl.innerHTML='';frame.classList.remove('mission-enter');missionIntro=false},900)},350)},1300);
    return}
  goNow(id,instant)}
function goNow(id,instant){`);
  replace("const openMenu=m=>{go('week1');", "const openMenu=m=>{goNow('week1',true);");
  // Opening tour reflects the current game: real meter names and ring meters, job-by-job time, three kinds of job, the report card.
  replace("import { mountGameplay } from './game.js';", "import { mountGameplay, tourMeters, tourKinds, tourCard } from './game.js';");
  // The tour is 4 stops: solar, shelter, crater and the job kinds (with crew time). Meters and the report card are now taught by doing in Week 1.
  html = html.replace(/Tour 2\/5/g, 'Tour 1/4').replace(/Tour 4\/5/g, 'Tour 2/4').replace(/Tour 5\/5/g, 'Tour 3/4');
  replace("Up high, they catch more light.'", "Up high, they catch more light. Dust makes them weaker, so a Base job cleans them.'");
  replace("'Each week, your crew has 8 blocks of time. Outside jobs tire them more.'", "'Each week, your crew has 8 blocks of time. Every job uses some, and it happens right away. Outside jobs tire the crew more. When time runs out, the week ends.'");
  replace("Crew time this week<div class=\"blocks\">", "${hl?'Crew time each week: <b>8 blocks</b>':`Time left: <b>${8-n} / 8</b>`}<div class=\"blocks\">");
  replace("In a storm, we come in here.'", "In a storm, a Crew job takes everyone in here. A Mission job piles on more soil.'");
  replace("might hide ice, and finding it is one of our jobs! Trips there are dark, freezing and use lots of power.','F09 F29','Start week 1 ▶','week1')},",
    "might hide ice, and finding it is a Mission job! Fly the hop-drone first to map it, then drive the rover. Trips there use lots of power.','F09 F29','Next: how jobs work ▶','t6')},\n" +
    "  {id:'t6',name:'Tour · jobs',cam:'base',pins:true,note:'<b>Tour 4/4: how jobs work.</b> Eight time blocks a week; Mission, Base and Crew jobs. Game rule, so no NASA badge.',\n" +
    "   html:()=>skipTour+tourKinds()+cap('curio','Each week your crew has <b>8 time blocks</b>. A job uses blocks for the time and effort it needs, and it happens right away. Jobs come in 3 kinds: <b>Mission</b> jobs collect evidence, <b>Base</b> jobs keep power and air healthy, <b>Crew</b> jobs look after the astronauts.','','Start week 1 ▶','week1')},");
  // Remove the meters and crew-time stops from the flow and skip them in the chain.
  html = html.replace(/\n  \{id:'t1',[^\n]*\n[^\n]*/, '').replace(/\n  \{id:'t3',[^\n]*\n[^\n]*/, '');
  replace("'Show me the base ▶','t1')", "'Show me the base ▶','t2')");
  replace("'Next: crew time ▶','t3')", "'Next: the shelter ▶','t4')");
  // Google Fonts must not block first paint; system fallbacks cover the gap.
  replace('family=Lexend:wght@400;600&display=swap" rel="stylesheet">', 'family=Lexend:wght@400;600&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'">');
  // Screen navigator, design notes and prev/next arrows are dev tools: hidden unless debug mode is on.
  // Enable with ?debug (remembered in this browser), toggle with Shift+D, turn off with ?debug=0.
  replace('</head>', `<style>html:not(.debug) #nav,html:not(.debug) .foot{display:none}</style><script>(()=>{const r=document.documentElement,k='sbc-debug';let on=false;try{const q=new URLSearchParams(location.search).get('debug');if(q!==null){on=q!=='0'&&q!=='off';localStorage.setItem(k,on?'1':'0')}else on=localStorage.getItem(k)==='1'}catch{on=new URLSearchParams(location.search).has('debug')}r.classList.toggle('debug',on);addEventListener('keydown',e=>{if(e.key==='f'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.target.closest?.('input,textarea')){try{document.fullscreenElement?document.exitFullscreen():r.requestFullscreen?.()}catch{}}if(e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&e.key==='D'&&!e.target.closest?.('input,textarea')){on=!on;r.classList.toggle('debug',on);try{localStorage.setItem(k,on?'1':'0')}catch{}}})})()</script></head>`);
  writeFileSync(resolve(out, 'index.html'), html);
  cpSync(resolve(root, 'ideas/ui-mockups/assets'), resolve(out, 'assets'), { recursive: true });
  cpSync(resolve(root, 'ideas/base-designs/vector-v3/space-base.svg'), resolve(out, 'assets/space-base.svg'));
  cpSync(resolve(root, 'node_modules/three/build/three.module.min.js'), resolve(out, 'vendor/three.module.js'), { recursive: true });
  cpSync(resolve(root, 'node_modules/three/examples/jsm'), resolve(out, 'vendor/addons'), { recursive: true });
  cpSync(resolve(root, 'node_modules/three/LICENSE'), resolve(out, 'vendor/LICENSE-three.txt'));
  writeSubmissionResources(root, out);
  console.log('Built dist/index.html — seven-week browser game');
  return out;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildWeb();

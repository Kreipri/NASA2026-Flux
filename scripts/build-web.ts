import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

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
  for (const file of ['model.js', 'game.js']) {
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
  replace('</head>', `<style>${read(dock + 'layouts.css')}\n${read('src/web/game.css')}</style></head>`);
  replace("import * as THREE from 'three';", "import { mountGameplay } from './game.js';\nimport * as THREE from 'three';");
  replace("hud.addEventListener('click',e=>{", "hud.addEventListener('click',e=>{\n  if(cur?.week)return;");
  replace('function paint(){const S=cur;', 'function paint(){const S=cur; if(S.week){gameplay.render();return;}');
  replace('const S=SCREENS.find(s=>s.id===id),prev=cur;cur=S;', "const S=SCREENS.find(s=>s.id===id)||SCREENS[0],prev=cur;cur=S;gameplay.deactivate();camera.clearViewOffset();");
  replace("const START_ID=new URLSearchParams(location.search).get('s')||'title';", read('src/web/scene-bridge.js') + "\nconst START_ID=new URLSearchParams(location.search).get('s')||'title';");
  // The player's keyboard handler already handles native buttons correctly; avoid double Enter activation.
  replace("[data-act],[data-pin]'))", "[data-act]'))");
  replace('<div id="note"></div>', '<div id="note" aria-live="polite"></div>');
  writeFileSync(resolve(out, 'index.html'), html);
  cpSync(resolve(root, 'ideas/ui-mockups/assets'), resolve(out, 'assets'), { recursive: true });
  cpSync(resolve(root, 'node_modules/three/build/three.module.js'), resolve(out, 'vendor/three.module.js'), { recursive: true });
  cpSync(resolve(root, 'node_modules/three/examples/jsm'), resolve(out, 'vendor/addons'), { recursive: true });
  cpSync(resolve(root, 'node_modules/three/LICENSE'), resolve(out, 'vendor/LICENSE-three.txt'));
  console.log('Built dist/index.html — seven-week browser game');
  return out;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildWeb();

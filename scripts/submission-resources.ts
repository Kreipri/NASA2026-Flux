// AI-assisted packaging code. Provenance: AI_DISCLOSURE.md and ai-disclosure.json.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function writeSubmissionResources(root: string, out: string) {
  const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
  const markdown = read('CREDITS.md');
  // Keep the full credit inventory readable without a Markdown runtime dependency.
  const content = markdown.split('\n').map(line => {
    const text = escape(line).replace(/https?:\/\/[^\s<]+/g, url => `<a href="${url}">${url}</a>`);
    if (line.startsWith('# ')) return `<h1>${text.slice(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2 id="${line.slice(3).toLowerCase().replaceAll(' ', '-')}">${text.slice(3)}</h2>`;
    return line ? `<p>${text}</p>` : '';
  }).join('\n');
  writeFileSync(resolve(out, 'credits.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Credits — Space Base Commander</title><style>body{margin:40px auto;padding:0 24px;max-width:900px;font:17px/1.65 system-ui;color:#17243a;background:#f5fafb}h1,h2{line-height:1.2}h2{margin-top:2em}a{color:#075c79;overflow-wrap:anywhere}p{margin:.65em 0}nav{display:flex;gap:24px;flex-wrap:wrap}</style><nav><a href="./">Play the game</a><a href="./demo.pdf">Seven-slide demo</a><a href="./judge-guide.txt">Judge quick-start</a><a href="./ai-disclosure.json">AI metadata</a></nav>${content}</html>`);
  writeFileSync(resolve(out, 'CREDITS.md'), markdown);
  cpSync(resolve(root, 'AI_DISCLOSURE.md'), resolve(out, 'AI_DISCLOSURE.md'));
  cpSync(resolve(root, 'ideas/submission-package/ai-disclosure.json'), resolve(out, 'ai-disclosure.json'));
  cpSync(resolve(root, 'ideas/submission-package/judge-guide.md'), resolve(out, 'judge-guide.txt'));
  cpSync(resolve(root, 'ideas/fact-sources.md'), resolve(out, 'fact-sources.md'));
  mkdirSync(resolve(out, 'licenses'), { recursive: true });
  cpSync(resolve(root, 'ideas/submission-package/assets/licenses'), resolve(out, 'licenses'), { recursive: true });
  // This retired raster file is no longer referenced: the build substitutes space-base.svg.
  rmSync(resolve(out, 'assets/base-clipart.png'), { force: true });
  for (const name of ['game.js', 'panels.js']) {
    const p = resolve(out, name);
    const source = readFileSync(p, 'utf8').replaceAll('https://science.nasa.gov/earth/earth-observatory/collections/blue-marble/', './credits.html#earth-textures').replaceAll('NASA Blue Marble', 'three.js example textures');
    writeFileSync(p, source);
  }
  const index = resolve(out, 'index.html');
  const notice = `<aside class="submission-credit"><span>AI-generated vector/3D artwork · Curio design by Bea</span> <a href="./credits.html" target="_blank" rel="noopener">Sources &amp; credits</a></aside><style>.submission-credit{position:fixed;bottom:3px;right:10px;z-index:9999;max-width:calc(100vw - 20px);font:11px/1.4 system-ui;color:#cbddea;background:#101b32dc;padding:3px 7px;border-radius:4px}.submission-credit a{color:#8de6ed;margin-left:8px}@media(max-width:700px){.submission-credit{font-size:9px}}</style>`;
  writeFileSync(index, readFileSync(index, 'utf8').replace('</body>', notice + '</body>'));
}

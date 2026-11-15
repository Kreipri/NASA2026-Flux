import { createServer } from 'node:http';
import { readFileSync, statSync, watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { buildWeb, root } from './build-web.ts';
const out = buildWeb();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const port = Number(process.argv[2] || process.env.PORT || 5173);
const server = createServer((req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url!, 'http://localhost').pathname);
    const file = resolve(out, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(out + sep) || !statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    const body = readFileSync(file), ext = extname(file);
    const vendor = path.startsWith('/vendor/') || path.startsWith('/assets/');
    const gz = /\bgzip\b/.test(String(req.headers['accept-encoding'])) && ['.html', '.js', '.css', '.svg'].includes(ext);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': vendor ? 'max-age=3600' : 'no-cache', ...(gz && { 'Content-Encoding': 'gzip' }) });
    res.end(gz ? gzipSync(body) : body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
let timer: ReturnType<typeof setTimeout>;
for (const path of ['src', 'ideas/ui-mockups/flow-start-v1.html', 'ideas/ui-mockups/gameplay-side-dock-v2/source/layouts.css']) {
  watch(resolve(root, path), { recursive: path === 'src' }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { try { buildWeb(); console.log('Updated. Reload the browser.'); } catch (err) { console.error(err.message); } }, 150);
  });
}
server.on('error', (err) => { console.error(err.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`Play at http://localhost:${port} — Ctrl+C stops the server`));

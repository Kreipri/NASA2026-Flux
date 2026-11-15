// Renders build/deck.html to output/space-base-commander-demo.pdf and per-slide PNG previews.
// node ideas/submission-package/build/render-deck.mjs
import {chromium} from '/Users/bg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import path from 'node:path';
import fs from 'node:fs/promises';
const here = new URL('.', import.meta.url).pathname;
const out = path.join(here, '../output/');
await fs.mkdir(out + 'previews', {recursive: true});
const browser = await chromium.launch({headless: true, executablePath: '/Users/bg/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'deck.html'), {waitUntil: 'networkidle', timeout: 60000});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const slides = await page.locator('section.slide').all();
for (let i = 0; i < slides.length; i++) await slides[i].screenshot({path: `${out}previews/slide-${i + 1}.png`});
await page.pdf({path: out + 'space-base-commander-demo.pdf', width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true});
console.log('slides', slides.length);
await browser.close();

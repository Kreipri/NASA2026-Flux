import {chromium} from '/Users/bg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const out=new URL('../assets/',import.meta.url).pathname;
const browser=await chromium.launch({headless:true,executablePath:'/Users/bg/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5384/?debug=0');
await page.waitForTimeout(2500);
await page.screenshot({path:out+'title.png'});
// Reach week 2 through legal model actions from a seeded new mission.
const setup=await page.evaluate(async()=>{const a=await import('./model.js');let m=a.createMission('weeks7',42);m=a.choose(m,'clean').mission;for(const id of ['logsun','air','rest'])m=a.doJob(m,id).mission;m=a.nextWeek(a.endWeek(m).mission);const opening=a.alertCard(m);if(m.week.prompt)m=a.choose(m,'continue').mission;m.briefedTurn=m.state.turn;localStorage.setItem('lunar-ridge.browser.v2',JSON.stringify(m));return{turn:m.state.turn,environment:m.state.timeline[m.state.turn],opening,meterBefore:{power:m.state.power,o2:m.state.o2,dose:m.state.dose,stamina:m.state.stamina},timeBefore:m.week.blocks-m.week.used};});
await page.goto('http://127.0.0.1:5384/?s=week1&debug=0');await page.waitForTimeout(2500);
console.log(JSON.stringify({setup,buttons:await page.locator('button').allTextContents()}));
await page.screenshot({path:out+'week2.png'});
await fs.writeFile(out+'capture-setup.json',JSON.stringify(setup,null,2));
await browser.close();console.log(JSON.stringify({errors}));

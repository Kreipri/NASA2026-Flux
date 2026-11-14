import { env, menu, actionDef, checklist, totalStars, verdict, totalDays, stormActive } from '../engine/engine.ts';
import { createMission, addJob, removeJob, resolveWeek, previewJobs, jobPreview, environmentTitle, alertCard, readSaved, usedTime, blocksToday } from './model.js';

const SAVE_KEY = 'lunar-ridge.browser.v1';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const sign = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;
const LABELS = { air:'Run the air system', rest:'Rest and exercise', logsun:'Record light and shadows', scout:'Send the scout drone', rover:'Drive to the dark crater', regolith:'Add soil to the shelter', powersave:'Turn power down', call:'Call Mission Control' };
const jobName = id => LABELS[id] || actionDef(id).label;
const PLACES = { hab:{ name:'Crew home', tab:'Home', jobs:['air','rest','repair','powersave','call'] }, solar:{ name:'Solar panels', tab:'Panels', jobs:['clean','logsun'] }, shelter:{ name:'Storm shelter', tab:'Shelter', jobs:['shelter','regolith','measure'] }, rover:{ name:'Rover', tab:'Rover', jobs:['scout','rover'] } };
const HELP = { power:['Power','Runs the base and its machines. Sunlight charges the batteries. Keep power high.'], o2:['Air','Air keeps the crew breathing. The air system uses power to add air. Keep air high.'], dose:['Radiation','This adds up the radiation the crew receives. Keep it low. Rest cannot remove it. These are game points, not a NASA safety limit.'], stamina:['Crew energy','How rested your crew feels. Outside jobs tire them more. Rest and unused crew time help. A tired crew has fewer time blocks next week.'] };
const GOALS = { LIGHT:'Light', RADIATION:'Radiation', SHELTER:'Shelter', ICE:'Ice' };
const EFFECTS = { logsun:'Evidence about light and shadow.', measure:'A radiation reading for the report card.', scout:'A map that improves the next rover’s ice chance.', rover:'A crater survey. A dry sample still counts as evidence.', regolith:'An extra layer of soil on the shelter.', clean:'Dust removed, so the panels can charge better.', air:'More air for the crew.', repair:'One broken base system fixed.', powersave:'Less battery power spent on the base.', shelter:'Less exposure during the storm peak.', rest:'A chance for the crew to recover.', call:'A forecast, or a check-in from week 5 in Solar max.' };
const ICON = { power:'⚡', o2:'◌', dose:'☢', stamina:'♡' };

export function mountGameplay({ hud, frame, pins, assets, updateScene, updateLayout, onHome }) {
  let mission, storage = true;
  try { mission = readSaved(localStorage.getItem(SAVE_KEY)); } catch { storage = false; }
  mission ||= createMission('weeks7', Math.floor(Math.random() * 0x7fffffff));
  const ui = { active:false, view:'jobs', place:'hab', open:true, job:null, goal:null, question:'jobs', resource:null, returnView:'jobs', warning:'', modal:null };
  const btn = (action, text, cls = '') => `<button class="${cls}" data-game-action="${action}">${text}</button>`;
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(mission)); } catch { storage = false; } }
  function current() { return env(mission.state); }
  function chip(text, c = '#5fd0c8') { return `<span class="jc" style="--c:${c}">${esc(text)}</span>`; }
  function meter(k, name, c) {
    const p = previewJobs(mission), value = mission.state[k], diff = p[k] - value;
    const status = k === 'dose' ? 'Keep low' : k === 'stamina' && value < 50 ? 'Tired crew' : value <= 25 ? 'Low' : 'Good';
    return `<button class="resource-cell" data-game-resource="${k}" style="--meter:${c}" aria-label="${name}: ${value} out of 100. ${status}. Learn more."><span class="resource-title"><span aria-hidden="true">${ICON[k]}</span>${name}</span><span class="resource-value">${value}<small>/100</small></span><span class="resource-bar" role="meter" aria-label="${name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><i style="width:${value}%"></i></span><span class="resource-status">${status}</span>${diff ? `<span class="resource-change">${sign(diff)} from jobs</span>` : ''}</button>`;
  }
  function resources() {
    return `<section class="resources" aria-label="Base and crew meters">${meter('power','Power','#ffd34d')}${meter('o2','Air','#7fe3ff')}${meter('dose','Radiation','#b4e05c')}${meter('stamina','Crew energy','#ff7b8f')}<span class="meter-help">Current values · Job changes are a preview</span></section>`;
  }
  function topbar() {
    const s = mission.state, e = current();
    return `<div class="top3"><div class="wk">Week ${Math.min(s.turn + 1, 7)} <small>of 7</small><span class="dots">${s.timeline.map((_, i) => `<i class="${i === s.turn ? 'now' : i < s.turn ? 'past' : ''}"></i>`).join('')}</span></div><button class="chip3 ${e.link?'':'radio-off'}" data-game-action="radio"><span class="d"></span>Earth radio: ${e.link?'on':'off'} <span aria-hidden="true">?</span></button><nav class="view-tabs" aria-label="Side dock view">${btn('jobs','Jobs')}${btn('missions',`Mission ${verdict(s).mainDone}/4`)}${btn('more','More')}</nav></div>`;
  }
  function sourceBadge() {
    const e = current();
    if (!e.stormName) return btn('sources', 'Simulated game conditions', 'source-tag');
    if (e.storm==='warning') return btn('sources','NASA archive · solar flare','source-tag');
    return btn('sources', `${e.realDay ? 'NASA archive' : 'Historic storm · game profile'}: ${esc(e.stormName)}`, 'source-tag');
  }
  function brief() {
    const s = mission.state, e = current();
    const main = s.emergency ? 'Let sunlight recharge the base. Clean panels or rest.' : stormActive(e) ? 'Protect the crew. A storm reading helps the report.' : e.sun === 'dark' ? 'Stretch the batteries. Record the long shadow.' : 'Collect evidence and prepare the base.';
    return `<section class="mission-brief" aria-label="This week’s conditions"><span class="brief-speaker">${e.link?'Mission Control':'Curio · onboard update'}</span><h2>${environmentTitle(s)}</h2><p>${main}</p><div class="condition-row">${chip(e.sun==='dark'?'No solar charging':e.sun==='half'?'Reduced solar charging':'Sunlight charges panels')}${chip(`Dust ${s.dust}/3`)}${chip(`Shelter ${s.shelterLevel}/3`)}</div>${sourceBadge()}${s.faults.panel||s.faults.scrubber?`<p class="fault-note">Repair needed: ${[s.faults.panel&&'panel joint',s.faults.scrubber&&'air system'].filter(Boolean).join(' and ')}.</p>`:''}</section>`;
  }
  function time() {
    const available = blocksToday(mission.state), used = usedTime(mission.plan);
    return `<div class="crew3"><span>Time left: <b>${available-used} / ${available}</b></span><div class="blocks" aria-label="${used} of ${available} crew time used">${Array.from({length:available},(_,i)=>`<i class="${i<used?'on':''}"></i>`).join('')}</div></div>`;
  }
  function costs(id) {
    const p = jobPreview(mission, id), j = p.job;
    return chip(`${j.blocks} ${j.blocks===1?'block':'blocks'}`)+(p.power?chip(`Power ${sign(p.power)}`,'#ffd34d'):'')+(j.o2?chip(`Air ${sign(j.o2)}`,'#7fe3ff'):'')+(p.stamina?chip(`Energy ${sign(p.stamina)}`,'#ff7b8f'):'')+(j.dose?chip(`Radiation +${j.dose}`,'#b4e05c'):'')+(j.outside?chip('Outside','#c9b8ff'):'');
  }
  function jobs() {
    const available = menu(mission.state);
    return `<nav class="place-tabs" aria-label="Places">${Object.entries(PLACES).map(([id,p])=>`<button data-game-place="${id}" aria-pressed="${ui.place===id}">${pins[id].ic}<span>${p.tab}</span></button>`).join('')}</nav><div class="job-grid">${PLACES[ui.place].jobs.flatMap(id=>{
      const item = available.find(j=>j.def.id===id); if(!item)return [];
      const count = mission.plan.filter(k=>k===id).length;
      return [`<button class="job ${count?'on':''}" data-game-job="${id}"><span class="jn">${jobName(id)}</span><span class="jcs">${costs(id)}</span>${item.blocked?`<span class="hint">${esc(item.blocked)}</span>`:''}<span class="ck" aria-hidden="true">${count||'+'}</span></button>`];
    }).join('')}</div>${mission.plan.length?`<button class="plan-link" data-game-action="plan">Your plan: ${mission.plan.length} ${mission.plan.length===1?'job':'jobs'} · Review or remove</button>`:''}`;
  }
  function preview() {
    const id=ui.job,p=jobPreview(mission,id), error=addJob(mission,id).error;
    return `${btn('back-jobs','‹ All jobs','text-button')}<h3>${jobName(id)}</h3><div class="jcs preview-costs">${costs(id)}</div><div class="tradeoff"><b>You gain</b><p>${EFFECTS[id]}</p><b>You give up</b><p>${p.job.blocks} crew time and the resources above. ${p.job.outside?'Outside work tires the crew and adds storm exposure.':'This leaves less time for other jobs.'}</p></div>${p.chance!==null?`<p class="chance">${p.chance}% ice chance on the next trip. This is a game chance, not a NASA site estimate.</p>`:''}${id==='shelter'?'<p>Sheltering protects the peak. Planned outside jobs still add exposure.</p>':''}${id==='powersave'?'<p>Heaters run lower: another −10 crew energy at week end. Choose instrument jobs before this one.</p>':''}${error?`<p class="plan-warning" role="status">${esc(error)}</p>`:btn('add-job','Add to my plan','next')}`;
  }
  function plan() {
    return `<h3>Jobs run in this order</h3><ol class="plan-list">${mission.plan.map((id,i)=>`<li><span>${jobName(id)}<small>${actionDef(id).blocks} crew time</small></span><button data-game-remove="${i}" aria-label="Remove ${jobName(id)}">×</button></li>`).join('')}</ol>${!mission.plan.length?'<p>Your plan is empty. Choose a job to begin.</p>':''}<p class="plan-note">Sunlight, base power, breathing and recovery apply at week end. Free crew time helps the crew rest.</p>${btn('jobs','Choose more jobs','text-button')}`;
  }
  function missions() {
    const cl=checklist(mission.state);
    return `<p class="mission-purpose">Keep everyone safe. Prove this ridge can host a Moon base.</p><div class="missions">${Object.entries(cl).map(([g,checks])=>`<section class="mission ${ui.goal===g?'open':''}"><button data-game-goal="${g}" aria-expanded="${ui.goal===g}"><span>${checks[0].done?'✓':'○'} ${GOALS[g]}</span><span class="stars">${checks.map(c=>c.done?'★':'☆').join(' ')}</span></button><p class="main-goal">${esc(checks[0].label)}</p>${ui.goal===g?`<div class="mission-detail"><b>Main goal</b><p>${checks[0].done?'✓':'□'} ${esc(checks[0].label)}</p><b>Bonus goals</b>${checks.slice(1).map(c=>`<p>${c.done?'✓':'□'} ${esc(c.label)}</p>`).join('')}</div>`:''}</section>`).join('')}</div><p class="plan-note">4 main goals + safe crew = Promising. 11 stars = Approved. 12 = Gold. Stars can change as radiation rises.</p>`;
  }
  function help() {
    let answer;
    if(ui.resource) { const [title,body]=HELP[ui.resource]; answer=`<h3>${title}</h3><p>${body}</p>`; }
    else if(ui.question==='time') answer=`<p>Your crew has ${blocksToday(mission.state)} time blocks this week. A tired crew may have fewer next week.</p><p>Unused time helps recovery. A rest job spends time; it does not give more time back.</p>`;
    else if(ui.question==='earth') answer=`<p>Mission Control sends messages when Earth is in view. Earth radio is <b>${current().link?'on':'off'}</b> now.</p><p>When it is off, the onboard alarm still works. I can still help.</p>`;
    else if(ui.question==='meters') answer=Object.entries(HELP).map(([k,[n,t]])=>`<p><b>${n}.</b> ${t}</p>`).join('');
    else answer='<p>Choose a place, then a job. Read what you gain and give up before adding it.</p><p>Review your plan, then run the week. Alerts ask for one more decision.</p>';
    return `<div class="question-tabs">${[['jobs','Choosing jobs'],['time','Crew time'],['earth','Earth radio'],['meters','The meters']].map(([k,n])=>`<button data-game-question="${k}" aria-expanded="${!ui.resource&&ui.question===k}">${n}</button>`).join('')}</div><section class="curio-answer">${answer}</section>`;
  }
  function calendar() {
    return `<h3>The mission calendar</h3><p>Game timing. Space weather may surprise you.</p><ol class="calendar">${mission.state.timeline.map((e,i)=>`<li class="${i===mission.state.turn?'current':''}"><b>Week ${i+1}</b><span>Earth ${e.link?'in view':'out of view'} · ${e.sun==='dark'?'Long shadow':e.sun==='half'?'Short eclipse':'Sunlight'}</span></li>`).join('')}</ol><p class="plan-note">Seven weekly turns compress the mission. Future storm draws stay hidden.</p>`;
  }
  function sources() {
    const e=current();
    return `<h3>Where is this from?</h3><p><b>Simulated:</b> every meter, job cost, ice chance and event timing is a game model. No live feed is shown.</p>${e.stormName?`<p><b>Historic event:</b> ${esc(e.stormName.replace(' false alarm',' solar flare'))}${e.realDay?' · '+esc(e.realDay):''}.</p>`:''}${e.realDay?'<p><b>NASA archive:</b> the bundled May 2024 CRaTER/LRO measurements were recorded in lunar orbit, not at this base. Game dose is scaled separately.</p>':'<p>Other storm names refer to historic events. Their game profiles are simplified; exact hourly measurements are not bundled.</p>'}<p>Storms are placed closer together for the game. DONKI is a research archive.</p><p><a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noopener">NASA DONKI</a> · <a href="https://visualization.osdr.nasa.gov/radlab/gui/data-api/" target="_blank" rel="noopener">NASA RadLab</a></p><p>Earth art: <a href="https://science.nasa.gov/earth/earth-observatory/collections/blue-marble/" target="_blank" rel="noopener">NASA Blue Marble</a>. Base, terrain and crew are illustrations.</p>`;
  }
  function more() {
    return `<p>${mission.state.scenario==='solarMax'?'Solar max · harder mission':'Seven-week mission'} · ${totalStars(mission.state)}/12 stars</p>${btn('calendar','Mission calendar','menu-option')}${btn('sources','NASA data and game rules','menu-option')}${btn('restart','Start a new mission','menu-option')}${btn('home','Back to opening story','menu-option')}<p class="plan-note">${storage?'Your mission saves in this browser.':'Browser storage is unavailable. Keep this tab open to keep playing.'}</p>`;
  }
  function footer() {
    if(ui.view==='help')return btn('return','Back to my plan','next');
    if(ui.view!=='jobs'&&ui.view!=='plan')return btn('jobs','Choose jobs','next');
    return `<button class="curio-entry" data-game-action="help"><span class="face"><img src="${assets.curio}" alt=""></span><span><b>Ask Curio</b><small>Help with meters and jobs</small></span><span class="curio-question">?</span></button>${time()}${btn('review','Review week '+(mission.state.turn+1),'next')}`;
  }
  function dock() {
    const title=ui.view==='help'?'Ask Curio':ui.view==='missions'?'Your mission':ui.view==='plan'?'Your plan':ui.view==='calendar'?'Plan ahead':ui.view==='sources'?'Sources':ui.view==='more'?'Mission options':PLACES[ui.place].name;
    const content=ui.view==='jobs'?(ui.job?preview():jobs()):ui.view==='missions'?missions():ui.view==='plan'?plan():ui.view==='help'?help():ui.view==='calendar'?calendar():ui.view==='sources'?sources():more();
    return `<section class="jobs" aria-label="${title}"><div class="jh"><div><b>${title}</b><small>${ui.view==='jobs'?'Choose jobs for this week.':'Week '+Math.min(mission.state.turn+1,7)+' of 7'}</small></div><button class="x" data-game-action="close" aria-label="Close side dock">×</button></div><div class="dock-body" tabindex="-1">${ui.warning?`<p class="plan-warning" role="status">${esc(ui.warning)}</p>`:''}${content}</div><div class="planner-footer">${footer()}</div></section>`;
  }
  function modal() {
    let body='',actions='',title='';
    const s=mission.state,e=current(),alert=alertCard(mission);
    if(alert) {
      title=alert.title;body=`<p>${e.link?'Mission Control':'Curio · onboard alarm'}</p><p>${alert.body}</p><details class="week-log"><summary>Data and game rules</summary>${sources()}</details>`;
      actions=alert.options.map(([choice,label,detail])=>`<button class="alert-option" data-game-choice="${choice}"><b>${label}</b><span>${detail}</span></button>`).join('');
    } else if(mission.recap && ui.modal!=='restart') {
      const ended=s.ended,v=verdict(s),reason=ended?.reason;
      title=ended?(reason==='complete'?({gold:'Gold mission!',approved:'Site approved!',promising:'A promising site', 'not-proven':'More evidence needed'}[v.tier]):'Time to bring the crew home'):`Week ${mission.before.turn+1} complete`;
      body=`${reason&&reason!=='complete'?`<p>${{oxygen:'The air supply ran out.',dose:'The radiation plan reached its limit.'}[reason]} Replay and try another plan.</p>`:''}<div class="recap-meters">${[['power','Power'],['o2','Air'],['dose','Radiation'],['stamina','Energy']].map(([k,n])=>`<div><span>${n}</span><b>${mission.before[k]} → ${s[k]}</b></div>`).join('')}</div><p><b>${v.mainDone}/4 main goals · ${v.stars}/12 stars</b></p><details class="week-log"><summary>What changed and why</summary><ul>${mission.log.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details>${ended?`<div class="end-goals">${Object.entries(checklist(s)).map(([g,checks])=>`<p>${checks[0].done?'✓':'□'} ${GOALS[g]} ${checks.map(c=>c.done?'★':'☆').join('')}</p>`).join('')}</div>`:''}`;
      actions=ended?btn('restart','Play again','next'):btn('continue',`Plan week ${s.turn+1}`,'next');
    } else if(ui.modal==='review') {
      title=`Ready for week ${s.turn+1}?`;body=`${plan()}<p><b>${usedTime(mission.plan)} of ${blocksToday(s)} crew time used.</b> Nothing runs until you confirm.</p>`;actions=btn('back','Back to plan','text-button')+btn('run','Run this week','next');
    } else if(ui.modal==='restart') {
      title='Start a new mission?';body='<p>This replaces the saved mission in this browser.</p>';actions=btn('back','Keep my mission','text-button')+btn('new-normal','Seven-week mission','next')+btn('new-solar','Solar max · harder','text-button');
    } else return '';
    return `<div class="review-shade"></div><section class="endc review3 game-dialog" role="dialog" aria-modal="true" aria-labelledby="game-dialog-title" tabindex="-1"><h2 id="game-dialog-title">${title}</h2><div class="dialog-body">${body}</div><div class="dialog-actions">${actions}</div></section>`;
  }
  function render(focus) {
    ui.active=true;const s=mission.state;
    frame.classList.add('mission-gameplay','layout-a');frame.classList.toggle('has-panel',ui.open);frame.classList.toggle('no-panel',!ui.open);
    const pinsHTML=Object.entries(PLACES).map(([id,p])=>`<button class="pin3 ${ui.place===id&&ui.open?'selected':''}" data-game-pin="${id}" data-pin="${id}" aria-label="Open ${p.name} jobs"><span class="o">${pins[id].ic}</span><span class="stem"></span><span class="nm">${p.tab}</span></button>`).join('');
    hud.innerHTML=`${topbar()}${brief()}${pinsHTML}${resources()}${ui.open?dock():btn('jobs','Open my plan','open-curio')}${modal()}`;
    document.getElementById('note').textContent=`${s.scenario==='solarMax'?'Solar max':'Seven-week mission'} · ${totalStars(s)}/12 stars · All resource values are simulated game points.`;
    updateScene(current());updateLayout(ui.open);
    const dialog=hud.querySelector('[role="dialog"]');
    for(const child of hud.children)child.inert=!!dialog&&!child.matches('.review-shade,[role="dialog"]');
    if(dialog) { dialog.focus({preventScroll:true}); }
    else if(focus) hud.querySelector(focus)?.focus({preventScroll:true});
    save();
  }
  function showHelp(resource) {if(ui.view!=='help')ui.returnView=ui.view;ui.view='help';ui.resource=resource||null;ui.open=true;ui.warning='';render('.jobs .x');}
  function apply(result) { if(result.error)ui.warning=result.error;else{mission=result.mission;ui.warning='';} }
  hud.addEventListener('click',event=>{
    if(!ui.active)return;
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.gamePin||target.dataset.gamePlace){ui.place=target.dataset.gamePin||target.dataset.gamePlace;ui.view='jobs';ui.job=null;ui.open=true;ui.warning='';render('.jobs .x');return;}
    if(target.dataset.gameResource){showHelp(target.dataset.gameResource);return;}
    if(target.dataset.gameJob){ui.job=target.dataset.gameJob;ui.warning='';render('.dock-body');return;}
    if(target.dataset.gameQuestion){ui.resource=null;ui.question=target.dataset.gameQuestion;render(`[data-game-question="${ui.question}"]`);return;}
    if(target.dataset.gameGoal){ui.goal=ui.goal===target.dataset.gameGoal?null:target.dataset.gameGoal;render(`[data-game-goal="${target.dataset.gameGoal}"]`);return;}
    if(target.dataset.gameRemove!==undefined){apply(removeJob(mission,Number(target.dataset.gameRemove)));render();return;}
    if(target.dataset.gameChoice){apply(resolveWeek(mission,target.dataset.gameChoice));render();return;}
    const action=target.dataset.gameAction;if(!action)return;
    ui.warning='';
    if(['jobs','missions','plan','calendar','sources','more'].includes(action)){ui.view=action;ui.job=null;ui.open=true;if(ui.modal==='review')ui.modal=null;}
    else if(action==='help'){showHelp();return;}
    else if(action==='radio'){ui.question='earth';showHelp();return;}
    else if(action==='return'){ui.view=ui.returnView;ui.resource=null;}
    else if(action==='close'){ui.open=false;}
    else if(action==='back-jobs'){ui.job=null;}
    else if(action==='add-job'){const result=addJob(mission,ui.job);apply(result);if(!result.error)ui.job=null;}
    else if(action==='review'){if(!mission.plan.length){ui.open=true;ui.warning='Choose at least one job first.';}else ui.modal='review';}
    else if(action==='back'){ui.modal=null;}
    else if(action==='run'){apply(resolveWeek(mission));ui.modal=null;}
    else if(action==='continue'){mission.recap=false;mission.before=null;ui.view='jobs';ui.job=null;ui.open=true;}
    else if(action==='restart'){ui.modal='restart';}
    else if(action==='new-normal'||action==='new-solar'){mission=createMission(action==='new-solar'?'solarMax':'weeks7',Math.floor(Math.random()*0x7fffffff));ui.modal=null;ui.view='jobs';ui.open=true;ui.job=null;}
    else if(action==='home'){onHome();return;}
    render(action==='back-jobs'?'.jobs .x':action==='add-job'?`[data-game-job="${target.dataset.job||''}"]`:undefined);
  });
  hud.addEventListener('keydown',event=>{
    if(!ui.active)return;
    const dialog=hud.querySelector('[role="dialog"]');
    if(event.key==='Tab'&&dialog){const controls=[...dialog.querySelectorAll('button,a,summary,select')].filter(el=>!el.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first?.focus();}}
    if(event.key==='Escape'){if(mission.state.pending||mission.recap)return;if(ui.modal)ui.modal=null;else if(ui.job)ui.job=null;else if(ui.view==='help')ui.view=ui.returnView;else ui.open=false;render('[data-game-action="jobs"]');}
  });
  return {render, deactivate(){if(ui.active)updateScene({sun:'full',link:true});ui.active=false;frame.classList.remove('mission-gameplay','layout-a','has-panel','no-panel');}, getState(){return structuredClone(mission);}};
}

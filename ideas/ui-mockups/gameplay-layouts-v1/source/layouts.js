const hud=document.getElementById('hud');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search);
const STATE={layout:['a','b','c'].includes(Q.get('layout'))?Q.get('layout'):'a',view:Q.get('view')==='missions'?'missions':'jobs',open:Q.get('panel')!=='closed',place:Q.get('place')||'hab',plan:[],mission:'Light',warning:'',help:false,review:false};
const PLACES={hab:{name:'Habitat',jobs:['air','rest']},solar:{name:'Solar panels',jobs:['clean','logsun']},shelter:{name:'Shelter',jobs:['regolith','measure']},rover:{name:'Rover',jobs:['scout','rover']}};
if(!PLACES[STATE.place])STATE.place='hab';
const JOBS=Object.fromEntries(CONFIG.actions.map(j=>[j.id,j]));
const START={power:72,o2:61,dose:18,stamina:74};
const used=()=>STATE.plan.reduce((n,k)=>n+JOBS[k].blocks,0);
const project=()=>{const p={...START};for(const k of STATE.plan)for(const m of Object.keys(p))p[m]+=JOBS[k][m]||0;for(const k of Object.keys(p))p[k]=Math.max(0,Math.min(100,p[k]));return p};
const IC={bolt:'<path d="M13.5 2 4 14h6.5L9.5 22 20 9.5h-6.5z" fill="currentColor"/>',dose:'<circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 9.6 9.4 5.2A8 8 0 0 0 4 12h5.2M14.6 12H20a8 8 0 0 0-5.4-6.8L12 9.6M10.8 14.1 8.2 18.6a8 8 0 0 0 7.6 0l-2.6-4.5" fill="currentColor"/>',heart:'<path d="M12 21s-7.5-4.6-9.6-9.2A5.2 5.2 0 0 1 12 6.3a5.2 5.2 0 0 1 9.6 5.5C19.5 16.4 12 21 12 21z" fill="currentColor"/>',o2:'<text x="12" y="16.5" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="currentColor">O₂</text>'};
const meters=()=>{const v=project();return `<div class="meters3">${[['bolt','Power','power','#ffd34d'],['o2','Oxygen','o2','#7fe3ff'],['dose','Radiation dose','dose','#b4e05c'],['heart','Energy','stamina','#ff7b8f']].map(([i,n,k,c])=>`<div class="m"><svg viewBox="0 0 24 24" style="color:${c}" aria-hidden="true">${IC[i]}</svg><div class="bar"><i style="width:${v[k]}%;background:${c}"></i></div><span>${v[k]}${v[k]!==START[k]?`<small class="dl">${v[k]>START[k]?'▲':'▼'}</small>`:''}</span><span class="lb">${n}</span></div>`).join('')}</div>`};
const crewTime=()=>`<div class="crew3"><span>Crew time <b>${used()} / 8</b></span><div class="blocks" aria-label="${used()} of 8 crew time used">${Array.from({length:8},(_,i)=>`<i class="${i<used()?'on':''}"></i>`).join('')}</div></div>`;
const chip=(s,c)=>`<span class="jc" style="--c:${c}">${s}</span>`;
function costChips(j){return chip(`${j.blocks} time`,'#5fd0c8')+(j.power?chip(`Power ${j.power>0?'+':'−'}${Math.abs(j.power)}`,'#ffd34d'):'')+(j.o2?chip(`O₂ ${j.o2>0?'+':'−'}${Math.abs(j.o2)}`,'#7fe3ff'):'')+(j.dose?chip(`Dose +${j.dose}`,'#b4e05c'):'')+(j.stamina?chip(`Energy +${j.stamina}`,'#ff7b8f'):'')+(j.outside?chip('Outside','#c9b8ff'):'')}
function jobList(){return `<div class="job-grid">${PLACES[STATE.place].jobs.map(k=>{const j=JOBS[k],on=STATE.plan.includes(k);return `<button class="job ${on?'on':''}" data-job="${k}" aria-pressed="${on}"><span class="jn">${j.label}</span><span class="jcs">${costChips(j)}${j.goal?`<span class="taskc">★ ${j.goal[0]+j.goal.slice(1).toLowerCase()} task</span>`:''}</span><span class="ck" aria-hidden="true">${on?'✓':'+'}</span></button>`}).join('')}</div>`}
const MISSIONS=[
  ['Light','Log sunlight twice','Log while dark · Keep power on all mission'],
  ['Radiation','Measure radiation once','Measure during a storm · Make 4 measurements'],
  ['Shelter','Use the shelter during a storm','Add a layer of soil · Finish with dose under 25'],
  ['Ice','Bring back a crater sample','Map the route first · Find ice or bring 2 samples']
];
function missionList(){return `<div class="missions">${MISSIONS.map(([n,main,bonus])=>`<section class="mission ${STATE.mission===n?'open':''}"><button data-mission="${n}" aria-expanded="${STATE.layout==='b'||STATE.mission===n}"><span>${n}</span><span class="stars">☆ ☆ ☆</span></button><div class="mission-detail" ${STATE.mission===n?'':'hidden'}><span class="taskc">Main task</span><p>□ ${main}</p><small>Bonus stars<br>${bonus}</small></div></section>`).join('')}</div>`}
function planner(){const missions=STATE.view==='missions';return `<section class="jobs" aria-label="${missions?'Mission tasks':'Choose jobs'}"><div class="jh"><div><b>${missions?'Mission tasks':PLACES[STATE.place].name}</b><small>${missions?'Keep the crew safe and finish 4 main tasks.':'Choose jobs for this week.'}</small></div><button class="x" data-action="close" aria-label="Close tasks">✕</button></div><div class="workarea">${missions?'':`<nav class="place-tabs" aria-label="Places">${Object.entries(PLACES).map(([k,p])=>`<button data-place="${k}" aria-pressed="${STATE.place===k}">${PINS[k].ic}<span>${k==='solar'?'Solar':p.name}</span></button>`).join('')}</nav>`}<div class="dock-body">${STATE.warning?`<p class="plan-warning" role="status">${STATE.warning}</p>`:''}${missions?missionList():jobList()}</div></div><div class="planner-footer">${missions?`<p class="status">0 of 4 main tasks done</p><button class="next" data-action="jobs">Choose jobs</button>`:`${crewTime()}<span class="remaining">${8-used()} time left</span><button class="next" data-action="review">Start week ▸</button>`}</div></section>`}
function cap(){return `<div class="cap">${STATE.help?`<span class="face"><img src="${ASSET.curio}" alt="Curio"></span>`:`<span class="face mc"><svg viewBox="0 0 24 24" style="color:#ffcf6e" aria-hidden="true"><path d="M5 10a8 8 0 0 0 9 9L5 10zm5 4 6-6m0-4a7 7 0 0 1 7 7M16 8a3 3 0 0 1 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>`}<div class="body"><span class="who ${STATE.help?'':'mc'}">${STATE.help?'CURIO':'MISSION CONTROL'}</span><p class="t">${STATE.help?'Each job uses crew time. Check its costs before you start.':'This week, get the base ready. Tap a place to choose its jobs.'}</p></div>${!STATE.open?'<button class="next" data-action="jobs">Choose jobs</button>':''}</div>`}
function review(){return `<div class="review-shade"></div><section class="endc review3" role="dialog" aria-modal="true" aria-label="Review this week's plan"><button class="x" data-action="back" aria-label="Back to plan">✕</button><b>Your week is planned</b><p>${used()} of 8 crew time. ${8-used()} left for recovery.</p><ul>${STATE.plan.map(k=>`<li>${JOBS[k].label}</li>`).join('')}</ul><p>This layout draft stops here. Meters preview job changes; the week has not run.</p><button class="next" data-action="back">Back to plan</button></section>`}
function paint(focusKey){
  frame.className=`player layout-${STATE.layout} ${STATE.open?'has-panel':'no-panel'}`;
  document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===STATE.layout)));
  const notes={a:'A stable task area on the right; the base shifts into the open space. The large dialogue closes while planning.',b:'Tasks spread across the bottom. More width for the base and job cards, with less height for the scene.',c:'A larger focus window for reading tasks. It covers more of the base until you close it.'};
  document.getElementById('layout-note').textContent=notes[STATE.layout];
  let h=`<div class="top3"><div class="wk">WEEK 1 <small>of 7</small><span class="dots">${Array.from({length:7},(_,i)=>`<i class="${i?'':'now'}"></i>`).join('')}</span></div><span class="chip3"><span class="d"></span>Earth link</span><nav class="view-tabs" aria-label="Task view"><button data-action="jobs" aria-pressed="${STATE.open&&STATE.view==='jobs'}">Jobs</button><button data-action="missions" aria-pressed="${STATE.open&&STATE.view==='missions'}">Mission tasks</button></nav></div>`;
  for(const k of Object.keys(PLACES))h+=`<button class="pin3 ${STATE.open&&STATE.place===k?'selected':''}" data-pin="${k}" aria-label="Open ${PLACES[k].name} jobs"><span class="o">${PINS[k].ic}</span><span class="stem"></span><span class="nm">${PLACES[k].name}</span></button>`;
  h+=meters();
  if(STATE.layout==='c'&&STATE.open)h+='<div class="scrim" data-action="close"></div>';
  h+=`<button class="help3" data-action="help" aria-label="Ask Curio"><span class="face"><img src="${ASSET.curio}" alt=""></span><small>Ask Curio</small></button>`;
  if(STATE.open)h+=planner();else h+=crewTime();
  if(!STATE.open||STATE.help)h+=cap();
  if(STATE.review)h+=review();
  hud.innerHTML=h;
  positionPins();
  if(focusKey){const el=hud.querySelector(focusKey);if(el)el.focus({preventScroll:true})}
  resize();
}
function act(e){
 const l=e.target.closest('[data-layout]');if(l){STATE.layout=l.dataset.layout;STATE.help=false;STATE.review=false;paint();return}
 const p=e.target.closest('[data-pin],[data-place]');if(p){STATE.place=p.dataset.pin||p.dataset.place;STATE.open=true;STATE.view='jobs';STATE.help=false;STATE.review=false;STATE.warning='';paint(p.dataset.place?`[data-place="${STATE.place}"]`:'.jobs .x');return}
 const m=e.target.closest('[data-mission]');if(m){STATE.mission=m.dataset.mission;paint(`[data-mission="${STATE.mission}"]`);return}
 const j=e.target.closest('[data-job]');if(j){const k=j.dataset.job,i=STATE.plan.indexOf(k);STATE.warning='';if(i>=0)STATE.plan.splice(i,1);else if(used()+JOBS[k].blocks>8)STATE.warning='Not enough crew time. Remove a job to make room.';else STATE.plan.push(k);paint(`[data-job="${k}"]`);return}
 const a=e.target.closest('[data-action]');if(!a)return;
 switch(a.dataset.action){
 case 'close':STATE.open=false;STATE.help=false;STATE.review=false;break;
 case 'jobs':case 'missions':STATE.open=true;STATE.view=a.dataset.action;STATE.help=false;STATE.warning='';break;
 case 'help':STATE.help=!STATE.help;break;
 case 'review':if(!STATE.plan.length){STATE.warning='Choose at least one job first.'}else STATE.review=true;break;
 case 'back':STATE.review=false;break;
 }
 paint(STATE.review?'.review3 .x':a.dataset.action==='close'?'[data-action="jobs"]':`[data-action="${a.dataset.action}"]`);
}
document.querySelector('.study-nav').addEventListener('click',act);
hud.addEventListener('click',act);
hud.addEventListener('keydown',e=>{if(e.key==='Escape'){STATE.review=false;STATE.open=false;STATE.help=false;paint('[data-action="jobs"]')}
  if(STATE.review&&e.key==='Tab'){const bs=[...hud.querySelectorAll('.review3 button')],i=bs.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();bs.at(-1).focus()}else if(!e.shiftKey&&i===bs.length-1){e.preventDefault();bs[0].focus()}}
});
document.getElementById('sources').onclick=()=>{const n=document.getElementById('source-notes');n.open=!n.open};
// Reuse the current flow's close base camera and the same light. Only framing changes.
CAMS.base={pos:W(-12,hT(-12,-118)+6,-118),tgt:W(1,3.6,0),fov:22};
camera.position.copy(CAMS.base.pos);controls.target.copy(CAMS.base.tgt);
const dist=CAMS.base.pos.distanceTo(CAMS.base.tgt);controls.target.y-=.035*dist;
const L=LIGHT.sun;terrainMat.uniforms.sunD.value.set(...L);sun.position.copy(W(L[0]*1500,L[1]*1500,L[2]*1500));sun.target.position.set(0,0,0);sun.intensity=.55;hemi.intensity=2.6;lamps.forEach(l=>l.intensity=0);EU.sunW.value.set(L[0],L[1],-L[2]);
lines.visible=false;route.visible=false;
// The base and light are static in this study: reuse the shadow map while orbiting.
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(1280,720),.35,.4,.95));composer.addPass(new OutputPass());
function resize(){const w=frame.clientWidth||728,h=Math.round(w*9/16),pr=renderer.getPixelRatio();OUT.uniforms.res.value.set(w*pr,h*pr);OUT.uniforms.w.value=Math.max(1.5,3.6*w/1280*pr);renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;
 camera.clearViewOffset();camera.fov=STATE.open&&STATE.layout==='a'?26:22;
 if(STATE.open&&STATE.layout==='a')camera.setViewOffset(w,h,w*.17,0,w,h);
 camera.updateProjectionMatrix();
}
const pv=new THREE.Vector3();
function positionPins(){hud.querySelectorAll('[data-pin]').forEach(el=>{pv.copy(PINS[el.dataset.pin].p).project(camera);el.style.left=(pv.x+1)*50+'%';el.style.top=(1-pv.y)*50+'%';el.style.visibility=pv.z>1?'hidden':'visible'})}
new ResizeObserver(resize).observe(frame);
let last=performance.now();
function tick(now){requestAnimationFrame(tick);if(document.hidden||now-last<32)return;const dt=Math.min(.1,(now-last)/1000);last=now;if(!reduced){earthSurf.rotation.y+=dt*.035;EU.drift.value+=dt*.0025}controls.update();composer.render();positionPins()}
paint();controls.update();composer.render();document.getElementById('scene-loading').hidden=true;document.documentElement.dataset.ready='true';requestAnimationFrame(tick);

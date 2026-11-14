const hud=document.getElementById('hud');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search);
const STATE={view:['jobs','missions','help'].includes(Q.get('view'))?Q.get('view'):'jobs',open:Q.get('panel')!=='closed',place:Q.get('place')||'hab',plan:[],mission:'Light',warning:'',review:false,question:Q.get('question')||'jobs',returnView:'jobs',resource:Q.get('resource')||null};
const PLACES={hab:{name:'Crew home',tab:'Home',jobs:['air','rest']},solar:{name:'Solar panels',tab:'Panels',jobs:['clean','logsun']},shelter:{name:'Shelter',tab:'Shelter',jobs:['regolith','measure']},rover:{name:'Rover',tab:'Rover',jobs:['scout','rover']}};
if(!PLACES[STATE.place])STATE.place='hab';
const JOBS=Object.fromEntries(CONFIG.actions.map(j=>[j.id,j]));
const LABELS={air:'Run the air system',rest:'Rest (2 crew)',logsun:'Record light and shadows',scout:'Send the scout drone',rover:'Drive to the dark crater'};
const jobName=k=>LABELS[k]||JOBS[k].label;
const START={power:72,o2:61,dose:18,stamina:74};
const used=()=>STATE.plan.reduce((n,k)=>n+JOBS[k].blocks,0);
const project=()=>{const p={...START};for(const k of STATE.plan)for(const m of Object.keys(p))p[m]+=JOBS[k][m]||0;for(const k of Object.keys(p))p[k]=Math.max(0,Math.min(100,p[k]));return p};
const IC={bolt:'<path d="M13.5 2 4 14h6.5L9.5 22 20 9.5h-6.5z" fill="currentColor"/>',dose:'<circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 9.6 9.4 5.2A8 8 0 0 0 4 12h5.2M14.6 12H20a8 8 0 0 0-5.4-6.8L12 9.6M10.8 14.1 8.2 18.6a8 8 0 0 0 7.6 0l-2.6-4.5" fill="currentColor"/>',heart:'<path d="M12 21s-7.5-4.6-9.6-9.2A5.2 5.2 0 0 1 12 6.3a5.2 5.2 0 0 1 9.6 5.5C19.5 16.4 12 21 12 21z" fill="currentColor"/>',o2:'<path d="M7 7c0-3 4-4 5 0 1-4 5-3 5 0v11c-2 3-4 2-5-1-1 3-3 4-5 1Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4v10" stroke="currentColor" stroke-width="2"/>'};
const RESOURCE=[['bolt','Power','power','#ffd34d'],['o2','Air','o2','#7fe3ff'],['dose','Radiation','dose','#b4e05c'],['heart','Crew energy','stamina','#ff7b8f']];
function meters(){const v=project();return `<section class="resources" aria-label="Base and crew meters"><div class="survival-meters">${RESOURCE.slice(0,3).map(r=>meter(r,v)).join('')}</div><div class="crew-meter">${meter(RESOURCE[3],v)}</div><span class="meter-help">Tap a meter for help</span></section>`}
function meter([i,n,k,c],v){const d=v[k]-START[k],status=k==='dose'?'Keep low':v[k]<(k==='stamina'?50:25)?'Low':'Good';return `<button class="resource-cell ${k==='stamina'?'energy-cell':''}" data-resource="${k}" aria-label="${n}: ${v[k]} out of 100. ${status}. Learn what this means." style="--meter:${c}"><span class="resource-title"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[i]}</svg>${n}</span><span class="resource-value">${v[k]}<small>/100</small></span><span class="resource-bar" role="meter" aria-label="${n}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v[k]}"><i style="width:${v[k]}%"></i></span><span class="resource-status">${status}</span>${d?`<span class="resource-change">${d>0?'+':'−'}${Math.abs(d)} planned</span>`:''}</button>`}
const crewTime=()=>`<div class="crew3"><span>Time left: <b>${8-used()} / 8</b></span><div class="blocks" aria-label="${used()} of 8 time blocks used">${Array.from({length:8},(_,i)=>`<i class="${i<used()?'on':''}"></i>`).join('')}</div></div>`;
const chip=(s,c)=>`<span class="jc" style="--c:${c}">${s}</span>`;
function costChips(j){return chip(`${j.blocks} ${j.blocks===1?'block':'blocks'}`,'#5fd0c8')+(j.power?chip(`Power ${j.power>0?'+':'−'}${Math.abs(j.power)}`,'#ffd34d'):'')+(j.o2?chip(`Air ${j.o2>0?'+':'−'}${Math.abs(j.o2)}`,'#7fe3ff'):'')+(j.dose?chip(`Radiation +${j.dose}`,'#b4e05c'):'')+(j.stamina?chip(`Energy +${j.stamina}`,'#ff7b8f'):'')+(j.outside?chip('Outside','#c9b8ff'):'')}
function jobList(){return `<div class="job-grid">${PLACES[STATE.place].jobs.map(k=>{const j=JOBS[k],on=STATE.plan.includes(k);return `<button class="job ${on?'on':''}" data-job="${k}" aria-pressed="${on}"><span class="jn">${jobName(k)}</span><span class="jcs">${costChips(j)}${j.goal?`<span class="taskc">★ ${j.goal[0]+j.goal.slice(1).toLowerCase()} task</span>`:''}</span><span class="ck" aria-hidden="true">${on?'✓':'+'}</span></button>`}).join('')}</div>`}
const MISSIONS=[['Light','Record sunlight twice','Record it while dark · Keep power on all mission'],['Radiation','Measure radiation once','Measure during a storm · Make 4 measurements'],['Shelter','Use the shelter during a storm','Add a layer of soil · Finish with radiation under 25'],['Ice','Bring back a crater sample','Map the route first · Find ice or bring 2 samples']];
function missionList(){return `<div class="missions">${MISSIONS.map(([n,main,bonus])=>`<section class="mission ${STATE.mission===n?'open':''}"><button data-mission="${n}" aria-expanded="${STATE.mission===n}"><span>${n}</span><span class="stars">☆ ☆ ☆</span></button><div class="mission-detail" ${STATE.mission===n?'':'hidden'}><span class="taskc">Main task</span><p>□ ${main}</p><small>Bonus stars<br>${bonus}</small></div></section>`).join('')}</div>`}
const RESOURCE_HELP={power:['Power','Power runs your base and its machines. Higher is better. Jobs that use power show a minus sign.'],o2:['Air','Your crew needs air to breathe. Higher is better. Running the air system adds air, but uses power and crew time.'],dose:['Radiation','This meter adds up the radiation your crew gets. Lower is better. The shelter helps protect the crew during a storm.'],stamina:['Crew energy','This means how rested your crew feels. Higher is better. Outside jobs tire them. Rest helps them recover.']};
const QUESTIONS=[['meters','The meters'],['jobs','Choosing jobs'],['time','Crew time'],['earth','Earth radio']];
function answer(){
 if(STATE.question==='meters'){
  if(STATE.resource&&RESOURCE_HELP[STATE.resource]){const [n,t]=RESOURCE_HELP[STATE.resource];return `<h3>${n}<small>Game meter: 0–100</small></h3><p>${t}</p><button class="explain-all" data-question="meters">See all four meters</button>`}
  const short={power:'Runs the base. Keep it high.',o2:'Air to breathe. Keep it high.',dose:'Adds up over the mission. Keep it low.',stamina:'How rested the crew feels. Keep it high.'};
  return `<p>Game meters go from <b>0 to 100</b>.</p><div class="meter-definitions">${RESOURCE.map(([,n,k,c])=>`<div class="definition"><b style="--dot:${c}">${n}</b><span>${short[k]}</span></div>`).join('')}</div>`;
 }
 if(STATE.question==='time')return '<p>Your crew has <b>8 time blocks</b> for jobs this week.</p><p>A job marked “4 blocks” uses four of them. Time you leave free helps the crew rest.</p>';
 if(STATE.question==='earth')return '<p><b>Mission Control is our team on Earth.</b> They can send us messages while Earth is in view.</p><p>When Earth is out of view, those messages stop. I can still help you here.</p>';
 return `<p>Tap <b>+</b> on a job to add it. Tap <b>✓</b> to remove it.</p><p>The coloured labels show what each job uses or adds. For example, running the air system uses <b>1 time and 20 power</b>, and adds <b>30 air</b>.</p><p>When you like your plan, choose <b>Start week</b>.</p>`;
}
function curioHelp(){return `<div class="question-tabs" aria-label="Questions for Curio">${QUESTIONS.map(([k,t])=>`<button data-question="${k}" aria-expanded="${STATE.question===k}" aria-controls="curio-answer">${t}<span aria-hidden="true">${STATE.question===k?'−':'+'}</span></button>`).join('')}</div><section class="curio-answer" id="curio-answer" aria-label="Curio's answer">${answer()}</section>`}
const curioEntry=()=>`<button class="curio-entry" data-action="help"><span class="face"><img src="${ASSET.curio}" alt=""></span><span><b>Ask Curio</b><small>Help with meters and jobs</small></span><span class="curio-question" aria-hidden="true">?</span></button>`;
function planner(){const missions=STATE.view==='missions',help=STATE.view==='help';return `<section class="jobs" aria-label="${help?'Ask Curio':missions?'Mission tasks':'Choose jobs'}"><div class="jh">${help?`<span class="face dock-curio-face"><img src="${ASSET.curio}" alt=""></span>`:''}<div><b>${help?'Ask Curio':missions?'Your mission':PLACES[STATE.place].name}</b><small>${help?'How can I help?':missions?'Keep everyone safe. Finish these 4 tasks.':'Choose jobs for this week.'}</small></div><button class="x" data-action="close" aria-label="Close side dock">✕</button></div><div class="workarea">${missions||help?'':`<nav class="place-tabs" aria-label="Places">${Object.entries(PLACES).map(([k,p])=>`<button data-place="${k}" aria-pressed="${STATE.place===k}">${PINS[k].ic}<span>${p.tab}</span></button>`).join('')}</nav>`}<div class="dock-body">${STATE.warning?`<p class="plan-warning" role="status">${STATE.warning}</p>`:''}${help?curioHelp():missions?missionList():jobList()}</div></div><div class="planner-footer ${help?'help-footer':''}">${help?`<button class="next" data-action="return">Back to ${STATE.returnView==='missions'?'mission tasks':'my plan'}</button>`:`${curioEntry()}${missions?'<p class="status">0 of 4 main tasks done</p><button class="next" data-action="jobs">Choose jobs</button>':`${crewTime()}<button class="next" data-action="review">Start week ▸</button>`}`}</div></section>`}
function earthRadio(){return `<div class="earth-radio"><button class="chip3" data-action="radio" aria-expanded="false" aria-controls="radio-info" aria-describedby="radio-info"><span class="d"></span>Earth radio: on <span class="radio-question" aria-hidden="true">?</span></button><div class="radio-tip" id="radio-info" role="tooltip"><b>Messages from Earth</b>Mission Control can send us updates now.<small>When Earth is out of view, Curio can still help.</small></div></div>`}
function review(){return `<div class="review-shade"></div><section class="endc review3" role="dialog" aria-modal="true" aria-label="Review this week's plan"><button class="x" data-action="back" aria-label="Back to plan">✕</button><b>Your week is planned</b><p>${used()} of 8 crew time. ${8-used()} left for recovery.</p><ul>${STATE.plan.map(k=>`<li>${jobName(k)}</li>`).join('')}</ul><p>This UI draft stops here. The week has not run.</p><button class="next" data-action="back">Back to plan</button></section>`}
function paint(focusKey){
 frame.className=`player layout-a ${STATE.open?'has-panel':'no-panel'}`;
 let h=`<div class="top3"><div class="wk">WEEK 1 <small>of 7</small><span class="dots">${Array.from({length:7},(_,i)=>`<i class="${i?'':'now'}"></i>`).join('')}</span></div>${earthRadio()}<nav class="view-tabs" aria-label="Side dock view"><button data-action="jobs" aria-pressed="${STATE.open&&STATE.view==='jobs'}">Jobs</button><button data-action="missions" aria-pressed="${STATE.open&&STATE.view==='missions'}">Mission tasks</button></nav></div>`;
 for(const k of Object.keys(PLACES))h+=`<button class="pin3 ${STATE.open&&STATE.view==='jobs'&&STATE.place===k?'selected':''}" data-pin="${k}" aria-label="Open ${PLACES[k].name} jobs"><span class="o">${PINS[k].ic}</span><span class="stem"></span><span class="nm">${PLACES[k].tab}</span></button>`;
 h+=meters();if(STATE.open)h+=planner();else h+=`<button class="open-curio" data-action="help"><span class="face"><img src="${ASSET.curio}" alt=""></span>Ask Curio</button><div class="base-prompt">Tap a place to choose jobs.</div>`;
 if(STATE.review)h+=review();hud.innerHTML=h;resize();positionPins();
 if(focusKey){const el=hud.querySelector(focusKey);if(el)el.focus({preventScroll:true})}
}
function openHelp(resource){if(STATE.view!=='help')STATE.returnView=STATE.view;STATE.view='help';STATE.open=true;STATE.question=resource?'meters':'jobs';STATE.resource=resource||null;STATE.warning='';paint(resource?'[data-question="meters"]':'[data-question="jobs"]')}
function act(e){
 const resource=e.target.closest('[data-resource]');if(resource){openHelp(resource.dataset.resource);return}
 const p=e.target.closest('[data-pin],[data-place]');if(p){STATE.place=p.dataset.pin||p.dataset.place;STATE.open=true;STATE.view='jobs';STATE.warning='';paint(p.dataset.place?`[data-place="${STATE.place}"]`:'.jobs .x');return}
 const m=e.target.closest('[data-mission]');if(m){STATE.mission=m.dataset.mission;paint(`[data-mission="${STATE.mission}"]`);return}
 const q=e.target.closest('[data-question]');if(q){STATE.question=q.dataset.question;STATE.resource=null;paint(`[data-question="${STATE.question}"]`);return}
 const j=e.target.closest('[data-job]');if(j){const k=j.dataset.job,i=STATE.plan.indexOf(k);STATE.warning='';if(i>=0)STATE.plan.splice(i,1);else if(used()+JOBS[k].blocks>8)STATE.warning='Not enough crew time. Remove a job to make room.';else STATE.plan.push(k);paint(`[data-job="${k}"]`);return}
 const a=e.target.closest('[data-action]');if(!a)return;
 switch(a.dataset.action){case 'close':STATE.open=false;STATE.review=false;break;
 case 'jobs':case 'missions':STATE.open=true;STATE.view=a.dataset.action;STATE.warning='';break;
 case 'help':openHelp();return;
 case 'return':STATE.view=STATE.returnView;STATE.resource=null;break;
 case 'radio':{const wrap=a.closest('.earth-radio'),on=wrap.classList.toggle('pinned');a.setAttribute('aria-expanded',String(on));return}
 case 'review':if(!STATE.plan.length)STATE.warning='Choose at least one job first.';else STATE.review=true;break;
 case 'back':STATE.review=false;break;}
 paint(STATE.review?'.review3 .x':a.dataset.action==='return'?'[data-action="help"]':a.dataset.action==='close'?'[data-action="jobs"]':`[data-action="${a.dataset.action}"]`);
}
hud.addEventListener('click',act);
hud.addEventListener('pointerover',e=>{const r=e.target.closest('.earth-radio');if(r){r.classList.remove('dismissed');r.querySelector('button').setAttribute('aria-expanded','true')}});
hud.addEventListener('pointerout',e=>{const r=e.target.closest('.earth-radio');if(r&&!r.contains(e.relatedTarget)&&!r.classList.contains('pinned'))r.querySelector('button').setAttribute('aria-expanded','false')});
hud.addEventListener('focusin',e=>{const r=e.target.closest('.earth-radio');if(r){r.classList.remove('dismissed');r.querySelector('button').setAttribute('aria-expanded','true')}});
hud.addEventListener('focusout',e=>{const r=e.target.closest('.earth-radio');if(r&&!r.contains(e.relatedTarget)&&!r.classList.contains('pinned'))r.querySelector('button').setAttribute('aria-expanded','false')});
hud.addEventListener('keydown',e=>{
 if(e.key==='Escape'){const r=hud.querySelector('.earth-radio');if(r&&(r.classList.contains('pinned')||r.contains(document.activeElement)||r.matches(':hover'))){r.classList.remove('pinned');r.classList.add('dismissed');r.querySelector('button').setAttribute('aria-expanded','false');return}if(STATE.review){STATE.review=false;paint('[data-action="review"]')}else if(STATE.view==='help'){STATE.view=STATE.returnView;paint('[data-action="help"]')}else{STATE.open=false;paint('[data-action="jobs"]')}}
 if(STATE.review&&e.key==='Tab'){const bs=[...hud.querySelectorAll('.review3 button')],i=bs.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();bs.at(-1).focus()}else if(!e.shiftKey&&i===bs.length-1){e.preventDefault();bs[0].focus()}}
});
document.addEventListener('click',e=>{if(!e.target.closest('.earth-radio')){const r=hud.querySelector('.earth-radio');r?.classList.remove('pinned');r?.classList.add('dismissed');r?.querySelector('button').setAttribute('aria-expanded','false')}});
document.getElementById('sources').onclick=()=>{const n=document.getElementById('source-notes');n.open=!n.open};
// Current flow camera (~58 m), VSM shadows and low solar pin. Geometry is the current snapshot.
CAMS.base={pos:W(-2,hT(-2,-58)+5,-58),tgt:W(5,3.4,1),fov:34};
renderer.shadowMap.type=THREE.VSMShadowMap;sun.shadow.mapSize.set(2048,2048);sun.shadow.radius=5;sun.shadow.blurSamples=12;{const c=sun.shadow.camera;c.left=-75;c.right=75;c.top=75;c.bottom=-75;c.updateProjectionMatrix()}
PINS.solar.p=W(-12.5,hM(-12.5,14)+5,14);
camera.position.copy(CAMS.base.pos);controls.target.copy(CAMS.base.tgt);
const dist=CAMS.base.pos.distanceTo(CAMS.base.tgt);controls.target.y-=.035*dist;
const L=LIGHT.sun;terrainMat.uniforms.sunD.value.set(...L);sun.position.copy(W(L[0]*1500,L[1]*1500,L[2]*1500));sun.target.position.set(0,0,0);sun.intensity=.55;hemi.intensity=2.6;lamps.forEach(l=>l.intensity=0);EU.sunW.value.set(L[0],L[1],-L[2]);lines.visible=false;route.visible=false;
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(1280,720),.35,.4,.95));composer.addPass(new OutputPass());
function resize(){const w=frame.clientWidth||728,h=Math.round(w*9/16),pr=renderer.getPixelRatio();OUT.uniforms.res.value.set(w*pr,h*pr);OUT.uniforms.w.value=Math.max(1.5,3.6*w/1280*pr);renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;camera.clearViewOffset();camera.fov=STATE.open?38:34;if(STATE.open)camera.setViewOffset(w,h,w*.18,0,w,h);camera.updateProjectionMatrix()}
const pv=new THREE.Vector3();
function positionPins(){hud.querySelectorAll('[data-pin]').forEach(el=>{pv.copy(PINS[el.dataset.pin].p).project(camera);el.style.left=(pv.x+1)*50+'%';el.style.top=(1-pv.y)*50+'%';el.style.visibility=pv.z>1?'hidden':'visible'})}
new ResizeObserver(resize).observe(frame);let last=performance.now();
function tick(now){requestAnimationFrame(tick);if(document.hidden||now-last<32)return;const dt=Math.min(.1,(now-last)/1000);last=now;if(!reduced){earthSurf.rotation.y+=dt*.035;EU.drift.value+=dt*.0025}controls.update();composer.render();positionPins()}
paint();controls.update();composer.render();document.getElementById('scene-loading').hidden=true;document.documentElement.dataset.ready='true';requestAnimationFrame(tick);

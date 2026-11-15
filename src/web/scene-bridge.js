// Small boundary between the finished story/3D flow and the shared mission controller.
// Victory + ending story (src/web/ending.js). Play again re-uses the mission controller's own "new mission" actions.
const ending=mountEnding({frame,assets:ASSET,onDone:()=>go('title'),
  onPlayAgain(scn){go('week1');const b=document.createElement('button');b.dataset.gameAction=scn==='solarMax'?'new-solar':'new-normal';hud.append(b);b.click();b.remove();}});
// Title screen: "Real NASA data" and "Settings" open a card instead of falling through into the game.
const panels=typeof mountPanels==='function'?mountPanels({frame}):null; // (null only if an old dev server built without panels.js)
storyEl.querySelectorAll('.menu span:not(.go)').forEach(el=>{if(/NASA data|Settings/i.test(el.textContent)){el.setAttribute('role','button');el.tabIndex=0}});
storyEl.addEventListener('click',e=>{const sp=panels&&e.target.closest('.menu span:not(.go)');if(!sp||!/NASA data|Settings/i.test(sp.textContent))return;e.stopPropagation();e.preventDefault();panels.open(/Settings/i.test(sp.textContent)?'settings':'nasa',sp)},true);
storyEl.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.menu span[role="button"]:not(.go)')){e.preventDefault();e.stopPropagation();e.target.click()}},true);
// Debug: the ending screens also sit in the screen navigator (?debug) and in More > Debug.
nav.insertAdjacentHTML('beforeend',`<span class="g">Ending</span>${ENDING_SCREENS.map(s=>`<button data-end-screen="${s.id}">${s.name}</button>`).join('')}`);
nav.addEventListener('click',e=>{const b=e.target.closest('[data-end-screen]');if(!b)return;e.stopImmediatePropagation();ending.showDebug(b.dataset.endScreen)},true);
const gameplay=mountGameplay({hud,frame,pins:PINS,assets:ASSET,onHome:()=>go('title'),
  onEnding:m=>ending.show(m),debugScreens:ENDING_SCREENS,onDebugScreen:id=>ending.showDebug(id),
  updateScene(e){
    const L=e.sun==='dark'?LIGHT.dark:LIGHT.sun;
    placeSun(L);terrainMat.uniforms.sunD.value.set(...L);
    sun.position.copy(W(L[0]*1500,L[1]*1500,L[2]*1500));
    if(EU.sunW)EU.sunW.value.set(L[0],L[1],-L[2]);
    sun.intensity=e.sun==='dark'?.05:e.sun==='half'?.3:.55;
    hemi.intensity=e.sun==='dark'?.65:2.6;lamps.forEach(l=>l.intensity=e.sun==='dark'?1:0);
    earth.visible=e.link;sunGlow.visible=e.sun!=='dark';
    renderer.shadowMap.needsUpdate=true;
  },
  updateLayout(open){
    const w=frame.clientWidth,h=frame.clientHeight;
    anim=null;camera.position.copy(CAMS.base.pos);controls.target.copy(CAMS.base.tgt);
    controls.target.y+=.02*CAMS.base.pos.distanceTo(CAMS.base.tgt);
    camera.fov=open?38:34;camera.clearViewOffset();
    if(open)camera.setViewOffset(w,h,w*.27,0,w,h);
    camera.updateProjectionMatrix();controls.update();placeOverlays();
  }
});
new ResizeObserver(()=>{if(cur?.week)gameplay.render();}).observe(frame);
// Debug mode: the screen navigator and notes sit above the stage. Measure them and size the stage to the space left, so nothing is cut off.
(()=>{const m=document.querySelector('main'),foot=document.querySelector('.foot');if(!m)return;
  const fit=()=>{const on=document.documentElement.classList.contains('debug');if(!on){m.style.removeProperty('--chrome');return}
    const h=[nav,foot].reduce((t,e)=>t+(e&&getComputedStyle(e).display!=='none'?e.getBoundingClientRect().height+8:0),0);m.style.setProperty('--chrome',Math.ceil(h+4)+'px')};
  const ro=new ResizeObserver(fit);ro.observe(nav);if(foot)ro.observe(foot);
  new MutationObserver(fit).observe(document.documentElement,{attributes:true,attributeFilter:['class']});addEventListener('resize',fit);fit();})();

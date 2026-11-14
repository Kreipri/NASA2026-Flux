// Small boundary between the finished story/3D flow and the shared mission controller.
const gameplay=mountGameplay({hud,frame,pins:PINS,assets:ASSET,onHome:()=>go('title'),
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
    if(open)camera.setViewOffset(w,h,w*.18,0,w,h);
    camera.updateProjectionMatrix();controls.update();placeOverlays();
  }
});
new ResizeObserver(()=>{if(cur?.week)gameplay.render();}).observe(frame);

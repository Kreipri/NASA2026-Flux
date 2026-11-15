// Export the ACTUAL game's base meshes as editable projected SVG paths.
// No previous base SVG, image trace or manually redrawn geometry is used.
// Run from any directory: node ideas/base-designs/from-3d-v1/export.mjs
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../..');
const sourcePath='ideas/ui-mockups/flow-start-v1.html';
const source=fs.readFileSync(path.join(root,sourcePath),'utf8');
const terrain=source.slice(source.indexOf('const D2R=Math.PI/180;'),source.indexOf('/* ---------------- three.js setup'));
const geometry=source.slice(source.indexOf('// v8: drawn in the crew clip-art style'),source.indexOf('const rockGeo='));
if(!terrain.includes('const HV=')&&!terrain.includes('HV=new Float32Array'))throw Error('Terrain source changed');
if(!geometry.includes('const base=new THREE.Group()'))throw Error('Model source changed');
fs.writeFileSync(path.join(here,'model-source.snapshot.js'),terrain+'\n'+geometry);

// Canvas textures are not rasterised: canvas API calls are no-ops during mesh
// construction. The solar texture and sprite glow become vector elements below.
const canvasContext=new Proxy({createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:()=>{}});
const document={createElement:()=>({width:0,height:0,getContext:()=>canvasContext})};
const sandbox={THREE,RoundedBoxGeometry,document,console};
vm.runInNewContext('const scene=new THREE.Scene();\n'+terrain+'\n'+geometry+`\nthis.model={base,blobM,gridM,shine,cyan,lampM,scr,W,hT,LIGHT,mound};`,sandbox,{timeout:30000});
const model=sandbox.model;
const {base,blobM,gridM,shine,cyan,lampM,scr,W,hT,LIGHT,mound}=model;
base.updateMatrixWorld(true);
const camera=new THREE.PerspectiveCamera(34,16/9,.1,5000);
camera.position.copy(W(-2,hT(-2,-58)+5,-58));
camera.lookAt(W(5,3.4,1));
camera.updateMatrixWorld(true);
camera.updateProjectionMatrix();
const matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
const width=1600,height=900;
const project=v=>{const p=v.clone().applyMatrix4(matrix);return{x:p.x*width/2,y:-p.y*height/2,z:p.z};};
const fmt=n=>(Math.round(n*100)/100).toString();
const posKey=v=>[v.x,v.y,v.z].map(n=>n.toFixed(5)).join(',');
const records=[],defs=[];
let meshCount=0,triangleCount=0,openLoops=0;
const bounds={x0:Infinity,y0:Infinity,x1:-Infinity,y1:-Infinity};
const expand=p=>{bounds.x0=Math.min(bounds.x0,p.x);bounds.x1=Math.max(bounds.x1,p.x);bounds.y0=Math.min(bounds.y0,p.y);bounds.y1=Math.max(bounds.y1,p.y);};
const litColor=(mat,col)=>mat.color.clone().multiply(col);
const rgb=c=>'#'+c.getHexString(THREE.SRGBColorSpace);
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};

// Front-facing triangles share internal edges. Cancelling those edges yields
// each mesh's projected silhouette (including holes), without a raster trace.
function meshPath(o){
 const p=o.geometry.attributes.position,idx=o.geometry.index;
 const world=[],screen=[],keys=[],byKey=new Map();
 const normal=o.geometry.attributes.normal,normalMatrix=new THREE.Matrix3().getNormalMatrix(o.matrixWorld);
 const sunVector=new THREE.Vector3(LIGHT.sun[0],LIGHT.sun[1],-LIGHT.sun[2]).normalize();
 for(let i=0;i<p.count;i++){
  const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld),s=project(v),k=posKey(v);
  const n=normal?new THREE.Vector3().fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize():new THREE.Vector3(0,1,0);
  s.nv=Math.abs(n.dot(camera.position.clone().sub(v).normalize()));
  s.light=.5*Math.max(0,n.y)+.5*Math.max(0,n.dot(sunVector));
  world.push(v);screen.push(s);keys.push(k);byKey.set(k,s);
 }
 const edgeMap=new Map(),triangles=[];
 const n=idx?idx.count:p.count;
 for(let i=0;i<n;i+=3){
  let a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;
  const A=screen[a],B=screen[b],C=screen[c];
  if(A.z>1||B.z>1||C.z>1)continue;
  const area=(B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x);
  if(Math.abs(area)<1e-7)continue;
  if(o.material.side!==THREE.DoubleSide&&area>=0)continue;
  if(area>0)[b,c]=[c,b];
  triangleCount++;
  if(Math.abs(area)>.002){
   const center=world[a].clone().add(world[b]).add(world[c]).divideScalar(3).applyMatrix4(camera.matrixWorldInverse);
   triangles.push({points:[screen[a],screen[b],screen[c]],z:-center.z});
  }
  for(const [u,v] of [[a,b],[b,c],[c,a]]){
   const ku=keys[u],kv=keys[v];if(ku===kv)continue;
   const key=ku<kv?ku+'|'+kv:kv+'|'+ku;
   if(edgeMap.has(key))edgeMap.delete(key);else edgeMap.set(key,[ku,kv]);
  }
 }
 const next=new Map();
 for(const [a,b] of edgeMap.values()){if(!next.has(a))next.set(a,[]);next.get(a).push(b);}
 const paths=[],points=[];
 while(next.size){
  const start=next.keys().next().value;let at=start,loop=[],guard=0;
  do{
   const p=byKey.get(at);loop.push(p);
   const options=next.get(at);if(!options?.length){openLoops++;break;}
   const to=options.pop();if(!options.length)next.delete(at);at=to;
  }while(at!==start&&guard++<edgeMap.size+2);
  if(loop.length<3)continue;
  // Remove almost-collinear points while retaining the mesh's projection.
  loop=loop.filter((b,i,arr)=>{
   const a=arr[(i+arr.length-1)%arr.length],c=arr[(i+1)%arr.length];
   const d=Math.hypot(c.x-a.x,c.y-a.y);
   return d<1e-7||Math.abs((c.x-a.x)*(a.y-b.y)-(a.x-b.x)*(c.y-a.y))/d>.015;
  });
  if(loop.length<3)continue;
  paths.push('M'+loop.map(v=>fmt(v.x)+','+fmt(v.y)).join('L')+'Z');points.push(...loop);
 }
 return {d:paths.join(''),points,world,triangles};
}

function depth(o){const v=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).applyMatrix4(camera.matrixWorldInverse);return -v.z;}
function component(o){let p=o;while(p.parent&&p.parent!==base)p=p.parent;return 'source-node-'+base.children.indexOf(p);}

base.traverse(o=>{
 if(o.isSprite){
  const c=project(o.getWorldPosition(new THREE.Vector3()));
  const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(o.scale.x*.5);
  const q=project(o.getWorldPosition(new THREE.Vector3()).add(right)),r=Math.abs(q.x-c.x);
  if(r<.5)return;
  const id='glow-'+defs.length,color='#'+o.material.color.getHexString();
  defs.push(`<radialGradient id="${id}"><stop stop-color="${color}" stop-opacity=".5"/><stop offset=".35" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
  records.push({z:depth(o),glow:c,body:`<circle cx="${fmt(c.x)}" cy="${fmt(c.y)}" r="${fmt(r)}" fill="url(#${id})"/>`});
  return;
 }
 if(!o.isMesh||o.material===blobM||o.userData.flat)return;
 let visible=true;o.traverseAncestors(a=>{if(!a.visible)visible=false});if(!visible)return;
 const box=new THREE.Box3().setFromObject(o),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 if(Math.hypot(center.x,center.z)>24||Math.max(size.x,size.z)>34)return;
 const id='mesh-'+String(++meshCount).padStart(4,'0'),mat=o.material;
 if(mat===gridM){
  const p=o.geometry.parameters,w=p.width,h=p.height,lines=[];
  for(let i=1;i<6;i++)lines.push([[-w/2+w*i/6,-h/2,0],[-w/2+w*i/6,h/2,0]]);
  for(let j=1;j<16;j++)lines.push([[-w/2,-h/2+h*j/16,0],[w/2,-h/2+h*j/16,0]]);
  const d=lines.map(line=>line.map((v,i)=>{const p=project(new THREE.Vector3(...v).applyMatrix4(o.matrixWorld));expand(p);return(i?'L':'M')+fmt(p.x)+','+fmt(p.y);}).join('')).join('');
  records.push({z:depth(o)-.001,body:`<g id="${id}" data-source="${component(o)}"><path d="${d}" fill="none" stroke="#96B4FA" stroke-width=".9" opacity=".55"/></g>`});return;
 }
 const {d,points,world,triangles}=meshPath(o);if(!d)return;
 points.forEach(expand);
 let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
 for(const p of points){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}
 const attr=o.geometry.attributes.color;
 let low=Infinity,high=-Infinity,loC=new THREE.Color(1,1,1),hiC=loC.clone();
 for(let i=0;i<world.length;i++){
  if(world[i].y<low){low=world[i].y;if(attr)loC.fromBufferAttribute(attr,i);}
  if(world[i].y>high){high=world[i].y;if(attr)hiC.fromBufferAttribute(attr,i);}
 }
 const top=litColor(mat,hiC),bottom=litColor(mat,loC);
 let fill;
 if(mat===shine||mat===cyan||mat===lampM){fill=rgb(mat.color);}else{
  const grad=id+'-material';
  defs.push(`<linearGradient id="${grad}" gradientUnits="userSpaceOnUse" x1="${fmt(x0)}" y1="${fmt(y0)}" x2="${fmt(x0)}" y2="${fmt(y1)}"><stop stop-color="${rgb(top)}"/><stop offset="1" stop-color="${rgb(bottom)}"/></linearGradient>`);
  fill=`url(#${grad})`;
 }
 for(const tri of triangles){
  // Tiny same-colour overlap closes anti-alias seams between adjacent faces.
  const cx=tri.points.reduce((s,p)=>s+p.x,0)/3,cy=tri.points.reduce((s,p)=>s+p.y,0)/3;
  const coords=tri.points.map(p=>{const dx=p.x-cx,dy=p.y-cy,k=.12/(Math.hypot(dx,dy)||1);return{x:p.x+dx*k,y:p.y+dy*k};});
  const d='M'+coords.map(p=>fmt(p.x)+','+fmt(p.y)).join('L')+'Z';
  records.push({z:tri.z,id,component:component(o),fill,opacity:mat.opacity,d,tri:tri.points,metal:!mat.isMeshBasicMaterial&&mat!==mound,shade:!mat.isMeshBasicMaterial});
 }
});

const pad=16,x=bounds.x0-pad,y=bounds.y0-pad,w=bounds.x1-bounds.x0+2*pad,h=bounds.y1-bounds.y0+2*pad;
// Resolve actual triangle visibility with a supersampled depth buffer. Convert
// each mesh's visible mask back into simplified vector boundaries. This avoids
// the invalid whole-object/triangle painter ordering at intersecting surfaces.
const S=4,RW=Math.ceil(w*S),RH=Math.ceil(h*S),N=RW*RH;
const depths=new Float64Array(N);depths.fill(Infinity);
const ids=new Uint16Array(N),overlayIds=new Uint16Array(N),shadeIds=new Uint8Array(N),rimIds=new Uint8Array(N),info=new Map();
let serial=0;
for(const r of records)if(r.tri&&!info.has(r.id))info.set(r.id,{...r,index:++serial});
function raster(r,transparent=false){
 const a=r.tri.map(p=>({...p,x:(p.x-x)*S,y:(p.y-y)*S}));
 const [A,B,C]=a,den=(B.y-C.y)*(A.x-C.x)+(C.x-B.x)*(A.y-C.y);if(Math.abs(den)<1e-10)return;
 const x0=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))),x1=Math.min(RW-1,Math.ceil(Math.max(A.x,B.x,C.x)));
 const y0=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))),y1=Math.min(RH-1,Math.ceil(Math.max(A.y,B.y,C.y)));
 const id=info.get(r.id).index;
 for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){
  const xx=px+.5,yy=py+.5,u=((B.y-C.y)*(xx-C.x)+(C.x-B.x)*(yy-C.y))/den,v=((C.y-A.y)*(xx-C.x)+(A.x-C.x)*(yy-C.y))/den,t=1-u-v;
  if(u<0||v<0||t<0)continue;
  const z=u*A.z+v*B.z+t*C.z,k=py*RW+px;
  if(z<depths[k]+(transparent?1e-9:0)){
   if(transparent)overlayIds[k]=id;else{
    depths[k]=z;ids[k]=id;
    shadeIds[k]=r.shade?Math.max(0,Math.min(4,Math.round((1-u*A.light-v*B.light-t*C.light)*4))):0;
    const nv=u*A.nv+v*B.nv+t*C.nv;
    rimIds[k]=r.metal?(nv<.32?2:nv<.42?1:0):0;
   }
  }
 }
}
for(const r of records)if(r.tri&&r.opacity>=1)raster(r);
for(const r of records)if(r.tri&&r.opacity<1)raster(r,true);

function simplify(points,tolerance){
 if(points.length<4)return points;
 const a=points[0],b=points[points.length-1],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
 let max=0,at=0;
 for(let i=1;i<points.length-1;i++){
  const p=points[i],t=len?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len)):0;
  const d=Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);if(d>max){max=d;at=i;}
 }
 return max>tolerance?[...simplify(points.slice(0,at+1),tolerance).slice(0,-1),...simplify(points.slice(at),tolerance)]:[a,b];
}
function visiblePaths(buffer){
 const sets=new Map(),stride=RW+1;
 const edge=(id,a,b)=>{if(!sets.has(id))sets.set(id,new Map());const map=sets.get(id);if(!map.has(a))map.set(a,[]);map.get(a).push(b);};
 for(let py=0;py<RH;py++)for(let px=0;px<RW;px++){
  const k=py*RW+px,id=buffer[k];if(!id)continue;const a=py*stride+px,b=a+1,c=b+stride,d=a+stride;
  if(py===0||buffer[k-RW]!==id)edge(id,a,b);
  if(px===RW-1||buffer[k+1]!==id)edge(id,b,c);
  if(py===RH-1||buffer[k+RW]!==id)edge(id,c,d);
  if(px===0||buffer[k-1]!==id)edge(id,d,a);
 }
 const result=new Map();
 for(const[id,map]of sets){
  const paths=[];
  while(map.size){
   const first=map.keys().next().value;let at=first,loop=[];
   do{loop.push([at%stride,Math.floor(at/stride)]);const options=map.get(at);if(!options)break;at=options.pop();if(!options.length)map.delete(loop[loop.length-1][1]*stride+loop[loop.length-1][0]);}while(at!==first);
   if(loop.length<4)continue;
   loop.push(loop[0]);loop=simplify(loop,.55);
   if(loop.length<4)continue;
   paths.push('M'+loop.slice(0,-1).map(([px,py])=>fmt(x+px/S)+','+fmt(y+py/S)).join('L')+'Z');
  }
  if(paths.length)result.set(id,paths.join(''));
 }
 return result;
}
const opaque=visiblePaths(ids),transparent=visiblePaths(overlayIds),shades=visiblePaths(shadeIds),rims=visiblePaths(rimIds),byIndex=new Map([...info.values()].map(r=>[r.index,r]));
const body=[];let run=0;
function addLayer(layer){for(const[index,d]of layer){const r=byIndex.get(index);body.push(`<g id="${r.id}-visible" data-source="${r.component}"><path d="${d}" fill="${r.fill}" fill-rule="evenodd" stroke="${r.fill}" stroke-width=".16" stroke-linejoin="round"${r.opacity<1?` opacity="${r.opacity}"`:''}/></g>`);run++;}}
addLayer(opaque);
for(const[index,d]of shades)body.push(`<path id="shade-band-${index}" d="${d}" fill="#152039" fill-opacity="${index*.035}" fill-rule="evenodd"/>`);
for(const[index,d]of rims)body.push(`<path id="metal-rim-band-${index}" d="${d}" fill="#FFFFFF" fill-opacity="${index===2?.38:.18}" fill-rule="evenodd"/>`);
addLayer(transparent);
// Texture-free projected solar grids and vector radial glows.
for(const r of records.filter(r=>r.body).sort((a,b)=>b.z-a.z)){
 if(r.glow){
  const px=Math.floor((r.glow.x-x)*S),py=Math.floor((r.glow.y-y)*S),k=py*RW+px;
  const front=byIndex.get(ids[k]);
  const luminous=front&&['#21DBE3','#FFE3A8'].includes(front.fill.toUpperCase());
  if(px<0||py<0||px>=RW||py>=RH||(!luminous&&r.glow.z>depths[k]+1e-7))continue;
 }
 body.push(r.body);
}
const hash=createHash('sha256').update(source).digest('hex');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(w)}" height="${Math.ceil(h)}" viewBox="${[x,y,w,h].map(fmt).join(' ')}" role="img" aria-labelledby="title desc"><title id="title">Moon base — direct 3D mesh vectorization</title><desc id="desc">Projected directly from the game's original Three.js meshes. A supersampled geometry depth buffer resolves visible surfaces into vector paths; materials and glows use editable SVG gradients. Fictional game illustration.</desc><metadata>Source ${sourcePath}; SHA256 ${hash}; camera position ${camera.position.toArray()}; target 5,3.4,-1; fov 34.</metadata><defs>${defs.join('\n')}</defs>${body.join('\n')}</svg>`;
fs.writeFileSync(path.join(here,'space-base.svg'),svg);
fs.writeFileSync(path.join(here,'provenance.json'),JSON.stringify({source:sourcePath,sha256:hash,camera:{position:camera.position.toArray(),target:W(5,3.4,1).toArray(),fov:34},meshes:meshCount,frontTriangles:triangleCount,openLoops,pathRuns:run,viewport:{width:Math.ceil(w),height:Math.ceil(h)},method:'Project actual front-facing triangles; 4x per-mesh geometry depth buffer; trace and simplify visible regions to editable paths; SVG material gradients; no previous drawing or reference PNG used.'},null,2)+'\n');
const viewer=`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}canvas{width:100%;height:auto;display:block}</style><script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three';import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const scene=new THREE.Scene();
${terrain}
${geometry}
base.updateMatrixWorld(true);base.traverse(o=>{if(!o.isMesh)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());if(o.material===blobM||o.userData.flat||Math.hypot(c.x,c.z)>24||Math.max(s.x,s.z)>34)o.visible=false});
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(1);renderer.setSize(${Math.ceil(w)},${Math.ceil(h)},false);renderer.setClearColor(0,0);document.body.append(renderer.domElement);
const camera=new THREE.PerspectiveCamera(34,1600/900,.1,5000);camera.position.set(${camera.position.toArray()});camera.lookAt(${W(5,3.4,1).toArray()});camera.setViewOffset(1600,900,${x+800},${y+450},${Math.ceil(w)},${Math.ceil(h)});camera.updateProjectionMatrix();
const sun=new THREE.DirectionalLight('#f7f8ff',.55);sun.position.copy(W(LIGHT.sun[0]*1500,LIGHT.sun[1]*1500,LIGHT.sun[2]*1500));sun.target.position.set(0,0,0);scene.add(sun,sun.target);scene.add(new THREE.HemisphereLight('#e4e9f4','#8a90a3',2.6));renderer.render(scene,camera);document.body.dataset.ready='true';
</script></body></html>`;
fs.writeFileSync(path.join(here,'model-view.html'),viewer);
const uri='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const escaped=viewer.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const review=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}body{margin:0;font:14px/1.4 var(--font-sans,system-ui);color:var(--foreground,#eee)}.tools{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}button{background:var(--background,#101522);color:inherit;border:1px solid var(--border,#596379);border-radius:8px;min-height:40px;padding:8px 12px;font:inherit;cursor:pointer}button[aria-pressed=true]{background:var(--secondary,#2b3853);box-shadow:inset 0 -2px #21dbe3}button:focus-visible{outline:3px solid var(--ring,#21dbe3);outline-offset:2px}.art{background:#202c47;padding:16px;border-radius:var(--radius,12px)}.art.light{background:#e4e7ed}img,iframe{width:100%;aspect-ratio:${Math.ceil(w)}/${Math.ceil(h)};display:block;border:0}img{height:auto}iframe{height:auto}[hidden]{display:none!important}.note{color:var(--muted-foreground,#9faabd);font-size:12px;margin:10px 0 0}.spacer{flex:1}
</style></head><body><div class="tools"><button data-view="vector" aria-pressed="true">Vector from 3D</button><button data-view="model" aria-pressed="false">3D source</button><span class="spacer"></span><button id="background" aria-pressed="false">Light background</button></div><div class="art" id="art"><img id="vector" src="${uri}" alt="Fresh editable vector projection of the actual lunar base 3D model"><iframe id="model" title="Actual source 3D model, same camera" srcdoc="${escaped}" hidden></iframe></div><p class="note">Fresh export from the actual 3D meshes · original proportions and placement · editable SVG paths and gradients</p><script>
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));document.getElementById('vector').hidden=b.dataset.view!=='vector';document.getElementById('model').hidden=b.dataset.view!=='model'});document.getElementById('background').onclick=function(){const on=document.getElementById('art').classList.toggle('light');this.setAttribute('aria-pressed',String(on));this.textContent=on?'Navy background':'Light background'};
</script></body></html>`;
fs.writeFileSync(path.join(here,'review.html'),review);
console.log(JSON.stringify({meshes:meshCount,frontTriangles:triangleCount,openLoops,svgBytes:svg.length,viewport:[Math.ceil(w),Math.ceil(h)]}));

"""Make the base clip-art (assets/base-clipart.png) from the 3D model in all-screens.html.

1. python3 ideas/ui-mockups/scenes/render_base.py OUT_DIR   -> writes base-black.html and base-white.html
2. Screenshot both at 1600x900 (any browser; the T3 html_preview tool works).
3. python3 ideas/ui-mockups/scenes/matte.py base-black.png base-white.png ideas/ui-mockups/assets/base-clipart.png
Only the base group is drawn (no terrain, rocks, Earth or sky), in the 2D clip-art look: v8 light, no outlines,
no ground blobs (each scene draws its own shadow), seen from a low, near-eye-level angle like the story art.
"""
import pathlib, sys
MOCK = pathlib.Path(__file__).resolve().parent.parent
out_dir = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
allscr = (MOCK / "all-screens.html").read_text()
engine = allscr[allscr.index("import * as THREE from 'three';"):allscr.index("/* ---------- reusable HUD pieces")]
engine = engine.replace("new THREE.WebGLRenderer({antialias:true,", "new THREE.WebGLRenderer({alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:true,")
tail = r'''
scene.background=null;renderer.setClearColor(0x000000,0);
const L=LIGHT.sun;sun.position.copy(W(L[0]*1500,L[1]*1500,L[2]*1500));sun.target.position.set(0,0,0);sun.intensity=.55;hemi.intensity=2.6;lamps.forEach(l=>l.intensity=0);
const VW=1600,VH=900;renderer.setPixelRatio(1);renderer.setSize(VW,VH,false);OUT.uniforms.res.value.set(VW,VH);OUT.uniforms.w.value=4.2;
scene.traverse(o=>{if(o.isMesh||o.isSprite||o.isLine||o.isPoints){let inB=false;o.traverseAncestors(a=>{if(a===base)inB=true});if(!inB)o.visible=false}});
OUTL.forEach(h=>h.visible=false);base.traverse(o=>{if(o.material===blobM)o.visible=false});
base.updateMatrixWorld(true);const tb=new THREE.Box3(),tc=new THREE.Vector3(),ts=new THREE.Vector3();
base.traverse(o=>{if(!o.isMesh||o.material===OUT)return;tb.setFromObject(o);tb.getCenter(tc);tb.getSize(ts);if(Math.hypot(tc.x,tc.z)>24||Math.max(ts.x,ts.z)>34)o.visible=false});
const box=new THREE.Box3();base.traverse(o=>{if(o.isMesh&&o.visible&&o.material!==OUT){let v=true;o.traverseAncestors(a=>{if(!a.visible)v=false});if(v)box.expandByObject(o)}});
const c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());
camera.fov=13;camera.aspect=VW/VH;camera.near=1;camera.far=5000;
const dir=new THREE.Vector3(-0.22,0.085,1).normalize(),dist=(Math.max(sz.x,sz.z)*0.5)/Math.tan(camera.fov*Math.PI/360);
camera.position.copy(c).addScaledVector(dir,dist);camera.lookAt(c);camera.updateProjectionMatrix();renderer.render(scene,camera);
'''
for bg in ("black", "white"):
    (out_dir / f"base-{bg}.html").write_text(f'''<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:{bg}!important}}#frame canvas{{width:1600px!important;height:900px!important;display:block}}</style>
<script type="importmap">{{"imports":{{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}}}</script></head>
<body><div id="frame"><div id="stage" hidden></div></div><script type="module">
{engine}
{tail}</script></body></html>''')
print("wrote base-black.html and base-white.html in", out_dir)

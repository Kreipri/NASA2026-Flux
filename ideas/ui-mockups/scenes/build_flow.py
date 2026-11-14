"""Build the opening flow: story scenes (scenes-start.src.html) + the 3D engine (all-screens.html).

Run from anywhere:  python3 ideas/ui-mockups/scenes/build_flow.py [--abs-photo OUT.html]
Writes ideas/ui-mockups/flow-start-v1.html.
"""
import base64, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
MOCK = HERE.parent
CHAR = MOCK.parent / "character-designs" / "crew-v5" / "export"

def uri(p):
    return "data:image/svg+xml;base64," + base64.b64encode(p.read_bytes()).decode()

TOKENS = {
    "{{BRAM}}": uri(CHAR / "bram.svg"),
    "{{REMY}}": uri(CHAR / "remy.svg"),
    "{{MICA}}": uri(CHAR / "mica.svg"),
    "{{CMDR}}": uri(CHAR / "astronaut-colours" / "astronaut-commander.svg"),
    "{{CURIO}}": uri(CHAR / "curio.svg"),
    "{{CURIO_FACE}}": uri(CHAR / "curio.svg"),
}

scenes = (HERE / "scenes-start.src.html").read_text()
css = scenes.split("<style>", 1)[1].split("</style>", 1)[0]
defs = scenes.split("<!-- ============ shared art ============ -->", 1)[1].split("<main>", 1)[0]
js = scenes.rsplit("<script>", 1)[1].split("</script>", 1)[0]

# each story section → one screen with id/name/note
screens = []
for m in re.finditer(r'<!-- =+ (\S+) =+ -->\s*<section>\s*<div class="label"><b>(.*?)</b><span>(.*?)</span></div>\s*(<div class="screen".*?)\n</section>', scenes, re.S):
    key, name, note, body = m.groups()
    sid = key.lower()
    short = name.split(" · ")[0] if key != "TITLE" else "Title"
    body = body.replace('<div class="screen"', f'<div class="screen" data-id="{sid}" data-name="{short}" data-note="&lt;b&gt;{name}.&lt;/b&gt; {note}"', 1)
    screens.append(body)
assert len(screens) == 9, len(screens)

allscr = (MOCK / "all-screens.html").read_text()
a = allscr.index("import * as THREE from 'three';")
b = allscr.index("/* ---------- reusable HUD pieces")
engine = allscr[a:b]
# smoother terrain light: bicubic (B-spline) height reads for normals and the shadow start height,
# so shading no longer steps at every ~70 m height-map cell; slightly softer shadow edges
SMOOTH = [
    ("uniforms:{hmap:{value:hmTex},", "uniforms:{hsz:{value:new THREE.Vector2(HMX,HMZ)},hmap:{value:hmTex},"),
    ("uniform sampler2D hmap;uniform vec4 hdom;", "uniform sampler2D hmap;uniform vec2 hsz;uniform vec4 hdom;"),
    ("return texture2D(hmap,uv).r;}",
     "return texture2D(hmap,uv).r;}\n    float HS(vec2 p){vec2 uv=(p-hdom.xy)/hdom.zw;if(uv.x<0.0||uv.y<0.0||uv.x>1.0||uv.y>1.0)return -1e5;"
     "vec2 st=uv*hsz-0.5,i=floor(st),f=st-i,f2=f*f,f3=f2*f;vec2 w0=(1.0-3.0*f+3.0*f2-f3)/6.0,w1=(4.0-6.0*f2+3.0*f3)/6.0,w2=(1.0+3.0*f+3.0*f2-3.0*f3)/6.0,w3=f3/6.0;"
     "vec2 g0=w0+w1,g1=w2+w3,o0=(i-0.5+w1/g0+0.5)/hsz,o1=(i+1.5+w3/g1+0.5)/hsz;"
     "return g0.y*(g0.x*texture2D(hmap,o0).r+g1.x*texture2D(hmap,vec2(o1.x,o0.y)).r)+g1.y*(g0.x*texture2D(hmap,vec2(o0.x,o1.y)).r+g1.x*texture2D(hmap,o1).r);}"),
    ("float hx=H(p0+vec2(tex.x,0.0))-H(p0-vec2(tex.x,0.0)),hz=H(p0+vec2(0.0,tex.y))-H(p0-vec2(0.0,tex.y));",
     "float hx=HS(p0+vec2(tex.x,0.0))-HS(p0-vec2(tex.x,0.0)),hz=HS(p0+vec2(0.0,tex.y))-HS(p0-vec2(0.0,tex.y));"),
    ("float h0=H(p0)+2.0,", "float h0=HS(p0)+2.0,"),
    ("m=min(m,(h0+tanE*s-t)/(0.0087*s+4.0));", "m=min(m,(h0+tanE*s-t)/(0.015*s+6.0));"),
]
for a_, b_ in SMOOTH:
    assert a_ in engine, a_[:60]
    engine = engine.replace(a_, b_)
# tint the 3D sky to match the storybook purple
engine = engine.replace("g.addColorStop(0,'#04061a');g.addColorStop(1,'#10163a')", "g.addColorStop(0,'#2c1858');g.addColorStop(1,'#141c48')")

out = (HERE / "flow.src.html").read_text()
out = out.replace("{{SCENES_CSS}}", css).replace("{{SHARED_DEFS}}", defs).replace("{{STORY_SCREENS}}", "\n".join(screens))
out = out.replace("{{SCENES_JS}}", js).replace("{{ENGINE}}", engine)
for k, v in TOKENS.items():
    out = out.replace(k, v)

dst = MOCK / "flow-start-v1.html"
dst.write_text(out.replace("{{PHOTO}}", "assets/shackleton-oblique.jpg").replace("{{BASE_ART}}", "assets/base-clipart.png"))
print("wrote", dst)
if "--abs-photo" in sys.argv:
    alt = pathlib.Path(sys.argv[sys.argv.index("--abs-photo") + 1])
    alt.write_text(out.replace("{{PHOTO}}", str(MOCK / "assets" / "shackleton-oblique.jpg")).replace("{{BASE_ART}}", str(MOCK / "assets" / "base-clipart.png")).replace("'assets/earth/'", f"'{MOCK / 'assets' / 'earth'}/'"))
    print("wrote", alt)

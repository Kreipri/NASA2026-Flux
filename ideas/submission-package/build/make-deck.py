#!/usr/bin/env python3
"""Builds deck.html (7 slides, 1920x1080) from live-site screenshots in ../assets/screens
and the archived NASA samples in data/samples. Render to PDF with render-deck.mjs.
Run from the repo root: python3 ideas/submission-package/build/make-deck.py"""
import json, html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PKG = ROOT / 'ideas/submission-package'
SCR = '../assets/screens/'
PLAY = 'https://kreipri.github.io/NASA2026-Flux/'
REPO = 'https://github.com/Kreipri/NASA2026-Flux'
CREDITS = PLAY + 'credits.html'

# ---- real numbers from the archived samples (nothing invented) ----
r = json.load(open(ROOT / 'data/samples/radlab_CRaTER_LRO_2024-05-08_to_14.json'))
vals = [row[2] for row in r['data']]
lo, hi = min(vals), max(vals)
W, H = 760, 230
pts = []
for i, v in enumerate(vals):
    x = i * W / (len(vals) - 1)
    y = H - (v / 3300) * H
    pts.append(f'{x:.1f},{y:.1f}')
# date ticks every 24 h (first reading is May 8, 00:59 UTC)
ticks = ''.join(f'<text x="{d*24*W/(len(vals)-1):.0f}" y="{H+26}" fill="#6b5aa6" font-size="17" text-anchor="start">May {8+d}</text>' for d in range(7))
spark = (f'<svg viewBox="0 0 {W} {H+34}" width="{W}" height="{H+34}" role="img" aria-label="Hourly CRaTER absorbed dose rate, May 8 to 14 2024">'
         f'<line x1="0" y1="{H}" x2="{W}" y2="{H}" stroke="#d6ccff" stroke-width="1.5"/>'
         f'<polyline fill="none" stroke="#12a08a" stroke-width="3" stroke-linejoin="round" points="{" ".join(pts)}"/>{ticks}</svg>')


def crop(name, x, y, w, h, dw, cls=''):
    s = dw / w
    dh = h * s
    return (f'<div class="crop {cls}" style="width:{dw}px;height:{dh:.0f}px">'
            f'<img src="{SCR}{name}.png" style="width:{1600*s:.1f}px;left:{-x*s:.1f}px;top:{-y*s:.1f}px" alt=""></div>')


CSS = """
@page{size:1920px 1080px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#120a33}
body{font-family:'Lexend',system-ui,sans-serif;color:#fff}
.slide{width:1920px;height:1080px;position:relative;overflow:hidden;page-break-after:always;break-after:page;
  background:radial-gradient(1200px 700px at 80% 0%,#3a2377 0%,#241256 45%,#160b3d 100%);padding:70px 90px 0}
.slide:last-child{page-break-after:auto;break-after:auto}
h1,h2{font-family:'Fredoka',sans-serif;font-weight:600;letter-spacing:.2px}
h2{font-size:78px;line-height:1.05;color:#ffe7a8}
h2 em{font-style:normal;color:#ffb347}
.kicker{font-size:22px;letter-spacing:3px;text-transform:uppercase;color:#5fd3c4;font-weight:600;margin-bottom:14px}
.lead{font-size:34px;line-height:1.38;color:#e9e3ff;max-width:1500px;margin-top:22px}
.lead b{color:#fff}
.crop{position:relative;overflow:hidden;border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);border:3px solid rgba(255,255,255,.14);background:#241256;flex:none}
.crop img{position:absolute;display:block;max-width:none}
.cap{font-size:26px;line-height:1.35;color:#e9e3ff;margin-top:20px}
.cap b{color:#ffe7a8}
.foot{position:absolute;left:90px;right:90px;bottom:30px;display:flex;justify-content:space-between;gap:30px;font-size:19px;color:#b8aee6;line-height:1.35}
.foot a{color:#9fe6dc;text-decoration:none}
.num{position:absolute;right:90px;top:70px;font-size:20px;color:#b8aee6;letter-spacing:2px}
.chip{display:inline-block;font-size:21px;font-weight:600;padding:7px 18px;border-radius:999px;margin-right:10px}
.chip.g{background:#1d5a47;color:#c9ffe9}.chip.a{background:#6b4a10;color:#ffe3a0}.chip.p{background:#3b2a7c;color:#dcd2ff}
.row{display:flex;gap:56px;align-items:flex-start}
.card{background:#fbf9ff;color:#2b1a62;border-radius:28px;padding:34px 40px;box-shadow:0 18px 50px rgba(0,0,0,.4)}
.card h3{font-family:'Fredoka',sans-serif;font-size:42px;color:#2b1a62;margin-bottom:6px}
.card .src{font-size:22px;color:#6b5aa6;margin-bottom:18px}
.card ul{list-style:none;font-size:29px;line-height:1.45}
.card li{margin-bottom:6px}
.card li b{color:#b3340a}
.note{font-size:22px;color:#6b5aa6;margin-top:14px;line-height:1.35}
.arrow{align-self:center;font-size:70px;color:#ffb347;flex:none}
"""

slides = []

# 1 -- title: full-bleed live title screen + caption bar
slides.append(f"""
<section class="slide" style="padding:0">
  <img src="{SCR}title.png" style="position:absolute;inset:0;width:1920px;height:1080px" alt="Space Base Commander title screen">
  <div style="position:absolute;left:0;right:0;bottom:0;height:230px;background:linear-gradient(180deg,rgba(22,11,61,0) 0%,rgba(22,11,61,.92) 35%,#160b3d 100%);padding:80px 90px 40px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px">
    <div style="white-space:nowrap">
      <h1 style="font-size:56px;color:#ffe7a8;line-height:1.05">What would you do on the Moon?</h1>
      <p style="font-size:27px;color:#e9e3ff;margin-top:10px">A mission-planning game for children ages 7&ndash;12, inspired by NASA science.</p>
    </div>
    <div style="text-align:right;font-size:21px;line-height:1.45;color:#d6ccff;max-width:680px">
      <b style="color:#fff">The Space Flux</b> &middot; Bea Margaret B. Ganotisi, Neo F. Mari&ntilde;as<br>
      NASA Space Apps Challenge 2026 &middot; Build a Junior Astronaut Mission Trainer
    </div>
  </div>
</section>""")

# 2 -- evidence
slides.append(f"""
<section class="slide">
  <div class="num">2 / 7</div>
  <div class="kicker">Evidence</div>
  <h2>Real missions begin with <em>evidence</em></h2>
  <p class="lead">NASA <b>DONKI</b> records solar events. <b>CRaTER</b> measures radiation near the Moon; NASA <b>RadLab</b> provides access to those records. Our prototype includes a <b>May 2024</b> archive.</p>
  <div class="row" style="margin-top:44px">
    <div class="card" style="width:620px;height:520px">
      <h3>DONKI &middot; space weather</h3>
      <div class="src">Archived records, May 8&ndash;12, 2024</div>
      <ul style="font-size:32px;line-height:1.6;margin-top:30px">
        <li><b>76</b> solar flares logged</li>
        <li>Strongest: <b>X5.8</b><br><span style="font-size:26px;color:#6b5aa6">May 11, 01:23 UTC</span></li>
        <li>Geomagnetic storm: Kp <b>9.0</b><br><span style="font-size:26px;color:#6b5aa6">May 11</span></li>
      </ul>
    </div>
    <div class="card" style="width:1120px;height:520px">
      <h3>CRaTER on LRO &middot; radiation near the Moon</h3>
      <div class="src">Absorbed dose rate, &micro;Gy per hour, hourly &middot; May 8&ndash;14, 2024 &middot; via NASA OSDR RadLab</div>
      <div style="display:flex;align-items:flex-end;gap:22px">
        {spark}
        <div style="font-size:26px;line-height:1.4;color:#2b1a62">
          <div>Low: <b style="color:#12705f">{lo:.0f}</b></div>
          <div>Peak: <b style="color:#b3340a">{hi:,.0f}</b></div>
          <div style="font-size:20px;color:#6b5aa6">&micro;Gy/h</div>
        </div>
      </div>
    </div>
  </div>
  <p class="cap" style="max-width:1700px">Historical observations &mdash; <b>not live</b>. These are lunar-orbit instrument readings, not doses on the surface or astronaut health limits.</p>
  <div class="foot"><div>Sources: <a>ccmc.gsfc.nasa.gov/tools/DONKI</a> &middot; <a>visualization.osdr.nasa.gov/radlab</a> &middot; Archive retrieved Nov 14, 2026</div><div>NASA data, not an endorsement</div></div>
</section>""")

# 3 -- choice
slides.append(f"""
<section class="slide">
  <div class="num">3 / 7</div>
  <div class="kicker">Gameplay</div>
  <h2>Explore outside, or <em>protect the crew?</em></h2>
  <p class="lead" style="margin-top:16px">Jobs compete for crew time, power and air. <b>Outside work adds radiation exposure.</b></p>
  <div class="row" style="margin-top:34px;justify-content:center">
    <div>
      {crop('prev-rover', 855, 112, 705, 760, 520, 'k')}
      <p class="cap" style="max-width:520px"><b>Drive to the dark crater</b><br>4 time blocks, &minus;50 power, &minus;8 air, &minus;24 crew energy. Outside work.</p>
    </div>
    <div class="arrow">vs</div>
    <div>
      {crop('prev-shelter', 855, 112, 705, 760, 520, 'k')}
      <p class="cap" style="max-width:520px"><b>Take shelter</b><br>4 time blocks, +5 power, &minus;8 crew energy. Staying inside, the storm adds no storm-particle dose.</p>
    </div>
    <div style="width:420px;align-self:center">
      <span class="chip p">Game rules</span>
      <p class="cap" style="margin-top:16px">Real concepts &mdash; sunlight, radiation and shelter &mdash; turned into choices. The numbers are <b>simplified game costs</b>, shown before you commit.</p>
    </div>
  </div>
  <div class="foot"><div>Screens captured from the playable build &middot; Week 2 of 7, particle storm</div><div>Independent educational prototype</div></div>
</section>""")

# 4 -- consequence
slides.append(f"""
<section class="slide">
  <div class="num">4 / 7</div>
  <div class="kicker">Consequences</div>
  <h2>Make the call. <em>See what changed.</em></h2>
  <p class="lead" style="margin-top:16px">Read the costs. Choose a job. See its result. At week&rsquo;s end, a recap shows how your work and base conditions changed the mission.</p>
  <div class="row" style="margin-top:56px;justify-content:center;align-items:center">
    <div>
      {crop('result-shelter', 368, 218, 864, 464, 660)}
      <p class="cap" style="max-width:660px"><b>1.</b> The job result: time and meter costs, plus why.</p>
    </div>
    <div class="arrow">&rarr;</div>
    <div>
      {crop('recap', 224, 24, 1152, 546, 880)}
      <p class="cap" style="max-width:880px"><b>2.</b> The week recap: jobs and weekly changes, kept separate. Same run, real numbers.</p>
    </div>
  </div>
  <div class="foot"><div>Take shelter in a particle storm: radiation stays at 3 (no change) this week</div><div>All meter values are game points</div></div>
</section>""")

# 5 -- real vs simulated
slides.append(f"""
<section class="slide">
  <div class="num">5 / 7</div>
  <div class="kicker">Model transparency</div>
  <h2>Know what is real &mdash; <em>and what we simplified</em></h2>
  <div class="row" style="margin-top:60px;gap:50px">
    <div style="width:430px">
      <span class="chip g">NASA observations and science</span>
      <p class="cap" style="margin-top:14px">Archived DONKI and CRaTER records, and NASA lunar science.</p>
      <span class="chip a" style="margin-top:30px">Our game model</span>
      <p class="cap" style="margin-top:14px">Crew, mission schedule, resource costs and exposure points.</p>
      <p class="cap" style="margin-top:34px;font-size:30px;color:#fff"><b style="color:#ffb347">The game teaches planning, not astronaut health limits.</b></p>
    </div>
    <div>
      {crop('nasa-panel', 272, 115, 1056, 670, 780)}
      <p class="cap" style="font-size:22px">Title screen &middot; Real NASA data</p>
    </div>
    <div>
      {crop('sources', 962, 100, 636, 625, 520)}
      <p class="cap" style="font-size:22px">In game &middot; Data and game rules</p>
    </div>
  </div>
  <div class="foot"><div>Independent educational prototype. Fictional mission; simplified rules. NASA archive data, not live. No NASA endorsement.</div><div></div></div>
</section>""")

# 6 -- learning loop
slides.append(f"""
<section class="slide">
  <div class="num">6 / 7</div>
  <div class="kicker">Learning loop</div>
  <h2>Help young commanders <em>learn by trying</em></h2>
  <p class="lead" style="margin-top:16px">Curio guides the first week. A seven-week mission investigates sunlight, radiation, shelter and ice. Results and recaps help players rethink their plan.</p>
  <div class="row" style="margin-top:34px;justify-content:center">
    <div>
      {crop('w1-coach', 224, 178, 1152, 545, 580)}
      <p class="cap" style="max-width:580px"><b>Week 1:</b> Curio explains each step.</p>
    </div>
    <div>
      {crop('w2-open', 224, 232, 1156, 440, 580)}
      <p class="cap" style="max-width:580px"><b>Every week:</b> Mission Control&rsquo;s ask.</p>
    </div>
    <div>
      {crop('report-card', 850, 108, 712, 760, 440)}
      <p class="cap" style="max-width:440px"><b>Report card:</b> your evidence.</p>
    </div>
  </div>
  <p class="cap" style="margin-top:30px;color:#b8aee6;font-size:24px">Next: refine data mapping and evidence tracking; test understanding with children. Learning benefit is intended, not yet measured.</p>
  <div class="foot"><div>Curio design: Bea &middot; AI-generated vector/3D artwork, identified in the game</div><div></div></div>
</section>""")

# 7 -- invitation
slides.append(f"""
<section class="slide">
  <div class="num">7 / 7</div>
  <div class="kicker">Your turn</div>
  <h2 style="font-size:96px">What would you <em>do differently?</em></h2>
  <p class="lead" style="margin-top:26px">Play Space Base Commander. Explore the sources. Try another plan.</p>
  <div class="row" style="margin-top:90px;align-items:center;gap:80px">
    <div class="card" style="padding:26px"><div id="qr" style="width:300px;height:300px"></div></div>
    <div style="font-size:34px;line-height:1.7">
      <div><span class="chip a">Play</span> <b style="color:#ffe7a8">kreipri.github.io/NASA2026-Flux</b></div>
      <div><span class="chip g">Credits</span> kreipri.github.io/NASA2026-Flux/credits.html</div>
      <div><span class="chip p">Code</span> github.com/Kreipri/NASA2026-Flux</div>
      <div style="font-size:26px;color:#b8aee6;margin-top:8px">No account or install. Saves in this browser.</div>
    </div>
  </div>
  <div class="foot" style="flex-direction:column;gap:6px;bottom:26px;font-size:18px">
    <div>Layout wireframe, Curio and selected vectors: Bea. Workflow, implementation and other vectors: AI-assisted (Codex, Claude). Full sources and credits at the Credits link.</div>
    <div>Data: NASA CCMC DONKI; NASA OSDR RadLab (CRaTER/LRO); NASA SVS. Built with Three.js &middot; Fredoka and Lexend (OFL) &middot; Earth texture from three.js examples.</div>
    <div>Independent educational prototype. Fictional mission; simplified rules. NASA archive data, not live. No NASA endorsement.</div>
  </div>
</section>""")

doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Space Base Commander &mdash; demo</title>
<meta name="viewport" content="width=1920">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Lexend:wght@400;600&display=swap" rel="stylesheet">
<style>{CSS}</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
</head><body>
{''.join(slides)}
<script>
try{{const q=qrcode(0,'M');q.addData('{PLAY}');q.make();document.getElementById('qr').innerHTML=q.createSvgTag({{cellSize:10,margin:0,scalable:true}});const s=document.querySelector('#qr svg');s.setAttribute('width','300');s.setAttribute('height','300');}}catch(e){{document.getElementById('qr').textContent='{PLAY}';}}
</script></body></html>"""
(PKG / 'build/deck.html').write_text(doc, encoding='utf-8')
print('wrote deck.html; CRaTER low/peak', round(lo, 2), round(hi, 2))

"""Rebuild the clean SVG redraw and self-contained comparison. Python stdlib only.

Run: python3 ideas/base-designs/vector-v1/build.py
The existing PNG is a visual reference, never embedded in the vector artwork.
"""
from pathlib import Path
import base64
import math
import re
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
REFERENCE = ROOT / "ideas/ui-mockups/assets/base-clipart.png"
ASTRONAUT = ROOT / "ideas/character-designs/crew-v5/export/astronaut.svg"


def group(name, body):
    return f'<g id="{name}" aria-label="{name.replace("-", " ")}">\n{body}\n</g>'


def beacon(x, y, r=8):
    # Concentric vector shapes; no blur/filter or raster glow.
    return (f'<circle cx="{x}" cy="{y}" r="{r*1.8}" fill="#21DBE3" opacity=".14"/>'
            f'<circle cx="{x}" cy="{y}" r="{r*1.25}" fill="#21DBE3" opacity=".18"/>'
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="#21DBE3"/>'
            f'<circle cx="{x-r*.2}" cy="{y-r*.28}" r="{r*.32}" fill="#BAFFFF" opacity=".85"/>')


DEFS = '''
<linearGradient id="metal" x2="0" y2="1"><stop stop-color="#DCE0E8"/><stop offset=".38" stop-color="#C3C8D4"/><stop offset="1" stop-color="#8C94AA"/></linearGradient>
<linearGradient id="rim" x2="0" y2="1"><stop stop-color="#F0F2F6"/><stop offset="1" stop-color="#B1B8C8"/></linearGradient>
<linearGradient id="slate" x2="0" y2="1"><stop stop-color="#ADB4C5"/><stop offset="1" stop-color="#68728D"/></linearGradient>
<linearGradient id="dark-metal" x2="0" y2="1"><stop stop-color="#8791AB"/><stop offset="1" stop-color="#495570"/></linearGradient>
<linearGradient id="screen" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#1D2B4C"/><stop offset="1" stop-color="#4465B2"/></linearGradient>
<linearGradient id="solar" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#283C68"/><stop offset="1" stop-color="#415D9B"/></linearGradient>
<linearGradient id="amber" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#F7C081"/><stop offset="1" stop-color="#BF833E"/></linearGradient>
<linearGradient id="regolith" x1=".3" y1="0" x2=".6" y2="1"><stop stop-color="#A4AABC"/><stop offset="1" stop-color="#727D96"/></linearGradient>
<linearGradient id="rubber" x2="0" y2="1"><stop stop-color="#293858"/><stop offset="1" stop-color="#142241"/></linearGradient>
'''


def solar_panel(x, y, width=77, height=175):
    w, h = width, height
    cells = []
    for i in range(1, 6):
        cx = 5 + i * (w-10) / 6
        cells.append(f'M{cx:.2f} 6V{h-6}')
    for i in range(1, 16):
        cy = 6 + i * (h-12) / 16
        cells.append(f'M5 {cy:.2f}H{w-5}')
    return f'''<g transform="translate({x} {y}) skewY(1)">
      <rect x="34" y="{h-2}" width="12" height="76" rx="4" fill="url(#slate)"/>
      <rect x="21" y="{h+66}" width="43" height="20" rx="9" fill="url(#metal)"/>
      <path d="M25 {h+70}H58" stroke="#E0E4ED" stroke-width="3" stroke-linecap="round"/>
      <rect width="{w}" height="{h}" rx="4" fill="url(#slate)"/>
      <path d="M4 {h-3}V4H{w-4}" fill="none" stroke="#D1D7E4" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="4" y="4" width="{w-8}" height="{h-8}" rx="1.5" fill="url(#solar)"/>
      <path d="{' '.join(cells)}" fill="none" stroke="#718BC0" stroke-width="1.35" opacity=".8"/>
      <path d="M10 33L32 25" stroke="#C7DCF9" stroke-width="3.2" stroke-linecap="round" opacity=".65"/>
    </g>'''


solar = group("solar-array", f'''<path d="M165 55V70" stroke="#8E99AF" stroke-width="5"/>
{beacon(165, 51, 7)}
{solar_panel(14, 56)}
{solar_panel(125, 56)}
{solar_panel(233, 56)}''')

braces = []
for y, half, half_bottom in [(88, 13, 16), (124, 16, 19), (161, 19, 23), (201, 23, 27), (245, 27, 30)]:
    bottom = y+37 if y < 200 else y+43
    braces.append(f'M{800-half} {y}L{800+half_bottom} {bottom}M{800+half} {y}L{800-half_bottom} {bottom}')
tower = group("comms-tower", f'''
<g id="tower-frame" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M787 80L771 294M812 80L832 295" stroke="url(#dark-metal)" stroke-width="8"/>
  <path d="M790 82L778 292M809 82L826 294" stroke="#D1D6E0" stroke-width="2.3"/>
  <path d="{' '.join(braces)}" stroke="#929DB6" stroke-width="4"/>
  <path d="M784 124H816M781 161H820M778 201H824M774 245H829M770 287H833" stroke="url(#slate)" stroke-width="6"/>
</g>
<g id="dish">
  <path d="M801 44V82" stroke="#8E99AF" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="800" cy="45" rx="34" ry="33" fill="url(#slate)" transform="rotate(-17 800 45)"/>
  <ellipse cx="799" cy="43" rx="29.5" ry="29" fill="url(#metal)" transform="rotate(-17 799 43)"/>
  <path d="M773 34C779 17 797 12 812 22" fill="none" stroke="#E7EBF3" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>
  <path d="M804 48L818 68" stroke="#65708B" stroke-width="4" stroke-linecap="round"/>
  <circle cx="803" cy="47" r="7.5" fill="url(#dark-metal)"/>
  <rect x="780" y="75" width="41" height="9" rx="4.5" fill="url(#metal)"/>
  {beacon(824, 70, 6)}
</g>
<g id="floodlights">
  <rect x="768" y="121" width="51" height="22" rx="10" fill="url(#slate)"/>
  <circle cx="779" cy="131" r="9" fill="#DEE2DC"/><circle cx="779" cy="131" r="5.7" fill="#FFFFDF"/>
  <circle cx="804" cy="131" r="9" fill="#DEE2DC"/><circle cx="804" cy="131" r="5.7" fill="#FFFFDF"/>
</g>''')

shelter = group("shelter", f'''
<path d="M94 356C108 297 171 250 242 249C304 245 368 273 389 315L373 356Z" fill="url(#regolith)"/>
<path d="M116 308C145 275 188 256 235 255" fill="none" stroke="#CBD1DD" stroke-width="3" stroke-linecap="round" opacity=".32"/>
<path d="M197 254V259" stroke="#78849C" stroke-width="4"/>{beacon(198,254,4)}
''')


def bezier(t):
    p = [(345, 310), (405, 305), (433, 227), (540, 244)]
    a, b, c, d = p
    q = [(1-t)**3*a[i] + 3*(1-t)**2*t*b[i] + 3*(1-t)*t*t*c[i] + t**3*d[i] for i in (0, 1)]
    tangent = [3*(1-t)**2*(b[i]-a[i])+6*(1-t)*t*(c[i]-b[i])+3*t*t*(d[i]-c[i]) for i in (0, 1)]
    length = math.hypot(*tangent)
    return q, (-tangent[1]/length, tangent[0]/length), (tangent[0]/length, tangent[1]/length)


ribs = []
for t in [.04, .17, .30, .43, .56, .69, .82, .95]:
    (x, y), (nx, ny), (tx, ty) = bezier(t)
    coords = (x-23*nx, y-23*ny, x+8*tx, y+8*ty, x+23*nx, y+23*ny)
    d = 'M%.2f %.2fQ%.2f %.2f %.2f %.2f' % coords
    ribs.append(f'<path d="{d}" fill="none" stroke="#8D97AB" stroke-width="7" stroke-linecap="round"/>'
                f'<path d="{d}" fill="none" stroke="url(#rim)" stroke-width="3.5" stroke-linecap="round"/>')
tunnel = group("connecting-tunnel", f'''
<g id="tunnel-supports" fill="none" stroke-linecap="round">
  <path d="M429 282V349M440 278V347" stroke="#8C96AE" stroke-width="5"/>
  <path d="M430 282V346" stroke="#CFD5E1" stroke-width="1.8"/>
</g>
<path d="M345 310C405 305 433 227 540 244" fill="none" stroke="#78839B" stroke-width="48" stroke-linecap="round"/>
<path d="M345 306C405 301 433 223 540 240" fill="none" stroke="url(#metal)" stroke-width="39" stroke-linecap="round"/>
{''.join(ribs)}''')

entrance = group("shelter-airlock", f'''
<path d="M299 283H330C346 283 354 296 354 313V337C354 351 343 357 330 357H297C284 357 279 348 279 337V306C279 291 286 283 299 283Z" fill="url(#slate)"/>
<path d="M297 286H327C338 286 343 294 343 306V350H296C286 350 284 343 284 334V306C284 293 288 286 297 286Z" fill="url(#rim)"/>
<path d="M307 309H337V351H305V317Q305 309 307 309Z" fill="url(#screen)"/>
<path d="M309 317L316 315" stroke="#C7DDF6" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
<rect x="305" y="291" width="29" height="10" rx="3" fill="url(#slate)"/>
<rect x="312" y="293" width="15" height="5" rx="2.5" fill="#21DBE3"/>
<path d="M300 304H335" stroke="#21DBE3" stroke-width="3" stroke-linecap="round" opacity=".7"/>
''')

landing_gear = group("landing-gear", '''
<g id="rear-legs" fill="url(#slate)">
 <path d="M517 304L495 329H510L530 305Z"/><ellipse cx="501" cy="333" rx="25" ry="5.5"/>
 <path d="M779 305L811 351H827L793 302Z"/><ellipse cx="828" cy="358" rx="28" ry="6.5"/>
</g>
<g id="underside">
 <path d="M569 305H629L627 328Q622 353 607 350Q588 348 580 328Z" fill="url(#amber)"/>
 <path d="M709 305H760L755 326Q750 350 737 348Q719 345 716 330Z" fill="url(#amber)"/>
 <path d="M629 306H713L704 326Q675 340 640 328Z" fill="url(#dark-metal)"/>
 <path d="M582 313L590 336Q600 351 613 344M719 312L725 333Q736 352 748 337" fill="none" stroke="#F7D4A0" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
</g>
<g id="front-legs">
 <path d="M576 316L553 360H567L590 318Z" fill="url(#metal)"/><circle cx="578" cy="330" r="8" fill="url(#slate)"/>
 <ellipse cx="561" cy="365" rx="26" ry="6" fill="url(#dark-metal)"/><path d="M539 364Q561 359 582 364" fill="none" stroke="#B5BCCA" stroke-width="2"/>
 <path d="M794 312L818 351H832L808 308Z" fill="url(#metal)"/>
 <ellipse cx="831" cy="359" rx="26" ry="6" fill="url(#dark-metal)"/><path d="M810 358Q831 353 852 358" fill="none" stroke="#B5BCCA" stroke-width="2"/>
</g>''')

deck = group("landing-platform", '''
<path d="M485 290C485 278 563 268 662 268C760 268 839 278 839 290V296C839 309 760 319 662 319C563 319 485 309 485 296Z" fill="url(#slate)"/>
<ellipse cx="662" cy="289" rx="177" ry="20.5" fill="url(#metal)"/>
<path d="M491 289C501 299 575 307 660 307C746 307 819 299 832 290" fill="none" stroke="#E3E7EF" stroke-width="3" stroke-linecap="round"/>
<path d="M515 286C557 279 603 277 655 277" fill="none" stroke="#EEF1F7" stroke-width="2" stroke-linecap="round" opacity=".6"/>
''')

habitat = group("main-habitat", f'''
<g id="habitat-antenna">
 <path d="M598 96V139" stroke="#8E99AF" stroke-width="5" stroke-linecap="round"/>
 <path d="M597 99V134" stroke="#D0D7E3" stroke-width="1.5" stroke-linecap="round"/>
 {beacon(598,95,8)}
</g>
<path d="M543 148C544 129 647 126 653 149L658 165V261Q658 285 599 285Q540 284 539 262V170Z" fill="url(#metal)"/>
<path d="M548 150C557 134 637 135 648 149" fill="none" stroke="#E8ECF4" stroke-width="3" stroke-linecap="round"/>
<path d="M544 177V257Q544 267 551 271" fill="none" stroke="#E7EBF1" stroke-width="3" stroke-linecap="round" opacity=".65"/>
<path d="M546 151C566 158 633 158 651 151" fill="none" stroke="#8C95AB" stroke-width="5" stroke-linecap="round"/>
<path d="M541 177C567 185 633 185 657 178" fill="none" stroke="url(#dark-metal)" stroke-width="8" stroke-linecap="round"/>
<path d="M542 175C566 183 632 183 656 176" fill="none" stroke="#C8CFDC" stroke-width="3" stroke-linecap="round"/>
<path d="M543 267C569 276 630 276 655 267" fill="none" stroke="url(#slate)" stroke-width="6" stroke-linecap="round"/>
<g id="round-window">
 <circle cx="613" cy="220" r="26" fill="url(#slate)"/>
 <circle cx="613" cy="218" r="21.5" fill="url(#rim)"/>
 <circle cx="613" cy="219" r="16.5" fill="url(#screen)"/>
 <path d="M604 211L611 207" stroke="#C4DAFA" stroke-width="3" stroke-linecap="round" opacity=".7"/>
 <circle cx="615" cy="206" r="1.5" fill="#DDEAFF" opacity=".7"/>
</g>
<g id="habitat-status-panel">
 <rect x="594" y="250" width="39" height="17" rx="4" fill="url(#slate)"/>
 <rect x="598" y="253" width="17" height="4" rx="2" fill="url(#amber)"/>
 <circle cx="624" cy="255" r="2.1" fill="#21DBE3"/>
 <rect x="598" y="260" width="5" height="2.5" rx="1" fill="#273A5C"/>
 <rect x="606" y="260" width="5" height="2.5" rx="1" fill="#273A5C"/>
</g>
<rect x="539" y="270" width="24" height="17" rx="7" fill="url(#amber)"/>
''')

lab = group("side-habitat", '''
<g id="habitat-link"><rect x="656" y="220" width="43" height="37" rx="15" fill="url(#slate)"/><path d="M661 224H689" stroke="#D7DDE7" stroke-width="3" stroke-linecap="round"/></g>
<path d="M686 182C687 158 784 157 789 183L792 196V259Q790 279 739 279Q685 279 683 258V198Z" fill="url(#metal)"/>
<path d="M691 180C705 164 770 164 785 180" fill="none" stroke="#E9EDF4" stroke-width="3" stroke-linecap="round"/>
<path d="M688 183Q736 194 787 183" fill="none" stroke="#7E89A2" stroke-width="5" stroke-linecap="round"/>
<path d="M688 197V250" fill="none" stroke="#E7EBF2" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
<path d="M687 260Q737 273 789 260" fill="none" stroke="url(#slate)" stroke-width="6" stroke-linecap="round"/>
<g id="lab-windows">
 <path d="M714 211L732 210V233L714 234Z" fill="url(#screen)"/>
 <path d="M742 211L760 210V233L742 234Z" fill="url(#screen)"/>
 <path d="M769 210L783 209V231L769 233Z" fill="url(#screen)"/>
 <path d="M718 216L723 215M746 216L751 215M772 215L776 214" fill="none" stroke="#C1D9F7" stroke-width="2.2" stroke-linecap="round" opacity=".65"/>
</g>''')

rail = group("deck-railing", '''
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path d="M624 296V272L695 262L729 269V295M660 292V268M695 290V262" stroke="#626E89" stroke-width="3.5"/>
 <path d="M625 271L695 261L729 268" stroke="#C5CDDB" stroke-width="1.5"/>
</g>''')

ladder = group("access-ladder", '''
<path d="M748 306L758 372M780 305L788 370" fill="none" stroke="#6B7691" stroke-width="5" stroke-linecap="round"/>
<path d="M749 306L759 372M781 305L789 370" fill="none" stroke="#C8D0DE" stroke-width="2" stroke-linecap="round"/>
<path d="M751 314L782 312M753 326L783 324M755 338L785 336M757 350L786 348M759 362L788 360" fill="none" stroke="url(#metal)" stroke-width="4" stroke-linecap="round"/>
''')


def wheel(x, y, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})">
      <ellipse cx="-3" cy="-1" rx="16" ry="18" fill="#111D37"/>
      <ellipse rx="14.5" ry="17" fill="url(#rubber)"/>
      <ellipse rx="9.5" ry="12.5" fill="url(#slate)"/>
      <ellipse rx="5" ry="7.5" fill="url(#rubber)"/>
      <path d="M-10-4C-8-13 1-15 7-8" fill="none" stroke="#AAB6D0" stroke-width="1.8" stroke-linecap="round"/>
    </g>'''


rover = group("exploration-rover", f'''
<g id="far-wheels">{wheel(909,337,.83)}{wheel(944,337,.83)}{wheel(979,334,.83)}</g>
<path d="M903 318L1011 312Q1031 313 1037 327L1034 339L908 344Q894 342 892 333Z" fill="url(#dark-metal)"/>
<path d="M901 317L1010 312Q1028 312 1036 324L1035 331L906 337Q896 336 895 329Z" fill="url(#metal)"/>
<path d="M907 293Q907 272 929 271L995 268Q1017 268 1019 288V312Q1016 323 996 324H926Q905 323 905 311Z" fill="url(#metal)"/>
<path d="M911 291Q913 277 929 276L995 273Q1009 273 1013 282" fill="none" stroke="#EEF1F7" stroke-width="3" stroke-linecap="round"/>
<path d="M910 312Q944 319 1014 312" fill="none" stroke="#737F99" stroke-width="4" stroke-linecap="round"/>
<path d="M916 270L958 267L974 269L932 272Z" fill="url(#screen)"/>
<path d="M920 270L954 268" stroke="#A3B5D7" stroke-width="1.2"/>
<path d="M959 285L979 283V298L959 300Z" fill="url(#screen)"/>
<path d="M987 282L1006 280V295L987 297Z" fill="url(#screen)"/>
<path d="M964 289L971 288M991 286L998 285" fill="none" stroke="#C7DCF8" stroke-width="2.3" stroke-linecap="round" opacity=".7"/>
<path d="M963 311L987 309V317L963 319Z" fill="url(#amber)"/>
<path d="M994 245V268" stroke="#8E99AF" stroke-width="4" stroke-linecap="round"/>
{beacon(994,240,8)}
<path d="M1033 319V329" stroke="#7C8DA9" stroke-width="3"/>{beacon(1033,319,4)}
<path d="M938 334L1027 330" fill="none" stroke="#697792" stroke-width="6" stroke-linecap="round"/>
<g id="near-wheels">{wheel(958,347)}{wheel(993,345)}{wheel(1027,342)}</g>
''')

# Reuse the project's actual vector astronaut, keeping its existing style.
# Remove only invisible blur copies; the main shapes remain. Prefix every ID.
astronaut_tree = ET.fromstring(ASTRONAUT.read_text())
for parent in astronaut_tree.iter():
    for child in list(parent):
        if child.tag.endswith('filter') or 'filter' in child.attrib:
            parent.remove(child)
astronaut_svg = ET.tostring(astronaut_tree, encoding='unicode')
astronaut_svg = astronaut_svg.replace('ns0:', '').replace(':ns0', '')
ids = re.findall(r'\bid="([^"]+)"', astronaut_svg)
for name in sorted(ids, key=len, reverse=True):
    astronaut_svg = astronaut_svg.replace(f'id="{name}"', f'id="crew-{name}"').replace(f'url(#{name})', f'url(#crew-{name})')
astronaut_inner = astronaut_svg[astronaut_svg.index('>')+1:astronaut_svg.rindex('</svg>')]
astronaut = group("foreground-astronaut", f'<g transform="translate(768 293) scale(.31)">{astronaut_inner}</g>')

parts = [solar, tower, shelter, tunnel, entrance, landing_gear, deck, habitat, lab, rail, ladder, rover, astronaut]
HEADER = '''<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="410" viewBox="-24 -16 1100 410" fill="none" role="img" aria-labelledby="base-title base-desc">
<title id="base-title">Moon base — editable vector draft</title>
<desc id="base-desc">A clean redraw of our base: three tall solar panels, a covered shelter, ribbed tunnel, two round habitat modules on a landing deck, a communications dish, a six-wheel field rover, and a small astronaut. Original fictional game art, not a NASA engineering diagram.</desc>
'''
svg = HEADER + '<defs>' + DEFS + '</defs>\n' + '\n'.join(parts) + '\n</svg>\n'
(HERE / 'space-base.svg').write_text(svg)

# Useful for scenes that add their own foreground crew.
no_crew_header = HEADER.replace(', and a small astronaut', '').replace('field rover, and', 'field rover and')
(HERE / 'space-base-without-crew.svg').write_text(no_crew_header + '<defs>' + DEFS + '</defs>\n' + '\n'.join(parts[:-1]) + '\n</svg>\n')

# A minimal comparison, kept independent of the active UI/scene sources.
png_uri = 'data:image/png;base64,' + base64.b64encode(REFERENCE.read_bytes()).decode()
html = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box}body{margin:0;font:14px/1.45 var(--font-sans,system-ui);color:var(--foreground,#e7eaf0)}
.tools{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.buttons{display:flex;gap:5px;flex-wrap:wrap}button{font:inherit;border:1px solid var(--border,#536078);border-radius:8px;background:transparent;color:inherit;min-height:40px;padding:8px 12px;cursor:pointer}button[aria-pressed="true"]{background:var(--secondary,#33415c);box-shadow:inset 0 -2px #21dbe3}button:focus-visible{outline:3px solid var(--ring,#21dbe3);outline-offset:2px}
.canvas{background:#202c47;padding:16px;border-radius:var(--radius,12px);overflow:hidden;min-height:130px}
.canvas.light{background:#e4e7ed}.canvas.check{background-color:#f2f4f8;background-image:conic-gradient(#dce1e9 25%,transparent 0 50%,#dce1e9 0 75%,transparent 0);background-size:24px 24px}
.art svg{width:100%;height:auto;display:block}.original{padding:0 2.2%;aspect-ratio:1100/410;align-items:center}.original img{width:100%;height:auto;display:block}.art[hidden]{display:none}.original:not([hidden]){display:flex}
.note{margin:10px 0 0;color:var(--muted-foreground,#99a6bc);font-size:12px} @media(max-width:450px){button{padding:8px 10px}.canvas{padding:8px}}
</style></head><body>
<div class="tools"><div class="buttons" role="group" aria-label="Artwork"><button data-art="vector" aria-pressed="true">Vector redraw</button><button data-art="original" aria-pressed="false">Original PNG</button></div><div class="buttons" role="group" aria-label="Background"><button data-bg="navy" aria-pressed="true">Navy</button><button data-bg="light" aria-pressed="false">Light</button><button data-bg="check" aria-pressed="false">Grid</button></div></div>
<div class="canvas" id="canvas"><div id="vector" class="art">{{SVG}}</div><div id="original" class="art original" hidden><img src="{{PNG}}" alt="Original base render used as the drawing reference"></div></div>
<p class="note">Editable SVG · transparent background · buildings, panels, tower, rover and crew grouped separately</p>
<script>
document.querySelectorAll('[data-art]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-art]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.art').forEach(x=>x.hidden=x.id!==b.dataset.art)}));
document.querySelectorAll('[data-bg]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-bg]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('canvas').className='canvas '+(b.dataset.bg==='navy'?'':b.dataset.bg)}));
</script></body></html>'''.replace('{{SVG}}', svg).replace('{{PNG}}', png_uri)
(HERE / 'review.html').write_text(html)
print('Wrote space-base.svg, space-base-without-crew.svg, review.html')

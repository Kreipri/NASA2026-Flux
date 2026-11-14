"""Build the opening-scenes mockup: inline the chibi SVGs as data URIs.

Run from anywhere:  python3 ideas/ui-mockups/scenes/build.py [--abs-photo OUT.html]
Writes ideas/ui-mockups/scenes-start-v1.html (photo linked relatively).
With --abs-photo, also writes a copy whose photo path is absolute (for local previews).
"""
import base64, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
MOCK = HERE.parent
CHAR = MOCK.parent / "character-designs" / "figma-export"

def uri(p: pathlib.Path) -> str:
    return "data:image/svg+xml;base64," + base64.b64encode(p.read_bytes()).decode()

tokens = {
    "{{BRAM}}": uri(CHAR / "crew" / "bram-clothes-role.svg"),
    "{{REMY}}": uri(CHAR / "crew" / "remy-clothes-role.svg"),
    "{{MICA}}": uri(CHAR / "mica" / "mica-monkey-clothes-role.svg"),
    "{{CMDR}}": uri(CHAR / "crew" / "commander-suit-visor.svg"),
    "{{CURIO}}": uri(CHAR / "curio" / "curio-wheel-feet-happy.svg"),
    "{{CURIO_FACE}}": uri(CHAR / "curio" / "faces" / "curio-face-happy.svg"),
}
src = (HERE / "scenes-start.src.html").read_text()
for k, v in tokens.items():
    src = src.replace(k, v)

out = MOCK / "scenes-start-v1.html"
out.write_text(src.replace("{{PHOTO}}", "assets/shackleton-oblique.jpg"))
print("wrote", out)

if "--abs-photo" in sys.argv:
    alt = pathlib.Path(sys.argv[sys.argv.index("--abs-photo") + 1])
    alt.write_text(src.replace("{{PHOTO}}", str(MOCK / "assets" / "shackleton-oblique.jpg")))
    print("wrote", alt)

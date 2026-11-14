"""Rebuild only this isolated gameplay layout study; never reads active flow files."""
from pathlib import Path
HERE = Path(__file__).resolve().parent
src = HERE / 'source'
html = (src / 'draft.html').read_text()
for key, name in [('BASELINE_CSS', 'baseline.snapshot.css'), ('SCENE', 'scene.snapshot.js'), ('ASSETS', 'assets.snapshot.js'), ('LAYOUT_CSS', 'layouts.css'), ('DRAFT_JS', 'layouts.js')]:
    html = html.replace('{{' + key + '}}', (src / name).read_text())
html = html.replace('{{JOBS}}', (src / 'jobs.snapshot.json').read_text())
assert '{{' not in html, 'Unresolved build token'
(HERE / 'index.html').write_text(html)
print('Wrote', HERE / 'index.html')

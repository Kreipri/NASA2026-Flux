// Title-screen panels: "Real NASA data" and "Settings". They used to fall through into the game; now they open a card.
const P = {
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  bug:'<path d="M8 8h8v8a4 4 0 0 1-8 0z"/><path d="M12 8V4M4 12h4M16 12h4M5 6l3 3M19 6l-3 3"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const SAVE_PREFIX = 'lunar-ridge.browser.';

export function mountPanels({ frame }) {
  const layer = document.createElement('section');
  layer.className = 'pn3'; layer.hidden = true; layer.setAttribute('aria-label', 'Panel');
  frame.append(layer);
  let kind = null, opener = null, confirmErase = false;

  const nasa = () => `<h2 id="pn-t">Real NASA data</h2><p class="pn-sub">What comes from NASA, and what the game made up.</p>
    <div class="e-cols"><section class="real"><h4>${ic('check')} Real</h4><ul><li>The Moon’s south pole and Shackleton Crater</li><li>Sunlight on the ridge, and Earth’s changing view</li><li>The storms: names and dates from NASA’s DONKI archive</li></ul></section>
    <section class="sim"><h4>Simulated</h4><ul><li>Every meter and job cost</li><li>Your ice chances</li><li>When events happen. Storms come closer together than in real life.</li></ul></section>
    <section class="story"><h4>✎ Story</h4><ul><li>The crew and Curio</li><li>The next crew</li><li>Biscuit’s note</li></ul></section></div>
    <ul class="pn-links"><li><a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noopener">NASA DONKI</a> · space-weather events</li><li><a href="https://visualization.osdr.nasa.gov/radlab/gui/data-api/" target="_blank" rel="noopener">NASA RadLab</a> · radiation measured near the Moon</li><li><a href="https://svs.gsfc.nasa.gov/11230" target="_blank" rel="noopener">NASA SVS</a> · cold, dark craters</li><li><a href="https://science.nasa.gov/earth/earth-observatory/collections/blue-marble/" target="_blank" rel="noopener">NASA Blue Marble</a> · the Earth picture</li></ul>`;

  const settings = () => {
    const full = !!document.fullscreenElement, dbg = document.documentElement.classList.contains('debug');
    return `<h2 id="pn-t">Settings</h2><p class="pn-sub">Only the things that work today.</p>
      <div class="pn-row"><span><b>Full screen</b><small>Also press F any time.</small></span><button class="pn-btn" data-pn="fs" aria-pressed="${full}">${ic('expand')}${full ? 'On' : 'Off'}</button></div>
      <div class="pn-row"><span><b>Debug tools</b><small>Screen list for testing. Also Shift + D.</small></span><button class="pn-btn" data-pn="debug" aria-pressed="${dbg}">${ic('bug')}${dbg ? 'On' : 'Off'}</button></div>
      <div class="pn-row"><span><b>Saved mission</b><small>${confirmErase ? 'This deletes your saved mission. Sure?' : 'Start again from week 1.'}</small></span>${confirmErase
        ? `<span class="pn-pair"><button class="pn-btn ghost" data-pn="keep">Keep it</button><button class="pn-btn danger" data-pn="erase">${ic('trash')}Yes, erase</button></span>`
        : `<button class="pn-btn ghost" data-pn="ask">${ic('trash')}Erase…</button>`}</div>`;
  };

  function paint(focusSel) {
    layer.innerHTML = `<div class="pn-scrim" data-pn="close"></div><div class="pn-card" role="dialog" aria-modal="true" aria-labelledby="pn-t"><button class="pn-x" data-pn="close" aria-label="Close">${ic('x')}</button>${kind === 'settings' ? settings() : nasa()}</div>`;
    (layer.querySelector(focusSel || '.pn-x'))?.focus({ preventScroll: true });
  }
  function open(which, from) {
    kind = which; opener = from || null; confirmErase = false; layer.hidden = false;
    for (const el of frame.children) if (el !== layer) el.inert = true;
    paint();
  }
  function close() {
    if (layer.hidden) return;
    layer.hidden = true; layer.innerHTML = ''; kind = null;
    for (const el of frame.children) el.inert = false;
    opener?.focus?.({ preventScroll: true });
  }
  layer.addEventListener('click', e => {
    const b = e.target.closest('[data-pn]'); if (!b) return;
    const a = b.dataset.pn;
    if (a === 'close') close();
    else if (a === 'fs') { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); } catch {} setTimeout(() => paint('[data-pn="fs"]'), 250); }
    else if (a === 'debug') { const on = document.documentElement.classList.toggle('debug'); try { localStorage.setItem('sbc-debug', on ? '1' : '0'); } catch {} paint('[data-pn="debug"]'); }
    else if (a === 'ask') { confirmErase = true; paint('[data-pn="keep"]'); }
    else if (a === 'keep') { confirmErase = false; paint('[data-pn="ask"]'); }
    else if (a === 'erase') { try { Object.keys(localStorage).filter(k => k.startsWith(SAVE_PREFIX)).forEach(k => localStorage.removeItem(k)); } catch {} location.reload(); }
  });
  layer.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
  return { open, close, isOpen: () => !layer.hidden };
}

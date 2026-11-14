// Builds src/data/storm-2024-05.json from the archived snapshots in data/samples/.
// Real data in, trimmed summary out. Nothing here is live.
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../data/samples/', import.meta.url);
const read = (f: string) => JSON.parse(readFileSync(new URL(f, dir), 'utf8'));

const flares = read('donki_FLR_2024-05-08_to_12.json')
  .filter((f: any) => f.classType.startsWith('X'))
  .map((f: any) => ({ peakTime: f.peakTime, classType: f.classType, link: f.link }));
const sep = read('donki_SEP_2024-05-08_to_14.json').map((s: any) => ({ eventTime: s.eventTime, link: s.link }));
const gst = read('donki_GST_2024-05-08_to_14.json').map((g: any) => ({
  startTime: g.startTime,
  maxKp: Math.max(...g.allKpIndex.map((k: any) => k.kpIndex)),
  link: g.link,
}));

// RadLab file is a pandas-style dict: {columns, index, data: [[timestamp, instrument, uGy/h, body]]}.
const rl = read('radlab_CRaTER_LRO_2024-05-08_to_14.json');
const rows: [string, string, number, string][] = rl.data;
// 12-hour windows (one game shift each), max hourly absorbed dose rate in uGy/h.
const windows: { start: string; maxDoseRate: number }[] = [];
for (const [ts, , v] of rows) {
  const d = new Date(ts + 'Z');
  d.setUTCMinutes(0, 0, 0);
  d.setUTCHours(d.getUTCHours() < 12 ? 0 : 12);
  const key = d.toISOString().slice(0, 13) + 'Z';
  const w = windows.find((x) => x.start === key);
  if (w) w.maxDoseRate = Math.max(w.maxDoseRate, v);
  else windows.push({ start: key, maxDoseRate: v });
}
windows.forEach((w) => (w.maxDoseRate = Math.round(w.maxDoseRate * 10) / 10));

const out = {
  _about: 'Trimmed from data/samples (archived 2026-11-14). ARCHIVE data, never present as live.',
  sources: {
    donki: 'NASA CCMC DONKI / Moon-to-Mars Space Weather Analysis Office',
    radlab: 'NASA OSDR RadLab (CRaTER, Lunar Reconnaissance Orbiter, lunar orbit, not surface)',
  },
  flaresX: flares,
  sep,
  gst,
  crater12h: windows,
};
writeFileSync(new URL('../src/data/storm-2024-05.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(windows.map((w) => `${w.start} ${w.maxDoseRate}`).join('\n'));

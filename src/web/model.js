// Browser session adapter. The shared deterministic engine owns every resolved number.
// A week now plays out job by job: each job runs when chosen, spends crew time, and shows its result.
import { newGame, closeWeek, newWeek, weekAlert, jobBlocked, jobPrompt, runJob, chooseOption, actionDef, powerCost, blocksToday, env, stormActive, iceChance } from '../engine/engine.ts';
import moon from '../config/moon.json' with { type: 'json' };
export const SAVE_VERSION = 2;
export const SCENARIOS = ['weeks7', 'solarMax'];
const METERS = ['power', 'o2', 'dose', 'stamina'];
const snapshot = state => ({ turn: state.turn, ...Object.fromEntries(METERS.map(k => [k, state[k]])) });
// Start a week: remember the starting meters (for the recap) and open with this week's alert, if there is one.
function beginWeek(state) {
  const week = newWeek(state), alert = weekAlert(state);
  week.start = snapshot(state);
  week.prompt = alert ? { type: 'alert', alert } : null;
  return week;
}
export function createMission(scenario = 'weeks7', seed = 42) {
  const state = newGame(scenario, seed);
  return { version: SAVE_VERSION, state, week: beginWeek(state), result: null, log: [], before: null, recap: false, tutorial: scenario === 'weeks7' };
}
export const timeLeft = mission => mission.week ? mission.week.blocks - mission.week.used : 0;
export const jobsDone = (mission, id) => mission.week ? mission.week.ids.filter(k => k === id).length : 0;
/** Why a job can't be done right now (null if it can). */
export function jobStatus(mission, id) {
  if (!mission.week) return 'Finish this week first.';
  if (mission.week.prompt) return 'Answer the alert first.';
  return jobBlocked(mission.state, mission.week, id);
}
const lineText = t => t.replace(/\s*\[[^\]]*\]\s*$/, '').trim();
const diffOf = (a, b) => Object.fromEntries(METERS.map(k => [k, Math.round(b[k]) - Math.round(a[k])]));
function finishJob(mission, id, after, week, log) {
  const before = mission.state;
  return { mission: { ...mission, state: after, week, result: { id, lines: log.map(lineText).filter(Boolean), diff: diffOf(before, after) } } };
}
/** Do one job now. May stop first with a decision (rover trip) that `choose` answers. */
export function doJob(mission, id) {
  const error = jobStatus(mission, id);
  if (error) return { error };
  const { state, week } = mission, ask = jobPrompt(state, week, id);
  if (ask) return { mission: { ...mission, week: { ...week, prompt: { type: ask, job: id } } } };
  const r = runJob(state, week, id);
  return finishJob(mission, id, r.state, r.week, r.log);
}
/** Answer the open decision. If it was holding a job, that job runs now. */
export function choose(mission, choice) {
  const { state, week } = mission, prompt = week?.prompt;
  if (!prompt) return { error: 'There is nothing to decide right now.' };
  const c = chooseOption(state, { ...week, prompt: null }, choice);
  const next = { ...mission, state: c.state, week: c.week, result: null };
  if (!prompt.job) return { mission: next };
  const r = runJob(c.state, c.week, prompt.job);
  return finishJob(next, prompt.job, r.state, r.week, [...c.log, ...r.log]);
}
/** Close the week: sunlight, breathing, rest and hazards happen, then the recap shows. */
export function endWeek(mission) {
  const { state, week } = mission;
  if (!week || mission.recap || state.ended) return { error: 'This week is already complete.' };
  if (week.prompt) return { error: 'Answer the alert first.' };
  if (!week.ids.length) return { error: 'Do at least one job first.' };
  const c = closeWeek(state, week);
  return { mission: { ...mission, state: c.state, week: null, result: null, log: [...week.log, ...c.log], before: week.start, recap: true } };
}
/** After the recap: open the next week. */
export function nextWeek(mission) {
  if (!mission.recap || mission.state.ended) return mission;
  return { ...mission, week: beginWeek(mission.state), recap: false, before: null, result: null, tutorial: false };
}
/** Debug: play week 1 with a fixed sensible plan and land on the start of week 2. */
export function skipToWeek2(mission) {
  let m = { ...mission, tutorial: false };
  if (m.recap) return nextWeek(m);
  if (m.state.turn > 0 || !m.week) return m;
  if (m.week.prompt) m = choose(m, 'later').mission;
  for (const id of ['logsun', 'air', 'rest']) { const r = doJob(m, id); if (r.mission) m = r.mission; }
  const ended = endWeek(m);
  return ended.mission ? nextWeek(ended.mission) : m;
}
// How a single job would change the meters, shown before you commit to it.
export function jobPreview(mission, id) {
  const j = actionDef(id), state = mission.state, e = env(state);
  const stamina = j.blocks * (j.outside ? moon.stamina.outsideBlock : moon.stamina.insideBlock) + (j.stamina || 0);
  const chance = id === 'rover' ? Math.round(iceChance(state) * 100) : null;
  return { job: j, power: powerCost(state, id), stamina, dose: stormActive(e) ? 0 : j.dose, chance };
}
export function previewJob(mission, id) {
  const p = structuredClone(mission.state), q = jobPreview(mission, id);
  p.power += q.power; p.o2 += q.job.o2; p.dose += q.dose; p.stamina += q.stamina;
  for (const key of METERS) p[key] = Math.max(0, Math.min(100, p[key]));
  return p;
}
export function environmentTitle(state) {
  const e = env(state);
  if (state.emergency) return 'Batteries empty';
  if (stormActive(e)) return e.storm === 'strong' ? 'Strong particle storm' : 'Particle storm';
  if (e.storm === 'warning') return 'Solar flare alert';
  if (e.sun === 'dark') return 'Long shadow';
  if (e.eclipse === 'short') return 'Short eclipse';
  return 'Sunlight on the ridge';
}
export function alertCard(mission) {
  const prompt = mission.week?.prompt;
  if (!prompt) return null;
  const options = (a, b) => [a, b];
  if (prompt.type === 'trip') return { title: 'Particles are arriving', body: 'The rover is about to leave. What should the crew do?',
    options: options(['back', 'Turn back', `No sample. Power ${moon.trip.backPower}, air ${moon.trip.backO2}.`], ['finish', 'Go anyway', 'Full trip costs and storm exposure. A sample is uncertain.']) };
  if (prompt.type === 'sample') return { title: 'A closer look at the crater?', body: 'The rover crew could try a little longer.', options: options(['sample', 'Try a little longer', 'Extra power −10, energy −5; ice chance improves.'], ['finish', 'Just the normal trip', 'Keep the normal cost and ice chance.']) };
  switch (prompt.alert) {
    case 'dust': return { title: 'Dust on the panels', body: 'Dust can block sunlight. Choose when to deal with it.', options: options(['clean', 'Clean now', 'Clear the dust before this week’s charging.'], ['later', 'Keep going', 'Dust stays until you do a Clean the solar panels job.']) };
    case 'storm': return { title: 'Radiation alarm', body: 'The alarm needs a decision. Outside jobs still add exposure.', options: options(['shelter', 'Shelter for the peak', 'Use the shielded room for the worst hours.'], ['continue', 'Keep working', 'Only a Take shelter job protects the crew.']) };
    case 'shadow': case 'eclipse': return { title: prompt.alert === 'shadow' ? 'The ridge is in shadow' : 'The Sun is hidden', body: 'The panels will make less power. What is your plan?', options: options(['save', 'Turn power down', `Save ${moon.perDay.upkeepPower - moon.perDay.powerSaveUpkeep} power; crew energy ${moon.stamina.powerSaveCold}.`], ['carry', 'Keep normal power', 'Use more battery power; keep the heaters up.']) };
  }
}
export function readSaved(raw) {
  try {
    const m = JSON.parse(raw), s = m.state;
    if (m.version !== SAVE_VERSION || !SCENARIOS.includes(s.scenario) || !Number.isInteger(s.seed) || !Number.isInteger(s.turn) || s.turn < 0 || s.turn > 7) return null;
    // Meters can sit slightly outside 0-100 while a week is in progress; they are clamped when the week closes.
    if (!METERS.every(k => Number.isFinite(s[k]) && s[k] >= -200 && s[k] <= 300)) return null;
    if (!Array.isArray(s.timeline) || s.timeline.length !== 7 || !s.evidence || !s.faults || !Array.isArray(s.history) || !Array.isArray(s.keyMoments)) return null;
    if (!Array.isArray(m.log) || !m.log.every(t => typeof t === 'string')) return null;
    if (s.ended && !['complete', 'oxygen', 'dose'].includes(s.ended.reason)) return null;
    if (m.recap && !m.before) return null;
    if (m.recap || s.ended) { m.week = null; }
    else {
      const w = m.week;
      if (!w || !Number.isInteger(w.blocks) || !Number.isInteger(w.used) || w.used < 0 || w.used > w.blocks) return null;
      if (!Array.isArray(w.ids) || !w.ids.every(id => moon.actions.some(j => j.id === id))) return null;
      if (!Array.isArray(w.log) || !w.log.every(t => typeof t === 'string') || !w.start) return null;
      if (w.prompt && !['alert', 'sample', 'trip'].includes(w.prompt.type)) return null;
    }
    m.result = null;
    m.tutorial = m.tutorial === true && s.turn === 0 && !s.ended;
    return m;
  } catch { return null; }
}
export { blocksToday };

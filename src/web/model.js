// Browser session adapter. The shared deterministic engine owns every resolved number.
import { newGame, step, validate, actionDef, powerCost, blocksToday, env, stormActive, iceChance } from '../engine/engine.ts';
import moon from '../config/moon.json' with { type: 'json' };
export const SAVE_VERSION = 1;
export const SCENARIOS = ['weeks7', 'solarMax'];
export function createMission(scenario = 'weeks7', seed = 42) {
  return { version: SAVE_VERSION, state: newGame(scenario, seed), plan: [], log: [], before: null, recap: false };
}
export const usedTime = (plan) => plan.reduce((n, id) => n + actionDef(id).blocks, 0);
export function planError(mission, plan) { return plan.length ? validate(mission.state, plan) : null; }
export function addJob(mission, id) {
  if (mission.state.pending || mission.state.ended || !moon.actions.some(j => j.id === id)) return { error: 'Finish this week first.' };
  const plan = [...mission.plan, id], error = planError(mission, plan);
  return error ? { error } : { mission: { ...mission, plan } };
}
export function removeJob(mission, index) {
  const plan = mission.plan.filter((_, i) => i !== index), error = planError(mission, plan);
  return error ? { error } : { mission: { ...mission, plan } };
}
export function resolveWeek(mission, choice) {
  if (mission.recap || mission.state.ended) return { error: 'This week is already complete.' };
  const before = mission.state;
  const ids = before.pending?.actions || mission.plan;
  const result = step(before, ids, choice);
  if (result.log[0]?.startsWith('! ')) return { error: result.log[0].slice(2) };
  return { mission: { ...mission, state: result.state, log: result.log, before: result.state.pending ? null : before,
    recap: !result.state.pending, plan: result.state.pending ? [...ids] : [] } };
}
export function previewJobs(mission) {
  const { state, plan } = mission, p = structuredClone(state);
  for (const id of plan) {
    const j = actionDef(id);
    p.power += powerCost(p, id); p.o2 += j.o2; p.dose += j.dose;
    p.stamina += j.blocks * (j.outside ? moon.stamina.outsideBlock : moon.stamina.insideBlock) + (j.stamina || 0);
    if (id === 'scout') p.scoutBonus = Math.min(moon.ice.maxChance - moon.ice.baseChance, p.scoutBonus + moon.ice.scoutBonus);
    if (id === 'rover') p.scoutBonus = 0;
  }
  for (const key of ['power', 'o2', 'dose', 'stamina']) p[key] = Math.max(0, Math.min(100, p[key]));
  return p;
}
export function jobPreview(mission, id) {
  const j = actionDef(id), p = previewJobs(mission);
  return { job: j, power: powerCost(mission.state, id), stamina: j.blocks * (j.outside ? moon.stamina.outsideBlock : moon.stamina.insideBlock) + (j.stamina || 0),
    chance: id === 'rover' ? Math.round(iceChance(p) * 100) : null };
}
export function environmentTitle(state) {
  const e = env(state);
  if (state.emergency) return 'Batteries empty';
  if (stormActive(e)) return e.storm === 'strong' ? 'Strong particle storm' : 'Particle storm';
  if (e.storm === 'warning') return 'Solar flare alert';
  if (e.sun === 'dark') return 'Long shadow';
  if (e.eclipse === 'short') return 'Short eclipse';
  return 'Sunlit ridge';
}
export function alertCard(mission) {
  const pending = mission.state.pending;
  if (!pending) return null;
  const options = (a, b) => [a, b];
  if (pending.type === 'tripChoice') return { title: 'The rover is outside', body: 'Particles are arriving. What should the crew do?',
    options: options(['back', 'Turn back', `No sample. Power ${moon.trip.backPower}, air ${moon.trip.backO2}.`], ['finish', 'Finish the trip', 'Full trip costs and storm exposure. A sample is uncertain.']) };
  switch (pending.alert) {
    case 'dust': return { title: 'Dust on the panels', body: 'Dust can block sunlight. Choose when to deal with it.', options: options(['clean', 'Clean now', 'Clear the dust before this week’s charging.'], ['later', 'Keep the plan', 'Dust stays until a cleaning job clears it.']) };
    case 'storm': return { title: 'Radiation alarm', body: 'The alarm needs a decision. Outside jobs still add exposure.', options: options(['shelter', 'Shelter for the peak', 'Use the shielded room between your planned jobs.'], ['continue', 'Follow my plan', 'Only a planned shelter job protects the crew.']) };
    case 'shadow': case 'eclipse': return { title: pending.alert === 'shadow' ? 'The ridge is in shadow' : 'The Sun is hidden', body: 'The panels will make less power. What is your plan?', options: options(['save', 'Turn power down', `Save ${moon.perDay.upkeepPower - moon.perDay.powerSaveUpkeep} power; crew energy ${moon.stamina.powerSaveCold}.`], ['carry', 'Keep normal power', 'Use more battery power; keep the heaters up.']) };
    case 'sample': return { title: 'A closer look at the crater?', body: 'The rover crew could try a little longer.', options: options(['sample', 'Try a little longer', 'Extra power −10, energy −5; ice chance improves.'], ['finish', 'Finish the planned trip', 'Keep the normal cost and ice chance.']) };
  }
}
export function readSaved(raw) {
  try {
    const m = JSON.parse(raw), s = m.state;
    if (m.version !== SAVE_VERSION || !SCENARIOS.includes(s.scenario) || !Number.isInteger(s.seed) || !Number.isInteger(s.turn) || s.turn < 0 || s.turn > 7) return null;
    if (!['power', 'o2', 'dose', 'stamina'].every(k => Number.isFinite(s[k]) && s[k] >= 0 && s[k] <= 100)) return null;
    if (!Array.isArray(s.timeline) || s.timeline.length !== 7 || !s.evidence || !s.faults || !Array.isArray(s.history) || !Array.isArray(s.keyMoments)) return null;
    if (!Array.isArray(m.plan) || !m.plan.every(id => moon.actions.some(j => j.id === id))) return null;
    if (!Array.isArray(m.log) || !m.log.every(t => typeof t === 'string')) return null;
    if (s.pending && (!['alertChoice', 'tripChoice'].includes(s.pending.type) || JSON.stringify(s.pending.actions) !== JSON.stringify(m.plan))) return null;
    if (s.ended && !['complete', 'oxygen', 'dose'].includes(s.ended.reason)) return null;
    if (!s.ended && planError(m, m.plan)) return null;
    if (m.recap && !m.before) return null;
    // Preserve active older missions while retiring their former supply controls.
    delete m.meal;
    delete s.food;
    if (m.before) delete m.before.food;
    return m;
  } catch { return null; }
}
export { blocksToday };

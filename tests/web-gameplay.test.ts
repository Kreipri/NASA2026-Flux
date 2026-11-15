import test from 'node:test';
import assert from 'node:assert/strict';
import { createMission, doJob, choose, endWeek, nextWeek, skipToWeek2, jobStatus, timeLeft, previewJob, readSaved, alertCard } from '../src/web/model.js';
import { step, env, stormActive, menu } from '../src/engine/engine.ts';

const json = (x: unknown) => JSON.parse(JSON.stringify(x));
/** Answer the week's opening alert (week 1 opens with a dust decision). */
const settle = (m: any, choice?: string) => m.week?.prompt ? choose(m, choice ?? alertCard(m).options[0][0]).mission : m;
/** Week 1 with its dust alert answered, ready for jobs. */
const ready = (scenario = 'weeks7', seed = 42) => settle(createMission(scenario, seed), 'later');

test('a job runs the moment you choose it, spends crew time, and never mutates the previous mission', () => {
  const start = ready(), snapshot = structuredClone(start);
  assert.equal(timeLeft(start), 8);
  const r = doJob(start, 'logsun');
  assert.deepEqual(start, snapshot);
  const m = r.mission;
  assert.equal(timeLeft(m), 7);
  assert.equal(m.state.turn, 0);                         // the week is still open
  assert.equal(m.state.power, start.state.power - 2);    // the job's cost is already paid
  assert.equal(m.state.evidence.sunLogs, 1);
  assert.equal(m.result.id, 'logsun');
  assert.equal(m.result.diff.power, -2);
  assert.ok(m.result.lines.length > 0 && m.result.lines.every((t: string) => !/\[[A-Z ]+\]$/.test(t)));
  const second = doJob(m, 'air').mission;
  assert.equal(timeLeft(second), 6);
  assert.equal(second.state.o2, m.state.o2 + 30);
});
test('the week opens with its alert; no job can start until it is answered', () => {
  const m = createMission('weeks7', 42);
  assert.equal(alertCard(m).title, 'Dust on the panels');
  assert.match(jobStatus(m, 'logsun'), /alert/i);
  assert.ok(doJob(m, 'logsun').error);
  assert.ok(endWeek(m).error);
  const after = choose(m, 'clean').mission;
  assert.equal(after.week.prompt, null);
  assert.equal(after.state.dust, 0);
  assert.ok(doJob(after, 'logsun').mission);
  assert.ok(choose(after, 'later').error);               // nothing left to decide
});
test('crew time, heavy-job repeats, availability and ending rules use the engine', () => {
  let m = ready();
  m = doJob(m, 'rover').mission;
  assert.match(jobStatus(m, 'rover'), /once/);
  assert.equal(jobStatus(m, 'regolith'), null);           // 4 time left, heavy job fits exactly
  assert.match(jobStatus(doJob(m, 'air').mission, 'regolith'), /not enough time/);
  assert.equal(jobStatus(m, 'repair'), 'nothing broken');
  assert.ok(doJob(m, 'repair').error);
  assert.match(jobStatus(m, 'powersave'), /available/);   // cut from the seven-week mission
  assert.match(jobStatus(m, 'call'), /available/);
  assert.match(jobStatus(ready('solarMax'), 'call'), /available/);
  assert.ok(endWeek(ready()).error);                      // at least one job first
  const spent = doJob(doJob(doJob(m, 'air').mission, 'rest').mission, 'logsun').mission;
  assert.equal(timeLeft(spent), 0);
  assert.match(jobStatus(spent, 'air'), /time/);
});
test('playing a week job by job equals the engine resolving the same plan at once', () => {
  for (const scenario of ['weeks7', 'solarMax']) for (const seed of [1, 42, 107]) {
    let m = createMission(scenario, seed);
    while (!m.state.ended) {
      const before = structuredClone(m.state);
      m = settle(m);
      const s = m.state, e = env(s), jobs: string[] = [];
      if (stormActive(e)) jobs.push('shelter', 'measure');
      if (s.o2 < 55) jobs.push('air');
      if (s.faults.panel || s.faults.scrubber) jobs.push('repair');
      jobs.push('logsun', 'rover', 'rest');
      for (const id of jobs) {
        const r = doJob(m, id);
        if (r.error) continue;
        m = r.mission;
        if (m.week.prompt) m = choose(m, alertCard(m).options[0][0]).mission;
      }
      const ids = [...m.week.ids], choice = m.week.choice ?? undefined;
      const expected = step(before, ids as any, choice as any).state;
      m = endWeek(m).mission;
      assert.ok(m.recap && m.week === null);
      assert.deepEqual(json(m.state), json(expected));
      assert.equal(m.state.turn, before.turn + 1);
      assert.deepEqual(m.state.timeline.map((x: any) => x.link), [true, true, false, false, true, true, false]);
      m = readSaved(JSON.stringify(m));
      assert.ok(m);
      if (!m.state.ended) m = nextWeek(m);
    }
    assert.equal(m.state.turn, 7);
    assert.equal(m.state.ended.reason, 'complete');
  }
});
test('a week saved halfway reloads with its jobs and time, then closes once', () => {
  let m = ready();
  m = doJob(m, 'logsun').mission;
  m = doJob(m, 'air').mission;
  const restored = readSaved(JSON.stringify(m));
  assert.ok(restored);
  assert.equal(timeLeft(restored), 6);
  assert.deepEqual(restored.week.ids, ['logsun', 'air']);
  assert.equal(restored.result, null);
  const closed = endWeek(restored).mission;
  assert.ok(closed.recap);
  assert.equal(closed.before.turn, 0);
  assert.ok(endWeek(closed).error);
  assert.ok(readSaved(JSON.stringify(closed)));
  const next = nextWeek(closed);
  assert.equal(next.week.used, 0);
  assert.equal(next.state.turn, 1);
});
test('invalid or older saves are rejected and failed actions preserve the mission', () => {
  assert.equal(readSaved('garbage'), null);
  const m = createMission();
  const bad = structuredClone(m);
  bad.state.o2 = null;
  assert.equal(readSaved(JSON.stringify(bad)), null);
  const badJob = structuredClone(m);
  badJob.week.ids = ['not-a-job'];
  assert.equal(readSaved(JSON.stringify(badJob)), null);
  const old = structuredClone(m);
  old.version = 1;
  assert.equal(readSaved(JSON.stringify(old)), null);
  assert.ok(doJob(m, 'logsun').error);
  assert.equal(m.state.turn, 0);
});
test('failure and emergency are distinct: no game-over solely for empty power', () => {
  let m = doJob(ready(), 'rest').mission;
  m.state.o2 = 1;
  m = endWeek(m).mission;
  assert.equal(m.state.ended.reason, 'oxygen');
  m = doJob(ready(), 'rest').mission;
  m.state.dose = 99;
  m = endWeek(m).mission;
  assert.equal(m.state.ended.reason, 'dose');
  m = doJob(ready(), 'rover').mission;
  m.state.power = 1; m.state.timeline[0].sun = 'dark';
  m = endWeek(m).mission;
  assert.equal(m.state.power, 0);
  assert.equal(m.state.emergency, true);
  assert.equal(m.state.ended, null);
  assert.ok(menu(m.state).find((x) => x.def.id === 'rest' && !x.blocked));
});
test('the crater decision waits for the rover job, applies its trade-off once and matches the engine', () => {
  let m = createMission('weeks7', 42);
  m.state.turn = 5; m.state.power = 80;
  m.week.prompt = null;
  const initial = structuredClone(m.state);
  m = doJob(m, 'scout').mission;
  const asked = doJob(m, 'rover').mission;
  assert.equal(asked.week.prompt.type, 'sample');
  assert.equal(asked.week.used, m.week.used);             // nothing ran yet
  assert.equal(alertCard(asked).options.length, 2);
  const normal = choose(asked, 'finish').mission;
  const extra = choose(asked, 'sample').mission;
  assert.equal(normal.state.power - extra.state.power, 10);
  assert.equal(normal.state.stamina - extra.state.stamina, 5);
  assert.equal(extra.state.evidence.trips, 1);
  assert.equal(extra.result.id, 'rover');
  assert.deepEqual(json(endWeek(extra).mission.state), json(step(initial, ['scout', 'rover'], 'sample').state));
});
test('previewing one job leaves the mission alone and reports its meter changes', () => {
  const m = ready(), snapshot = structuredClone(m);
  const p = previewJob(m, 'rover');
  assert.deepEqual(m, snapshot);
  assert.equal(p.power, m.state.power - 50);
  assert.ok(p.stamina < m.state.stamina);
});
test('week 1 is a tutorial in the seven-week mission only; the debug skip lands on week 2', () => {
  assert.equal(createMission('weeks7', 42).tutorial, true);
  assert.equal(createMission('solarMax', 42).tutorial, false);
  const initial = createMission('weeks7', 42);
  const skipped = skipToWeek2(initial);
  assert.equal(skipped.tutorial, false);
  assert.equal(skipped.state.turn, 1);
  assert.equal(skipped.week.used, 0);
  assert.equal(skipped.recap, false);
  assert.deepEqual(json(skipped.state), json(step(initial.state, ['logsun', 'air', 'rest'] as any, 'later' as any).state));
  assert.equal(skipToWeek2(skipped).state.turn, 1);        // later weeks are left alone
  const saved = readSaved(JSON.stringify(createMission('weeks7', 42)));
  assert.equal(saved.tutorial, true);
  const done = readSaved(JSON.stringify(nextWeek(endWeek(doJob(ready(), 'logsun').mission).mission)));
  assert.equal(done.tutorial, false);
});

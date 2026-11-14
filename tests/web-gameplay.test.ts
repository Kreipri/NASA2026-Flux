import test from 'node:test';
import assert from 'node:assert/strict';
import { createMission, addJob, removeJob, resolveWeek, previewJobs, readSaved, alertCard } from '../src/web/model.js';
import { step, env, stormActive, menu } from '../src/engine/engine.ts';

test('planning is reversible and does not mutate engine state or RNG', () => {
  const start=createMission('weeks7',42),before=structuredClone(start.state);
  const added=addJob(start,'rover').mission;
  assert.deepEqual(start.state,before);
  assert.equal(previewJobs(added).power,10);
  assert.equal(previewJobs(added).stamina,56);
  assert.deepEqual(removeJob(added,0).mission,start);
  assert.deepEqual(added.state,before);
});
test('crew time, instrument order, heavy-job duplicates and mode limits use engine validation', () => {
  let m=createMission();
  m=addJob(m,'rover').mission;
  assert.match(addJob(m,'rover').error,/once/);
  m=addJob(m,'regolith').mission;
  assert.match(addJob(m,'air').error,/crew time/);
  m=addJob(createMission(),'powersave').mission;
  assert.match(addJob(m,'measure').error,/Power-saving/);
  assert.match(addJob(createMission(),'call').error,/available/);
  assert.ok(addJob(createMission('solarMax'),'call').mission);
});
test('alert reload preserves jobs, resolves once, and matches shared engine exactly', () => {
  const initial=createMission('weeks7',42);
  let m=addJob(initial,'logsun').mission;
  const pending=resolveWeek(m).mission;
  assert.equal(pending.state.turn,0);
  assert.equal('food' in pending.state,false);
  assert.equal(pending.state.pending.alert,'dust');
  const restored=readSaved(JSON.stringify(pending));
  assert.ok(restored);
  const result=resolveWeek(restored,'later').mission;
  const expected=step(initial.state,['logsun'],'later');
  assert.deepEqual(JSON.parse(JSON.stringify(result.state)),JSON.parse(JSON.stringify(expected.state)));
  assert.deepEqual(result.log,expected.log);
  assert.equal('food' in result.state,false);
  assert.ok(result.recap);
  assert.ok(resolveWeek(result).error);
  assert.ok(readSaved(JSON.stringify(result)));
});
test('all seven weeks, Earth blackouts and final report survive save/restore in both modes', () => {
  for(const scenario of ['weeks7','solarMax'])for(const seed of [1,42,107]){
    let m=createMission(scenario,seed);
    while(!m.state.ended){
      const s=m.state,e=env(s),jobs=[];
      if(stormActive(e))jobs.push('shelter','measure');
      if(s.o2<55)jobs.push('air');
      if(s.faults.panel||s.faults.scrubber)jobs.push('repair');
      jobs.push('logsun','rest');
      for(const id of jobs){const next=addJob(m,id);if(next.mission)m=next.mission;}
      const before=structuredClone(m.state),plan=[...m.plan];
      m=resolveWeek(m).mission;
      let choice;
      if(m.state.pending){choice=alertCard(m).options[0][0];m=resolveWeek(m,choice).mission;}
      assert.deepEqual(m.state,step(before,plan,choice).state);
      assert.deepEqual(m.state.timeline.map(e=>e.link),[true,true,false,false,true,true,false]);
      assert.equal(m.state.turn,before.turn+1);
      m=readSaved(JSON.stringify(m));assert.ok(m);
      if(!m.state.ended)m={...m,recap:false,before:null};
    }
    assert.equal(m.state.turn,7);
    assert.equal(m.state.ended.reason,'complete');
  }
});
test('invalid saves are rejected and failed actions preserve the mission', () => {
  assert.equal(readSaved('garbage'),null);
  const m=createMission();
  const bad=structuredClone(m);bad.state.o2=null;
  assert.equal(readSaved(JSON.stringify(bad)),null);
  bad.state.o2=70;bad.plan=['not-a-job'];
  assert.equal(readSaved(JSON.stringify(bad)),null);
  assert.ok(resolveWeek(m).error);
  assert.equal(m.state.turn,0);
});
test('active older saves discard retired supply controls without losing progress', () => {
  const old=createMission();
  old.state.food=0;
  old.meal='full';
  const restored=readSaved(JSON.stringify(old));
  assert.ok(restored);
  assert.equal('food' in restored.state,false);
  assert.equal('meal' in restored,false);
  const planned=addJob(restored,'rest').mission;
  const resolved=resolveWeek(planned,'later').mission;
  assert.equal(resolved.state.ended,null);
  assert.equal(resolved.state.turn,1);
});
test('failure and emergency are distinct: no game-over solely for empty power', () => {
  let m=addJob(createMission(),'rest').mission;
  m.state.o2=1;
  m=resolveWeek(m,'later').mission;
  assert.equal(m.state.ended.reason,'oxygen');
  m=addJob(createMission(),'rest').mission;
  m.state.dose=99;
  m=resolveWeek(m,'later').mission;
  assert.equal(m.state.ended.reason,'dose');
  m=addJob(createMission(),'rover').mission;
  m.state.power=1;m.state.timeline[0].sun='dark';
  m=resolveWeek(m,'later').mission;
  assert.equal(m.state.power,0);
  assert.equal(m.state.emergency,true);
  assert.equal(m.state.ended,null);
  assert.ok(menu(m.state).find(x=>x.def.id==='rest'&&!x.blocked));
});

test('crater alert keeps normal trip costs and applies the extra-sample trade-off once', () => {
  let initial=createMission('weeks7',42);
  initial.state.turn=5;
  initial.state.power=80;
  initial=addJob(initial,'scout').mission;
  initial=addJob(initial,'rover').mission;
  const pending=resolveWeek(initial).mission;
  assert.equal(pending.state.pending.alert,'sample');
  const normal=resolveWeek(pending,'finish').mission;
  const extra=resolveWeek(pending,'sample').mission;
  assert.equal(normal.state.power-extra.state.power,10);
  assert.equal(normal.state.stamina-extra.state.stamina,5);
  assert.equal(extra.state.evidence.trips,1);
  assert.ok(resolveWeek(extra,'sample').error);
  assert.deepEqual(extra.state,step(initial.state,initial.plan,'sample').state);
});

// Pre-written Mission Control lines (offline fallback, D-004). Crew and story are FICTION.
import { env, stormActive, dayShift, totalTurns, type State } from '../engine/engine.ts';
import storm from '../data/storm-2024-05.json' with { type: 'json' };

const nextLongShadow = (s: State, within: number) => {
  for (let k = 1; k <= within; k++) if (s.timeline[s.turn + k]?.eclipse === 'long') return k;
  return null;
};

export function missionControl(s: State): string[] {
  const e = env(s);
  const L: string[] = [];
  if (s.turn === 0) {
    L.push('Welcome to the ridge. The Sun barely moves here, so your panels get light most of the time.');
    L.push('But the craters nearby are dark and freezing. Your crew has time for 2 jobs each shift.');
    L.push('Every job costs something. Watch your meters!');
  }
  if (e.storm === 'warning') {
    if (!e.link) L.push('(Earth link is down. No word from Mission Control.)');
    else if (e.stormSource === 'archive') {
      const f = storm.flaresX.find((x) => x.peakTime.startsWith('2024-05-09T09'))!;
      L.push(`ALERT: The Sun just had a big flare (class ${f.classType}). Particles may arrive in the next shifts.`);
      L.push('Shelter, or keep working? A rover trip now could get caught outside.');
      L.push(`[✓ NASA DONKI · ARCHIVE May 2024] Real flare, peak ${f.peakTime.replace('T', ' ')}.`);
    } else {
      L.push('ALERT: Forecasters saw a flare. Particles may arrive soon. [~ SIMULATED event]');
    }
  } else if (stormActive(e)) {
    if (!e.link && e.stormOnset) L.push('BEEP BEEP: ONBOARD RADIATION ALARM! No word from Earth, but your own sensor says particles are here. Your call, commander.');
    else if (e.stormOnset) L.push('Particles are arriving now. Get the crew to the most shielded spot!');
    else L.push(e.storm === 'strong' ? 'The storm is STRONG right now. Stay shielded.' : 'The particle storm is still building.');
    if (e.stormSource === 'archive') L.push('[✓ NASA DONKI · ARCHIVE May 2024] Real solar particle event, replayed (shortened for the game).');
    else L.push('[~ SIMULATED storm]');
  }
  const k = nextLongShadow(s, 6);
  if (k && e.eclipse === 'none') L.push(`Heads-up: the ridge goes dark in ${k} shift${k > 1 ? 's' : ''} (the Sun dips behind hills). Charge the batteries first! Eclipses are easy to predict; solar storms are not.`);
  if (e.eclipse === 'long') L.push('You are in the long shadow. No sunlight for the panels. Save power.');
  if (e.eclipse === 'short') L.push('A short eclipse: the Sun is behind a hill this shift.');
  if (!e.link && e.storm === 'none') L.push('Earth link is down: the ridge cannot see Earth right now. No calls or reports.');
  if (s.emergency) L.push('POWER EMERGENCY. Shelter, rest or repair until the Sun charges you back up.');
  if (s.o2 <= 25) L.push('Oxygen is LOW. Tune the air system soon.');
  if (s.dose >= 75) L.push('Your dose plan is nearly used up. Avoid going outside.');
  if (s.power <= 20 && !s.emergency) L.push('Power is low.');
  if (s.dust >= 2 && e.sun && !L.length) L.push('Dust is stealing your sunlight. Cleaning panels gets it back.');
  if (s.turn === totalTurns(s) - 1) L.push('Last shift! Make it count.');
  if (!L.length) L.push(['Steady shift. What is the plan, commander?', 'All quiet on the ridge.', 'The ice will not find itself!'][s.turn % 3]);
  const { day } = dayShift(s);
  void day;
  return L;
}

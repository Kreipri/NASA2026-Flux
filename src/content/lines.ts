// Pre-written Mission Control lines (offline fallback, D-004). Crew and story are FICTION.
import { env, stormActive, totalDays, daysUntilSun, daysUntilLink, daysUntilLinkLoss, scenarioOf, type State } from '../engine/engine.ts';
import storm from '../data/storm-2024-05.json' with { type: 'json' };

const nextLongShadow = (s: State, within: number) => {
  for (let k = 1; k <= within; k++) if (s.timeline[s.turn + k]?.eclipse === 'long') return k;
  return null;
};

export function missionControl(s: State): string[] {
  const e = env(s);
  const L: string[] = [];
  const unit = scenarioOf(s).turnUnit === 'week' ? 'week' : 'day';
  if (s.turn === 0) {
    const w = scenarioOf(s).win;
    const unit = scenarioOf(s).turnUnit === 'week' ? 'weeks' : 'days';
    L.push(`Welcome to the ridge, Commander. NASA is studying places near the south pole for a Moon base, and this ridge is one of them. You have ${totalDays(s)} ${unit} to find out if it really works.`);
    L.push(`Answer 4 questions for the SITE REPORT CARD: Is there enough LIGHT? Can we track RADIATION? Can we SHELTER from storms? Is there ICE nearby? Get ${w.minStars}+ stars, at least ${w.minEach} on every question, and bring the whole crew home healthy: SITE APPROVED.`);
    L.push(`You lead a crew of 4. Each astronaut works a morning and an afternoon: 8 crew-time blocks per ${unit}. Big jobs take more. Outside jobs use astronauts in pairs and tire them out.`);
  }
  if (e.storm === 'warning') {
    if (!e.link) L.push('(Earth is below the horizon. No word from Mission Control.)');
    else if (e.stormSource === 'archive') {
      const f = e.realDay ? storm.flaresX.filter((x) => x.peakTime.startsWith(e.realDay!)).at(-1) : undefined;
      L.push(f ? `ALERT: The Sun just had a big flare (class ${f.classType}). Particles may arrive tomorrow.` : 'ALERT: The Sun flared, but particles may not follow. Watch the onboard radiation alarm.');
      L.push('Plan ahead: a rover trip tomorrow could get caught outside.');
      L.push(f ? `[✓ NASA DONKI · ARCHIVE May 2024] Real flare, peak ${f.peakTime.replace('T', ' ')}.` : '[✓ NASA DONKI · ARCHIVE February 2024] False-alarm profile: no particle event followed the flare.');
    } else L.push('ALERT: Forecasters saw a flare. Particles may arrive tomorrow. [~ SIMULATED event]');
  } else if (stormActive(e)) {
    if (!e.link && e.stormOnset) L.push('BEEP BEEP: ONBOARD RADIATION ALARM! No word from Earth, but your own sensor says particles are here. Your call, Commander.');
    else if (e.stormOnset) L.push('Particles are arriving today! Shelter the crew during the peak.');
    else L.push(e.storm === 'strong' ? 'The storm is STRONG today. Shelter during the peak, stay inside.' : 'The particle storm is still building.');
    L.push(e.stormSource === 'archive' ? `[✓ NASA DONKI + RadLab · ARCHIVE${e.stormName ? ` ${e.stormName}` : ''}${e.realDay ? ` ${e.realDay}` : ''}] Real event placed closer together for this game.` : '[~ SIMULATED storm]');
  }
  const k = nextLongShadow(s, 3);
  if (k && e.eclipse === 'none') L.push(`Heads-up: the ridge goes dark in ${k} ${unit}${k > 1 ? 's' : ''} (the Sun dips behind hills). Fill the batteries and clean the panels first! Eclipses are easy to predict; solar storms are not.`);
  if (e.eclipse === 'long') {
    const d = daysUntilSun(s);
    L.push(`You are in the long shadow. No sunlight for the panels. ${d ? `The Sun returns in ${d} ${unit}${d > 1 ? 's' : ''}.` : ''} Power-saving mode stretches your batteries.`);
  }
  if (e.eclipse === 'short') L.push('Short eclipse today: the Sun is behind a hill for half the day.');
  const lossIn = daysUntilLinkLoss(s);
  if (e.link && lossIn && lossIn <= 3) L.push(`Heads-up: in ${lossIn} ${unit}${lossIn > 1 ? 's' : ''} Earth sinks below the hills and our radio link goes quiet. From the south pole, Earth slowly bobs up and down in your sky over each month, so a base here can only talk straight to Earth about half the time. Plan ahead: no storm alerts from us while it is down. Your onboard radiation alarm still works.`);
  if (!e.link) {
    const back = daysUntilLink(s);
    L.push(`EARTH LINK DOWN: Earth is below the hills right now, so radio can't reach it. ${back ? `Earth rises again in ${back} ${unit}${back > 1 ? 's' : ''}.` : 'It will not rise again before the mission ends.'} Relay satellites could fill these gaps one day; for now, you are on your own.`);
  }
  if (s.o2 <= 25) L.push('Oxygen is LOW. Tune the air system!');
  if (s.dose >= 75) L.push('Your dose plan is nearly used up. Keep the crew inside.');
  if (s.stamina < 50) L.push('The crew is getting tired. A rest day, or leaving some crew time free, helps them recover.');
  if (s.power <= 25 && !s.emergency) L.push('Power is low. Avoid big power jobs, or use power-saving mode.');
  if (s.dust >= 2 && e.sun !== 'dark') L.push('Dust is stealing your sunlight. Cleaning panels gets it back.');
  if (s.turn === totalDays(s) - 1) L.push('Last day! Make it count.');
  if (!L.length) L.push(['Steady day. What is the plan, Commander?', 'All quiet on the ridge.', 'The ice will not find itself!'][s.turn % 3]);
  return L;
}

/** Shown in a power emergency: exactly how to get out of it. */
export function emergencyHelp(s: State): string[] {
  const d = daysUntilSun(s);
  return [
    'POWER EMERGENCY - batteries are empty. The base is on minimum power.',
    'Heaters are on minimum, so the crew gets cold (stamina -10 a day). Backup oxygen keeps everyone breathing, but you cannot make more air until power is back.',
    'HOW TO RECOVER:',
    d === 0
      ? '  1. The Sun is up: tonight the panels recharge you (power comes back above 20 = emergency over).'
      : `  1. Wait for sunlight: it returns in ${d ?? '?'} day(s). Then the panels recharge you.`,
    '  2. Clean dust off the panels (needs no power, gives more power from the same Sun).',
    '  3. Meanwhile you can still clean, rest, shelter, repair or call Earth. Everything else needs power.',
  ];
}

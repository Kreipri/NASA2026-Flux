import { useState } from "react";
import {
  newGame, step, menu, actionDef, blocksToday, env, stormActive,
  totalDays, day, verdict, checklist, totalStars,
  type State, type ActionId, type TripChoice, type Goal,
} from "../engine/engine";
import { Scene } from "./Scene";
import { Hotspots } from "./Hotspots";
import { Tray } from "./Tray";

const SCENARIO = "week";
const SEED = 42;
const clean = (t: string) => t.replace(/\[[^\]]*\]/g, "").trim(); // badges are shown as chips instead

export function App() {
  const [state, setState] = useState<State>(() => newGame(SCENARIO, SEED));
  const [picked, setPicked] = useState<ActionId[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const s = state, e = env(s);

  const toggle = (id: ActionId) => {
    setError(null);
    if (picked.includes(id)) return setPicked(picked.filter((p) => p !== id));
    const item = menu(s).find((x) => x.def.id === id);
    if (item?.blocked) return setError(`${item.def.label}: ${item.blocked}.`);
    const used = picked.reduce((n, p) => n + actionDef(p).blocks, 0);
    if (used + actionDef(id).blocks > blocksToday(s)) return setError("Not enough crew time left today.");
    setPicked([...picked, id]);
  };

  const run = (ids: ActionId[], choice?: TripChoice) => {
    const r = step(s, ids, choice);
    if (r.log[0]?.startsWith("!")) return setError(r.log[0].slice(2));
    setState(r.state);
    if (r.state.pending) return;
    setLog(r.log); setPicked([]); setOpen(null); setError(null);
  };

  const restart = () => { setState(newGame(SCENARIO, SEED)); setPicked([]); setLog([]); setError(null); };

  // Base Bot picks the most important thing to say
  const message =
    error ? `Hmm: ${error}` :
    s.emergency ? "Batteries are empty! Only some jobs work until the sun recharges us." :
    e.storm === "warning" ? "A big solar flare just went off. A particle storm may reach us soon!" :
    stormActive(e) ? "Particle storm! The Storm Shelter keeps the crew safest." :
    e.sun === "dark" ? "The ridge is in shadow today. No sun for the panels, so save power!" :
    log.length ? clean(log[0]) :
    "Tap a glowing marker to give the crew a job. Then press END DAY.";
  const archive = !error && e.stormSource === "archive" && e.storm !== "none";

  return (
    <div className="game">
      <Scene sun={e.sun} storm={stormActive(e)} />

      <div className="hud-top">
        <h1>DAY {Math.min(day(s), totalDays(s))} <small>OF {totalDays(s)}</small></h1>
        <div className="day-dots">
          {s.timeline.map((t, i) => (
            <span key={i} className={`dd ${i < s.turn ? "past" : i === s.turn ? "now" : ""} ${t.sun === "dark" ? "shadow" : ""}`} />
          ))}
        </div>
        <div className="chips">
          <span className="chip chip-sun">{e.sun === "full" ? "☀ Sunlight" : e.sun === "half" ? "🌓 Short eclipse" : "🌑 Long shadow"}</span>
          <span className="chip">★ {totalStars(s)} / 12</span>
          {!e.link && <span className="chip">📡 Earth link down</span>}
        </div>
      </div>

      {!s.ended && <Hotspots state={s} picked={picked} open={open} setOpen={setOpen} onToggle={toggle} />}

      {s.ended
        ? <EndScreen state={s} onRestart={restart} />
        : <Tray state={s} picked={picked} message={message} archive={archive} onEnd={() => run(picked)} />}

      {s.pending && (
        <div className="modal"><div className="modal-box">
          <h2>☢ Storm! The rover is out at the dark crater.</h2>
          <button className="end-btn" onClick={() => run(s.pending!.actions, "back")}>TURN BACK (safe, no sample)</button>
          <button className="end-btn alt" onClick={() => run(s.pending!.actions, "finish")}>FINISH TRIP (sample, more dose)</button>
        </div></div>
      )}
    </div>
  );
}

function EndScreen({ state, onRestart }: { state: State; onRestart: () => void }) {
  const v = verdict(state), cl = checklist(state);
  const why = state.ended!.reason === "oxygen" ? "Oxygen ran out." : state.ended!.reason === "dose" ? "The crew used up the dose plan." : "Mission complete!";
  return (
    <div className="modal"><div className="modal-box">
      <h2>{why}</h2>
      <h3>Site report: {v.tier.toUpperCase()} · {v.stars}★</h3>
      {(Object.keys(cl) as Goal[]).map((g) => (
        <p key={g}><b>{g}</b> {cl[g].map((c) => `${c.done ? "★" : "☆"} ${c.label}`).join("  ")}</p>
      ))}
      <button className="end-btn" onClick={onRestart}>NEW MISSION ▶</button>
    </div></div>
  );
}
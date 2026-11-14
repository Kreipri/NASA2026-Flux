import { blocksToday, actionDef, type State, type ActionId } from "../engine/engine";

export function Tray({ state, picked, message, archive, onEnd }: {
  state: State; picked: ActionId[]; message: string; archive: boolean; onEnd: () => void;
}) {
  const total = blocksToday(state);
  const used = picked.reduce((n, id) => n + actionDef(id).blocks, 0);
  return (
    <div className="tray">
      <div className="bot">🤖</div>
      <div className="bubble">
        <span className="bubble-tag">BASE BOT</span>
        <p>{message}</p>
        {archive && <span className="chip chip-archive">✓ NASA DONKI · ARCHIVE May 2024</span>}
      </div>
      <div className="meters">
        <Bar icon="⚡" label="Power" v={state.power} color="#fcd34d" />
        <Bar icon="O₂" label="Oxygen" v={state.o2} color="#67e8f9" />
        <Bar icon="☢" label="Dose" v={state.dose} color="#c4b5fd" />
        <Bar icon="❤" label="Stamina" v={state.stamina} color="#fb7185" />
        <span className="chip chip-sim">~ SIMULATED</span>
      </div>
      <div className="end-col">
        <div className="crew-dots" title="Crew time today">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className={i >= total ? "dot off" : i < used ? "dot used" : "dot"} />
          ))}
        </div>
        <button className="end-btn" disabled={!picked.length} onClick={onEnd}>END DAY ▶</button>
      </div>
    </div>
  );
}

function Bar({ icon, label, v, color }: { icon: string; label: string; v: number; color: string }) {
  return (
    <div className="bar">
      <span className="bar-icon">{icon}</span>
      <div><div className="track"><div className="fill" style={{ width: `${v}%`, background: color }} /></div>
        <small>{label}</small></div>
      <b>{v}</b>
    </div>
  );
}
import { HOTSPOTS } from "./layout";
import { menu, powerCost, type State, type ActionId } from "../engine/engine";

export function Hotspots({ state, picked, open, setOpen, onToggle }: {
  state: State; picked: ActionId[]; open: string | null;
  setOpen: (id: string | null) => void; onToggle: (id: ActionId) => void;
}) {
  const m = menu(state);
  return (
    <>
      {HOTSPOTS.map((h) => {
        const items = m.filter((x) => h.jobs.includes(x.def.id));
        if (!items.length) return null;
        const count = items.filter((x) => picked.includes(x.def.id)).length;
        return (
          <div key={h.id} className="hotspot" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <button className={`pin ${count ? "pin-on" : ""}`} aria-label={h.label}
              onClick={() => setOpen(open === h.id ? null : h.id)}>
              {h.icon}{count > 0 && <span className="pin-count">{count}</span>}
            </button>
            <div className="pin-line" />
            {open === h.id && (
              <div className="pop">
                <div className="pop-title">{h.label}</div>
                {items.map(({ def, blocked }) => {
                  const on = picked.includes(def.id);
                  return (
                    <button key={def.id} className={`job ${on ? "on" : ""}`}
                      disabled={!!blocked && !on} onClick={() => onToggle(def.id)}>
                      <span>{on ? "✓ " : ""}{def.label}</span>
                      <small>
                        {"●".repeat(def.blocks)} crew · ⚡{powerCost(state, def.id)}
                        {def.o2 ? ` · O₂ ${def.o2 > 0 ? "+" : ""}${def.o2}` : ""}
                        {def.outside ? " · outside, tiring" : ""}
                        {blocked && !on ? ` · 🔒 ${blocked}` : ""}
                      </small>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
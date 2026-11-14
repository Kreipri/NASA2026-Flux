import { ROOMS } from "./layout";
import {
  menu, env, stormActive, powerCost, blocksToday, actionDef,
  type State, type ActionId,
} from "../engine/engine";

const ASTRO = "🧑‍🚀";

export function BaseView({ state, picked, onToggle }: {
  state: State; picked: ActionId[]; onToggle: (id: ActionId) => void;
}) {
  const m = menu(state);
  const e = env(state);
  const used = picked.reduce((n, id) => n + actionDef(id).blocks, 0);
  const free = blocksToday(state) - used;

  return (
    <div>
      <div className="pips">
        CREW READY: {ASTRO.repeat(Math.max(0, free))}
        <span className="dim"> ({free}/{blocksToday(state)} crew time · 1 {ASTRO} = 1 crew time)</span>
      </div>

      <div className="base">
        <div className="sky">
          LUNAR SURFACE · SHACKLETON RIDGE · {e.sun === "dark" ? "🌑 IN SHADOW" : e.sun === "half" ? "🌓 SHORT ECLIPSE" : "☀️ SUNLIT"}
          {!e.link && " · 📡 EARTH LINK DOWN"}
        </div>

        {ROOMS.map((room) => {
          const item = m.find((x) => x.def.id === room.job);
          if (!item) return null; // job not in this scenario
          const { def, blocked } = item;
          const on = picked.includes(room.job);
          const cls = [
            "room",
            def.outside && "outside",
            on && "on",
            blocked && !on && "blocked",
            room.job === "clean" && e.sun === "dark" && "dark",
            room.job === "shelter" && (stormActive(e) || e.storm === "warning") && "alert",
          ].filter(Boolean).join(" ");

          return (
            <button
              key={room.job}
              className={cls}
              style={{ gridRow: room.row + 1, gridColumn: `${room.col} / span ${room.width}` }}
              onClick={() => onToggle(room.job)}
              title={def.label}
            >
              <div className="room-name">{room.icon} {room.label}</div>
              <div className="room-job">{def.label}</div>
              <div className="crew-row">{on ? ASTRO.repeat(def.blocks) : "·".repeat(def.blocks)}</div>
              <div className="cost">
                {def.blocks} crew · ⚡{powerCost(state, room.job)}
                {def.o2 ? ` · O₂${def.o2 > 0 ? "+" : ""}${def.o2}` : ""}
                {def.outside ? " · OUTSIDE (tiring)" : ""}
              </div>
              {blocked && !on && <div className="warn">🔒 {blocked}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
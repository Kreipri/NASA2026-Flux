import type { ActionId } from "../engine/engine";

// Scene size from Scene.tsx viewBox="0 0 1600 900"
export const SCENE_W = 1600;
export const SCENE_H = 900;

export interface Hotspot {
  id: string; label: string; icon: string;
  ax: number; ay: number;   // anchor: the point ON the building, in scene units
  line: number;             // how tall the stem is, in px
  jobs: ActionId[];
}

export const HOTSPOTS: Hotspot[] = [
  // Top of the soil dome (dome peak is at 680,545)
  { id: "shelter", label: "Storm Shelter", icon: "🛡️", ax: 680, ay: 550, line: 40, jobs: ["shelter", "regolith"] },
  // Top of the middle solar panel (panel at x 715–800, top y 360)
  { id: "solar",   label: "Solar Panels",  icon: "🔆", ax: 757, ay: 362, line: 60, jobs: ["clean", "logsun", "powersave"] },
  // Roof of the habitat (top edge y 500)
  { id: "habitat", label: "Habitat",       icon: "🏠", ax: 1080, ay: 502, line: 50, jobs: ["air", "measure", "repair", "rest"] },
  // Earth in the sky (centre 1240,380, radius 34)
  { id: "comms",   label: "Earth Link",    icon: "📡", ax: 1240, ay: 346, line: 40, jobs: ["call"] },
  // Rover cab (top y 595)
  { id: "rover",   label: "Rover & Drone", icon: "🚙", ax: 1445, ay: 597, line: 40, jobs: ["rover", "scout"] },
];
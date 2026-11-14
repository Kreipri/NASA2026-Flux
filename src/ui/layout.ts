import type { ActionId } from "../engine/engine";

export interface Hotspot {
  id: string; label: string; icon: string;
  x: number; y: number;          // % of the scene (where the marker sits)
  jobs: ActionId[];
}

export const HOTSPOTS: Hotspot[] = [
  { id: "shelter", label: "Storm Shelter", icon: "🛡️", x: 41, y: 40, jobs: ["shelter", "regolith"] },
  { id: "solar",   label: "Solar Panels",  icon: "🔆", x: 46, y: 18, jobs: ["clean", "logsun", "powersave"] },
  { id: "habitat", label: "Habitat",       icon: "🏠", x: 63, y: 31, jobs: ["air", "measure", "repair", "rest"] },
  { id: "comms",   label: "Earth Link",    icon: "📡", x: 71, y: 22, jobs: ["call"] },
  { id: "rover",   label: "Rover & Drone", icon: "🚙", x: 83, y: 42, jobs: ["rover", "scout"] },
];
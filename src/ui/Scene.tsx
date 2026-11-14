import { useMemo } from "react";

export function Scene({ sun, storm }: { sun: "full" | "half" | "dark"; storm: boolean }) {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    x: (i * 337) % 1600, y: (i * 151) % 420, r: i % 5 === 0 ? 2 : 1,
  })), []);

  return (
    <svg className="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1020" /><stop offset="1" stopColor="#1c2a52" />
        </linearGradient>
        <radialGradient id="glow"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.9" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0" /></radialGradient>
        <radialGradient id="win"><stop offset="0" stopColor="#ffd9a8" /><stop offset="1" stopColor="#ffd9a8" stopOpacity="0" /></radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#sky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity="0.6" />)}

      {/* Sun sits low on the horizon: true at the lunar south pole */}
      {sun !== "dark" && (
        <g opacity={sun === "half" ? 0.45 : 1}>
          <circle cx="510" cy="470" r="140" fill="url(#glow)" />
          <circle cx="510" cy="470" r="38" fill="#fffbe8" />
        </g>
      )}

      {/* Earth */}
      <circle cx="1240" cy="380" r="34" fill="#3b7bd6" />
      <circle cx="1254" cy="372" r="32" fill="#0b1020" opacity="0.75" />

      {/* Far hills + ground */}
      <path d="M0 520 L120 480 L260 505 L420 470 L600 500 L800 480 L1000 505 L1250 470 L1450 500 L1600 485 L1600 560 L0 560Z" fill="#5d5c66" />
      <path d="M0 540 L1600 520 L1600 900 L0 900Z" fill="#a9a8b0" />
      <path d="M560 560 L1600 540 L1600 900 L700 900Z" fill="#6f6e78" />
      <ellipse cx="260" cy="650" rx="190" ry="26" fill="#8d8c95" />

      {/* Solar panels */}
      {[650, 760, 870].map((x) => (
        <g key={x}><rect x={x} y="340" width="10" height="230" fill="#8a8a92" />
          <rect x={x - 45} y="360" width="85" height="140" fill="#353a4a" /></g>
      ))}

      {/* Regolith-covered shelter dome */}
      <path d="M540 680 Q560 560 680 545 Q800 560 820 680Z" fill="#7b746c" />
      <rect x="610" y="620" width="70" height="60" fill="#c9c6c2" />
      <circle cx="640" cy="650" r="20" fill="url(#win)" />

      {/* Habitat module */}
      <rect x="860" y="500" width="440" height="160" rx="40" fill="#b8bac4" />
      <rect x="1250" y="510" width="80" height="170" fill="#9fa1ab" />
      {[900, 990, 1080].map((x) => <circle key={x} cx={x} cy="550" r="26" fill="url(#win)" />)}
      {[900, 1060, 1220].map((x) => <rect key={x} x={x} y="660" width="12" height="40" fill="#2a2a33" />)}

      {/* Rover */}
      <rect x="1350" y="630" width="180" height="70" fill="#a7a9b3" />
      <rect x="1410" y="595" width="70" height="40" fill="#5b5e6b" />
      <rect x="1360" y="695" width="40" height="40" fill="#22232b" />
      <rect x="1480" y="695" width="40" height="40" fill="#22232b" />

      {/* World mood */}
      {sun === "dark" && <rect width="1600" height="900" fill="#000" opacity="0.5" />}
      {storm && <rect width="1600" height="900" fill="#8b5cf6" opacity="0.15" />}
    </svg>
  );
}
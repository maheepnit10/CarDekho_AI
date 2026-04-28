"use client";

import type { ScoreBreakdown } from "@/lib/types";

const LABELS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "budget_fit",          label: "Budget",    max: 25 },
  { key: "use_case_match",      label: "Use Case",  max: 20 },
  { key: "family_suitability",  label: "Family",    max: 20 },
  { key: "location_fit",        label: "Location",  max: 15 },
  { key: "priority_alignment",  label: "Priority",  max: 15 },
  { key: "value_proposition",   label: "Value",     max: 5  },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function MatchRadar({ breakdown }: { breakdown: ScoreBreakdown }) {
  const cx = 120, cy = 120, maxR = 88;
  const n = LABELS.length;

  const scorePoints = LABELS.map((l, i) => {
    const ratio = l.max > 0 ? Math.min(breakdown[l.key] / l.max, 1) : 0;
    return polar(cx, cy, maxR * ratio, (360 / n) * i);
  });

  const scorePath = scorePoints.map((p, i) =>
    `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
  ).join(" ") + " Z";

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[200px] mx-auto">
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const pts = LABELS.map((_, i) => polar(cx, cy, maxR * scale, (360 / n) * i));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
        return <path key={scale} d={d} fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth={1} />;
      })}

      {/* Spokes */}
      {LABELS.map((_, i) => {
        const end = polar(cx, cy, maxR, (360 / n) * i);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(0,212,255,0.08)" strokeWidth={1} />;
      })}

      {/* Score polygon */}
      <path d={scorePath} fill="rgba(0,212,255,0.12)" stroke="var(--cyan)" strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgba(0,212,255,0.4))" }} />

      {/* Score dots */}
      {scorePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="var(--cyan)"
          style={{ filter: "drop-shadow(0 0 3px var(--cyan))" }} />
      ))}

      {/* Labels */}
      {LABELS.map((l, i) => {
        const pos = polar(cx, cy, maxR + 20, (360 / n) * i);
        return (
          <text key={l.key} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.08em"
            fill="rgba(0,212,255,0.55)">
            {l.label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

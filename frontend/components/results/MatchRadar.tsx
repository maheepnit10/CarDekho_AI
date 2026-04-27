"use client";

import type { ScoreBreakdown } from "@/lib/types";

const LABELS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "budget_fit", label: "Budget", max: 25 },
  { key: "use_case_match", label: "Use Case", max: 20 },
  { key: "family_suitability", label: "Family", max: 20 },
  { key: "location_fit", label: "Location", max: 15 },
  { key: "priority_alignment", label: "Priorities", max: 15 },
  { key: "value_proposition", label: "Value", max: 5 },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function MatchRadar({ breakdown }: { breakdown: ScoreBreakdown }) {
  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const n = LABELS.length;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  // Score polygon
  const points = LABELS.map((l, i) => {
    const ratio = l.max > 0 ? breakdown[l.key] / l.max : 0;
    const angle = (360 / n) * i;
    return polarToCartesian(cx, cy, maxR * ratio, angle);
  });

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[200px] mx-auto">
      {/* Grid rings */}
      {rings.map((r) => {
        const pts = LABELS.map((_, i) => {
          const angle = (360 / n) * i;
          return polarToCartesian(cx, cy, maxR * r, angle);
        });
        return (
          <polygon
            key={r}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {LABELS.map((_, i) => {
        const angle = (360 / n) * i;
        const outer = polarToCartesian(cx, cy, maxR, angle);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={outer.x} y2={outer.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={polyStr}
        fill="rgba(59,130,246,0.2)"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />
      ))}

      {/* Labels */}
      {LABELS.map((l, i) => {
        const angle = (360 / n) * i;
        const pos = polarToCartesian(cx, cy, maxR + 18, angle);
        return (
          <text
            key={l.key}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="#94a3b8"
          >
            {l.label}
          </text>
        );
      })}
    </svg>
  );
}

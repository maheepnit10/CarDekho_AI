"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { CarRecommendation } from "@/lib/types";
import MatchRadar from "./MatchRadar";

function formatPrice(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

const FUEL_COLOR: Record<string, string> = {
  petrol: "var(--amber)",
  diesel: "#facc15",
  cng:    "var(--green)",
  ev:     "var(--cyan)",
  hybrid: "#2dd4bf",
};

function ScoreRing({ score }: { score: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "var(--green)" : score >= 60 ? "var(--cyan)" : "var(--amber)";
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="5" />
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="butt"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{ color, lineHeight: 1 }}>{Math.round(score)}</span>
        <span className="data-label" style={{ fontSize: "0.55rem" }}>/ 100</span>
      </div>
    </div>
  );
}

interface Props {
  rec: CarRecommendation;
  rank: number;
  delay?: number;
  hero?: boolean;
}

export default function CarCard({ rec, rank, delay = 0, hero = false }: Props) {
  const { car, match_score, reasoning, trade_off, score_breakdown, emi_estimate } = rec;
  const fuelColor = FUEL_COLOR[car.fuel_type] ?? "var(--text-dim)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="hud-panel overflow-hidden"
      style={hero ? { borderColor: "rgba(0,212,255,0.35)", boxShadow: "0 0 40px rgba(0,212,255,0.08)" } : {}}
    >
      {/* Top banner for rank 1 */}
      {rank === 1 && (
        <div className="px-5 py-2 flex items-center gap-2"
          style={{ background: "rgba(0,212,255,0.08)", borderBottom: "1px solid rgba(0,212,255,0.15)" }}>
          <span className="animate-blink" style={{ color: "var(--cyan)", fontSize: "0.7rem" }}>◆</span>
          <span className="data-label" style={{ color: "var(--cyan)" }}>Top Recommendation</span>
        </div>
      )}

      <div className={`p-5 ${hero ? "sm:flex sm:gap-8" : ""}`}>
        {/* ── LEFT CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="hud-badge" style={{ borderColor: fuelColor, color: fuelColor, fontSize: "0.6rem" }}>
                  {car.fuel_type.toUpperCase()}
                </span>
                <span className="data-label capitalize">{car.body_type}</span>
                {car.ncap_rating >= 5 && (
                  <span className="hud-badge" style={{ borderColor: "var(--green)", color: "var(--green)", fontSize: "0.6rem" }}>
                    {car.ncap_rating}★ NCAP
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black tracking-tight" style={{ color: "var(--text)" }}>
                {car.make} {car.model}
              </h3>
              <p className="data-label mt-0.5" style={{ fontSize: "0.65rem", textTransform: "none", letterSpacing: "0.06em" }}>
                {car.variant} · {car.year}
              </p>
            </div>
            {hero && <ScoreRing score={match_score} />}
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-black data-value">{formatPrice(car.price_ex_showroom)}</span>
            <span className="data-label" style={{ fontSize: "0.62rem" }}>ex-showroom</span>
            {emi_estimate && (
              <span className="hud-badge" style={{ borderColor: "var(--green)", color: "var(--green)" }}>
                ₹{emi_estimate.toLocaleString("en-IN")}/mo
              </span>
            )}
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Mileage", value: car.fuel_type === "ev" ? `${car.range_km}km` : `${car.mileage_kmpl}kpl` },
              { label: "Seats",   value: `${car.seating_capacity}` },
              { label: "Airbags", value: `${car.airbags}` },
            ].map((s) => (
              <div key={s.label} className="hud-panel p-3 text-center"
                style={{ border: "1px solid rgba(0,212,255,0.08)" }}>
                <div className="data-label mb-0.5" style={{ fontSize: "0.55rem" }}>{s.label}</div>
                <div className="font-black text-base data-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {car.adas    && <span className="hud-badge">ADAS</span>}
            {car.sunroof && <span className="hud-badge">Sunroof</span>}
            {car.auto_available && <span className="hud-badge">Auto</span>}
            {car.cng_available  && <span className="hud-badge" style={{ color: "var(--green)", borderColor: "var(--green)" }}>CNG</span>}
          </div>

          {/* AI reasoning */}
          <div className="hud-panel p-4 mb-4" style={{ border: "1px solid rgba(0,212,255,0.12)" }}>
            <div className="data-label mb-2" style={{ color: "var(--cyan)", fontSize: "0.6rem" }}>
              ◆ AI Analysis
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)", opacity: 0.85 }}>
              {reasoning}
            </p>
          </div>

          {/* Trade-off */}
          <p className="text-xs mb-4" style={{ color: "var(--amber)" }}>
            ⚡ {trade_off}
          </p>

          {/* Link */}
          {car.cardekho_url && (
            <a href={car.cardekho_url} target="_blank" rel="noopener noreferrer"
              className="btn-hud inline-flex items-center gap-2 text-xs py-2 px-4">
              View on CarDekho <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* ── RIGHT: RADAR (hero only) ── */}
        {hero && (
          <div className="mt-6 sm:mt-0 sm:w-52 flex-shrink-0">
            <div className="data-label mb-3 text-center">Score Breakdown</div>
            <MatchRadar breakdown={score_breakdown} />
            <div className="mt-4 space-y-2">
              {Object.entries(score_breakdown).map(([k, v], i) => {
                const pct = Math.round(v);
                const label = k.replace(/_/g, " ");
                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="data-label capitalize" style={{ width: 90, fontSize: "0.58rem", flexShrink: 0 }}>
                      {label}
                    </span>
                    <div className="flex-1 hud-bar-track">
                      <motion.div className="hud-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                      />
                    </div>
                    <span className="font-black text-xs" style={{ color: "var(--cyan)", width: 20, textAlign: "right" }}>
                      {pct}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

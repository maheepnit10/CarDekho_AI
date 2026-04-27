"use client";

import { motion } from "framer-motion";
import { ExternalLink, Fuel, Users, Shield, Zap } from "lucide-react";
import type { CarRecommendation } from "@/lib/types";
import MatchRadar from "./MatchRadar";

function formatPrice(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

function ScoreDot({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-blue-400" : "text-amber-400";
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r="32"
          fill="none"
          stroke={score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : "#f59e0b"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 32}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
        <span className="text-lg font-bold leading-none">{Math.round(score)}</span>
        <span className="text-xs opacity-60">/ 100</span>
      </div>
    </div>
  );
}

function FuelBadge({ type }: { type: string }) {
  const map: Record<string, { color: string; label: string }> = {
    petrol: { color: "text-orange-400 bg-orange-400/10", label: "Petrol" },
    diesel: { color: "text-yellow-400 bg-yellow-400/10", label: "Diesel" },
    cng: { color: "text-green-400 bg-green-400/10", label: "CNG" },
    ev: { color: "text-emerald-400 bg-emerald-400/10", label: "Electric" },
    hybrid: { color: "text-teal-400 bg-teal-400/10", label: "Hybrid" },
  };
  const style = map[type] ?? { color: "text-slate-400 bg-slate-400/10", label: type };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.color}`}>
      {style.label}
    </span>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass rounded-3xl overflow-hidden ${
        hero ? "border-blue-500/30 shadow-2xl shadow-blue-500/10" : ""
      }`}
    >
      {/* Rank badge */}
      {rank === 1 && (
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white">
          ⭐ Top Recommendation
        </div>
      )}

      <div className={`p-6 ${hero ? "sm:flex sm:gap-8" : ""}`}>
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FuelBadge type={car.fuel_type} />
                <span className="text-xs text-slate-500 capitalize">{car.body_type}</span>
                {car.ncap_rating >= 5 && (
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    {car.ncap_rating}★ NCAP
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-slate-400">{car.variant} · {car.year}</p>
            </div>
            {hero && <ScoreDot score={match_score} />}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-white">
              {formatPrice(car.price_ex_showroom)}
            </span>
            <span className="text-xs text-slate-500">ex-showroom</span>
            {emi_estimate && (
              <span className="text-sm text-emerald-400 font-medium">
                ~₹{emi_estimate.toLocaleString("en-IN")}/mo
              </span>
            )}
          </div>

          {/* Quick specs */}
          <div className="flex flex-wrap gap-3 mb-5 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              {car.fuel_type === "ev" ? `${car.range_km}km range` : `${car.mileage_kmpl} kmpl`}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {car.seating_capacity} seats
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {car.airbags} airbags
            </span>
            {car.adas && (
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400">ADAS</span>
              </span>
            )}
            {car.sunroof && <span>🌤 Sunroof</span>}
          </div>

          {/* AI Reasoning */}
          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-xs text-blue-400 font-medium mb-1.5">🤖 Why this car for you</p>
            <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
          </div>

          {/* Trade-off */}
          <p className="text-xs text-amber-400 mb-4">
            ⚡ Trade-off: {trade_off}
          </p>

          {/* Action */}
          {car.cardekho_url && (
            <a
              href={car.cardekho_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on CarDekho
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Right: radar (hero only) */}
        {hero && (
          <div className="mt-6 sm:mt-0 sm:w-48 flex-shrink-0">
            <p className="text-xs text-slate-500 text-center mb-2">Match breakdown</p>
            <MatchRadar breakdown={score_breakdown} />
            <div className="mt-3 space-y-1.5">
              {Object.entries(score_breakdown).map(([k, v]) => {
                const label = k.replace(/_/g, " ");
                const pct = Math.round(v);
                return (
                  <div key={k} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 capitalize w-24 truncate">{label}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-white w-5 text-right">{pct}</span>
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

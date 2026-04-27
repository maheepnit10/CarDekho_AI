"use client";

import { motion } from "framer-motion";

const USE_CASES = [
  { id: "city_commute", label: "City Commute", emoji: "🏙️", note: "Daily city driving, traffic jams, short trips" },
  { id: "highway", label: "Highway Cruiser", emoji: "🛣️", note: "Long trips, highway runs, smooth roads" },
  { id: "mixed", label: "Mixed Use", emoji: "🗺️", note: "City + occasional highway, versatile" },
  { id: "off_road", label: "Off-Road / Hills", emoji: "⛰️", note: "Rough terrain, hills, adventure trips" },
];

const ANNUAL_KMS = [
  { id: "<10k", label: "<10,000 km", note: "Occasional use" },
  { id: "10-20k", label: "10–20k km", note: "Average user" },
  { id: "20-30k", label: "20–30k km", note: "Heavy user" },
  { id: ">30k", label: ">30,000 km", note: "Very high mileage" },
];

const PARKING = [
  { id: "street", label: "Street / Open", emoji: "🛣️" },
  { id: "covered", label: "Covered / Garage", emoji: "🏠" },
];

interface Props {
  use: string;
  km: string;
  parking: string;
  onUse: (v: string) => void;
  onKm: (v: string) => void;
  onParking: (v: string) => void;
}

export default function UseCasePicker({ use, km, parking, onUse, onKm, onParking }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Primary use</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {USE_CASES.map((u, i) => (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onUse(u.id)}
              className={`glass glass-hover rounded-2xl p-4 text-left transition-all ${
                use === u.id ? "border-blue-500/60 bg-blue-500/10" : ""
              }`}
            >
              <div className="text-2xl mb-2">{u.emoji}</div>
              <div className="text-sm font-semibold text-white">{u.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{u.note}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Annual kilometres</p>
        <div className="flex flex-wrap gap-3">
          {ANNUAL_KMS.map((k) => (
            <button
              key={k.id}
              onClick={() => onKm(k.id)}
              className={`glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                km === k.id ? "border-blue-500/60 bg-blue-500/10 text-blue-300" : "text-slate-300"
              }`}
            >
              {k.label}
              <span className="ml-1.5 text-xs text-slate-500">{k.note}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Parking situation</p>
        <div className="flex gap-3">
          {PARKING.map((p) => (
            <button
              key={p.id}
              onClick={() => onParking(p.id)}
              className={`glass glass-hover rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 transition-all ${
                parking === p.id ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300" : "text-slate-300"
              }`}
            >
              <span>{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

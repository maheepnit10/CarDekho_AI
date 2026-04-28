"use client";

import { motion } from "framer-motion";

const USE_CASES = [
  { id: "city_commute", label: "City Commute",    code: "CTY", note: "Daily traffic · Short trips" },
  { id: "highway",      label: "Highway Cruiser", code: "HWY", note: "Long trips · Smooth roads" },
  { id: "mixed",        label: "Mixed Use",       code: "MIX", note: "City + occasional highway" },
  { id: "off_road",     label: "Off-Road",        code: "4WD", note: "Rough terrain · Adventure" },
];

const ANNUAL_KMS = [
  { id: "<10k",   label: "<10K km/yr",    note: "Occasional" },
  { id: "10-20k", label: "10–20K km/yr",  note: "Average" },
  { id: "20-30k", label: "20–30K km/yr",  note: "Heavy" },
  { id: ">30k",   label: ">30K km/yr",    note: "Very high" },
];

const PARKING = [
  { id: "street",  label: "Street / Open" },
  { id: "covered", label: "Covered / Garage" },
];

interface Props {
  use: string; km: string; parking: string;
  onUse: (v: string) => void;
  onKm: (v: string) => void;
  onParking: (v: string) => void;
}

export default function UseCasePicker({ use, km, parking, onUse, onKm, onParking }: Props) {
  return (
    <div className="space-y-7">
      <div>
        <p className="data-label mb-3">Primary Drive Mode</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {USE_CASES.map((u, i) => (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onUse(u.id)}
              className={`sel-card p-4 text-left ${use === u.id ? "selected" : ""}`}
            >
              <div className="text-lg font-black mb-2 font-mono"
                style={{ color: use === u.id ? "var(--cyan)" : "rgba(0,212,255,0.35)" }}>
                {u.code}
              </div>
              <div className="text-sm font-bold mb-0.5" style={{ color: "var(--text)" }}>{u.label}</div>
              <div className="data-label" style={{ fontSize: "0.6rem", textTransform: "none", letterSpacing: "0.07em" }}>
                {u.note}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="data-label mb-3">Annual Distance</p>
        <div className="flex flex-wrap gap-2">
          {ANNUAL_KMS.map((k) => (
            <button
              key={k.id}
              onClick={() => onKm(k.id)}
              className={`sel-card px-4 py-2.5 flex items-center gap-2 ${km === k.id ? "selected" : ""}`}
              style={{ clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)" }}
            >
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{k.label}</span>
              <span className="data-label" style={{ fontSize: "0.58rem", textTransform: "none" }}>{k.note}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="data-label mb-3">Parking Type</p>
        <div className="flex gap-3">
          {PARKING.map((p) => (
            <button
              key={p.id}
              onClick={() => onParking(p.id)}
              className={`sel-card flex-1 px-5 py-3 text-sm font-bold ${parking === p.id ? "selected" : ""}`}
              style={{ color: parking === p.id ? "var(--cyan)" : "var(--text-dim)" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

const CITIES = [
  { id: "delhi",     label: "Delhi NCR",   icon: "DL", type: "metro",   note: "Metro · Heavy traffic" },
  { id: "mumbai",    label: "Mumbai",       icon: "MU", type: "coastal", note: "Coastal · Dense" },
  { id: "bangalore", label: "Bangalore",    icon: "BL", type: "metro",   note: "Metro · Mixed terrain" },
  { id: "chennai",   label: "Chennai",      icon: "CH", type: "coastal", note: "Coastal · Hot" },
  { id: "pune",      label: "Pune",         icon: "PN", type: "hilly",   note: "Hilly · Mixed roads" },
  { id: "hyderabad", label: "Hyderabad",    icon: "HY", type: "metro",   note: "Metro · Wide roads" },
  { id: "kolkata",   label: "Kolkata",      icon: "KO", type: "metro",   note: "Metro · Old roads" },
  { id: "other",     label: "Other City",   icon: "—",  type: "tier2",   note: "Tier-2 / Town" },
];

const TYPE_COLOR: Record<string, string> = {
  metro:   "var(--cyan)",
  coastal: "var(--amber)",
  hilly:   "var(--green)",
  tier2:   "rgba(180,220,240,0.5)",
};

interface Props {
  value: string;
  onSelect: (city: string, cityType: string) => void;
}

export default function CityPicker({ value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CITIES.map((city, i) => (
        <motion.button
          key={city.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(city.id, city.type)}
          className={`sel-card p-4 text-left ${value === city.id ? "selected" : ""}`}
        >
          <div
            className="text-xl font-black mb-2"
            style={{ color: TYPE_COLOR[city.type], fontFamily: "monospace", letterSpacing: "0.05em" }}
          >
            {city.icon}
          </div>
          <div className="text-sm font-bold mb-0.5" style={{ color: "var(--text)" }}>{city.label}</div>
          <div className="data-label" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "none" }}>
            {city.note}
          </div>
          {value === city.id && (
            <div className="mt-2 hud-badge" style={{ fontSize: "0.55rem" }}>SELECTED</div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

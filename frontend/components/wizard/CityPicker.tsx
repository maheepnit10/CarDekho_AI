"use client";

import { motion } from "framer-motion";

const CITIES = [
  { id: "delhi", label: "Delhi NCR", emoji: "🏙️", type: "metro", note: "Metro · Heavy traffic" },
  { id: "mumbai", label: "Mumbai", emoji: "🌊", type: "coastal", note: "Coastal · Dense city" },
  { id: "bangalore", label: "Bangalore", emoji: "🌿", type: "metro", note: "Metro · Mixed terrain" },
  { id: "chennai", label: "Chennai", emoji: "☀️", type: "coastal", note: "Coastal · Hot climate" },
  { id: "pune", label: "Pune", emoji: "⛰️", type: "hilly", note: "Hilly · Mixed roads" },
  { id: "hyderabad", label: "Hyderabad", emoji: "💎", type: "metro", note: "Metro · Wide roads" },
  { id: "kolkata", label: "Kolkata", emoji: "🎭", type: "metro", note: "Metro · Old roads" },
  { id: "other", label: "Other City", emoji: "🗺️", type: "tier2", note: "Tier-2 / Town" },
];

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(city.id, city.type)}
          className={`glass glass-hover rounded-2xl p-4 text-left transition-all ${
            value === city.id
              ? "border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10"
              : ""
          }`}
        >
          <div className="text-3xl mb-2">{city.emoji}</div>
          <div className="text-sm font-semibold text-white">{city.label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{city.note}</div>
        </motion.button>
      ))}
    </div>
  );
}

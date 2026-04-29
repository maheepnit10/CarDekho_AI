"use client";

import { motion } from "framer-motion";

const FAMILIES = [
  { id: "solo", label: "Just Me", emoji: "🧍", note: "Solo rider" },
  { id: "couple", label: "Couple", emoji: "👫", note: "2 adults" },
  { id: "young_family", label: "Young Family", emoji: "👨‍👩‍👧", note: "Kids under 10" },
  { id: "large_family", label: "Large Family", emoji: "👨‍👩‍👧‍👦", note: "4+ members" },
  { id: "joint_family", label: "Joint Family", emoji: "🏠", note: "6+ members" },
];

interface Props {
  value: string;
  onSelect: (v: string) => void;
}

export default function FamilyPicker({ value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {FAMILIES.map((f, i) => (
        <motion.button
          key={f.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          onClick={() => onSelect(f.id)}
          className={`glass glass-hover rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
            value === f.id
              ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
              : ""
          }`}
        >
          <span className="text-3xl">{f.emoji}</span>
          <span className="text-xs font-semibold text-white">{f.label}</span>
          <span className="text-xs text-slate-500">{f.note}</span>
        </motion.button>
      ))}
    </div>
  );
}

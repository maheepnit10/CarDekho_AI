"use client";

import { motion } from "framer-motion";

const FAMILIES = [
  { id: "solo",        label: "Solo",         code: "01", note: "Just me" },
  { id: "couple",      label: "Couple",        code: "02", note: "2 adults" },
  { id: "young_family",label: "Young Family",  code: "03", note: "Kids <10" },
  { id: "large_family",label: "Large Family",  code: "04", note: "4+ members" },
  { id: "joint_family",label: "Joint Family",  code: "06+",note: "6+ members" },
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
          className={`sel-card p-4 flex flex-col items-center gap-2 text-center ${value === f.id ? "selected" : ""}`}
        >
          <span
            className="text-2xl font-black"
            style={{ color: value === f.id ? "var(--cyan)" : "rgba(0,212,255,0.4)", fontFamily: "monospace" }}
          >
            {f.code}
          </span>
          <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{f.label}</span>
          <span className="data-label" style={{ fontSize: "0.58rem", textTransform: "none", letterSpacing: "0.06em" }}>
            {f.note}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

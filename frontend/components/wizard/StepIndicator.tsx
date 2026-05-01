"use client";

import { motion } from "framer-motion";

const STEPS = ["Your World", "How You Drive", "Budget", "Priorities", "Preferences"];

export default function StepIndicator({ current }: { current: number }) {
  const pct = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>Step {current + 1} of {STEPS.length}</span>
        <span className="text-blue-400 font-medium">{STEPS[current]}</span>
      </div>

      <div className="relative h-1.5 bg-white/10 rounded-full overflow-visible">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-base leading-none"
          initial={{ left: "0%" }}
          animate={{ left: `calc(${pct}% - 10px)` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          🚗
        </motion.div>
      </div>
    </div>
  );
}

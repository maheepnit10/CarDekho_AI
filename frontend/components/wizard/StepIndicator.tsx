"use client";

import { motion } from "framer-motion";

const STEPS = ["Your World", "How You Drive", "Budget", "Priorities", "Preferences"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      {/* Car on track */}
      <div className="relative h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((current) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Car icon */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-lg"
          initial={{ left: "0%" }}
          animate={{ left: `calc(${((current) / (STEPS.length - 1)) * 100}% - 12px)` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          🚗
        </motion.div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className="flex flex-col items-center"
            style={{ width: `${100 / STEPS.length}%` }}
          >
            <div
              className={`text-xs font-medium transition-colors ${
                i <= current ? "text-blue-400" : "text-slate-600"
              }`}
            >
              {i < current ? "✓" : i === current ? label : "·"}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-slate-400 mt-2">
        Step {current + 1} of {STEPS.length} — <span className="text-white font-medium">{STEPS[current]}</span>
      </p>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";

function formatLakh(val: number) {
  return `₹${(val / 100000).toFixed(1)}L`;
}

function calcEmi(price: number, downPct: number, tenureYears: number) {
  const principal = price * (1 - downPct / 100);
  const r = 0.09 / 12;
  const n = tenureYears * 12;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

const TENURES = [3, 5, 7];
const STRETCHES = [
  { id: "none", label: "No stretch" },
  { id: "10pct", label: "Can stretch 10%" },
  { id: "20pct", label: "Can stretch 20%" },
];

interface Props {
  budgetMin: number;
  budgetMax: number;
  stretch: string;
  loan: boolean;
  downPct: number;
  tenure: number;
  onBudgetMin: (v: number) => void;
  onBudgetMax: (v: number) => void;
  onStretch: (v: string) => void;
  onLoan: (v: boolean) => void;
  onDownPct: (v: number) => void;
  onTenure: (v: number) => void;
}

const MIN = 300000;
const MAX = 5000000;
const STEP = 50000;

export default function BudgetSlider({
  budgetMin, budgetMax, stretch, loan, downPct, tenure,
  onBudgetMin, onBudgetMax, onStretch, onLoan, onDownPct, onTenure,
}: Props) {
  const emi = loan ? calcEmi(budgetMax, downPct, tenure) : 0;

  return (
    <div className="space-y-8">
      {/* Budget display */}
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-slate-400 text-sm mb-2">Your budget range</p>
        <p className="text-4xl font-bold text-white">
          {formatLakh(budgetMin)} – {formatLakh(budgetMax)}
        </p>
        {loan && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-400 text-sm mt-2"
          >
            ≈ ₹{emi.toLocaleString("en-IN")}/month EMI
          </motion.p>
        )}
      </div>

      {/* Min slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Min budget</span>
          <span className="text-white font-medium">{formatLakh(budgetMin)}</span>
        </div>
        <input
          type="range"
          min={MIN}
          max={budgetMax - STEP}
          step={STEP}
          value={budgetMin}
          onChange={(e) => onBudgetMin(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Max slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Max budget</span>
          <span className="text-white font-medium">{formatLakh(budgetMax)}</span>
        </div>
        <input
          type="range"
          min={budgetMin + STEP}
          max={MAX}
          step={STEP}
          value={budgetMax}
          onChange={(e) => onBudgetMax(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>{formatLakh(MIN)}</span>
          <span>{formatLakh(MAX)}</span>
        </div>
      </div>

      {/* Stretch */}
      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Can you stretch if the perfect car is slightly over?</p>
        <div className="flex gap-3 flex-wrap">
          {STRETCHES.map((s) => (
            <button
              key={s.id}
              onClick={() => onStretch(s.id)}
              className={`glass glass-hover rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                stretch === s.id ? "border-blue-500/60 bg-blue-500/10 text-blue-300" : "text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loan toggle */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white">Interested in a car loan?</p>
            <p className="text-xs text-slate-500 mt-0.5">We'll show EMI estimates and weight value</p>
          </div>
          <button
            onClick={() => onLoan(!loan)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              loan ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            <motion.div
              animate={{ x: loan ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {loan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl p-5 space-y-5 overflow-hidden"
            >
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Down payment</span>
                  <span className="text-white font-medium">{downPct}%</span>
                </div>
                <input
                  type="range" min={10} max={80} step={5} value={downPct}
                  onChange={(e) => onDownPct(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Loan tenure</p>
                <div className="flex gap-2">
                  {TENURES.map((t) => (
                    <button
                      key={t}
                      onClick={() => onTenure(t)}
                      className={`flex-1 glass glass-hover rounded-xl py-2 text-sm font-medium transition-all ${
                        tenure === t ? "border-blue-500/60 bg-blue-500/10 text-blue-300" : "text-slate-300"
                      }`}
                    >
                      {t} yr
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center glass rounded-xl py-3">
                <p className="text-xs text-slate-400">Estimated monthly EMI</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  ₹{emi.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">At 9% p.a. on {formatLakh(budgetMax)} car</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

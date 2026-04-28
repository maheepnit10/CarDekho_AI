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
  { id: "none",  label: "No stretch" },
  { id: "10pct", label: "+10%" },
  { id: "20pct", label: "+20%" },
];

interface Props {
  budgetMin: number; budgetMax: number; stretch: string;
  loan: boolean; downPct: number; tenure: number;
  onBudgetMin: (v: number) => void; onBudgetMax: (v: number) => void;
  onStretch: (v: string) => void; onLoan: (v: boolean) => void;
  onDownPct: (v: number) => void; onTenure: (v: number) => void;
}

const MIN = 300000, MAX = 5000000, STEP = 50000;

export default function BudgetSlider({
  budgetMin, budgetMax, stretch, loan, downPct, tenure,
  onBudgetMin, onBudgetMax, onStretch, onLoan, onDownPct, onTenure,
}: Props) {
  const emi = loan ? calcEmi(budgetMax, downPct, tenure) : 0;

  return (
    <div className="space-y-7">
      {/* Big display */}
      <div className="hud-panel p-6 text-center">
        <div className="data-label mb-2">Budget Range</div>
        <div className="text-4xl font-black" style={{ color: "var(--cyan)", textShadow: "0 0 24px var(--cyan-glow)" }}>
          {formatLakh(budgetMin)} — {formatLakh(budgetMax)}
        </div>
        <AnimatePresence>
          {loan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <span className="hud-badge" style={{ borderColor: "var(--green)", color: "var(--green)" }}>
                ≈ ₹{emi.toLocaleString("en-IN")} / month EMI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex justify-between data-label mb-2">
            <span>Min</span>
            <span style={{ color: "var(--cyan)" }}>{formatLakh(budgetMin)}</span>
          </div>
          <input type="range" min={MIN} max={budgetMax - STEP} step={STEP} value={budgetMin}
            onChange={(e) => onBudgetMin(Number(e.target.value))} />
        </div>
        <div>
          <div className="flex justify-between data-label mb-2">
            <span>Max</span>
            <span style={{ color: "var(--cyan)" }}>{formatLakh(budgetMax)}</span>
          </div>
          <input type="range" min={budgetMin + STEP} max={MAX} step={STEP} value={budgetMax}
            onChange={(e) => onBudgetMax(Number(e.target.value))} />
          <div className="flex justify-between data-label mt-1" style={{ fontSize: "0.56rem" }}>
            <span>{formatLakh(MIN)}</span><span>{formatLakh(MAX)}</span>
          </div>
        </div>
      </div>

      {/* Stretch */}
      <div>
        <p className="data-label mb-3">Budget Flex</p>
        <div className="flex gap-2">
          {STRETCHES.map((s) => (
            <button key={s.id} onClick={() => onStretch(s.id)}
              className={`sel-card flex-1 py-2.5 text-sm font-bold ${stretch === s.id ? "selected" : ""}`}
              style={{ color: stretch === s.id ? "var(--cyan)" : "var(--text-dim)" }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loan toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Car Loan?</p>
            <p className="data-label mt-0.5" style={{ fontSize: "0.62rem", textTransform: "none" }}>
              Show EMI estimate
            </p>
          </div>
          <button onClick={() => onLoan(!loan)} className={`hud-toggle ${loan ? "on" : ""}`}>
            <div className="hud-toggle-knob" />
          </button>
        </div>

        <AnimatePresence>
          {loan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 hud-panel p-5 space-y-5 overflow-hidden"
            >
              <div>
                <div className="flex justify-between data-label mb-2">
                  <span>Down Payment</span>
                  <span style={{ color: "var(--cyan)" }}>{downPct}%</span>
                </div>
                <input type="range" min={10} max={80} step={5} value={downPct}
                  onChange={(e) => onDownPct(Number(e.target.value))} />
              </div>

              <div>
                <p className="data-label mb-3">Loan Tenure</p>
                <div className="flex gap-2">
                  {TENURES.map((t) => (
                    <button key={t} onClick={() => onTenure(t)}
                      className={`sel-card flex-1 py-2.5 text-sm font-bold ${tenure === t ? "selected" : ""}`}
                      style={{ color: tenure === t ? "var(--cyan)" : "var(--text-dim)" }}>
                      {t} yr
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center py-3 border-t" style={{ borderColor: "rgba(0,212,255,0.1)" }}>
                <div className="data-label mb-1">Monthly EMI Estimate</div>
                <div className="text-3xl font-black glow-green">
                  ₹{emi.toLocaleString("en-IN")}
                </div>
                <div className="data-label mt-1" style={{ fontSize: "0.58rem", textTransform: "none" }}>
                  9% p.a. · {downPct}% down · {tenure} yrs · {formatLakh(budgetMax)} car
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

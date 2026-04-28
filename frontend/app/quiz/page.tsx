"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import CityPicker from "@/components/wizard/CityPicker";
import FamilyPicker from "@/components/wizard/FamilyPicker";
import UseCasePicker from "@/components/wizard/UseCasePicker";
import BudgetSlider from "@/components/wizard/BudgetSlider";
import PriorityPicker from "@/components/wizard/PriorityPicker";
import PreferencesPicker from "@/components/wizard/PreferencesPicker";
import { getRecommendations } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { DEFAULT_PROFILE } from "@/lib/types";

const STEPS = [
  { id: "01", label: "LOCATION", sub: "City & terrain shapes the shortlist" },
  { id: "02", label: "USAGE", sub: "Daily commute or weekend explorer?" },
  { id: "03", label: "BUDGET", sub: "Range + loan EMI calculation" },
  { id: "04", label: "PRIORITIES", sub: "AI weight configuration" },
  { id: "05", label: "PREFERENCES", sub: "Fuel & brand (optional)" },
];

function canProceed(step: number, profile: UserProfile): boolean {
  switch (step) {
    case 0: return !!profile.city && !!profile.family_type;
    case 1: return !!profile.primary_use && !!profile.annual_km && !!profile.parking;
    case 2: return profile.budget_max > profile.budget_min;
    case 3: return profile.priorities.length >= 1;
    case 4: return true;
    default: return false;
  }
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(1);

  const update = (patch: Partial<UserProfile>) => setProfile((p) => ({ ...p, ...patch }));

  const next = () => {
    if (step < 4) { setDirection(1); setStep((s) => s + 1); }
    else submit();
  };

  const back = () => { setDirection(-1); setStep((s) => s - 1); };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getRecommendations(profile);
      router.push(`/results?data=${btoa(JSON.stringify(result))}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed. Please retry.");
      setLoading(false);
    }
  };

  const progress = ((step + 1) / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="hud-bg" />
      <div className="animate-scan-line" />

      {/* ── TOP BAR ── */}
      <div className="relative z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black glow-cyan tracking-widest">CARMATCH AI</span>
          <span style={{ color: "rgba(0,212,255,0.3)", fontSize: "0.7rem" }}>|</span>
          <span className="data-label">Profile Scan</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="data-label">
            Step <span className="glow-cyan font-black">{step + 1}</span> / 5
          </span>
          <div style={{ width: 100 }} className="hud-bar-track">
            <div className="hud-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ── STEP RAIL ── */}
      <div className="relative z-10 border-b px-6 py-3 overflow-x-auto"
        style={{ borderColor: "rgba(0,212,255,0.06)" }}>
        <div className="flex items-center gap-0 min-w-max">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all ${i <= step ? "" : "opacity-30"}`}
                onClick={() => i < step && setStep(i)}
              >
                <div className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`}>
                  {i < step ? "✓" : s.id}
                </div>
                <div>
                  <div className="data-label" style={{ fontSize: "0.6rem" }}>{s.label}</div>
                  {i === step && (
                    <div className="data-label" style={{ fontSize: "0.58rem", color: "rgba(0,212,255,0.4)", letterSpacing: "0.08em", textTransform: "none" }}>
                      {s.sub}
                    </div>
                  )}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-line ${i < step ? "done" : ""}`} style={{ width: 32 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6 py-8">

        {/* Step title */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="data-value text-4xl font-black">{STEPS[step].id}</div>
              <div>
                <div className="text-xl font-black tracking-wide" style={{ color: "var(--text)" }}>
                  {STEPS[step].label}
                </div>
                <div className="data-label" style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "none" }}>
                  {STEPS[step].sub}
                </div>
              </div>
            </div>

            {step === 0 && (
              <div className="space-y-6">
                <CityPicker
                  value={profile.city}
                  onSelect={(city, cityType) => update({ city, city_type: cityType })}
                />
                {profile.city && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="data-label mb-3">Passenger Profile</p>
                    <FamilyPicker
                      value={profile.family_type}
                      onSelect={(v) => update({ family_type: v })}
                    />
                  </motion.div>
                )}
              </div>
            )}

            {step === 1 && (
              <UseCasePicker
                use={profile.primary_use}
                km={profile.annual_km}
                parking={profile.parking}
                onUse={(v) => update({ primary_use: v })}
                onKm={(v) => update({ annual_km: v })}
                onParking={(v) => update({ parking: v })}
              />
            )}

            {step === 2 && (
              <BudgetSlider
                budgetMin={profile.budget_min}
                budgetMax={profile.budget_max}
                stretch={profile.budget_stretch}
                loan={profile.loan_interested}
                downPct={profile.down_payment_pct}
                tenure={profile.loan_tenure_years}
                onBudgetMin={(v) => update({ budget_min: v })}
                onBudgetMax={(v) => update({ budget_max: v })}
                onStretch={(v) => update({ budget_stretch: v })}
                onLoan={(v) => update({ loan_interested: v })}
                onDownPct={(v) => update({ down_payment_pct: v })}
                onTenure={(v) => update({ loan_tenure_years: v })}
              />
            )}

            {step === 3 && (
              <PriorityPicker
                priorities={profile.priorities}
                mustHaves={profile.must_haves}
                onPriority={(v) => update({ priorities: v })}
                onMustHave={(v) => update({ must_haves: v })}
              />
            )}

            {step === 4 && (
              <PreferencesPicker
                fuel={profile.fuel_preference}
                brand={profile.brand_preference}
                onFuel={(v) => update({ fuel_preference: v })}
                onBrand={(v) => update({ brand_preference: v })}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 hud-panel p-4 hud-panel-amber text-sm"
            style={{ color: "var(--amber)" }}>
            ⚠ {error}
          </motion.div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={back} className="btn-hud flex items-center gap-2">
              <ArrowLeft size={14} /> Back
            </button>
          )}

          <button
            onClick={next}
            disabled={!canProceed(step, profile) || loading}
            className={`flex-1 btn-hud flex items-center justify-center gap-2 ${
              canProceed(step, profile) && !loading ? "btn-hud-primary" : "opacity-30 cursor-not-allowed"
            }`}
            style={step === 4 ? { borderColor: "var(--green)", color: "var(--green)" } : {}}
          >
            {loading ? (
              <>
                <span className="animate-blink">◆</span>
                Scanning AI Engine...
              </>
            ) : step === 4 ? (
              <>Execute Scan <ArrowRight size={14} /></>
            ) : (
              <>Continue <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

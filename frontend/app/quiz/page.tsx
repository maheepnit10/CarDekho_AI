"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import StepIndicator from "@/components/wizard/StepIndicator";
import CityPicker from "@/components/wizard/CityPicker";
import FamilyPicker from "@/components/wizard/FamilyPicker";
import UseCasePicker from "@/components/wizard/UseCasePicker";
import BudgetSlider from "@/components/wizard/BudgetSlider";
import PriorityPicker from "@/components/wizard/PriorityPicker";
import PreferencesPicker from "@/components/wizard/PreferencesPicker";
import { getRecommendations } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { DEFAULT_PROFILE } from "@/lib/types";

const STEP_TITLES = [
  "Where do you live?",
  "How do you drive?",
  "What's your budget?",
  "What matters to you?",
  "Any preferences?",
];

const STEP_SUBTITLES = [
  "Your city shapes everything — traffic, terrain, service centers, fuel options.",
  "Daily commuter or weekend explorer? How you use the car changes the recommendation.",
  "Set your range. We'll find cars that fit without making you stretch uncomfortably.",
  "Pick your top 3 priorities. The AI will weight these in scoring every car.",
  "Optional: fuel type and brand. Leave both as 'no preference' for the widest shortlist.",
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
    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getRecommendations(profile);
      const encoded = btoa(JSON.stringify(result));
      router.push(`/results?data=${encoded}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="orb-bg">
        <div className="orb orb-1" style={{ opacity: 0.07 }} />
        <div className="orb orb-2" style={{ opacity: 0.07 }} />
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🚗</span>
          <span className="text-base font-semibold text-white">CarMatch AI</span>
        </div>
        <StepIndicator current={step} />
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">{STEP_TITLES[step]}</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{STEP_SUBTITLES[step]}</p>

            {step === 0 && (
              <div className="space-y-6">
                <CityPicker
                  value={profile.city}
                  onSelect={(city, cityType) => update({ city, city_type: cityType })}
                />
                {profile.city && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm text-slate-400 mb-3 font-medium">Who&apos;s coming along?</p>
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

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 glass rounded-xl p-4 border-red-500/40 text-red-400 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pb-8">
          {step > 0 && (
            <button
              onClick={back}
              className="glass glass-hover rounded-xl px-5 py-3 text-slate-300 flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            onClick={next}
            disabled={!canProceed(step, profile) || loading}
            className={`flex-1 rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
              canProceed(step, profile) && !loading
                ? step === 4
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                : "bg-white/5 text-slate-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding your perfect cars... (may take 30s on first load)
              </>
            ) : step === 4 ? (
              <>
                Find My Car ✨
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

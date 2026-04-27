"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import CarCard from "@/components/results/CarCard";
import type { RecommendResponse } from "@/lib/types";

function ResultsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = params.get("data");
    if (!raw) {
      setError("No results found. Please complete the quiz.");
      return;
    }
    try {
      const decoded = JSON.parse(atob(raw)) as RecommendResponse;
      setData(decoded);
    } catch {
      setError("Could not parse results. Please try again.");
    }
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push("/quiz")}
          className="glass glass-hover rounded-xl px-6 py-3 text-sm font-medium text-slate-300"
        >
          Back to Quiz
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading your results...</p>
        </div>
      </div>
    );
  }

  const [top, ...rest] = data.recommendations;

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="orb-bg">
        <div className="orb orb-1" style={{ opacity: 0.06 }} />
        <div className="orb orb-2" style={{ opacity: 0.06 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <span className="text-base font-semibold text-white">CarMatch AI</span>
          </div>
          <button
            onClick={() => router.push("/quiz")}
            className="glass glass-hover rounded-xl px-4 py-2 text-sm text-slate-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Start over
          </button>
        </div>

        {/* AI Summary banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 mb-6 border-blue-500/20"
        >
          <p className="text-xs text-blue-400 font-medium mb-1">🤖 AI Insight</p>
          <p className="text-white font-medium">{data.ai_summary}</p>
          <p className="text-sm text-slate-400 mt-2">{data.profile_insight}</p>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-500 mb-5"
        >
          {data.recommendations.length} cars matched and scored for your profile
        </motion.p>

        {/* Top pick */}
        {top && (
          <div className="mb-6">
            <CarCard rec={top} rank={1} hero delay={0.1} />
          </div>
        )}

        {/* Alternatives */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-400 mb-4">Also worth considering</h2>
            <div className="space-y-4">
              {rest.map((rec, i) => (
                <CarCard key={rec.car.id} rec={rec} rank={i + 2} delay={0.15 * (i + 1)} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-10 mb-4"
        >
          <p className="text-xs text-slate-600 mb-3">
            Prices are ex-showroom estimates. Always verify on official dealer sites.
          </p>
          <button
            onClick={() => router.push("/quiz")}
            className="glass glass-hover rounded-xl px-6 py-3 text-sm text-slate-400"
          >
            Change my profile → New match
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

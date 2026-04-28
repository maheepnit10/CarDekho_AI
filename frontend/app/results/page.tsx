"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import CarCard from "@/components/results/CarCard";
import type { RecommendResponse } from "@/lib/types";

function ResultsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = params.get("data");
    if (!raw) { setError("No results found."); return; }
    try { setData(JSON.parse(atob(raw)) as RecommendResponse); }
    catch { setError("Could not parse results. Please try again."); }
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: "var(--bg)" }}>
        <div className="hud-panel p-8 max-w-sm">
          <p className="data-label mb-4" style={{ color: "var(--red)" }}>⚠ Scan Error</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>{error}</p>
          <button onClick={() => router.push("/quiz")} className="btn-hud btn-hud-primary w-full">
            Re-initialize Scan
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="data-value text-2xl font-black animate-blink mb-3">◆</div>
          <p className="data-label">Loading scan results...</p>
        </div>
      </div>
    );
  }

  const [top, ...rest] = data.recommendations;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="hud-bg" />
      <div className="animate-scan-line" />

      {/* ── NAV ── */}
      <div className="relative z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <span className="text-xs font-black glow-cyan tracking-widest">CARMATCH AI</span>
        <button onClick={() => router.push("/quiz")} className="btn-hud flex items-center gap-2 py-2 px-4 text-xs">
          <ArrowLeft size={12} /> New Scan
        </button>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">

        {/* ── AI INSIGHT BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="hud-panel p-5 mb-6"
        >
          <div className="data-label mb-2" style={{ color: "var(--cyan)" }}>◆ AI Insight</div>
          <p className="font-bold mb-2" style={{ color: "var(--text)", fontSize: "0.95rem" }}>
            {data.ai_summary}
          </p>
          <p className="data-label" style={{ fontSize: "0.68rem", textTransform: "none", letterSpacing: "0.07em" }}>
            {data.profile_insight}
          </p>
        </motion.div>

        {/* ── RESULT COUNT ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 hud-bar-track"><div className="hud-bar-fill" style={{ width: "100%" }} /></div>
          <span className="data-label whitespace-nowrap">
            {data.recommendations.length} Matches Found
          </span>
          <div className="flex-1 hud-bar-track"><div className="hud-bar-fill" style={{ width: "100%" }} /></div>
        </motion.div>

        {/* ── TOP PICK ── */}
        {top && (
          <div className="mb-6">
            <CarCard rec={top} rank={1} hero delay={0.1} />
          </div>
        )}

        {/* ── ALTERNATIVES ── */}
        {rest.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="data-label">Also Consider</span>
              <div className="flex-1 hud-bar-track" style={{ height: 1 }}>
                <div className="hud-bar-fill" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="space-y-4">
              {rest.map((rec, i) => (
                <CarCard key={rec.car.id} rec={rec} rank={i + 2} delay={0.1 + i * 0.1} />
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 mb-4"
        >
          <p className="data-label mb-4" style={{ fontSize: "0.6rem" }}>
            Prices are ex-showroom estimates · Verify on official sites
          </p>
          <button onClick={() => router.push("/quiz")} className="btn-hud btn-hud-primary">
            Run New Scan
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="data-value text-2xl animate-blink">◆</span>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

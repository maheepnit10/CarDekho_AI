"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STATS = [
  { label: "Cars Analysed", value: "138+" },
  { label: "Score Dimensions", value: "06" },
  { label: "AI Models", value: "02" },
  { label: "Avg Match Time", value: "12s" },
];

const FEATURES = [
  { id: "01", label: "City Intelligence", desc: "Metro, tier-2, hilly, coastal — terrain shapes the shortlist." },
  { id: "02", label: "Family Profile", desc: "Solo to joint family — seating, safety, boot space calibrated." },
  { id: "03", label: "Use Case Scoring", desc: "City grind, highway cruiser, off-road — different cars win." },
  { id: "04", label: "Live EMI Calc", desc: "Down payment, tenure, rate — real monthly cost, upfront." },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="hud-bg" />
      <div className="animate-scan-line" />

      {/* ── NAV ── */}
      <nav className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-cyan-400/60 flex items-center justify-center clip-btn" style={{ background: "rgba(0,212,255,0.08)" }}>
            <span className="text-xs font-bold glow-cyan">CM</span>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}>
            CarMatch AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hud-badge animate-blink">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
            System Online
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hud-badge mb-6">
              <span>AI · Gemini 2.0 Flash + Groq</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-none mb-6 tracking-tight">
              <span style={{ color: "var(--text)" }}>FIND YOUR</span>
              <br />
              <span className="glow-cyan" style={{ fontSize: "1.1em" }}>PERFECT</span>
              <br />
              <span style={{ color: "var(--text)" }}>MATCH</span>
            </h1>

            <p className="mb-8 leading-relaxed" style={{ color: "var(--text-dim)", fontSize: "0.95rem", maxWidth: "420px" }}>
              Not generic filters. Your city, your family, your budget —
              5 questions and AI scores every candidate car across 6 dimensions.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link href="/quiz" className="btn-hud btn-hud-primary inline-flex items-center gap-3 text-sm">
                Initialize Scan
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            <div className="flex items-center gap-6 mt-8">
              {["5 questions", "No spam", "Free"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span style={{ color: "var(--green)", fontSize: "0.7rem" }}>◆</span>
                  <span className="data-label">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Radar graphic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <HeroRadar />
          </motion.div>
        </div>

        {/* ── STAT ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="hud-panel p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <div className="data-label mb-1">{s.label}</div>
              <div className="data-value text-3xl font-black">{s.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FEATURE LIST ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.id}
              className="hud-panel p-5 flex items-start gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.07 }}
            >
              <span className="data-value text-2xl font-black">{f.id}</span>
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{f.label}</div>
                <div className="data-label" style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "none" }}>
                  {f.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-6 data-label border-t border-cyan-500/8 mt-8">
        CarDekho Group · AI-Native Engineer Assignment · Gemini 2.0 Flash + Groq llama-3.3-70b
      </footer>
    </main>
  );
}

/* ── HERO RADAR SVG ──────────────────────────────────────────────────────── */
function HeroRadar() {
  const dims = ["Budget", "Use Case", "Family", "Location", "Priority", "Value"];
  const n = dims.length;
  const r = 120;
  const cx = 160, cy = 160;

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const scoreValues = [0.88, 0.76, 0.92, 0.7, 0.84, 0.65];
  const scorePath = scoreValues.map((v, i) => {
    const p = point(i, r * v);
    return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ") + " Z";

  return (
    <div className="hud-panel p-6" style={{ width: 320, position: "relative" }}>
      <div className="data-label mb-4 text-center">AI Score Matrix — Sample</div>
      <svg width={320} height={320} viewBox="0 0 320 320">
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const pts = dims.map((_, i) => point(i, r * scale));
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
          return <path key={scale} d={d} fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth={1} />;
        })}
        {/* spokes */}
        {dims.map((_, i) => {
          const p = point(i, r);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,212,255,0.1)" strokeWidth={1} />;
        })}
        {/* score fill */}
        <path d={scorePath} fill="rgba(0,212,255,0.12)" stroke="var(--cyan)" strokeWidth={1.5} />
        {/* score dots */}
        {scoreValues.map((v, i) => {
          const p = point(i, r * v);
          return <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--cyan)" style={{ filter: "drop-shadow(0 0 4px var(--cyan))" }} />;
        })}
        {/* labels */}
        {dims.map((d, i) => {
          const p = point(i, r + 22);
          return (
            <text key={d} x={p.x} y={p.y + 4} textAnchor="middle"
              fill="rgba(0,212,255,0.6)" fontSize="9" fontWeight="700"
              fontFamily="monospace" letterSpacing="0.1em">
              {d.toUpperCase()}
            </text>
          );
        })}
      </svg>
      {/* pulsing center dot */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 8, height: 8,
        borderRadius: "50%",
        background: "var(--cyan)",
        boxShadow: "0 0 16px var(--cyan)"
      }} className="animate-pulse-cyan" />
    </div>
  );
}

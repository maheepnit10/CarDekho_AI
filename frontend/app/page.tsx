"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, MapPin, Users, Gauge } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Knows your city",
    desc: "Metro traffic, hilly terrain, tier-2 roads — we factor it all in.",
  },
  {
    icon: Users,
    title: "Fits your family",
    desc: "Solo, couple, young kids, joint family — seating and safety matched.",
  },
  {
    icon: Brain,
    title: "AI-weighted scoring",
    desc: "6-dimension scoring across budget, use case, safety, and value.",
  },
  {
    icon: Gauge,
    title: "Real running costs",
    desc: "EMI estimates, fuel costs, annual service — the full picture.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="orb-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          <span className="text-lg font-semibold text-white">CarMatch AI</span>
        </div>
        <span className="text-sm text-slate-400">Powered by CarDekho data</span>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered · Free · No account needed
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight mb-6">
            Find the car that fits{" "}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              your life
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Not generic filters. Your city, your family, your use case — 5 questions and our AI
            gives you a scored shortlist with honest reasoning.
          </p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-blue-600/30"
            >
              Start My Match
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <span>✓ 5 quick questions</span>
            <span>✓ AI-weighted scoring</span>
            <span>✓ Zero spam</span>
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 w-full"
        >
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 text-left">
              <f.icon className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-slate-600">
        Built for CarDekho Group AI Assignment · Data from CarDekho · AI by Gemini + Groq
      </footer>
    </main>
  );
}

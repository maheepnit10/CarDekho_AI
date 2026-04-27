"use client";

import { motion } from "framer-motion";

const PRIORITIES = [
  { id: "fuel_economy", label: "Fuel Economy", emoji: "⛽", note: "Low running cost" },
  { id: "safety", label: "Safety First", emoji: "🛡️", note: "High NCAP, airbags" },
  { id: "low_maintenance", label: "Low Maintenance", emoji: "🔧", note: "Cheap servicing" },
  { id: "boot_space", label: "Boot Space", emoji: "🧳", note: "Luggage & cargo" },
  { id: "brand_prestige", label: "Brand Prestige", emoji: "⭐", note: "Statement car" },
  { id: "latest_tech", label: "Latest Tech", emoji: "📱", note: "ADAS, connected" },
  { id: "resale_value", label: "Resale Value", emoji: "💰", note: "Holds value well" },
  { id: "off_road", label: "Off-Road", emoji: "🏔️", note: "Rugged capability" },
];

const MUST_HAVES = [
  { id: "sunroof", label: "Sunroof", emoji: "☀️" },
  { id: "auto", label: "Auto Transmission", emoji: "🔄" },
  { id: "adas", label: "ADAS Safety", emoji: "🤖" },
  { id: "airbags_6", label: "6+ Airbags", emoji: "🎈" },
  { id: "seven_seats", label: "7 Seats", emoji: "💺" },
  { id: "carplay", label: "Wireless CarPlay", emoji: "🍎" },
];

interface Props {
  priorities: string[];
  mustHaves: string[];
  onPriority: (v: string[]) => void;
  onMustHave: (v: string[]) => void;
}

export default function PriorityPicker({ priorities, mustHaves, onPriority, onMustHave }: Props) {
  const togglePriority = (id: string) => {
    if (priorities.includes(id)) {
      onPriority(priorities.filter((p) => p !== id));
    } else if (priorities.length < 3) {
      onPriority([...priorities, id]);
    }
  };

  const toggleMustHave = (id: string) => {
    if (mustHaves.includes(id)) {
      onMustHave(mustHaves.filter((m) => m !== id));
    } else {
      onMustHave([...mustHaves, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-400 font-medium">What matters most to you?</p>
          <span className="text-xs text-slate-500">{priorities.length}/3 selected</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRIORITIES.map((p, i) => {
            const selected = priorities.includes(p.id);
            const locked = !selected && priorities.length >= 3;
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => togglePriority(p.id)}
                disabled={locked}
                className={`glass glass-hover rounded-2xl p-4 text-left transition-all ${
                  selected ? "border-blue-500/60 bg-blue-500/10 shadow-blue-500/10" : ""
                } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="text-2xl mb-2">{p.emoji}</div>
                <div className="text-sm font-semibold text-white">{p.label}</div>
                <div className="text-xs text-slate-500">{p.note}</div>
                {selected && (
                  <div className="mt-2 text-xs text-blue-400">
                    #{priorities.indexOf(p.id) + 1} priority
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Any must-haves? (optional)</p>
        <div className="flex flex-wrap gap-2">
          {MUST_HAVES.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMustHave(m.id)}
              className={`glass glass-hover rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all ${
                mustHaves.includes(m.id)
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "text-slate-300"
              }`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
        {mustHaves.length > 0 && (
          <p className="text-xs text-amber-400 mt-2">
            ⚠️ Must-haves filter out cars — fewer options but better match
          </p>
        )}
      </div>
    </div>
  );
}

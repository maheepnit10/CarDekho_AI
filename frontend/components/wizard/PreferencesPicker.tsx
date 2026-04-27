"use client";

const FUELS = [
  { id: "no_pref", label: "No preference", emoji: "🤷" },
  { id: "petrol", label: "Petrol", emoji: "⛽" },
  { id: "diesel", label: "Diesel", emoji: "🛢️" },
  { id: "cng", label: "CNG", emoji: "💨" },
  { id: "ev", label: "Electric", emoji: "⚡" },
  { id: "hybrid", label: "Hybrid", emoji: "🌿" },
];

const BRANDS = [
  { id: "no_pref", label: "No preference" },
  { id: "maruti", label: "Maruti Suzuki" },
  { id: "hyundai", label: "Hyundai" },
  { id: "tata", label: "Tata" },
  { id: "kia", label: "Kia" },
  { id: "toyota", label: "Toyota" },
  { id: "honda", label: "Honda" },
  { id: "mahindra", label: "Mahindra" },
];

interface Props {
  fuel: string;
  brand: string;
  onFuel: (v: string) => void;
  onBrand: (v: string) => void;
}

export default function PreferencesPicker({ fuel, brand, onFuel, onBrand }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Fuel type preference</p>
        <div className="flex flex-wrap gap-3">
          {FUELS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFuel(f.id)}
              className={`glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-all ${
                fuel === f.id
                  ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                  : "text-slate-300"
              }`}
            >
              <span>{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Brand preference (optional)</p>
        <div className="flex flex-wrap gap-3">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => onBrand(b.id)}
              className={`glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                brand === b.id
                  ? "border-purple-500/60 bg-purple-500/10 text-purple-300"
                  : "text-slate-300"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border-blue-500/20">
        <p className="text-sm text-blue-400 font-medium mb-1">🤖 AI takes over from here</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Our AI will analyse your full profile across 6 dimensions — budget fit, use case match,
          family suitability, location fit, priority alignment, and value — then rank every
          candidate car and explain exactly why it does or doesn&apos;t suit you.
        </p>
      </div>
    </div>
  );
}

# CarDekho AI — Car Recommendation Platform

## What We're Building

A premium AI-powered car recommendation app that takes a confused buyer from "I don't know what to buy" to "I'm confident about my shortlist." Unlike generic filter-based tools, this app understands *your life* — your city, family, use case, budget, and loan situation — then uses AI to score and rank the best cars for you specifically.

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion | Vercel (free) |
| Backend | Python FastAPI + Pydantic | Render (free tier) |
| AI | Gemini 1.5 Flash (primary) + Groq llama-3.3-70b (fallback) | Free API tiers |
| Car Data | Curated static JSON (~80 Indian cars, ₹4L–₹50L) | In-repo |

## Project Structure

```
CarDekho_AI/
├── PLAN.md                       ← this file
├── README.md                     ← submission README
├── backend/
│   ├── main.py                   # FastAPI app entry point + CORS
│   ├── models.py                 # Pydantic request/response models
│   ├── routers/
│   │   └── recommend.py          # POST /api/recommend
│   ├── services/
│   │   ├── ai_service.py         # Gemini → Groq fallback scoring
│   │   └── car_service.py        # Load & filter cars.json by budget/filters
│   ├── data/
│   │   └── cars.json             # ~80 Indian cars with full specs
│   ├── requirements.txt
│   └── render.yaml               # Render deployment config
└── frontend/
    ├── app/
    │   ├── page.tsx              # Landing page (hero + CTA)
    │   ├── quiz/page.tsx         # 5-step wizard
    │   └── results/page.tsx      # AI recommendations display
    ├── components/
    │   ├── wizard/
    │   │   ├── StepIndicator.tsx
    │   │   ├── CityPicker.tsx
    │   │   ├── FamilyPicker.tsx
    │   │   ├── UseCasePicker.tsx
    │   │   ├── BudgetSlider.tsx
    │   │   └── PriorityPicker.tsx
    │   └── results/
    │       ├── CarCard.tsx
    │       ├── MatchRadar.tsx
    │       └── ReasoningBadge.tsx
    ├── lib/
    │   ├── api.ts                # Backend API client
    │   └── types.ts              # Shared TypeScript interfaces
    ├── tailwind.config.ts
    ├── package.json
    └── vercel.json
```

---

## User Journey (5-Step Wizard)

### Step 1 — Your World
- **City**: Visual cards (Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Other) — auto-sets city type (metro / tier-2 / hilly / coastal)
- **Family**: Emoji cards — Solo, Couple, Young family (kids <10), Large family (4+), Joint family (6+)

### Step 2 — How You Drive
- **Primary use**: Illustrated cards — City commute, Highway, Mixed, Off-road
- **Annual KMs**: Pill buttons — <10k, 10-20k, 20-30k, >30k
- **Parking**: Street / Covered (affects size recommendation)

### Step 3 — Your Budget
- **Range slider**: ₹4L–₹50L with live display
- **Loan toggle**: If yes → down payment % slider + tenure (3/5/7 yr) + live EMI preview

### Step 4 — What Matters to You
- **Priorities** (pick up to 3): Fuel Economy, Safety, Low Maintenance, Boot Space, Brand Prestige, Latest Tech, Resale Value, Off-road
- **Must-haves**: Sunroof, Auto transmission, ADAS, 6+ Airbags, 7 Seats, Wireless CarPlay

### Step 5 — Final Touches
- **Fuel preference**: No pref / Petrol / Diesel / CNG / Electric
- **Brand preference**: No pref / Maruti / Hyundai / Tata / Kia / Toyota / Honda / Mahindra

---

## AI Scoring Engine

The backend sends user profile + candidate cars to Gemini Flash with explicit scoring rubric:

| Dimension | Weight | What it considers |
|-----------|--------|-------------------|
| Budget fit | 25% | Price vs. budget range |
| Use case match | 20% | Ground clearance, mileage, boot space for use |
| Family suitability | 20% | Seating capacity, safety rating, space |
| Location fit | 15% | Fuel availability, service network, terrain |
| Priority alignment | 15% | Matches stated top 3 priorities |
| Value proposition | 5% | TCO, resale value, maintenance cost |

Returns ranked list with per-car reasoning + trade-off, merged with car data on backend.

---

## Deployment

- **Backend**: Render free tier — sleeps after 15 min; frontend shows "Waking up..." spinner and polls `/health`
- **Frontend**: Vercel free tier — auto-deploys on `git push`
- **Env vars needed**:
  - `GEMINI_API_KEY` (get free at aistudio.google.com)
  - `GROQ_API_KEY` (get free at console.groq.com)
  - `NEXT_PUBLIC_API_URL` (Render backend URL, set in Vercel)

---

## Build Sequence

| Phase | Task | Time est. |
|-------|------|-----------|
| 0 | PLAN.md created | ✓ |
| 1 | Backend: models + car_service + ai_service + router + main | ~30 min |
| 2 | Build cars.json (~80 cars with full specs) | ~20 min |
| 3 | Frontend: landing page | ~15 min |
| 4 | Frontend: wizard (5 steps) | ~30 min |
| 5 | Frontend: results page + radar chart | ~20 min |
| 6 | Deploy to Render + Vercel | ~20 min |
| 7 | E2E test + README | ~15 min |

---

## What Was Cut (Deliberately)
- User accounts / saved shortlists
- Real-time CarAPIs integration (using curated static dataset for reliability)
- Car comparison table side-by-side
- Dealer contact / test drive booking
- Mobile app

## What 4 More Hours Would Add
- Voice input for the wizard
- Live CarAPIs data integration
- Shareable shortlist link
- Dealer price comparison
- EMI calculator with bank-specific rates

# CarMatch AI — Car Recommendation Platform

> CarDekho Group · AI-Native Software Engineer Assignment

**Live URL**: https://car-dekho-ai.vercel.app  
**Backend**: https://cardekho-ai-backend.onrender.com  
**Screen Recording**: [Loom link here]

---

## What I Built

A full-stack AI-powered car recommendation platform that takes a confused car buyer through a 5-step wizard and delivers a personalised, AI-scored shortlist with honest reasoning.

**What makes it different from generic car sites:**
- Asks *where you live* (city type affects ground clearance, fuel recommendations, service network)
- Asks *family composition* (changes seating, safety, boot space weighting)
- Asks *how you'll use it* (daily city commute vs. highway vs. off-road — different cars win)
- Asks *loan interest* (shows live EMI and factors value-for-money into scoring)
- AI scores every candidate car across 6 weighted dimensions, not just price filters

**What I deliberately cut:**
- User accounts / saved shortlists (not needed for MVP, adds auth complexity)
- Real-time CarAPIs integration (used curated static dataset for demo reliability)
- Dealer contact / test drive booking (out of scope for this phase)
- Car comparison table (the radar chart covers this for top pick)

---

## Tech Stack & Why

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR, Vercel integration, type safety |
| Styling | Tailwind CSS 4 + custom glassmorphism CSS | Fast, responsive, premium dark UI |
| Animations | Framer Motion | Slide transitions, animated radar, progress ring |
| Backend | Python FastAPI | Async, fast, Python AI ecosystem |
| AI (primary) | Gemini 2.0 Flash | Free tier, JSON output mode, strong reasoning |
| AI (fallback) | Groq llama-3.3-70b | Fast, generous free limits |
| Car data | Curated JSON (59 Indian cars, ₹3.8L–₹6.1Cr) | Zero-dependency, always reliable |
| Backend hosting | Render free tier | Simple Python deploy |
| Frontend hosting | Vercel | Zero-config Next.js |

---

## Run Locally

```bash
# Clone
git clone https://github.com/your-username/CarDekho_AI
cd CarDekho_AI

# Backend (Python 3.10+)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env → add GEMINI_API_KEY and/or GROQ_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd ../frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
# Open http://localhost:3000
```

**Get API keys (both free, no card needed):**
- Gemini: https://aistudio.google.com/apikey
- Groq: https://console.groq.com/keys

---

## Deployment

### Backend → Render
1. Push repo to GitHub
2. New Web Service at render.com → connect repo → root: `backend/`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env vars: `GEMINI_API_KEY`, `GROQ_API_KEY`

> **Note**: Render free tier sleeps after 15 min of inactivity. First request may take 30–60s. The frontend handles this with a loading state.

### Frontend → Vercel
1. Connect repo at vercel.com → Framework: Next.js
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com`
3. Deploy → auto-updates on push to `main`

---

## AI Tool Usage (for the recording)

**What I delegated to Claude Code:**
- Boilerplate (FastAPI setup, Next.js scaffold, TypeScript interfaces)
- `cars.json` data compilation (59 cars with accurate specs)
- Component structure and Tailwind styling
- Framer Motion animation patterns

**What I did manually / course-corrected:**
- AI scoring prompt engineering — iterated 3x to get structured JSON output with correct dimension weighting
- Data schema design — chose which fields matter for scoring vs. display
- UX flow decisions — 5 steps vs. 3 vs. 7, what goes on each step
- Python 3.9 compatibility fixes (union types → Optional, caught during test)
- Switch from deprecated `google-generativeai` → `google-genai` SDK
- Deployment config (Render Python runtime pin, Vercel env vars)

**Where tools helped most:** Rapidly generating the 59-car JSON dataset with accurate specs, component scaffolding, and CSS animations — tasks that are mechanical but time-consuming.

**Where they got in the way:** The first AI scoring prompt returned inconsistent JSON structure. Had to be explicit about exact key names and value ranges per dimension.

---

## Scoring Architecture

```
User Profile (city, family, use, budget, priorities)
        ↓
Car Service (filter by budget + must-haves → ≤20 candidates)
        ↓
AI Service (Gemini 2.0 Flash prompt with rubric → ranked JSON)
        ↓  [fallback: Groq llama-3.3-70b]
Response (top 5 with per-car reasoning + score breakdown)
```

**6 scoring dimensions:**
| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Budget fit | 25% | Price vs. budget range — sweet spot at 70-90% of max |
| Use case match | 20% | Ground clearance, mileage, power for stated use |
| Family suitability | 20% | Seating, safety rating, boot space |
| Location fit | 15% | City type → parking size, fuel network, terrain |
| Priority alignment | 15% | Alignment with buyer's top 3 priorities |
| Value proposition | 5% | TCO, resale, service cost |

---

## If I Had 4 More Hours

1. **Voice input** — speak your requirements, AI converts to profile
2. **Live CarAPIs integration** — real-time listings with on-road price by city
3. **Dealer comparison** — show actual dealer quotes side-by-side
4. **Shareable link** — encode profile in URL so recommendations are shareable
5. **EMI comparison** — show rates from HDFC, SBI, ICICI side by side

---

## Project Structure

```
CarDekho_AI/
├── PLAN.md                  ← architecture and build plan
├── README.md                ← this file
├── backend/
│   ├── main.py              ← FastAPI app + CORS + health
│   ├── models.py            ← Pydantic models (UserProfile, CarRecommendation)
│   ├── routers/recommend.py ← POST /api/recommend
│   ├── services/
│   │   ├── ai_service.py    ← Gemini → Groq fallback scoring
│   │   └── car_service.py   ← load + filter cars.json
│   ├── data/cars.json       ← 59 Indian cars with full specs
│   ├── requirements.txt
│   └── render.yaml
└── frontend/
    ├── app/
    │   ├── page.tsx         ← landing page
    │   ├── quiz/page.tsx    ← 5-step wizard
    │   └── results/page.tsx ← AI recommendations display
    ├── components/
    │   ├── wizard/          ← CityPicker, FamilyPicker, BudgetSlider, etc.
    │   └── results/         ← CarCard, MatchRadar
    └── lib/
        ├── api.ts           ← fetch wrapper
        └── types.ts         ← TypeScript interfaces
```

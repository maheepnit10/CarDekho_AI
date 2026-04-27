import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from groq import Groq
from models import UserProfile

load_dotenv()

_GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
_GROQ_KEY = os.getenv("GROQ_API_KEY", "")

if _GEMINI_KEY:
    genai.configure(api_key=_GEMINI_KEY)

_groq_client = Groq(api_key=_GROQ_KEY) if _GROQ_KEY else None


def _build_prompt(profile: UserProfile, candidates: list[dict]) -> str:
    loan_info = (
        f"Yes — {profile.down_payment_pct}% down payment, {profile.loan_tenure_years}-year tenure"
        if profile.loan_interested
        else "No"
    )
    priorities_str = ", ".join(profile.priorities) if profile.priorities else "none specified"
    must_haves_str = ", ".join(profile.must_haves) if profile.must_haves else "none"

    # Slim down car data to save tokens
    slim_candidates = []
    for c in candidates:
        slim_candidates.append({
            "id": c["id"],
            "make": c["make"],
            "model": c["model"],
            "variant": c["variant"],
            "price": c["price_ex_showroom"],
            "body_type": c["body_type"],
            "fuel_type": c["fuel_type"],
            "mileage_kmpl": c.get("mileage_kmpl", 0),
            "range_km": c.get("range_km", None),
            "seating": c["seating_capacity"],
            "boot_liters": c["boot_space_liters"],
            "ground_clearance_mm": c["ground_clearance_mm"],
            "ncap": c["ncap_rating"],
            "airbags": c["airbags"],
            "adas": c["adas"],
            "sunroof": c["sunroof"],
            "auto_available": c["auto_available"],
            "service_cost_est": c["annual_service_cost_est"],
            "tags": c["tags"],
        })

    return f"""You are an expert Indian car advisor. Score each candidate car for this specific buyer profile.

USER PROFILE:
- City: {profile.city} (type: {profile.city_type} — affects road conditions, fuel availability, service density)
- Family: {profile.family_type}
- Primary use: {profile.primary_use} | Annual KMs: {profile.annual_km}
- Parking: {profile.parking}
- Budget: ₹{profile.budget_min:,}–₹{profile.budget_max:,} (stretch: {profile.budget_stretch})
- Loan interested: {loan_info}
- Top priorities: {priorities_str}
- Must-haves: {must_haves_str}
- Fuel preference: {profile.fuel_preference}
- Brand preference: {profile.brand_preference}

SCORING RUBRIC (scores must sum to 100 per car):
- budget_fit (25 pts): How well does price fit within budget? Cars at 70-85% of budget score higher than exactly at max.
- use_case_match (20 pts): Suitability for primary use. City commute → small/efficient. Highway → torque/comfort. Off-road → ground clearance/4WD. Annual KMs affect fuel efficiency weight.
- family_suitability (20 pts): Seating capacity, safety rating, boot space relative to family type. Solo needs 0 extra seats; joint family needs 7.
- location_fit (15 pts): Metro → easy parking (smaller is better), good service network. Tier-2 → brand service availability. Hilly → ground clearance >200mm, strong engine. Coastal → rust resistance (fuel type matters).
- priority_alignment (15 pts): Direct match with buyer's stated top priorities (fuel_economy, safety, low_maintenance, boot_space, brand_prestige, latest_tech, resale_value, off_road).
- value_proposition (5 pts): TCO (total cost of ownership) — service costs, fuel costs at stated annual KMs, resale value reputation.

CANDIDATE CARS:
{json.dumps(slim_candidates, indent=2)}

Return ONLY a valid JSON array (no markdown, no explanation) sorted by total_score descending. Return top 5. Each element must be:
{{
  "car_id": "<id from above>",
  "total_score": <0-100 float>,
  "score_breakdown": {{
    "budget_fit": <0-25>,
    "use_case_match": <0-20>,
    "family_suitability": <0-20>,
    "location_fit": <0-15>,
    "priority_alignment": <0-15>,
    "value_proposition": <0-5>
  }},
  "reasoning": "<2-3 sentences explaining why this car specifically fits this buyer's life — be concrete, reference their city/family/use>",
  "trade_off": "<1 sentence on the main compromise with this car>"
}}"""


def _parse_ai_response(raw: str) -> list[dict]:
    # Strip markdown code fences if present
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())


async def _gemini_score(profile: UserProfile, candidates: list[dict]) -> list[dict]:
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = _build_prompt(profile, candidates)
    response = model.generate_content(prompt)
    return _parse_ai_response(response.text)


async def _groq_score(profile: UserProfile, candidates: list[dict]) -> list[dict]:
    if not _groq_client:
        raise RuntimeError("Groq client not configured")
    prompt = _build_prompt(profile, candidates)
    response = _groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return _parse_ai_response(response.choices[0].message.content)


async def score_cars(profile: UserProfile, candidates: list[dict]) -> list[dict]:
    if _GEMINI_KEY:
        try:
            return await _gemini_score(profile, candidates)
        except Exception as e:
            print(f"Gemini failed ({e}), trying Groq")

    if _GROQ_KEY:
        return await _groq_score(profile, candidates)

    raise RuntimeError("No AI API keys configured. Set GEMINI_API_KEY or GROQ_API_KEY.")

import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types
from groq import Groq
from models import UserProfile

load_dotenv()

_GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
_GROQ_KEY = os.getenv("GROQ_API_KEY", "")

_gemini_client = genai.Client(api_key=_GEMINI_KEY) if _GEMINI_KEY else None
_groq_client = Groq(api_key=_GROQ_KEY) if _GROQ_KEY else None


def _build_prompt(profile: UserProfile, candidates: list) -> str:
    loan_info = (
        f"Yes — {profile.down_payment_pct}% down payment, {profile.loan_tenure_years}-year tenure"
        if profile.loan_interested
        else "No"
    )
    priorities_str = ", ".join(profile.priorities) if profile.priorities else "none specified"
    must_haves_str = ", ".join(profile.must_haves) if profile.must_haves else "none"

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
            "range_km": c.get("range_km"),
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
- Budget: Rs {profile.budget_min:,}–Rs {profile.budget_max:,} (stretch: {profile.budget_stretch})
- Loan interested: {loan_info}
- Top priorities: {priorities_str}
- Must-haves: {must_haves_str}
- Fuel preference: {profile.fuel_preference}
- Brand preference: {profile.brand_preference}

SCORING RUBRIC (scores per dimension shown in brackets, total = sum of all):
- budget_fit (max 25): Cars at 70-90% of budget score highest. At max budget = moderate. Over max = 0.
- use_case_match (max 20): City commute favors small/efficient. Highway favors torque/comfort. Off-road needs GC>200mm. Annual KMs >20k means fuel efficiency is critical.
- family_suitability (max 20): Solo=any 5-seater fine. Couple=any 5-seater. Young family=5-seater with good safety+boot. Large family=6+ seats needed. Joint family=7 seats mandatory.
- location_fit (max 15): Metro=easy parking (smaller better). Tier-2=brand service availability matters. Hilly=GC>200mm+strong engine. Coastal=fuel type matters less but salt resistance does.
- priority_alignment (max 15): Direct alignment with stated top priorities. If fuel_economy is #1, mileage>20 kmpl scores much higher.
- value_proposition (max 5): Low service cost, strong resale (Maruti/Toyota lead), CNG/EV for high-km users.

CANDIDATE CARS:
{json.dumps(slim_candidates, indent=2)}

Return ONLY a valid JSON array sorted by total_score descending. Return top 5. Each element:
{{
  "car_id": "<id>",
  "total_score": <float 0-100>,
  "score_breakdown": {{
    "budget_fit": <float 0-25>,
    "use_case_match": <float 0-20>,
    "family_suitability": <float 0-20>,
    "location_fit": <float 0-15>,
    "priority_alignment": <float 0-15>,
    "value_proposition": <float 0-5>
  }},
  "reasoning": "<2-3 sentences referencing their specific city/family/use case>",
  "trade_off": "<1 sentence on the main compromise>"
}}
Output only the JSON array. No markdown, no explanation."""


def _parse_ai_response(raw: str) -> list:
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())


async def _gemini_score(profile: UserProfile, candidates: list) -> list:
    prompt = _build_prompt(profile, candidates)
    response = _gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=genai_types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )
    return _parse_ai_response(response.text)


async def _groq_score(profile: UserProfile, candidates: list) -> list:
    if not _groq_client:
        raise RuntimeError("Groq client not configured")
    prompt = _build_prompt(profile, candidates)
    response = _groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return _parse_ai_response(response.choices[0].message.content)


async def score_cars(profile: UserProfile, candidates: list) -> list:
    if _gemini_client:
        try:
            return await _gemini_score(profile, candidates)
        except Exception as e:
            print(f"Gemini failed ({e}), trying Groq")

    if _groq_client:
        return await _groq_score(profile, candidates)

    raise RuntimeError("No AI API keys configured. Set GEMINI_API_KEY or GROQ_API_KEY.")

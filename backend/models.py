from __future__ import annotations
from pydantic import BaseModel
from typing import Optional


class UserProfile(BaseModel):
    city: str
    city_type: str  # "metro", "tier2", "hilly", "coastal"
    family_type: str  # "solo", "couple", "young_family", "large_family", "joint_family"
    primary_use: str  # "city_commute", "highway", "mixed", "off_road"
    annual_km: str  # "<10k", "10-20k", "20-30k", ">30k"
    parking: str  # "street", "covered"
    budget_min: int
    budget_max: int
    budget_stretch: str  # "none", "10pct", "20pct"
    loan_interested: bool
    down_payment_pct: int = 20
    loan_tenure_years: int = 5
    priorities: list[str]  # up to 3 from: fuel_economy, safety, low_maintenance, boot_space, brand_prestige, latest_tech, resale_value, off_road
    must_haves: list[str]  # sunroof, auto, adas, airbags_6, seven_seats, carplay
    fuel_preference: str  # "no_pref", "petrol", "diesel", "cng", "ev"
    brand_preference: str  # "no_pref", "maruti", "hyundai", "tata", "kia", "toyota", "honda", "mahindra"


class ScoreBreakdown(BaseModel):
    budget_fit: float
    use_case_match: float
    family_suitability: float
    location_fit: float
    priority_alignment: float
    value_proposition: float


class CarRecommendation(BaseModel):
    car: dict
    match_score: float
    rank: int
    reasoning: str
    trade_off: str
    score_breakdown: ScoreBreakdown
    emi_estimate: Optional[int] = None


class RecommendResponse(BaseModel):
    recommendations: list[CarRecommendation]
    ai_summary: str
    profile_insight: str

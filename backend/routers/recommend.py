from fastapi import APIRouter, HTTPException
from models import UserProfile, CarRecommendation, RecommendResponse, ScoreBreakdown
from services.car_service import load_cars, filter_candidates, calculate_emi
from services.ai_service import score_cars

router = APIRouter()
_CAR_DB: list[dict] = []


@router.on_event("startup")
def _load():
    global _CAR_DB
    _CAR_DB = load_cars()


@router.post("/api/recommend", response_model=RecommendResponse)
async def recommend(profile: UserProfile):
    cars = _CAR_DB or load_cars()
    candidates = filter_candidates(profile, cars)

    if not candidates:
        raise HTTPException(
            status_code=400,
            detail="No cars match your criteria. Try widening your budget, removing must-haves, or changing fuel/brand preference.",
        )

    try:
        ai_results = await score_cars(profile, candidates)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI scoring failed: {str(e)}")

    # Build car lookup
    car_lookup = {c["id"]: c for c in candidates}

    recommendations: list[CarRecommendation] = []
    for rank, item in enumerate(ai_results[:5], start=1):
        car_id = item.get("car_id")
        car = car_lookup.get(car_id)
        if not car:
            continue

        bd = item.get("score_breakdown", {})
        emi = None
        if profile.loan_interested:
            emi = calculate_emi(car["price_ex_showroom"], profile.down_payment_pct, profile.loan_tenure_years)

        recommendations.append(
            CarRecommendation(
                car=car,
                match_score=round(item.get("total_score", 0), 1),
                rank=rank,
                reasoning=item.get("reasoning", ""),
                trade_off=item.get("trade_off", ""),
                score_breakdown=ScoreBreakdown(
                    budget_fit=bd.get("budget_fit", 0),
                    use_case_match=bd.get("use_case_match", 0),
                    family_suitability=bd.get("family_suitability", 0),
                    location_fit=bd.get("location_fit", 0),
                    priority_alignment=bd.get("priority_alignment", 0),
                    value_proposition=bd.get("value_proposition", 0),
                ),
                emi_estimate=emi,
            )
        )

    if not recommendations:
        raise HTTPException(status_code=500, detail="AI returned no valid recommendations.")

    top = recommendations[0].car
    insight = (
        f"Based on your {profile.city} {profile.city_type} lifestyle and {profile.family_type.replace('_', ' ')} setup, "
        f"the {top['make']} {top['model']} stands out as your best match."
    )

    city_label = profile.city.title()
    family_label = profile.family_type.replace("_", " ").title()
    profile_insight = (
        f"A {family_label} in {city_label} doing {profile.annual_km} km/year "
        f"needs {'fuel efficiency and low running costs' if profile.annual_km in ('>30k', '20-30k') else 'a comfortable, practical car'} "
        f"with {'an eye on loan EMIs' if profile.loan_interested else 'a clean purchase'}."
    )

    return RecommendResponse(
        recommendations=recommendations,
        ai_summary=insight,
        profile_insight=profile_insight,
    )

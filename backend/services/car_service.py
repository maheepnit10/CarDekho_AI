import json
import math
from pathlib import Path
from models import UserProfile

_DATA_PATH = Path(__file__).parent.parent / "data" / "cars.json"
_CARS: list[dict] = []


def load_cars() -> list[dict]:
    global _CARS
    if not _CARS:
        with open(_DATA_PATH) as f:
            _CARS = json.load(f)
    return _CARS


def calculate_emi(price: int, down_pct: int, tenure_years: int) -> int:
    principal = price * (1 - down_pct / 100)
    monthly_rate = 0.09 / 12
    n = tenure_years * 12
    emi = principal * monthly_rate * (1 + monthly_rate) ** n / ((1 + monthly_rate) ** n - 1)
    return int(emi)


def _stretch_multiplier(stretch: str) -> float:
    return {"none": 1.0, "10pct": 1.1, "20pct": 1.2}.get(stretch, 1.0)


def _matches_fuel(car: dict, fuel_pref: str) -> bool:
    if fuel_pref == "no_pref":
        return True
    if fuel_pref == "ev":
        return car.get("fuel_type") == "ev"
    if fuel_pref == "cng":
        return car.get("cng_available", False) or car.get("fuel_type") == "cng"
    return car.get("fuel_type") == fuel_pref


def _matches_brand(car: dict, brand_pref: str) -> bool:
    if brand_pref == "no_pref":
        return True
    brand_map = {
        "maruti": "maruti suzuki",
        "hyundai": "hyundai",
        "tata": "tata",
        "kia": "kia",
        "toyota": "toyota",
        "honda": "honda",
        "mahindra": "mahindra",
        "mg": "mg",
        "volkswagen": "volkswagen",
        "skoda": "skoda",
        "renault": "renault",
        "nissan": "nissan",
    }
    preferred = brand_map.get(brand_pref.lower(), brand_pref.lower())
    return car.get("make", "").lower().startswith(preferred)


def _apply_must_haves(car: dict, must_haves: list) -> bool:
    if "seven_seats" in must_haves and car.get("seating_capacity", 5) < 7:
        return False
    if "sunroof" in must_haves and not car.get("sunroof", False):
        return False
    if "auto" in must_haves and not car.get("auto_available", False):
        return False
    if "adas" in must_haves and not car.get("adas", False):
        return False
    if "6_airbags" in must_haves and car.get("airbags", 0) < 6:
        return False
    return True


def filter_candidates(profile: UserProfile, cars: list[dict]) -> list[dict]:
    max_budget = profile.budget_max * _stretch_multiplier(profile.budget_stretch)

    def _base_filter(car: dict) -> bool:
        return car["price_ex_showroom"] <= max_budget

    def _try_filter(with_fuel: bool, with_brand: bool, with_must_haves: bool) -> list[dict]:
        result = []
        for car in cars:
            if not _base_filter(car):
                continue
            if with_fuel and not _matches_fuel(car, profile.fuel_preference):
                continue
            if with_brand and not _matches_brand(car, profile.brand_preference):
                continue
            if with_must_haves and not _apply_must_haves(car, profile.must_haves):
                continue
            result.append(car)
        return result

    # Progressive filter relaxation — tightest first, then loosen
    for fuel, brand, must in [
        (True, True, True),    # full constraints
        (True, True, False),   # drop non-critical must-haves
        (True, False, False),  # drop brand preference
        (False, False, False), # ignore fuel/brand/must-haves, budget only
    ]:
        candidates = _try_filter(fuel, brand, must)
        if len(candidates) >= 3:
            break

    # If still nothing (unlikely with 138 cars), return cheapest available
    if not candidates:
        candidates = sorted(cars, key=lambda c: c["price_ex_showroom"])[:10]

    # Sort: spread across price range for AI variety
    candidates.sort(key=lambda c: c["price_ex_showroom"], reverse=True)
    return candidates[:20]

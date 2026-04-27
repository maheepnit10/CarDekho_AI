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
    annual_rate = 0.09
    monthly_rate = annual_rate / 12
    n = tenure_years * 12
    emi = principal * monthly_rate * (1 + monthly_rate) ** n / ((1 + monthly_rate) ** n - 1)
    return int(emi)


def _stretch_multiplier(stretch: str) -> float:
    return {"none": 1.0, "10pct": 1.1, "20pct": 1.2}.get(stretch, 1.0)


def filter_candidates(profile: UserProfile, cars: list[dict]) -> list[dict]:
    max_budget = profile.budget_max * _stretch_multiplier(profile.budget_stretch)

    candidates = []
    for car in cars:
        price = car["price_ex_showroom"]

        # Hard budget filter — must be under stretched max
        if price > max_budget:
            continue

        # Must-have: 7 seats
        if "seven_seats" in profile.must_haves and car.get("seating_capacity", 5) < 7:
            continue

        # Must-have: sunroof
        if "sunroof" in profile.must_haves and not car.get("sunroof", False):
            continue

        # Must-have: auto transmission
        if "auto" in profile.must_haves and not car.get("auto_available", False):
            continue

        # Must-have: ADAS
        if "adas" in profile.must_haves and not car.get("adas", False):
            continue

        # Fuel filter
        if profile.fuel_preference != "no_pref":
            if profile.fuel_preference == "ev" and car.get("fuel_type") != "ev":
                continue
            elif profile.fuel_preference == "cng" and not car.get("cng_available", False) and car.get("fuel_type") != "cng":
                continue
            elif profile.fuel_preference in ("petrol", "diesel", "hybrid"):
                if car.get("fuel_type") != profile.fuel_preference:
                    continue

        # Brand filter
        if profile.brand_preference != "no_pref":
            brand_map = {
                "maruti": "Maruti Suzuki",
                "hyundai": "Hyundai",
                "tata": "Tata",
                "kia": "Kia",
                "toyota": "Toyota",
                "honda": "Honda",
                "mahindra": "Mahindra",
                "mg": "MG",
            }
            preferred = brand_map.get(profile.brand_preference, profile.brand_preference)
            if car.get("make", "").lower() != preferred.lower():
                continue

        candidates.append(car)

    # Sort by price desc (give AI most variety across budget range), cap at 20
    candidates.sort(key=lambda c: c["price_ex_showroom"], reverse=True)
    return candidates[:20]

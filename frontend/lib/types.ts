export interface UserProfile {
  city: string;
  city_type: string;
  family_type: string;
  primary_use: string;
  annual_km: string;
  parking: string;
  budget_min: number;
  budget_max: number;
  budget_stretch: string;
  loan_interested: boolean;
  down_payment_pct: number;
  loan_tenure_years: number;
  priorities: string[];
  must_haves: string[];
  fuel_preference: string;
  brand_preference: string;
}

export interface ScoreBreakdown {
  budget_fit: number;
  use_case_match: number;
  family_suitability: number;
  location_fit: number;
  priority_alignment: number;
  value_proposition: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price_ex_showroom: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  engine_cc: number;
  power_bhp: number;
  mileage_kmpl: number;
  range_km?: number;
  seating_capacity: number;
  boot_space_liters: number;
  ground_clearance_mm: number;
  ncap_rating: number;
  airbags: number;
  adas: boolean;
  sunroof: boolean;
  auto_available: boolean;
  cng_available: boolean;
  annual_service_cost_est: number;
  tags: string[];
  cardekho_url?: string;
}

export interface CarRecommendation {
  car: Car;
  match_score: number;
  rank: number;
  reasoning: string;
  trade_off: string;
  score_breakdown: ScoreBreakdown;
  emi_estimate: number | null;
}

export interface RecommendResponse {
  recommendations: CarRecommendation[];
  ai_summary: string;
  profile_insight: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  city: "",
  city_type: "",
  family_type: "",
  primary_use: "",
  annual_km: "",
  parking: "",
  budget_min: 500000,
  budget_max: 1500000,
  budget_stretch: "10pct",
  loan_interested: false,
  down_payment_pct: 20,
  loan_tenure_years: 5,
  priorities: [],
  must_haves: [],
  fuel_preference: "no_pref",
  brand_preference: "no_pref",
};

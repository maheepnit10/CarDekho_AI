from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.recommend import router as recommend_router
from services.car_service import load_cars

app = FastAPI(title="CarDekho AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router)


@app.on_event("startup")
def startup():
    load_cars()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/cars/count")
def car_count():
    from services.car_service import load_cars as lc
    return {"count": len(lc())}

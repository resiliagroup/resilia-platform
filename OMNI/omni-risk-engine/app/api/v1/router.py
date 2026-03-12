from fastapi import APIRouter
from app.api.v1.endpoints import assessments, hazards, facilities

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(assessments.router)
api_router.include_router(hazards.router)
api_router.include_router(facilities.router)

from fastapi import FastAPI
from pydantic import BaseModel
from backend import api
from backend import match_details

app = FastAPI()

class Team(BaseModel):
    id: int
    name: str

class MatchRequest(BaseModel):
    home_team: Team
    away_team: Team

@app.get("/")
def root():
    return {
        "message": "Football Analytics API is running"
    }

@app.get("/api/fixtures")
def get_fixtures(page: int = 1, competition: str = 'ALL'):
    fixtures = api.get_fixtures(competition)
    formatted_response = api.format_fixtures(fixtures, page)
    return formatted_response

@app.get("/api/results")
def get_results(page: int = 1, competition: str = 'ALL'):
    results = api.get_results(competition)
    formatted_response = api.format_results(results, page)
    return formatted_response

@app.post("/api/predict")
def predict_match(match: MatchRequest):
    home_id = match.home_team.id
    away_id = match.away_team.id

    home_name = match.home_team.name
    away_name = match.away_team.name

    match_info = match_details.get_match_details(554920, home_id, home_name, away_id, away_name, 2026, "PL") # TODO change to update season automatically
    return match_info



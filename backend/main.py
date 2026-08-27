from fastapi import FastAPI
from pydantic import BaseModel
from backend import api
from backend import match_details

app = FastAPI()

class Team(BaseModel):
    id: int
    name: str
    short_name: str
    badge: str

class MatchRequest(BaseModel):
    match_id: int
    competition: str
    competitions_code: str
    date: str
    time: str
    matchday: int
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
    match_id = match.match_id
    competition_code = match.competitions_code

    home_id = match.home_team.id
    home_name = match.home_team.name
    home_short_name = match.home_team.short_name

    away_id = match.away_team.id
    away_name = match.away_team.name
    away_short_name = match.away_team.short_name

    match_info = {
        "match_id": match_id,
        "competition_name": match.competition,
        "competition_code": competition_code,
        "matchday": match.matchday,
        "date_label": match.date,
        "time": match.time,

        "home_team": home_name,
        "away_team": away_name,
        "home_short": home_short_name,
        "away_short": away_short_name,
        "home_crest": match.home_team.badge,
        "away_crest": match.away_team.badge
    }

    match_stats = match_details.get_match_details(match_id, home_id, home_short_name, away_id, away_short_name, 2026, competition_code) # TODO change to update season automatically

    return match_info | match_stats



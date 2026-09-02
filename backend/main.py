from fastapi import FastAPI
from pydantic import BaseModel
from backend import api
from backend import match_details

app = FastAPI()

class MatchRequest(BaseModel):
    match_id: int
    date_label: str
    time: str
    matchday: int
    home_team: str
    home_short_name: str
    home_team_id: int
    home_badge: str
    away_team: str
    away_short_name: str
    away_team_id: int
    away_badge: str
    competition: str
    competition_code: str


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
    match_stats = match_details.get_match_details(
        match.match_id,
        match.home_team_id, match.home_short_name,
        match.away_team_id, match.away_short_name,
        2026, match.competition_code  # TODO: auto-update season
    )

    match_info = {
        "match_id": match.match_id,
        "competition_name": match.competition,
        "competition_code": match.competition_code,
        "matchday": match.matchday,
        "date_label": match.date_label,
        "time": match.time,
        "home_team": match.home_team,
        "away_team": match.away_team,
        "home_short": match.home_short_name,
        "away_short": match.away_short_name,
        "home_crest": match.home_badge,
        "away_crest": match.away_badge
    }

    print(match_info | match_stats)

    return match_info | match_stats



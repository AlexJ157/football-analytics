from fastapi import FastAPI
from pydantic import BaseModel
from backend import api
from prediction.src import features
from prediction.src import predict

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

    home_data = api.get_historical_data(home_id, 5, 2026) # TODO change to update season automatically
    away_data = api.get_historical_data(away_id, 5, 2026)

    home_matches = api.format_hitorical_data(home_data, home_id)
    away_matches = api.format_hitorical_data(away_data, away_id)

    match_features = features.create_match_features(home_matches, away_matches, home_name, away_name)
    prediction = predict.predict_match(match_features)

    print(prediction)
    return prediction



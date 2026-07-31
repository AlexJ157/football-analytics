from fastapi import FastAPI
from backend import api

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Football Analytics API is running"
    }

@app.get("/api/fixtures")
def get_fixtures(page: int = 1, competition: str = 'ALL'):
    fixtures = api.get_fixtures(competition)
    print(fixtures)
    formatted_response = api.format_fixtures(fixtures, page)
    print(competition)
    return formatted_response

@app.get("/api/results")
def get_results(page: int = 1, competition: str = 'ALL'):
    results = api.get_results(competition)
    formatted_response = api.format_results(results, page)
    return formatted_response
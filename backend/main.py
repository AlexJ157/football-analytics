from fastapi import FastAPI
from backend import api

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Football Analytics API is running"
    }

@app.get("/api/fixtures")
def get_fixtures(page: int = 1):
    fixtures = api.get_fixtures()
    formatted_response = api.format_fixtures(fixtures, page)
    return formatted_response

@app.get("/api/results")
def get_results(page: int = 1):
    results = api.get_results()
    formatted_response = api.format_results(results, page)
    return formatted_response
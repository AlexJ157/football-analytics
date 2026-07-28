from fastapi import FastAPI
from backend import api

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Football Analytics API is running"
    }

@app.get("/api/fixtures")
def get_fixtures():
    fixtures = api.get_fixtures()
    formatted_response = api.format_fixtures(fixtures, 1)
    return formatted_response

@app.get("/api/results")
def get_results():
    results = api.get_results()
    formatted_response = api.format_fixtures(results, 1)
    return formatted_response
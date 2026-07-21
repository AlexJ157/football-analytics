import requests
import os
from dotenv import load_dotenv 
from datetime import date, timedelta

load_dotenv()

API_TOKEN = os.getenv("FOOTBALL_API_TOKEN")

headers = {
    "X-Auth-Token": API_TOKEN
}

def get_todays_fixtures():
    response = requests.get("https://api.football-data.org/v4/matches", 
    headers=headers,
    params={
        "dateFrom": date.today(),
        "dateTo": date.today() + timedelta(days=1)
        }
    )

    todays_fixtures = response.json()
    return todays_fixtures




import requests
import os
from dotenv import load_dotenv 
import datetime

load_dotenv()

API_TOKEN = os.getenv("FOOTBALL_API_TOKEN")

headers = {
    "X-Auth-Token": API_TOKEN
}

page_number = 1

def get_matches(date_from, date_to, competition, status): # TODO test if chenging limit allows me to get more matches
    if (competition == 'ALL'):
        response = requests.get(
            "https://api.football-data.org/v4/matches",
            headers=headers,
            params={
                "dateFrom": date_from,
                "dateTo": date_to,
                "status": status,
                "limit": 500
            }
        )
    else:
        response = requests.get(
            "https://api.football-data.org/v4/matches",
            headers=headers,
            params={
                "dateFrom": date_from,
                "dateTo": date_to,
                "competitions": {competition},
                "status": status,
                "limit": 500
            }
        )


    print("STATUS:", response.status_code)
    #print("RESPONSE:", response.text)

    return response.json()

def get_fixtures(competition):
    today = datetime.date.today()
    return get_matches(today, today + datetime.timedelta(days=10), competition, "SCHEDULED") # TODO add inplay matches

def get_results(competition):
    today = datetime.date.today()
    return get_matches(today  - datetime.timedelta(days=10), today, competition, "FINISHED") # TODO check if todays results are still included


def get_past_matches(team_id, number_of_matches, current_season, competition_code):
    response = requests.get(
        f"https://api.football-data.org/v4/teams/{team_id}/matches",
        headers=headers,
        params={
            "limit": number_of_matches,
            "status": "FINISHED",
            "competitions": competition_code,
            "season": current_season
        }
    )

    if response.status_code != 200:
        print(f"[get_past_matches] FIRST REQUEST FAILED - status {response.status_code}: {response.text}")
        return {}

    data = response.json()
    matches = data["matches"]
    current_season_count = len(matches)

    if len(matches) < number_of_matches:
        matches_needed = number_of_matches - len(matches)

        response = requests.get(
            f"https://api.football-data.org/v4/teams/{team_id}/matches",
            headers=headers,
            params={
                "limit": matches_needed,
                "status": "FINISHED",
                "competitions": competition_code,
                "season": current_season - 1
            }
        )

        if response.status_code != 200:
            print(f"[get_past_matches] SECOND REQUEST FAILED - status {response.status_code}: {response.text}")
            return {}

        previous_data = response.json()
        matches += previous_data["matches"]
        matches.sort(key=lambda m: m["utcDate"], reverse=True)

    return {
        "matches": matches,
        "current_season_count": current_season_count
    }

def get_head_to_head(match_id, limit=5):
    response = requests.get(
        f"https://api.football-data.org/v4/matches/{match_id}/head2head",
        headers=headers,
        params={
            "limit": limit
        }
    )

    if response.status_code != 200:
        print(f"[get_head_to_head] REQUEST FAILED - status {response.status_code}: {response.text}")
        return {}

    h2h_data = response.json()
    return h2h_data

def get_top_scorers(competition_id, season, limit=200):
    response = requests.get(
        f"https://api.football-data.org/v4/competitions/{competition_id}/scorers",
        headers=headers,
        params={
            "limit": limit,
            "season": season
        }
    )

    if response.status_code != 200:
        print(f"[get_top_scorers] REQUEST FAILED - status {response.status_code}: {response.text}")
        return {}
    
    top_scorers_data = response.json()
    return top_scorers_data

import json
from pathlib import Path
from datetime import date, timedelta
from backend import api
import time

STATE_PATH = Path(__file__).parent.parent / "data" / "elo_state.json"
MAX_LOOKBACK_DAYS = 60
NAME_MAP = {
    "Coventry City": "Coventry",
    "Hull City": "Hull",
    "Ipswich Town": "Ipswich",
    "Nottingham": "Nottingham Forest",
    "Leeds United": "Leeds",
    "Brighton Hove": "Brighton",
}

def to_csv_name(api_name):
    return NAME_MAP.get(api_name, api_name)

def expected_score(home_elo, away_elo, home_advantage):
    effective_home_elo = home_elo + home_advantage
    rating_difference = away_elo - effective_home_elo
    expected = 1 / (1 + 10**(rating_difference / 400))
    return expected

def update_ratings(rating, expected, actual, k_factor):
    rating_change = k_factor * (actual - expected)
    new_rating = rating + rating_change
    return new_rating

def update_match_ratings(home_elo, away_elo, result, k_factor, home_advantage):
    home_expected = expected_score(home_elo, away_elo, home_advantage)
    away_expected = 1- home_expected

    if result == "H":
        home_actual = 1
        away_actual = 0
    elif result == "D":
        home_actual = 0.5
        away_actual = 0.5
    elif result == "A":
        home_actual = 0
        away_actual = 1

    # new home rating
    new_home_elo = update_ratings(home_elo, home_expected, home_actual, k_factor)

    # new away rating
    new_away_rating = update_ratings(away_elo, away_expected, away_actual, k_factor)

    return (new_home_elo, new_away_rating)

def initialise_team(team, ratings):
    if team not in ratings:
        ratings[team] = 1500

def regress_ratings(ratings, factor=0.75):
    for team in ratings:
        ratings[team] = 1500 + factor * (ratings[team] - 1500)

def process_match(home_team, away_team, result, ratings):
    if home_team not in ratings:
        initialise_team(home_team, ratings)
    if away_team not in ratings:
        initialise_team(away_team, ratings)

    home_elo = ratings.get(home_team)
    away_elo = ratings.get(away_team)

    new_home_elo, new_away_elo = update_match_ratings(home_elo, away_elo, result, 30, 100) # TODO change k_factor and home_adv

    ratings[home_team] = new_home_elo
    ratings[away_team] = new_away_elo

    return [(new_home_elo, home_elo), (new_away_elo, away_elo)]


def load_elo_state():
    if not STATE_PATH.exists():
        print("Path doesnt exist")
        return {"ratings": {}, "processed_match_ids": [], "last_updated": None}
    
    with open(STATE_PATH) as f:
        return json.load(f)

def save_elo_state(state):
    STATE_PATH.parent.mkdir(parents= True, exist_ok= True)
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent= 2)

def fetch_finished_matches_since(last_updated):
    if last_updated is None:
        start = date.today() - timedelta(days=MAX_LOOKBACK_DAYS)
    else:
        start = date.fromisoformat(last_updated)

    earliest_allowed = date.today() - timedelta(days=MAX_LOOKBACK_DAYS)
    start = max(start, earliest_allowed)

    end = date.today() + timedelta(days=1)

    all_matches = []
    current = start
    num_chunks = 0

    while current < end:
        chunk_end = min(current + timedelta(days=10), end)
        data = api.get_matches(current, chunk_end, "PL", "FINISHED")
        all_matches.extend(data["matches"])
        current = chunk_end
        num_chunks += 1
        if current < end:
            time.sleep(10)

    return all_matches, num_chunks

def sync_elo_ratings():
    state = load_elo_state()
    all_matches, num_chunks = fetch_finished_matches_since(state["last_updated"])

    for match in all_matches:
        if match["id"] in state["processed_match_ids"]:
            continue
        else:
            if match["score"]["winner"] == "HOME_TEAM":
                result = "H"
            elif match["score"]["winner"] == "DRAW":
                result = "D"
            elif match["score"]["winner"] == "AWAY_TEAM":
                result = "A"

            home_team = to_csv_name(match["homeTeam"]["shortName"])
            away_team = to_csv_name(match["awayTeam"]["shortName"])

            elos = process_match(home_team, away_team, result, state["ratings"])

            new_home_elo, home_elo = elos[0]
            new_away_elo, away_elo = elos[1]

            state["ratings"][home_team] = new_home_elo
            state["ratings"][away_team] = new_away_elo
            state["processed_match_ids"].append(match["id"])

    state["last_updated"] = str(date.today())
    save_elo_state(state)

    if num_chunks > 3:
        # buffer before other api calls to prevent overloading
        time.sleep(15)



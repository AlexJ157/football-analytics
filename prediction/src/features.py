import json
import pandas as pd
from pathlib import Path
#from prediction.src import elo

def calculate_form(matches, n):
    recent_matches = matches[:n]
    points = 0

    for m in recent_matches:
        if m['result'] == 'W':
            points += 3
        elif m['result'] == 'D':
            points += 1

    return points


def calculate_average_goals_scored(matches, n):
    recent_matches = matches[:n]
    total_scored = 0

    for m in recent_matches:
        total_scored += m['goals_scored']

    average_goals_scored = total_scored / n
    return average_goals_scored


def calculate_average_goals_conceded(matches, n):
    recent_matches = matches[:n]
    total_conceded = 0

    for m in recent_matches:
        total_conceded += m['goals_conceded']

    average_goals_conceded = total_conceded / n
    return average_goals_conceded

# TODO have to update elos live
def calculate_elo(team_name):
    elo_path = Path(__file__).resolve().parent.parent / "data" / "current_elos.json"
    with open(elo_path, "r") as f:
        ratings = json.load(f)

    elo = ratings[team_name]
    return elo



def calculate_team_features(matches, team_name):
    return {
        'Form3': calculate_form(matches, 3),
        'Form5': calculate_form(matches, 5),
        'AvgGoalsScored5': calculate_average_goals_scored(matches, 5),
        'AvgGoalsConceded5': calculate_average_goals_conceded(matches, 5),
        'Elo': calculate_elo(team_name)
    }
   


def create_match_features(home_matches, away_matches, home_team, away_team):
    home = calculate_team_features(home_matches, home_team)
    away = calculate_team_features(away_matches, away_team)

    features = {
        'Form3Home': home['Form3'],
        'Form5Home': home['Form5'],
        'Form3Away': away['Form3'],
        'Form5Away': away['Form5'],
        'HomeAvgGoalsScored5': home['AvgGoalsScored5'],
        'HomeAvgGoalsConceded5': home['AvgGoalsConceded5'],
        'AwayAvgGoalsScored5': away['AvgGoalsScored5'],
        'AwayAvgGoalsConceded5': away['AvgGoalsConceded5'],
        'HomeElo': home['Elo'],
        'AwayElo': away['Elo'],
        'EloDifference': home['Elo'] - away['Elo'],
        'FormDifference': home['Form5'] - away['Form5'],
        'AvgGoalsScoredDifference5': home['AvgGoalsScored5'] - away['AvgGoalsScored5'],
        'AvgGoalsConcededDifference5': home['AvgGoalsConceded5'] - away['AvgGoalsConceded5']
    }

    return pd.DataFrame([features])
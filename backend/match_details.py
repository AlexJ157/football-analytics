from datetime import datetime
from backend import api
from prediction.src import features
from prediction.src import predict

def get_match_details(match_id, home_id, home_name, away_id, away_name, season, competition_id):
    home_data = api.get_past_matches(home_id, 5, season) 
    away_data = api.get_past_matches(away_id, 5, season)

    home_matches = format_past_matches(home_data, home_id)
    away_matches = format_past_matches(away_data, away_id)

    # prediction
    match_features = features.create_match_features(home_matches, away_matches, home_name, away_name)
    prediction = predict.predict_match(match_features)

    # form
    home_form = []
    away_form = []
    for m in home_matches:
        home_form.append(m["result"])

    for m in away_matches:
        away_form.append(m["result"])

    # h2h
    h2h_data = api.get_head_to_head(match_id, 5)
    h2h = format_head_to_head(h2h_data)

    # top scorers
    scorer_data = api.get_top_scorers(competition_id, season)
    top_scorers = format_top_scorers(scorer_data, home_id, away_id)

    return {
        "prob_home": prediction["home_win_probability"],
        "prob_draw": prediction["draw_probability"],
        "prob_away": prediction["away_win_probability"],

        "home_form": home_form,
        "away_form": away_form,

        "got_h2h_data": h2h["got_h2h_data"],
        "h2h_summary": h2h["summary"],
        "h2h_meetings": h2h["meetings"],

        "home_top_scorers": top_scorers["home_top_scorers"],
        "away_top_scorers": top_scorers["away_top_scorers"]
    }
    

def format_past_matches(data, team_id):
    formatted_data = []

    for match in data['matches']:
        match_dict = {}

        if match['homeTeam']['id'] == team_id:
            venue = 'home'
            opponent = 'away'
        elif match['awayTeam']['id'] == team_id:
            venue = 'away'
            opponent = 'home'

        if match["score"]["winner"] == "DRAW":
            result = "D"

        elif match["score"]["winner"] == "HOME_TEAM":
            result = "W" if venue == "home" else "L"

        elif match["score"]["winner"] == "AWAY_TEAM":
            result = "W" if venue == "away" else "L"

        match_dict['result'] = result
        match_dict['goals_scored'] = match["score"]["fullTime"][venue]
        match_dict['goals_conceded'] = match['score']['fullTime'][opponent]

        formatted_data.append(match_dict)

    return formatted_data


def format_head_to_head(h2h_data):
    if not h2h_data:
        return {
            "got_h2h_data": False,
            "summary": {},
            "meetings": []
        }

    h2h_summary = {}

    h2h_summary["home_wins"] = h2h_data["aggregates"]["homeTeam"]["wins"]
    h2h_summary["draws"] = h2h_data["aggregates"]["homeTeam"]["draws"]
    h2h_summary["away_wins"] = h2h_data["aggregates"]["awayTeam"]["wins"]

    h2h_meetings = []

    for m in h2h_data["matches"]:
        meeting = {}

        meeting["home_team"] = m["homeTeam"]["name"]
        meeting["away_team"] = m["awayTeam"]["name"]

        date = datetime.fromisoformat(m["utcDate"])
        meeting["date_label"] = date.strftime("%B %Y")

        meeting["competition"] = m["competition"]["name"]

        meeting["score"] = (str(m["score"]["fullTime"]["home"]) + "-" + str(m["score"]["fullTime"]["away"]))

        h2h_meetings.append(meeting)

    return {
        "got_h2h_data": True,
        "summary": h2h_summary,
        "meetings": h2h_meetings
    }


def format_top_scorers(data, home_id, away_id, number_of_scorers=3):
    home_scorers = []
    away_scorers = []

    for scorer in data["scorers"]:
        if scorer["team"]["id"] == home_id and len(home_scorers) < number_of_scorers:
            home_scorers.append({
                "name": scorer["player"]["name"],
                "goals": scorer["goals"]
            })

        elif scorer["team"]["id"] == away_id and len(away_scorers) < number_of_scorers:
            away_scorers.append({
                "name": scorer["player"]["name"],
                "goals": scorer["goals"]
            })

        if len(home_scorers) == number_of_scorers and len(away_scorers) == number_of_scorers:
            break

    return {
        "home_top_scorers": home_scorers,
        "away_top_scorers": away_scorers
    }

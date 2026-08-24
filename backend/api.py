import requests
import os
from dotenv import load_dotenv 
import datetime
import calendar

load_dotenv()

API_TOKEN = os.getenv("FOOTBALL_API_TOKEN")

headers = {
    "X-Auth-Token": API_TOKEN
}

page_number = 1

def get_matches(date_from, date_to, competition):
    if (competition == 'ALL'):
        response = requests.get(
            "https://api.football-data.org/v4/matches",
            headers=headers,
            params={
                "dateFrom": date_from,
                "dateTo": date_to
            }
        )
    else:
        response = requests.get(
            "https://api.football-data.org/v4/matches",
            headers=headers,
            params={
                "dateFrom": date_from,
                "dateTo": date_to,
                "competitions": {competition}
            }
        )


    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response.json()

def get_fixtures(competition):
    today = datetime.date.today() + datetime.timedelta(days=30)
    return get_matches(today, today + datetime.timedelta(days=10), competition)

def get_results(competition):
    today = datetime.date.today() + datetime.timedelta(days=30)
    return get_matches(today  - datetime.timedelta(days=10), today, competition)

def format_match(match):
    formatted_match = {}

    formatted_match['match_id'] = match['id']

    # format date
    full_date_time = match['utcDate']

    date_string = full_date_time.split('T')[0]
    split_date = date_string.split('-')

    year = int(split_date[0])
    month_number = int(split_date[1])
    day_number = int(split_date[2])

    month_name = calendar.month_name[month_number]
    match_day = datetime.date(year, month_number, day_number)
    day = match_day.strftime("%A")

    time_string = full_date_time.split('T')[1]
    match_time = time_string.split(":")[0] + ":" + time_string.split(':')[1]

    if date_string == datetime.date.today():
        date_label = 'Today'
    elif date_string == datetime.date.today() + datetime.timedelta(days=1):
        date_label = 'Tomorrow'
    else:
        date_label = day + ', ' + str(day_number) + " " + month_name

    formatted_match['date_label'] = date_label
    formatted_match['time'] = match_time

    # Other data
    formatted_match['home_team'] = match['homeTeam']['name']
    formatted_match['home_team_id'] = match['homeTeam']['id']

    formatted_match['away_team'] = match['awayTeam']['name']
    formatted_match['away_team_id'] = match['awayTeam']['id']

    formatted_match['competition'] = match['competition']['name']

    return formatted_match

def format_fixtures(fixtures, page_number):
    formatted_fixtures = []
    
    # add logic for which to display
    
    starting_index = (page_number * 10) - 10
    number_of_fixtures = fixtures['resultSet']['count']

    if page_number * 10 < number_of_fixtures:
        has_more = True
        ending_index = (page_number * 10)
    else:
        has_more = False
        ending_index = number_of_fixtures

    for match in fixtures['matches'][starting_index:ending_index]:
        formatted_match = format_match(match)
        formatted_fixtures.append(formatted_match)

    return {
            "page": page_number,
            "has_more": has_more,
            "matches": formatted_fixtures
        }
    

def format_results(results, page_number):
    formatted_results = []

    # add logic for which to display
    
    starting_index = (page_number * 10) - 10
    number_of_fixtures = results['resultSet']['count']

    if page_number * 10 < number_of_fixtures:
        has_more = True
        ending_index = (page_number * 10)
    else:
        has_more = False
        ending_index = number_of_fixtures

    for match in results['matches'][starting_index:ending_index]:
        formatted_match = format_match(match)
        formatted_match['winner'] = match['score']['winner']
        home_goals = str(match['score']['fullTime']['home'])
        away_goals = str(match['score']['fullTime']['away'])

        score = home_goals + " - " + away_goals
        formatted_match['score'] = score
        formatted_results.append(formatted_match)

    return {
        "page": page_number,
        "has_more": has_more,
        "matches": formatted_results
    }

def get_historical_data(team_id, number_of_matches, current_season):
    response = requests.get(
        f"https://api.football-data.org/v4/teams/{team_id}/matches",
        headers=headers,
        params={
            "limit": number_of_matches,
            "status": "FINISHED",
            "competitions": "PL",
            "season": current_season
        }
    )

    data = response.json()

    matches = data["matches"]

    if len(matches) < number_of_matches:

        matches_needed = number_of_matches - len(matches)

        response = requests.get(
            f"https://api.football-data.org/v4/teams/{team_id}/matches",
            headers=headers,
            params={
                "limit": matches_needed,
                "status": "FINISHED",
                "competitions": "PL",
                "season": current_season - 1
            }
        )

        previous_data = response.json()

        matches += previous_data["matches"]

    return {
        "matches": matches
    }


def format_hitorical_data(data, team_id):
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




        

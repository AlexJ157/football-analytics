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

def get_matches(date_from, date_to):
    response = requests.get(
        "https://api.football-data.org/v4/matches",
        headers=headers,
        params={
            "dateFrom": date_from,
            "dateTo": date_to
        }
    )

    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response.json()


def get_fixtures():
    today = datetime.date.today()
    return get_matches(today, today + datetime.timedelta(days=10))

def get_results():
    today = datetime.date.today()
    return get_matches(today  - datetime.timedelta(days=10), today)

def format_fixtures(fixtures, page_number):
    formatted_response = {}
    formatted_fixtures = []

    starting_index = (page_number * 10) - 10
    number_of_fixtures = fixtures['resultSet']['count']

    if page_number * 10 < number_of_fixtures:
        has_more = True
        ending_index = (page_number * 10)
    else:
        has_more = False
        ending_index = number_of_fixtures

    for match in fixtures['matches'][starting_index:ending_index]:
        formatted_match_dict = {}

        formatted_match_dict['match_id'] = match['id']

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

        formatted_match_dict['date_label'] = date_label
        formatted_match_dict['time'] = match_time

        # Other data
        formatted_match_dict['home_team'] = match['homeTeam']['name']
        formatted_match_dict['away_team'] = match['awayTeam']['name']

        formatted_match_dict['competition'] = match['competition']['name']

        formatted_fixtures.append(formatted_match_dict)

    formatted_response['page'] = page_number
    formatted_response['has_more'] = has_more
    formatted_response['matches'] = formatted_fixtures
    return formatted_response
        


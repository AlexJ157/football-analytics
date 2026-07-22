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

def get_fixtures():
    response = requests.get("https://api.football-data.org/v4/matches", 
    headers=headers,
    params={
        "dateFrom": datetime.date.today(),
        "dateTo": datetime.date.today() + datetime.timedelta(days=1)
        }
    )

    fixtures = response.json()
    return fixtures

def format_fixtures(fixtures):
    formatted_fixtures = []
    for match in fixtures['matches']:
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

        print(formatted_match_dict)
        


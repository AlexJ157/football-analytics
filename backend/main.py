import api

def get_fixtures():
    todays_fixtures = api.get_todays_fixtures()
    print(todays_fixtures)

    for match in todays_fixtures['matches']:
        home_team = match['homeTeam']['name']
        away_team = match['awayTeam']['name']
        print(home_team + " VS " + away_team)

get_fixtures()

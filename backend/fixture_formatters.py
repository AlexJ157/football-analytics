import datetime
import calendar

def format_match(match):
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

    return {
        'match_id': match['id'],
        'date_label': date_label,
        'time': match_time,
        'matchday': match['matchday'],
        'home_team': match['homeTeam']['name'],
        'home_short_name': match['homeTeam']['shortName'],
        'home_team_id': match['homeTeam']['id'],
        'home_badge': match['homeTeam']['crest'],
        'away_team': match['awayTeam']['name'],
        'away_short_name': match['awayTeam']['shortName'],
        'away_team_id': match['awayTeam']['id'],
        'away_badge': match['awayTeam']['crest'],
        'competition': match['competition']['name'],
        'competition_code': match['competition']['code']
    }

def format_fixtures(fixtures_response):
    formatted_fixtures = []
    for match in fixtures_response["matches"]:
        formatted_fixtures.append(format_match(match))

    return {
        "next_cursor": fixtures_response["next_cursor"],
        "matches": formatted_fixtures
    }

def format_results(results_response):
    formatted_results = []
    for match in results_response["matches"]:
        formatted_match = format_match(match)
        formatted_match['winner'] = match['score']['winner']
        home_goals = str(match['score']['fullTime']['home'])
        away_goals = str(match['score']['fullTime']['away'])
        formatted_match['score'] = home_goals + " - " + away_goals
        formatted_results.append(formatted_match)

    return {
        "next_cursor": results_response["next_cursor"],
        "matches": formatted_results
    }
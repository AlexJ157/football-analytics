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
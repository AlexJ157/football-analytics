ratings = {}

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

def process_match(home_team, away_team, result, ratings):
    if home_team not in ratings:
        initialise_team(home_team, ratings)
    if away_team not in ratings:
        initialise_team(away_team, ratings)

    home_elo = ratings.get(home_team)
    away_elo = ratings.get(away_team)

    new_home_elo, new_away_elo = update_match_ratings(home_elo, away_elo, result, 20, 100) # TODO change k_factor and home_adv

    ratings[home_team] = new_home_elo
    ratings[away_team] = new_away_elo

    return [(new_home_elo, home_elo), (new_away_elo, away_elo)]

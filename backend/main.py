import api

def show_fixtures():
    fixtures = api.get_fixtures()
    api.format_fixtures(fixtures)
show_fixtures()

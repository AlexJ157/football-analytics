import requests
import os
from dotenv import load_dotenv 

load_dotenv()

API_TOKEN = os.getenv("FOOTBALL_API_TOKEN")
print(API_TOKEN)

headers = {
    "X-Auth-Token": API_TOKEN
}

response = requests.get("https://api.football-data.org/v4/competitions/PL", headers=headers)

print(response.json())
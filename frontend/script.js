const sampleFixtures = {
    "page": 1,
    "has_more": true,
    "matches": [
        {"date_label": "Today", "time": "20:00", "home_team": "Arsenal FC", "away_team": "Coventry City", "competition": "Premier League"},
        {"date_label": "Today", "time": "12:30", "home_team": "Hull City", "away_team": "Manchester United", "competition": "Premier League"},
        {"date_label": "Today", "time": "21:00", "home_team": "Real Madrid", "away_team": "Girona FC", "competition": "La Liga"},
        {"date_label": "Tomorrow", "time": "15:00", "home_team": "Everton FC", "away_team": "Crystal Palace", "competition": "Premier League"},
        {"date_label": "Tomorrow", "time": "14:00", "home_team": "Manchester City", "away_team": "AFC Bournemouth", "competition": "Premier League"},
        {"date_label": "Tomorrow", "time": "18:30", "home_team": "FC Barcelona", "away_team": "Sevilla FC", "competition": "La Liga"},
        {"date_label": "Tomorrow", "time": "21:00", "home_team": "Atletico Madrid", "away_team": "Real Sociedad", "competition": "La Liga"},
        {"date_label": "Tomorrow", "time": "20:45", "home_team": "Juventus FC", "away_team": "Empoli FC", "competition": "Serie A"},
        {"date_label": "Saturday, 25 July", "time": "16:30", "home_team": "Newcastle United", "away_team": "Liverpool FC", "competition": "Premier League"},
        {"date_label": "Saturday, 25 July", "time": "15:00", "home_team": "Chelsea FC", "away_team": "Brentford FC", "competition": "Premier League"},
    ],
};

const sampleResults = {
    "page": 1,
    "has_more": true,
    "matches": [
        {"date_label": "Yesterday", "time": "20:00", "home_team": "Arsenal FC", "away_team": "Coventry City", "competition": "Premier League"},
        {"date_label": "Yesterday", "time": "12:30", "home_team": "Hull City", "away_team": "Manchester United", "competition": "Premier League"},
        {"date_label": "Yesterday", "time": "21:00", "home_team": "Real Madrid", "away_team": "Girona FC", "competition": "La Liga"},
        {"date_label": "Saturday, 25 July", "time": "15:00", "home_team": "Everton FC", "away_team": "Crystal Palace", "competition": "Premier League"},
        {"date_label": "Saturday, 25 July", "time": "14:00", "home_team": "Manchester City", "away_team": "AFC Bournemouth", "competition": "Premier League"},
        {"date_label": "Saturday, 25 July", "time": "18:30", "home_team": "FC Barcelona", "away_team": "Sevilla FC", "competition": "La Liga"},
        {"date_label": "Saturday, 25 July", "time": "21:00", "home_team": "Atletico Madrid", "away_team": "Real Sociedad", "competition": "La Liga"},
        {"date_label": "Saturday, 25 July", "time": "20:45", "home_team": "Juventus FC", "away_team": "Empoli FC", "competition": "Serie A"},
        {"date_label": "Saturday, 24 July", "time": "16:30", "home_team": "Newcastle United", "away_team": "Liverpool FC", "competition": "Premier League"},
        {"date_label": "Saturday, 24 July", "time": "15:00", "home_team": "Chelsea FC", "away_team": "Brentford FC", "competition": "Premier League"},
    ],
};

let matchesToDispay = sampleFixtures['matches']

function renderMatches(matches) {
    let lastDateLabel = "";

    for(const m of matches) {
        const container = document.getElementById("fixtures");

        // Date label
        if (m["date_label"] != lastDateLabel) {
           const labelDiv = document.createElement("div");
          labelDiv.classList.add("date-heading");
          labelDiv.textContent = m["date_label"];

          container.appendChild(labelDiv);
          lastDateLabel = m["date_label"];
        }

        // Match div
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");
        container.appendChild(matchDiv);

        // Match time span
        const matchTimespan = document.createElement("span");
        matchTimespan.classList.add("match-time");
        matchTimespan.textContent = m["time"];

        // competition tag span
        const competitionTagspan = document.createElement("span");
        competitionTagspan.classList.add('competition-tag');
        competitionTagspan.textContent = m['competition'];

        // Match time and competition tag div
        const matchDetailsDiv = document.createElement('div');
        matchDetailsDiv.classList.add('match-details-div');

        matchDetailsDiv.appendChild(matchTimespan);
        matchDetailsDiv.appendChild(competitionTagspan);
        matchDiv.appendChild(matchDetailsDiv);
        

        // Teams div
        const teamsDiv = document.createElement("div");
        teamsDiv.classList.add("teams");

        // Home team span
        const homeTeamSpan = document.createElement("span");
        homeTeamSpan.classList.add("home-team");
        homeTeamSpan.textContent = m["home_team"];

        // vs span
        const vsSpan = document.createElement("span");
        vsSpan.classList.add("vs");
        vsSpan.textContent = "vs";

        // Away team span
        const awayTeamSpan = document.createElement("span");
        awayTeamSpan.classList.add("away-team");
        awayTeamSpan.textContent = m["away_team"];

        teamsDiv.appendChild(homeTeamSpan);
        teamsDiv.appendChild(vsSpan);
        teamsDiv.appendChild(awayTeamSpan);

        matchDiv.appendChild(teamsDiv);

    }
}

renderMatches(matchesToDispay);


// Competition select event listener
const competitionSelect = document.getElementById("competition-select");

competitionSelect.addEventListener("change", () => {
  const selectedCompetition = competitionSelect.value;
  
  if (selectedCompetition == 'all') {
    renderMatches(matchesToDispay);
  }
  else {
    const sortedMatches = [];

    for (const m of matchesToDispay) {
      if (m['competition'] == selectedCompetition) {
        sortedMatches.push(m);
      }
    }
    const container = document.getElementById("fixtures");
    container.innerHTML = "";

    renderMatches(sortedMatches);
    // TODO need to make so only 10 appear maybe do on backend?
  }
});

// Fixture and result toggle event listener
const toggleButtons = document.querySelectorAll(".toggle-btn");

for (const button of toggleButtons) {
    button.addEventListener("click", () => {
      const container = document.getElementById("fixtures");
      container.innerHTML = "";

      if (button.dataset.view === "fixtures") {
        matchesToDispay = sampleFixtures["matches"];
        renderMatches(matchesToDispay);

        button.className = 'toggle-btn active'
        document.querySelector('[data-view="results"]').className = 'toggle-btn'
      }
      else if (button.dataset.view === "results") { 
        matchesToDispay = sampleResults["matches"];
        renderMatches(matchesToDispay);

        button.className = 'toggle-btn active'
        document.querySelector('[data-view="fixtures"]').className = 'toggle-btn'
      }
      competitionSelect.value = "all";
    });
}


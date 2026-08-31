const sampleMatch = {
    // ---- Header info ----
    match_id: 554920,
    competition_name: "Premier League",
    competition_code: "PL",   // used for your "prediction unavailable" check
    matchday: 3,
    date_label: "Sat, 15 Aug",
    time: "15:00 BST",

    home_team: "Manchester City",
    away_team: "Arsenal FC",
    home_short: "Man City",
    away_short: "Arsenal",
    home_crest: "https://crests.football-data.org/65.png",
    away_crest: "https://crests.football-data.org/57.png",

    // ---- Prediction ----
    prob_home: 54,
    prob_draw: 24,
    prob_away: 22,
    // no predicted_score fields — not something your model produces

    // ---- Last 5 results, per team ----
    // Each letter represents one past match result for that team, oldest to newest
    home_form: ["W", "W", "D", "W", "L"],
    away_form: ["W", "D", "W", "W", "W"],

    // ---- Head to head ----
    h2h_summary: {
        home_wins: 2,
        draws: 1,
        away_wins: 2,
    },
    h2h_meetings: [
        {
            date_label: "Feb 2026 · Premier League",
            competition: "Premier League",
            home_team: "Man City",
            away_team: "Arsenal",
            score: "3-1"

        },
        {
            date_label: "Oct 2025",
            competition: "Premier League",
            home_team: "Arsenal",
            away_team: "Man City",
            score: "1-0"
        },
        {
            date_label: "Apr 2025",
            competition: "Premier League",
            home_team: "Man City",
            away_team: "Arsenal",
            score: "4-1"

        },
    ],

    // ---- Top scorers, per team ----
    home_top_scorers: [
        { name: "E. Haaland", goals: 14 },
        { name: "P. Foden", goals: 7 },
        { name: "B. Silva", goals: 5 },
    ],
    away_top_scorers: [
        { name: "B. Saka", goals: 9 },
        { name: "G. Jesus", goals: 8 },
        { name: "M. Ødegaard", goals: 6 },
    ],
};

async function loadMatch() {
  const stored = sessionStorage.getItem("selectedMatch");
  const match = JSON.parse(stored);

  const response = await fetch("http://127.0.0.1:8000/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });

  const data = await response.json();

  renderHeader(data);
  renderPrediction(data);
  renderForm(data);
  renderHeadToHead(data);
  renderTopScorers(data);
}

function renderHeader(match) {
    // competition
    const competitionTag = document.getElementById("competition-tag");
    const competitionTagText = match["competition_name"] + " · Matchday " + match["matchday"];
    competitionTag.textContent = competitionTagText;

    // home team
    const homeCrest = document.getElementById("home-crest");
    const homeTeamName = document.getElementById("home-name");
    homeTeamName.textContent = match["home_team"];
    homeCrest.src = match["home_crest"];
    homeCrest.alt = match["home_team"] + " crest"

    // time and date
    const matchTime = document.getElementById("match-time");
    const matchDate = document.getElementById("match-date");
    matchTime.textContent = match["date_label"];
    matchDate.textContent = match["time"]


    // away team
    const awayCrest = document.getElementById("away-crest");
    const awayTeamName = document.getElementById("away-name");
    awayTeamName.textContent = match["away_team"];
    awayCrest.src = match["away_crest"];
    awayCrest.alt = match["away_team"] + " crest"
}

function renderPrediction(match) {
    // home prob
    const homeWin = document.getElementById("home-win");
    const homeProb = document.getElementById("home-prob");
    const homeWinBar = document.getElementById("home-win-bar");

    homeWin.textContent = match["home_short"] + " win";
    homeProb.textContent = match["prob_home"] + "%";
    homeWinBar.style.width = `${match["prob_home"]}%`;

    // draw prob
    const drawProb = document.getElementById("draw-prob");
    const drawWinBar = document.getElementById("draw-bar");

    drawProb.textContent = match["prob_draw"] + "%";
    drawWinBar.style.width = `${match["prob_draw"]}%`;

    // away prob
    const awayWin = document.getElementById("away-win");
    const awayProb = document.getElementById("away-prob");
    const awayWinBar = document.getElementById("away-win-bar");

    awayWin.textContent = match["away_short"] + " win";
    awayProb.textContent = match["prob_away"] + "%";
    awayWinBar.style.width = `${match["prob_away"]}%`;
}

function renderForm(match){
    // home form
    const homeFormName = document.getElementById("home-form-name");
    const homeForm = document.getElementById("home-form");
    homeFormName.textContent = match["home_team"];

    for(result of match["home_form"]) {
        const formChip = document.createElement("span");
        formChip.textContent = result;
        formChip.className = "form-chip " + result;
        homeForm.appendChild(formChip);
    }

    // away form
    const awayFormName = document.getElementById("away-form-name");
    const awayForm = document.getElementById("away-form");
    awayFormName.textContent = match["away_team"];

    for(result of match["away_form"]) {
        const formChip = document.createElement("span");
        formChip.textContent = result;
        formChip.className = "form-chip " + result;
        awayForm.appendChild(formChip);
    }
}

function renderHeadToHead(match){
    // h2h home wins
    const homeWins = document.getElementById("h2h-home-wins");
    const homeName = document.getElementById("h2h-home-name");
    homeWins.textContent = match["h2h_summary"]["home_wins"];
    homeName.textContent = match["home_team"];

    // h2h draw wins
    const draws = document.getElementById("h2h-draws");
    draws.textContent = match["h2h_summary"]["draws"];

    // h2h away wins
    const awayWins = document.getElementById("h2h-away-wins");
    const awayName = document.getElementById("h2h-away-name");
    awayWins.textContent = match["h2h_summary"]["away_wins"];
    awayName.textContent = match["away_team"];

    // past scores
    const h2hRecord = document.getElementById("h2h-record");
    for (m of match["h2h_meetings"]) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "h2h-row";

        const dateDiv = document.createElement("div");
        dateDiv.className = "h2h-date";

        const homeDiv = document.createElement("div");
        homeDiv.className = "h2h-home";

        const scoreDiv = document.createElement("div");
        scoreDiv.className = "h2h-score";

        const awayDiv = document.createElement("div");
        awayDiv.className = "h2h-away"

        dateDiv.textContent = m["date_label"];
        homeDiv.textContent = m["home_team"];
        scoreDiv.textContent = m["score"];
        awayDiv.textContent = m["away_team"];

        rowDiv.append(dateDiv, homeDiv, scoreDiv, awayDiv);
        h2hRecord.appendChild(rowDiv);
    }
}

function renderTopScorers(match){
    // home top scorers
    const homeScorers = document.getElementById("home-top-scorers");
    const homeTeam = document.getElementById("home-scorers");
    homeTeam.textContent = match["home_team"];

    for (player of match["home_top_scorers"]){
        const scorerRow = document.createElement("div")
        scorerRow.className = "scorer-row";

        const playerNameDiv = document.createElement("div");
        playerNameDiv.textContent = player["name"];

        const playerGoalsDiv = document.createElement("div");
        playerGoalsDiv.className = "scorer-goals";
        playerGoalsDiv.textContent = player["goals"];

        scorerRow.append(playerNameDiv, playerGoalsDiv);
        homeScorers.appendChild(scorerRow);
    }

    // away top scorers
    const awayScorers = document.getElementById("away-top-scorers");
    const awayTeam = document.getElementById("away-scorers");
    awayTeam.textContent = match["away_team"];

    for (player of match["away_top_scorers"]){
        const scorerRow = document.createElement("div")
        scorerRow.className = "scorer-row";

        const playerNameDiv = document.createElement("div");
        playerNameDiv.textContent = player["name"];

        const playerGoalsDiv = document.createElement("div");
        playerGoalsDiv.className = "scorer-goals";
        playerGoalsDiv.textContent = player["goals"];

        scorerRow.append(playerNameDiv, playerGoalsDiv);
        awayScorers.appendChild(scorerRow);
    }
    
}

loadMatch();
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
            date_label: "Feb 2026",
            competition: "Premier League",
            home_team: "Man City",
            away_team: "Arsenal",
            score_home: 3,
            score_away: 1,
        },
        {
            date_label: "Oct 2025",
            competition: "Premier League",
            home_team: "Arsenal",
            away_team: "Man City",
            score_home: 1,
            score_away: 0,
        },
        {
            date_label: "Apr 2025",
            competition: "Premier League",
            home_team: "Man City",
            away_team: "Arsenal",
            score_home: 4,
            score_away: 1,
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
    console.log(match["h2h_summary"]["draws"])
    draws.textContent = match["h2h_summary"]["draws"];

    // h2h away wins
    const awayWins = document.getElementById("h2h-away-wins");
    const awayName = document.getElementById("h2h-away-name");
    awayWins.textContent = match["h2h_summary"]["away_wins"];
    awayName.textContent = match["away_team"];

}


renderHeader(sampleMatch);
renderPrediction(sampleMatch);
renderForm(sampleMatch);
renderHeadToHead(sampleMatch);
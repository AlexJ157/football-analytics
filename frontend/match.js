const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

// Loading message
function showLoading(message) {
    loading.textContent = message;
    loading.classList.remove("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

// Error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "flex";
}

function hideError() {
    errorMessage.style.display = "none";
}

async function loadMatch() {
    const stored = sessionStorage.getItem("selectedMatch");
    const match = JSON.parse(stored);

    const mainEl = document.getElementById("main-element");

    showLoading("Loading match details...");
    hideError();
    mainEl.classList.add("hidden");

    try {
        const response = await fetch("http://127.0.0.1:8000/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(match)
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        renderHeader(data);
        renderPrediction(data);
        renderForm(data);
        renderHeadToHead(data);
        renderTopScorers(data);

        mainEl.classList.remove("hidden");
    }

    catch(error) {
        console.error("Failed to load results:", error);

        showError(
            "Unable to Match Details. Please try again later."
        );

    } finally {
        hideLoading();
    }
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
    const content = document.getElementById("prediction-content");
    const unavailable = document.getElementById("prediction-unavailable");

    if (!match["is_pl"]) {
        content.style.display = "none";
        unavailable.style.display = "block";
        return;
    }

    else if (!match["got_prediction_data"]) {
        content.style.display = "none";
        unavailable.style.display = "block";
        unavailable.textContent = "Unable to get Prediction data. Try again later."
        return;
    }

    content.style.display = "";
    unavailable.style.display = "none";

    // home prob
    const homeWin = document.getElementById("home-win");
    const homeProb = document.getElementById("home-prob");
    const homeWinBar = document.getElementById("home-win-bar");

    homeWin.textContent = match["home_short"] + " win";
    homeProb.textContent = `${match["prob_home"] * 100}%`;
    homeWinBar.style.width = `${match["prob_home"] * 100}%`;

    // draw prob
    const drawLbl = document.getElementById("draw-label");
    const drawProb = document.getElementById("draw-prob");
    const drawWinBar = document.getElementById("draw-bar");

    drawLbl.textContent = "Draw";
    drawProb.textContent = `${match["prob_draw"] * 100}%`;
    drawWinBar.style.width = `${match["prob_draw"] * 100}%`;

    // away prob
    const awayWin = document.getElementById("away-win");
    const awayProb = document.getElementById("away-prob");
    const awayWinBar = document.getElementById("away-win-bar");

    awayWin.textContent = match["away_short"] + " win";
    awayProb.textContent = `${match["prob_away"] * 100}%`;
    awayWinBar.style.width = `${match["prob_away"] * 100}%`;
}

function renderForm(match){
    const formContent = document.getElementById("form-content");
    const formUnavailable = document.getElementById("form-unavailable");

    if (!match["got_form_data"]) {
        formContent.style.display = "none";
        formUnavailable.style.display = "block";
        return;
    }

    formContent.style.display = "";
    formUnavailable.style.display = "none";
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
    const h2hContent = document.getElementById("h2h-content")
    const h2hUnavailable = document.getElementById("h2h-unavailable")

    if (match["got_h2h_data"] == false) {
        h2hContent.style.display = "none"
        h2hUnavailable.style.display = "block"
        return
    }

    h2hContent.style.display = ""
    h2hUnavailable.style.display = "none"

    // h2h home wins
    const homeWins = document.getElementById("h2h-home-wins");
    const homeName = document.getElementById("h2h-home-name");
    homeWins.textContent = match["h2h_summary"]["home_wins"];
    homeName.textContent = match["home_team"];

    // h2h draw wins
    const draws = document.getElementById("h2h-draws");
    const drawsLbl = document.getElementById("draws-lbl")
    draws.textContent = match["h2h_summary"]["draws"];
    drawsLbl.textContent = "Draws"

    // h2h away wins
    const awayWins = document.getElementById("h2h-away-wins");
    const awayName = document.getElementById("h2h-away-name");
    awayWins.textContent = match["h2h_summary"]["away_wins"];
    awayName.textContent = match["away_team"];

    // past scores
    const h2hRecord = document.getElementById("h2h-meetings-list");
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
    const scorersContent = document.getElementById("scorers-content")
    const scorersUnavailable = document.getElementById("scorers-unavailable")

    if (match["got_scorer_data"] == false) {
        scorersContent.style.display = "none"
        scorersUnavailable.style.display = "block"
        return
    }

    scorersContent.style.display = ""
    scorersUnavailable.style.display = "none"

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
const showMoreContainer = document.getElementById("show-more-container");
const showMoreButton = document.getElementById("show-more");
const noMoreMatches = document.getElementById("no-more-matches");
const loading = document.getElementById("loading")
const errorMessage = document.getElementById("error-message");
const pageSize = 10;

const competitionIds = {
  "Premier League": "PL",
  "Champions League": "CL",
  "La Liga": "PD",
  "Serie A": "SA",
  "Bundesliga": "BL1",
  "Ligue 1": "FL1",
  "Championship": "ELC",
  "Eredivisie": "DED",
  "Primeira Liga": "PPL",
  "Serie A Brazil": "BSA",
  "World Cup": "WC",
  "European Championships": "EC"
};

let fixturesBuffer = [];
let fixturesCursor = null;

let resultsBuffer = [];
let resultsCursor = null;

let lastDateLabel = "";

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

function renderMatch(m, linkable=false) {
  // Match div
  const matchDiv = document.createElement(linkable ? "a" : "div");
  matchDiv.classList.add("match");
  if (linkable) {
    matchDiv.href = `match.html?id=${m["match_id"]}`;
    matchDiv.addEventListener("click", () => {
      sessionStorage.setItem("selectedMatch", JSON.stringify(m));
    });
  }

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

  // Away team span
  const awayTeamSpan = document.createElement("span");
  awayTeamSpan.classList.add("away-team");
  awayTeamSpan.textContent = m["away_team"];

  teamsDiv.appendChild(homeTeamSpan);
  teamsDiv.appendChild(awayTeamSpan);

  return {
    matchDiv: matchDiv,
    teamsDiv: teamsDiv
  };
}

function renderResults(results) {
  const container = document.getElementById("matches");

  for(const m of results) {
    // Date label
    if (m["date_label"] != lastDateLabel) {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("date-heading");
      labelDiv.textContent = m["date_label"];

      container.appendChild(labelDiv);
      lastDateLabel = m["date_label"];
    }

    const { matchDiv, teamsDiv } = renderMatch(m);

    // Score span
    const scoreSpan = document.createElement('span');
    scoreSpan.classList.add("score");
    scoreSpan.textContent = m['score'];
    teamsDiv.appendChild(scoreSpan);
    
    matchDiv.appendChild(teamsDiv);

    container.appendChild(matchDiv);
  }
}

function renderFixtures(fixtures) {
  const container = document.getElementById("matches");

  for(const m of fixtures) {
    // Date label
    if (m["date_label"] != lastDateLabel) {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("date-heading");
      labelDiv.textContent = m["date_label"];

      container.appendChild(labelDiv);
      lastDateLabel = m["date_label"];
    }

    const {matchDiv, teamsDiv} = renderMatch(m, true);

    // vs span
    const vsSpan = document.createElement("span");
    vsSpan.classList.add("vs");
    vsSpan.textContent = "vs";
    teamsDiv.appendChild(vsSpan);

    matchDiv.appendChild(teamsDiv);

    container.appendChild(matchDiv);
  }
}

function updateShowMore(buffer, cursor, message) {
  showMoreContainer.style.display = "flex";

  if (buffer.length > 0 || cursor !== null) {
      showMoreButton.style.display = "block";
      noMoreMatches.style.display = "none";
  } else {
      showMoreButton.style.display = "none";
      noMoreMatches.style.display = "block";
      noMoreMatches.textContent = message;
  }
}

async function loadFixtures(competition = "ALL") {
  showMoreContainer.style.display = "none";
  showLoading("Loading fixtures...");
  hideError();

  try {
    const nextBatch = await getNextFixturesBatch(competition);
    renderFixtures(nextBatch);
    updateShowMore(fixturesBuffer, fixturesCursor, "No upcoming fixtures found.");
  } 
  catch (error) {
    console.error("Failed to load fixtures:", error);
    showError("Unable to load fixtures. Please try again later.");
  } 
  finally {
    hideLoading();
  }
}

async function getNextFixturesBatch(competition) {
  let nextBatch = [];

  if (fixturesBuffer.length >= pageSize) {
    nextBatch = fixturesBuffer.splice(0, pageSize);
  } 
  else {
    const params = new URLSearchParams({ competition });

    if (fixturesCursor !== null) {
      params.append("cursor", fixturesCursor);
    }
    
    const response = await fetch(`http://127.0.0.1:8000/api/fixtures?${params}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const data = await response.json();
    
    fixturesBuffer.push(...data["matches"]);
    fixturesCursor = data["next_cursor"];
    nextBatch = fixturesBuffer.splice(0, pageSize);
  }
  return nextBatch;
}

async function loadResults(competition = "ALL") {
  showMoreContainer.style.display = "none";
  showLoading("Loading results...");
  hideError();

  try {
    const nextBatch = await getNextResultsBatch(competition);
    renderResults(nextBatch);
    updateShowMore(resultsBuffer, resultsCursor, "No more recent results.");
  } 
  catch (error) {
    console.error("Failed to load results:", error);
    showError("Unable to load results. Please try again later.");
  } 
  finally {
    hideLoading();
  }
}

async function getNextResultsBatch(competition) {
  let nextBatch = [];
  
  if (resultsBuffer.length >= pageSize) {
    nextBatch = resultsBuffer.splice(0, pageSize);
  } 
  else {
    const params = new URLSearchParams({ competition });
  
    if (resultsCursor !== null) {
      params.append("cursor", resultsCursor);
    }
  
    const response = await fetch(`http://127.0.0.1:8000/api/results?${params}`);
  
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
  
    const data = await response.json();
  
    resultsBuffer.push(...data["matches"]);
    resultsCursor = data["next_cursor"];
    nextBatch = resultsBuffer.splice(0, pageSize);
  }
  return nextBatch;
}

function populateCompetitionDropdown() {
  const competitionSelect = document.getElementById("competition-select");

  const allOption = document.createElement("option");
  allOption.value = "ALL";
  allOption.textContent = "All Competitions";
  competitionSelect.appendChild(allOption);

  for (const [name, code] of Object.entries(competitionIds)) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      competitionSelect.appendChild(option);
  }
}

function init() {
  populateCompetitionDropdown();

  let selectedCompetition;
  if (sessionStorage.getItem("selectedCompetition") == null) {
    selectedCompetition = 'ALL';
  }
  else {
    selectedCompetition = sessionStorage.getItem("selectedCompetition");
  }
  loadFixtures(selectedCompetition);

  const competitionSelect = document.getElementById("competition-select");
  competitionSelect.value = selectedCompetition;   

  // Event Listeners

  // Fixture and result toggle event listener
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  let currentView = 'fixtures'


  for (const button of toggleButtons) {
    button.addEventListener("click", () => {
      const container = document.getElementById("matches");
      container.innerHTML = "";
      lastDateLabel = ""

      if (button.dataset.view === "fixtures") {
        fixturesBuffer = [];
        fixturesCursor = null;
        loadFixtures(selectedCompetition);

        currentView = 'fixtures';
        button.className = 'toggle-btn active';
        document.querySelector('[data-view="results"]').className = 'toggle-btn';
      }
      else if (button.dataset.view === "results") {
        resultsBuffer = [];
        resultsCursor = null;
        loadResults(selectedCompetition);

        currentView = 'results';
        button.className = 'toggle-btn active';
        document.querySelector('[data-view="fixtures"]').className = 'toggle-btn';
      }
    });
  }

  // Competition select event listener

  competitionSelect.addEventListener("change", () => {
    const container = document.getElementById("matches");

    container.innerHTML = "";
    lastDateLabel = "";
    selectedCompetition = competitionSelect.value; 
    sessionStorage.setItem("selectedCompetition", selectedCompetition);

    if (currentView == 'fixtures') {
      fixturesBuffer = [];
      fixturesCursor = null;
      loadFixtures(selectedCompetition);
    }
    else if (currentView == 'results') {
      resultsBuffer = [];
      resultsCursor = null;
      loadResults(selectedCompetition);
    }
  });

  // Show more button event listener
  showMoreButton.addEventListener("click", async () => {
    showMoreButton.style.display = "none";
    showLoading("Loading...");

    if (currentView === "fixtures") {
        await loadFixtures(selectedCompetition);
    } else {
        await loadResults(selectedCompetition);
    }

    hideLoading();
  });
}

init();
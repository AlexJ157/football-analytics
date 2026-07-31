let page = 1; // hide show more button when has_more = False
const showMoreContainer = document.getElementById("show-more-container");
const showMoreButton = document.getElementById("show-more");
const noMoreMatches = document.getElementById("no-more-matches");
const loading = document.getElementById("loading")
const errorMessage = document.getElementById("error-message");

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

function renderMatch(m) {
  // Match div
  const matchDiv = document.createElement("div");
  matchDiv.classList.add("match");
  
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
  let lastDateLabel = "";

  for(const m of results) {
    // Date label
    if (m["date_label"] != lastDateLabel) {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("date-heading");
      labelDiv.textContent = m["date_label"];

      container.appendChild(labelDiv);
      lastDateLabel = m["date_label"];
    }

    const matchDiv = renderMatch(m).matchDiv;
    const teamsDiv = renderMatch(m).teamsDiv;

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
  let lastDateLabel = "";

  for(const m of fixtures) {
    // Date label
    if (m["date_label"] != lastDateLabel) {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("date-heading");
      labelDiv.textContent = m["date_label"];

      container.appendChild(labelDiv);
      lastDateLabel = m["date_label"];
    }

    const matchDiv = renderMatch(m).matchDiv;
    const teamsDiv = renderMatch(m).teamsDiv;

    // vs span
    const vsSpan = document.createElement("span");
    vsSpan.classList.add("vs");
    vsSpan.textContent = "vs";
    teamsDiv.appendChild(vsSpan);

    matchDiv.appendChild(teamsDiv);

    container.appendChild(matchDiv);
  }
}

function updateShowMore(data, message) {
  showMoreContainer.style.display = "flex";

  if (data.has_more) {
      showMoreButton.style.display = "block";
      noMoreMatches.style.display = "none";
  } else {
      showMoreButton.style.display = "none";
      noMoreMatches.style.display = "block";
      noMoreMatches.textContent = message;
  }
}

async function loadFixtures(page = 1, competition = "ALL") {
    showMoreContainer.style.display = "none";
    showLoading("Loading fixtures...");
    hideError();

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/fixtures?page=${page}&competition=${competition}`
        );

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        renderFixtures(data["matches"]);

        updateShowMore(
            data,
            "There are no more fixtures in the next 10 days."
        );

    } catch (error) {
        console.error("Failed to load fixtures:", error);

        showError(
            "Unable to load fixtures. Please try again later."
        );

    } finally {
        hideLoading();
    }
}

async function loadResults(page = 1, competition = "ALL") {
    showMoreContainer.style.display = "none";
    showLoading("Loading results...");
    hideError();

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/results?page=${page}&competition=${competition}`
        );

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        renderResults(data["matches"]);

        updateShowMore(
            data,
            "There are no more results in the next 10 days."
        );

    } catch (error) {
        console.error("Failed to load results:", error);

        showError(
            "Unable to load results. Please try again later."
        );

    } finally {
        hideLoading();
    }
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
  loadFixtures();

  // Event Listeners

  // Fixture and result toggle event listener - need to hide show more when switching
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  let currentView = 'fixtures'
  let currentCompetition = 'ALL'

  for (const button of toggleButtons) {
      button.addEventListener("click", () => {
        const container = document.getElementById("matches");
        container.innerHTML = "";

        if (button.dataset.view === "fixtures") {
          loadFixtures(1, currentCompetition)
          currentView = 'fixtures'
          button.className = 'toggle-btn active'
          document.querySelector('[data-view="results"]').className = 'toggle-btn'
        }

        else if (button.dataset.view === "results") { 
          loadResults(1, currentCompetition)
          currentView = 'results'
          button.className = 'toggle-btn active'
          document.querySelector('[data-view="fixtures"]').className = 'toggle-btn'
        }
      });
  }

  // Competition select event listener
  const competitionSelect = document.getElementById("competition-select");

  competitionSelect.addEventListener("change", () => {
    const selectedCompetition = competitionSelect.value;
    const selectedCompetitionId = competitionIds[selectedCompetition

    ]
    const container = document.getElementById("matches");
    container.innerHTML = "";
    
    if (currentView == 'fixtures') {
      loadFixtures(1, selectedCompetition);
    }
    else if (currentView == 'results') {
      loadResults(1, selectedCompetition)
    }
  });

  // Show more button event listener
  showMoreButton.addEventListener("click", async () => {
    page += 1;

    // Hide button and show loading
    showMoreButton.style.display = "none";
    showLoading("Loading...");

    if (currentView === "fixtures") {
        await loadFixtures(page, currentCompetition);
    } else {
        await loadResults(page, currentCompetition);
    }

    // Hide loading
    hideLoading();
  });
}

init();


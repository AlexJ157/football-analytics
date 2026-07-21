const sampleMatches = [
    { home: "Arsenal FC", away: "Coventry City", time: "Fri Aug 21, 8:00 PM BST",
      prob: { home: 83.2, draw: 11.7, away: 5.1 } },
    { home: "Hull City", away: "Manchester United", time: "Sat Aug 22, 12:30 PM BST",
      prob: { home: 12.6, draw: 19.3, away: 68.1 } },
    { home: "Everton FC", away: "Crystal Palace", time: "Sat Aug 22, 3:00 PM BST",
      prob: { home: 44.8, draw: 27.3, away: 27.9 } },
    { home: "Manchester City", away: "AFC Bournemouth", time: "Sun Aug 23, 2:00 PM BST",
      prob: { home: 66.1, draw: 18.2, away: 15.7 } },
    { home: "Newcastle United", away: "Liverpool FC", time: "Sun Aug 23, 4:30 PM BST",
      prob: { home: 32.8, draw: 24.4, away: 42.8 } },
  ];

function renderMatches(matches) {
    for(const m of matches) {
        const container = document.getElementById("fixtures");

        // Match div
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");
        container.appendChild(matchDiv);

        // Match time div
        const matchTimeDiv = document.createElement("div");
        matchTimeDiv.classList.add("match-time");
        matchDiv.appendChild(matchTimeDiv);
        matchTimeDiv.textContent = m["time"];

        // Teams div
        const teamsDiv = document.createElement("div");
        teamsDiv.classList.add("teams");

        // Home team span
        const homeTeamSpan = document.createElement("span");
        homeTeamSpan.classList.add("home-team");
        homeTeamSpan.textContent = m["home"];

        // vs span
        const vsSpan = document.createElement("span");
        vsSpan.classList.add("vs");
        vsSpan.textContent = "vs";

        // Away team span
        const awayTeamSpan = document.createElement("span");
        awayTeamSpan.classList.add("away-team");
        awayTeamSpan.textContent = m["away"];

        teamsDiv.appendChild(homeTeamSpan);
        teamsDiv.appendChild(vsSpan);
        teamsDiv.appendChild(awayTeamSpan);

        matchDiv.appendChild(teamsDiv);

    }

}
renderMatches(sampleMatches)
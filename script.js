const sheetURL = "https://opensheet.elk.sh/https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Equipes/Equipes";

fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
    displayGroups(data);
  });

function displayGroups(teams) {
  const container = document.getElementById("groups");
  const groups = {};

  teams.forEach(team => {
    const poule = team.Poule;
    if (!groups[poule]) {
      groups[poule] = [];
    }
    groups[poule].push(team);
  });
  
  for (const poule in groups) {
    const groupDiv = document.createElement("div");
    groupDiv.innerHTML = `<h3>Poule ${poule}</h3>`;
    groups[poule].forEach(team => {
      const teamDiv = document.createElement("div");
      teamDiv.className = "team";
      teamDiv.innerText = team["Nom de l’equipe"];
      teamDiv.title = `${team["Joueur 1"]} & ${team["Joueur 2"]}`;
      groupDiv.appendChild(teamDiv);
    });
    container.appendChild(groupDiv);
  }
}

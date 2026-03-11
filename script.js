const sheetURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Equipes";

fetch(sheetURL)
.then(response => response.json())
.then(data => {
displayGroups(data);
});

function displayGroups(teams){

const container = document.getElementById("groups");

const groups = {};

teams.forEach(team => {

const poule = team.Poule;

if(!groups[poule]){
groups[poule] = [];
}

groups[poule].push(team);

});

for(const poule in groups){

const card = document.createElement("div");
card.className = "group-card";

const title = document.createElement("div");
title.className = "group-title";
title.innerText = "Poule " + poule;

card.appendChild(title);

const header = document.createElement("div");
header.className = "group-header";

header.innerHTML = `
<div>Equipe</div>
<div>V/D</div>
<div>Manches</div>
`;

card.appendChild(header);

groups[poule].forEach(team => {

const row = document.createElement("div");
row.className = "team-row";

const info = document.createElement("div");
info.className = "team-info";

const name = document.createElement("div");
name.className = "team-name";
name.innerText = team["Nom de l’equipe"];

const stats = document.createElement("div");
stats.className = "team-stats";
stats.innerText = team["Victoires"] + " / " + team["Defaites"];

const manches = document.createElement("div");
manches.className = "team-stats";
manches.innerText = team["Manches"];

info.appendChild(name);
info.appendChild(stats);
info.appendChild(manches);

row.appendChild(info);

const players = document.createElement("div");
players.className = "players";
players.innerText = team["Joueur 1"] + " & " + team["Joueur 2"];

row.appendChild(players);

row.addEventListener("click", () => {

if(row.classList.contains("open")){
row.classList.remove("open");
}else{
row.classList.add("open");
}

});

card.appendChild(row);

});

container.appendChild(card);

}

}

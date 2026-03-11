const sheetURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Equipes";

fetch(sheetURL)
.then(response => response.json())
.then(data => displayGroups(data));

function displayGroups(teams){

const container = document.getElementById("groups");
container.innerHTML = "";

const groups = {};

teams.forEach(team => {

const poule = team.Poule;

if(!groups[poule]) groups[poule] = [];

groups[poule].push(team);

});

Object.keys(groups).forEach(poule => {

const card = document.createElement("div");
card.className = "group-card";

const title = document.createElement("div");
title.className = "group-title";
title.textContent = "Poule " + poule;

card.appendChild(title);

const header = document.createElement("div");
header.className = "group-header";

header.innerHTML = `
<div>Equipe</div>
<div>V/D</div>
<div>Manches</div>
`;

card.appendChild(header);

/* SORT BY CLASSEMENT */

groups[poule].sort((a,b) => Number(a.Classement) - Number(b.Classement));

groups[poule].forEach((team,index) => {

let medal = "";
if(index === 0) medal = "🥇 ";
if(index === 1) medal = "🥈 ";
if(index === 2) medal = "🥉 ";

const row = document.createElement("div");
row.className = "team-row";

row.innerHTML = `

<div class="team-main">

<div class="team-name">
${medal}${team["Nom de l’equipe"]}
</div>

<div class="team-vd">
<span class="wins">${team["Victoires"]}</span>
/
<span class="losses">${team["Defaites"]}</span>
</div>

<div class="team-manches">
${team["Manches"]}
</div>

</div>

<div class="players">
${team["Joueur 1"]} & ${team["Joueur 2"]}
</div>
`;

row.addEventListener("click", () => {
row.classList.toggle("open");
});

card.appendChild(row);

});

container.appendChild(card);

});

}

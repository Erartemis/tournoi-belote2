const sheetURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Equipes";
const matchesURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Poules";

fetch(sheetURL)
.then(response => response.json())
.then(data => displayGroups(data));
fetch(matchesURL)
.then(r=>r.json())
.then(data=>displayMatches(data));

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

/* HEADER */

const header = document.createElement("div");
header.className = "table-row header-row";

header.innerHTML = `
<div>Equipe</div>
<div>V/D</div>
<div>Manches</div>
`;

card.appendChild(header);

/* SORT BY CLASSEMENT */

groups[poule].sort((a,b)=>Number(a.Classement)-Number(b.Classement));

groups[poule].forEach((team,index)=>{

let medal = "";
if(index===0) medal="🥇 ";
if(index===1) medal="🥈 ";
if(index===2) medal="🥉 ";

const row = document.createElement("div");
row.className="team-row";

row.innerHTML = `

<div class="table-row">

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

row.addEventListener("click",()=>{
row.classList.toggle("open");
});

card.appendChild(row);

});

container.appendChild(card);

});

}

function displayMatches(matches){

const container = document.getElementById("matches");
container.innerHTML="";

const groups = {};

matches.forEach(match=>{

const poule = match.Poule;

if(!groups[poule]) groups[poule]=[];

groups[poule].push(match);

});

Object.keys(groups).forEach(poule=>{

const card = document.createElement("div");
card.className="group-card";

card.innerHTML = `<div class="group-title">Poule ${poule}</div>`;

groups[poule].forEach(match=>{

const block = document.createElement("div");
block.className="match-card";

block.innerHTML = `

<div class="team-line">
<div>${match["Equipe A"]}</div>
<div class="scores">
${match["Partie 1-score A"] || ""}
${match["Partie 2-score A"] || ""}
${match["Partie 3-score A"] || ""}
</div>
</div>

<div class="team-line bold">
<div>${match["Equipe B"]}</div>
<div class="scores">
${match["Partie 1-score B"] || ""}
${match["Partie 2-score B"] || ""}
${match["Partie 3-score B"] || ""}
</div>
</div>

`;

card.appendChild(block);

});

container.appendChild(card);

});

}

/* WINTER MODE BUTTON */

const winterButton = document.getElementById("winterToggle");

winterButton.addEventListener("click",()=>{

document.body.classList.toggle("winter");

if(document.body.classList.contains("winter")){
winterButton.textContent="Mode Hiver ON ❄️";
}else{
winterButton.textContent="Mode Hiver OFF";
}

});

const snowContainer = document.getElementById("snow-container");

function createSnowflake(){

const flake = document.createElement("div");

flake.className="snowflake";
flake.innerHTML="❄";

/* RANDOM START POSITION */

const startX = Math.random()*100;
flake.style.left=startX+"vw";

/* RANDOM SIZE */

flake.style.fontSize = (Math.random()*14+8)+"px";

/* RANDOM WIND DRIFT */

const drift = (Math.random()*120 - 60) + "px";

flake.style.setProperty("--startX","0px");
flake.style.setProperty("--drift", drift);

/* RANDOM SPEED */

const duration = Math.random()*6+6;
flake.style.animationDuration = duration+"s";

snowContainer.appendChild(flake);

setTimeout(()=>{
flake.remove();
},duration*1000);

}

/* CONTINUOUS SNOW */

setInterval(()=>{

if(document.body.classList.contains("winter")){
createSnowflake();
}

},120);

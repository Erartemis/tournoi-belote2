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

matches.forEach(m=>{

if(!groups[m.Poule]) groups[m.Poule]=[];
groups[m.Poule].push(m);

});

Object.keys(groups).forEach(poule=>{

const card = document.createElement("div");
card.className="group-card";

card.innerHTML = `<div class="group-title">Poule ${poule}</div>`;

/* SORT played first */

groups[poule].sort((a,b)=>{

const playedA = Number(a.ManchesA) + Number(a.ManchesB);
const playedB = Number(b.ManchesA) + Number(b.ManchesB);

return playedB - playedA;

});

groups[poule].forEach(match=>{

const mA = Number(match.ManchesA);
const mB = Number(match.ManchesB);

const block = document.createElement("div");
block.className="match-card";

/* MATCH TO PLAY */

if(mA===0 && mB===0){

block.innerHTML=`
<div class="match-to-play">
${match["Equipe A"]} vs ${match["Equipe B"]}
<br>
<span>Match à jouer</span>
</div>
`;

card.appendChild(block);
return;

}

/* WINNER */

let classA="";
let classB="";

if(mA>mB) classA="winner";
if(mB>mA) classB="winner";

/* SCORE FUNCTION */

function s(a,b){

if(a>b) return `<span class="score-win">${a}</span>`;
if(a<b) return `<span class="score-lose">${a}</span>`;
return `<span>${a}</span>`;

}

/* BUILD SCORES */

let rowA = `
${s(match["Partie 1-score A"],match["Partie 1-score B"])}
${s(match["Partie 2-score A"],match["Partie 2-score B"])}
`;

let rowB = `
${s(match["Partie 1-score B"],match["Partie 1-score A"])}
${s(match["Partie 2-score B"],match["Partie 2-score A"])}
`;

/* SHOW 3rd ONLY IF NEEDED */

if(mA===2 && mB===1 || mA===1 && mB===2){

rowA += s(match["Partie 3-score A"],match["Partie 3-score B"]);
rowB += s(match["Partie 3-score B"],match["Partie 3-score A"]);

}

block.innerHTML=`

<div class="team-line ${classA}">
<div class="team-name-break">${match["Equipe A"]}</div>
<div class="scores">${rowA}</div>
</div>

<div class="team-line ${classB}">
<div class="team-name-break">${match["Equipe B"]}</div>
<div class="scores">${rowB}</div>
</div>

`;

card.appendChild(block);

});

container.appendChild(card);

});

}

/* WINNER */

let teamAClass="";
let teamBClass="";

const totalA = Number(match["Score A"]);
const totalB = Number(match["Score B"]);

if(totalA > totalB) teamAClass="winner";
if(totalB > totalA) teamBClass="winner";

/* SCORE FORMAT */

function scoreSpan(a,b){

if(a>b) return `<span class="score-win">${a}</span>`;
if(a<b) return `<span class="score-lose">${a}</span>`;

return `<span>${a}</span>`;

}

/* BUILD SCORE ROW */

let scoreRowA = `
${scoreSpan(sA1,sB1)}
${scoreSpan(sA2,sB2)}
`;

let scoreRowB = `
${scoreSpan(sB1,sA1)}
${scoreSpan(sB2,sA2)}
`;

/* ONLY SHOW 3RD IF PLAYED */

if(!(sA3===0 && sB3===0)){

scoreRowA += scoreSpan(sA3,sB3);
scoreRowB += scoreSpan(sB3,sA3);

}

block.innerHTML = `

<div class="team-line ${teamAClass}">
<div class="team-name-break">${match["Equipe A"]}</div>
<div class="scores">${scoreRowA}</div>
</div>

<div class="team-line ${teamBClass}">
<div class="team-name-break">${match["Equipe B"]}</div>
<div class="scores">${scoreRowB}</div>
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

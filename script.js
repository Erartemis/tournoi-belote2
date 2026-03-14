const teamsURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Equipes";

const matchesURL =
"https://opensheet.elk.sh/1OymoDdg0LEqvOS2K-SBzBHNEjeOK9cQIMZIf1sysQuA/Poules";


/* LOAD TEAMS */

fetch(teamsURL)
.then(r=>r.json())
.then(data=>displayGroups(data));


/* LOAD MATCHES */

fetch(matchesURL)
.then(r=>r.json())
.then(data=>displayMatches(data));


/* DISPLAY GROUPS */

function displayGroups(teams){

const container = document.getElementById("groups");
container.innerHTML="";

const groups={};

teams.forEach(t=>{

if(!groups[t.Poule]) groups[t.Poule]=[];
groups[t.Poule].push(t);

});

Object.keys(groups).forEach(poule=>{

const card=document.createElement("div");
card.className="group-card";

card.innerHTML=`<div class="group-title">Poule ${poule}</div>`;

const header=document.createElement("div");
header.className="table-row header-row";

header.innerHTML=`
<div>Equipe</div>
<div>V/D</div>
<div>Manches</div>
`;

card.appendChild(header);

groups[poule].sort((a,b)=>Number(a.Classement)-Number(b.Classement));

groups[poule].forEach((team,index)=>{

let medal="";
if(index===0) medal="🥇 ";
if(index===1) medal="🥈 ";
if(index===2) medal="🥉 ";

const row=document.createElement("div");
row.className="team-row";

row.innerHTML=`

<div class="table-row">

<div class="team-name">
${medal}${team["Nom de l’equipe"]}
</div>

<div class="team-vd">
<span class="wins">${team["Victoires"]}</span> /
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

row.addEventListener("click",()=>row.classList.toggle("open"));

card.appendChild(row);

});

container.appendChild(card);

});

}


/* DISPLAY MATCHES */

function displayMatches(matches){

const container=document.getElementById("matches");
container.innerHTML="";

const groups={};

matches.forEach(m=>{

if(!groups[m.Poule]) groups[m.Poule]=[];
groups[m.Poule].push(m);

});

Object.keys(groups).forEach(poule=>{

const card=document.createElement("div");
card.className="group-card";

card.innerHTML=`<div class="group-title">Poule ${poule}</div>`;


/* SORT played first */

groups[poule].sort((a,b)=>{

const playedA=Number(a.ManchesA)+Number(a.ManchesB);
const playedB=Number(b.ManchesA)+Number(b.ManchesB);

return playedB-playedA;

});


groups[poule].forEach(match=>{

const mA=Number(match.ManchesA);
const mB=Number(match.ManchesB);

const block=document.createElement("div");
block.className="match-card";


/* MATCH NOT PLAYED */

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

a=Number(a);
b=Number(b);

if(a>b) return `<span class="score-win">${a}</span>`;
if(a<b) return `<span class="score-lose">${a}</span>`;
return `<span>${a}</span>`;

}


/* BUILD SCORES */

let rowA=`
${s(match["Partie 1-score A"],match["Partie 1-score B"])}
${s(match["Partie 2-score A"],match["Partie 2-score B"])}
`;

let rowB=`
${s(match["Partie 1-score B"],match["Partie 1-score A"])}
${s(match["Partie 2-score B"],match["Partie 2-score A"])}
`;


/* SHOW 3RD ONLY IF MATCH IN 3 */

if((mA===2 && mB===1)||(mA===1 && mB===2)){

rowA+=s(match["Partie 3-score A"],match["Partie 3-score B"]);
rowB+=s(match["Partie 3-score B"],match["Partie 3-score A"]);

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


/* WINTER BUTTON */

const winterButton=document.getElementById("winterToggle");

winterButton.addEventListener("click",()=>{

document.body.classList.toggle("winter");

winterButton.textContent=
document.body.classList.contains("winter")
? "Mode Hiver ON ❄️"
: "Mode Hiver OFF";

});


/* SNOW EFFECT */

const snowContainer=document.getElementById("snow-container");

function createSnowflake(){

const flake=document.createElement("div");

flake.className="snowflake";
flake.innerHTML="❄";

flake.style.left=Math.random()*100+"vw";
flake.style.fontSize=(Math.random()*14+8)+"px";

const drift=(Math.random()*120-60)+"px";

flake.style.setProperty("--startX","0px");
flake.style.setProperty("--drift",drift);

const duration=Math.random()*6+6;
flake.style.animationDuration=duration+"s";

snowContainer.appendChild(flake);

setTimeout(()=>flake.remove(),duration*1000);

}

setInterval(()=>{

if(document.body.classList.contains("winter")){
createSnowflake();
}

},120);

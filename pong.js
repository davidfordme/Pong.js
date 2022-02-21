/****** STYLES *******/
/* 
    Colours
*/
const white = "#FFFFFF";
const lightBlue = '#0C2A55';
const darkBlue = '#111926';

/*
    Basic elements
*/
const body = document.getElementsByTagName('body')[0];
const html = document.getElementsByTagName('html')[0];
const root = document.getElementById('root');

const setupStyles = "margin: 0; padding: 0; width: 100vw; height: 100vh; position: relative;";

body.style = setupStyles + " background-color: " + darkBlue + ";";
html.style = setupStyles;

root.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40rem; height: 30rem; background-color: " + lightBlue + ";"

/*
    Pitch layout
*/
const pitch = document.createElement("div");
pitch.style = "position: absolute; top: 1rem; left: 1rem; width: calc(100% - 3rem); height: calc(100% - 3rem); border: 0.5rem dashed " + white + ";";

const centerLine = document.createElement("div");
centerLine.style = "position: absolute; top: 2rem; left: 50%; transform: translateX(-50%); height: calc(100% - 4rem); border-right: 0.5rem dashed " + white + ";";

pitch.appendChild(centerLine);
root.appendChild(pitch);

/*
    Score
*/
const score = document.createElement("div");
score.style = "position: absolute; width: 100%; bottom: -6rem; font-size: 3rem; text-align: center; color: #FFF; font-family: monospace;";
pitch.appendChild(score);

/*
    Players
*/
const player = document.createElement("div");
player.style = "position: absolute; top: 50%; transform: translateY(-50%); height: 4rem; width: 0.5rem; background-color: " + white + ";";

const player1 = player.cloneNode(true);
player1.style['left'] = "2.5rem";
player1.id = 'player1';

const player2 = player.cloneNode(true);
player2.style['right'] = "2.5rem";
player2.id = 'player2';

root.appendChild(player1);
root.appendChild(player2);


/****** LOGIC - VARIABLES *******/
const playerPace = 3;
const playerUpper = 15;
const playerLower = 85;

let player1Score = 0;
let player2Score = 0;
score.innerHTML = player1Score + ' - ' + player2Score;

/****** LOGIC - FUNCTIONS *******/
function KeyW() {
    movePlayer(player1, true);
}

function KeyS() {
    movePlayer(player1, false);
}

function ArrowUp() {
    movePlayer(player2, true);
}

function ArrowDown() {
    movePlayer(player2, false);
}

function Enter() {
    console.log("START GAME?");
}

function updateScore(player) {
    if(player.id === 'player1') player1Score++;
    if(player.id === 'player2') player2Score++;

    score.innerHTML = player1Score + ' - ' + player2Score;
}

const setupInteractions = () => {

    const acceptedKeys = ["KeyW", "KeyS", "ArrowUp", "ArrowDown", "Enter"];

    const keyUpdate = (event) => {
        if(acceptedKeys.includes(event.code)) {
            event.preventDefault();
            
            const funct = window[event.code];
            if(typeof funct === 'function') funct();
        }
    }

    document.addEventListener("keydown", event => {
        keyUpdate(event);
    });
}

const movePlayer = (selectedPlayer, positivity) => {
    const top = selectedPlayer.style.getPropertyValue('top');
    let currentPosition = parseFloat(top.replace('%', ''));
    
    if(positivity) currentPosition = currentPosition - playerPace;
    else currentPosition = currentPosition + playerPace;

    if(currentPosition <= playerUpper) currentPosition = playerUpper;
    if(currentPosition >= playerLower) currentPosition = playerLower;

    selectedPlayer.style["top"] = currentPosition + "%";
}

window.onload = (event) => {
    setupInteractions();
}
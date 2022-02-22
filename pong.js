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
const playerRefreshSpeed = 50;

const directionUp = "up";
const directionDown = "down";

let player1Moving = false;
let player2Moving = false;
let player1Direction = directionUp;
let player2Direction = directionUp;

let player1Score = 0;
let player2Score = 0;
score.innerHTML = player1Score + ' - ' + player2Score;

/****** LOGIC - FUNCTIONS *******/
function KeyW(down) {
    setPlayerMoving(player1, down, directionUp);
}

function KeyS(down) {
    setPlayerMoving(player1, down, directionDown);
}

function ArrowUp(down) {
    setPlayerMoving(player2, down, directionUp);
}

function ArrowDown(down) {
    setPlayerMoving(player2, down, directionDown);
}

function Enter() {
    console.log("START GAME?");
}

function Escape() {
    player1.style["top"] = "50%";
    player2.style["top"] = "50%";

    player1Score = 0;
    player2Score = 0;

    updateScore();
}

function updateScore(player = false) {
    if(player && player.id === 'player1') player1Score++;
    if(player && player.id === 'player2') player2Score++;

    score.innerHTML = player1Score + ' - ' + player2Score;
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

const setPlayerMoving = (player, down = false, direction = directionUp) => {
    if(player.id === 'player1') {
        player1Moving = down;
        player1Direction = direction;
    }

    if(player.id === 'player2') {
        player2Moving = down;
        player2Direction = direction;
    }
}

const checkMovement = () => {
    if(player1Moving) movePlayer(player1, (player1Direction === directionUp));
    if(player2Moving) movePlayer(player2, (player2Direction === directionUp));
}

const setupInteractions = () => {

    const movementKeys = ["KeyW", "KeyS", "ArrowUp", "ArrowDown"];
    const menuKeys = ["Enter", "Escape"];

    const keyUpdate = (event, keyDown = false) => {
        if(movementKeys.includes(event.code) || menuKeys.includes(event.code)) {
            event.preventDefault();

            let shouldUpdate = false;
            if(movementKeys.includes(event.code)) shouldUpdate = true;
            if(menuKeys.includes(event.code) && !keyDown) shouldUpdate = true;

            const funct = window[event.code];
            if(typeof funct === 'function' && shouldUpdate) {
                funct(keyDown);
            }
        }
    }

    document.addEventListener("keydown", event => {
        keyUpdate(event, true);
    });

    document.addEventListener("keyup", event => {
        keyUpdate(event);
    });
}

window.onload = () => {
    setupInteractions();

    setInterval(() => {
        checkMovement();
    }, playerRefreshSpeed);
}
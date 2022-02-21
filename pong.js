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
const border = document.createElement("div");
border.style = "position: absolute; top: 1rem; left: 1rem; width: calc(100% - 3rem); height: calc(100% - 3rem); border: 0.5rem dashed " + white + ";";
root.appendChild(border);

const centerLine = document.createElement("div");
centerLine.style = "position: absolute; top: 2rem; left: 50%; transform: translateX(-50%); height: calc(100% - 4rem); border-right: 0.5rem dashed " + white + ";";
root.appendChild(centerLine);

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
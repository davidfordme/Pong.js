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
const pitch = document.getElementById('root');

const setupStyles = "margin: 0; padding: 0; width: 100vw; height: 100vh; position: relative;";

body.style = setupStyles + " background-color: " + darkBlue + "; color: #FFF; font-family: monospace;";
html.style = setupStyles;

pitch.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40rem; height: 30rem; background-color: " + lightBlue + ";"

/*
    Interface
*/
const startGame = document.createElement("div");
startGame.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 1; transition: opacity 0.2s ease-in-out;";
startGame.id = "startGame";
startGame.innerHTML = "<h1 style='font-size: 1rem; margin: 0; padding: 0;'>Click 'Enter' to start 😄</h1>";
pitch.appendChild(startGame);

const pauseMenu = document.createElement("div");
pauseMenu.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 0; transition: opacity 0.2s ease-in-out;";
pauseMenu.id = "pauseMenu";
pauseMenu.innerHTML = "<h1 style='font-size: 1rem; margin: 0 0 1rem 0; padding: 0; display: block;'>Paused</h1><a style='display: inline-block;'>Continue<br/<span style='font-size: 0.8rem;'>(Esc)</span></a> <a style='display: inline-block'>Reset<br/><span style='font-size: 0.8rem;'>(Enter)</span></a>";
pitch.appendChild(pauseMenu);

const info = document.createElement("div");
info.style = "position: absolute; width: 100%; bottom: -7rem; font-size: 0.8rem; text-align: center;";
info.innerHTML = "Pong.js - A development challenge. Find out more @ <a href='https://davidford.me' style='color: " + white + ";'>davidford.me</a>.";
pitch.appendChild(info);

/*
    Pitch layout
*/
const perimeter = document.createElement("div");
perimeter.style = "position: absolute; top: 1rem; left: 1rem; width: calc(100% - 3rem); height: calc(100% - 3rem); border: 0.5rem dashed " + white + ";";

const centerLine = document.createElement("div");
centerLine.style = "position: absolute; top: 2rem; left: 50%; transform: translateX(-50%); height: calc(100% - 4rem); border-right: 0.5rem dashed " + white + ";";

const puck = document.createElement("div");
puck.style = "width: 2rem; height: 2rem; border-radius: 2rem; background-color: " + white + "; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";

perimeter.appendChild(centerLine);
perimeter.appendChild(puck);
pitch.appendChild(perimeter);

/*
    Score
*/
const score = document.createElement("div");
score.style = "position: absolute; width: 100%; bottom: -5rem; font-size: 3rem; text-align: center;";
pitch.appendChild(score);

/*
    Players
*/
const player = document.createElement("div");
player.style = "position: absolute; top: 50%; transform: translateY(-50%); height: 4rem; width: 0.5rem; background-color: " + white + ";";

const player1 = player.cloneNode(true);
player1.style.left = "2.5rem";
player1.id = 'player1';

const player2 = player.cloneNode(true);
player2.style.right = "2.5rem";
player2.id = 'player2';

pitch.appendChild(player1);
pitch.appendChild(player2);


/****** LOGIC - VARIABLES *******/
const playerPace = 3;
const playerUpper = 15;
const playerLower = 85;
const playerRefreshSpeed = 50;

const puckHorizontalSpeed_initial = 2;
let puckHorizontalSpeed = ((Math.random() > 0.5) ? puckHorizontalSpeed_initial * -1 : puckHorizontalSpeed_initial);
let puckVerticalSpeed = 0;
const puckMaxRight = 97;
const puckMaxLeft = 3;

const directionUp = "up";
const directionDown = "down";

let gameInProgress = false;
let pauseMenuVisible = false;

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
    if(!gameInProgress) {
        if(pauseMenuVisible) {
            showPauseMenu(false);
            resetGame();
            gameInProgress = false;
        } else {
            showStartGame(false);
            restartPuck(((Math.random() > 0.5) ? puckHorizontalSpeed_initial * -1 : puckHorizontalSpeed_initial));
            gameInProgress = true;
        }
    }
}

function Escape() {
    if(!pauseMenuVisible && gameInProgress) {
        showPauseMenu(true);
        gameInProgress = false;
    }

    if(pauseMenuVisible && !gameInProgress) {
        showPauseMenu(false);
        gameInProgress = true;
    }
}

const resetGame = () => {
    player1.style.top = "50%";
    player2.style.top = "50%";

    player1Score = 0;
    player2Score = 0;

    gameInProgress = false;

    resetPuck();

    updateScore();
    showStartGame(true);
}

const showPauseMenu = (show = true) => {
    if(show) pauseMenu.style.opacity = 1;
    else pauseMenu.style.opacity = 0;
    pauseMenu.style.transition = "opacity 0.2s ease-in-out";

    setTimeout(() => {
        pauseMenuVisible = show;
    }, 250);
}

const showStartGame = (show = true) => {    
    if(show) startGame.style.opacity = 1;
    else startGame.style.opacity = 0;
    startGame.style.transition = "opacity 0.2s ease-in-out";
}

const updateScore = (player = false) => {
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

    selectedPlayer.style.top = currentPosition + "%";
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

const resetPuck = () => {
    puckVerticalSpeed = 0;
    puckHorizontalSpeed = 0;
    puck.style.top = "50%";
    puck.style.left = "50%";
}

const movePuck = () => {
    let newPosition = parseInt(puck.style.left.replace("%", '')) + puckHorizontalSpeed;

    puck.style.left = newPosition + "%";

    if(newPosition >= puckMaxRight) {
        newPosition = puckMaxRight;
        registerGoal();
    }

    if(newPosition <= puckMaxLeft) {
        newPosition = puckMaxLeft;
        registerGoal();
    }
}

const restartPuck = (positive) => {
    setTimeout(() => {
        console.log('restartPuck - GO');
        gameInProgress = true;
        puckHorizontalSpeed = (positive) ? puckHorizontalSpeed_initial : puckHorizontalSpeed_initial * -1;
    }, 3000);
}

const registerGoal = () => {
    gameInProgress = false;

    const hitPos = parseInt(puck.style.left.replace("%", ''));

    resetPuck();

    if(hitPos > 50) {
        player1Score = player1Score + 1;
        restartPuck(true);
    } else {
        player2Score = player2Score + 1;
        restartPuck(false);
    }

    updateScore();
}

const updatePuckSpeed = (positive = true) => {
    puckHorizontalSpeed = puckHorizontalSpeed * -1;
}

const checkMovement = () => {
    if(player1Moving && gameInProgress) movePlayer(player1, (player1Direction === directionUp));
    if(player2Moving && gameInProgress) movePlayer(player2, (player2Direction === directionUp));

    if(gameInProgress) movePuck();
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
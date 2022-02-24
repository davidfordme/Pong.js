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
startGame.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 1; transition: opacity 0.2s ease-in-out; border-radius: 2rem;";
startGame.id = "startGame";
startGame.innerHTML = "<h1 style='font-size: 1rem; margin: 0; padding: 0;'>Click 'Enter' to start 😄</h1>";
pitch.appendChild(startGame);

const pauseMenu = document.createElement("div");
pauseMenu.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 0; transition: opacity 0.2s ease-in-out; border-radius: 2rem;";
pauseMenu.id = "pauseMenu";
pauseMenu.innerHTML = "<h1 style='font-size: 1rem; margin: 0 0 1rem 0; padding: 0; display: block;'>Paused</h1><a style='display: inline-block;'>Continue<br/<span style='font-size: 0.8rem;'>(Esc)</span></a> <a style='display: inline-block'>Reset<br/><span style='font-size: 0.8rem;'>(Enter)</span></a>";
pitch.appendChild(pauseMenu);

const goalMessage = document.createElement("div");
goalMessage.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 0; border-radius: 2rem;";
goalMessage.id = "goalMessage";
goalMessage.innerHTML = "<h1 style='font-size: 1.4rem; margin: 0; padding: 0; display: block;'>GOOOOOAAALLL!</h1>";
pitch.appendChild(goalMessage);

const countDownTimer = document.createElement("h1");
countDownTimer.style = "font-size: 1.4rem; margin: 0; padding: 0; display: block;";
countDownTimer.innerText = "Ready";

const countDown = document.createElement("div");
countDown.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background-color: " + darkBlue + "; padding: 2rem; text-align: center; opacity: 0; border-radius: 2rem;";
countDown.id = "countDown";
countDown.appendChild(countDownTimer);
pitch.appendChild(countDown);

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
const puckMinVertical = 3;
const puckMaxVertical = 97;

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

const resetPlayers = () => {
    player1.style.top = "50%";
    player2.style.top = "50%";
}

const resetGame = () => {
    player1Score = 0;
    player2Score = 0;

    gameInProgress = false;

    resetPlayers();
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

const movePuck = () => {
    detectHit();

    let newPosition = {
        left: convertPercentageToInt(puck.style.left) + puckHorizontalSpeed,
        top: convertPercentageToInt(puck.style.top) + puckVerticalSpeed
    }

    if(newPosition.left >= puckMaxRight) {
        newPosition.left = puckMaxRight;
        registerGoal();
    }

    if(newPosition.left <= puckMaxLeft) {
        newPosition.left = puckMaxLeft;
        registerGoal();
    }
    
    if(newPosition.top <= puckMinVertical) {
        newPosition.top = puckMinVertical + 1;
        puckVerticalSpeed = puckVerticalSpeed * -1;
    }
    
    if(newPosition.top >= puckMaxVertical) {
        newPosition.top = puckMaxVertical - 1;
        puckVerticalSpeed = puckVerticalSpeed * -1;
    }

    puck.style.left = newPosition.left + "%";
    puck.style.top = newPosition.top + "%";
}

const detectHit = () => {
    if(elementsOverlap(player1, puck)) returnPuck();
    if(elementsOverlap(player2, puck)) returnPuck();
}

const elementsOverlap = (el1, el2) => {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();

    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    );
}

const returnPuck = () => {
    puckHorizontalSpeed = puckHorizontalSpeed * -1;

    const posOfPuck = { 
        left: convertPercentageToInt(puck.style.left),
        top: convertPercentageToInt(puck.style.top)
    };

    const posOfPlayer1 = { 
        left: player1.style.left,
        top: convertPercentageToInt(player1.style.top)
    };

    const posOfPlayer2 = { 
        right: player2.style.right,
        top: convertPercentageToInt(player2.style.top)
    };

    let diffInHeight = 0;

    if(posOfPuck.left > 50) {
        diffInHeight = posOfPlayer2.top - posOfPuck.top;
    } else {
        diffInHeight = posOfPlayer1.top - posOfPuck.top;
    }

    puckVerticalSpeed = ((diffInHeight * 0.5) * -1);

    console.log("diffInHeight: " + diffInHeight);
}

const resetPuck = () => {
    gameInProgress = false;

    puckVerticalSpeed = 0;
    puckHorizontalSpeed = 0;
    puck.style.top = "50%";
    puck.style.left = "50%";
}

const restartPuck = (positive) => {
    resetPuck();
    resetPlayers();

    countDown.style.opacity = 1;
    countDownTimer.innerText = "Ready";

    setTimeout(() => {
        countDownTimer.innerText = "Set";

        setTimeout(() => {
            countDownTimer.innerText = "GO!";
        }, 1000);
    }, 1000);

    setTimeout(() => {
        countDown.style.opacity = 0;
        gameInProgress = true;
        puckHorizontalSpeed = (positive) ? puckHorizontalSpeed_initial : puckHorizontalSpeed_initial * -1;
    }, 3000);
}

const registerGoal = () => {
    gameInProgress = false;

    const hitPos = convertPercentageToInt(puck.style.left);

    if(hitPos > 50) {
        player1Score = player1Score + 1;
        goalMessage.style.opacity = 1;

        setTimeout(() => {
            goalMessage.style.opacity = 0;
            restartPuck(true);
        }, 2000);
    } else {
        player2Score = player2Score + 1;
        goalMessage.style.opacity = 1;

        setTimeout(() => {
            goalMessage.style.opacity = 0;
            restartPuck(false);
        }, 2000);
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

const convertPercentageToInt = (value) => {
    return parseInt(value.replace("%", ''));
}

window.onload = () => {
    setupInteractions();

    setInterval(() => {
        checkMovement();
    }, playerRefreshSpeed);
}
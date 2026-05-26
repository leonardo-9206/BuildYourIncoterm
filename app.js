// Datos fijos del Juego
const incotermsFixed = {
    1: { name: 'EXW', img: 'exw.png' },
    2: { name: 'FOB', img: 'fob.png' },
    3: { name: 'CIF', img: 'cif.png' }
};

// Estado del juego
let currentStage = 1;
const maxStages = 3;

let p1Time = 0;
let p2Time = 0;
let p1Interval = null;
let p2Interval = null;
let p1Finished = false;
let p2Finished = false;
let startTime = 0;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const btnStartGame = document.getElementById('btn-start-game');

const setupPhase = document.getElementById('setup-phase');
const countdownPhase = document.getElementById('countdown-phase');
const actionPhase = document.getElementById('action-phase');

const incotermLogoImg = document.getElementById('incoterm-logo-img');
const btnStartRound = document.getElementById('btn-start-round');
const countdownDisplay = document.getElementById('countdown-display');
const activeIncotermDisplay = document.getElementById('active-incoterm-display');
const currentStageDisplay = document.getElementById('current-stage-display');
const roundStatus = document.getElementById('round-status');
const btnNextStage = document.getElementById('btn-next-stage');
const btnFinishGame = document.getElementById('btn-finish-game');

// Elementos Jugadores
const p1TimeDisplay = document.getElementById('p1-time');
const btnP1Stop = document.getElementById('btn-p1-stop');
const p1Panel = document.getElementById('player-1-panel');

const p2TimeDisplay = document.getElementById('p2-time');
const btnP2Stop = document.getElementById('btn-p2-stop');
const p2Panel = document.getElementById('player-2-panel');


// Inicialización
btnStartGame.addEventListener('click', () => {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    initStage(currentStage);
});

function initStage(stage) {
    currentStageDisplay.textContent = stage;
    
    // Configurar imagen y texto de la etapa actual
    const currentData = incotermsFixed[stage];
    incotermLogoImg.src = currentData.img;
    activeIncotermDisplay.textContent = currentData.name;
    
    // Reset players
    resetPlayer(1);
    resetPlayer(2);
    
    // Show setup phase
    showPhase(setupPhase);
    btnNextStage.classList.add('hidden');
    btnFinishGame.classList.add('hidden');
    roundStatus.textContent = 'Build the Incoterm!';
}


btnStartRound.addEventListener('click', () => {
    showPhase(countdownPhase);
    
    let count = 3;
    countdownDisplay.textContent = count;
    
    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.textContent = count;
        } else if (count === 0) {
            countdownDisplay.textContent = 'GO!';
            countdownDisplay.style.color = 'var(--success-color)';
        } else {
            clearInterval(countInterval);
            countdownDisplay.style.color = ''; // reset
            startRound();
        }
    }, 1000);
});

function startRound() {
    showPhase(actionPhase);
    
    p1Finished = false;
    p2Finished = false;
    
    btnP1Stop.disabled = false;
    btnP2Stop.disabled = false;
    
    startTime = Date.now();
    
    p1Interval = setInterval(() => updateTimer(1), 10);
    p2Interval = setInterval(() => updateTimer(2), 10);
}

function updateTimer(player) {
    const elapsed = Date.now() - startTime;
    const formatted = formatTime(elapsed);
    
    if (player === 1) {
        p1Time = elapsed;
        p1TimeDisplay.textContent = formatted;
    } else {
        p2Time = elapsed;
        p2TimeDisplay.textContent = formatted;
    }
}

function formatTime(ms) {
    const date = new Date(ms);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

// Botones de Parar
btnP1Stop.addEventListener('click', () => {
    clearInterval(p1Interval);
    btnP1Stop.disabled = true;
    p1Finished = true;
    p1Panel.classList.add('finished');
    checkRoundStatus();
});

btnP2Stop.addEventListener('click', () => {
    clearInterval(p2Interval);
    btnP2Stop.disabled = true;
    p2Finished = true;
    p2Panel.classList.add('finished');
    checkRoundStatus();
});

function checkRoundStatus() {
    if (p1Finished && p2Finished) {
        roundStatus.innerHTML = '<span class="text-success">¡Both players finished!</span>';
        
        if (currentStage < maxStages) {
            btnNextStage.classList.remove('hidden');
        } else {
            btnFinishGame.classList.remove('hidden');
        }
    }
}

btnNextStage.addEventListener('click', () => {
    currentStage++;
    initStage(currentStage);
});

btnFinishGame.addEventListener('click', () => {
    alert('GAME OVER. Thank you for playing!');
    // Reset to start screen
    currentStage = 1;
    startScreen.classList.add('active');
    gameScreen.classList.remove('active');
});

function showPhase(phaseToShow) {
    setupPhase.classList.remove('active');
    countdownPhase.classList.remove('active');
    actionPhase.classList.remove('active');
    
    phaseToShow.classList.add('active');
}

function resetPlayer(player) {
    if (player === 1) {
        clearInterval(p1Interval);
        p1TimeDisplay.textContent = '00:00.00';
        btnP1Stop.disabled = true;
        p1Panel.classList.remove('finished');
    } else {
        clearInterval(p2Interval);
        p2TimeDisplay.textContent = '00:00.00';
        btnP2Stop.disabled = true;
        p2Panel.classList.remove('finished');
    }
}

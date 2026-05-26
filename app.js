// Datos fijos del Juego
const incotermsFixed = {
    1: { name: 'EXW', img: 'exw.png' },
    2: { name: 'FOB', img: 'fob.png' },
    3: { name: 'CIF', img: 'cif.png' }
};

// Estado del juego
let currentStage = 1;
const maxStages = 3;

// Variables de Puntaje
let p1Wins = 0;
let p2Wins = 0;
let stageWinnerSelected = false;

// Variables de Tiempo
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

// Elementos nuevos de Ganador
const btnP1Winner = document.getElementById('btn-p1-winner');
const btnP2Winner = document.getElementById('btn-p2-winner');
const stageWinnerDisplay = document.getElementById('stage-winner-display');
const scoreDisplay = document.getElementById('score-display');

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

    // Configurar imagen y texto
    const currentData = incotermsFixed[stage];
    incotermLogoImg.src = currentData.img;
    activeIncotermDisplay.textContent = currentData.name;

    // Reset de variables de la ronda
    stageWinnerSelected = false;
    stageWinnerDisplay.classList.add('hidden');
    btnP1Winner.classList.add('hidden');
    btnP2Winner.classList.add('hidden');
    scoreDisplay.textContent = `Score: ${p1Wins} - ${p2Wins}`; // Refresca el marcador

    resetPlayer(1);
    resetPlayer(2);

    showPhase(setupPhase);
    btnNextStage.classList.add('hidden');
    btnFinishGame.classList.add('hidden');
    roundStatus.textContent = 'Build your Incoterm!';
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
        // Se detiene el tiempo. Pedir a Ilse que revise.
        roundStatus.innerHTML = '<span class="text-success">Time stopped! Check Incoterms.</span>';

        // Aparecen los botones para elegir al ganador
        btnP1Winner.classList.remove('hidden');
        btnP2Winner.classList.remove('hidden');
    }
}

// Lógica para elegir ganador
btnP1Winner.addEventListener('click', () => selectWinner(1));
btnP2Winner.addEventListener('click', () => selectWinner(2));

function selectWinner(player) {
    if(stageWinnerSelected) return; // Evita que se sumen puntos dobles si le pica dos veces
    stageWinnerSelected = true;

    // Esconder los botones de selección
    btnP1Winner.classList.add('hidden');
    btnP2Winner.classList.add('hidden');

    // Sumar punto y mostrar mensaje
    if (player === 1) {
        p1Wins++;
        stageWinnerDisplay.textContent = `Stage ${currentStage} Winner: Player 1!`;
    } else {
        p2Wins++;
        stageWinnerDisplay.textContent = `Stage ${currentStage} Winner: Player 2!`;
    }

    stageWinnerDisplay.classList.remove('hidden');
    scoreDisplay.textContent = `Score: ${p1Wins} - ${p2Wins}`;

    // Mostrar el botón para avanzar o terminar el juego
    if (currentStage < maxStages) {
        btnNextStage.classList.remove('hidden');
    } else {
        btnFinishGame.classList.remove('hidden');
    }
}

btnNextStage.addEventListener('click', () => {
    currentStage++;
    initStage(currentStage);
});

btnFinishGame.addEventListener('click', () => {
    let finalMessage = '';

    if (p1Wins > p2Wins) {
        finalMessage = 'PLAYER 1 IS THE WINNER! 🏆';
    } else if (p2Wins > p1Wins) {
        finalMessage = 'PLAYER 2 IS THE WINNER! 🏆';
    } else {
        finalMessage = 'ITS A TIE! 🤝';
    }

    // Mostrar alerta final
    alert(`GAME OVER!\n\nFinal Score: P1 [ ${p1Wins} ] - P2 [ ${p2Wins} ]\n\n${finalMessage}`);

    // Resetear juego completo
    currentStage = 1;
    p1Wins = 0;
    p2Wins = 0;
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
// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    playerChoice: null,
    computerChoice: null,
    gameOver: false
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startGameButton = document.getElementById('start-game');
const choiceButtons = document.querySelectorAll('.choice');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const roundNumberElement = document.getElementById('round-number');
const playerChoiceIcon = document.querySelector('#player-choice .choice-icon');
const computerChoiceIcon = document.querySelector('#computer-choice .choice-icon');
const roundResultElement = document.getElementById('round-result');
const finalScoreElement = document.getElementById('final-score');
const winnerMessageElement = document.getElementById('winner-message');
const playAgainButton = document.getElementById('play-again');
const castWinButton = document.getElementById('cast-win');

// Choice icons
const choiceIcons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// Event Listeners
startGameButton.addEventListener('click', startGame);
choiceButtons.forEach(button => {
    button.addEventListener('click', () => makeChoice(button.dataset.choice));
});
playAgainButton.addEventListener('click', resetGame);
castWinButton.addEventListener('click', castWin);

// Initialize Farcaster Mini App SDK
let miniApp;
try {
    miniApp = new window.Farcaster.MiniApp();
    // Signal that the app is ready to be displayed
    miniApp.ready();
} catch (e) {
    console.error('Failed to initialize Farcaster Mini App SDK:', e);
}

// Game Functions
function startGame() {
    showScreen(gameScreen);
    resetGame();
}

function resetGame() {
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.currentRound = 1;
    gameState.gameOver = false;
    
    updateScoreDisplay();
    clearChoiceDisplay();
    roundResultElement.textContent = '';
    roundResultElement.style.backgroundColor = '';
    
    showScreen(gameScreen);
    
    // Enable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = false;
    });
}

function makeChoice(playerChoice) {
    if (gameState.gameOver) return;
    
    gameState.playerChoice = playerChoice;
    const computerChoice = getComputerChoice();
    gameState.computerChoice = computerChoice;
    
    displayChoices(playerChoice, computerChoice);
    const result = determineWinner(playerChoice, computerChoice);
    updateScore(result);
    displayRoundResult(result);
    
    // Check if game is over
    if (gameState.playerScore >= 3 || gameState.computerScore >= 3 || gameState.currentRound >= gameState.maxRounds) {
        endGame();
    } else {
        gameState.currentRound++;
        updateScoreDisplay();
    }
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    }
    
    return 'computer';
}

function updateScore(result) {
    if (result === 'player') {
        gameState.playerScore++;
    } else if (result === 'computer') {
        gameState.computerScore++;
    }
}

function displayChoices(playerChoice, computerChoice) {
    playerChoiceIcon.textContent = choiceIcons[playerChoice];
    computerChoiceIcon.textContent = choiceIcons[computerChoice];
}

function displayRoundResult(result) {
    let message = '';
    let backgroundColor = '';
    
    if (result === 'player') {
        message = 'You win this round!';
        backgroundColor = 'rgba(40, 167, 69, 0.2)';
    } else if (result === 'computer') {
        message = 'Computer wins this round!';
        backgroundColor = 'rgba(220, 53, 69, 0.2)';
    } else {
        message = 'It\'s a tie!';
        backgroundColor = 'rgba(108, 117, 125, 0.2)';
    }
    
    roundResultElement.textContent = message;
    roundResultElement.style.backgroundColor = backgroundColor;
}

function updateScoreDisplay() {
    playerScoreElement.textContent = gameState.playerScore;
    computerScoreElement.textContent = gameState.computerScore;
    roundNumberElement.textContent = gameState.currentRound;
}

function clearChoiceDisplay() {
    playerChoiceIcon.textContent = '';
    computerChoiceIcon.textContent = '';
}

function endGame() {
    gameState.gameOver = true;
    
    // Disable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Prepare game over screen
    finalScoreElement.textContent = `Final Score: You ${gameState.playerScore} - ${gameState.computerScore} Computer`;
    
    let winnerMessage = '';
    if (gameState.playerScore > gameState.computerScore) {
        winnerMessage = 'Congratulations! You Won! 🎉';
        castWinButton.classList.remove('hidden');
    } else if (gameState.playerScore < gameState.computerScore) {
        winnerMessage = 'Computer Won! Better luck next time.';
        castWinButton.classList.add('hidden');
    } else {
        winnerMessage = 'It\'s a Tie!';
        castWinButton.classList.add('hidden');
    }
    
    winnerMessageElement.textContent = winnerMessage;
    
    // Show game over screen
    setTimeout(() => {
        showScreen(gameOverScreen);
    }, 1500);
}

function showScreen(screen) {
    // Hide all screens
    welcomeScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    
    // Show the requested screen
    screen.classList.add('active');
}

function castWin() {
    if (!miniApp) {
        console.error('Farcaster Mini App SDK not initialized');
        return;
    }
    
    try {
        miniApp.composeCast({
            text: `I just won a game of Rock Paper Scissors with a score of ${gameState.playerScore}-${gameState.computerScore}! 🎮 #RockPaperScissors`
        });
    } catch (e) {
        console.error('Failed to cast win:', e);
        alert('Failed to cast your win. Please try again.');
    }
}

// Handle Farcaster Frame interactions
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is a frame post request
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fc-frame')) {
        // This is a frame interaction, start the game automatically
        startGame();
    }
});

const sdk = new MiniAppSDK();

// DOM Elements
const userScoreEl = document.getElementById("user-score");
const computerScoreEl = document.getElementById("computer-score");
const roundNumberEl = document.getElementById("round-number");
const roundResultEl = document.getElementById("round-result");
const gameResultEl = document.getElementById("game-result");
const choicesDiv = document.getElementById("choices");
const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");
const gameOverActionsDiv = document.querySelector(".game-over-actions");
const castResultButton = document.getElementById("cast-result");
const playAgainButton = document.getElementById("play-again");

// Game State
let userScore = 0;
let computerScore = 0;
let round = 1;
const maxRounds = 5;
const choices = ["rock", "paper", "scissors"];

// --- Game Logic ---

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return "draw";
  }
  if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "scissors" && computerChoice === "paper") ||
    (userChoice === "paper" && computerChoice === "rock")
  ) {
    return "user";
  }
  return "computer";
}

function playRound(userChoice) {
  if (round > maxRounds) return; // Don't play if game already ended

  const computerChoice = getComputerChoice();
  const winner = determineWinner(userChoice, computerChoice);

  let resultText = `You chose ${userChoice}, Computer chose ${computerChoice}. `;

  if (winner === "user") {
    userScore++;
    resultText += "You win this round!";
  } else if (winner === "computer") {
    computerScore++;
    resultText += "Computer wins this round.";
  } else {
    resultText += "It's a draw.";
  }

  roundResultEl.textContent = resultText;
  updateScoreboard();

  round++;

  if (round > maxRounds) {
    endGame();
  } else {
    updateRoundNumber();
  }
}

function updateScoreboard() {
  userScoreEl.textContent = userScore;
  computerScoreEl.textContent = computerScore;
}

function updateRoundNumber() {
  roundNumberEl.textContent = round;
}

function endGame() {
  choicesDiv.style.display = "none"; // Hide choices
  gameOverActionsDiv.style.display = "block"; // Show end game buttons

  let finalMessage = `Game Over! Final Score: ${userScore} - ${computerScore}. `;
  if (userScore > computerScore) {
    finalMessage += "You won the game! 🎉";
  } else if (computerScore > userScore) {
    finalMessage += "Computer won the game. 🤖";
  } else {
    finalMessage += "It's a tie game! 🤝";
  }
  gameResultEl.textContent = finalMessage;
  roundNumberEl.textContent = maxRounds; // Show final round number
}

function resetGame() {
  userScore = 0;
  computerScore = 0;
  round = 1;

  updateScoreboard();
  updateRoundNumber();
  roundResultEl.textContent = "";
  gameResultEl.textContent = "";

  choicesDiv.style.display = "flex"; // Show choices
  gameOverActionsDiv.style.display = "none"; // Hide end game buttons
}

// --- Event Listeners ---

rockButton.addEventListener("click", () => playRound("rock"));
paperButton.addEventListener("click", () => playRound("paper"));
scissorsButton.addEventListener("click", () => playRound("scissors"));

playAgainButton.addEventListener("click", resetGame);

castResultButton.addEventListener("click", () => {
  let castText = `I played Rock-Paper-Scissors in this Farcaster Mini App! 🤘📄✂️ Final Score: ${userScore} - ${computerScore}.`;
  if (userScore > computerScore) {
    castText += " I won! 🎉";
  } else if (computerScore > userScore) {
    castText += " The computer won. 🤖";
  } else {
    castText += " It was a tie! 🤝";
  }

  // Ask the Farcaster client to open the composer
  sdk.composeCast({ text: castText });
});

// --- SDK Integration ---

// Signal to the Farcaster client that the app is ready to be displayed
sdk.ready();

// Initialize scoreboard and round number
updateScoreboard();
updateRoundNumber();

console.log("Rock Paper Scissors Mini App Initialized");

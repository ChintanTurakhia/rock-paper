const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "public")));

// Game state storage (in a real app, this would be in a database)
const gameStates = new Map();

// Helper functions
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "tie";
  }

  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "player";
  }

  return "computer";
}

// Generate a unique session ID
function generateSessionId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Initialize a new game state
function initGameState() {
  return {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    history: [],
  };
}

// Routes
// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the .well-known/farcaster.json file
app.get("/.well-known/farcaster.json", (req, res) => {
  res.sendFile(path.join(__dirname, ".well-known/farcaster.json"));
});

// Handle frame interactions
app.post("/api/frame", (req, res) => {
  try {
    // Get the frame data from the request
    const frameData = req.body;

    // Extract user information from the frame data
    const fid = frameData.untrustedData?.fid || "anonymous";
    const buttonIndex = frameData.untrustedData?.buttonIndex || 1;

    // Get or create a session for this user
    let sessionId = frameData.untrustedData?.sessionId || generateSessionId();
    let gameState = gameStates.get(sessionId) || initGameState();

    // Generate a response based on the button clicked
    let responseFrame;

    if (
      buttonIndex === 1 &&
      gameState.currentRound === 1 &&
      gameState.history.length === 0
    ) {
      // User clicked "Play Game" on the welcome screen
      responseFrame = {
        version: "vNext",
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/public/images/choose.png`,
        buttons: [
          {
            label: "✊ Rock",
            action: "post",
          },
          {
            label: "✋ Paper",
            action: "post",
          },
          {
            label: "✌️ Scissors",
            action: "post",
          },
        ],
        state: {
          sessionId: sessionId,
        },
      };
    } else if (
      buttonIndex >= 1 &&
      buttonIndex <= 3 &&
      gameState.currentRound <= gameState.maxRounds
    ) {
      // User made a choice (Rock, Paper, or Scissors)
      const playerChoice =
        buttonIndex === 1 ? "rock" : buttonIndex === 2 ? "paper" : "scissors";
      const computerChoice = getComputerChoice();
      const result = determineWinner(playerChoice, computerChoice);

      // Update game state
      if (result === "player") {
        gameState.playerScore++;
      } else if (result === "computer") {
        gameState.computerScore++;
      }

      // Record this round
      gameState.history.push({
        round: gameState.currentRound,
        playerChoice,
        computerChoice,
        result,
      });

      // Check if the game is over
      const isGameOver =
        gameState.currentRound >= gameState.maxRounds ||
        gameState.playerScore >= 3 ||
        gameState.computerScore >= 3;

      if (isGameOver) {
        // Game is over, show final result
        const playerWon = gameState.playerScore > gameState.computerScore;

        responseFrame = {
          version: "vNext",
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/public/images/result-${playerWon ? "win" : "lose"}.png`,
          buttons: [
            {
              label: "Play Again",
              action: "post",
            },
          ],
        };

        if (playerWon) {
          responseFrame.buttons.push({
            label: "Cast Win",
            action: "post_redirect",
            target: "cast",
          });
        }

        // Reset game state for next game
        gameStates.delete(sessionId);
      } else {
        // Game continues, show round result and prepare for next round
        gameState.currentRound++;

        responseFrame = {
          version: "vNext",
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/public/images/round-${playerChoice}-${computerChoice}.png`,
          buttons: [
            {
              label: "Next Round",
              action: "post",
            },
          ],
          state: {
            sessionId: sessionId,
          },
        };

        // Save updated game state
        gameStates.set(sessionId, gameState);
      }
    } else if (
      buttonIndex === 1 &&
      (gameState.currentRound > gameState.maxRounds ||
        gameState.playerScore >= 3 ||
        gameState.computerScore >= 3)
    ) {
      // User clicked "Play Again" after game over
      // Reset game state and start a new game
      gameStates.delete(sessionId);
      sessionId = generateSessionId();

      responseFrame = {
        version: "vNext",
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/public/images/choose.png`,
        buttons: [
          {
            label: "✊ Rock",
            action: "post",
          },
          {
            label: "✋ Paper",
            action: "post",
          },
          {
            label: "✌️ Scissors",
            action: "post",
          },
        ],
        state: {
          sessionId: sessionId,
        },
      };
    } else if (
      buttonIndex === 2 &&
      (gameState.currentRound > gameState.maxRounds ||
        gameState.playerScore >= 3 ||
        gameState.computerScore >= 3)
    ) {
      // User clicked "Cast Win"
      // This would redirect to a cast composition screen
      // For this example, we'll just show a message
      responseFrame = {
        version: "vNext",
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/public/images/cast-win.png`,
        buttons: [
          {
            label: "Play Again",
            action: "post",
          },
        ],
      };
    } else {
      // Default response if something unexpected happens
      responseFrame = {
        version: "vNext",
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/public/images/welcome.png`,
        buttons: [
          {
            label: "Play Game",
            action: "post",
          },
        ],
      };
    }

    // Send the response
    res.json({
      frame: responseFrame,
    });
  } catch (error) {
    console.error("Error handling frame interaction:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the app`);
});

// Clean up old game states periodically (every hour)
setInterval(() => {
  const now = Date.now();
  gameStates.forEach((state, sessionId) => {
    if (now - state.lastUpdated > 3600000) {
      // 1 hour
      gameStates.delete(sessionId);
    }
  });
}, 3600000); // 1 hour

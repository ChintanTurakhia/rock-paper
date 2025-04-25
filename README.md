# Rock Paper Scissors - Farcaster Mini-App

A simple Rock Paper Scissors game built as a Farcaster Mini-App (Frames v2) where users can play against the computer in a best-of-5 match and cast their wins to their Farcaster profile.

## Features

- Play Rock Paper Scissors against the computer
- Best of 5 rounds gameplay
- Score tracking
- Cast your win to your Farcaster profile
- Responsive design that works on mobile and desktop

## How It Works

### Client-Side Implementation

The client-side implementation consists of:

1. **index.html**: Contains the game UI and the Farcaster Frame meta tag
2. **css/styles.css**: Styling for the game
3. **js/game.js**: Game logic and Farcaster SDK integration

### Frame Interactions

For a complete Farcaster Frames v2 implementation, you would need to deploy this on a server that can handle POST requests. The `frame-handler.js` file contains pseudocode demonstrating how frame interactions would be handled on a server.

The frame flow would be:

1. Initial frame: Welcome screen with "Play Game" button
2. After clicking "Play Game": Show options (Rock, Paper, Scissors)
3. After making a choice: Show result and "Play Again" button
4. After 5 rounds: Show final result and "Cast Win" button if player won

## Deployment

To deploy this mini-app:

1. Host the files on a web server (e.g., Vercel, Netlify, GitHub Pages)
2. For full Frames v2 functionality, implement a server component based on the pseudocode in `frame-handler.js`
3. Update the image URLs in the frame responses to point to your hosted images
4. Ensure your server can handle POST requests from Farcaster clients

## Local Development

To run this locally:

1. Clone the repository
2. Open `index.html` in your browser to test the client-side functionality
3. For testing frame interactions, you'll need to use a tool like ngrok to expose your local server to the internet

## Requirements

- A web server for hosting the static files
- For full Frames v2 functionality, a server that can handle POST requests
- Farcaster account for casting wins

## Technologies Used

- HTML, CSS, JavaScript
- Farcaster Mini-App SDK
- Farcaster Frames v2 specification

## License

MIT

---

This project is a demonstration of how to build a Farcaster Mini-App using the Frames v2 specification. For more information about Farcaster Mini-Apps, visit the [official documentation](https://docs.farcaster.xyz).

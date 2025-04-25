# Frame Images for Rock Paper Scissors

This directory should contain the following images for the Farcaster Frames implementation:

## Required Images

1. **welcome.png** - The welcome screen image (3:2 aspect ratio)
   - This is the initial image shown in the frame
   - You can generate this from the `welcome-image.html` file in the parent directory

2. **choose.png** - The image showing the choice selection screen
   - Should show rock, paper, scissors options
   - 3:2 aspect ratio

3. **round-[player]-[computer].png** - Images showing the result of each round
   - Replace [player] with: rock, paper, or scissors
   - Replace [computer] with: rock, paper, or scissors
   - Example: `round-rock-scissors.png` shows the player chose rock and the computer chose scissors
   - 9 images total (3 player choices × 3 computer choices)
   - 3:2 aspect ratio

4. **result-win.png** - The image shown when the player wins the game
   - Should show the final score and a victory message
   - 3:2 aspect ratio

5. **result-lose.png** - The image shown when the player loses the game
   - Should show the final score and a defeat message
   - 3:2 aspect ratio

6. **cast-win.png** - The image shown after the player casts their win
   - Should show a confirmation message
   - 3:2 aspect ratio

## Image Requirements

- All images must be in PNG format
- All images must have a 3:2 aspect ratio (as required by Farcaster Frames)
- Recommended size: 1200×800 pixels
- Maximum file size: 10MB per image

## Generating Images

You can generate these images using:
- The `welcome-image.html` file as a template
- Design tools like Figma, Photoshop, or Canva
- HTML/CSS with screenshots
- AI image generation tools

For a complete implementation, create all the required images and place them in this directory.

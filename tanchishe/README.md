# Snake Game

A classic Snake game built with TypeScript, HTML5 Canvas, and tsup.

## Features

- Classic Snake gameplay with smooth controls
- Score tracking and high score persistence
- Responsive design for different screen sizes
- Keyboard controls with direction keys
- Start, pause, and reset functionality
- Clean, modern UI with canvas rendering

## Technologies

- **TypeScript** - Type-safe JavaScript
- **HTML5 Canvas** - 2D graphics rendering
- **tsup** - Fast TypeScript bundler
- **CSS3** - Modern styling

## Project Structure

```
tanchishe/
├── src/                    # TypeScript source files
│   ├── game.ts            # Main game logic
│   ├── snake.ts           # Snake class implementation
│   ├── food.ts            # Food class implementation
│   ├── gameRenderer.ts    # Canvas rendering logic
│   ├── inputHandler.ts    # Keyboard input handling
│   └── types.ts           # TypeScript type definitions
├── public/                # Static assets
│   ├── index.html         # HTML entry point
│   └── style.css          # CSS styles
├── dist/                  # Built output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── tsup.config.ts         # Build configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd tanchishe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

This will:
- Compile TypeScript to JavaScript
- Bundle the code with tsup
- Watch for changes and rebuild automatically
- Serve the game at `http://localhost:3000` (or similar)

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## How to Play

1. Open the game in your browser
2. Click "Start Game" or press Spacebar to begin
3. Use the arrow keys to control the snake:
   - **↑** - Move up
   - **↓** - Move down
   - **←** - Move left
   - **→** - Move right
4. Eat the red food to grow and earn points
5. Avoid hitting the walls or the snake's own body
6. Pause the game with Spacebar
7. Reset the game with the R key or the Reset button

## Game Controls

- **Arrow Keys** - Control snake direction
- **Spacebar** - Start/Pause game
- **R Key** - Reset game
- **Click Start/Pause/Reset buttons** - UI controls

## Game Rules

- Each food eaten increases your score by 10 points
- The snake grows longer with each food eaten
- The game ends if the snake hits a wall or itself
- Try to beat your high score!

## Development Notes

### Code Architecture

The game follows a modular architecture:

1. **Game State** - Centralized state management
2. **Snake Class** - Handles snake movement and growth
3. **Food Class** - Manages food generation and collision
4. **Renderer** - Separates game logic from rendering
5. **Input Handler** - Decouples user input from game logic

### Type Safety

All game logic is written in TypeScript with strict type checking enabled. This ensures fewer runtime errors and better code maintainability.

### Performance

- Uses `requestAnimationFrame` for smooth animation
- Canvas rendering optimized to minimize redraws
- Efficient collision detection algorithms

## Customization

You can customize the game by modifying:

- `GAME_CONFIG` in `src/game.ts` - Game settings and colors
- `style.css` - Visual appearance
- Grid size and game speed in the configuration

## Browser Support

The game works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS Grid/Flexbox

## License

MIT
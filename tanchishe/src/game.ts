import { GameState, GameConfig, Direction } from './types';
import { SnakeImpl } from './snake';
import { FoodImpl } from './food';
import { GameRenderer } from './gameRenderer';
import { InputHandler } from './inputHandler';

/**
 * Game configuration constants
 */
const GAME_CONFIG: GameConfig = {
  gridSize: 20,
  gridWidth: 30,  // 600 / 20 = 30
  gridHeight: 20, // 400 / 20 = 20
  initialSnakeLength: 3,
  fps: 10,
  snakeColor: '#4CAF50',
  snakeHeadColor: '#388E3C',
  foodColor: '#F44336',
  gridColor: '#E0E0E0',
  backgroundColor: '#FAFAFA'
};

/**
 * Main Game class that orchestrates the entire game
 */
class Game {
  private state: GameState;
  private renderer: GameRenderer;
  private inputHandler: InputHandler;
  private lastRenderTime: number = 0;
  private animationFrameId: number | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize game state
    this.state = {
      snake: new SnakeImpl({ x: 10, y: 10 }, GAME_CONFIG.initialSnakeLength),
      food: new FoodImpl(),
      score: 0,
      highScore: this.getStoredHighScore(),
      isRunning: false,
      isPaused: false,
      gameOver: false,
      config: { ...GAME_CONFIG },
      foodEaten: 0,
      movesMade: 0,
      startTime: null,
      elapsedTime: 0
    };

    // Initialize renderer and input handler
    this.renderer = new GameRenderer();
    this.inputHandler = new InputHandler(this);

    // Generate initial food position
    this.state.food.generateNewPosition(
      this.state.snake.body,
      this.state.config.gridWidth,
      this.state.config.gridHeight
    );

    this.isInitialized = true;
    this.updateUI();
    this.inputHandler.addHistoryMessage('Game initialized. Ready to play!');
  }

  /**
   * Start the game
   */
  public start(): void {
    if (!this.state.isRunning || this.state.gameOver) {
      this.reset();
    }

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.startTime = Date.now();
    this.lastRenderTime = 0;

    this.inputHandler.addHistoryMessage('Game started!');
    this.updateUI();
    this.gameLoop();
  }

  /**
   * Toggle pause state
   */
  public togglePause(): void {
    if (!this.state.isRunning || this.state.gameOver) {
      return;
    }

    this.state.isPaused = !this.state.isPaused;

    if (this.state.isPaused) {
      this.inputHandler.addHistoryMessage('Game paused');
    } else {
      this.inputHandler.addHistoryMessage('Game resumed');
      this.gameLoop(); // Restart game loop if resuming
    }

    this.updateUI();
  }

  /**
   * Reset the game to initial state
   */
  public reset(): void {
    // Stop any existing game loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Reset game state
    this.state.snake.reset({ x: 10, y: 10 }, GAME_CONFIG.initialSnakeLength);
    this.state.food.generateNewPosition(
      this.state.snake.body,
      this.state.config.gridWidth,
      this.state.config.gridHeight
    );
    this.state.score = 0;
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.gameOver = false;
    this.state.foodEaten = 0;
    this.state.movesMade = 0;
    this.state.startTime = null;
    this.state.elapsedTime = 0;

    // Update high score from storage
    this.state.highScore = this.getStoredHighScore();

    this.inputHandler.addHistoryMessage('Game reset');
    this.updateUI();
    this.renderer.render(this.state);
  }

  /**
   * Main game loop
   */
  private gameLoop(currentTime?: number): void {
    if (!this.state.isRunning || this.state.isPaused || this.state.gameOver) {
      return;
    }

    // Calculate time since last render
    if (currentTime) {
      const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
      const targetFrameTime = 1 / this.state.config.fps;

      // Only update if enough time has passed (to control game speed)
      if (secondsSinceLastRender < targetFrameTime) {
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
        return;
      }

      this.lastRenderTime = currentTime;
    }

    // Update game state
    this.update();

    // Render game
    this.renderer.render(this.state);

    // Continue game loop
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Update game logic
   */
  private update(): void {
    // Move snake
    this.state.snake.move();
    this.state.movesMade++;

    // Check food collision
    if (this.state.food.isEatenBy(this.state.snake.getHead())) {
      this.state.snake.grow();
      this.state.score += 10;
      this.state.foodEaten++;

      // Generate new food position
      this.state.food.generateNewPosition(
        this.state.snake.body,
        this.state.config.gridWidth,
        this.state.config.gridHeight
      );

      // Update high score if needed
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        this.storeHighScore(this.state.highScore);
      }

      this.inputHandler.addHistoryMessage(`Ate food! Score: ${this.state.score}`);
    }

    // Check collisions
    if (
      this.state.snake.checkWallCollision(this.state.config.gridWidth, this.state.config.gridHeight) ||
      this.state.snake.checkSelfCollision()
    ) {
      this.state.gameOver = true;
      this.state.isRunning = false;

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.inputHandler.addHistoryMessage(`Game over! Final score: ${this.state.score}`);
    }

    // Update elapsed time
    if (this.state.startTime) {
      this.state.elapsedTime = Math.floor((Date.now() - this.state.startTime) / 1000);
    }
  }

  /**
   * Set snake direction
   */
  public setSnakeDirection(direction: Direction): void {
    if (!this.state.isRunning || this.state.isPaused || this.state.gameOver) {
      return;
    }

    this.state.snake.setDirection(direction);
  }

  /**
   * Set game FPS (speed)
   */
  public setFPS(fps: number): void {
    this.state.config.fps = fps;
    this.inputHandler.addHistoryMessage(`Game speed set to ${fps} FPS`);
  }

  /**
   * Set grid size
   */
  public setGridSize(gridSize: number, gridWidth: number, gridHeight: number): void {
    this.state.config.gridSize = gridSize;
    this.state.config.gridWidth = gridWidth;
    this.state.config.gridHeight = gridHeight;

    // Regenerate food in new grid
    this.state.food.generateNewPosition(
      this.state.snake.body,
      gridWidth,
      gridHeight
    );

    this.inputHandler.addHistoryMessage(`Grid size set to ${gridWidth}x${gridHeight}`);
  }

  /**
   * Update UI button states
   */
  private updateUI(): void {
    this.inputHandler.updateButtonStates(
      this.state.isRunning,
      this.state.isPaused,
      this.state.gameOver
    );
  }

  /**
   * Get high score from localStorage
   */
  private getStoredHighScore(): number {
    try {
      const stored = localStorage.getItem('snakeHighScore');
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      return 0;
    }
  }

  /**
   * Store high score in localStorage
   */
  private storeHighScore(score: number): void {
    try {
      localStorage.setItem('snakeHighScore', score.toString());
    } catch (error) {
      console.warn('Could not store high score in localStorage:', error);
    }
  }

  /**
   * Public getters for game state
   */
  public get isRunning(): boolean {
    return this.state.isRunning;
  }

  public get isPaused(): boolean {
    return this.state.isPaused;
  }

  public get gameOver(): boolean {
    return this.state.gameOver;
  }

  public get score(): number {
    return this.state.score;
  }

  public get highScore(): number {
    return this.state.highScore;
  }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Create and expose the game instance globally
  const game = new Game();
  (window as any).game = game;

  // Initial render
  game['renderer'].render(game['state']);

  // Add loading completed message
  const inputHandler = game['inputHandler'];
  if (inputHandler && inputHandler.addHistoryMessage) {
    inputHandler.addHistoryMessage('Game loaded successfully!');
  }

  console.log('Snake Game initialized. Use arrow keys to play!');
});

// Export for module systems (though we're using IIFE)
export { Game };
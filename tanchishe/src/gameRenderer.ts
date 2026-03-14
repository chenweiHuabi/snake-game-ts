import { GameState, GameRenderer as IGameRenderer, Position } from './types';

/**
 * Game renderer responsible for drawing the game to the canvas
 */
export class GameRenderer implements IGameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scoreElement: HTMLElement | null;
  private highScoreElement: HTMLElement | null;
  private foodEatenElement: HTMLElement | null;
  private snakeLengthElement: HTMLElement | null;
  private gameTimeElement: HTMLElement | null;
  private movesMadeElement: HTMLElement | null;
  private overlayElement: HTMLElement | null;
  private overlayTitleElement: HTMLElement | null;
  private overlayMessageElement: HTMLElement | null;

  constructor(canvasId: string = 'game-canvas') {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }
    this.ctx = ctx;

    // Cache DOM elements for performance
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('high-score');
    this.foodEatenElement = document.getElementById('food-eaten');
    this.snakeLengthElement = document.getElementById('snake-length');
    this.gameTimeElement = document.getElementById('game-time');
    this.movesMadeElement = document.getElementById('moves-made');
    this.overlayElement = document.getElementById('game-overlay');
    this.overlayTitleElement = document.getElementById('overlay-title');
    this.overlayMessageElement = document.getElementById('overlay-message');
  }

  /**
   * Main render method that draws the entire game state
   */
  public render(state: GameState): void {
    this.clearCanvas();
    this.drawGrid(state.config);
    this.drawSnake(state.snake, state.config);
    this.drawFood(state.food, state.config);
    this.updateUI(state);
    this.updateOverlay(state);
  }

  /**
   * Clear the canvas
   */
  public clearCanvas(): void {
    this.ctx.fillStyle = this.ctx.canvas.style.backgroundColor || '#FAFAFA';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the grid lines
   */
  public drawGrid(config: GameState['config']): void {
    const { gridSize, gridColor } = config;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw the snake
   */
  public drawSnake(snake: GameState['snake'], config: GameState['config']): void {
    const { gridSize, snakeColor, snakeHeadColor } = config;
    const body = snake.body;

    // Draw snake body
    for (let i = 0; i < body.length; i++) {
      const segment = body[i];
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;

      // Head is drawn differently
      if (i === 0) {
        this.ctx.fillStyle = snakeHeadColor;
        this.ctx.fillRect(x, y, gridSize, gridSize);

        // Draw eyes on the head based on direction
        this.drawSnakeEyes(x, y, gridSize, snake.direction);
      } else {
        // Body segments
        this.ctx.fillStyle = snakeColor;
        this.ctx.fillRect(x, y, gridSize, gridSize);

        // Add some texture to body segments
        this.ctx.fillStyle = '#FFFFFF22';
        this.ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
      }

      // Add border to segments
      this.ctx.strokeStyle = '#00000022';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  /**
   * Draw eyes on the snake's head based on direction
   */
  private drawSnakeEyes(x: number, y: number, gridSize: number, direction: string): void {
    const eyeSize = gridSize / 5;
    const eyeOffset = gridSize / 3;

    this.ctx.fillStyle = '#FFFFFF';

    switch (direction) {
      case 'right':
        this.ctx.fillRect(x + gridSize - eyeOffset, y + eyeOffset, eyeSize, eyeSize);
        this.ctx.fillRect(x + gridSize - eyeOffset, y + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        break;
      case 'left':
        this.ctx.fillRect(x + eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
        this.ctx.fillRect(x + eyeOffset - eyeSize, y + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        break;
      case 'up':
        this.ctx.fillRect(x + eyeOffset, y + eyeOffset - eyeSize, eyeSize, eyeSize);
        this.ctx.fillRect(x + gridSize - eyeOffset - eyeSize, y + eyeOffset - eyeSize, eyeSize, eyeSize);
        break;
      case 'down':
        this.ctx.fillRect(x + eyeOffset, y + gridSize - eyeOffset, eyeSize, eyeSize);
        this.ctx.fillRect(x + gridSize - eyeOffset - eyeSize, y + gridSize - eyeOffset, eyeSize, eyeSize);
        break;
    }
  }

  /**
   * Draw the food
   */
  public drawFood(food: GameState['food'], config: GameState['config']): void {
    const { gridSize, foodColor } = config;
    const { x, y } = food.position;

    const centerX = x * gridSize + gridSize / 2;
    const centerY = y * gridSize + gridSize / 2;
    const radius = gridSize / 2 - 2;

    // Draw food as a circle with gradient
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.5, foodColor);
    gradient.addColorStop(1, '#D32F2F');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Add shine effect
    this.ctx.fillStyle = '#FFFFFF66';
    this.ctx.beginPath();
    this.ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Update the UI elements (score, stats, etc.)
   */
  private updateUI(state: GameState): void {
    if (this.scoreElement) this.scoreElement.textContent = state.score.toString();
    if (this.highScoreElement) this.highScoreElement.textContent = state.highScore.toString();
    if (this.foodEatenElement) this.foodEatenElement.textContent = state.foodEaten.toString();
    if (this.snakeLengthElement) this.snakeLengthElement.textContent = state.snake.length.toString();
    if (this.movesMadeElement) this.movesMadeElement.textContent = state.movesMade.toString();

    // Update game time
    if (this.gameTimeElement && state.startTime) {
      const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      this.gameTimeElement.textContent = `${elapsedSeconds}s`;
    }
  }

  /**
   * Update the game overlay (start/pause/game over screen)
   */
  private updateOverlay(state: GameState): void {
    if (!this.overlayElement || !this.overlayTitleElement || !this.overlayMessageElement) {
      return;
    }

    if (!state.isRunning || state.isPaused || state.gameOver) {
      this.overlayElement.style.display = 'flex';

      if (state.gameOver) {
        this.overlayTitleElement.textContent = 'Game Over!';
        this.overlayMessageElement.textContent = `Final Score: ${state.score}. Press RESET to play again.`;
      } else if (state.isPaused) {
        this.overlayTitleElement.textContent = 'Game Paused';
        this.overlayMessageElement.textContent = 'Press SPACE or click RESUME to continue';
      } else {
        this.overlayTitleElement.textContent = 'Snake Game';
        this.overlayMessageElement.textContent = 'Press START or SPACEBAR to begin';
      }
    } else {
      this.overlayElement.style.display = 'none';
    }
  }

  /**
   * Draw the UI (for interface compatibility)
   */
  public drawUI(state: GameState): void {
    this.updateUI(state);
    this.updateOverlay(state);
  }
}
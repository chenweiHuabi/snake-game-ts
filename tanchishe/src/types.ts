/**
 * TypeScript type definitions for the Snake game
 */

/**
 * Represents a position in the game grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Directions the snake can move
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Game configuration
 */
export interface GameConfig {
  gridSize: number;
  gridWidth: number;
  gridHeight: number;
  initialSnakeLength: number;
  fps: number;
  snakeColor: string;
  snakeHeadColor: string;
  foodColor: string;
  gridColor: string;
  backgroundColor: string;
}

/**
 * Game state
 */
export interface GameState {
  snake: Snake;
  food: Food;
  score: number;
  highScore: number;
  isRunning: boolean;
  isPaused: boolean;
  gameOver: boolean;
  config: GameConfig;
  foodEaten: number;
  movesMade: number;
  startTime: number | null;
  elapsedTime: number;
}

/**
 * Snake class interface
 */
export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  length: number;

  move(): void;
  grow(): void;
  setDirection(newDirection: Direction): void;
  checkSelfCollision(): boolean;
  checkWallCollision(gridWidth: number, gridHeight: number): boolean;
  getHead(): Position;
}

/**
 * Food class interface
 */
export interface Food {
  position: Position;

  generateNewPosition(snakeBody: Position[], gridWidth: number, gridHeight: number): void;
  isEatenBy(snakeHead: Position): boolean;
}

/**
 * Renderer interface
 */
export interface GameRenderer {
  render(state: GameState): void;
  clearCanvas(): void;
  drawGrid(): void;
  drawSnake(snake: Snake): void;
  drawFood(food: Food): void;
  drawUI(state: GameState): void;
}
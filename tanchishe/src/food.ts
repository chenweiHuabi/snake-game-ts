import { Position, Food } from './types';

/**
 * Food class representing the collectible food items
 */
export class FoodImpl implements Food {
  public position: Position;

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  /**
   * Generate a new random position for the food
   * Ensures food doesn't appear on the snake's body
   */
  public generateNewPosition(snakeBody: Position[], gridWidth: number, gridHeight: number): void {
    let newPosition: Position;
    let positionValid = false;
    const maxAttempts = 100; // Prevent infinite loop

    for (let attempts = 0; attempts < maxAttempts && !positionValid; attempts++) {
      // Generate random position within grid bounds
      newPosition = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight)
      };

      // Check if position is not on snake's body
      positionValid = true;
      for (const segment of snakeBody) {
        if (segment.x === newPosition.x && segment.y === newPosition.y) {
          positionValid = false;
          break;
        }
      }

      if (positionValid) {
        this.position = newPosition;
        return;
      }
    }

    // If we couldn't find a valid position after max attempts, use a fallback
    // Try positions systematically
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        let collision = false;
        for (const segment of snakeBody) {
          if (segment.x === x && segment.y === y) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          this.position = { x, y };
          return;
        }
      }
    }

    // Last resort: use first position
    this.position = { x: 0, y: 0 };
  }

  /**
   * Check if the food has been eaten by the snake
   */
  public isEatenBy(snakeHead: Position): boolean {
    return snakeHead.x === this.position.x && snakeHead.y === this.position.y;
  }

  /**
   * Get the current food position
   */
  public getPosition(): Position {
    return this.position;
  }

  /**
   * Reset food to a default position
   */
  public reset(): void {
    this.position = { x: 0, y: 0 };
  }
}
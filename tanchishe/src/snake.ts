import { Position, Direction, Snake } from './types';

/**
 * Snake class representing the player-controlled snake
 */
export class SnakeImpl implements Snake {
  public body: Position[];
  public direction: Direction;
  public nextDirection: Direction;
  public length: number;

  constructor(initialPosition: Position = { x: 10, y: 10 }, initialLength: number = 3) {
    this.body = [];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.length = initialLength;

    // Initialize snake body
    for (let i = 0; i < initialLength; i++) {
      this.body.push({
        x: initialPosition.x - i,
        y: initialPosition.y
      });
    }
  }

  /**
   * Move the snake in the current direction
   */
  public move(): void {
    // Update direction from the next direction
    this.direction = this.nextDirection;

    // Create new head position based on direction
    const head = this.getHead();
    let newHead: Position;

    switch (this.direction) {
      case 'up':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'down':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'left':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'right':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Add new head to the beginning of the body
    this.body.unshift(newHead);

    // Remove tail if snake hasn't grown
    if (this.body.length > this.length) {
      this.body.pop();
    }
  }

  /**
   * Increase the snake's length
   */
  public grow(): void {
    this.length++;
  }

  /**
   * Set the snake's direction
   * Prevents 180-degree turns (can't go directly opposite)
   */
  public setDirection(newDirection: Direction): void {
    const oppositeDirections: Record<Direction, Direction> = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    // Only allow direction change if it's not opposite to current direction
    if (newDirection !== oppositeDirections[this.direction]) {
      this.nextDirection = newDirection;
    }
  }

  /**
   * Check if the snake has collided with itself
   */
  public checkSelfCollision(): boolean {
    const head = this.getHead();

    // Check if head collides with any body segment (skip the head itself)
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if the snake has collided with the wall
   */
  public checkWallCollision(gridWidth: number, gridHeight: number): boolean {
    const head = this.getHead();

    return (
      head.x < 0 ||
      head.x >= gridWidth ||
      head.y < 0 ||
      head.y >= gridHeight
    );
  }

  /**
   * Get the current head position
   */
  public getHead(): Position {
    return this.body[0];
  }

  /**
   * Get the current tail position
   */
  public getTail(): Position {
    return this.body[this.body.length - 1];
  }

  /**
   * Reset the snake to initial state
   */
  public reset(initialPosition: Position = { x: 10, y: 10 }, initialLength: number = 3): void {
    this.body = [];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.length = initialLength;

    for (let i = 0; i < initialLength; i++) {
      this.body.push({
        x: initialPosition.x - i,
        y: initialPosition.y
      });
    }
  }
}
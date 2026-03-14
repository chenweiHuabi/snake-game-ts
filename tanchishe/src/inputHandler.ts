import { Direction } from './types';

/**
 * Input handler for keyboard controls
 */
export class InputHandler {
  private game: any; // Reference to the Game instance
  private keyState: Map<string, boolean> = new Map();
  private lastProcessedKey: string | null = null;

  constructor(game: any) {
    this.game = game;
    this.setupEventListeners();
  }

  /**
   * Set up keyboard event listeners
   */
  private setupEventListeners(): void {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));

    // Setup button event listeners
    this.setupButtonListeners();
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default behavior for game controls
    const key = event.key.toLowerCase();
    this.keyState.set(key, true);

    // Process the key
    this.processKey(key);

    // Prevent arrow keys from scrolling the page
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault();
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keyState.set(key, false);

    if (key === this.lastProcessedKey) {
      this.lastProcessedKey = null;
    }
  }

  /**
   * Process a key press
   */
  private processKey(key: string): void {
    // Only process if this key hasn't been processed yet in this frame
    if (key === this.lastProcessedKey) {
      return;
    }

    switch (key) {
      case 'arrowup':
      case 'w':
        this.game.setSnakeDirection('up');
        this.lastProcessedKey = key;
        break;

      case 'arrowdown':
      case 's':
        this.game.setSnakeDirection('down');
        this.lastProcessedKey = key;
        break;

      case 'arrowleft':
      case 'a':
        this.game.setSnakeDirection('left');
        this.lastProcessedKey = key;
        break;

      case 'arrowright':
      case 'd':
        this.game.setSnakeDirection('right');
        this.lastProcessedKey = key;
        break;

      case ' ':
        this.game.togglePause();
        this.lastProcessedKey = key;
        break;

      case 'r':
        this.game.reset();
        this.lastProcessedKey = key;
        break;

      case 'enter':
        if (!this.game.isRunning || this.game.gameOver) {
          this.game.start();
        }
        this.lastProcessedKey = key;
        break;

      case 'escape':
        this.game.togglePause();
        this.lastProcessedKey = key;
        break;
    }
  }

  /**
   * Set up button event listeners from the UI
   */
  private setupButtonListeners(): void {
    // Start button
    const startButton = document.getElementById('start-btn');
    const overlayStartButton = document.getElementById('overlay-start-btn');
    const pauseButton = document.getElementById('pause-btn');
    const resetButton = document.getElementById('reset-btn');

    if (startButton) {
      startButton.addEventListener('click', () => {
        if (!this.game.isRunning || this.game.gameOver) {
          this.game.start();
        } else {
          this.game.togglePause();
        }
      });
    }

    if (overlayStartButton) {
      overlayStartButton.addEventListener('click', () => {
        if (!this.game.isRunning || this.game.gameOver) {
          this.game.start();
        }
      });
    }

    if (pauseButton) {
      pauseButton.addEventListener('click', () => {
        this.game.togglePause();
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.game.reset();
      });
    }

    // Game settings
    const speedSelect = document.getElementById('speed-select');
    const gridSizeSelect = document.getElementById('grid-size-select');
    const clearHistoryButton = document.getElementById('clear-history-btn');

    if (speedSelect) {
      speedSelect.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        const fps = parseInt(target.value);
        this.game.setFPS(fps);
      });
    }

    if (gridSizeSelect) {
      gridSizeSelect.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        const gridSize = parseInt(target.value);

        // Calculate grid dimensions based on canvas size and grid size
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (canvas) {
          const gridWidth = Math.floor(canvas.width / gridSize);
          const gridHeight = Math.floor(canvas.height / gridSize);
          this.game.setGridSize(gridSize, gridWidth, gridHeight);
        }
      });
    }

    if (clearHistoryButton) {
      clearHistoryButton.addEventListener('click', () => {
        const historyList = document.querySelector('.history-list');
        if (historyList) {
          historyList.innerHTML = '<div class="history-item">History cleared</div>';
        }
      });
    }
  }

  /**
   * Update button states based on game state
   */
  public updateButtonStates(isRunning: boolean, isPaused: boolean, gameOver: boolean): void {
    const startButton = document.getElementById('start-btn');
    const pauseButton = document.getElementById('pause-btn');
    const overlayStartButton = document.getElementById('overlay-start-btn');

    if (startButton) {
      if (!isRunning || gameOver) {
        startButton.innerHTML = '<i class="fas fa-play"></i> Start Game';
        startButton.classList.remove('btn-secondary');
        startButton.classList.add('btn-primary');
      } else if (isPaused) {
        startButton.innerHTML = '<i class="fas fa-play"></i> Resume';
        startButton.classList.remove('btn-secondary');
        startButton.classList.add('btn-primary');
      } else {
        startButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        startButton.classList.remove('btn-primary');
        startButton.classList.add('btn-secondary');
      }
    }

    if (pauseButton) {
      pauseButton.disabled = !isRunning || gameOver;
      if (isPaused && isRunning) {
        pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
      } else {
        pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
      }
    }

    if (overlayStartButton) {
      if (gameOver) {
        overlayStartButton.innerHTML = '<i class="fas fa-redo"></i> Play Again';
      } else if (isPaused) {
        overlayStartButton.innerHTML = '<i class="fas fa-play"></i> Resume';
      } else {
        overlayStartButton.innerHTML = '<i class="fas fa-play"></i> Start Game';
      }
    }
  }

  /**
   * Add a message to the game history
   */
  public addHistoryMessage(message: string): void {
    const historyList = document.querySelector('.history-list');
    if (historyList) {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.textContent = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${message}`;

      // Add to the beginning of the list
      historyList.insertBefore(historyItem, historyList.firstChild);

      // Limit history to 10 items
      while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild!);
      }
    }
  }
}
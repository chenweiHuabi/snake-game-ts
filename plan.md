# 贪吃蛇游戏设计文档

## 项目概述
使用HTML、TypeScript和tsup构建的经典贪吃蛇游戏。游戏包含基本的贪吃蛇功能：移动、吃食物、增长、碰撞检测和分数系统。

## 技术栈
- **HTML5**: 游戏画布和UI结构
- **TypeScript**: 游戏逻辑和类型安全
- **Canvas API**: 2D图形渲染
- **tsup**: TypeScript打包工具（基于esbuild）
- **CSS3**: 游戏样式和响应式设计

## 项目结构
```
tanchishe/
├── src/
│   ├── game.ts          # 主要游戏逻辑
│   ├── snake.ts         # 蛇类实现
│   ├── food.ts          # 食物类实现
│   ├── gameRenderer.ts  # 渲染逻辑
│   ├── inputHandler.ts  # 输入处理
│   └── types.ts         # TypeScript类型定义
├── public/
│   ├── index.html       # HTML入口文件
│   └── style.css        # 样式文件
├── dist/                # 构建输出目录
├── package.json         # 项目依赖和脚本
├── tsconfig.json        # TypeScript配置
├── tsup.config.ts       # tsup构建配置
└── README.md           # 项目说明
```

## 核心功能设计

### 1. 游戏状态管理
```typescript
interface GameState {
  snake: Snake;          // 蛇对象
  food: Food;            // 食物对象
  score: number;         // 当前得分
  highScore: number;     // 最高分
  isRunning: boolean;    // 游戏运行状态
  isPaused: boolean;     // 游戏暂停状态
  gameOver: boolean;     // 游戏结束标志
  gridSize: number;      // 网格大小（像素）
  gridWidth: number;     // 网格宽度（格子数）
  gridHeight: number;    // 网格高度（格子数）
}
```

### 2. 蛇类 (Snake)
- **属性**:
  - `body`: Array<{x: number, y: number}> - 身体段位置
  - `direction`: 'up' | 'down' | 'left' | 'right' - 当前移动方向
  - `nextDirection`: 下一个方向（防止一次输入改变多个方向）
- **方法**:
  - `move()`: 根据方向移动蛇
  - `grow()`: 增加身体长度
  - `checkSelfCollision()`: 检查是否撞到自己
  - `checkWallCollision(gridWidth, gridHeight)`: 检查是否撞墙
  - `setDirection(newDirection)`: 设置移动方向

### 3. 食物类 (Food)
- **属性**:
  - `position`: {x: number, y: number} - 食物位置
- **方法**:
  - `generateNewPosition(snakeBody, gridWidth, gridHeight)`: 在随机位置生成食物
  - `isEatenBy(snakeHead)`: 检查是否被蛇吃掉

### 4. 游戏主循环
```typescript
class Game {
  private state: GameState;
  private lastRenderTime: number = 0;
  private readonly fps: number = 10; // 游戏帧率

  constructor() {
    this.init();
  }

  private init(): void {
    // 初始化游戏状态
    this.state = {
      snake: new Snake(),
      food: new Food(),
      score: 0,
      highScore: 0,
      isRunning: false,
      isPaused: false,
      gameOver: false,
      gridSize: 20,
      gridWidth: 30,
      gridHeight: 20
    };

    // 生成初始食物
    this.state.food.generateNewPosition(
      this.state.snake.body,
      this.state.gridWidth,
      this.state.gridHeight
    );
  }

  private gameLoop(currentTime: number): void {
    // 控制游戏帧率
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.fps) return;

    this.lastRenderTime = currentTime;

    if (this.state.isRunning && !this.state.isPaused && !this.state.gameOver) {
      this.update();
      this.render();
    }

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(): void {
    // 更新游戏逻辑
    this.state.snake.move();

    // 检查食物碰撞
    if (this.state.food.isEatenBy(this.state.snake.body[0])) {
      this.state.snake.grow();
      this.state.score += 10;
      this.state.food.generateNewPosition(
        this.state.snake.body,
        this.state.gridWidth,
        this.state.gridHeight
      );

      // 更新最高分
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
      }
    }

    // 检查碰撞
    if (
      this.state.snake.checkWallCollision(this.state.gridWidth, this.state.gridHeight) ||
      this.state.snake.checkSelfCollision()
    ) {
      this.state.gameOver = true;
      this.state.isRunning = false;
    }
  }

  private render(): void {
    // 渲染游戏画面
    GameRenderer.render(this.state);
  }

  public start(): void {
    this.state.isRunning = true;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  public pause(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  public reset(): void {
    this.init();
  }
}
```

### 5. 输入处理
- **键盘控制**:
  - 方向键: 控制蛇的移动方向
  - 空格键: 开始/暂停游戏
  - R键: 重置游戏
- **防止反向移动**: 确保蛇不能直接反向移动（例如：向右移动时不能直接向左）

### 6. 渲染系统
- **Canvas渲染**:
  - 蛇身: 绿色矩形
  - 蛇头: 深绿色矩形
  - 食物: 红色圆形
  - 网格背景: 浅灰色线条
- **UI元素**:
  - 分数显示
  - 最高分显示
  - 游戏状态提示（开始、暂停、游戏结束）
  - 控制说明

### 7. 游戏配置
```typescript
const GAME_CONFIG = {
  INITIAL_SNAKE_LENGTH: 3,
  GRID_SIZE: 20,          // 每个格子的像素大小
  GRID_WIDTH: 30,         // 水平格子数
  GRID_HEIGHT: 20,        // 垂直格子数
  FPS: 10,                // 游戏帧率（每秒更新次数）
  SNAKE_COLOR: '#4CAF50',
  SNAKE_HEAD_COLOR: '#388E3C',
  FOOD_COLOR: '#F44336',
  GRID_COLOR: '#E0E0E0',
  BACKGROUND_COLOR: '#FAFAFA'
};
```

## 构建配置

### package.json 脚本
```json
{
  "scripts": {
    "dev": "tsup src/game.ts --watch --format iife --global-name Game --out-dir dist --public-dir ./public",
    "build": "tsup src/game.ts --format iife --global-name Game --minify --out-dir dist --public-dir ./public",
    "preview": "serve dist"
  }
}
```

### tsup.config.ts
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/game.ts'],
  format: ['iife'],
  globalName: 'Game',
  outDir: 'dist',
  publicDir: 'public',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: false
});
```

## 开发计划

### 阶段1: 项目初始化
1. 创建项目结构和配置文件
2. 设置TypeScript和tsup构建环境
3. 创建基本的HTML和CSS框架

### 阶段2: 核心逻辑实现
1. 实现蛇类的基本移动和方向控制
2. 实现食物生成和碰撞检测
3. 实现游戏状态管理

### 阶段3: 渲染系统
1. 实现Canvas渲染逻辑
2. 添加UI元素和样式
3. 实现游戏界面布局

### 阶段4: 交互和优化
1. 添加键盘控制
2. 实现游戏状态切换（开始、暂停、重置）
3. 添加分数系统和游戏结束逻辑
4. 优化性能和代码结构

### 阶段5: 测试和部署
1. 测试游戏功能
2. 优化移动端体验
3. 构建生产版本

## 预期功能
- [ ] 基本的贪吃蛇移动和方向控制
- [ ] 食物生成和吃食物增长
- [ ] 碰撞检测（墙壁、自身）
- [ ] 分数系统和最高分记录
- [ ] 游戏状态控制（开始、暂停、重置）
- [ ] 响应式设计，支持不同屏幕尺寸
- [ ] 键盘控制说明
- [ ] 游戏结束提示和重新开始

## 扩展功能（可选）
- [ ] 难度选择（速度调整）
- [ ] 障碍物模式
- [ ] 音效和背景音乐
- [ ] 本地存储最高分
- [ ] 触摸控制（移动端）
- [ ] 游戏主题切换

## 开发注意事项
1. 使用模块化设计，便于扩展和维护
2. 遵循TypeScript最佳实践，确保类型安全
3. 优化游戏性能，避免不必要的渲染
4. 确保代码可读性和可维护性
5. 添加适当的注释和文档
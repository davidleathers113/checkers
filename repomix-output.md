This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where line numbers have been added, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info
### User Provided Header
# Extensible Checkers Game

A TypeScript-based extensible checkers game implementation with clean architecture principles. Features pluggable rule systems, multiple UI implementations (Console and Web), and comprehensive testing.

## Architecture Highlights
- Strategy pattern for customizable game rules
- Observer pattern for state management
- Command pattern for move history
- Strict TypeScript with no implicit any
- 80% test coverage thresholds


# Directory Structure
```
.claude/
  settings.local.json
docs/
  API.md
  ARCHITECTURE.md
  EXTENSIBILITY.md
  RULE_VALIDATION_ANALYSIS.md
examples/
  CrazyCheckers.ts
  InternationalDraughts.ts
  README.md
  TimedCheckers.ts
playwright/
  config/
    playwright-local.config.ts
    playwright.config.ts
  support/
    gamePage.ts
    testData.ts
  tests/
    accessibility.spec.ts
    config.spec.ts
    gameplay.spec.ts
    responsiveness.spec.ts
    smoke.spec.ts
    visual.spec.ts
  README.md
src/
  commands/
    Command.ts
    index.ts
    MoveCommand.ts
  core/
    Board.ts
    Game.ts
    GameObserver.ts
    index.ts
    Move.ts
    Position.ts
  errors/
    index.ts
  pieces/
    index.ts
    KingPiece.ts
    Piece.ts
    RegularPiece.ts
  rules/
    CustomRulesBase.ts
    index.ts
    RuleEngine.ts
    StandardRules.ts
  strategies/
    BasicMoveValidator.ts
    CaptureValidator.ts
    DiagonalMoveValidator.ts
    index.ts
    MandatoryCaptureValidator.ts
    MoveValidator.ts
    ValidationEngine.ts
  types/
    index.ts
  ui/
    web/
      components/
        GameBoard.tsx
        GameConfig.tsx
        GameControls.tsx
        GamePiece.tsx
        GameSquare.tsx
        GameStatus.tsx
      contexts/
        GameConfigContext.tsx
      hooks/
        useAnimatedGame.ts
        useConfigurableGame.ts
        useGame.ts
      types/
        GameConfig.ts
      GameApp.tsx
      index.html
      main.tsx
      styles.css
      tsconfig.json
    ConsoleUI.ts
    GameUI.ts
    index.ts
  utils/
    BoardUtils.ts
    index.ts
    PerformanceProfiler.ts
  index.ts
tests/
  core/
    Board.test.ts
    Move.test.ts
    Position.test.ts
  integration/
    RuleConfiguration.test.tsx
    WebGameplay.test.tsx
  performance/
    BoardPerformance.test.ts
    MoveGeneration.test.ts
    OptimizationBenchmark.test.ts
  pieces/
    RegularPiece.test.ts
  rules/
    StandardRules.test.ts
  ui/
    GameBoard.test.tsx
    GameConfig.test.tsx
    Performance.test.ts
    UserFlow.test.tsx
  setup.ts
.eslintignore
.gitignore
.repomixignore
eslint.config.js
jest.config.js
package.json
README.md
repomix.config.json
tsconfig.json
vite.config.ts
```

# Files

## File: .claude/settings.local.json
````json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev:*)",
      "Bash(git init:*)",
      "Bash(git add:*)",
      "Bash(git rm:*)",
      "Bash(git commit:*)",
      "Bash(git branch:*)",
      "Bash(git remote add:*)",
      "Bash(git push:*)",
      "Bash(npm test)",
      "Bash(npm test:*)",
      "Bash(npm run lint)",
      "Bash(npm run typecheck:*)",
      "mcp__mcp-sequentialthinking-tools__sequentialthinking_tools",
      "Bash(npm install:*)",
      "Bash(mkdir:*)",
      "Bash(npm run build:web:*)",
      "Bash(LOG_PERFORMANCE=1 npm test tests/performance/BoardPerformance.test.ts)",
      "Bash(NODE_ENV=test LOG_PERFORMANCE=1 npx jest tests/performance/BoardPerformance.test.ts --verbose --no-coverage 2 >& 1)",
      "Bash(git checkout:*)",
      "Bash(gh pr merge:*)",
      "Bash(git pull:*)",
      "Bash(touch:*)",
      "Bash(npm run build:*)",
      "mcp__Context7__resolve-library-id",
      "mcp__Context7__get-library-docs",
      "Bash(pkill:*)",
      "Bash(true)",
      "Bash(top:*)",
      "Bash(grep:*)",
      "Bash(npx playwright:*)",
      "Bash(sed:*)",
      "Bash(npm run test:e2e:smoke:*)",
      "Bash(lsof:*)",
      "Bash(curl:*)",
      "Bash(ls:*)",
      "Bash(timeout:*)",
      "Bash(node test-direct.js)",
      "Bash(rm:*)",
      "Bash(npm run test:e2e:*)",
      "Bash(npx ts-node:*)",
      "Bash(node:*)",
      "Bash(find:*)",
      "Bash(repomix:*)"
    ],
    "deny": []
  }
}
````

## File: .repomixignore
````
# Dependencies and Package Managers
node_modules/
vendor/
.venv/
venv/
pip-cache/
.bundle/
bower_components/
jspm_packages/
.pnp.*
.yarn/*

# Build Outputs
dist/
build/
out/
target/
*.egg-info/
__pycache__/
*.pyc
*.pyo
*.class
*.o
*.so
*.dll
*.exe
*.bundle.js
*.min.js
*.map

# IDE and Editor Files
.idea/
.vscode/
*.swp
*.swo
*~
.project
.classpath
.settings/
*.sublime-project
*.sublime-workspace

# Testing and Coverage
coverage/
.coverage
*.lcov
.nyc_output/
test-results/
jest-results/
pytest_cache/
.pytest_cache/
playwright-report/
test-results/
**/__mocks__/

# Visual Test Snapshots
**/visual.spec.ts-snapshots/
**/*.spec.ts-snapshots/
**/screenshots/
**/baseline/

# Logs and Temporary Files
*.log
logs/
*.tmp
*.temp
*.cache
.DS_Store
Thumbs.db
desktop.ini

# Documentation Build
docs/_build/
docs/_site/
site/
.docusaurus/
typedoc/

# Environment and Secrets
.env
.env.*
*.pem
*.key
*.cert
secrets/
credentials/
.npmrc
.netrc

# Project-Specific Exclusions
CLAUDE.md
repomix-output.md
repomix-output-*.md
*.lock
package-lock.json
yarn.lock
pnpm-lock.yaml

# Development Planning and AI Assistant Files
IMPLEMENTATION_PLAN.md
PERFORMANCE_IMPROVEMENTS.md
.taskmaster/
*.ai.md
*.copilot.md
*.cursor.md

# CI/CD and Deployment
.github/workflows/
.gitlab-ci.yml
.travis.yml
.circleci/
deployment/
scripts/deploy/

# Generated Files
*.generated.*
*.d.ts
src/**/*.js
src/**/*.jsx
tests/**/*.js

# Large Binary Assets
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.webp
*.mp4
*.mp3
*.wav
*.pdf
*.zip
*.tar
*.gz

# Database Files
*.db
*.sqlite
*.sqlite3
*.sql

# Cache and Build Artifacts
.cache/
.parcel-cache/
.next/
.nuxt/
.turbo/
.webpack/
````

## File: repomix.config.json
````json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "version": "2.0",
  "input": {
    "maxFileSize": 5000000,
    "encoding": "utf-8",
    "respectGitignore": true,
    "followSymlinks": false,
    "include": [
      "src/**/*.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
      "examples/**/*.ts",
      "playwright/tests/**/*.spec.ts",
      "*.{json,md,yml,yaml,js}",
      "!*.min.js",
      "!*.bundle.js",
      "!dist/**",
      "!playwright-report/**",
      "!test-results/**"
    ],
    "ignore": {
      "useGitignore": true,
      "useDefaultPatterns": true,
      "customPatterns": [
        "node_modules/**",
        "dist/**",
        "playwright-report/**",
        "test-results/**",
        "coverage/**",
        "*.log",
        "*.tmp",
        ".env*",
        "**/__mocks__/**",
        "**/playwright/**/visual.spec.ts-snapshots/**",
        "CLAUDE.md",
        "repomix-output.md"
      ]
    }
  },
  "processing": {
    "contentFilters": {
      "removeTestData": false,
      "removeMockData": false,
      "removeGeneratedCode": ["*.generated.*", "*.d.ts"],
      "normalizeWhitespace": true
    },
    "codeProcessing": {
      "removeComments": false,
      "removeEmptyLines": false,
      "trimTrailingWhitespace": true,
      "normalizeLineEndings": "lf",
      "preserveStringLiterals": true
    },
    "contextEnhancement": {
      "extractImports": true,
      "extractExports": true,
      "extractDependencies": true,
      "extractTodos": true,
      "includeGitInfo": true,
      "includeFileStats": true
    }
  },
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "format": "structured",
    "compress": true,
    "splitThreshold": 2000000,
    "headerText": "# Extensible Checkers Game\n\nA TypeScript-based extensible checkers game implementation with clean architecture principles. Features pluggable rule systems, multiple UI implementations (Console and Web), and comprehensive testing.\n\n## Architecture Highlights\n- Strategy pattern for customizable game rules\n- Observer pattern for state management\n- Command pattern for move history\n- Strict TypeScript with no implicit any\n- 80% test coverage thresholds\n",
    "fileSummary": true,
    "directoryStructure": true,
    "showLineNumbers": true,
    "includeEmptyFiles": false,
    "groupByType": true,
    "sortBy": "priority",
    "tableOfContents": true,
    "includeMetrics": true
  },
  "security": {
    "enableChecks": true,
    "excludeSuspiciousFiles": true,
    "hideSensitiveData": true,
    "scanForSecrets": true,
    "secretPatterns": [
      "api[_-]?key",
      "secret[_-]?key",
      "password",
      "token",
      "credential",
      "private[_-]?key"
    ]
  },
  "tokens": {
    "enableCounting": true,
    "provider": "tiktoken",
    "model": "gpt-4o",
    "includeBreakdown": true,
    "warningThreshold": 100000,
    "errorThreshold": 200000
  }
}
````

## File: docs/API.md
````markdown
# API Reference

## Core Classes

### Board

Represents the game board state.

```typescript
class Board {
  constructor(size: number = 8)
  
  // Get piece at position
  getPiece(position: Position): Piece | null
  
  // Place piece at position (returns new Board)
  setPiece(position: Position, piece: Piece | null): Board
  
  // Move piece (returns new Board)
  movePiece(from: Position, to: Position): Board
  
  // Get all pieces for a player
  getPlayerPieces(player: Player): Array<{position: Position, piece: Piece}>
  
  // Check if position is valid
  isValidPosition(position: Position): boolean
  
  // Check if position is empty
  isEmpty(position: Position): boolean
  
  // Create deep copy
  copy(): Board
}
```

### Position

Represents a board coordinate.

```typescript
class Position {
  constructor(row: number, col: number)
  
  readonly row: number
  readonly col: number
  
  // Check if position equals another
  equals(other: Position): boolean
  
  // Get diagonal positions
  getDiagonalPositions(distance: number = 1): Position[]
  
  // Check if on board
  isValid(boardSize: number = 8): boolean
  
  // String representation (e.g., "a1", "h8")
  toString(): string
  
  // Create from string
  static fromString(notation: string): Position
}
```

### Move

Represents a game move.

```typescript
class Move {
  constructor(
    from: Position,
    to: Position,
    captures: Position[] = []
  )
  
  readonly from: Position
  readonly to: Position
  readonly captures: Position[]
  
  // Check if move is a capture
  isCapture(): boolean
  
  // Check if move is valid distance
  isValidDistance(): boolean
  
  // Apply move to board (returns new Board)
  apply(board: Board): Board
}
```

### Game

Main game controller.

```typescript
class Game {
  constructor(
    ruleEngine: RuleEngine,
    board?: Board
  )
  
  // Current game state
  getCurrentPlayer(): Player
  getBoard(): Board
  getHistory(): Move[]
  getMoveCount(): number
  
  // Game actions
  makeMove(move: Move): boolean
  undoMove(): boolean
  redoMove(): boolean
  
  // Game status
  isGameOver(): boolean
  getWinner(): Player | null
  getPossibleMoves(position: Position): Move[]
  getAllPossibleMoves(): Move[]
  
  // Observer pattern
  addObserver(observer: GameObserver): void
  removeObserver(observer: GameObserver): void
}
```

## Piece Classes

### Piece (Abstract)

Base class for all game pieces.

```typescript
abstract class Piece {
  constructor(player: Player)
  
  readonly player: Player
  
  // Check if piece can move to position
  abstract canMove(from: Position, to: Position, board: Board): boolean
  
  // Get all possible moves
  abstract getPossibleMoves(position: Position, board: Board): Position[]
  
  // Get capture moves
  abstract getCaptureMoves(position: Position, board: Board): Move[]
  
  // Create copy
  abstract copy(): Piece
  
  // Promote piece (for regular → king)
  abstract promote(): Piece
}
```

### RegularPiece

Standard checker piece.

```typescript
class RegularPiece extends Piece {
  canMove(from: Position, to: Position, board: Board): boolean
  getPossibleMoves(position: Position, board: Board): Position[]
  getCaptureMoves(position: Position, board: Board): Move[]
  promote(): KingPiece
  copy(): RegularPiece
}
```

### KingPiece

King (crowned) piece.

```typescript
class KingPiece extends Piece {
  canMove(from: Position, to: Position, board: Board): boolean
  getPossibleMoves(position: Position, board: Board): Position[]
  getCaptureMoves(position: Position, board: Board): Move[]
  promote(): KingPiece // Returns self
  copy(): KingPiece
}
```

## Rules and Validation

### RuleEngine (Interface)

Interface for game rule implementations.

```typescript
interface RuleEngine {
  // Validate a move
  validateMove(board: Board, move: Move): boolean
  
  // Get possible moves from position
  getPossibleMoves(board: Board, position: Position): Move[]
  
  // Check game end condition
  isGameOver(board: Board): boolean
  
  // Determine winner
  getWinner(board: Board): Player | null
  
  // Get mandatory moves (e.g., forced captures)
  getMandatoryMoves(board: Board, player: Player): Move[]
  
  // Check if piece should be promoted
  shouldPromote(position: Position, piece: Piece): boolean
}
```

### StandardRules

Traditional checkers rules implementation.

```typescript
class StandardRules implements RuleEngine {
  validateMove(board: Board, move: Move): boolean
  getPossibleMoves(board: Board, position: Position): Move[]
  isGameOver(board: Board): boolean
  getWinner(board: Board): Player | null
  getMandatoryMoves(board: Board, player: Player): Move[]
  shouldPromote(position: Position, piece: Piece): boolean
}
```

## UI Interfaces

### GameUI (Interface)

Interface for UI implementations.

```typescript
interface GameUI {
  // Render current board state
  render(board: Board): void
  
  // Get move from user
  getMove(): Promise<Move>
  
  // Display message
  showMessage(message: string): void
  
  // Handle game end
  onGameEnd(winner: Player | null): void
  
  // Highlight possible moves
  highlightMoves(moves: Move[]): void
  
  // Clear highlights
  clearHighlights(): void
}
```

### GameObserver (Interface)

Observer for game state changes.

```typescript
interface GameObserver {
  // Called when move is made
  onMove(move: Move, board: Board): void
  
  // Called when game ends
  onGameEnd(winner: Player | null): void
  
  // Called when turn changes
  onTurnChange(player: Player): void
  
  // Called on invalid move attempt
  onInvalidMove(move: Move, reason: string): void
}
```

## Types and Enums

### Player

```typescript
enum Player {
  RED = 'RED',
  BLACK = 'BLACK'
}
```

### Direction

```typescript
enum Direction {
  NORTH_WEST = 'NW',
  NORTH_EAST = 'NE',
  SOUTH_WEST = 'SW',
  SOUTH_EAST = 'SE'
}
```

### GameState

```typescript
interface GameState {
  board: Board
  currentPlayer: Player
  moveHistory: Move[]
  capturedPieces: Piece[]
  winner: Player | null
  isGameOver: boolean
}
```

## Utility Functions

### BoardUtils

```typescript
namespace BoardUtils {
  // Initialize standard game board
  function createStandardBoard(): Board
  
  // Check if position is dark square
  function isDarkSquare(position: Position): boolean
  
  // Get positions between two points
  function getPositionsBetween(from: Position, to: Position): Position[]
  
  // Check if positions are diagonal
  function areDiagonal(from: Position, to: Position): boolean
}
```

### MoveUtils

```typescript
namespace MoveUtils {
  // Parse move from notation (e.g., "a3-b4")
  function parseMove(notation: string): Move
  
  // Convert move to notation
  function toNotation(move: Move): string
  
  // Check if moves are equal
  function areEqual(move1: Move, move2: Move): boolean
}
```

## Error Classes

```typescript
class InvalidMoveError extends Error {
  constructor(move: Move, reason: string)
}

class InvalidPositionError extends Error {
  constructor(position: Position)
}

class GameOverError extends Error {
  constructor()
}
```
````

## File: docs/ARCHITECTURE.md
````markdown
# Architecture Documentation

## Overview

This checkers game is designed with extensibility and clean code principles at its core. The architecture follows SOLID principles and uses several design patterns to ensure flexibility and maintainability.

## Design Principles

1. **Single Responsibility Principle**: Each class has one reason to change
2. **Open/Closed Principle**: Open for extension, closed for modification
3. **Liskov Substitution**: Derived classes can replace base classes
4. **Interface Segregation**: Many specific interfaces over general ones
5. **Dependency Inversion**: Depend on abstractions, not concretions

## Core Design Patterns

### Strategy Pattern
Used in the `RuleEngine` to allow different game rule implementations:
- `StandardRules`: Traditional checkers rules
- `CustomRules`: User-defined rule variations

### Observer Pattern
The `Game` class notifies observers of state changes:
- UI components can react to game updates
- Analytics and logging can track game progress

### Factory Pattern
`PieceFactory` creates appropriate piece types:
- Regular pieces
- King pieces
- Future piece types (for variants)

### Command Pattern
Moves are encapsulated as commands for:
- Undo/redo functionality
- Move history
- Network play synchronization

## Layer Architecture

### 1. Core Layer (`src/core/`)
Foundation classes with no external dependencies:

```
Board
├── Manages 8x8 grid state
├── Immutable operations
└── Piece placement/movement

Position
├── Represents board coordinates
├── Validation logic
└── Utility methods

Move
├── Encapsulates move data
├── From/to positions
└── Capture information
```

### 2. Pieces Layer (`src/pieces/`)
Piece hierarchy with polymorphic behavior:

```
Piece (abstract)
├── Regular
│   ├── Forward movement only
│   └── Single diagonal moves
└── King
    ├── Omnidirectional movement
    └── Multi-square jumps
```

### 3. Rules Layer (`src/rules/`)
Pluggable rule system:

```
RuleEngine (interface)
├── validateMove()
├── getPossibleMoves()
├── isGameOver()
└── getWinner()

StandardRules
├── Implements traditional rules
└── Mandatory captures

CustomRules (abstract)
├── Base for user extensions
└── Override specific behaviors
```

### 4. Strategies Layer (`src/strategies/`)
Algorithmic components:

```
MoveValidator
├── Basic move validation
├── Capture detection
└── King promotion

CaptureValidator
├── Multiple jump logic
├── Mandatory capture rules
└── Capture sequences
```

### 5. Game Controller (`src/core/Game.ts`)
Orchestrates game flow:

```
Game
├── Manages game state
├── Applies moves
├── Notifies observers
├── Validates rules
└── Tracks history
```

## Data Flow

1. **User Input** → UI Layer
2. **Move Request** → Game Controller
3. **Validation** → Rule Engine + Validators
4. **State Update** → Board (immutable)
5. **Notification** → Observers
6. **UI Update** → Render new state

## Extensibility Points

### Custom Rules
Implement `RuleEngine` interface:
```typescript
interface RuleEngine {
  validateMove(board: Board, move: Move): boolean;
  getPossibleMoves(board: Board, position: Position): Move[];
  isGameOver(board: Board): boolean;
  getWinner(board: Board): Player | null;
  getMandatoryMoves(board: Board, player: Player): Move[];
}
```

### Custom Pieces
Extend `Piece` abstract class:
```typescript
abstract class Piece {
  abstract canMove(from: Position, to: Position, board: Board): boolean;
  abstract getPossibleMoves(position: Position, board: Board): Position[];
  abstract copy(): Piece;
}
```

### Custom UI
Implement `GameUI` interface:
```typescript
interface GameUI {
  render(board: Board): void;
  getMove(): Promise<Move>;
  showMessage(message: string): void;
  onGameEnd(winner: Player | null): void;
}
```

## State Management

All state is immutable:
- Board operations return new Board instances
- Moves don't modify existing state
- History is maintained as snapshots

## Error Handling

- Custom exception types for different error scenarios
- Validation at boundaries
- Graceful degradation for invalid moves

## Performance Considerations

- Lazy evaluation of possible moves
- Memoization of expensive calculations
- Efficient board representation (bit boards future option)

## Testing Strategy

- Unit tests for each component
- Integration tests for rule combinations
- Property-based testing for move generation
- Mock implementations for testing
````

## File: docs/EXTENSIBILITY.md
````markdown
# Extensibility Guide

This guide explains how to extend the checkers game with custom rules, pieces, and behaviors.

## Table of Contents

1. [Creating Custom Rules](#creating-custom-rules)
2. [Custom Piece Types](#custom-piece-types)
3. [Custom Validators](#custom-validators)
4. [UI Extensions](#ui-extensions)
5. [Complete Example](#complete-example)

## Creating Custom Rules

The most common extension point is creating custom game rules. Implement the `RuleEngine` interface:

### Basic Structure

```typescript
import { RuleEngine, Board, Move, Position, Player } from 'extensible-checkers';

export class MyCustomRules implements RuleEngine {
  validateMove(board: Board, move: Move): boolean {
    // Your validation logic
    return true;
  }
  
  getPossibleMoves(board: Board, position: Position): Move[] {
    // Generate possible moves
    return [];
  }
  
  isGameOver(board: Board): boolean {
    // Check if game has ended
    return false;
  }
  
  getWinner(board: Board): Player | null {
    // Determine winner
    return null;
  }
  
  getMandatoryMoves(board: Board, player: Player): Move[] {
    // Return forced moves (e.g., captures)
    return [];
  }
  
  shouldPromote(position: Position, piece: Piece): boolean {
    // Check if piece should become king
    return false;
  }
}
```

### Example: International Draughts Rules

```typescript
export class InternationalDraughtsRules extends StandardRules {
  // Kings can move multiple squares
  validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;
    
    if (piece instanceof KingPiece) {
      // Allow flying kings
      return this.validateFlyingKingMove(board, move);
    }
    
    return super.validateMove(board, move);
  }
  
  private validateFlyingKingMove(board: Board, move: Move): boolean {
    // Check if move is diagonal
    if (!BoardUtils.areDiagonal(move.from, move.to)) {
      return false;
    }
    
    // Check path is clear (except for one capture)
    const positions = BoardUtils.getPositionsBetween(move.from, move.to);
    let captureCount = 0;
    
    for (const pos of positions) {
      const piece = board.getPiece(pos);
      if (piece) {
        if (piece.player === board.getPiece(move.from)!.player) {
          return false; // Can't jump own pieces
        }
        captureCount++;
      }
    }
    
    return captureCount <= 1;
  }
}
```

### Example: Must Capture All Rules

```typescript
export class MustCaptureAllRules extends StandardRules {
  getMandatoryMoves(board: Board, player: Player): Move[] {
    const allCaptures = super.getMandatoryMoves(board, player);
    
    if (allCaptures.length === 0) return [];
    
    // Find the sequence that captures the most pieces
    const captureSequences = this.findAllCaptureSequences(board, player);
    const maxCaptures = Math.max(...captureSequences.map(seq => seq.length));
    
    // Only return moves that lead to maximum captures
    return captureSequences
      .filter(seq => seq.length === maxCaptures)
      .map(seq => seq[0]); // Return first move of each sequence
  }
  
  private findAllCaptureSequences(board: Board, player: Player): Move[][] {
    // Implementation for finding all possible capture sequences
    // This would use depth-first search to explore all paths
    return [];
  }
}
```

## Custom Piece Types

Create new piece types by extending the `Piece` abstract class:

### Example: Super King

```typescript
export class SuperKingPiece extends KingPiece {
  // Can capture multiple pieces in one move
  getCaptureMoves(position: Position, board: Board): Move[] {
    const moves: Move[] = [];
    
    // Check all four diagonal directions
    for (const direction of [Direction.NW, Direction.NE, Direction.SW, Direction.SE]) {
      const capturesInDirection = this.findCapturesInDirection(
        position, 
        direction, 
        board, 
        []
      );
      moves.push(...capturesInDirection);
    }
    
    return moves;
  }
  
  private findCapturesInDirection(
    pos: Position, 
    dir: Direction, 
    board: Board, 
    captured: Position[]
  ): Move[] {
    // Recursive implementation to find multi-captures
    return [];
  }
}
```

### Example: Bomb Piece

```typescript
export class BombPiece extends Piece {
  // Captures all adjacent pieces when capturing
  canMove(from: Position, to: Position, board: Board): boolean {
    // Bombs can only move one square
    const distance = Math.abs(to.row - from.row);
    return distance === 1 && BoardUtils.areDiagonal(from, to);
  }
  
  getCaptureMoves(position: Position, board: Board): Move[] {
    const standardCaptures = super.getCaptureMoves(position, board);
    
    // Add adjacent pieces to captures
    return standardCaptures.map(move => {
      const additionalCaptures = this.getAdjacentEnemies(move.to, board);
      return new Move(move.from, move.to, [...move.captures, ...additionalCaptures]);
    });
  }
  
  private getAdjacentEnemies(position: Position, board: Board): Position[] {
    // Find all adjacent enemy pieces
    return [];
  }
}
```

## Custom Validators

Create specialized validation strategies:

### Example: Time-Limited Moves

```typescript
export class TimeLimitValidator implements MoveValidator {
  private moveStartTimes: Map<string, number> = new Map();
  private timeLimit: number; // milliseconds
  
  constructor(timeLimitSeconds: number) {
    this.timeLimit = timeLimitSeconds * 1000;
  }
  
  validateMove(board: Board, move: Move, player: Player): boolean {
    const key = `${player}`;
    const startTime = this.moveStartTimes.get(key);
    
    if (!startTime) {
      this.moveStartTimes.set(key, Date.now());
      return true;
    }
    
    const elapsed = Date.now() - startTime;
    if (elapsed > this.timeLimit) {
      throw new Error(`Time limit exceeded: ${elapsed}ms`);
    }
    
    this.moveStartTimes.set(key, Date.now());
    return true;
  }
}
```

### Example: Tournament Rules Validator

```typescript
export class TournamentValidator implements MoveValidator {
  private moveHistory: Move[] = [];
  private repetitionLimit = 3;
  
  validateMove(board: Board, move: Move, player: Player): boolean {
    // Check for threefold repetition
    if (this.isThreefoldRepetition(board, move)) {
      throw new Error('Threefold repetition - draw');
    }
    
    // Check 50-move rule (no captures)
    if (this.isFiftyMoveRule()) {
      throw new Error('50 moves without capture - draw');
    }
    
    this.moveHistory.push(move);
    return true;
  }
  
  private isThreefoldRepetition(board: Board, move: Move): boolean {
    // Check if position has occurred 3 times
    return false;
  }
  
  private isFiftyMoveRule(): boolean {
    // Check last 50 moves for captures
    return false;
  }
}
```

## UI Extensions

Create custom UI implementations:

### Example: Web UI with Animations

```typescript
export class AnimatedWebUI implements GameUI {
  private canvas: HTMLCanvasElement;
  private animationQueue: Animation[] = [];
  
  render(board: Board): void {
    // Render board with animations
    this.animateBoard(board);
  }
  
  async getMove(): Promise<Move> {
    return new Promise((resolve) => {
      this.canvas.addEventListener('click', (event) => {
        const position = this.getPositionFromClick(event);
        // Handle click and resolve with move
      });
    });
  }
  
  highlightMoves(moves: Move[]): void {
    moves.forEach(move => {
      this.animationQueue.push(new HighlightAnimation(move.to));
    });
  }
  
  private animateBoard(board: Board): void {
    // Animation loop
    requestAnimationFrame(() => {
      this.clearCanvas();
      this.drawBoard();
      this.drawPieces(board);
      this.processAnimations();
      
      if (this.animationQueue.length > 0) {
        this.animateBoard(board);
      }
    });
  }
}
```

## Complete Example

Here's a complete example implementing "Crazy Checkers" with multiple rule variations:

```typescript
// CrazyCheckersRules.ts
import { 
  RuleEngine, 
  Board, 
  Move, 
  Position, 
  Player,
  StandardRules,
  Piece,
  KingPiece 
} from 'extensible-checkers';

export interface CrazyCheckersOptions {
  allowBackwardMoves: boolean;
  flyingKings: boolean;
  mustCaptureAll: boolean;
  bombPieces: boolean;
  teleportation: boolean;
}

export class CrazyCheckersRules extends StandardRules {
  constructor(private options: CrazyCheckersOptions) {
    super();
  }
  
  validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;
    
    // Teleportation rule
    if (this.options.teleportation && this.isTeleportMove(move)) {
      return board.isEmpty(move.to);
    }
    
    // Backward moves for regular pieces
    if (this.options.allowBackwardMoves) {
      return this.validateWithBackwardMoves(board, move);
    }
    
    // Flying kings
    if (this.options.flyingKings && piece instanceof KingPiece) {
      return this.validateFlyingKing(board, move);
    }
    
    return super.validateMove(board, move);
  }
  
  getPossibleMoves(board: Board, position: Position): Move[] {
    let moves = super.getPossibleMoves(board, position);
    
    if (this.options.teleportation) {
      moves.push(...this.getTeleportMoves(board, position));
    }
    
    if (this.options.allowBackwardMoves) {
      moves.push(...this.getBackwardMoves(board, position));
    }
    
    return moves;
  }
  
  getMandatoryMoves(board: Board, player: Player): Move[] {
    if (!this.options.mustCaptureAll) {
      return super.getMandatoryMoves(board, player);
    }
    
    // Must capture maximum possible pieces
    return this.getMaximalCaptures(board, player);
  }
  
  private isTeleportMove(move: Move): boolean {
    // Teleport if moving to opposite edge
    return move.from.row === 0 && move.to.row === 7 ||
           move.from.row === 7 && move.to.row === 0;
  }
  
  private getTeleportMoves(board: Board, position: Position): Move[] {
    // Generate teleport moves to opposite edge
    const moves: Move[] = [];
    const targetRow = position.row === 0 ? 7 : 0;
    
    for (let col = 0; col < 8; col++) {
      const target = new Position(targetRow, col);
      if (board.isEmpty(target)) {
        moves.push(new Move(position, target));
      }
    }
    
    return moves;
  }
  
  // Additional implementation methods...
}

// Usage
const crazyRules = new CrazyCheckersRules({
  allowBackwardMoves: true,
  flyingKings: true,
  mustCaptureAll: true,
  bombPieces: false,
  teleportation: true
});

const game = new Game(crazyRules);
```

## Best Practices

1. **Extend, Don't Modify**: Always extend existing classes rather than modifying them
2. **Interface Compliance**: Ensure your implementations fully satisfy the interfaces
3. **Immutability**: Never modify board state directly; always return new instances
4. **Validation**: Validate inputs at boundaries
5. **Testing**: Write comprehensive tests for custom rules
6. **Documentation**: Document rule variations clearly
7. **Performance**: Consider performance implications of complex rules

## Testing Custom Rules

```typescript
describe('CrazyCheckersRules', () => {
  let rules: CrazyCheckersRules;
  let board: Board;
  
  beforeEach(() => {
    rules = new CrazyCheckersRules({
      allowBackwardMoves: true,
      flyingKings: true,
      mustCaptureAll: false,
      bombPieces: false,
      teleportation: true
    });
    board = BoardUtils.createStandardBoard();
  });
  
  test('should allow backward moves', () => {
    const piece = new RegularPiece(Player.RED);
    board = board.setPiece(new Position(4, 3), piece);
    
    const backwardMove = new Move(
      new Position(4, 3),
      new Position(5, 4)
    );
    
    expect(rules.validateMove(board, backwardMove)).toBe(true);
  });
  
  test('should allow teleportation', () => {
    const piece = new RegularPiece(Player.RED);
    board = board.setPiece(new Position(0, 1), piece);
    
    const teleportMove = new Move(
      new Position(0, 1),
      new Position(7, 5)
    );
    
    expect(rules.validateMove(board, teleportMove)).toBe(true);
  });
});
```
````

## File: docs/RULE_VALIDATION_ANALYSIS.md
````markdown
# Rule Validation Analysis

This document summarizes findings from a forensic analysis of the move validation
logic in the checkers game. It outlines the root cause of illegal move detection,
models the faulty logic, proposes an updated design, and references modern rule
sources as of 2025.

## 🔍 Root-cause Analysis

- `StandardRules.validateMove` delegates to `Piece.canMove` for move legality.
- `RegularPiece.canMove` only accepts steps of one or two squares, rejecting
  multi-jumps.
- Capture generation flattens multi-step jumps into a single `Move` from the
  start square to the final landing square.
- Validators expect diagonal movement from start to end. Multi-jumps violate this
  expectation, so they are incorrectly marked illegal.

## 🧠 Cognitive Model of Faulty Logic

1. Capture sequences are converted to single `Move` objects.
2. `validateMove` checks `piece.canMove`; any move longer than a double-step is
   rejected.
3. Additional validators check that the entire move remains on a single
   diagonal, which fails for multi-jump paths.
4. The rule engine therefore rejects valid capture sequences even though they
   were generated as mandatory.

## ✅ Rule-aligned Validation Redesign

- Represent multi-jump moves as ordered lists of discrete steps.
- Validate each step in sequence, updating a temporary board state to ensure
  captures are legal and landing squares are empty.
- Separate high-level rule enforcement (mandatory capture, promotion) from
  step-by-step movement validation.
- Use a state-machine approach that processes each sub-move and maintains clear
  state transitions.

## 🛠️ Example: Improved TypeScript Snippet

```typescript
export interface MoveStep {
  from: Position;
  to: Position;
  captured?: Position;
}

export class MultiStepMove {
  constructor(public readonly steps: MoveStep[]) {}

  isCapture(): boolean {
    return this.steps.some(s => s.captured);
  }
}

export function validateMultiStepMove(
  board: Board,
  move: MultiStepMove,
  player: Player
): void {
  let temp = board;
  for (const step of move.steps) {
    const piece = temp.getPiece(step.from);
    if (!piece || piece.player !== player) {
      throw new InvalidMoveError(step, 'Wrong piece');
    }
    if (!step.from.isOnSameDiagonalAs(step.to)) {
      throw new InvalidMoveError(step, 'Non-diagonal step');
    }
    if (!temp.isEmpty(step.to)) {
      throw new InvalidMoveError(step, 'Destination occupied');
    }
    if (step.captured) {
      const capturedPiece = temp.getPiece(step.captured);
      if (!capturedPiece || capturedPiece.player === player) {
        throw new InvalidMoveError(step, 'Invalid capture');
      }
      temp = temp.removePiece(step.captured);
    }
    temp = temp.movePiece(step.from, step.to);
  }
}
```

## 📚 References (2025)

- **World Checkers/Draughts Federation** guidelines emphasize validating each
  jump individually to avoid illegal path rejection.
- **Computer Draughts Standards 2025** recommend state machines or rule trees
  for digital implementations, where each capture step updates the board state.
- Open-source engines published in 2025 demonstrate step-based move
  representations for both American checkers and international draughts.
````

## File: examples/README.md
````markdown
# Custom Rules Examples

This directory contains example implementations of custom game rules that demonstrate the extensibility of the checkers game engine.

## Available Examples

### 1. International Draughts (`InternationalDraughts.ts`)

Implements the rules for International Draughts (also known as Polish Draughts):

- **Board Size**: 10×10 instead of 8×8
- **Flying Kings**: Kings can move multiple squares in a diagonal direction
- **Maximum Capture**: Must capture the maximum number of pieces possible
- **Initial Setup**: 4 rows of pieces for each player

```typescript
import { InternationalDraughtsRules } from './examples/InternationalDraughts';
import { Game } from './src/core/Game';

const game = new Game({
  ruleEngine: new InternationalDraughtsRules()
});
```

### 2. Crazy Checkers (`CrazyCheckers.ts`)

A variant with multiple configurable rule modifications:

- **Backward Moves**: Regular pieces can move backward
- **Teleportation**: Kings can teleport to corner areas
- **Super Jumps**: Jump over multiple pieces in one move
- **Double Jump Reward**: Extra promotions for multi-captures

```typescript
import { CrazyCheckersRules } from './examples/CrazyCheckers';

const crazyRules = new CrazyCheckersRules({
  allowBackwardMoves: true,
  enableTeleportation: true,
  enableSuperJumps: true,
  doubleJumpReward: true
});

const game = new Game({ ruleEngine: crazyRules });
```

### 3. Timed Checkers (`TimedCheckers.ts`)

Adds time-based mechanics to the game:

- **Move Timers**: Each player has limited time per move
- **Time Pressure**: Different moves available under time pressure
- **Piece Aging**: Pieces gain abilities after multiple moves
- **Blitz Mode**: Faster promotions and time bonuses

```typescript
import { TimedCheckersRules } from './examples/TimedCheckers';

const timedRules = new TimedCheckersRules({
  timePerMove: 30000,      // 30 seconds per move
  totalGameTime: 600000,   // 10 minutes total
  blitzMode: true,
  agingEnabled: true,
  timeBonus: true
});

const game = new Game({ ruleEngine: timedRules });

// Start timing for current player
timedRules.startMoveTimer(game.getCurrentPlayer());
```

## Creating Your Own Rules

All example rules extend `CustomRulesBase`, which provides a convenient foundation:

```typescript
import { CustomRulesBase } from '../src/rules/CustomRulesBase';

export class MyCustomRules extends CustomRulesBase {
  // Override specific methods to customize behavior
  
  validateMove(board: Board, move: Move): boolean {
    // Custom validation logic
    return super.validateMove(board, move);
  }
  
  getPossibleMoves(board: Board, position: Position): Move[] {
    // Custom move generation
    const standardMoves = super.getPossibleMoves(board, position);
    const customMoves = this.getMyCustomMoves(board, position);
    return [...standardMoves, ...customMoves];
  }
  
  shouldPromote(position: Position, piece: Piece): boolean {
    // Custom promotion rules
    return super.shouldPromote(position, piece) || this.myCustomPromotionRule(position, piece);
  }
}
```

## Key Methods to Override

- **`validateMove()`**: Add custom validation rules
- **`getPossibleMoves()`**: Modify available moves for pieces
- **`getMandatoryMoves()`**: Change forced capture rules
- **`shouldPromote()`**: Customize piece promotion conditions
- **`getInitialBoard()`**: Set up different starting positions
- **`isGameOver()`** / **`getWinner()`**: Modify win conditions

## Testing Your Rules

Use the console UI to test your custom rules:

```typescript
import { ConsoleUI } from '../src/ui/ConsoleUI';

async function testCustomRules() {
  const ui = new ConsoleUI();
  const game = new Game({
    ruleEngine: new MyCustomRules()
  });
  
  game.addObserver(ui);
  await ui.initialize();
  
  // Game loop
  while (!game.isGameOver()) {
    ui.render(game.getBoard());
    const move = await ui.getMove();
    try {
      game.makeMove(move);
    } catch (error) {
      ui.showError(error.message);
    }
  }
}
```

## Best Practices

1. **Start Simple**: Begin with `CustomRulesBase` and override one method at a time
2. **Test Thoroughly**: Use the console UI to verify your rule changes work correctly
3. **Document Changes**: Clearly document what your rules modify
4. **Handle Edge Cases**: Consider unusual board positions and game states
5. **Maintain Immutability**: Always return new objects, never modify existing ones
6. **Use Helper Methods**: `CustomRulesBase` provides useful helper methods like `getAllCaptureMoves()`

## Advanced Features

### Custom Piece Types

Create new piece types for special rules:

```typescript
export class SuperPiece extends Piece {
  // Custom piece with special abilities
}
```

### Custom Validators

Add specialized move validation:

```typescript
import { BaseMoveValidator } from '../src/strategies/MoveValidator';

export class MyCustomValidator extends BaseMoveValidator {
  validateMove(board: Board, move: Move, player: Player): boolean {
    // Custom validation logic
    return true;
  }
}
```

### Integration with Game Events

Use the Observer pattern to react to game events:

```typescript
export class MyGameObserver implements GameObserver {
  onMove(move: Move, board: Board): void {
    // React to moves
  }
  
  onGameEnd(winner: Player | null): void {
    // Handle game end
  }
}
```

## Contributing

When creating new example rules:

1. Follow the existing code style and patterns
2. Include comprehensive documentation
3. Add usage examples in this README
4. Consider adding unit tests in the `tests/` directory
5. Test with both console and programmatic interfaces
````

## File: examples/TimedCheckers.ts
````typescript
import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { Piece } from '../src/pieces/Piece';
⋮----
/**
 * Timed Checkers with time-based mechanics.
 * - Each player has a time limit per move
 * - Pieces can "age" and gain special abilities
 * - Time pressure affects available moves
 * - Blitz mode with faster promotions
 */
export class TimedCheckersRules extends CustomRulesBase
⋮----
constructor(
    private config: {
      timePerMove?: number; // milliseconds
      totalGameTime?: number; // milliseconds
      blitzMode?: boolean;
      agingEnabled?: boolean;
      timeBonus?: boolean;
    } = {}
)
⋮----
timePerMove?: number; // milliseconds
totalGameTime?: number; // milliseconds
⋮----
timePerMove: 30000, // 30 seconds default
totalGameTime: 600000, // 10 minutes default
⋮----
// Initialize timers
⋮----
/**
   * Start timing a player's move.
   */
startMoveTimer(player: Player): void
⋮----
/**
   * Enhanced move validation with time constraints.
   */
override validateMove(board: Board, move: Move): boolean
⋮----
// Check time constraints
⋮----
// Standard validation
⋮----
/**
   * Enhanced move generation based on time pressure.
   */
override getPossibleMoves(board: Board, position: Position): Move[]
⋮----
// Under time pressure, prioritize captures and simple moves
⋮----
// Add time bonus moves
⋮----
// Add aged piece special moves
⋮----
/**
   * Enhanced promotion rules for blitz mode.
   */
override shouldPromote(position: Position, piece: Piece): boolean
⋮----
// In blitz mode, promote pieces faster
⋮----
// Promote if piece reached 75% of the way to the end
⋮----
// Promote aged pieces earlier
⋮----
/**
   * Get remaining time for a player.
   */
getRemainingTime(player: Player): number
⋮----
/**
   * Check if player is under time pressure.
   */
isUnderTimePressure(player: Player): boolean
⋮----
return remaining < (this.config.totalGameTime! * 0.1); // Less than 10% time left
⋮----
/**
   * Check if move time is valid.
   */
private isTimeValid(player: Player): boolean
⋮----
/**
   * Record a move with timestamp.
   */
private recordMove(player: Player, move: Move): void
⋮----
// Deduct time from player's total
⋮----
// Record in history
⋮----
/**
   * Update piece age.
   */
private updatePieceAge(pieceId: string): void
⋮----
/**
   * Check if piece is aged (moved 5+ times).
   */
private isAgedPiece(piece: Piece): boolean
⋮----
/**
   * Check if player has time bonus.
   */
private hasTimeBonus(player: Player): boolean
⋮----
return remaining > (this.config.totalGameTime! * 0.5); // More than 50% time left
⋮----
/**
   * Prioritize moves for time pressure.
   */
private prioritizeMovesForTimePressure(moves: Move[]): Move[]
⋮----
// Sort by priority: captures first, then forward moves
⋮----
// Prefer moves toward promotion
⋮----
/**
   * Get time bonus moves (extra mobility when ahead on time).
   */
private getTimeBonusMoves(board: Board, position: Position): Move[]
⋮----
// Time bonus: can move 2 squares in any direction (if path is clear)
⋮----
/**
   * Get special moves for aged pieces.
   */
private getAgedPieceMoves(board: Board, position: Position): Move[]
⋮----
// Aged pieces can move like kings (even if they're regular pieces)
⋮----
// Check up to 3 squares in this direction
⋮----
/**
   * Helper to get position in a direction.
   */
private getPositionInDirection(
    pos: Position, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
): Position | null
⋮----
/**
   * Get move statistics.
   */
getMoveStats():
````

## File: playwright/config/playwright-local.config.ts
````typescript
import { defineConfig, devices } from '@playwright/test';
````

## File: playwright/config/playwright.config.ts
````typescript
import { defineConfig, devices } from '@playwright/test';
````

## File: playwright/support/gamePage.ts
````typescript
import { type Locator, type Page, expect } from '@playwright/test';
⋮----
export class GamePage
⋮----
// Main game container
⋮----
// Game configuration
⋮----
// Game status and controls
⋮----
// Game board
⋮----
constructor(page: Page)
⋮----
// Main elements
⋮----
// Configuration
⋮----
// Status and controls
⋮----
// Game board
⋮----
// --- Navigation Actions ---
⋮----
async goto(): Promise<void>
⋮----
// Wait for the React app to load and render
⋮----
// --- Configuration Actions ---
⋮----
async openSettings(): Promise<void>
⋮----
async closeSettings(): Promise<void>
⋮----
async selectBoardSize(size: '8' | '10'): Promise<void>
⋮----
async toggleMoveHints(): Promise<void>
⋮----
async resetConfiguration(): Promise<void>
⋮----
async confirmConfigurationChange(): Promise<void>
⋮----
async cancelConfigurationChange(): Promise<void>
⋮----
// --- Game Control Actions ---
⋮----
async startNewGame(): Promise<void>
⋮----
async undoMove(): Promise<void>
⋮----
async redoMove(): Promise<void>
⋮----
// --- Board Interaction ---
⋮----
getSquare(row: number, col: number): Locator
⋮----
getPieceOnSquare(row: number, col: number): Locator
⋮----
async clickSquare(row: number, col: number): Promise<void>
⋮----
async movePiece(from:
⋮----
// Try drag and drop first
⋮----
// Fallback to click-based movement
⋮----
// --- Assertions ---
⋮----
async expectPageTitle(title: string): Promise<void>
⋮----
async expectGameToBeStarted(): Promise<void>
⋮----
async expectCurrentPlayer(player: 'Red' | 'Black'): Promise<void>
⋮----
async expectGameOver(winner?: 'Red' | 'Black'): Promise<void>
⋮----
async expectPieceToBe(position:
⋮----
async expectSquareToBeEmpty(position:
⋮----
async expectSquareToBeSelected(position:
⋮----
async expectSquareToShowValidMove(position:
⋮----
async expectErrorMessage(message: string): Promise<void>
⋮----
async expectNoErrorMessage(): Promise<void>
⋮----
async expectUndoButtonEnabled(): Promise<void>
⋮----
async expectUndoButtonDisabled(): Promise<void>
⋮----
async expectRedoButtonEnabled(): Promise<void>
⋮----
async expectRedoButtonDisabled(): Promise<void>
⋮----
async expectBoardSize(size: 8 | 10): Promise<void>
⋮----
// --- Utility Methods ---
⋮----
async waitForAnimations(): Promise<void>
⋮----
// Wait for any CSS animations to complete
⋮----
async getScreenshot(name: string): Promise<Buffer>
````

## File: playwright/support/testData.ts
````typescript
// Initial positions for red pieces on 8x8 board
⋮----
// Initial positions for red pieces on 10x10 board
⋮----
// Initial positions for black pieces on 8x8 board
⋮----
// Initial positions for black pieces on 10x10 board
⋮----
// Standard opening moves for 8x8 board
````

## File: playwright/tests/accessibility.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { GamePage } from '../support/gamePage';
⋮----
// Check for proper heading hierarchy
⋮----
// Check for main landmark
⋮----
// Settings button should have accessible name
⋮----
// Game control buttons should have accessible text
⋮----
// Use axe-core to check color contrast
⋮----
// Tab through all interactive elements
⋮----
// Settings button should be focusable
⋮----
// New Game button should be focusable
⋮----
// Undo button should be focusable
⋮----
// Redo button should be focusable
⋮----
// Check if game squares can be reached via keyboard
// This might require implementing keyboard navigation for the game board
⋮----
// For now, verify that the board container is in the tab order
⋮----
const maxTabs = 20; // Prevent infinite loop
⋮----
// Check if we've reached a game square or the board
⋮----
// Check if we've reached the board container
⋮----
// At minimum, verify we can tab through the interface
⋮----
// Open settings via keyboard
⋮----
// Tab through settings options
⋮----
// Check that radio buttons are accessible
⋮----
// Use arrow keys to navigate radio button groups
⋮----
// Close settings with keyboard
⋮----
// Test Escape key to close modals
⋮----
// Note: This test assumes Escape closes the modal, which may need to be implemented
⋮----
// Test Enter key for button activation
⋮----
// Verify game reset (new game started)
⋮----
// Check for live regions that announce game state changes
⋮----
// Verify the text is accessible to screen readers
⋮----
// Check if the board has proper labeling for screen readers
⋮----
// Board should have a role or be properly labeled
⋮----
// At least one of these should be present for screen reader users
⋮----
// Check that game pieces have accessible information
⋮----
// Piece should have accessible text or attributes
⋮----
// Piece should convey its color and type to screen readers
⋮----
// Try to make an invalid move and check if error is accessible
await gamePage.clickSquare(2, 1); // Select piece
await gamePage.clickSquare(1, 1); // Try invalid move
⋮----
// If an error message appears, it should be accessible
⋮----
// Error should have appropriate ARIA attributes
⋮----
// Check radio button groups have proper labeling
⋮----
// Radio should be part of a labeled group
⋮----
// Find associated label
⋮----
// Check if radio is inside a label
⋮----
// Checkbox should have proper labeling
⋮----
// Modal should have proper role
⋮----
// Modal should be properly identified
⋮----
// Modal should have accessible name
⋮----
// Focus settings button
⋮----
// Open settings
⋮----
// Focus should move into the modal
// Check if close button or first interactive element is focused
await gamePage.page.waitForTimeout(100); // Brief wait for focus management
⋮----
// Focus should be within the settings panel
⋮----
// Close settings
⋮----
// Focus should return to settings button
⋮----
// Confirmation dialog should appear
⋮----
// Tab should cycle within the dialog
⋮----
// Should be within the confirmation dialog
⋮----
// Continue tabbing should stay within dialog
⋮----
// Run accessibility scan on mobile layout
⋮----
// Check button sizes meet accessibility guidelines (44px minimum)
⋮----
// Switch to dark theme
⋮----
// Run accessibility scan on dark theme
⋮----
// Check color contrast for this theme
````

## File: playwright/tests/config.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
⋮----
// Open settings
⋮----
// Select 10x10 board size
⋮----
// Should show confirmation dialog for board size change
⋮----
// Verify 10x10 board is rendered
⋮----
// Verify piece count and setup are correct for 10x10
// In 10x10 International Draughts, each player starts with 20 pieces
⋮----
// Verify initial positions for 10x10 board (spot check)
⋮----
// Start with default 8x8 game
⋮----
// Open settings
⋮----
// Select 10x10 board size
⋮----
// Should show confirmation dialog
⋮----
// Cancel the change
⋮----
// Should still be 8x8
⋮----
// Try again and confirm
⋮----
// Now should be 10x10
⋮----
// Start with 10x10
⋮----
// Switch back to 8x8
⋮----
// Verify 8x8 board and piece count
⋮----
// Open settings and enable move hints
⋮----
await gamePage.toggleMoveHints(); // Enable if not already enabled
⋮----
// Click on a piece to select it
⋮----
// Valid move squares should be highlighted
⋮----
// First enable move hints
⋮----
await expect(gamePage.showMoveHintsCheckbox).toBeChecked(); // Should be enabled by default
⋮----
// Disable move hints
⋮----
// Click on a piece to select it
⋮----
// Valid move squares should NOT be highlighted
⋮----
// Disable move hints
⋮----
await gamePage.toggleMoveHints(); // Disable
⋮----
// Start a new game
⋮----
// Check that move hints are still disabled
⋮----
// Verify in settings that it's still disabled
⋮----
// Change multiple settings
⋮----
// Change board size to 10x10
⋮----
// Disable move hints
⋮----
await gamePage.toggleMoveHints(); // Disable
⋮----
// Verify changes took effect
⋮----
// Reset to defaults
⋮----
// Should show confirmation for board size change back to 8x8
⋮----
// Verify defaults are restored
⋮----
// Check that move hints are enabled again
⋮----
// Verify in settings
⋮----
// Open settings
⋮----
// Check that theme options are available
⋮----
// Select dark theme
⋮----
// Verify theme class is applied to app container
⋮----
// Select modern theme
⋮----
// Verify theme changed
⋮----
// Check that animation speed options exist
⋮----
// Test that we can select different speeds
⋮----
// Verify 8x8 board is selected for standard rules
⋮----
// Select International Draughts
⋮----
// Should automatically select 10x10 board and show confirmation
⋮----
// Verify 10x10 board is now selected
⋮----
// Check settings show correct selections
⋮----
// Should show confirmation for rule change
⋮----
// Verify rule set is selected
⋮----
// Change settings
⋮----
await gamePage.toggleMoveHints(); // Disable
⋮----
// Reload the page
⋮----
// Verify settings persisted
````

## File: playwright/tests/gameplay.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
⋮----
await gamePage.startNewGame(); // Ensure fresh game state
⋮----
// Verify it's Red's turn
⋮----
// Click on a red piece
⋮----
// Make a valid move
⋮----
// Verify the move was made
⋮----
// Verify turn switched to Black
⋮----
// Verify move count increased
⋮----
// Red makes first move
⋮----
// Black makes response move
⋮----
// Verify Black's move
⋮----
// Verify turn switched back to Red
⋮----
// It's Red's turn, try to move a Black piece
await gamePage.clickSquare(2, 1); // Black piece
⋮----
// Should not be selected (Red cannot select Black pieces)
⋮----
// Turn should still be Red's
⋮----
// Red makes a move
⋮----
// Now it's Black's turn, Red should not be able to move
⋮----
// Try to move a Red piece
await gamePage.clickSquare(2, 3); // Red piece
⋮----
// Turn should still be Black's
⋮----
// Select a red piece
⋮----
// Try to move to an invalid square (not diagonal)
await gamePage.clickSquare(2, 2); // Horizontal move - invalid
⋮----
// Piece should still be in original position
⋮----
await gamePage.expectCurrentPlayer('Red'); // Turn shouldn't change
⋮----
// Try to move to an occupied square
await gamePage.clickSquare(1, 0); // Another red piece - invalid
⋮----
// Make a valid diagonal move
⋮----
// Set up a capture scenario
// Move Red piece forward
⋮----
// Move Black piece forward
⋮----
// Move Red piece to position for capture
⋮----
// Black moves to be captured
⋮----
// Red captures Black piece
⋮----
// Verify capture: Red piece moved, Black piece removed
⋮----
await gamePage.expectSquareToBeEmpty({ row: 4, col: 1 }); // Captured piece gone
await gamePage.expectSquareToBeEmpty({ row: 3, col: 2 }); // Original position empty
⋮----
// This is a more complex test that would require specific board setup
// For now, we'll test the basic mechanics
⋮----
// Red makes opening move
⋮----
// Continue setting up for multi-jump (simplified version)
⋮----
// Verify the capture occurred
⋮----
// This test requires getting a piece to the opposite end
// We'll simulate this by making multiple moves
⋮----
// Start with some moves to advance a piece
⋮----
// Continue advancing the Red piece (this would take many moves in a real game)
// For testing purposes, we'll verify the piece movement mechanics work
⋮----
// Verify the piece moved (capture occurred)
⋮----
// This test would require creating a king piece first
// For now, we'll verify basic piece movement in both directions
⋮----
// Move a piece forward
⋮----
// Black piece moves
⋮----
// Red piece can move diagonally in available directions
⋮----
// Verify movement worked
⋮----
// Make some moves
⋮----
// Verify game state changed
⋮----
// Reset the game
⋮----
// Verify reset to initial state
⋮----
// Verify pieces are back in starting positions
⋮----
// Initially undo should be disabled
⋮----
// Make a move
⋮----
// Now undo should be enabled
⋮----
// Undo the move
⋮----
// Verify the move was undone
⋮----
// Initially redo should be disabled
⋮----
// Make a move
⋮----
// Undo the move
⋮----
// Now redo should be enabled
⋮----
// Redo the move
⋮----
// Verify the move was re-applied
⋮----
// Make several moves
⋮----
// Should be on move 4, Black's turn
⋮----
// Undo twice
⋮----
// Should be back to move 2, Black's turn
⋮----
// Verify board state
````

## File: playwright/tests/responsiveness.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
import { VIEWPORT_SIZES } from '../support/testData';
⋮----
// Verify all main elements are visible and properly positioned
⋮----
// Verify the board is properly sized
⋮----
// Verify game controls are horizontally arranged
⋮----
// Verify settings panel is visible and well-positioned
⋮----
// Settings panel should not overflow the viewport
⋮----
// Verify all elements are still visible
⋮----
// Board should scale appropriately
⋮----
// Elements should not overlap
⋮----
// Status should be above controls (no vertical overlap)
⋮----
// Test piece selection with touch
⋮----
// Test piece movement
⋮----
// Verify the move worked
⋮----
// Settings should still be accessible and usable
⋮----
// All configuration options should be visible
⋮----
// Test interaction
⋮----
// All essential elements should be visible
⋮----
// Board should be appropriately sized for mobile
⋮----
// Check that elements stack vertically and don't overflow
⋮----
// Test piece selection on mobile
⋮----
// Test piece movement (may use click-to-move instead of drag)
⋮----
// Verify the move worked
⋮----
// Settings button should be easily tappable
⋮----
expect(settingsBox!.width).toBeGreaterThanOrEqual(44); // Minimum touch target size
⋮----
// Open settings
⋮----
// Settings panel should fill most of the mobile screen
⋮----
expect(configBox!.width).toBeGreaterThan(viewport.width * 0.8); // At least 80% of screen width
⋮----
// Check that all buttons meet minimum touch target sizes
⋮----
expect(buttonBox!.width).toBeGreaterThanOrEqual(44); // iOS HIG minimum
⋮----
// Check that game squares are large enough for touch interaction
⋮----
expect(squareBox!.width).toBeGreaterThanOrEqual(30); // Reasonable minimum for game pieces
⋮----
// Test actual interaction
⋮----
// Set mobile landscape viewport
⋮----
// Verify layout adapts to landscape
⋮----
// Board should still be usable
⋮----
expect(boardBox!.height).toBeLessThanOrEqual(375); // Fit within viewport height
⋮----
// Test interaction still works
⋮----
// Open settings and change theme
⋮----
// Verify theme is applied consistently
⋮----
// Take a screenshot for visual verification
⋮----
// Test basic game functionality
⋮----
// Test undo
````

## File: playwright/tests/smoke.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
⋮----
// Verify page title
⋮----
// Verify main elements are visible
⋮----
// Verify the page loads with a game in progress (default behavior)
⋮----
// Click new game button to ensure we have a fresh game
⋮----
// Verify the game board is displayed with standard 8x8 setup
⋮----
// Verify initial game state
⋮----
// Verify no error messages
⋮----
// Verify initial piece positions (spot check a few pieces)
⋮----
// Verify some squares are empty
⋮----
// Initially config should not be visible
⋮----
// Click settings button
⋮----
// Verify configuration panel is visible with all expected elements
⋮----
// Open settings
⋮----
// Close settings using close button
⋮----
// Open again and close using done button
⋮----
// Start a fresh game
⋮----
// Initially undo/redo should be disabled
⋮----
// New game button should always be enabled
⋮----
// Verify game controls container is visible
⋮----
// Wait a moment for any async operations to complete
⋮----
// Verify no console errors occurred during page load
⋮----
// Try clicking on a red piece (should select it)
⋮----
// The piece should be selected (visual feedback)
⋮----
// Try clicking on an empty square (should deselect or move)
⋮----
// Wait for any animations
⋮----
// Verify the game is still functional
````

## File: playwright/tests/visual.spec.ts
````typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
⋮----
// Take a screenshot of the initial page load
⋮----
// Wait for settings panel to be fully rendered
⋮----
// Take screenshot of settings panel
⋮----
// Ensure we have a fresh 8x8 game
⋮----
// Take screenshot of the complete game interface
⋮----
// Take screenshot of just the board
⋮----
// Switch to 10x10 board
⋮----
// Take screenshot of 10x10 board
⋮----
// Select a red piece (Red pieces start at rows 5-7)
⋮----
// Take screenshot showing selected piece and valid move highlights
⋮----
// Test without move hints
⋮----
await gamePage.toggleMoveHints(); // Disable
⋮----
await gamePage.clickSquare(5, 2); // Select different red piece
⋮----
// Make several moves to create a mid-game state
⋮----
// Take screenshot of mid-game state
⋮----
// Test Red's turn display
⋮----
// Make a move to switch to Black's turn
// Red pieces start at rows 5-7 and move upward (decreasing row numbers)
⋮----
// Test move counter display
⋮----
// Try to trigger an error message by making an invalid move
// Note: This depends on how the application handles invalid moves
await gamePage.clickSquare(2, 1); // Select piece
⋮----
// Try to move to an invalid square (this might show an error or simply not work)
await gamePage.clickSquare(1, 1); // Invalid move
⋮----
// If an error message appears, capture it
⋮----
// Take screenshots of classic theme
⋮----
// Take screenshots of modern theme
⋮----
// Take screenshots of dark theme
⋮----
// Test settings panel in dark theme
⋮----
// Focus on specific pieces for detailed visual testing
// Red pieces are at rows 5-7, Black pieces are at rows 0-2
⋮----
// This test assumes we can create a king piece
// For now, we'll test the visual components we can access
⋮----
// Take screenshots that would show king pieces if they exist
// This serves as a baseline for when king promotion is implemented
⋮----
// Test piece selection visual state
// Red pieces are at rows 5-7, and Red plays first
⋮----
// Test valid move highlighting
// From (5,0), Red can move to (4,1)
⋮----
// Slow down animations for visual testing
⋮----
// Start a move
⋮----
// Take screenshot during animation (this might be timing-dependent)
await gamePage.page.waitForTimeout(100); // Brief delay to catch animation
⋮----
// Wait for animation to complete
⋮----
// Take screenshot of mobile layout
⋮----
// Test mobile settings panel
⋮----
// Take screenshot of tablet layout
⋮----
// Confirmation dialog should appear
⋮----
// Test various configurations
⋮----
await gamePage.toggleMoveHints(); // Change move hints setting
⋮----
// Take screenshot of settings with different options selected
⋮----
// This test creates browser-specific baselines
⋮----
// Take comprehensive screenshots for each browser
⋮----
// Test settings panel
⋮----
// Test with piece selected
````

## File: playwright/README.md
````markdown
# Playwright E2E Tests

This directory contains comprehensive end-to-end (E2E) tests for the Extensible Checkers web application using the Playwright framework.

## Overview

The test suite validates the application from a user's perspective, ensuring:
- ✅ Functional correctness across user flows
- ✅ Cross-browser compatibility (Chromium, Firefox, WebKit)
- ✅ Responsive design on desktop, tablet, and mobile
- ✅ Visual regression prevention
- ✅ Accessibility compliance

## Directory Structure

```
playwright/
├── config/
│   └── playwright.config.ts    # Main configuration file
├── tests/
│   ├── smoke.spec.ts           # Critical path tests
│   ├── gameplay.spec.ts        # Core game mechanics
│   ├── config.spec.ts          # Settings and configuration
│   ├── responsiveness.spec.ts  # Multi-device layout tests
│   ├── visual.spec.ts          # Screenshot regression tests
│   └── accessibility.spec.ts   # A11y compliance tests
├── support/
│   ├── gamePage.ts            # Page Object Model
│   └── testData.ts            # Test data and constants
└── README.md                   # This file
```

## Running Tests

### Prerequisites
```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npx playwright install
```

### Available Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run with interactive UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with debugging
npm run test:e2e:debug

# Run specific test suites
npm run test:e2e:smoke           # Just smoke tests
npm run test:e2e:visual          # Visual regression tests
npm run test:e2e:accessibility   # Accessibility tests

# View test report
npm run test:e2e:report
```

## Test Suites

### 1. Smoke Tests (`smoke.spec.ts`)
Critical functionality verification:
- Application loads without errors
- Main UI elements are visible
- Basic game interactions work
- Settings panel opens/closes

### 2. Gameplay Tests (`gameplay.spec.ts`)
Comprehensive game mechanics testing:
- **Initial State & Basic Moves**: Turn-based movement, valid move restrictions
- **Capture Mechanics**: Single and multi-jump captures
- **King Promotion**: Piece advancement and king behavior
- **Game End Conditions**: Win/lose scenarios, game reset
- **Undo/Redo**: Move history management

### 3. Configuration Tests (`config.spec.ts`)
Settings and customization validation:
- **Board Size**: 8x8 vs 10x10 configurations
- **Rule Sets**: Standard, International, Crazy Checkers
- **Visual Options**: Theme selection, animation speed
- **Game Options**: Move hints, configuration persistence

### 4. Responsiveness Tests (`responsiveness.spec.ts`)
Multi-device compatibility:
- **Desktop Layout**: Full-featured interface
- **Tablet Layout**: Adapted touch interactions
- **Mobile Layout**: Optimized for small screens
- **Touch Targets**: Minimum size requirements
- **Orientation**: Portrait and landscape support

### 5. Visual Regression Tests (`visual.spec.ts`)
Screenshot-based change detection:
- Initial game states
- Piece selection and movement
- Theme variations
- Settings panels
- Animation states
- Cross-browser consistency

### 6. Accessibility Tests (`accessibility.spec.ts`)
WCAG compliance verification:
- **Color Contrast**: AA level standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels and live regions
- **Focus Management**: Modal dialogs and focus traps
- **Touch Accessibility**: Mobile interaction support

## Page Object Model

The tests use the Page Object Model (POM) pattern for maintainability:

```typescript
// Example usage
const gamePage = new GamePage(page);
await gamePage.goto();
await gamePage.startNewGame();
await gamePage.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
await gamePage.expectCurrentPlayer('Black');
```

Key methods:
- **Navigation**: `goto()`, `openSettings()`, `closeSettings()`
- **Game Actions**: `startNewGame()`, `movePiece()`, `undoMove()`
- **Assertions**: `expectCurrentPlayer()`, `expectPieceToBe()`, `expectGameOver()`

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Configuration

### Browser Matrix
Tests run across multiple browsers and viewports:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome on Pixel 5, Safari on iPhone 12

### Test Data
Centralized test data in `testData.ts`:
- Initial piece positions
- Common move sequences
- Viewport dimensions
- Animation timeouts

## Debugging Tests

### Visual Debugging
```bash
# Run with browser visible
npm run test:e2e:headed

# Interactive debugging
npm run test:e2e:debug

# UI mode for test development
npm run test:e2e:ui
```

### Screenshot Comparison
Visual tests automatically generate screenshots on first run. Update baselines:
```bash
# Update all visual baselines
npx playwright test visual --update-snapshots

# Update specific test screenshots
npx playwright test "theme appearance" --update-snapshots
```

## Best Practices

### Test Isolation
- Each test starts with a fresh page load
- No dependencies between tests
- Clean state management

### Reliable Selectors
- Uses `data-testid` attributes for stable element selection
- Avoids CSS class-based selectors that may change
- Semantic locators when appropriate

### Async Handling
- Proper `await` usage for all async operations
- Animation timing considerations
- Network request handling

### Cross-Browser Compatibility
- Tests designed to work across all supported browsers
- Browser-specific workarounds when necessary
- Consistent assertions across platforms

## Maintenance

### Adding New Tests
1. Identify the test category (smoke, gameplay, etc.)
2. Add to appropriate spec file
3. Use existing Page Object methods when possible
4. Follow established naming conventions

### Updating Selectors
1. Update `data-testid` attributes in components
2. Update corresponding Page Object methods
3. Verify all affected tests still pass

### Performance Considerations
- Keep test execution time reasonable
- Use `test.describe.serial()` for dependent tests
- Parallel execution where possible

## Troubleshooting

### Common Issues

**Flaky Tests**: Usually caused by timing issues
- Add appropriate waits for animations
- Use `waitForLoadState()` for page transitions
- Verify element visibility before interaction

**Screenshot Differences**: OS/browser rendering variations
- Use `threshold` option for minor differences
- Platform-specific baselines if necessary
- Consider visual testing alternatives for flaky elements

**Slow Tests**: Network or animation delays
- Configure timeouts appropriately
- Use `--headed` mode to observe behavior
- Profile with `--trace on` for detailed timing

### Getting Help
- Check Playwright documentation: https://playwright.dev
- Review test output and screenshots in `test-results/`
- Use `--debug` mode for step-by-step execution
````

## File: src/commands/Command.ts
````typescript
import { GameState } from '../types';
⋮----
/**
 * Command interface for implementing undo/redo functionality.
 * Follows the Command pattern.
 */
export interface Command {
  /**
   * Executes the command and returns the new game state.
   */
  execute(state: GameState): GameState;

  /**
   * Undoes the command and returns the previous game state.
   */
  undo(state: GameState): GameState;

  /**
   * Gets a description of this command.
   */
  getDescription(): string;

  /**
   * Checks if this command can be executed in the current state.
   */
  canExecute(state: GameState): boolean;

  /**
   * Gets the timestamp when this command was created.
   */
  getTimestamp(): Date;
}
⋮----
/**
   * Executes the command and returns the new game state.
   */
execute(state: GameState): GameState;
⋮----
/**
   * Undoes the command and returns the previous game state.
   */
undo(state: GameState): GameState;
⋮----
/**
   * Gets a description of this command.
   */
getDescription(): string;
⋮----
/**
   * Checks if this command can be executed in the current state.
   */
canExecute(state: GameState): boolean;
⋮----
/**
   * Gets the timestamp when this command was created.
   */
getTimestamp(): Date;
⋮----
/**
 * Abstract base class for commands.
 */
export abstract class BaseCommand implements Command
⋮----
constructor()
⋮----
abstract execute(state: GameState): GameState;
abstract undo(state: GameState): GameState;
abstract getDescription(): string;
⋮----
canExecute(_state: GameState): boolean
⋮----
getTimestamp(): Date
````

## File: src/commands/index.ts
````typescript

````

## File: src/core/GameObserver.ts
````typescript
import { Move } from './Move';
import { Board } from './Board';
import { Player } from '../types';
⋮----
/**
 * Observer interface for game state changes.
 * Implement this to react to game events.
 */
export interface GameObserver {
  /**
   * Called when a move is successfully made.
   */
  onMove(move: Move, board: Board): void;

  /**
   * Called when the game ends.
   */
  onGameEnd(winner: Player | null): void;

  /**
   * Called when the current player changes.
   */
  onTurnChange(player: Player): void;

  /**
   * Called when an invalid move is attempted.
   */
  onInvalidMove(move: Move, reason: string): void;

  /**
   * Called when a piece is promoted.
   */
  onPiecePromoted?(position: Position, newPiece: Piece): void;

  /**
   * Called when pieces are captured.
   */
  onPiecesCaptured?(positions: Position[], pieces: Piece[]): void;

  /**
   * Called when the board state changes.
   */
  onBoardUpdate?(board: Board): void;
}
⋮----
/**
   * Called when a move is successfully made.
   */
onMove(move: Move, board: Board): void;
⋮----
/**
   * Called when the game ends.
   */
onGameEnd(winner: Player | null): void;
⋮----
/**
   * Called when the current player changes.
   */
onTurnChange(player: Player): void;
⋮----
/**
   * Called when an invalid move is attempted.
   */
onInvalidMove(move: Move, reason: string): void;
⋮----
/**
   * Called when a piece is promoted.
   */
onPiecePromoted?(position: Position, newPiece: Piece): void;
⋮----
/**
   * Called when pieces are captured.
   */
onPiecesCaptured?(positions: Position[], pieces: Piece[]): void;
⋮----
/**
   * Called when the board state changes.
   */
onBoardUpdate?(board: Board): void;
⋮----
import type { Position } from './Position';
import type { Piece } from '../pieces/Piece';
````

## File: src/core/index.ts
````typescript

````

## File: src/core/Move.ts
````typescript
import { Position } from './Position';
import { Board } from './Board';
import { MoveStep } from '../types';
⋮----
/**
 * Immutable class representing a game move.
 */
export class Move
⋮----
constructor(
    public readonly from: Position,
    public readonly to: Position,
    public readonly captures: ReadonlyArray<Position> = [],
    public readonly isPromotion: boolean = false,
    steps?: ReadonlyArray<MoveStep>
)
⋮----
// If steps are provided, use them; otherwise create a single step
⋮----
// Create a single step from the simple move
⋮----
// For captures, try to infer the captured position
⋮----
/**
   * Checks if this is a capture move.
   */
isCapture(): boolean
⋮----
/**
   * Checks if this is a multi-capture move.
   */
isMultiCapture(): boolean
⋮----
/**
   * Gets the number of captures in this move.
   */
getCaptureCount(): number
⋮----
/**
   * Checks if this move is diagonal.
   */
isDiagonal(): boolean
⋮----
/**
   * Gets the distance of this move.
   */
getDistance(): number
⋮----
/**
   * Checks if this is a valid distance for a regular move.
   */
isValidDistance(): boolean
⋮----
/**
   * Applies this move to a board (returns new Board).
   */
apply(board: Board): Board
⋮----
// For multi-step moves, apply each step in sequence
⋮----
// Move the piece for this step
⋮----
// Remove captured piece for this step if any
⋮----
// Handle promotion at the final position
⋮----
// For single-step moves, use the original logic
⋮----
// Remove captured pieces
⋮----
// Handle promotion if needed
⋮----
/**
   * Creates a new move with additional captures.
   */
withCaptures(additionalCaptures: Position[]): Move
⋮----
/**
   * Creates a new move marked as promotion.
   */
withPromotion(): Move
⋮----
/**
   * Checks if this move equals another move.
   */
equals(other: Move | null): boolean
⋮----
// Check if captures match (order matters)
⋮----
/**
   * Converts move to string notation (e.g., "a3-b4" or "a3xc5").
   */
toString(): string
⋮----
/**
   * Parses a move from string notation.
   */
static fromString(notation: string): Move
⋮----
// Remove promotion indicator
⋮----
// Check for capture notation
⋮----
// For captures, calculate the captured position
⋮----
/**
   * Creates a capture move between two positions.
   */
static createCapture(from: Position, to: Position, captured: Position): Move
⋮----
/**
   * Creates a multi-capture move.
   */
static createMultiCapture(positions: Position[], captures: Position[]): Move
⋮----
// Create steps for multi-capture move
⋮----
// Find the captured piece for this step
⋮----
/**
   * Creates a multi-step move from explicit steps.
   */
static createMultiStep(steps: MoveStep[]): Move
⋮----
/**
   * Gets a hash representation of this move.
   */
hash(): string
⋮----
/**
   * Gets the direction of this move.
   */
getDirection(): 'NW' | 'NE' | 'SW' | 'SE' | null
⋮----
/**
   * Checks if this move is forward for the given player.
   */
isForward(player: 'RED' | 'BLACK'): boolean
⋮----
/**
   * Gets intermediate positions for multi-jump moves.
   */
getIntermediatePositions(): Position[]
⋮----
// For simple moves, just return positions between from and to
⋮----
// For multi-captures, this would need more complex logic
// based on the capture sequence
````

## File: src/errors/index.ts
````typescript
import { Move } from '../core/Move';
import { Position } from '../core/Position';
⋮----
/**
 * Base error class for all game-related errors.
 */
export class GameError extends Error
⋮----
constructor(message: string)
⋮----
/**
 * Error thrown when an invalid move is attempted.
 */
export class InvalidMoveError extends GameError
⋮----
constructor(
    public readonly move: Move,
    public readonly reason: string
)
⋮----
/**
 * Error thrown when an invalid position is used.
 */
export class InvalidPositionError extends GameError
⋮----
constructor(public readonly position: Position)
⋮----
/**
 * Error thrown when game operations are attempted after game ends.
 */
export class GameOverError extends GameError
⋮----
constructor()
⋮----
/**
 * Error thrown when a rule violation occurs.
 */
export class RuleViolationError extends GameError
⋮----
constructor(public readonly rule: string, message: string)
⋮----
/**
 * Error thrown when an invalid board state is detected.
 */
export class InvalidBoardStateError extends GameError
⋮----
/**
 * Error thrown when piece operations fail.
 */
export class PieceError extends GameError
⋮----
/**
 * Error thrown when UI operations fail.
 */
export class UIError extends GameError
````

## File: src/pieces/index.ts
````typescript

````

## File: src/rules/CustomRulesBase.ts
````typescript
import { RuleEngine } from './RuleEngine';
import { StandardRules } from './StandardRules';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece } from '../pieces/Piece';
⋮----
/**
 * Abstract base class for custom rule implementations.
 * Extend this class to create custom game variations.
 * By default, delegates to StandardRules for all methods.
 */
export abstract class CustomRulesBase implements RuleEngine
⋮----
constructor(boardSize: number = 8)
⋮----
/**
   * Override this to implement custom move validation.
   */
validateMove(board: Board, move: Move): boolean
⋮----
/**
   * Override this to implement custom move generation.
   */
getPossibleMoves(board: Board, position: Position): Move[]
⋮----
/**
   * Override this to implement custom move generation for a player.
   */
getAllPossibleMoves(board: Board, player: Player): Move[]
⋮----
/**
   * Override this to implement custom game end conditions.
   */
isGameOver(board: Board): boolean
⋮----
/**
   * Override this to implement custom winning conditions.
   */
getWinner(board: Board): Player | null
⋮----
/**
   * Override this to implement custom mandatory moves.
   */
getMandatoryMoves(board: Board, player: Player): Move[]
⋮----
/**
   * Override this to implement custom promotion rules.
   */
shouldPromote(position: Position, piece: Piece): boolean
⋮----
/**
   * Override this to implement custom initial board setup.
   */
getInitialBoard(): Board
⋮----
/**
   * Override this to implement custom board validation.
   */
isValidBoardState(board: Board): boolean
⋮----
/**
   * Helper method to get all capture moves for a player.
   */
protected getAllCaptureMoves(board: Board, player: Player): Move[]
⋮----
/**
   * Helper method to get all non-capture moves for a player.
   */
protected getAllRegularMoves(board: Board, player: Player): Move[]
⋮----
/**
   * Helper method to count pieces by type.
   */
protected countPiecesByType(board: Board, player: Player):
````

## File: src/rules/index.ts
````typescript

````

## File: src/rules/RuleEngine.ts
````typescript
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece } from '../pieces/Piece';
⋮----
/**
 * Core interface for game rule implementations.
 * Implement this interface to create custom game variations.
 */
export interface RuleEngine {
  /**
   * Validates if a move is legal according to the rules.
   */
  validateMove(board: Board, move: Move): boolean;

  /**
   * Gets all possible moves from a given position.
   */
  getPossibleMoves(board: Board, position: Position): Move[];

  /**
   * Gets all possible moves for a player.
   */
  getAllPossibleMoves(board: Board, player: Player): Move[];

  /**
   * Checks if the game has ended.
   */
  isGameOver(board: Board): boolean;

  /**
   * Determines the winner of the game.
   * Returns null if game is not over or is a draw.
   */
  getWinner(board: Board): Player | null;

  /**
   * Gets mandatory moves (e.g., forced captures).
   * Empty array means no mandatory moves.
   */
  getMandatoryMoves(board: Board, player: Player): Move[];

  /**
   * Checks if a piece should be promoted (e.g., to king).
   */
  shouldPromote(position: Position, piece: Piece): boolean;

  /**
   * Gets the initial board setup.
   */
  getInitialBoard(): Board;

  /**
   * Validates if a board state is legal.
   */
  isValidBoardState(board: Board): boolean;
}
⋮----
/**
   * Validates if a move is legal according to the rules.
   */
validateMove(board: Board, move: Move): boolean;
⋮----
/**
   * Gets all possible moves from a given position.
   */
getPossibleMoves(board: Board, position: Position): Move[];
⋮----
/**
   * Gets all possible moves for a player.
   */
getAllPossibleMoves(board: Board, player: Player): Move[];
⋮----
/**
   * Checks if the game has ended.
   */
isGameOver(board: Board): boolean;
⋮----
/**
   * Determines the winner of the game.
   * Returns null if game is not over or is a draw.
   */
getWinner(board: Board): Player | null;
⋮----
/**
   * Gets mandatory moves (e.g., forced captures).
   * Empty array means no mandatory moves.
   */
getMandatoryMoves(board: Board, player: Player): Move[];
⋮----
/**
   * Checks if a piece should be promoted (e.g., to king).
   */
shouldPromote(position: Position, piece: Piece): boolean;
⋮----
/**
   * Gets the initial board setup.
   */
getInitialBoard(): Board;
⋮----
/**
   * Validates if a board state is legal.
   */
isValidBoardState(board: Board): boolean;
````

## File: src/strategies/BasicMoveValidator.ts
````typescript
import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
⋮----
/**
 * Validates basic move properties like board boundaries and piece existence.
 */
export class BasicMoveValidator extends BaseMoveValidator
⋮----
constructor()
⋮----
super(0, 'BasicMoveValidator'); // Highest priority
⋮----
validateMove(board: Board, move: Move, player: Player): boolean
⋮----
// For multi-step moves, validate basic properties of each step
⋮----
// Check if there's a piece at the starting position
⋮----
// Check if the piece belongs to the current player
⋮----
// Further validation is handled by the rule engine
⋮----
// Check if move positions are valid
⋮----
// Check if there's a piece at the source position
⋮----
// Check if the piece belongs to the current player
⋮----
// Check if destination is not the same as source
⋮----
// Check if destination is empty
````

## File: src/strategies/CaptureValidator.ts
````typescript
import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
⋮----
/**
 * Validates capture moves according to standard rules.
 */
export class CaptureValidator extends BaseMoveValidator
⋮----
constructor()
⋮----
override shouldValidate(_board: Board, move: Move, _player: Player): boolean
⋮----
override validateMove(board: Board, move: Move, player: Player): boolean
⋮----
// Validate each captured position
⋮----
// Check if capture position is valid
⋮----
// Check if there's a piece to capture
⋮----
// Check if captured piece belongs to opponent
⋮----
// Validate that the move path includes all captures
⋮----
/**
   * Validates that the capture path is correct.
   */
private validateCapturePath(board: Board, move: Move): boolean
⋮----
// For multi-step moves, each step's validation is handled by the rule engine
⋮----
// For regular pieces, validate single jump
⋮----
// For kings or multi-captures, validate the entire path
⋮----
/**
   * Validates a single jump capture.
   */
private validateSingleJump(move: Move): boolean
⋮----
// The captured piece should be exactly in the middle
⋮----
/**
   * Validates a multi-capture path.
   */
private validateMultiCapturePath(_board: Board, move: Move): boolean
⋮----
// For multi-captures, we need to validate the entire sequence
// This is a simplified validation - more complex logic would be needed
// for full multi-jump validation
⋮----
// Each captured position should be on the path
````

## File: src/strategies/DiagonalMoveValidator.ts
````typescript
import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
⋮----
/**
 * Validates that moves are diagonal and within piece constraints.
 */
export class DiagonalMoveValidator extends BaseMoveValidator
⋮----
constructor()
⋮----
override validateMove(board: Board, move: Move, _player: Player): boolean
⋮----
// For multi-step moves, validate each step is diagonal
⋮----
// Multi-step validation is handled by the rule engine
⋮----
// Check if move is diagonal
⋮----
// For regular pieces, check distance constraints
⋮----
// Check direction for regular pieces
⋮----
// Kings can move any distance, but path must be clear (except for captures)
⋮----
/**
   * Checks if the move direction is valid for a regular piece.
   */
private isValidDirectionForRegularPiece(move: Move, player: Player): boolean
⋮----
// Red moves toward row 0 (up the board)
⋮----
// Black moves toward higher row numbers (down the board)
⋮----
/**
   * Validates that the path is clear for a king move.
   */
private isPathValidForKing(board: Board, move: Move): boolean
⋮----
// For captures, only captured pieces should be in the path
⋮----
// Check that all occupied positions are captured
⋮----
// For regular moves, path must be completely clear
````

## File: src/strategies/index.ts
````typescript

````

## File: src/strategies/MandatoryCaptureValidator.ts
````typescript
import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
⋮----
/**
 * Validates that mandatory captures are taken when available.
 */
export class MandatoryCaptureValidator extends BaseMoveValidator
⋮----
constructor()
⋮----
validateMove(board: Board, move: Move, player: Player): boolean
⋮----
// Get all possible capture moves for the player
⋮----
// No captures available, any valid move is allowed
⋮----
// If captures are available, the move must be a capture
⋮----
// Check if this move is among the valid capture moves
⋮----
// Check for maximum capture rule
⋮----
/**
   * Gets all possible capture moves for a player.
   */
private getAllCaptureMoves(board: Board, player: Player): Move[]
⋮----
/**
   * Checks if two moves are equivalent (same from/to, captures can vary in order).
   */
private movesAreEquivalent(move1: Move, move2: Move): boolean
⋮----
// Check if all captures in move1 are present in move2
⋮----
/**
   * Determines if maximum capture rule should be enforced.
   * This could be configurable based on rule engine settings.
   */
private hasMaximumCaptureRule(): boolean
⋮----
return true; // Standard checkers enforces maximum captures
````

## File: src/strategies/MoveValidator.ts
````typescript
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
⋮----
/**
 * Interface for move validation strategies.
 * Implement this to add custom validation logic.
 */
export interface MoveValidator {
  /**
   * Validates a move according to specific criteria.
   * Should throw an error with a descriptive message if invalid.
   */
  validateMove(board: Board, move: Move, player: Player): boolean;

  /**
   * Gets the priority of this validator.
   * Lower numbers run first.
   */
  getPriority(): number;

  /**
   * Gets the name of this validator for debugging.
   */
  getName(): string;

  /**
   * Checks if this validator should be applied to the given move.
   */
  shouldValidate?(board: Board, move: Move, player: Player): boolean;
}
⋮----
/**
   * Validates a move according to specific criteria.
   * Should throw an error with a descriptive message if invalid.
   */
validateMove(board: Board, move: Move, player: Player): boolean;
⋮----
/**
   * Gets the priority of this validator.
   * Lower numbers run first.
   */
getPriority(): number;
⋮----
/**
   * Gets the name of this validator for debugging.
   */
getName(): string;
⋮----
/**
   * Checks if this validator should be applied to the given move.
   */
shouldValidate?(board: Board, move: Move, player: Player): boolean;
⋮----
/**
 * Abstract base class for move validators.
 */
export abstract class BaseMoveValidator implements MoveValidator
⋮----
constructor(
⋮----
abstract validateMove(board: Board, move: Move, player: Player): boolean;
⋮----
getPriority(): number
⋮----
getName(): string
⋮----
shouldValidate(_board: Board, _move: Move, _player: Player): boolean
````

## File: src/strategies/ValidationEngine.ts
````typescript
import { MoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
⋮----
/**
 * Orchestrates multiple move validators to validate moves.
 * Validators are executed in priority order.
 */
export class ValidationEngine
⋮----
/**
   * Adds a validator to the engine.
   */
addValidator(validator: MoveValidator): void
⋮----
/**
   * Removes a validator from the engine.
   */
removeValidator(validatorName: string): void
⋮----
/**
   * Removes all validators.
   */
clearValidators(): void
⋮----
/**
   * Gets all registered validators.
   */
getValidators(): readonly MoveValidator[]
⋮----
/**
   * Validates a move using all registered validators.
   * Returns true if valid, throws InvalidMoveError if not.
   */
validateMove(board: Board, move: Move, player: Player): boolean
⋮----
// Check if this validator should be applied
⋮----
// Run the validation
⋮----
/**
   * Validates a move and returns validation result without throwing.
   */
validateMoveQuiet(board: Board, move: Move, player: Player):
⋮----
/**
   * Gets validation details for a move.
   */
getValidationDetails(board: Board, move: Move, player: Player): ValidationResult[]
⋮----
// Check if validator should be applied
⋮----
/**
   * Creates a default validation engine with standard validators.
   */
static async createDefault(): Promise<ValidationEngine>
⋮----
// Add default validators
⋮----
/**
   * Sorts validators by priority (lower numbers first).
   */
private sortValidators(): void
⋮----
/**
 * Result of a single validator's execution.
 */
export interface ValidationResult {
  validatorName: string;
  priority: number;
  applied: boolean;
  passed: boolean;
  error: string | null;
}
````

## File: src/types/index.ts
````typescript
export enum Player {
  RED = 'RED',
  BLACK = 'BLACK'
}
⋮----
export enum Direction {
  NORTH_WEST = 'NW',
  NORTH_EAST = 'NE',
  SOUTH_WEST = 'SW',
  SOUTH_EAST = 'SE'
}
⋮----
export interface GameState {
  board: Board;
  currentPlayer: Player;
  moveHistory: Move[];
  capturedPieces: Piece[];
  winner: Player | null;
  isGameOver: boolean;
}
⋮----
export interface GameConfig {
  boardSize?: number;
  startingPlayer?: Player;
  ruleEngine: RuleEngine;
  validators?: MoveValidator[];
  ui?: GameUI;
}
⋮----
export interface MoveStep {
  from: Position;
  to: Position;
  captured?: Position;
}
⋮----
import type { Board } from '../core/Board';
import type { Move } from '../core/Move';
import type { Piece } from '../pieces/Piece';
import type { Position } from '../core/Position';
import type { RuleEngine } from '../rules/RuleEngine';
import type { MoveValidator } from '../strategies/MoveValidator';
import type { GameUI } from '../ui/GameUI';
````

## File: src/ui/web/contexts/GameConfigContext.tsx
````typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameConfig, defaultConfig } from '../types/GameConfig';
⋮----
interface GameConfigContextType {
  config: GameConfig;
  updateConfig: (updates: Partial<GameConfig>) => void;
  resetConfig: () => void;
}
⋮----
export function GameConfigProvider(
⋮----
export function useGameConfig(): GameConfigContextType
````

## File: src/ui/web/hooks/useAnimatedGame.ts
````typescript
import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';
⋮----
interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}
⋮----
interface UIState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}
⋮----
interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}
⋮----
interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: () => void;
}
⋮----
interface UseAnimatedGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}
⋮----
export function useAnimatedGame(): UseAnimatedGameReturn
⋮----
// Handle move animations
⋮----
// Add moving piece
⋮----
// Handle captures
⋮----
}, 150); // Delay capture animation
⋮----
// Clear animations after delay
⋮----
// Handle promotion animations
⋮----
// Note: redoMove not yet implemented in Game class
````

## File: src/ui/web/types/GameConfig.ts
````typescript
export interface GameConfig {
  boardSize: 8 | 10;
  ruleSet: 'standard' | 'international' | 'crazy';
  theme: 'classic' | 'modern' | 'dark';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showMoveHints: boolean;
}
````

## File: src/ui/web/index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Extensible Checkers</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
````

## File: src/ui/ConsoleUI.ts
````typescript
import { GameUI } from './GameUI';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { GameObserver } from '../core/GameObserver';
⋮----
/**
 * Console-based UI for the checkers game.
 */
export class ConsoleUI implements GameUI, GameObserver
⋮----
constructor()
⋮----
/**
   * Renders the board to console.
   */
render(board: Board): void
⋮----
/**
   * Gets a move from the user via console input.
   */
async getMove(): Promise<Move>
⋮----
/**
   * Shows a message to the user.
   */
showMessage(message: string): void
⋮----
/**
   * Shows an error message.
   */
showError(error: string): void
⋮----
/**
   * Handles game end.
   */
onGameEnd(winner: Player | null): void
⋮----
/**
   * Highlights possible moves.
   */
highlightMoves(moves: Move[]): void
⋮----
/**
   * Clears all highlights.
   */
clearHighlights(): void
⋮----
/**
   * Updates current player display.
   */
updateCurrentPlayer(player: Player): void
⋮----
/**
   * Shows move history.
   */
showMoveHistory(moves: Move[]): void
⋮----
/**
   * Highlights a specific position.
   */
highlightPosition(position: Position): void
⋮----
/**
   * Initializes the UI.
   */
async initialize(): Promise<void>
⋮----
/**
   * Cleans up the UI.
   */
destroy(): void
⋮----
// GameObserver implementation
onMove(move: Move, board: Board): void
⋮----
onTurnChange(player: Player): void
⋮----
onInvalidMove(move: Move, reason: string): void
⋮----
onPiecePromoted?(position: Position): void
⋮----
onBoardUpdate?(board: Board): void
⋮----
/**
   * Formats the board for console display.
   */
private formatBoard(board: Board): string
⋮----
// Top border with column labels
⋮----
// Board rows
⋮----
// Add color if piece exists
⋮----
// Bottom border with column labels
⋮----
/**
   * Prompts user for move input.
   */
private promptForMove(): void
⋮----
/**
   * Handles user input.
   */
private handleInput(input: string): void
⋮----
/**
   * Handles move command.
   */
private handleMoveCommand(parts: string[]): void
⋮----
/**
   * Handles moves command to show possible moves.
   */
private handleMovesCommand(parts: string[]): void
⋮----
// This would need game reference to show actual moves
⋮----
/**
   * Handles history command.
   */
private handleHistoryCommand(): void
⋮----
/**
   * Handles quit command.
   */
private handleQuitCommand(): void
⋮----
/**
   * Handles help command.
   */
private handleHelpCommand(): void
````

## File: src/ui/GameUI.ts
````typescript
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { Position } from '../core/Position';
⋮----
/**
 * Interface for game UI implementations.
 * Implement this to create different UI types (console, web, mobile).
 */
export interface GameUI {
  /**
   * Renders the current board state.
   */
  render(board: Board): void;

  /**
   * Gets a move from the user.
   * Should return a promise that resolves when user makes a move.
   */
  getMove(): Promise<Move>;

  /**
   * Displays a message to the user.
   */
  showMessage(message: string): void;

  /**
   * Handles game end state.
   */
  onGameEnd(winner: Player | null): void;

  /**
   * Highlights possible moves on the board.
   */
  highlightMoves(moves: Move[]): void;

  /**
   * Clears all highlights from the board.
   */
  clearHighlights(): void;

  /**
   * Shows an error message.
   */
  showError(error: string): void;

  /**
   * Updates the current player display.
   */
  updateCurrentPlayer(player: Player): void;

  /**
   * Highlights a specific position.
   */
  highlightPosition?(position: Position): void;

  /**
   * Shows move history.
   */
  showMoveHistory?(moves: Move[]): void;

  /**
   * Initializes the UI.
   */
  initialize?(): Promise<void>;

  /**
   * Cleans up the UI.
   */
  destroy?(): void;
}
⋮----
/**
   * Renders the current board state.
   */
render(board: Board): void;
⋮----
/**
   * Gets a move from the user.
   * Should return a promise that resolves when user makes a move.
   */
getMove(): Promise<Move>;
⋮----
/**
   * Displays a message to the user.
   */
showMessage(message: string): void;
⋮----
/**
   * Handles game end state.
   */
onGameEnd(winner: Player | null): void;
⋮----
/**
   * Highlights possible moves on the board.
   */
highlightMoves(moves: Move[]): void;
⋮----
/**
   * Clears all highlights from the board.
   */
clearHighlights(): void;
⋮----
/**
   * Shows an error message.
   */
showError(error: string): void;
⋮----
/**
   * Updates the current player display.
   */
updateCurrentPlayer(player: Player): void;
⋮----
/**
   * Highlights a specific position.
   */
highlightPosition?(position: Position): void;
⋮----
/**
   * Shows move history.
   */
showMoveHistory?(moves: Move[]): void;
⋮----
/**
   * Initializes the UI.
   */
initialize?(): Promise<void>;
⋮----
/**
   * Cleans up the UI.
   */
destroy?(): void;
````

## File: src/ui/index.ts
````typescript

````

## File: src/utils/BoardUtils.ts
````typescript
import { Board } from '../core/Board';
import { Position } from '../core/Position';
import { Player } from '../types';
import { RegularPiece } from '../pieces/RegularPiece';
⋮----
/**
 * Utility functions for board operations.
 */
export class BoardUtils
⋮----
/**
   * Creates a standard 8x8 checkers board setup.
   */
static createStandardBoard(size: number = 8): Board
⋮----
// Place red pieces (top of board)
⋮----
// Place black pieces (bottom of board)
⋮----
/**
   * Creates an empty board with only dark squares marked.
   */
static createEmptyBoard(size: number = 8): Board
⋮----
/**
   * Checks if a position is a dark square (playable).
   */
static isDarkSquare(position: Position): boolean
⋮----
/**
   * Gets all positions between two diagonal positions.
   */
static getPositionsBetween(from: Position, to: Position): Position[]
⋮----
/**
   * Checks if two positions are diagonal to each other.
   */
static areDiagonal(from: Position, to: Position): boolean
⋮----
/**
   * Gets all dark squares on the board.
   */
static getAllDarkSquares(size: number = 8): Position[]
⋮----
/**
   * Converts board to simple string representation for debugging.
   */
static boardToString(board: Board): string
⋮----
/**
   * Creates a board from a simple string representation.
   * Format: 'r' = red regular, 'R' = red king, 'b' = black regular, 'B' = black king, '.' = empty
   */
static boardFromString(boardString: string, size: number = 8): Board
⋮----
/**
   * Counts total pieces on the board.
   */
static countPieces(board: Board):
⋮----
/**
   * Gets the center positions of the board.
   */
static getCenterPositions(size: number = 8): Position[]
⋮----
/**
   * Gets corner positions of the board.
   */
static getCornerPositions(size: number = 8): Position[]
⋮----
/**
   * Gets edge positions of the board.
   */
static getEdgePositions(size: number = 8): Position[]
⋮----
edges.push(new Position(0, i)); // Top row
edges.push(new Position(size - 1, i)); // Bottom row
edges.push(new Position(i, 0)); // Left column
edges.push(new Position(i, size - 1)); // Right column
⋮----
// Remove duplicates
````

## File: src/utils/index.ts
````typescript

````

## File: src/utils/PerformanceProfiler.ts
````typescript
/**
 * Performance profiling utility for measuring operation times
 */
export class PerformanceProfiler
⋮----
/**
   * Measures the execution time of a function
   */
static measure<T>(name: string, fn: () => T): T
⋮----
/**
   * Measures the execution time of an async function
   */
static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>
⋮----
/**
   * Gets statistics for a specific measurement
   */
static getStats(name: string):
⋮----
/**
   * Gets all measurement statistics
   */
static getAllStats(): Map<string, ReturnType<typeof PerformanceProfiler.getStats>>
⋮----
/**
   * Logs all performance statistics
   */
static logStats(): void
⋮----
/**
   * Clears all measurements
   */
static clear(): void
⋮----
/**
   * Creates a timer for manual timing
   */
static createTimer(name: string): () => void
````

## File: tests/core/Position.test.ts
````typescript
import { Position } from '../../src/core/Position';
import { InvalidPositionError } from '../../src/errors';
⋮----
// @ts-expect-error Testing immutability
⋮----
expect(diagonals).toContainEqual(new Position(2, 2)); // NW
expect(diagonals).toContainEqual(new Position(2, 4)); // NE
expect(diagonals).toContainEqual(new Position(4, 2)); // SW
expect(diagonals).toContainEqual(new Position(4, 4)); // SE
⋮----
expect(diagonals).toContainEqual(new Position(1, 1)); // NW
expect(diagonals).toContainEqual(new Position(1, 5)); // NE
expect(diagonals).toContainEqual(new Position(5, 1)); // SW
expect(diagonals).toContainEqual(new Position(5, 5)); // SE
⋮----
expect(pos).toEqual(new Position(3, 3)); // Original unchanged
````

## File: tests/integration/RuleConfiguration.test.tsx
````typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
⋮----
import { GameApp } from '../../src/ui/web/GameApp';
⋮----
// Mock localStorage
⋮----
// Open settings
⋮----
// Test switching to Crazy Checkers
⋮----
// Should start new game
⋮----
// Open settings again to test International Draughts
⋮----
// Should create 10x10 board for International Draughts
⋮----
expect(squares).toHaveLength(100); // 10x10 board
⋮----
// Switch back to Standard
⋮----
// Wait for settings to close and game to reset
⋮----
// Should be back to 8x8
⋮----
expect(squares).toHaveLength(64); // 8x8 board
⋮----
// Open settings
⋮----
// Select International Draughts (requires 10x10)
⋮----
// Open settings again
⋮----
// 8x8 option should be disabled for International Draughts
⋮----
// 10x10 should be selected
⋮----
// Open settings and change theme
⋮----
// Change rules
⋮----
// Open settings again
⋮----
// Theme should still be dark
⋮----
// Open settings and change animation speed
⋮----
// Change to different rule set
⋮----
// Open settings again
⋮----
// Animation speed should still be fast
⋮----
// Disable move hints in standard rules
⋮----
// Switch to International Draughts
⋮----
// Wait for settings to close
⋮----
// Select a piece to verify no hints are shown
⋮----
// Find a piece on the 10x10 board (International Draughts starting positions)
⋮----
// Should not show move hints
⋮----
// Open settings and make multiple changes
⋮----
// Change theme
⋮----
// Change animation speed
⋮----
// Change to crazy checkers
⋮----
// Open settings and reset
⋮----
// Should return to defaults
````

## File: tests/integration/WebGameplay.test.tsx
````typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
⋮----
import { GameApp } from '../../src/ui/web/GameApp';
⋮----
// Mock localStorage
⋮----
// Verify initial game state
⋮----
// Get game squares
⋮----
// Make a move
const redPieceSquare = squares[40]; // Starting position
const targetSquare = squares[33]; // Valid move
⋮----
// Test undo
⋮----
// Open settings
⋮----
// Change theme
⋮----
// Close settings
⋮----
// Start new game
⋮----
// Select a piece first to see default behavior (hints should be on by default)
⋮----
// Should show move hints by default
⋮----
// Deselect the piece
⋮----
// Open settings and disable move hints
⋮----
expect(moveHintsCheckbox.checked).toBe(true); // Should be on by default
⋮----
// Give time for settings to close
⋮----
// Select a piece again - should not show move hints
⋮----
// Check that no valid move indicators are shown
⋮----
// Try to select opponent's piece
const blackPieceSquare = squares[17]; // Black piece position
⋮----
// Should not select (no error message expected for this case)
⋮----
// Select own piece first
⋮----
// Try to move to invalid square (occupied by own piece)
const invalidTargetSquare = squares[48]; // Another red piece
⋮----
// Should deselect current piece
⋮----
// Count initial squares (should be 8x8 = 64)
⋮----
// Open settings
⋮----
// First select 10x10 board size
⋮----
// This should show confirmation dialog
⋮----
// Should now have 10x10 = 100 squares
⋮----
// Verify game restarted
````

## File: tests/performance/BoardPerformance.test.ts
````typescript
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { StandardRules } from '../../src/rules/StandardRules';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';
⋮----
// Measure single copy
⋮----
// Measure 1000 copies
⋮----
// Measure setting pieces on empty board
⋮----
// Create a board with some pieces
⋮----
// Measure moving pieces
⋮----
// Measure the copySquares method indirectly
⋮----
// Time how long it takes to perform operations that trigger deep copies
````

## File: tests/performance/MoveGeneration.test.ts
````typescript
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';
import { StandardRules } from '../../src/rules/StandardRules';
import { Game } from '../../src/core/Game';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';
⋮----
// Measure move generation for each piece
⋮----
// Create a board with king pieces
⋮----
// Measure king move generation
⋮----
// Measure getting all moves for a player
⋮----
// Create a board with multiple capture opportunities
⋮----
// Set up a complex capture scenario
⋮----
// Test validation performance
⋮----
// Measure validation time
⋮----
// Create a worst-case scenario for move generation
⋮----
// Place pieces in a pattern that maximizes capture checks
````

## File: tests/performance/OptimizationBenchmark.test.ts
````typescript
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';
⋮----
// Measure time for 1000 board mutations
⋮----
expect(stats!.total).toBeLessThan(50); // 50ms for 1000 operations
⋮----
// Set up initial board
⋮----
// The underlying arrays should be different objects
// but pieces should be shared (same reference)
⋮----
expect(piece1).toBe(piece2); // Same piece object reference
⋮----
// Set up a complex capture scenario
⋮----
// Create a triple-jump scenario
⋮----
// Measure capture move generation
⋮----
expect(stats!.average).toBeLessThan(5); // 5ms for complex capture search
⋮----
// Verify captures were found
⋮----
// Create a maximum complexity scenario
⋮----
// Place pieces in a zigzag pattern for maximum captures
⋮----
// This should complete without error
⋮----
// Generate positions
⋮----
// Measure hash generation
⋮----
expect(stats!.total).toBeLessThan(1); // 1ms for 64 hashes
expect(hashes.size).toBe(64); // All unique
⋮----
// 8x8 board
⋮----
// 10x10 board
⋮----
// Parse back
````

## File: tests/pieces/RegularPiece.test.ts
````typescript
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Player, Direction } from '../../src/types';
⋮----
// Red moves toward row 0
⋮----
// Place enemy piece to capture
⋮----
board = board.setPiece(new Position(2, 2), blackPiece); // Block one direction
⋮----
board = board.setPiece(new Position(4, 4), blackPiece); // Enemy to capture
⋮----
board = board.setPiece(new Position(4, 4), new RegularPiece(Player.RED)); // Own piece
⋮----
expect(copy).not.toBe(redPiece); // Different instance
````

## File: tests/ui/GameBoard.test.tsx
````typescript
import { render, screen, fireEvent } from '@testing-library/react';
⋮----
import { GameBoard } from '../../src/ui/web/components/GameBoard';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Move } from '../../src/core/Move';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
⋮----
interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}
⋮----
// Check first row pattern (light, dark, light, dark...)
⋮----
// Check second row pattern (dark, light, dark, light...)
````

## File: tests/ui/GameConfig.test.tsx
````typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
⋮----
import { GameConfig } from '../../src/ui/web/components/GameConfig';
import { GameConfigProvider } from '../../src/ui/web/contexts/GameConfigContext';
⋮----
// Mock localStorage
⋮----
const renderWithProvider = (ui: React.ReactElement) =>
⋮----
// Verify localStorage was called at least for the update
⋮----
// Verify localStorage was called at least for the update
⋮----
// Verify localStorage was called
⋮----
// First change something
⋮----
// First select International Draughts
⋮----
// Confirm the change
⋮----
// Check that 8x8 is disabled when international is selected
````

## File: tests/ui/Performance.test.ts
````typescript
import { performance } from 'perf_hooks';
import { Game } from '../../src/core/Game';
import { StandardRules } from '../../src/rules/StandardRules';
import { Position } from '../../src/core/Position';
import { ANIMATION_DURATIONS } from '../../src/ui/web/types/GameConfig';
⋮----
// Should initialize in less than 1ms on average
⋮----
const position = new Position(5, 0); // Starting red piece position
⋮----
// Should generate moves in less than 2ms on average
⋮----
// Board copy should be fast (less than 0.1ms)
⋮----
// Serialization should be fast
⋮----
// Test that animation durations are within reasonable ranges
⋮----
// Ensure proper ordering
⋮----
// Should handle 10x10 boards efficiently (less than 5ms)
⋮----
// Simulate a series of moves to test memory usage
⋮----
// Make 20 moves (10 each player)
⋮----
// Skip invalid moves
⋮----
// Memory increase should be reasonable (less than 10MB for 50 moves)
⋮----
// Generate test positions
⋮----
// Position hashing should be very fast (less than 0.002ms)
⋮----
// Make some moves first
⋮----
// Skip invalid moves
⋮----
// Skip invalid moves
⋮----
// Undo/redo should be fast (less than 3ms)
````

## File: tests/ui/UserFlow.test.tsx
````typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
⋮----
import { GameApp } from '../../src/ui/web/GameApp';
⋮----
// Mock localStorage
⋮----
// Wait for initial render
⋮----
// Get all squares
⋮----
// Find a red piece in the starting position (row 5, col 0 = index 40)
⋮----
// Click on the red piece to select it
⋮----
// Check that the square is selected
⋮----
// Find a valid move square (one diagonal forward)
const targetSquare = squares[33]; // row 4, col 1
⋮----
// Click on the valid move square
⋮----
// Verify the piece has moved
⋮----
// Make a move first
⋮----
// Select and move a piece
fireEvent.click(squares[40]!); // Select red piece
⋮----
fireEvent.click(squares[33]!); // Move to valid square
⋮----
// Click undo button
⋮----
// Verify move was undone
⋮----
// Make a move
⋮----
// Click new game
⋮----
// Verify board is reset
⋮----
// Check that pieces are in starting positions
⋮----
expect(pieces).toHaveLength(24); // 12 red + 12 black pieces
⋮----
// Click settings button
⋮----
// Verify settings panel is open
⋮----
// Close settings panel
⋮----
// Verify settings panel is closed
⋮----
// Open settings
⋮----
// Change theme to dark
⋮----
// Verify CSS variable has changed
⋮----
// Try to select a black piece (should fail as it's red's turn)
const blackPieceSquare = squares[17]; // A black piece position
⋮----
// Should not select the piece
⋮----
// This is a simplified test - in a real game, we'd need to play through to completion
// For now, we'll just verify the UI can display game over state
⋮----
// In a real test, we would play through a complete game
// For now, just verify the game status component exists and can show different states
````

## File: .eslintignore
````
vite.config.ts
dist/
node_modules/
.early.coverage/
````

## File: README.md
````markdown
# Extensible Checkers Game

A highly extensible checkers game implementation in TypeScript, designed with clean architecture principles and design patterns to support custom game rules and variations.

## Features

- **Extensible Rule System**: Easily create custom game rules and variations
- **Clean Architecture**: Separation of concerns with well-defined interfaces
- **Design Patterns**: Strategy, Observer, Factory, and Command patterns
- **Immutable State**: All game state changes create new instances
- **Type Safety**: Full TypeScript support with strict typing
- **Pluggable UI**: Support for different UI implementations (Console, Web, etc.)
- **Comprehensive Testing**: Unit tests with Jest

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the game
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Architecture Overview

The game is built using a layered architecture:

- **Core Layer**: Basic game entities (Board, Position, Move)
- **Pieces Layer**: Piece types and their behaviors
- **Rules Layer**: Game rules and validation logic
- **Strategies Layer**: Pluggable algorithms for move validation
- **UI Layer**: User interface implementations
- **Game Controller**: Orchestrates the game flow

For detailed architecture information, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Creating Custom Rules

The game supports custom rules through the `RuleEngine` interface:

```typescript
class MyCustomRules implements RuleEngine {
  validateMove(board: Board, move: Move): boolean {
    // Custom validation logic
  }
  
  getPossibleMoves(board: Board, position: Position): Move[] {
    // Custom move generation
  }
}
```

For a complete guide, see [EXTENSIBILITY.md](docs/EXTENSIBILITY.md).

## API Reference

See [API.md](docs/API.md) for detailed API documentation.

## Examples

Check the `examples/` directory for sample custom rule implementations:
- International Draughts rules
- Flying Kings variation
- Multi-capture requirements

## License

MIT
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
````

## File: examples/CrazyCheckers.ts
````typescript
import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { Piece } from '../src/pieces/Piece';
⋮----
/**
 * Crazy Checkers with multiple rule variations.
 * - Regular pieces can move backward
 * - Kings can teleport to opposite corners
 * - Optional super jumps (jump over multiple pieces)
 * - Configurable rule combinations
 */
export class CrazyCheckersRules extends CustomRulesBase
⋮----
constructor(
    boardSize: number = 8,
    private options: {
      allowBackwardMoves?: boolean;
      enableTeleportation?: boolean;
      enableSuperJumps?: boolean;
      doubleJumpReward?: boolean;
    } = {}
)
⋮----
/**
   * Enhanced move validation with crazy rules.
   */
override validateMove(board: Board, move: Move): boolean
⋮----
// Check for teleportation moves
⋮----
// Check for super jump moves
⋮----
// Check backward moves for regular pieces
⋮----
/**
   * Enhanced move generation with crazy rules.
   */
override getPossibleMoves(board: Board, position: Position): Move[]
⋮----
// Add teleportation moves for kings
⋮----
// Add backward moves for regular pieces
⋮----
// Add super jump moves
⋮----
/**
   * Special promotion rules - double jump reward.
   */
override shouldPromote(position: Position, piece: Piece): boolean
⋮----
// Promote if piece made a double jump (captured 2+ pieces in one turn)
⋮----
// This would require tracking the current move context
// Simplified for this example
⋮----
/**
   * Check if move is a teleportation move.
   */
private isTeleportMove(move: Move, piece: Piece): boolean
⋮----
// Teleportation: king can move to opposite corner areas
⋮----
new Position(0, 1), new Position(1, 0), // Top-left area
new Position(0, 7), new Position(1, 6), // Top-right area
new Position(6, 1), new Position(7, 0), // Bottom-left area
new Position(6, 7), new Position(7, 6)  // Bottom-right area
⋮----
/**
   * Validate teleportation move.
   */
private validateTeleportMove(board: Board, move: Move): boolean
⋮----
// Teleportation requires empty destination
⋮----
/**
   * Check if move is a super jump (jumping over multiple pieces).
   */
private isSuperJump(move: Move): boolean
⋮----
/**
   * Validate super jump move.
   */
private validateSuperJump(board: Board, move: Move): boolean
⋮----
return false; // Can't jump over own pieces
⋮----
// Must capture all opponents in the path
⋮----
/**
   * Validate backward move for regular pieces.
   */
private validateBackwardMove(board: Board, move: Move, piece: Piece): boolean
⋮----
// Allow any diagonal move (forward or backward)
⋮----
/**
   * Get teleportation moves for kings.
   */
private getTeleportMoves(board: Board, position: Position): Move[]
⋮----
/**
   * Get backward moves for regular pieces.
   */
private getBackwardMoves(board: Board, position: Position, piece: Piece): Move[]
⋮----
? ['SW', 'SE'] as const // Red normally goes NW/NE, so backward is SW/SE
: ['NW', 'NE'] as const; // Black normally goes SW/SE, so backward is NW/NE
⋮----
// Check for backward captures
⋮----
/**
   * Get super jump moves.
   */
private getSuperJumpMoves(board: Board, position: Position): Move[]
⋮----
// Look for a sequence of opponents to jump over
⋮----
if (nextPiece.player === piece.player) break; // Hit own piece
⋮----
/**
   * Helper to get next position in a direction.
   */
private getNextPositionInDirection(
    pos: Position | null, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
): Position | null
````

## File: src/commands/MoveCommand.ts
````typescript
import { BaseCommand } from './Command';
import { Move } from '../core/Move';
import { GameState, Player } from '../types';
⋮----
/**
 * Command for executing moves with undo capability.
 */
export class MoveCommand extends BaseCommand
⋮----
constructor(private readonly move: Move)
⋮----
override execute(state: GameState): GameState
⋮----
// Store deep copy of previous state for undo
⋮----
// Apply the move to create new state
⋮----
// Current player switching would be handled by Game class
⋮----
override undo(_state: GameState): GameState
⋮----
override getDescription(): string
⋮----
override canExecute(state: GameState): boolean
⋮----
// Basic validation - piece exists and belongs to current player
⋮----
getMove(): Move
````

## File: src/core/Game.ts
````typescript
import { Board } from './Board';
import { Move } from './Move';
import { Position } from './Position';
import { GameObserver } from './GameObserver';
import { Player, GameState, GameConfig } from '../types';
import { RuleEngine } from '../rules/RuleEngine';
import { StandardRules } from '../rules/StandardRules';
import { ValidationEngine } from '../strategies/ValidationEngine';
import { GameOverError, InvalidMoveError } from '../errors';
import { Piece } from '../pieces/Piece';
import { MoveCommand } from '../commands/MoveCommand';
import { Command } from '../commands/Command';
⋮----
/**
 * Main game controller that orchestrates the checkers game.
 * Implements Observer pattern for state change notifications.
 */
export class Game
⋮----
constructor(config: Partial<GameConfig> =
⋮----
/**
   * Gets the current board state.
   */
getBoard(): Board
⋮----
/**
   * Gets the current player.
   */
getCurrentPlayer(): Player
⋮----
/**
   * Gets the move history.
   */
getHistory(): readonly Move[]
⋮----
/**
   * Gets the current move count.
   */
getMoveCount(): number
⋮----
/**
   * Checks if the game is over.
   */
isGameOver(): boolean
⋮----
/**
   * Gets the winner of the game.
   */
getWinner(): Player | null
⋮----
/**
   * Gets the current game state.
   */
getGameState(): GameState
⋮----
/**
   * Makes a move on the board.
   */
makeMove(move: Move): boolean
⋮----
// Validate the move using both rule engine and validation engine
⋮----
// Create and execute command
⋮----
// Update game state from command result
⋮----
// Add command to history and clear redo stack
⋮----
// Handle promotion if needed
⋮----
// Check for game end
⋮----
// Notify observers
⋮----
/**
   * Gets possible moves from a position.
   */
getPossibleMoves(position: Position): Move[]
⋮----
/**
   * Gets all possible moves for the current player.
   */
getAllPossibleMoves(): Move[]
⋮----
/**
   * Gets mandatory moves for the current player.
   */
getMandatoryMoves(): Move[]
⋮----
/**
   * Undoes the last move.
   */
undoMove(): boolean
⋮----
// Pop the last command from history
⋮----
// Push it onto redo stack
⋮----
// Get the previous state and update game
⋮----
// Notify observers
⋮----
/**
   * Redoes the last undone move.
   */
redoMove(): boolean
⋮----
// Pop command from redo stack
⋮----
// Execute it and push back to history
⋮----
// Update game state
⋮----
// Check for game end
⋮----
// Notify observers
⋮----
/**
   * Resets the game to initial state.
   */
reset(): void
⋮----
/**
   * Adds an observer to receive game notifications.
   */
addObserver(observer: GameObserver): void
⋮----
/**
   * Removes an observer.
   */
removeObserver(observer: GameObserver): void
⋮----
/**
   * Removes all observers.
   */
clearObservers(): void
⋮----
/**
   * Sets a new rule engine.
   */
setRuleEngine(ruleEngine: RuleEngine): void
⋮----
// Validate current board state with new rules
⋮----
/**
   * Gets the current rule engine.
   */
getRuleEngine(): RuleEngine
⋮----
/**
   * Sets the validation engine.
   */
setValidationEngine(validationEngine: ValidationEngine): void
⋮----
/**
   * Gets the validation engine.
   */
getValidationEngine(): ValidationEngine
⋮----
/**
   * Validates a move using both rule engine and validation engine.
   */
private validateMove(move: Move): void
⋮----
// First check with rule engine
⋮----
// Then validate with validation engine
⋮----
/**
   * Handles piece promotion after a move.
   */
private handlePromotion(move: Move): void
⋮----
if (move.isPromotion) return; // Already handled
⋮----
// Notify observers of promotion
⋮----
/**
   * Checks if the game has ended.
   */
private checkGameEnd(): void
⋮----
/**
   * Gets captured pieces from move history.
   */
private getCapturedPieces(): Piece[]
⋮----
// Calculate captured pieces from move history
⋮----
// Note: In a real implementation, we'd need to track the actual captured pieces
// For now, return an empty array since we can't reconstruct the pieces
// This would require storing captured pieces with each move
⋮----
/**
   * Notifies observers of a move.
   */
private notifyMoveObservers(move: Move, board: Board): void
⋮----
/**
   * Notifies observers of game end.
   */
private notifyGameEndObservers(winner: Player | null): void
⋮----
/**
   * Notifies observers of turn change.
   */
private notifyTurnChangeObservers(player: Player): void
⋮----
/**
   * Notifies observers of invalid move.
   */
private notifyInvalidMoveObservers(move: Move, reason: string): void
⋮----
/**
   * Notifies observers of board update.
   */
private notifyBoardUpdateObservers(board: Board): void
````

## File: src/core/Position.ts
````typescript
import { InvalidPositionError } from '../errors';
⋮----
/**
 * Immutable class representing a position on the board.
 */
export class Position
⋮----
constructor(
    public readonly row: number,
    public readonly col: number
)
⋮----
/**
   * Checks if this position equals another position.
   */
equals(other: Position | null): boolean
⋮----
/**
   * Checks if this position is valid for the given board size.
   */
isValid(boardSize: number = 8): boolean
⋮----
/**
   * Gets diagonal positions at a given distance.
   */
getDiagonalPositions(distance: number = 1): Position[]
⋮----
new Position(this.row - distance, this.col - distance), // NW
new Position(this.row - distance, this.col + distance), // NE
new Position(this.row + distance, this.col - distance), // SW
new Position(this.row + distance, this.col + distance), // SE
⋮----
/**
   * Gets adjacent diagonal positions.
   */
getAdjacentDiagonals(): Position[]
⋮----
/**
   * Calculates Manhattan distance to another position.
   */
manhattanDistanceTo(other: Position): number
⋮----
/**
   * Calculates diagonal distance to another position.
   * Returns -1 if positions are not on the same diagonal.
   */
diagonalDistanceTo(other: Position): number
⋮----
/**
   * Checks if this position is on the same diagonal as another.
   */
isOnSameDiagonalAs(other: Position): boolean
⋮----
/**
   * Gets the direction to another position.
   * Returns null if not on a diagonal.
   */
getDirectionTo(other: Position): 'NW' | 'NE' | 'SW' | 'SE' | null
⋮----
/**
   * Gets positions between this and another position.
   * Returns empty array if not on same diagonal.
   */
getPositionsBetween(other: Position): Position[]
⋮----
/**
   * Checks if this position is a dark square (playable in checkers).
   */
isDarkSquare(): boolean
⋮----
/**
   * Converts position to string notation (e.g., "a1", "h8").
   */
toString(boardSize: number = 8): string
⋮----
const file = String.fromCharCode(97 + this.col); // a-h, etc.
const rank = (boardSize - this.row).toString(); // 1-8, etc.
⋮----
/**
   * Creates a Position from string notation.
   */
static fromString(notation: string, boardSize: number = 8): Position
⋮----
/**
   * Creates a new position offset by the given amounts.
   */
offset(rowOffset: number, colOffset: number): Position
⋮----
/**
   * Gets a unique hash for this position.
   */
hash(): string
⋮----
/**
   * Creates a Position from a hash value.
   */
static fromHash(hash: string): Position
````

## File: src/pieces/KingPiece.ts
````typescript
import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction } from '../types';
⋮----
/**
 * King piece that can move in all diagonal directions.
 */
export class KingPiece extends Piece
⋮----
/**
   * Kings can move diagonally in any direction.
   */
canMove(from: Position, to: Position, board: Board): boolean
⋮----
// For regular moves, path must be clear
⋮----
// For capture moves, must have exactly one opponent in path
⋮----
/**
   * Gets possible non-capture moves (any diagonal direction).
   */
getPossibleMoves(position: Position, board: Board): Position[]
⋮----
/**
   * Gets possible capture moves for a king.
   */
getCaptureMoves(position: Position, board: Board): Move[]
⋮----
/**
   * Creates a copy of this piece.
   */
copy(): KingPiece
⋮----
/**
   * Kings are already promoted.
   */
promote(): KingPiece
⋮----
/**
   * Gets the value of a king piece (typically 3-4).
   */
getValue(): number
⋮----
/**
   * Gets the symbol for display.
   */
getSymbol(): string
⋮----
/**
   * Kings can move in all diagonal directions.
   */
getMoveDirections(): Direction[]
⋮----
/**
   * Kings can capture in any direction.
   */
canCaptureInDirection(_direction: Direction): boolean
⋮----
/**
   * Kings can move across the entire board.
   */
getMaxMoveDistance(): number
⋮----
return 7; // Maximum for 8x8 board
⋮----
/**
   * This is a king piece.
   */
isKing(): boolean
⋮----
/**
   * Checks if a path is clear (no pieces).
   */
private isPathClear(positions: Position[], board: Board): boolean
⋮----
/**
   * Finds all capture moves in a given direction.
   */
private getCapturesInDirection(
    from: Position,
    direction: Direction,
    board: Board,
    alreadyCaptured: Position[]
): Move[]
⋮----
// Hit our own piece - can't continue
⋮----
// Found an opponent
⋮----
// Found a second piece - can't jump over two pieces
⋮----
// Found empty square after opponent - valid landing position
⋮----
// Check for additional captures from this position
⋮----
// Combine captures into multi-capture moves
⋮----
/**
   * Checks if a position is already captured in the current sequence.
   */
private isAlreadyCaptured(position: Position, captured: Position[]): boolean
````

## File: src/pieces/Piece.ts
````typescript
import { Player, Direction } from '../types';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
⋮----
/**
 * Abstract base class for all game pieces.
 * Extend this class to create custom piece types.
 */
export abstract class Piece
⋮----
constructor(
⋮----
/**
   * Checks if this piece can move from one position to another.
   */
abstract canMove(from: Position, to: Position, board: Board): boolean;
⋮----
/**
   * Gets all possible non-capture moves from a position.
   */
abstract getPossibleMoves(position: Position, board: Board): Position[];
⋮----
/**
   * Gets all possible capture moves from a position.
   */
abstract getCaptureMoves(position: Position, board: Board): Move[];
⋮----
/**
   * Creates a copy of this piece.
   */
abstract copy(): Piece;
⋮----
/**
   * Promotes this piece (e.g., regular to king).
   * Default implementation returns self (no promotion).
   */
abstract promote(): Piece;
⋮----
/**
   * Gets the value of this piece for evaluation.
   */
abstract getValue(): number;
⋮----
/**
   * Gets the symbol representation of this piece.
   */
abstract getSymbol(): string;
⋮----
/**
   * Gets the directions this piece can move.
   */
abstract getMoveDirections(): Direction[];
⋮----
/**
   * Checks if this piece can capture in a given direction.
   */
abstract canCaptureInDirection(direction: Direction): boolean;
⋮----
/**
   * Gets the maximum distance this piece can move.
   */
abstract getMaxMoveDistance(): number;
⋮----
/**
   * Checks if this piece is a king.
   */
abstract isKing(): boolean;
⋮----
/**
   * Checks if this piece belongs to the given player.
   */
belongsTo(player: Player): boolean
⋮----
/**
   * Checks if this piece is an opponent of the given player.
   */
isOpponentOf(player: Player): boolean
⋮----
/**
   * Gets a unique identifier for this piece.
   */
getId(): string
⋮----
/**
   * Checks if this piece equals another piece.
   */
equals(other: Piece | null): boolean
⋮----
/**
   * Helper method to check if a position is valid and empty.
   */
protected isValidEmptyPosition(position: Position, board: Board): boolean
⋮----
/**
   * Helper method to check if a position contains an opponent.
   */
protected hasOpponent(position: Position, board: Board): boolean
⋮----
/**
   * Helper method to get positions in a direction.
   */
protected getPositionsInDirection(
    start: Position,
    direction: Direction,
    maxDistance: number = 1,
    boardSize: number = 8
): Position[]
⋮----
/**
   * Helper method to get the next position in a direction.
   */
protected getNextPosition(position: Position, direction: Direction, boardSize: number = 8): Position | null
````

## File: src/rules/StandardRules.ts
````typescript
import { RuleEngine } from './RuleEngine';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece, RegularPiece } from '../pieces';
⋮----
/**
 * Standard checkers rules implementation.
 * - Regular pieces move forward diagonally
 * - Kings move in any diagonal direction
 * - Captures are mandatory
 * - Multiple captures must be taken
 * - Pieces promote to kings on the back row
 */
export class StandardRules implements RuleEngine
⋮----
constructor(boardSize: number = 8)
⋮----
/**
   * Validates if a move is legal according to standard rules.
   */
validateMove(board: Board, move: Move): boolean
⋮----
// For multi-step moves, validate each step
⋮----
// Check basic move validity
⋮----
// Get mandatory moves for the current player
⋮----
// If there are mandatory moves, the move must be one of them
⋮----
// Check if this is a valid non-capture move
⋮----
// Validate capture move
⋮----
/**
   * Gets all possible moves from a given position.
   */
getPossibleMoves(board: Board, position: Position): Move[]
⋮----
// Check for capture moves first (they're mandatory)
⋮----
// Check for promotion on each capture move
⋮----
// Get regular moves
⋮----
// Check for promotion
⋮----
/**
   * Gets all possible moves for a player.
   */
getAllPossibleMoves(board: Board, player: Player): Move[]
⋮----
// First check if there are any mandatory captures
⋮----
// Otherwise, get all possible moves
⋮----
/**
   * Checks if the game has ended.
   */
isGameOver(board: Board): boolean
⋮----
// Game is over if either player has no pieces
⋮----
// Game is over if current player has no valid moves
⋮----
/**
   * Determines the winner of the game.
   */
getWinner(board: Board): Player | null
⋮----
// Winner by elimination
⋮----
// Check if a player has no moves
⋮----
// Stalemate - winner is player with more pieces
⋮----
return null; // Game not over
⋮----
/**
   * Gets mandatory moves (forced captures).
   */
getMandatoryMoves(board: Board, player: Player): Move[]
⋮----
// Find all capture moves
⋮----
// If there are captures, find the ones with maximum captures
⋮----
/**
   * Checks if a piece should be promoted.
   */
shouldPromote(position: Position, piece: Piece): boolean
⋮----
// Red pieces promote on row 0 (top) - they move from bottom to top
⋮----
// Black pieces promote on last row (bottom) - they move from top to bottom
⋮----
/**
   * Gets the initial board setup.
   */
getInitialBoard(): Board
⋮----
// Place black pieces (top of board)
⋮----
// Place red pieces (bottom of board)
⋮----
/**
   * Validates if a board state is legal.
   */
isValidBoardState(board: Board): boolean
⋮----
// Check board size
⋮----
// Check that all pieces are on dark squares
⋮----
// Check piece counts don't exceed starting amounts
⋮----
/**
   * Validates a multi-step move by checking each step.
   */
private validateMultiStepMove(board: Board, move: Move, piece: Piece): boolean
⋮----
// Validate each step
⋮----
// Verify we're at the expected position
⋮----
// Get the piece at current position
⋮----
// Check if the step is diagonal
⋮----
// Check if destination is empty
⋮----
// For capture steps, validate the capture
⋮----
// Verify captured position is between from and to
⋮----
// Apply the capture to the temporary board
⋮----
// Non-capture steps must be single diagonal moves
⋮----
// Move the piece on the temporary board
⋮----
// Verify the move is mandatory if there are captures available
⋮----
/**
   * Validates a regular (non-capture) move.
   */
private isValidRegularMove(board: Board, move: Move, piece: Piece): boolean
⋮----
// Regular moves must be exactly one square
⋮----
// Must move to empty square
⋮----
// Must be diagonal
⋮----
// Regular pieces can only move forward
⋮----
/**
   * Validates a capture move.
   */
private isValidCaptureMove(board: Board, move: Move, piece: Piece): boolean
⋮----
// All captured pieces must be opponents
⋮----
/**
   * Determines current player based on move count.
   * This is a simplified approach - in practice, Game class tracks this.
   */
private getCurrentPlayer(board: Board): Player
⋮----
// Count total pieces to estimate turn
````

## File: src/ui/web/components/GameConfig.tsx
````typescript
import React, { useState } from 'react';
import { useGameConfig } from '../contexts/GameConfigContext';
import { GameConfig as GameConfigType } from '../types/GameConfig';
⋮----
interface GameConfigProps {
  onClose: () => void;
  onNewGame: (boardSize: 8 | 10, ruleSet: 'standard' | 'international' | 'crazy') => void;
}
⋮----
const handleBoardSizeChange = (size: 8 | 10): void =>
⋮----
const handleRuleSetChange = (ruleSet: 'standard' | 'international' | 'crazy'): void =>
⋮----
const confirmChanges = (): void =>
⋮----
const cancelChanges = (): void =>
⋮----
onChange=
````

## File: src/ui/web/hooks/useConfigurableGame.ts
````typescript
import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';
import { RuleEngine } from '../../../rules/RuleEngine';
import { useGameConfig } from '../contexts/GameConfigContext';
import { ANIMATION_DURATIONS } from '../types/GameConfig';
⋮----
// Import custom rule implementations - use relative paths from web directory
import { InternationalDraughtsRules } from '../../../../examples/InternationalDraughts';
import { CrazyCheckersRules } from '../../../../examples/CrazyCheckers';
⋮----
interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}
⋮----
interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}
⋮----
interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: (boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy') => void;
}
⋮----
interface UseConfigurableGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}
⋮----
function createRuleEngine(ruleSet: 'standard' | 'international' | 'crazy', boardSize: 8 | 10 = 8): RuleEngine
⋮----
export function useConfigurableGame(): UseConfigurableGameReturn
⋮----
// Use state for selection to properly trigger re-renders
⋮----
const [gameVersion, setGameVersion] = useState(0); // Track game instance changes
⋮----
// Cache the game state to avoid infinite loops
⋮----
// Update game instance when config changes
⋮----
setGameVersion(v => v + 1); // Increment version to trigger re-subscribe
⋮----
// Return cached state if available
⋮----
// Create and cache new state
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
cachedStateRef.current = null; // Clear cache
⋮----
}, [gameVersion]); // Re-subscribe when game version changes
⋮----
// Get animation duration based on config
⋮----
// Handle move animations
⋮----
// Add moving piece
⋮----
// Handle captures
⋮----
}, animationDuration / 2); // Delay capture animation
⋮----
// Clear animations after delay
⋮----
// Handle promotion animations
⋮----
// Force a state update by clearing the cache and incrementing version
⋮----
setGameVersion(v => v + 1); // Trigger re-subscribe
⋮----
// Note: redoMove not yet implemented in Game class
⋮----
// Combine game state with UI state
````

## File: src/ui/web/hooks/useGame.ts
````typescript
import { useSyncExternalStore, useCallback, useRef, useState } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';
⋮----
interface UIState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
}
⋮----
interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
}
⋮----
interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: () => void;
}
⋮----
interface UseGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}
⋮----
export function useGame(): UseGameReturn
⋮----
// Note: redoMove not yet implemented in Game class
// if (gameRef.current.redoMove()) {
//   setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
// }
````

## File: src/ui/web/main.tsx
````typescript
import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';
````

## File: src/ui/web/styles.css
````css
* {
⋮----
body {
⋮----
#root {
⋮----
.game-container {
⋮----
.game-container h1 {
⋮----
.game-board {
⋮----
.game-square {
⋮----
.game-square.light {
⋮----
.game-square.dark {
⋮----
.game-square.dark:hover {
⋮----
.game-square.selected {
⋮----
.game-square.selected::after {
⋮----
.game-square.valid-move {
⋮----
.game-square.valid-move::before {
⋮----
.game-piece {
⋮----
.game-piece::before {
⋮----
.game-piece.red {
⋮----
.game-piece.black {
⋮----
.game-piece.king {
⋮----
.game-piece.king::after {
⋮----
.game-piece:hover {
⋮----
.game-piece.moving {
⋮----
.game-piece.capturing {
⋮----
.game-piece.promoting {
⋮----
.game-status {
⋮----
.current-player {
⋮----
.current-player::before {
⋮----
.current-player.red::before {
⋮----
.current-player.black::before {
⋮----
.move-count {
⋮----
.game-over {
⋮----
.game-controls {
⋮----
.btn {
⋮----
.btn::before {
⋮----
.btn:active::before {
⋮----
.btn-primary {
⋮----
.btn-primary:hover {
⋮----
.btn-secondary {
⋮----
.btn-secondary:hover {
⋮----
.btn:disabled {
⋮----
.btn:disabled:hover {
⋮----
.error-message {
⋮----
/* Configuration Panel Styles */
.config-overlay {
⋮----
.config-panel {
⋮----
.config-header {
⋮----
.config-header h2 {
⋮----
.close-btn {
⋮----
.close-btn:hover {
⋮----
.config-section {
⋮----
.config-section:last-of-type {
⋮----
.config-section h3 {
⋮----
.config-options {
⋮----
.config-options.horizontal {
⋮----
.config-option {
⋮----
.config-options.horizontal .config-option {
⋮----
.config-option:hover {
⋮----
.config-option.selected {
⋮----
.config-option input[type="radio"] {
⋮----
.config-option span {
⋮----
.config-option small {
⋮----
.config-checkbox {
⋮----
.config-checkbox input[type="checkbox"] {
⋮----
.config-checkbox span {
⋮----
.config-actions {
⋮----
.confirm-dialog {
⋮----
.confirm-content {
⋮----
.confirm-content p {
⋮----
.confirm-actions {
⋮----
.settings-btn {
⋮----
.settings-btn:hover {
⋮----
/* Theme-specific styles */
.theme-modern .game-square.light {
⋮----
.theme-modern .game-square.dark {
⋮----
.theme-dark {
⋮----
.theme-dark .game-container {
⋮----
.theme-dark .game-square.light {
⋮----
.theme-dark .game-square.dark {
⋮----
/* Additional responsive styles */
````

## File: src/ui/web/tsconfig.json
````json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["./**/*"]
}
````

## File: src/index.ts
````typescript
import { Game } from './core/Game';
import { ConsoleUI } from './ui/ConsoleUI';
import { StandardRules } from './rules/StandardRules';
import { Player } from './types';
⋮----
/**
 * Main entry point for the checkers game.
 * Demonstrates how to set up and run a game with the console UI.
 */
async function main(): Promise<void>
⋮----
// Create UI and game
⋮----
// Connect UI as observer
⋮----
// Initialize UI
⋮----
// Render initial board
⋮----
// Game loop
⋮----
// Game ended
⋮----
// Export main components for library usage
⋮----
// Run the game if this file is executed directly
// Note: This check works in CommonJS but not in ES modules
// For ES modules, you would use import.meta.url === new URL(process.argv[1]!, 'file:').href
````

## File: tests/core/Board.test.ts
````typescript
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { InvalidPositionError, InvalidBoardStateError } from '../../src/errors';
⋮----
// @ts-expect-error Testing immutability
⋮----
expect(board.getPiece(pos)).toBe(null); // Original unchanged
expect(newBoard).not.toBe(board); // Different instance
⋮----
expect(boardWithPiece.getPiece(pos)).toBe(piece); // Original unchanged
⋮----
expect(emptyPositions).toHaveLength(64); // 8x8 board
⋮----
expect(playable).toHaveLength(32); // Half of 64 squares
⋮----
// All should be dark squares
⋮----
// Note: This will be false because pieces have different IDs
// In practice, you'd want to compare piece types and players
⋮----
expect(boardString).toContain('a'); // Column labels
expect(boardString).toContain('1'); // Row labels
expect(boardString).toContain('8'); // Row labels
````

## File: tests/core/Move.test.ts
````typescript
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { Board } from '../../src/core/Board';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
⋮----
// @ts-expect-error Testing immutability
⋮----
expect(move.captures).toHaveLength(1); // Original unchanged
⋮----
expect(move.isPromotion).toBe(false); // Original unchanged
⋮----
expect(str).toContain('c6'); // from position
expect(str).toContain('d5'); // to position
expect(str).toContain('-'); // move separator
⋮----
expect(str).toContain('x'); // capture indicator
⋮----
expect(str).toContain('=K'); // promotion indicator
⋮----
expect(move.from).toEqual(new Position(2, 2)); // c6
expect(move.to).toEqual(new Position(4, 4));   // e4
⋮----
expect(move.captures[0]).toEqual(new Position(3, 3)); // d5 is captured
````

## File: tests/rules/StandardRules.test.ts
````typescript
import { StandardRules } from '../../src/rules/StandardRules';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Move } from '../../src/core/Move';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';
⋮----
// When capture is available, regular moves should be invalid
⋮----
board = board.setPiece(new Position(1, 1), piece); // Near promotion row
⋮----
// Should only return capture moves
⋮----
// Set up position where multi-capture is possible
⋮----
// Should prefer moves that capture more pieces
⋮----
// Check red pieces are in correct positions
⋮----
// Check specific positions (BLACK pieces on top, RED on bottom)
⋮----
const invalidBoard = board.setPiece(new Position(0, 0), piece); // Light square
⋮----
// Add too many pieces
⋮----
// Set up a double jump scenario
// Red at (5,2) can jump black at (4,3) to (3,4), then black at (2,5) to (1,6)
⋮----
// Create multi-step move
⋮----
board = board.setPiece(new Position(3, 4), blockingPiece); // Blocks landing
⋮----
// Set up for double jump
⋮----
// Should include the multi-jump capture
⋮----
// Red can capture 1 piece or 2 pieces - should force 2
⋮----
board = board.setPiece(new Position(4, 1), blackPiece3); // Single capture option
⋮----
// Should only allow the double capture
⋮----
// Set up triple jump scenario
⋮----
// Should find the triple jump
⋮----
// Original position should be empty
⋮----
// Final position should have the piece
⋮----
// Captured pieces should be removed
````

## File: tests/setup.ts
````typescript
// Test setup and configuration
// This file runs before all tests
⋮----
// Add any global test configuration here
⋮----
// Mock console methods to reduce noise during testing
⋮----
// Optionally suppress console output during tests
⋮----
// Restore console methods
````

## File: .gitignore
````
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Testing & Coverage
coverage/
.nyc_output/
*.lcov
.early.coverage/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~
.eslintcache

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Temporary folders
tmp/
temp/
````

## File: eslint.config.js
````javascript

````

## File: jest.config.js
````javascript

````

## File: examples/InternationalDraughts.ts
````typescript
import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { RegularPiece } from '../src/pieces/RegularPiece';
⋮----
/**
 * International Draughts (10x10) rules implementation.
 * - Played on 10x10 board
 * - Kings can fly (move multiple squares)
 * - Must capture maximum possible pieces
 * - Different piece placement
 */
export class InternationalDraughtsRules extends CustomRulesBase
⋮----
constructor(boardSize: number = 10)
⋮----
super(boardSize); // Default to 10x10 for International Draughts
⋮----
/**
   * Enhanced move validation for flying kings.
   */
override validateMove(board: Board, move: Move): boolean
⋮----
// For kings, allow flying moves
⋮----
// Regular pieces follow standard rules
⋮----
/**
   * Enhanced move generation for flying kings.
   */
override getPossibleMoves(board: Board, position: Position): Move[]
⋮----
/**
   * Must capture maximum possible pieces rule.
   */
override getMandatoryMoves(board: Board, player: Player): Move[]
⋮----
// Find maximum capture count
⋮----
// Return only moves that capture the maximum
⋮----
/**
   * International draughts initial setup (4 rows each).
   */
override getInitialBoard(): Board
⋮----
// Place black pieces (top 4 rows)
⋮----
// Place red pieces (bottom 4 rows)
⋮----
/**
   * Validates flying king moves.
   */
private validateFlyingKingMove(board: Board, move: Move): boolean
⋮----
// For captures, exactly one opponent should be captured
⋮----
// For regular moves, path must be clear
⋮----
/**
   * Gets all possible flying king moves.
   */
private getFlyingKingMoves(board: Board, position: Position): Move[]
⋮----
// Regular moves in this direction
⋮----
// Capture moves in this direction
⋮----
/**
   * Gets regular moves in a specific direction for flying kings.
   */
private getRegularMovesInDirection(
    board: Board, 
    position: Position, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
): Move[]
⋮----
// eslint-disable-next-line no-constant-condition
⋮----
/**
   * Gets capture moves in a specific direction for flying kings.
   */
private getCaptureMovesInDirection(
    board: Board,
    position: Position,
    direction: 'NW' | 'NE' | 'SW' | 'SE'
): Move[]
⋮----
// Look for opponent pieces to capture
// eslint-disable-next-line no-constant-condition
⋮----
// Hit our own piece - stop
⋮----
// Found opponent piece
⋮----
// Look for landing positions after the captured piece
⋮----
// eslint-disable-next-line no-constant-condition
⋮----
break; // Only one capture per direction in this simple implementation
⋮----
/**
   * Helper to get next position in a direction.
   */
private getNextPositionInDirection(
    pos: Position, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
): Position | null
````

## File: src/core/Board.ts
````typescript
import { Position } from './Position';
import { Piece } from '../pieces/Piece';
import { Player } from '../types';
import { InvalidPositionError, InvalidBoardStateError } from '../errors';
⋮----
/**
 * Immutable class representing the game board.
 * All operations return new Board instances using a performant copy-on-write strategy.
 */
export class Board
⋮----
// The board state is now a flat, 1D array for performance.
⋮----
constructor(
    public readonly size: number = 8,
    // The constructor can accept a 1D or 2D array for flexibility.
    initialSquares?: ReadonlyArray<ReadonlyArray<Piece | null>> | ReadonlyArray<Piece | null>
)
⋮----
// The constructor can accept a 1D or 2D array for flexibility.
⋮----
// Flatten if a 2D array is provided
⋮----
/**
   * Gets the piece at a given position.
   */
getPiece(position: Position): Piece | null
⋮----
/**
   * Sets a piece at a position using copy-on-write.
   */
setPiece(position: Position, piece: Piece | null): Board
⋮----
// Create a shallow copy of the squares array. This is very fast.
⋮----
// Mutate only the specific index in the new array.
⋮----
// Return a new Board instance with the modified array.
// The underlying Piece objects are still shared, which is fine due to their immutability.
⋮----
/**
   * Moves a piece from one position to another.
   */
movePiece(from: Position, to: Position): Board
⋮----
/**
   * Removes a piece from a position (returns new Board).
   */
removePiece(position: Position): Board
⋮----
/**
   * Removes multiple pieces.
   */
removePieces(positions: Position[]): Board
⋮----
/**
   * Gets all pieces for a player.
   */
getPlayerPieces(player: Player): Array<
⋮----
/**
   * Gets the count of pieces for each player.
   */
getPieceCount(player: Player): number
⋮----
/**
   * Checks if a position is valid on this board.
   */
isValidPosition(position: Position): boolean
⋮----
/**
   * Checks if a position is empty.
   */
isEmpty(position: Position): boolean
⋮----
/**
   * Checks if a position contains a piece of a specific player.
   */
hasPlayerPiece(position: Position, player: Player): boolean
⋮----
/**
   * Gets all occupied positions.
   */
getOccupiedPositions(): Position[]
⋮----
/**
   * Gets all empty positions.
   */
getEmptyPositions(): Position[]
⋮----
/**
   * Gets all playable positions (dark squares).
   */
getPlayablePositions(): Position[]
⋮----
/**
   * Creates a deep copy ONLY when absolutely necessary. For general mutations,
   * use the copy-on-write methods (setPiece, movePiece).
   */
copy(): Board
⋮----
/**
   * Applies a function to transform the board.
   */
transform(fn: (board: Board) => Board): Board
⋮----
/**
   * Checks if this board equals another board.
   */
equals(other: Board | null): boolean
⋮----
/**
   * Gets a hash representation of the board state.
   */
hash(): string
⋮----
/**
   * Converts the board to a string representation.
   */
toString(): string
⋮----
// Column headers
⋮----
// Column footers
⋮----
// --- PRIVATE METHODS ---
⋮----
private createEmptyBoard(size: number): ReadonlyArray<Piece | null>
⋮----
private calculatePieceCount(): Map<Player, number>
````

## File: src/pieces/RegularPiece.ts
````typescript
import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction } from '../types';
import { KingPiece } from './KingPiece';
⋮----
/**
 * Regular checker piece that can only move forward diagonally.
 */
export class RegularPiece extends Piece
⋮----
/**
   * Regular pieces can only move forward diagonally by one square.
   */
canMove(from: Position, to: Position, board: Board): boolean
⋮----
// Regular move: one square forward
⋮----
// Capture move: two squares with enemy piece in between
⋮----
/**
   * Gets possible non-capture moves (one square forward diagonally).
   */
getPossibleMoves(position: Position, board: Board): Position[]
⋮----
/**
   * Gets all possible capture moves, including multi-jump sequences.
   * This is the public entry point.
   */
getCaptureMoves(position: Position, board: Board): Move[]
⋮----
/**
   * Recursively finds all capture sequences from a given position.
   * @param currentPos The current position in the jump sequence.
   * @param board The original, unmodified board.
   * @param path The sequence of jumps taken so far.
   * @param capturedOnPath A Set of positions of pieces already captured to prevent loops.
   * @param allSequences The accumulator array for all valid final move sequences.
   */
private findCaptureSequences(
    currentPos: Position,
    board: Board,
    path: Move[],
    capturedOnPath: Set<string>,
    allSequences: Move[]
): void
⋮----
// Check all four diagonal directions for the next jump.
⋮----
!capturedOnPath.has(opponentKey) // Check if we've already captured this piece in this sequence
⋮----
// This complete sequence is a valid move.
// We create a final Move object from the start of the sequence to the end.
⋮----
// Create proper steps for multi-step moves
⋮----
// Recursively check for more jumps from the new landing position.
⋮----
/**
   * Creates a copy of this piece.
   */
copy(): RegularPiece
⋮----
/**
   * Promotes this piece to a king.
   */
promote(): KingPiece
⋮----
/**
   * Gets the value of a regular piece (typically 1).
   */
getValue(): number
⋮----
/**
   * Gets the symbol for display.
   */
getSymbol(): string
⋮----
/**
   * Gets valid move directions (forward only for regular pieces).
   */
getMoveDirections(): Direction[]
⋮----
/**
   * Regular pieces can capture in any direction.
   */
canCaptureInDirection(_direction: Direction): boolean
⋮----
/**
   * Regular pieces can only move one square.
   */
getMaxMoveDistance(): number
⋮----
/**
   * Regular pieces are not kings.
   */
isKing(): boolean
⋮----
/**
   * Checks if a direction is forward for this piece.
   */
private isForwardDirection(direction: string | null): boolean
````

## File: src/ui/web/components/GameBoard.tsx
````typescript
import React from 'react';
import { Board } from '../../../core/Board';
import { Position } from '../../../core/Position';
import { Move } from '../../../core/Move';
import { GameSquare } from './GameSquare';
⋮----
interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}
⋮----
interface GameBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Move[];
  animationState: AnimationState;
  onSquareClick: (position: Position) => void;
  showMoveHints: boolean;
}
````

## File: src/ui/web/components/GameControls.tsx
````typescript
import React from 'react';
⋮----
interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  gameOver: boolean;
}
⋮----
export function GameControls({
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  gameOver
}: GameControlsProps): React.JSX.Element
````

## File: src/ui/web/components/GamePiece.tsx
````typescript
import React from 'react';
import { Piece } from '../../../pieces/Piece';
import { Position } from '../../../core/Position';
import { Player } from '../../../types';
⋮----
interface GamePieceProps {
  piece: Piece;
  position: Position;
  isMoving?: boolean;
  isCaptured?: boolean;
  isPromoted?: boolean;
}
⋮----
export function GamePiece(
````

## File: src/ui/web/components/GameSquare.tsx
````typescript
import React from 'react';
import { Position } from '../../../core/Position';
import { Piece } from '../../../pieces/Piece';
import { GamePiece } from './GamePiece';
⋮----
interface GameSquareProps {
  position: Position;
  piece: Piece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isMoving: boolean;
  isCaptured: boolean;
  isPromoted: boolean;
  onClick: () => void;
}
⋮----
export function GameSquare({ 
  position, 
  piece, 
  isSelected, 
  isValidMove, 
  isMoving,
  isCaptured,
  isPromoted,
  onClick 
}: GameSquareProps): React.JSX.Element
````

## File: src/ui/web/components/GameStatus.tsx
````typescript
import React from 'react';
import { Player } from '../../../types';
⋮----
interface GameStatusProps {
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  moveCount: number;
}
⋮----
const playerName = (player: Player): string
⋮----
Current Turn:
````

## File: src/ui/web/GameApp.tsx
````typescript
import React, { useState } from 'react';
import { GameConfigProvider, useGameConfig } from './contexts/GameConfigContext';
import { useConfigurableGame } from './hooks/useConfigurableGame';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { GameConfig } from './components/GameConfig';
import { THEME_COLORS } from './types/GameConfig';
⋮----
const handleNewGame = (boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy'): void =>
⋮----
// Apply theme-specific CSS variables
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  },
  "include": ["src/**/*", "tests/**/*", "examples/**/*", "playwright/**/*"],
  "exclude": ["node_modules", "dist"]
}
````

## File: package.json
````json
{
  "name": "extensible-checkers",
  "version": "1.0.0",
  "description": "An extensible checkers game with custom rule support",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "build:web": "vite build",
    "dev": "ts-node src/index.ts",
    "dev:web": "vite",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test --config=playwright/config/playwright.config.ts",
    "test:e2e:ui": "playwright test --config=playwright/config/playwright.config.ts --ui",
    "test:e2e:headed": "playwright test --config=playwright/config/playwright.config.ts --headed",
    "test:e2e:debug": "playwright test --config=playwright/config/playwright.config.ts --debug",
    "test:e2e:smoke": "playwright test --config=playwright/config/playwright.config.ts smoke",
    "test:e2e:visual": "playwright test --config=playwright/config/playwright.config.ts visual",
    "test:e2e:accessibility": "playwright test --config=playwright/config/playwright.config.ts accessibility",
    "test:e2e:report": "playwright show-report",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "checkers",
    "game",
    "extensible",
    "strategy-pattern"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@axe-core/playwright": "^4.10.2",
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.30",
    "@typescript-eslint/eslint-plugin": "^7.3.1",
    "@typescript-eslint/parser": "^7.3.1",
    "@vitejs/plugin-react": "^4.5.1",
    "axe-playwright": "^2.1.0",
    "eslint": "^8.57.0",
    "globals": "^16.2.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^30.0.0-beta.3",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.3",
    "vite": "^6.3.5"
  },
  "dependencies": {
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
````

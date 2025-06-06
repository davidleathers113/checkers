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
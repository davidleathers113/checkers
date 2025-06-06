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
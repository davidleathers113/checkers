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
├── Manages the grid state (default 8x8; configurable, e.g. 10x10)
├── Immutable, copy-on-write operations (flat array)
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
Move validation, orchestrated by the `ValidationEngine`. `StandardRules`
delegates `validateMove()` to an engine that runs validators in priority order:

```
ValidationEngine
├── BasicMoveValidator (0)        — positions valid, piece exists/owned, dest empty
├── DiagonalMoveValidator (5)     — diagonal + distance/direction (forward for
│                                    regular non-captures; flying for kings)
├── CaptureValidator (10)         — captured squares hold opponents; jump path
├── MultiStepMoveValidator (15)   — simulates multi-jump steps on a temp board
└── MandatoryCaptureValidator (20)— forces captures and the maximum-capture rule
```

The engine aggregates validator errors (`validateMove` throws,
`validateMoveQuiet` returns a result). Hosts can register additional
cross-cutting validators via `Game.getValidationEngine()`.

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
The shipped interface is the React web app (`src/ui/web/`), driven by the
`useConfigurableGame` hook over the `Game`'s Observer notifications. The
`GameUI` interface (`src/ui/GameUI.ts`) remains as an extension point for
alternative presentation layers:
```typescript
interface GameUI {
  render(board: Board): void;
  getMove(): Promise<Move>;
  showMessage(message: string): void;
  onGameEnd(winner: Player | null): void;
  highlightMoves(moves: Move[]): void;
  clearHighlights(): void;
  showError(error: string): void;
  updateCurrentPlayer(player: Player): void;
  // optional: highlightPosition, showMoveHistory, initialize, destroy
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
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
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
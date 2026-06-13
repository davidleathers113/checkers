# Extensible Checkers Game

A highly extensible checkers game implementation in TypeScript, designed with clean architecture principles and design patterns to support custom game rules and variations.

## Features

- **Play together or vs the computer**: two-player on one device, or an AI opponent with Easy / Medium / Hard difficulty
- **Rule variants**: Standard, International Draughts (10×10, flying kings), Crazy Checkers, and **Jump Your Own Man** (hop over your own pieces)
- **Built to teach**: forced-capture highlights, a Hint button, and a friendly How-to-Play guide tailored to the chosen rules
- **Extensible Rule System**: implement `RuleEngine` to add your own variations
- **Clean Architecture**: separation of concerns with well-defined interfaces
- **Design Patterns**: Strategy (rules), Observer (UI updates), and Command (undo/redo)
- **Immutable State**: all game state changes create new instances
- **Type Safety**: full TypeScript with strict typing
- **Web UI**: React interface, with a `GameUI` extension point for other presentation layers
- **Comprehensive Testing**: unit, integration, and E2E tests (Jest + Playwright)

## Play & Learn

Run `npm run dev` and open the app. Use ⚙️ Settings to pick a rule set, switch
between **Two Players** and **vs Computer** (with difficulty), and choose a
theme. The ❓ button explains how to play. To run it on a tablet or deploy it to
a URL, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Quick Start

```bash
# Install dependencies
npm install

# Build the project (Node library build)
npm run build

# Build the web app
npm run build:web

# Run the web app (Vite dev server)
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
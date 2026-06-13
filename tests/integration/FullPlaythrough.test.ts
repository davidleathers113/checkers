import { Game } from '../../src/core/Game';
import { RuleEngine } from '../../src/rules/RuleEngine';
import { StandardRules } from '../../src/rules/StandardRules';
import { JumpOwnRules } from '../../src/rules/JumpOwnRules';
import { Player } from '../../src/types';
import { InternationalDraughtsRules } from '../../examples/InternationalDraughts';
import { CrazyCheckersRules } from '../../examples/CrazyCheckers';

/** Deterministic LCG so games are reproducible. */
function makeRng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface PlayResult {
  plies: number;
  endedByGameOver: boolean;
  winner: Player | null;
  redCount: number;
  blackCount: number;
}

/**
 * Plays a complete game with a seeded pseudo-random policy until the game is
 * over or limits are hit. Asserts, every ply, that the game stays internally
 * consistent — the key invariant being: if the player to move has no legal
 * move, the game MUST report itself as over.
 */
function playGame(engine: RuleEngine, seed: number, maxPlies = 400, drawAfterQuietPlies = 80): PlayResult {
  const rng = makeRng(seed);
  const game = new Game({ ruleEngine: engine });

  let plies = 0;
  let quiet = 0;

  while (!game.isGameOver() && plies < maxPlies) {
    const moves = game.getAllPossibleMoves();

    // Core invariant: a player with no moves means the game is over.
    if (moves.length === 0) {
      expect(game.isGameOver()).toBe(true);
      break;
    }

    const totalBefore =
      game.getBoard().getPieceCount(Player.RED) + game.getBoard().getPieceCount(Player.BLACK);

    const move = moves[Math.floor(rng() * moves.length)]!;
    // Every generated move must be applicable (generation/validation agree).
    expect(() => game.makeMove(move)).not.toThrow();

    const totalAfter =
      game.getBoard().getPieceCount(Player.RED) + game.getBoard().getPieceCount(Player.BLACK);
    quiet = totalAfter < totalBefore ? 0 : quiet + 1;
    plies++;

    if (quiet > drawAfterQuietPlies) break; // avoid endless king shuffling
  }

  return {
    plies,
    endedByGameOver: game.isGameOver(),
    winner: game.getWinner(),
    redCount: game.getBoard().getPieceCount(Player.RED),
    blackCount: game.getBoard().getPieceCount(Player.BLACK),
  };
}

const ENGINES: { name: string; make: () => RuleEngine }[] = [
  { name: 'Standard', make: () => new StandardRules(8) },
  { name: 'Jump Your Own Man', make: () => new JumpOwnRules(8) },
  { name: 'International Draughts', make: () => new InternationalDraughtsRules(10) },
  { name: 'Crazy Checkers', make: () => new CrazyCheckersRules(8) },
];

describe('Full playthrough', () => {
  for (const { name, make } of ENGINES) {
    describe(name, () => {
      it('plays many complete games without crashing or getting stuck', () => {
        let decisive = 0;
        for (let seed = 1; seed <= 8; seed++) {
          const result = playGame(make(), seed);
          // The game never gets stuck: it either reported game-over or we hit a
          // benign limit (long quiet game), with no exception thrown.
          if (result.endedByGameOver) {
            decisive++;
            // A reported game-over must be backed by the real position: either a
            // side is eliminated, or the loser genuinely has no move.
            const eliminated = result.redCount === 0 || result.blackCount === 0;
            if (eliminated) {
              const winner = result.redCount === 0 ? Player.BLACK : Player.RED;
              expect(result.winner).toBe(winner);
            }
          }
        }
        // At least some games should reach a real conclusion (not all time out).
        expect(decisive).toBeGreaterThan(0);
      });
    });
  }
});

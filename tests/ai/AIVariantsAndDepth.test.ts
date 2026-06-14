import { MinimaxAI, DEPTH_BY_DIFFICULTY } from '../../src/ai/MinimaxAI';
import { opponentOf } from '../../src/ai/Evaluation';
import { Move } from '../../src/core/Move';
import { RuleEngine } from '../../src/rules/RuleEngine';
import { StandardRules } from '../../src/rules/StandardRules';
import { JumpOwnRules } from '../../src/rules/JumpOwnRules';
import { InternationalDraughtsRules } from '../../examples/InternationalDraughts';
import { CrazyCheckersRules } from '../../examples/CrazyCheckers';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;
// Deterministic RNG: avoids the easy-mode random branch and fixes the jitter,
// so every assertion below is reproducible.
const fixedRng = (): number => 0.99;

describe('AI — variant coverage', () => {
  // Every variant the web app can launch, with the board size it ships with.
  const variants: Array<[string, RuleEngine]> = [
    ['Standard', new StandardRules(8)],
    ['Jump Your Own Man', new JumpOwnRules(8)],
    ['Crazy Checkers', new CrazyCheckersRules(8)],
    ['International Draughts', new InternationalDraughtsRules(10)],
  ];

  it.each(variants)('plays a legal opening move in %s', (_name, rules) => {
    const board = rules.getInitialBoard();
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });

    const move = ai.chooseMove(board, RED, rules);

    expect(move).not.toBeNull();
    const legal = rules.getAllPossibleMoves(board, RED);
    expect(legal.some(m => m.equals(move!))).toBe(true);
  });

  it.each(variants)('plays a full legal self-play game in %s without crashing', (_name, rules) => {
    const ai = new MinimaxAI({ difficulty: 'easy', rng: fixedRng });
    let board = rules.getInitialBoard();
    let player = RED;

    for (let ply = 0; ply < 40; ply++) {
      if (board.getPieceCount(player) === 0) break;
      const legal = rules.getAllPossibleMoves(board, player);
      if (legal.length === 0) break;
      const move = ai.chooseMove(board, player, rules);
      expect(move).not.toBeNull();
      // The chosen move must always be one the rules actually permit.
      expect(legal.some((m: Move) => m.equals(move!))).toBe(true);
      board = move!.apply(board);
      player = opponentOf(player);
    }
  });
});

describe('AI — difficulty scales search depth', () => {
  it('maps difficulty to strictly increasing search depth', () => {
    expect(DEPTH_BY_DIFFICULTY.easy).toBeLessThan(DEPTH_BY_DIFFICULTY.medium);
    expect(DEPTH_BY_DIFFICULTY.medium).toBeLessThan(DEPTH_BY_DIFFICULTY.hard);
  });

  it('honours an explicit maxDepth override', () => {
    const rules = new StandardRules(8);
    const ai = new MinimaxAI({ maxDepth: 2, rng: fixedRng });
    const board = rules.getInitialBoard();
    const move = ai.chooseMove(board, RED, rules);
    expect(move).not.toBeNull();
    expect(rules.getAllPossibleMoves(board, RED).some(m => m.equals(move!))).toBe(true);
  });

  it('the deeper player is never out-materialed by the shallow one (medium vs easy)', () => {
    // A deterministic head-to-head: a 4-ply searcher (RED) against a 1-ply
    // greedy searcher (BLACK). With a sound engine, looking further ahead must
    // not leave RED behind on material.
    const rules = new StandardRules(8);
    const mediumRed = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    const easyBlack = new MinimaxAI({ difficulty: 'easy', rng: fixedRng });

    let board = rules.getInitialBoard();
    let player = RED;
    for (let ply = 0; ply < 60; ply++) {
      if (board.getPieceCount(player) === 0) break;
      if (rules.getAllPossibleMoves(board, player).length === 0) break;
      const ai = player === RED ? mediumRed : easyBlack;
      const move = ai.chooseMove(board, player, rules);
      if (!move) break;
      board = move.apply(board);
      player = opponentOf(player);
    }

    expect(board.getPieceCount(RED)).toBeGreaterThanOrEqual(board.getPieceCount(BLACK));
  });
});

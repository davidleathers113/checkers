import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { RuleEngine } from '../rules/RuleEngine';
import { evaluateBoard, opponentOf } from './Evaluation';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Search depth (plies) per difficulty. */
export const DEPTH_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 1,
  medium: 4,
  hard: 6,
};

/** Chance the easy AI plays a random legal move instead of searching. */
const EASY_RANDOM_CHANCE = 0.4;

/** Score magnitude for a decisive (win/loss) position. */
const WIN_SCORE = 1_000_000;

export interface AIOptions {
  difficulty?: Difficulty;
  /** Overrides the difficulty's default search depth. */
  maxDepth?: number;
  /** Injectable RNG (defaults to Math.random) for deterministic tests. */
  rng?: () => number;
  /** Safety cap on nodes searched per move. */
  nodeBudget?: number;
}

/**
 * A rule-engine-agnostic checkers AI using negamax with alpha-beta pruning.
 *
 * It searches purely through the RuleEngine (`getAllPossibleMoves`) and
 * immutable `Move.apply`, so it works with any variant — Standard, Crazy,
 * International, or Jump Your Own Man — without modification. Terminal states
 * are detected directly from piece counts and move availability rather than
 * `RuleEngine.isGameOver`, which infers the side-to-move heuristically and is
 * unreliable inside a search.
 */
export class MinimaxAI {
  private readonly difficulty: Difficulty;
  private readonly depth: number;
  private readonly rng: () => number;
  private readonly nodeBudget: number;
  private nodes = 0;

  constructor(options: AIOptions = {}) {
    this.difficulty = options.difficulty ?? 'medium';
    this.depth = options.maxDepth ?? DEPTH_BY_DIFFICULTY[this.difficulty];
    this.rng = options.rng ?? Math.random;
    this.nodeBudget = options.nodeBudget ?? 300_000;
  }

  /**
   * Chooses a move for `player`, or null if there are no legal moves.
   */
  chooseMove(board: Board, player: Player, rules: RuleEngine): Move | null {
    const moves = rules.getAllPossibleMoves(board, player);
    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0]!;

    // Easy mode occasionally plays a random move so beginners can win.
    if (this.difficulty === 'easy' && this.rng() < EASY_RANDOM_CHANCE) {
      return moves[Math.floor(this.rng() * moves.length)] ?? moves[0]!;
    }

    this.nodes = 0;
    const ordered = this.orderMoves(moves);
    let bestMove = ordered[0]!;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const move of ordered) {
      const score =
        -this.negamax(move.apply(board), opponentOf(player), this.depth - 1, -beta, -alpha, rules) +
        this.jitter();
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (score > alpha) alpha = score;
    }
    return bestMove;
  }

  private negamax(
    board: Board,
    player: Player,
    depth: number,
    alpha: number,
    beta: number,
    rules: RuleEngine
  ): number {
    this.nodes++;
    const ply = this.depth - depth;

    // Win/loss by elimination — cheap O(1) checks at every node.
    if (board.getPieceCount(player) === 0) return -WIN_SCORE + ply;
    if (board.getPieceCount(opponentOf(player)) === 0) return WIN_SCORE - ply;

    if (depth <= 0 || this.nodes > this.nodeBudget) {
      return evaluateBoard(board, player);
    }

    const moves = rules.getAllPossibleMoves(board, player);
    if (moves.length === 0) {
      // No legal moves: the side to move loses (checkers stalemate rule).
      return -WIN_SCORE + ply;
    }

    let best = -Infinity;
    for (const move of this.orderMoves(moves)) {
      const score = -this.negamax(move.apply(board), opponentOf(player), depth - 1, -beta, -alpha, rules);
      if (score > best) best = score;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break; // alpha-beta cutoff
    }
    return best;
  }

  /** Orders moves with bigger captures first to improve alpha-beta pruning. */
  private orderMoves(moves: Move[]): Move[] {
    return [...moves].sort((a, b) => b.getCaptureCount() - a.getCaptureCount());
  }

  /** Tiny random tie-breaker so equally-good positions vary between games. */
  private jitter(): number {
    return (this.rng() - 0.5) * 0.01;
  }
}

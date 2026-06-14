import { CustomRulesBase } from '../../src/rules/CustomRulesBase';
import { StandardRules } from '../../src/rules/StandardRules';
import { Board } from '../../src/core/Board';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

/** Pure pass-through subclass: every method should defer to StandardRules. */
class PassthroughRules extends CustomRulesBase {}

/** Subclass exposing the protected helpers for testing. */
class HelperRules extends CustomRulesBase {
  publicCaptures(board: Board, player: Player): Move[] {
    return this.getAllCaptureMoves(board, player);
  }
  publicRegular(board: Board, player: Player): Move[] {
    return this.getAllRegularMoves(board, player);
  }
  publicCounts(board: Board, player: Player): { regular: number; kings: number } {
    return this.countPiecesByType(board, player);
  }
}

describe('CustomRulesBase', () => {
  const rules = new PassthroughRules();
  const standard = new StandardRules();

  it('delegates board setup and validation to StandardRules', () => {
    const initial = rules.getInitialBoard();
    expect(initial.getPieceCount(Player.RED)).toBe(12);
    expect(initial.getPieceCount(Player.BLACK)).toBe(12);
    expect(rules.isValidBoardState(initial)).toBe(true);
    expect(rules.isGameOver(initial)).toBe(false);
    expect(rules.getWinner(initial)).toBe(null);
  });

  it('delegates move generation, validation, mandatory moves, and promotion', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(Player.RED))
      .setPiece(new Position(4, 4), new RegularPiece(Player.BLACK));

    const capture = new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]);
    expect(rules.validateMove(board, capture)).toBe(standard.validateMove(board, capture));
    expect(rules.getPossibleMoves(board, new Position(3, 3))).toHaveLength(
      standard.getPossibleMoves(board, new Position(3, 3)).length
    );
    expect(rules.getAllPossibleMoves(board, Player.RED).length).toBe(
      standard.getAllPossibleMoves(board, Player.RED).length
    );
    expect(rules.getMandatoryMoves(board, Player.RED).length).toBe(
      standard.getMandatoryMoves(board, Player.RED).length
    );
    expect(rules.shouldPromote(new Position(0, 1), new RegularPiece(Player.RED))).toBe(true);
  });

  it('exposes helpers for captures, regular moves, and piece counts', () => {
    const helper = new HelperRules();
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(Player.RED))
      .setPiece(new Position(2, 4), new RegularPiece(Player.BLACK)) // forward (NE) capture for RED
      .setPiece(new Position(6, 6), new KingPiece(Player.RED));

    expect(helper.publicCaptures(board, Player.RED).length).toBeGreaterThan(0);
    expect(helper.publicRegular(board, Player.RED).length).toBeGreaterThan(0);
    expect(helper.publicCounts(board, Player.RED)).toEqual({ regular: 1, kings: 1 });
  });
});

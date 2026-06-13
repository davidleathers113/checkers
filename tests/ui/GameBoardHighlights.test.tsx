import { render } from '@testing-library/react';
import { GameBoard } from '../../src/ui/web/components/GameBoard';
import { Board } from '../../src/core/Board';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

const emptyAnimation = {
  movingPieces: new Map(),
  capturedPieces: new Set<string>(),
  promotedPieces: new Set<string>(),
};

describe('GameBoard teaching highlights', () => {
  it('marks mandatory-capture source squares with the must-move class', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(Player.RED));
    const { getByTestId } = render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={emptyAnimation}
        onSquareClick={() => undefined}
        showMoveHints={true}
        mandatorySources={new Set([new Position(5, 2).hash()])}
        hintMove={null}
      />
    );
    expect(getByTestId('game-square-5-2')).toHaveClass('must-move');
  });

  it('does not show must-move highlights when move hints are off', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(Player.RED));
    const { getByTestId } = render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={emptyAnimation}
        onSquareClick={() => undefined}
        showMoveHints={false}
        mandatorySources={new Set([new Position(5, 2).hash()])}
        hintMove={null}
      />
    );
    expect(getByTestId('game-square-5-2')).not.toHaveClass('must-move');
  });

  it('highlights both ends of a suggested hint move', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(Player.RED));
    const hint = new Move(new Position(5, 2), new Position(4, 1));
    const { getByTestId } = render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={emptyAnimation}
        onSquareClick={() => undefined}
        showMoveHints={true}
        mandatorySources={new Set()}
        hintMove={hint}
      />
    );
    expect(getByTestId('game-square-5-2')).toHaveClass('hint-from');
    expect(getByTestId('game-square-4-1')).toHaveClass('hint-to');
  });
});

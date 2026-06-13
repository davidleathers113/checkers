import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../../src/ui/web/components/GameBoard';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

const emptyAnimation = {
  movingPieces: new Map(),
  capturedPieces: new Set<string>(),
  promotedPieces: new Set<string>(),
};

/**
 * Renders the controlled board and returns the grid element plus the
 * onSquareClick spy. The board carries a single red piece so the grid is
 * non-trivial; the keyboard cursor logic is independent of piece placement.
 */
function renderBoard(): { grid: HTMLElement; onSquareClick: jest.Mock } {
  const board = new Board(8).setPiece(new Position(5, 0), new RegularPiece(Player.RED));
  const onSquareClick = jest.fn();
  const { getByTestId } = render(
    <GameBoard
      board={board}
      selectedPosition={null}
      validMoves={[]}
      animationState={emptyAnimation}
      onSquareClick={onSquareClick}
      showMoveHints={true}
    />
  );
  return { grid: getByTestId('game-board'), onSquareClick };
}

/** The Position passed to the most recent onSquareClick call. */
function lastClicked(onSquareClick: jest.Mock): Position {
  return onSquareClick.mock.calls[onSquareClick.mock.calls.length - 1]![0] as Position;
}

describe('GameBoard keyboard navigation', () => {
  test('the board grid is focusable and labelled', () => {
    const { grid } = renderBoard();
    expect(grid).toHaveAttribute('role', 'grid');
    expect(grid).toHaveAttribute('tabindex', '0');
    expect(grid.getAttribute('aria-label') ?? '').toMatch(/arrow keys/i);
  });

  test('Enter activates the square under the cursor (starts at 0,1)', () => {
    const { grid, onSquareClick } = renderBoard();
    fireEvent.keyDown(grid, { key: 'Enter' });
    expect(onSquareClick).toHaveBeenCalledTimes(1);
    const pos = lastClicked(onSquareClick);
    expect(pos.row).toBe(0);
    expect(pos.col).toBe(1);
  });

  test('Space activates the square under the cursor', () => {
    const { grid, onSquareClick } = renderBoard();
    fireEvent.keyDown(grid, { key: ' ' });
    expect(onSquareClick).toHaveBeenCalledTimes(1);
  });

  test('arrow keys move the cursor before activation', () => {
    const { grid, onSquareClick } = renderBoard();
    fireEvent.keyDown(grid, { key: 'ArrowDown' }); // (0,1) -> (1,1)
    fireEvent.keyDown(grid, { key: 'ArrowRight' }); // (1,1) -> (1,2)
    fireEvent.keyDown(grid, { key: 'Enter' });
    const pos = lastClicked(onSquareClick);
    expect(pos.row).toBe(1);
    expect(pos.col).toBe(2);
  });

  test('ArrowLeft from the starting column moves toward the left edge', () => {
    const { grid, onSquareClick } = renderBoard();
    fireEvent.keyDown(grid, { key: 'ArrowLeft' }); // (0,1) -> (0,0)
    fireEvent.keyDown(grid, { key: 'Enter' });
    const pos = lastClicked(onSquareClick);
    expect(pos.row).toBe(0);
    expect(pos.col).toBe(0);
  });

  test('the cursor clamps at the board edges and never goes out of bounds', () => {
    const { grid, onSquareClick } = renderBoard();
    // Drive hard into the top-left corner, then into the bottom-right corner.
    for (let i = 0; i < 12; i++) {
      fireEvent.keyDown(grid, { key: 'ArrowUp' });
      fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    }
    fireEvent.keyDown(grid, { key: 'Enter' });
    let pos = lastClicked(onSquareClick);
    expect(pos.row).toBe(0);
    expect(pos.col).toBe(0);

    for (let i = 0; i < 12; i++) {
      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      fireEvent.keyDown(grid, { key: 'ArrowRight' });
    }
    fireEvent.keyDown(grid, { key: 'Enter' });
    pos = lastClicked(onSquareClick);
    expect(pos.row).toBe(7);
    expect(pos.col).toBe(7);
  });

  test('non-navigation keys are ignored', () => {
    const { grid, onSquareClick } = renderBoard();
    fireEvent.keyDown(grid, { key: 'a' });
    fireEvent.keyDown(grid, { key: 'Tab' });
    expect(onSquareClick).not.toHaveBeenCalled();
  });
});

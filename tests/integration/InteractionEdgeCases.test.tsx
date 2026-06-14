import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameApp } from '../../src/ui/web/GameApp';

// localStorage is touched by the config context; stub it so each test is clean.
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;

/** All board squares in row-major order; index = row * 8 + col on an 8x8 board. */
function squares(): HTMLElement[] {
  return screen.getAllByRole('gridcell').filter(el => el.className.includes('game-square'));
}
const at = (row: number, col: number): HTMLElement => squares()[row * 8 + col]!;

describe('Interaction edge cases', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
  });

  async function ready(): Promise<void> {
    render(<GameApp />);
    await waitFor(() => expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument());
  }

  test('clicking another of your own pieces switches the selection', async () => {
    await ready();
    // Red plays first; its men are on rows 5-7.
    fireEvent.click(at(5, 0));
    await waitFor(() => expect(at(5, 0)).toHaveClass('selected'));

    fireEvent.click(at(5, 2));
    await waitFor(() => {
      expect(at(5, 2)).toHaveClass('selected');
      expect(at(5, 0)).not.toHaveClass('selected');
    });
  });

  test('re-clicking the selected piece keeps it selected', async () => {
    await ready();
    fireEvent.click(at(5, 0));
    await waitFor(() => expect(at(5, 0)).toHaveClass('selected'));

    fireEvent.click(at(5, 0));
    await waitFor(() => expect(at(5, 0)).toHaveClass('selected'));
    // No move happened: the piece is still on its home square.
    expect(at(5, 0).querySelector('.game-piece.red')).toBeInTheDocument();
  });

  test('clicking an invalid target deselects without reporting an error', async () => {
    await ready();
    fireEvent.click(at(5, 0));
    await waitFor(() => expect(at(5, 0)).toHaveClass('selected'));

    // (3,3) is empty and not a legal destination for the selected piece.
    fireEvent.click(at(3, 3));
    await waitFor(() => expect(at(5, 0)).not.toHaveClass('selected'));

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    // The piece never moved.
    expect(at(5, 0).querySelector('.game-piece.red')).toBeInTheDocument();
    // Turn did not pass.
    expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
  });

  test('clicking an opponent piece on your turn does nothing', async () => {
    await ready();
    // Black men are on rows 0-2; it is Red's turn.
    fireEvent.click(at(2, 1));
    // Nothing should be selected, and the turn stays with Red.
    expect(at(2, 1)).not.toHaveClass('selected');
    expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
  });

  test('clicking an empty square with nothing selected is a no-op', async () => {
    await ready();
    fireEvent.click(at(4, 1)); // empty middle square
    expect(at(4, 1)).not.toHaveClass('selected');
    expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
  });
});

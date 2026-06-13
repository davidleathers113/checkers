import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameApp } from '../../src/ui/web/GameApp';

type WithFromPoint = { elementFromPoint?: (x: number, y: number) => Element | null };

/** Dispatch a window-level pointer event with coordinates (jsdom has no layout,
 *  so the board's elementFromPoint lookups are mocked in the test). */
function emitWindow(type: string, x: number, y: number): void {
  const ev = new Event(type, { bubbles: true });
  Object.assign(ev, { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', button: 0 });
  act(() => {
    window.dispatchEvent(ev);
  });
}

function mockDropPoint(el: Element | null): void {
  (document as unknown as WithFromPoint).elementFromPoint = (): Element | null => el;
}

describe('drag and drop', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    delete (document as unknown as WithFromPoint).elementFromPoint;
    localStorage.clear();
  });

  it('moves a piece when it is dragged onto a valid square', () => {
    render(<GameApp />);
    const source = screen.getByTestId('game-square-5-0');
    const target = screen.getByTestId('game-square-4-1');
    mockDropPoint(target);

    fireEvent.pointerDown(source, { clientX: 10, clientY: 10, button: 0, pointerType: 'mouse' });
    emitWindow('pointermove', 40, 40);   // crosses the drag threshold → selects + lifts
    emitWindow('pointermove', 120, 120); // keep dragging
    emitWindow('pointerup', 120, 120);   // drop on the target

    expect(document.querySelector('[data-testid="game-square-4-1"] .game-piece.red')).not.toBeNull();
    expect(document.querySelector('[data-testid="game-square-5-0"] .game-piece')).toBeNull();
  });

  it('does not move when released off any valid square', () => {
    render(<GameApp />);
    const source = screen.getByTestId('game-square-5-0');
    mockDropPoint(null);

    fireEvent.pointerDown(source, { clientX: 10, clientY: 10, button: 0, pointerType: 'mouse' });
    emitWindow('pointermove', 60, 60);
    emitWindow('pointerup', 300, 300);

    expect(document.querySelector('[data-testid="game-square-5-0"] .game-piece.red')).not.toBeNull();
    expect(screen.getByText('Move 1')).toBeInTheDocument();
  });
});

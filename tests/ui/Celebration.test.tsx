import { render, screen } from '@testing-library/react';
import { GameStatus } from '../../src/ui/web/components/GameStatus';
import { Confetti } from '../../src/ui/web/components/Confetti';
import { Player } from '../../src/types';

describe('Win celebration', () => {
  it('shows a crowned winner message on game over', () => {
    render(<GameStatus currentPlayer={Player.RED} gameOver={true} winner={Player.RED} moveCount={20} />);
    const msg = screen.getByTestId('game-over-message');
    expect(msg).toHaveTextContent('Red wins!');
    expect(msg).toHaveClass('winner-red');
    expect(msg.querySelector('.crown')).not.toBeNull();
  });

  it('shows a draw message when there is no winner', () => {
    render(<GameStatus currentPlayer={Player.BLACK} gameOver={true} winner={null} moveCount={40} />);
    expect(screen.getByTestId('game-over-message')).toHaveTextContent('It\'s a draw!');
  });

  it('renders the current turn (not a game-over message) during play', () => {
    render(<GameStatus currentPlayer={Player.BLACK} gameOver={false} winner={null} moveCount={3} />);
    expect(screen.getByTestId('current-player')).toHaveTextContent('Current Turn: Black');
    expect(screen.queryByTestId('game-over-message')).not.toBeInTheDocument();
  });

  it('Confetti renders the requested number of pieces', () => {
    const { container } = render(<Confetti count={30} />);
    expect(container.querySelectorAll('.confetti-bit')).toHaveLength(30);
  });
});

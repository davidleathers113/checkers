import React from 'react';
import { Player } from '../../../types';

interface GameStatusProps {
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  moveCount: number;
}

export function GameStatus({ 
  currentPlayer, 
  gameOver, 
  winner, 
  moveCount 
}: GameStatusProps): React.JSX.Element {
  const playerName = (player: Player): string => player === Player.RED ? 'Red' : 'Black';
  const playerColorOf = (player: Player): string => (player === Player.RED ? 'red' : 'black');
  const playerColorClass = playerColorOf(currentPlayer);
  
  return (
    <div className="game-status" data-testid="game-status">
      {gameOver ? (
        <div
          className={`game-over ${winner ? `winner-${playerColorOf(winner)}` : 'draw'}`}
          data-testid="game-over-message"
        >
          {winner ? (
            <>
              <span className="crown" aria-hidden="true">👑</span>
              {playerName(winner)} wins!
            </>
          ) : (
            'It\'s a draw!'
          )}
        </div>
      ) : (
        <>
          <div
            key={currentPlayer}
            className={`current-player ${playerColorClass}`}
            data-testid="current-player"
          >
            Current Turn: {playerName(currentPlayer)}
          </div>
          <div className="move-count" data-testid="move-count">Move {moveCount + 1}</div>
        </>
      )}
    </div>
  );
}
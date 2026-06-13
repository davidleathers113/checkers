import React from 'react';
import { Piece } from '../../../pieces/Piece';
import { Position } from '../../../core/Position';
import { Player } from '../../../types';

interface GamePieceProps {
  piece: Piece;
  position: Position;
  isMoving?: boolean;
  isCaptured?: boolean;
  isPromoted?: boolean;
  /** Cell offset (origin − destination) used to animate a glide into place. */
  moveDelta?: { dx: number; dy: number };
}

export function GamePiece({
  piece,
  position,
  isMoving,
  isCaptured,
  isPromoted,
  moveDelta
}: GamePieceProps): React.JSX.Element {
  const playerClass = piece.player === Player.RED ? 'red' : 'black';
  const kingClass = piece.isKing() ? 'king' : '';

  let animationClass = '';
  if (isCaptured) animationClass = 'capturing';
  else if (isMoving) animationClass = 'moving';
  else if (isPromoted) animationClass = 'promoting';

  const playerName = piece.player === Player.RED ? 'red' : 'black';

  const style =
    isMoving && moveDelta
      ? ({ '--dx': moveDelta.dx, '--dy': moveDelta.dy } as React.CSSProperties)
      : undefined;

  return (
    <div
      className={`game-piece ${playerClass} ${kingClass} ${animationClass}`.trim()}
      data-testid={`game-piece-${playerName}-${position.row}-${position.col}`}
      style={style}
      role="img"
      aria-label={`${playerName} ${piece.isKing() ? 'king' : 'piece'}`}
    >
      {piece.isKing() && (
        <span className="piece-crown" aria-hidden="true">♛</span>
      )}
    </div>
  );
}

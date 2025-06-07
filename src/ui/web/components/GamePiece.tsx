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
}

export function GamePiece({ piece, position, isMoving, isCaptured, isPromoted }: GamePieceProps): React.JSX.Element {
  const playerClass = piece.player === Player.RED ? 'red' : 'black';
  const kingClass = piece.isKing() ? 'king' : '';
  const symbol = piece.isKing() ? '♛' : '●';
  
  let animationClass = '';
  if (isCaptured) animationClass = 'capturing';
  else if (isMoving) animationClass = 'moving';
  else if (isPromoted) animationClass = 'promoting';
  
  const playerName = piece.player === Player.RED ? 'red' : 'black';
  
  return (
    <div 
      className={`game-piece ${playerClass} ${kingClass} ${animationClass}`}
      data-testid={`game-piece-${playerName}-${position.row}-${position.col}`}
    >
      {symbol}
    </div>
  );
}
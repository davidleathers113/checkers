import React from 'react';
import { Piece } from '../../../pieces/Piece';
import { Player } from '../../../types';

interface GamePieceProps {
  piece: Piece;
  isMoving?: boolean;
  isCaptured?: boolean;
  isPromoted?: boolean;
}

export function GamePiece({ piece, isMoving, isCaptured, isPromoted }: GamePieceProps): React.JSX.Element {
  const playerClass = piece.player === Player.RED ? 'red' : 'black';
  const kingClass = piece.isKing() ? 'king' : '';
  const symbol = piece.isKing() ? '♛' : '●';
  
  let animationClass = '';
  if (isCaptured) animationClass = 'capturing';
  else if (isMoving) animationClass = 'moving';
  else if (isPromoted) animationClass = 'promoting';
  
  return (
    <div className={`game-piece ${playerClass} ${kingClass} ${animationClass}`}>
      {symbol}
    </div>
  );
}
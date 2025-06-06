import React from 'react';
import { Piece } from '../../../pieces/Piece';
import { Player } from '../../../types';

interface GamePieceProps {
  piece: Piece;
}

export function GamePiece({ piece }: GamePieceProps) {
  const playerClass = piece.player === Player.RED ? 'red' : 'black';
  const kingClass = piece.isKing() ? 'king' : '';
  const symbol = piece.isKing() ? '♛' : '●';
  
  return (
    <div className={`game-piece ${playerClass} ${kingClass}`}>
      {symbol}
    </div>
  );
}
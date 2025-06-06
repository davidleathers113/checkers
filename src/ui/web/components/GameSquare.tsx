import React from 'react';
import { Position } from '../../../core/Position';
import { Piece } from '../../../pieces/Piece';
import { GamePiece } from './GamePiece';

interface GameSquareProps {
  position: Position;
  piece: Piece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isMoving: boolean;
  isCaptured: boolean;
  isPromoted: boolean;
  onClick: () => void;
}

export function GameSquare({ 
  position, 
  piece, 
  isSelected, 
  isValidMove, 
  isMoving,
  isCaptured,
  isPromoted,
  onClick 
}: GameSquareProps): React.JSX.Element {
  const isDark = position.isDarkSquare();
  
  let className = `game-square ${isDark ? 'dark' : 'light'}`;
  if (isSelected) className += ' selected';
  if (isValidMove) className += ' valid-move';

  return (
    <div className={className} onClick={onClick}>
      {piece && (
        <GamePiece 
          piece={piece} 
          isMoving={isMoving}
          isCaptured={isCaptured}
          isPromoted={isPromoted}
        />
      )}
    </div>
  );
}
import React from 'react';
import { Board } from '../../../core/Board';
import { Position } from '../../../core/Position';
import { Move } from '../../../core/Move';
import { GameSquare } from './GameSquare';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}

interface GameBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Move[];
  animationState: AnimationState;
  onSquareClick: (position: Position) => void;
  showMoveHints: boolean;
}

export function GameBoard({ 
  board, 
  selectedPosition, 
  validMoves, 
  animationState,
  onSquareClick,
  showMoveHints
}: GameBoardProps): React.JSX.Element {
  const squares = [];
  
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const position = new Position(row, col);
      const piece = board.getPiece(position);
      const isSelected = selectedPosition?.equals(position) ?? false;
      const isValidMove = showMoveHints && validMoves.some(move => move.to.equals(position));
      const posKey = position.hash();
      
      const isMoving = animationState.movingPieces.has(posKey);
      const isCaptured = animationState.capturedPieces.has(posKey);
      const isPromoted = animationState.promotedPieces.has(posKey);
      
      squares.push(
        <GameSquare
          key={`${row}-${col}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
          isValidMove={isValidMove}
          isMoving={isMoving}
          isCaptured={isCaptured}
          isPromoted={isPromoted}
          onClick={() => onSquareClick(position)}
        />
      );
    }
  }

  const boardStyle = {
    gridTemplateColumns: `repeat(${board.size}, 1fr)`,
    gridTemplateRows: `repeat(${board.size}, 1fr)`
  };

  return (
    <div className="game-board" data-testid="game-board" style={boardStyle}>
      {squares}
    </div>
  );
}
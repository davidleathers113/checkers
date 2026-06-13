import React, { useEffect, useRef, useState } from 'react';
import { Board } from '../../../core/Board';
import { Position } from '../../../core/Position';
import { Move } from '../../../core/Move';
import { Piece } from '../../../pieces/Piece';
import { Player } from '../../../types';
import { GameSquare } from './GameSquare';
import { playPickup } from '../sound';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}

type MoveTargetType = 'slide' | 'capture' | 'hop';

interface GameBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Move[];
  animationState: AnimationState;
  onSquareClick: (position: Position) => void;
  onDragMove?: (from: Position, to: Position) => void;
  currentPlayer?: Player;
  locked?: boolean;
  showMoveHints: boolean;
  mandatorySources?: Set<string>;
  hintMove?: Move | null;
}

function classifyMove(move: Move, board: Board): MoveTargetType {
  if (move.isCapture()) return 'capture';
  if (move.getDistance() >= 2) {
    const between = move.from.getPositionsBetween(move.to);
    if (between.some(pos => !board.isEmpty(pos))) return 'hop';
  }
  return 'slide';
}

/** Resolve the board square under a viewport point, if any. */
function squareAt(x: number, y: number): Position | null {
  const el = document.elementFromPoint(x, y);
  const square = el?.closest('[data-testid^="game-square-"]');
  const id = square?.getAttribute('data-testid');
  if (!id) return null;
  const [, , r, c] = id.split('-');
  const row = Number(r);
  const col = Number(c);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return new Position(row, col);
}

const DRAG_THRESHOLD = 6;

interface DragVisual {
  color: 'red' | 'black';
  king: boolean;
  size: number;
}

export function GameBoard({
  board,
  selectedPosition,
  validMoves,
  animationState,
  onSquareClick,
  onDragMove = (): void => undefined,
  currentPlayer = Player.RED,
  locked = false,
  showMoveHints,
  mandatorySources,
  hintMove
}: GameBoardProps): React.JSX.Element {
  const [dragVisual, setDragVisual] = useState<DragVisual | null>(null);
  const [hoverTarget, setHoverTarget] = useState<Position | null>(null);

  const ghostRef = useRef<HTMLDivElement>(null);
  const justDraggedRef = useRef(false);
  const dragRef = useRef<{
    from: Position;
    startX: number;
    startY: number;
    moved: boolean;
    visual: DragVisual;
  } | null>(null);

  // Latest values for the always-on window listeners (avoids stale closures).
  const validMovesRef = useRef(validMoves);
  validMovesRef.current = validMoves;
  const onSquareClickRef = useRef(onSquareClick);
  onSquareClickRef.current = onSquareClick;
  const onDragMoveRef = useRef(onDragMove);
  onDragMoveRef.current = onDragMove;

  const positionGhost = (x: number, y: number): void => {
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent): void => {
      const drag = dragRef.current;
      if (!drag) return;
      const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (!drag.moved && dist < DRAG_THRESHOLD) return;

      if (!drag.moved) {
        drag.moved = true;
        onSquareClickRef.current(drag.from); // select → reveals valid targets
        setDragVisual(drag.visual); // reveal the lifted ghost
        playPickup();
        const { clientX, clientY } = e;
        requestAnimationFrame(() => positionGhost(clientX, clientY)); // once mounted
      }
      positionGhost(e.clientX, e.clientY);

      const over = squareAt(e.clientX, e.clientY);
      const valid = over ? validMovesRef.current.some(m => m.to.equals(over)) : false;
      setHoverTarget(prev => {
        if (valid && over) return prev && prev.equals(over) ? prev : over;
        return prev ? null : prev;
      });
    };

    const handleUp = (e: PointerEvent): void => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag) return;

      if (drag.moved) {
        const target = squareAt(e.clientX, e.clientY);
        if (target && validMovesRef.current.some(m => m.to.equals(target))) {
          onDragMoveRef.current(drag.from, target);
        }
        justDraggedRef.current = true; // suppress the trailing synthetic click
        window.setTimeout(() => { justDraggedRef.current = false; }, 350);
        setDragVisual(null);
        setHoverTarget(null);
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return (): void => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  const handlePointerDown = (position: Position, piece: Piece | null, e: React.PointerEvent): void => {
    if (locked || !piece || piece.player !== currentPlayer) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const pieceEl = (e.currentTarget as HTMLElement).querySelector('.game-piece');
    const size = pieceEl ? pieceEl.getBoundingClientRect().width : 44;
    dragRef.current = {
      from: position,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      visual: { color: piece.player === Player.RED ? 'red' : 'black', king: piece.isKing(), size }
    };
    // The ghost itself is only revealed once a real drag begins (see handleMove),
    // so a plain tap never flashes one.
  };

  const handleClick = (position: Position): void => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    onSquareClick(position);
  };

  const squares = [];
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const position = new Position(row, col);
      const piece = board.getPiece(position);
      const isSelected = selectedPosition?.equals(position) ?? false;

      const matchingMove = validMoves.find(move => move.to.equals(position));
      const isValidMove = showMoveHints && matchingMove !== undefined;
      const validMoveType = matchingMove ? classifyMove(matchingMove, board) : undefined;

      const posKey = position.hash();
      const movingEntry = animationState.movingPieces.get(posKey);
      const isMoving = movingEntry !== undefined;
      const moveDelta = movingEntry
        ? { dx: movingEntry.from.col - movingEntry.to.col, dy: movingEntry.from.row - movingEntry.to.row }
        : undefined;

      squares.push(
        <GameSquare
          key={`${row}-${col}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
          isValidMove={isValidMove}
          validMoveType={validMoveType}
          isMoving={isMoving}
          moveDelta={moveDelta}
          isCaptured={false}
          isCaptureBurst={animationState.capturedPieces.has(posKey)}
          isPromoted={animationState.promotedPieces.has(posKey)}
          isMustMove={showMoveHints && (mandatorySources?.has(posKey) ?? false)}
          isHintFrom={hintMove?.from.equals(position) ?? false}
          isHintTo={hintMove?.to.equals(position) ?? false}
          isDragSource={dragVisual !== null && (dragRef.current?.from.equals(position) ?? false)}
          isDropHover={hoverTarget?.equals(position) ?? false}
          onClick={() => handleClick(position)}
          onPointerDown={(e) => handlePointerDown(position, piece, e)}
        />
      );
    }
  }

  const boardStyle = {
    gridTemplateColumns: `repeat(${board.size}, 1fr)`,
    gridTemplateRows: `repeat(${board.size}, 1fr)`,
    ['--board-size' as string]: board.size
  } as React.CSSProperties;

  return (
    <div className={`game-board${dragVisual ? ' dragging' : ''}`} data-testid="game-board" style={boardStyle}>
      {squares}
      {dragVisual && (
        <div
          ref={ghostRef}
          className="drag-ghost"
          style={{ width: dragVisual.size, height: dragVisual.size }}
          aria-hidden="true"
        >
          <div className={`game-piece ${dragVisual.color}${dragVisual.king ? ' king' : ''}`}>
            {dragVisual.king && <span className="piece-crown">♛</span>}
          </div>
        </div>
      )}
    </div>
  );
}

import { useSyncExternalStore, useCallback, useRef, useState } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';

interface UIState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
}

interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
}

interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: () => void;
}

interface UseGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}

export function useGame(): UseGameReturn {
  const gameRef = useRef(new Game({ ruleEngine: new StandardRules() }));

  const getSnapshot = useCallback((): CoreGameState => gameRef.current.getGameState(), []);

  const subscribe = useCallback((callback: () => void): (() => void) => {
    const game = gameRef.current;
    
    const observer: Partial<GameObserver> = {
      onMove: callback,
      onGameEnd: callback,
      onTurnChange: callback,
      onInvalidMove: callback,
      onBoardUpdate: callback,
      onPiecePromoted: callback
    };
    
    game.addObserver(observer as GameObserver);
    return () => game.removeObserver(observer as GameObserver);
  }, []);

  const gameState = useSyncExternalStore(subscribe, getSnapshot);
  
  const [uiState, setUiState] = useState<UIState>({
    selectedPosition: null,
    validMoves: [],
    errorMessage: null
  });

  const selectPosition = useCallback((position: Position): void => {
    const game = gameRef.current;
    if (game.isGameOver()) return;

    const piece = game.getBoard().getPiece(position);

    if (piece && piece.player === game.getCurrentPlayer()) {
      const validMoves = game.getPossibleMoves(position);
      setUiState({
        selectedPosition: position,
        validMoves,
        errorMessage: null,
      });
    } else if (uiState.selectedPosition) {
      const move = uiState.validMoves.find(m => m.to.equals(position));
      if (move) {
        try {
          game.makeMove(move);
          setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
        } catch (error) {
          setUiState(prev => ({ 
            ...prev, 
            errorMessage: error instanceof Error ? error.message : String(error) 
          }));
        }
      } else {
        setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
      }
    }
  }, [uiState.selectedPosition, uiState.validMoves]);

  const newGame = useCallback((): void => {
    gameRef.current.reset();
    setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
  }, []);
  
  const undoMove = useCallback((): void => {
    if (gameRef.current.undoMove()) {
      setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
    }
  }, []);
  
  const redoMove = useCallback((): void => {
    // Note: redoMove not yet implemented in Game class
    // if (gameRef.current.redoMove()) {
    //   setUiState({ selectedPosition: null, validMoves: [], errorMessage: null });
    // }
  }, []);

  return {
    gameState: { ...gameState, ...uiState },
    actions: { selectPosition, undoMove, redoMove, newGame },
    canUndo: gameState.moveHistory.length > 0,
    canRedo: false,
  };
}
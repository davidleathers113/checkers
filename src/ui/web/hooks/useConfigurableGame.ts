import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';
import { RuleEngine } from '../../../rules/RuleEngine';
import { useGameConfig } from '../contexts/GameConfigContext';
import { ANIMATION_DURATIONS } from '../types/GameConfig';

// Import custom rule implementations - use relative paths from web directory
import { InternationalDraughtsRules } from '../../../../examples/InternationalDraughts';
import { CrazyCheckersRules } from '../../../../examples/CrazyCheckers';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}


interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}

interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: (boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy') => void;
}

interface UseConfigurableGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}

function createRuleEngine(ruleSet: 'standard' | 'international' | 'crazy', boardSize: 8 | 10 = 8): RuleEngine {
  switch (ruleSet) {
  case 'international':
    return new InternationalDraughtsRules(boardSize);
  case 'crazy':
    return new CrazyCheckersRules(boardSize);
  default:
    return new StandardRules(boardSize);
  }
}

export function useConfigurableGame(): UseConfigurableGameReturn {
  const { config } = useGameConfig();
  const gameRef = useRef<Game>(new Game({ 
    ruleEngine: createRuleEngine(config.ruleSet, config.boardSize)
  }));
  const lastMoveRef = useRef<Move | null>(null);
  const lastPromotedRef = useRef<Position | null>(null);
  
  // Use state for selection to properly trigger re-renders
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState(0); // Track game instance changes
  
  // Cache the game state to avoid infinite loops
  const cachedStateRef = useRef<CoreGameState | null>(null);

  // Update game instance when config changes
  useEffect(() => {
    gameRef.current = new Game({ 
      ruleEngine: createRuleEngine(config.ruleSet, config.boardSize)
    });
    setSelectedPosition(null);
    setValidMoves([]);
    setErrorMessage(null);
    cachedStateRef.current = null;
    setGameVersion(v => v + 1); // Increment version to trigger re-subscribe
  }, [config.ruleSet, config.boardSize]);

  const getSnapshot = useCallback((): CoreGameState => {
    // Return cached state if available
    if (cachedStateRef.current) {
      return cachedStateRef.current;
    }
    
    // Create and cache new state
    const state = gameRef.current.getGameState();
    cachedStateRef.current = state;
    return state;
  }, []);

  const subscribe = useCallback((callback: () => void): (() => void) => {
    const game = gameRef.current;
    
    const observer: Partial<GameObserver> = {
      onMove: (move: Move) => {
        lastMoveRef.current = move;
        cachedStateRef.current = null; // Clear cache
        callback();
      },
      onGameEnd: () => {
        cachedStateRef.current = null; // Clear cache
        callback();
      },
      onTurnChange: () => {
        cachedStateRef.current = null; // Clear cache
        callback();
      },
      onInvalidMove: () => {
        cachedStateRef.current = null; // Clear cache
        callback();
      },
      onBoardUpdate: () => {
        cachedStateRef.current = null; // Clear cache
        callback();
      },
      onPiecePromoted: (position: Position) => {
        lastPromotedRef.current = position;
        cachedStateRef.current = null; // Clear cache
        callback();
      }
    };
    
    game.addObserver(observer as GameObserver);
    return () => game.removeObserver(observer as GameObserver);
  }, [gameVersion]); // Re-subscribe when game version changes

  const gameState = useSyncExternalStore(subscribe, getSnapshot);
  
  const [animationState, setAnimationState] = useState<AnimationState>({
    movingPieces: new Map(),
    capturedPieces: new Set(),
    promotedPieces: new Set()
  });

  // Get animation duration based on config
  const animationDuration = ANIMATION_DURATIONS[config.animationSpeed];

  // Handle move animations
  useEffect(() => {
    if (lastMoveRef.current) {
      const move = lastMoveRef.current;
      const key = move.from.hash();
      
      // Add moving piece
      setAnimationState(prev => ({
        ...prev,
        movingPieces: new Map([[key, { from: move.from, to: move.to }]])
      }));

      // Handle captures
      if (move.captures.length > 0) {
        setTimeout(() => {
          const capturedKeys = move.captures.map(c => c.hash());
          setAnimationState(prev => ({
            ...prev,
            capturedPieces: new Set(capturedKeys)
          }));
        }, animationDuration / 2); // Delay capture animation
      }

      // Clear animations after delay
      setTimeout(() => {
        setAnimationState(prev => ({
          movingPieces: new Map(),
          capturedPieces: new Set(),
          promotedPieces: prev.promotedPieces
        }));
        lastMoveRef.current = null;
      }, animationDuration * 1.5);
    }
  }, [gameState.moveHistory.length, animationDuration]);

  // Handle promotion animations
  useEffect(() => {
    if (lastPromotedRef.current) {
      const pos = lastPromotedRef.current;
      setAnimationState(prev => ({
        ...prev,
        promotedPieces: new Set([...prev.promotedPieces, pos.hash()])
      }));

      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          promotedPieces: new Set()
        }));
        lastPromotedRef.current = null;
      }, animationDuration * 2);
    }
  }, [gameState.board, animationDuration]);

  const selectPosition = useCallback((position: Position): void => {
    const game = gameRef.current;
    if (game.isGameOver()) return;

    const piece = game.getBoard().getPiece(position);

    if (piece && piece.player === game.getCurrentPlayer()) {
      const moves = game.getPossibleMoves(position);
      setSelectedPosition(position);
      setValidMoves(moves);
      setErrorMessage(null);
    } else if (selectedPosition) {
      const move = validMoves.find(m => m.to.equals(position));
      if (move) {
        try {
          game.makeMove(move);
          setSelectedPosition(null);
          setValidMoves([]);
          setErrorMessage(null);
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : String(error));
        }
      } else {
        setSelectedPosition(null);
        setValidMoves([]);
        setErrorMessage(null);
      }
    }
  }, [selectedPosition, validMoves]);

  const newGame = useCallback((boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy'): void => {
    const rules = ruleSet || config.ruleSet;
    const size = boardSize || config.boardSize;
    
    gameRef.current = new Game({ 
      ruleEngine: createRuleEngine(rules, size)
    });
    
    setSelectedPosition(null);
    setValidMoves([]);
    setErrorMessage(null);
    setAnimationState({
      movingPieces: new Map(),
      capturedPieces: new Set(),
      promotedPieces: new Set()
    });
    
    // Force a state update by clearing the cache and incrementing version
    cachedStateRef.current = null;
    setGameVersion(v => v + 1); // Trigger re-subscribe
  }, [config.ruleSet, config.boardSize]);
  
  const undoMove = useCallback((): void => {
    if (gameRef.current.undoMove()) {
      setSelectedPosition(null);
      setValidMoves([]);
      setErrorMessage(null);
    }
  }, []);
  
  const redoMove = useCallback((): void => {
    // Note: redoMove not yet implemented in Game class
  }, []);

  // Combine game state with UI state
  const combinedGameState: CombinedGameState = {
    ...gameState,
    selectedPosition,
    validMoves,
    errorMessage,
    animationState
  };

  return {
    gameState: combinedGameState,
    actions: { selectPosition, undoMove, redoMove, newGame },
    canUndo: gameState.moveHistory.length > 0,
    canRedo: false,
  };
}
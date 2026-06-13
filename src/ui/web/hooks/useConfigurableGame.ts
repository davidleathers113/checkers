import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState, Player } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { JumpOwnRules } from '../../../rules/JumpOwnRules';
import { GameObserver } from '../../../core/GameObserver';
import { RuleEngine } from '../../../rules/RuleEngine';
import { MinimaxAI } from '../../../ai/MinimaxAI';
import { useGameConfig } from '../contexts/GameConfigContext';
import { ANIMATION_DURATIONS, RuleSet, BoardSize, AiSide } from '../types/GameConfig';

/** How long the computer "thinks" before moving, so its move is visible. */
const AI_THINK_DELAY_MS = 450;

function aiPlayerFor(side: AiSide): Player {
  return side === 'red' ? Player.RED : Player.BLACK;
}

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
  newGame: (boardSize?: BoardSize, ruleSet?: RuleSet) => void;
  /** Suggest a strong move for the human to consider (teaching aid). */
  showHint: () => void;
}

interface UseConfigurableGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
  /** True while the computer is choosing its move. */
  isThinking: boolean;
  /** True when the current player has a mandatory capture. */
  mustCapture: boolean;
  /** Source-square hashes of the mandatory captures (for highlighting). */
  mandatorySources: Set<string>;
  /** A suggested move to highlight, or null. */
  hintMove: Move | null;
}

function createRuleEngine(ruleSet: RuleSet, boardSize: BoardSize = 8): RuleEngine {
  switch (ruleSet) {
  case 'international':
    return new InternationalDraughtsRules(boardSize);
  case 'crazy':
    return new CrazyCheckersRules(boardSize);
  case 'jumpOwn':
    return new JumpOwnRules(boardSize);
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

  // Whether the computer is currently choosing a move (mirrored in a ref so
  // event handlers can read it without being re-created).
  const [isThinking, setIsThinking] = useState(false);
  const isThinkingRef = useRef(false);
  const setThinking = useCallback((value: boolean): void => {
    isThinkingRef.current = value;
    setIsThinking(value);
  }, []);

  // A suggested move highlighted by the Hint button (cleared on any change).
  const [hintMove, setHintMove] = useState<Move | null>(null);

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
      // Key by the destination: that is where the moved piece now lives, so the
      // glide animation (origin → destination) is applied to the right square.
      const key = move.to.hash();

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

  // Drive the computer's turn when playing against the AI.
  useEffect(() => {
    if (config.mode !== 'ai' || gameState.isGameOver) {
      return;
    }
    const aiPlayer = aiPlayerFor(config.aiSide);
    if (gameState.currentPlayer !== aiPlayer) {
      return;
    }

    let cancelled = false;
    setThinking(true);

    const timer = setTimeout(() => {
      const game = gameRef.current;
      if (cancelled || game.isGameOver() || game.getCurrentPlayer() !== aiPlayer) {
        setThinking(false);
        return;
      }
      const ai = new MinimaxAI({ difficulty: config.difficulty });
      const move = ai.chooseMove(game.getBoard(), game.getCurrentPlayer(), game.getRuleEngine());
      if (!cancelled && move) {
        try {
          game.makeMove(move);
        } catch {
          /* If the chosen move is somehow rejected, just yield the turn. */
        }
      }
      setThinking(false);
    }, AI_THINK_DELAY_MS);

    return (): void => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    gameState.currentPlayer,
    gameState.isGameOver,
    gameState.moveHistory.length,
    config.mode,
    config.aiSide,
    config.difficulty,
    gameVersion,
    setThinking,
  ]);

  const selectPosition = useCallback((position: Position): void => {
    const game = gameRef.current;
    if (game.isGameOver()) return;

    // Ignore clicks while the computer is thinking or it is the computer's turn.
    if (isThinkingRef.current) return;
    if (config.mode === 'ai' && game.getCurrentPlayer() === aiPlayerFor(config.aiSide)) return;

    setHintMove(null); // any interaction dismisses a hint

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
  }, [selectedPosition, validMoves, config.mode, config.aiSide]);

  const newGame = useCallback((boardSize?: BoardSize, ruleSet?: RuleSet): void => {
    const rules = ruleSet || config.ruleSet;
    const size = boardSize || config.boardSize;
    
    gameRef.current = new Game({ 
      ruleEngine: createRuleEngine(rules, size)
    });
    
    setSelectedPosition(null);
    setValidMoves([]);
    setErrorMessage(null);
    setHintMove(null);
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
    const game = gameRef.current;
    if (game.undoMove()) {
      // Against the computer, undo back to the human's turn so the AI does not
      // immediately replay the move that was just undone.
      if (config.mode === 'ai' && game.getCurrentPlayer() === aiPlayerFor(config.aiSide) && game.canUndo()) {
        game.undoMove();
      }
      setSelectedPosition(null);
      setValidMoves([]);
      setErrorMessage(null);
      setHintMove(null);
    }
  }, [config.mode, config.aiSide]);

  const redoMove = useCallback((): void => {
    if (gameRef.current.redoMove()) {
      setSelectedPosition(null);
      setValidMoves([]);
      setErrorMessage(null);
      setHintMove(null);
    }
  }, []);

  const showHint = useCallback((): void => {
    const game = gameRef.current;
    if (game.isGameOver()) return;
    // Only hint on the human's turn.
    if (config.mode === 'ai' && game.getCurrentPlayer() === aiPlayerFor(config.aiSide)) return;
    const ai = new MinimaxAI({ difficulty: 'medium' });
    const move = ai.chooseMove(game.getBoard(), game.getCurrentPlayer(), game.getRuleEngine());
    setHintMove(move);
  }, [config.mode, config.aiSide]);

  // Combine game state with UI state
  const combinedGameState: CombinedGameState = {
    ...gameState,
    selectedPosition,
    validMoves,
    errorMessage,
    animationState
  };

  // Highlight mandatory captures on the human's turn (a core rule to teach).
  const game = gameRef.current;
  const humanToMove = !game.isGameOver() &&
    !(config.mode === 'ai' && game.getCurrentPlayer() === aiPlayerFor(config.aiSide));
  const mandatoryMoves = humanToMove ? game.getMandatoryMoves() : [];
  const mandatorySources = new Set(mandatoryMoves.map(m => m.from.hash()));

  return {
    gameState: combinedGameState,
    actions: { selectPosition, undoMove, redoMove, newGame, showHint },
    canUndo: gameState.moveHistory.length > 0,
    canRedo: gameRef.current.canRedo(),
    isThinking,
    mustCapture: mandatoryMoves.length > 0,
    mandatorySources,
    hintMove,
  };
}
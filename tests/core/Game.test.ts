// tests/core/Game.test.ts
import { Game } from '../../src/core/Game';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { Player } from '../../src/types';
import { RegularPiece, Piece } from '../../src/pieces'; // Assuming RegularPiece for testing, Piece for typing
// You might need AmericanCheckersRules or a mock RuleEngine depending on Game setup complexity
import { AmericanCheckersRules } from '../../src/rules/AmericanCheckersRules';
import { Board } from '../../src/core/Board'; // Added import for Board
import { GameVariant } from '../../src/types'; // Added import for GameVariant


describe('Game - Captured Pieces Tracking', () => {
  let game: Game;
  let redPiece: RegularPiece;
  let blackPiece: RegularPiece;

  beforeEach(() => {
    // Setup a game with a standard 8x8 board and rules
    // The Game constructor might need a RuleEngine or config
    game = new Game({ ruleEngine: new AmericanCheckersRules() });
    // For simplicity in these test snippets, we'll create dummy pieces.
    // In a real test, these would be part of the initial board setup.
    redPiece = new RegularPiece(Player.RED);
    blackPiece = new RegularPiece(Player.BLACK);
  });

  test('should have no captured pieces initially', () => {
    expect(game.getCapturedPieces()).toEqual([]);
  });

  test('should track a single captured piece', () => {
    // This requires setting up a board state where a capture is possible.
    // For this example, let's assume a simplified scenario:
    // 1. Manually place pieces on the board via game.getBoard().setPiece(...)
    //    or use a predefined board setup if Game allows.
    // 2. Make a capture move.

    // Simplified setup: Red piece at (4,3), Black piece at (3,4) (to be captured), Red moves to (2,5)
    // This is a conceptual setup. Actual setup would involve `game.getBoard().setPiece(...)`
    // and then `game.makeMove(...)`.
    // For the sake of this subtask, we'll focus on the fact that a move occurs
    // and assume MoveCommand correctly identifies 'blackPieceToCapture'.

    // Simulate a board state where blackPiece is at a capturable position
    // const board = game.getBoard()  // This line is not used further, can be removed
    //   .setPiece(new Position(4, 3), new RegularPiece(Player.RED)) // Red mover
    //   .setPiece(new Position(3, 4), blackPiece); // Black piece to be captured

    // Reflect this board in a new Game instance or a direct state manipulation if possible
    // This is tricky without full Game setup. For the subtask, assume 'game' is in a state
    // where 'blackPiece' is on the board at (3,4) and player RED is to move from (4,3) to (2,5).
    // A more robust test would use game.reset() then game.getBoard().setPiece() for setup.

    // Let's assume Game is configured such that RED is current player
    if (game.getCurrentPlayer() === Player.BLACK) { // Switch to RED if needed for the test
         // This is a hack for testing; real turn switching is via moves.
         // Consider a game setup function for tests.
         // Making a valid dummy move to switch players.
         // Need to ensure the move is possible on an empty board or a board setup for it.
         // For simplicity, let's assume an initial board where (0,0) has a BLACK piece if current player is BLACK
         // and it can move to (1,1). This is still a hack.
         // A better way would be to instantiate Game with startingPlayer: Player.RED

         // Simplified: Re-initialize game with RED as starting player for this test case if needed.
         game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    }

    // A simplified board for testing the capture mechanism
    let testBoard = new Board(8);
    const redMover = new RegularPiece(Player.RED);
    const blackToCapture = new RegularPiece(Player.BLACK); // This is the piece instance we want to track
    testBoard = testBoard.setPiece(new Position(4,3), redMover);
    testBoard = testBoard.setPiece(new Position(3,4), blackToCapture);

    // Create a new game instance with this specific board for RED's turn
    // or set the board on the existing game instance.
    game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    // Manually set the board for this test case
    (game as any).board = testBoard; // Unsafe, but for subtask focusing on captured pieces logic

    const captureMove = new Move(new Position(4, 3), new Position(2, 5), [new Position(3, 4)]);

    try {
        game.makeMove(captureMove);
        expect(game.getCapturedPieces().length).toBe(1);
        // Important: Check if the captured piece is the correct one.
        // This requires the Piece class to have a unique ID or be comparable.
        // For now, we'll assume the piece added by MoveCommand is 'blackToCapture' by identity.
        expect(game.getCapturedPieces()[0]).toBe(blackToCapture); // This relies on object identity.
    } catch (e: any) {
        // If move is invalid due to simplified setup, log for debugging in subtask
        console.error("Test 'track single captured piece' failed to make move:", e.message);
        throw e; // Re-throw to fail the test
    }
  });

  test('should track multiple captured pieces after sequential captures', () => {
    // Similar to the above, but with two separate capture moves.
    // Setup board for first capture
    let board1 = new Board(8);
    const redMover1 = new RegularPiece(Player.RED);
    const blackToCapture1 = new RegularPiece(Player.BLACK);
    board1 = board1.setPiece(new Position(4,3), redMover1);
    board1 = board1.setPiece(new Position(3,4), blackToCapture1);
    game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    (game as any).board = board1;
    const captureMove1 = new Move(new Position(4,3), new Position(2,5), [new Position(3,4)]);
    game.makeMove(captureMove1);

    expect(game.getCapturedPieces().length).toBe(1);
    expect(game.getCapturedPieces()[0]).toBe(blackToCapture1);

    // Setup board for second capture (by BLACK player now)
    // Game should have switched player to BLACK.
    let board2 = game.getBoard(); // Get current board state
    const blackMover2 = new RegularPiece(Player.BLACK);
    const redToCapture2 = new RegularPiece(Player.RED);

    // We need to place the blackMover2 at the landing position of the previous move (2,5)
    // and remove the redMover1 from its original position (4,3) as it has moved.
    // The blackToCapture1 is already removed from (3,4) by the first move.
    board2 = board2.clearPiece(new Position(4,3)); // Clear original red mover
    board2 = board2.setPiece(new Position(2,5), blackMover2); // Place black mover at landing spot
    board2 = board2.setPiece(new Position(3,4), redToCapture2); // Place new red piece to be captured
    (game as any).board = board2; // Update game's board

    const captureMove2 = new Move(new Position(2,5), new Position(4,3), [new Position(3,4)]);
    game.makeMove(captureMove2);

    expect(game.getCapturedPieces().length).toBe(2);
    // Check if both blackToCapture1 and redToCapture2 are in the list
    // Order might matter or not, depending on implementation. Assume append.
    expect(game.getCapturedPieces()).toContain(blackToCapture1);
    expect(game.getCapturedPieces()).toContain(redToCapture2);
  });

  test('should not add to captured pieces on a non-capture move', () => {
    // Ensure starting player is RED for this test for consistency
    game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    let testBoard = new Board(8);
    testBoard = testBoard.setPiece(new Position(5,0), new RegularPiece(Player.RED));
    (game as any).board = testBoard; // Set board for the game instance

    game.makeMove(new Move(new Position(5, 0), new Position(4, 1))); // Non-capture
    expect(game.getCapturedPieces()).toEqual([]);
  });

  test('should clear captured pieces on game reset', () => {
    // Simulate a capture
    let board1 = new Board(8);
    const redMover1 = new RegularPiece(Player.RED);
    const blackToCapture1 = new RegularPiece(Player.BLACK);
    board1 = board1.setPiece(new Position(4,3), redMover1);
    board1 = board1.setPiece(new Position(3,4), blackToCapture1);
    game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    (game as any).board = board1;
    const captureMove1 = new Move(new Position(4,3), new Position(2,5), [new Position(3,4)]);
    game.makeMove(captureMove1);
    expect(game.getCapturedPieces().length).toBe(1);

    game.reset();
    expect(game.getCapturedPieces()).toEqual([]);
  });

  test('should restore captured pieces correctly on undo/redo', () => {
    // 1. Initial state: 0 captured
    game = new Game({ ruleEngine: new AmericanCheckersRules(), startingPlayer: Player.RED });
    expect(game.getCapturedPieces()).toEqual([]);

    // 2. Make a capture move
    let board1 = new Board(8);
    const redMover1 = new RegularPiece(Player.RED);
    const blackToCapture1 = new RegularPiece(Player.BLACK); // Piece to be captured
    board1 = board1.setPiece(new Position(4,3), redMver1);
    board1 = board1.setPiece(new Position(3,4), blackToCapture1);
    // game instance is already set to Player.RED starting
    (game as any).board = board1; // Set board for the game instance

    const captureMove = new Move(new Position(4, 3), new Position(2, 5), [new Position(3, 4)]);
    game.makeMove(captureMove);
    expect(game.getCapturedPieces().length).toBe(1);
    expect(game.getCapturedPieces()[0]).toBe(blackToCapture1);

    // 3. Undo the capture move
    game.undoMove();
    expect(game.getCapturedPieces()).toEqual([]);

    // 4. Redo the capture move
    game.redoMove();
    expect(game.getCapturedPieces().length).toBe(1);
    expect(game.getCapturedPieces()[0]).toBe(blackToCapture1);
  });
});


// Add a new describe block or add to an existing one for Game constructor/setup:
describe('Game - Variant and RuleEngine Loading', () => {
  test('should load AmericanCheckersRules by default when no variant is specified', () => {
    const game = new Game(); // No variant specified
    expect(game.getRuleEngine()).toBeInstanceOf(AmericanCheckersRules);
    // Optionally check the internal variant if accessible for testing (e.g., via a getter or casting)
    // This assumes 'variant' is a public field or has a public getter for testing.
    // If it's private and not exposed, this specific assertion cannot be made directly.
    // For this example, we'll assume it can be inspected for thoroughness,
    // but in practice, testing behavior (RuleEngine type) is often sufficient.
    expect((game as any).variant).toBe(GameVariant.STANDARD_AMERICAN);
  });

  test('should load AmericanCheckersRules when STANDARD_AMERICAN variant is specified', () => {
    const game = new Game({ variant: GameVariant.STANDARD_AMERICAN });
    expect(game.getRuleEngine()).toBeInstanceOf(AmericanCheckersRules);
  });

  // Placeholder for future test when another variant is added
  /*
  test('should load InternationalDraughtsRules when INTERNATIONAL_DRAUGHTS variant is specified', () => {
    // Assuming InternationalDraughtsRules and GameVariant.INTERNATIONAL_DRAUGHTS exist
    // const game = new Game({ variant: GameVariant.INTERNATIONAL_DRAUGHTS });
    // expect(game.getRuleEngine()).toBeInstanceOf(InternationalDraughtsRules);
  });
  */
});


describe('Game - Piece Behavior Delegation to RuleEngine', () => {
  let game: Game;
  let mockRuleEngine: AmericanCheckersRules; // Use concrete type for spy, or RuleEngine if preferred
  let piecePosition: Position;
  let testPiece: Piece;

  beforeEach(() => {
    // We want to spy on the methods of the RuleEngine instance used by the Game
    // One way is to create a real RuleEngine, pass it to Game, and then spy on it.
    mockRuleEngine = new AmericanCheckersRules(); // Real instance that we can spy on

    // Spying on methods
    // Note: jest.spyOn types require the method to exist on the object.
    // For some reason, direct method access like mockRuleEngine.getNonCaptureMovesForPiece might be typed as undefined by TS/Jest
    // if not careful with how AmericanCheckersRules is defined or if methods are private/protected.
    // Assuming public methods for spyOn.
    jest.spyOn(mockRuleEngine, 'getNonCaptureMovesForPiece');
    jest.spyOn(mockRuleEngine, 'getCaptureMovesForPiece');
    // jest.spyOn(mockRuleEngine, 'areCapturesMandatory'); // areCapturesMandatory is called by getMandatoryMoves
    jest.spyOn(mockRuleEngine, 'getMandatoryMoves');

    game = new Game({ ruleEngine: mockRuleEngine }); // Let Game use our spied RuleEngine
                                                     // Variant is implicitly STANDARD_AMERICAN here

    // Setup a piece on the board
    piecePosition = new Position(4, 3); // Example position
    testPiece = new RegularPiece(Player.RED); // Example piece
    // Use a new board instance for game.board to avoid modifying shared state across tests if game.getBoard() returns live state
    let newBoard = new Board();
    newBoard = newBoard.setPiece(piecePosition, testPiece);
    (game as any).board = newBoard;
    (game as any).currentPlayer = Player.RED; // Ensure it's the piece's turn
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up spies
  });

  test('game.getPossibleMoves should delegate to RuleEngine methods via piece.getAllValidMoves', () => {
    const mockNonCaptureMoves = [new Move(piecePosition, new Position(3, 2))];
    const mockCaptureMoves = [new Move(piecePosition, new Position(2, 1), [new Position(3,2)])];

    // Configure spies to return specific values
    (mockRuleEngine.getNonCaptureMovesForPiece as jest.Mock).mockReturnValue(mockNonCaptureMoves);
    (mockRuleEngine.getCaptureMovesForPiece as jest.Mock).mockReturnValue(mockCaptureMoves);

    // Piece.getAllValidMoves concatenates them.
    // Game.getPossibleMoves then calls piece.getAllValidMoves.

    const returnedMoves = game.getPossibleMoves(piecePosition);

    expect(mockRuleEngine.getNonCaptureMovesForPiece).toHaveBeenCalledWith(testPiece, piecePosition, game.getBoard());
    expect(mockRuleEngine.getCaptureMovesForPiece).toHaveBeenCalledWith(testPiece, piecePosition, game.getBoard());

    expect(returnedMoves).toEqual([...mockNonCaptureMoves, ...mockCaptureMoves]);
  });

  test('game.getAllPossibleMoves should prioritize mandatory (capture) moves from RuleEngine', () => {
    const playerRedPieces = [{ piece: testPiece, position: piecePosition }];
    // Mock game.getBoard().getPlayerPieces to control the input to AmericanCheckersRules.getAllPossibleMoves
    const boardSpy = jest.spyOn(game.getBoard(), 'getPlayerPieces').mockReturnValue(playerRedPieces as any);

    const mockCaptureMove = new Move(piecePosition, new Position(2,1), [new Position(3,2)]);
    (mockRuleEngine.getMandatoryMoves as jest.Mock).mockReturnValue([mockCaptureMove]);
    // This spy is on the instance; if getAllPossibleMoves calls getNonCaptureMovesForPiece on the same instance, it will be tracked.
    const getNonCaptureSpy = (mockRuleEngine.getNonCaptureMovesForPiece as jest.Mock).mockReturnValue([new Move(piecePosition, new Position(3,4))]);

    const allMoves = game.getAllPossibleMoves(); // For current player (RED)

    expect(mockRuleEngine.getMandatoryMoves).toHaveBeenCalledWith(game.getBoard(), Player.RED);
    // AmericanCheckersRules.getAllPossibleMoves should not call getNonCaptureMovesForPiece if mandatory moves exist
    expect(getNonCaptureSpy).not.toHaveBeenCalled();
    expect(allMoves).toEqual([mockCaptureMove]);

    boardSpy.mockRestore(); // Clean up spy on board
  });

   test('game.getAllPossibleMoves should return non-capture moves if no mandatory moves exist', () => {
    const playerRedPieces = [{ piece: testPiece, position: piecePosition }];
    const boardSpy = jest.spyOn(game.getBoard(), 'getPlayerPieces').mockReturnValue(playerRedPieces as any);

    const mockNonCaptureMove = new Move(piecePosition, new Position(3,4));
    (mockRuleEngine.getMandatoryMoves as jest.Mock).mockReturnValue([]); // No mandatory moves
    (mockRuleEngine.getNonCaptureMovesForPiece as jest.Mock).mockReturnValue([mockNonCaptureMove]);
    // getCaptureMovesForPiece is called by getMandatoryMoves, so it's implicitly tested by getMandatoryMoves mock.
    // We can ensure it was called (and returned empty for this path) if needed.
    // (mockRuleEngine.getCaptureMovesForPiece as jest.Mock).mockReturnValue([]);


    const allMoves = game.getAllPossibleMoves();

    expect(mockRuleEngine.getMandatoryMoves).toHaveBeenCalledWith(game.getBoard(), Player.RED);
    expect(mockRuleEngine.getNonCaptureMovesForPiece).toHaveBeenCalledWith(testPiece, piecePosition, game.getBoard());
    expect(allMoves).toEqual([mockNonCaptureMove]);

    boardSpy.mockRestore(); // Clean up spy on board
  });
});

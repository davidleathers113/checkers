import { ValidationEngine } from '../../src/strategies/ValidationEngine';
import { BasicMoveValidator } from '../../src/strategies/BasicMoveValidator';
import { DiagonalMoveValidator } from '../../src/strategies/DiagonalMoveValidator';
import { CaptureValidator } from '../../src/strategies/CaptureValidator';
import { MultiStepMoveValidator } from '../../src/strategies/MultiStepMoveValidator';
import { MandatoryCaptureValidator } from '../../src/strategies/MandatoryCaptureValidator';
import { MoveValidator } from '../../src/strategies/MoveValidator';
import { Board } from '../../src/core/Board';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;

describe('BasicMoveValidator', () => {
  const v = new BasicMoveValidator();

  it('accepts a basic legal move and exposes priority/name', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    expect(v.getName()).toBe('BasicMoveValidator');
    expect(v.getPriority()).toBe(0);
    expect(v.validateMove(board, new Move(new Position(5, 2), new Position(4, 3)), RED)).toBe(true);
  });

  it('rejects invalid source/destination positions', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    expect(() => v.validateMove(board, new Move(new Position(9, 9), new Position(4, 3)), RED)).toThrow();
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(9, 9)), RED)).toThrow();
  });

  it('rejects empty source, wrong owner, no-op, and occupied destination', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK));
    expect(() => v.validateMove(board, new Move(new Position(0, 1), new Position(1, 2)), RED)).toThrow(); // empty source
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(4, 3)), BLACK)).toThrow(); // wrong owner
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(5, 2)), RED)).toThrow(); // no-op
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(4, 3)), RED)).toThrow(); // occupied dest (BLACK)
  });

  it('validates multi-step source position and ownership', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    const steps = [
      { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
      { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) },
    ];
    const move = new Move(new Position(5, 2), new Position(1, 6), [new Position(4, 3), new Position(2, 5)], false, steps);
    expect(v.validateMove(board, move, RED)).toBe(true);
    expect(() => v.validateMove(board, move, BLACK)).toThrow(); // wrong owner
  });
});

describe('DiagonalMoveValidator', () => {
  const v = new DiagonalMoveValidator();

  it('rejects non-diagonal and zero-distance moves', () => {
    const board = new Board(8).setPiece(new Position(4, 4), new RegularPiece(RED));
    expect(() => v.validateMove(board, new Move(new Position(4, 4), new Position(4, 6)), RED)).toThrow();
    expect(() => v.validateMove(board, new Move(new Position(4, 4), new Position(4, 4)), RED)).toThrow();
  });

  it('rejects regular pieces moving too far or backward (non-capture)', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(2, 5)), RED)).toThrow(); // 3 squares
    expect(() => v.validateMove(board, new Move(new Position(5, 2), new Position(6, 3)), RED)).toThrow(); // backward
  });

  it('allows a regular backward capture (direction constraint is non-capture only)', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(BLACK));
    const move = new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]); // SE = backward for RED
    expect(v.validateMove(board, move, RED)).toBe(true);
  });

  it('handles king path: clear passes, blocked throws', () => {
    const clear = new Board(8).setPiece(new Position(4, 4), new KingPiece(RED));
    expect(v.validateMove(clear, new Move(new Position(4, 4), new Position(7, 7)), RED)).toBe(true);

    const blocked = clear.setPiece(new Position(6, 6), new RegularPiece(RED));
    expect(() => v.validateMove(blocked, new Move(new Position(4, 4), new Position(7, 7)), RED)).toThrow();
  });

  it('rejects a non-diagonal multi-step', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    const steps = [
      { from: new Position(5, 2), to: new Position(5, 4) }, // not diagonal
    ];
    const move = new Move(new Position(5, 2), new Position(5, 4), [], false, [...steps, { from: new Position(5, 4), to: new Position(4, 5) }]);
    expect(() => v.validateMove(board, move, RED)).toThrow();
  });
});

describe('CaptureValidator', () => {
  const v = new CaptureValidator();

  it('only applies to captures', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    expect(v.shouldValidate(board, new Move(new Position(5, 2), new Position(4, 3)), RED)).toBe(false);
    expect(v.shouldValidate(board, new Move(new Position(5, 2), new Position(3, 4), [new Position(4, 3)]), RED)).toBe(true);
  });

  it('validates a legal single jump', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(BLACK));
    expect(v.validateMove(board, new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]), RED)).toBe(true);
  });

  it('rejects capturing an empty square or an own piece', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(RED));
    expect(() => v.validateMove(board, new Move(new Position(3, 3), new Position(5, 5), [new Position(2, 2)]), RED)).toThrow(); // empty
    expect(() => v.validateMove(board, new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]), RED)).toThrow(); // own piece
  });

  it('validates a king multi-capture path', () => {
    const board = new Board(8)
      .setPiece(new Position(1, 1), new KingPiece(RED))
      .setPiece(new Position(3, 3), new RegularPiece(BLACK));
    const move = new Move(new Position(1, 1), new Position(5, 5), [new Position(3, 3)]);
    expect(v.validateMove(board, move, RED)).toBe(true);
  });
});

describe('MultiStepMoveValidator', () => {
  const v = new MultiStepMoveValidator();

  const doubleJump = (steps: { from: Position; to: Position; captured?: Position }[]): Move =>
    new Move(steps[0]!.from, steps[steps.length - 1]!.to, steps.filter(s => s.captured).map(s => s.captured!), false, steps);

  it('only applies to multi-step moves', () => {
    const board = new Board(8);
    expect(v.shouldValidate(board, new Move(new Position(5, 2), new Position(4, 3)), RED)).toBe(false);
  });

  it('accepts a valid double jump', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK))
      .setPiece(new Position(2, 5), new RegularPiece(BLACK));
    const move = doubleJump([
      { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
      { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) },
    ]);
    expect(v.validateMove(board, move, RED)).toBe(true);
  });

  it('rejects an occupied intermediate landing square', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK))
      .setPiece(new Position(3, 4), new RegularPiece(RED)) // blocks landing
      .setPiece(new Position(2, 5), new RegularPiece(BLACK));
    const move = doubleJump([
      { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
      { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) },
    ]);
    expect(() => v.validateMove(board, move, RED)).toThrow();
  });

  it('rejects non-contiguous steps and capturing a non-opponent', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(RED)); // own piece, not an opponent
    const nonContig = doubleJump([
      { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
      { from: new Position(0, 0), to: new Position(1, 1) },
    ]);
    expect(() => v.validateMove(board, nonContig, RED)).toThrow();

    const capturesOwn = doubleJump([
      { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
    ].concat([{ from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) }]));
    expect(() => v.validateMove(board, capturesOwn, RED)).toThrow();
  });
});

describe('MandatoryCaptureValidator', () => {
  const v = new MandatoryCaptureValidator();

  it('allows any move when no capture is available', () => {
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    expect(v.validateMove(board, new Move(new Position(5, 2), new Position(4, 3)), RED)).toBe(true);
  });

  it('rejects a non-capture when a capture exists', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(BLACK));
    expect(() => v.validateMove(board, new Move(new Position(3, 3), new Position(2, 2)), RED)).toThrow();
  });

  it('rejects a capture that is not among the available ones', () => {
    const board = new Board(8)
      .setPiece(new Position(3, 3), new RegularPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(BLACK));
    const bogus = new Move(new Position(3, 3), new Position(1, 1), [new Position(2, 2)]);
    expect(() => v.validateMove(board, bogus, RED)).toThrow();
  });

  it('enforces the maximum-capture rule', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK))
      .setPiece(new Position(2, 5), new RegularPiece(BLACK))
      .setPiece(new Position(4, 1), new RegularPiece(BLACK)); // a single-capture option exists
    // Submitting only the single capture should be rejected in favor of the double.
    const single = new Move(new Position(5, 2), new Position(3, 0), [new Position(4, 1)]);
    expect(() => v.validateMove(board, single, RED)).toThrow();
  });
});

describe('ValidationEngine', () => {
  it('createStandard wires the five standard validators in priority order', () => {
    const engine = ValidationEngine.createStandard();
    const names = engine.getValidators().map(v => v.getName());
    expect(names).toEqual([
      'BasicMoveValidator',
      'DiagonalMoveValidator',
      'CaptureValidator',
      'MultiStepMoveValidator',
      'MandatoryCaptureValidator',
    ]);
  });

  it('createDefault resolves to an equivalent engine', async () => {
    const engine = await ValidationEngine.createDefault();
    expect(engine.getValidators()).toHaveLength(5);
  });

  it('add, remove, and clear validators', () => {
    const engine = new ValidationEngine();
    engine.addValidator(new BasicMoveValidator());
    engine.addValidator(new DiagonalMoveValidator());
    expect(engine.getValidators()).toHaveLength(2);
    engine.removeValidator('BasicMoveValidator');
    expect(engine.getValidators().map(v => v.getName())).toEqual(['DiagonalMoveValidator']);
    engine.clearValidators();
    expect(engine.getValidators()).toHaveLength(0);
  });

  it('aggregates errors: validateMove throws, validateMoveQuiet reports', () => {
    const engine = ValidationEngine.createStandard();
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    const backward = new Move(new Position(5, 2), new Position(6, 3));

    expect(() => engine.validateMove(board, backward, RED)).toThrow();
    const quiet = engine.validateMoveQuiet(board, backward, RED);
    expect(quiet.isValid).toBe(false);
    expect(quiet.errors.length).toBeGreaterThan(0);

    const legal = new Move(new Position(5, 2), new Position(4, 3));
    expect(engine.validateMoveQuiet(board, legal, RED)).toEqual({ isValid: true, errors: [] });
  });

  it('getValidationDetails records applied/passed/skipped per validator', () => {
    const engine = ValidationEngine.createStandard();
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    const details = engine.getValidationDetails(board, new Move(new Position(5, 2), new Position(4, 3)), RED);
    expect(details).toHaveLength(5);
    // CaptureValidator is skipped (shouldValidate=false) for a non-capture move.
    const capture = details.find(d => d.validatorName === 'CaptureValidator')!;
    expect(capture.applied).toBe(false);
    expect(details.find(d => d.validatorName === 'BasicMoveValidator')!.passed).toBe(true);
  });

  it('captures errors thrown by a custom validator', () => {
    const engine = new ValidationEngine();
    const throwing: MoveValidator = {
      validateMove: () => {
        throw new Error('boom');
      },
      getPriority: () => 0,
      getName: () => 'Throwing',
    };
    engine.addValidator(throwing);
    const board = new Board(8).setPiece(new Position(5, 2), new RegularPiece(RED));
    const result = engine.validateMoveQuiet(board, new Move(new Position(5, 2), new Position(4, 3)), RED);
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('boom');
  });
});

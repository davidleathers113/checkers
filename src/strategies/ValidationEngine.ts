import { MoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Orchestrates multiple move validators to validate moves.
 * Validators are executed in priority order.
 */
export class ValidationEngine {
  private validators: MoveValidator[] = [];

  /**
   * Adds a validator to the engine.
   */
  addValidator(validator: MoveValidator): void {
    this.validators.push(validator);
    this.sortValidators();
  }

  /**
   * Removes a validator from the engine.
   */
  removeValidator(validatorName: string): void {
    this.validators = this.validators.filter(
      validator => validator.getName() !== validatorName
    );
  }

  /**
   * Removes all validators.
   */
  clearValidators(): void {
    this.validators = [];
  }

  /**
   * Gets all registered validators.
   */
  getValidators(): readonly MoveValidator[] {
    return [...this.validators];
  }

  /**
   * Validates a move using all registered validators.
   * Returns true if valid, throws InvalidMoveError if not.
   */
  validateMove(board: Board, move: Move, player: Player): boolean {
    const errors: string[] = [];

    for (const validator of this.validators) {
      try {
        // Check if this validator should be applied
        if (validator.shouldValidate && !validator.shouldValidate(board, move, player)) {
          continue;
        }

        // Run the validation
        const isValid = validator.validateMove(board, move, player);
        if (!isValid) {
          errors.push(`${validator.getName()}: Validation failed`);
        }
      } catch (error) {
        if (error instanceof InvalidMoveError) {
          errors.push(`${validator.getName()}: ${error.reason}`);
        } else {
          errors.push(`${validator.getName()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new InvalidMoveError(move, errors.join('; '));
    }

    return true;
  }

  /**
   * Validates a move and returns validation result without throwing.
   */
  validateMoveQuiet(board: Board, move: Move, player: Player): {
    isValid: boolean;
    errors: string[];
  } {
    try {
      this.validateMove(board, move, player);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof InvalidMoveError) {
        return { isValid: false, errors: [error.reason] };
      }
      return { isValid: false, errors: [error instanceof Error ? error.message : 'Unknown error'] };
    }
  }

  /**
   * Gets validation details for a move.
   */
  getValidationDetails(board: Board, move: Move, player: Player): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const validator of this.validators) {
      const result: ValidationResult = {
        validatorName: validator.getName(),
        priority: validator.getPriority(),
        applied: false,
        passed: false,
        error: null
      };

      try {
        // Check if validator should be applied
        if (validator.shouldValidate && !validator.shouldValidate(board, move, player)) {
          result.applied = false;
          results.push(result);
          continue;
        }

        result.applied = true;
        result.passed = validator.validateMove(board, move, player);
      } catch (error) {
        result.applied = true;
        result.passed = false;
        result.error = error instanceof InvalidMoveError ? error.reason : (error instanceof Error ? error.message : 'Unknown error');
      }

      results.push(result);
    }

    return results;
  }

  /**
   * Creates a default validation engine with standard validators.
   */
  static async createDefault(): Promise<ValidationEngine> {
    const engine = new ValidationEngine();
    
    // Add default validators
    const { BasicMoveValidator } = await import('./BasicMoveValidator');
    const { DiagonalMoveValidator } = await import('./DiagonalMoveValidator');
    const { CaptureValidator } = await import('./CaptureValidator');
    const { MandatoryCaptureValidator } = await import('./MandatoryCaptureValidator');

    engine.addValidator(new BasicMoveValidator());
    engine.addValidator(new DiagonalMoveValidator());
    engine.addValidator(new CaptureValidator());
    engine.addValidator(new MandatoryCaptureValidator());

    return engine;
  }

  /**
   * Sorts validators by priority (lower numbers first).
   */
  private sortValidators(): void {
    this.validators.sort((a, b) => a.getPriority() - b.getPriority());
  }
}

/**
 * Result of a single validator's execution.
 */
export interface ValidationResult {
  validatorName: string;
  priority: number;
  applied: boolean;
  passed: boolean;
  error: string | null;
}
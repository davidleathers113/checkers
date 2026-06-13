import * as core from '../src/core';
import * as pieces from '../src/pieces';
import * as rules from '../src/rules';
import * as strategies from '../src/strategies';
import * as commands from '../src/commands';
import * as errors from '../src/errors';
import * as ui from '../src/ui';

/**
 * Smoke test for the barrel modules: importing each one executes its
 * re-exports and asserts the public surface is wired up.
 */
describe('package barrels', () => {
  it('core exports the foundational entities', () => {
    expect(core.Game).toBeDefined();
    expect(core.Board).toBeDefined();
    expect(core.Position).toBeDefined();
    expect(core.Move).toBeDefined();
  });

  it('pieces exports the piece hierarchy', () => {
    expect(pieces.Piece).toBeDefined();
    expect(pieces.RegularPiece).toBeDefined();
    expect(pieces.KingPiece).toBeDefined();
  });

  it('rules exports the rule engines', () => {
    expect(rules.StandardRules).toBeDefined();
    expect(rules.CustomRulesBase).toBeDefined();
  });

  it('strategies exports the validation engine and validators', () => {
    expect(strategies.ValidationEngine).toBeDefined();
    expect(strategies.BasicMoveValidator).toBeDefined();
    expect(strategies.MultiStepMoveValidator).toBeDefined();
  });

  it('commands and errors export their members', () => {
    expect(commands.MoveCommand).toBeDefined();
    expect(errors.InvalidMoveError).toBeDefined();
  });

  it('ui exports the GameUI surface', () => {
    expect(ui).toBeDefined();
  });
});

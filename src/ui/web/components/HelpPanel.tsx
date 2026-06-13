import React from 'react';
import { RuleSet } from '../types/GameConfig';

interface HelpPanelProps {
  ruleSet: RuleSet;
  onClose: () => void;
}

const VARIANT_NOTES: Record<RuleSet, { title: string; note: string }> = {
  standard: {
    title: 'Standard Checkers',
    note: 'Classic rules on an 8×8 board.'
  },
  international: {
    title: 'International Draughts',
    note: 'A bigger 10×10 board, flying kings that glide any distance, and you must take the jump that captures the most pieces.'
  },
  crazy: {
    title: 'Crazy Checkers',
    note: 'Experimental rules with extra mechanics — expect the unexpected!'
  },
  jumpOwn: {
    title: 'Jump Your Own Man',
    note: 'All the standard rules, PLUS a special move: you may hop over one of your OWN pieces into an empty square beyond it. Your piece is NOT captured — it stays put. Use it to leap your men forward! (You still must take a jump over an opponent when one is available.)'
  }
};

/**
 * A friendly, kid-readable explanation of how to play, tailored to the
 * currently selected rule set.
 */
export function HelpPanel({ ruleSet, onClose }: HelpPanelProps): React.JSX.Element {
  const variant = VARIANT_NOTES[ruleSet];

  return (
    <div className="help-overlay" data-testid="help-panel">
      <div className="help-panel" role="dialog" aria-modal="true" aria-label="How to Play">
        <div className="help-header">
          <h2>How to Play</h2>
          <button className="close-btn" data-testid="help-close-button" onClick={onClose} aria-label="Close help">×</button>
        </div>

        <div className="help-body">
          <h3>The basics</h3>
          <ul>
            <li>🔴 Red and ⚫ Black take turns. Red moves first.</li>
            <li>Move one of your pieces diagonally forward onto an empty dark square.</li>
            <li><strong>Jump</strong> an opponent that sits diagonally next to you by landing on the empty square just beyond it — that piece is captured and removed.</li>
            <li>If you can keep jumping with the same piece, you do it all in one turn.</li>
            <li>If a jump is available, you <strong>must</strong> take it. Pieces you must move are outlined.</li>
            <li>Reach the far row and your piece becomes a <strong>King</strong> 👑, which can move and jump backward too.</li>
            <li>Win by capturing all your opponent's pieces — or leaving them with no move.</li>
          </ul>

          <h3>This game: {variant.title}</h3>
          <p>{variant.note}</p>

          <h3>Helpful buttons</h3>
          <ul>
            <li><strong>Hint</strong> highlights a good move to consider.</li>
            <li><strong>Undo</strong> takes the last move back so you can try again.</li>
            <li>The ⚙️ settings let you switch rules, play the computer, and pick a difficulty.</li>
          </ul>
        </div>

        <div className="help-actions">
          <button className="btn btn-primary" data-testid="help-done-button" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>
  );
}

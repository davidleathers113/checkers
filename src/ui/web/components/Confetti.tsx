import React, { useMemo } from 'react';

interface ConfettiProps {
  count?: number;
}

const COLORS = ['#e9c869', '#c33c2e', '#2f9e6b', '#4a5360', '#fbf6ec', '#c79a3a'];

/**
 * A lightweight, asset-free confetti burst for the win celebration. Pieces are
 * generated once on mount, so a fresh celebration plays each time it is keyed
 * back into the tree. Purely decorative (aria-hidden, pointer-events none).
 */
export function Confetti({ count = 90 }: ConfettiProps): React.JSX.Element {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        bg: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 1.9 + Math.random() * 1.8,
        spin: Math.round(Math.random() * 6 + 2) * (Math.random() < 0.5 ? -1 : 1),
        drift: Math.round((Math.random() * 2 - 1) * 70),
        width: Math.round(6 + Math.random() * 8),
        height: Math.round(8 + Math.random() * 8)
      })),
    [count]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti-bit"
          style={
            {
              left: `${b.left}%`,
              background: b.bg,
              width: `${b.width}px`,
              height: `${b.height}px`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              '--spin': `${b.spin * 360}deg`,
              '--drift': `${b.drift}px`
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

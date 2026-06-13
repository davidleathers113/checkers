import { RefObject, useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a modal container while it is mounted and active:
 * - moves focus into the container on open (and remembers what had focus),
 * - cycles Tab / Shift+Tab within the container,
 * - closes on Escape,
 * - restores focus to the previously-focused element on close.
 *
 * Pass `active = false` to temporarily disable the trap without unmounting — used
 * so an outer modal yields focus to a nested dialog (e.g. a confirmation) while
 * that nested dialog is open, then reclaims it when the nested dialog closes.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  active = true
): void {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = (): HTMLElement[] =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null);

    const items = focusable();
    (items[0] ?? node).focus();

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const current = focusable();
      if (current.length === 0) return;
      const first = current[0]!;
      const last = current[current.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    return (): void => {
      node.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [ref, onClose, active]);
}

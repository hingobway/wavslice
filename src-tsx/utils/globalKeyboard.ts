'use client';

import { useEffect } from 'react';

/**
 * pass a handler function to assign keyboard shortcuts, most likely
 * using `e.code` to match for actions.
 *
 * YOU SHOULD DEDUPE THE HANDLER FUNCTION to avoid reassigning on every render (see example).
 *
 * @example
 * const handleShortcut = useCallback<GlobalKeyboardHandler>(
 *   (e, { withModifiers }) => {
 *     switch (e.code) {
 *       case 'KeyP':
 *         if (withModifiers) break;
 *         runMyAction();
 *         break;
 *     }
 *   },
 *   [runMyAction],
 * );
 * useGlobalKeyboardShortcuts(handleShortcut);
 */
export function useGlobalKeyboardShortcuts(handler: GlobalKeyboardHandler) {
  useEffect(() => {
    const dom = window.document;
    if (!dom) return;

    const cb = (e: KeyboardEvent) => {
      // make sure user isn't typing
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      )
        return;

      handler(e, { withModifiers: withModifiers(e) });
    };

    // attach event listener
    dom.addEventListener('keydown', cb);
    return () => dom.removeEventListener('keydown', cb);
  }, [handler]);
}

// ---------------------------

export type GlobalKeyboardHandler = (
  e: KeyboardEvent,
  opts: { withModifiers: boolean },
) => void;

export function withModifiers(e: KeyboardEvent) {
  return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
}

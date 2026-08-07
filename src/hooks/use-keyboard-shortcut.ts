import { useEffect } from 'react';

type ShortcutKey = 'cmd-k' | 'escape';

export function useKeyboardShortcut(
  shortcut: ShortcutKey,
  callback: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Do not trigger cmd-k while the user is actively typing in an input, textarea, or contentEditable
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (shortcut === 'cmd-k') {
        if (isTyping) return;
        
        // Match Command+K (Mac) or Control+K (Windows)
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          callback(event);
        }
      }

      if (shortcut === 'escape') {
        if (event.key === 'Escape') {
          // Allow default to happen (like closing native dropdowns) but run our callback
          callback(event);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback]);
}

import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * 
 * WHY WE USE THIS HERE:
 * When typing in a search bar, updating the state on every single keystroke 
 * triggers an immediate re-render and API call (if wired to React Query). 
 * This can spam the server with dozens of requests (e.g., "j", "jo", "joh", "john").
 * By debouncing the value, we wait until the user stops typing for a specified delay 
 * (e.g., 500ms) before returning the updated value, ensuring we only make one API 
 * call when they pause or finish typing.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

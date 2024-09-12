import { useEffect, useRef } from "react";

export function useDebounce(func, timeout) {
  const timerRef = useRef(null);

  const debouncedFunction = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      func(...args);
    }, timeout);
  };

  useEffect(() => {
    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

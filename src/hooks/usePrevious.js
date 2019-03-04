import { useRef, useEffect } from "react";

/**
 * usePrevious hook
 *
 * Note that on mount, currentValue will be equal to the previous value.
 */
export default function usePrevious(currentValue) {
  const ref = useRef(currentValue);

  useEffect(() => {
    ref.current = currentValue;
  }, [currentValue]);

  return ref.current;
}

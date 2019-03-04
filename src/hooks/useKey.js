import { useEffect } from "react";

/**
 * useKey hook
 *
 * Subscribes to the keypress event for a given key or key combination.
 */
export default function useKey(keyList = [], handler, eventType = "keydown") {
  const keyMatchesEvent = (key, event) => {
    if (typeof key === "string") {
      return event.key === key;
    } else {
      const [modifier, innerKey] = key;
      const matchesModifier = modifier === "Shift" ? event.shiftKey : false;
      return matchesModifier && event.key === innerKey;
    }
  };

  const handleKeyDown = event => {
    if (keyList.some(key => keyMatchesEvent(key, event))) {
      handler(event);
    }
  };

  useEffect(() => {
    window.addEventListener(eventType, handleKeyDown);

    return () => {
      window.removeEventListener(eventType, handleKeyDown);
    };
  }, [keyList, handler, eventType]);
}

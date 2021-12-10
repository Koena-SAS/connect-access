import { useEffect, useRef } from "react";

/**
 * Returns the previous value of a given state or prop.
 * cf. https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @param value
 * @returns the previous state of the value
 */
function usePrevious<T>(value: T): T | null {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;

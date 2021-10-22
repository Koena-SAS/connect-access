import { useEffect, useRef } from "react";

/**
 * Returns the previous value of a given state or prop.
 * cf. https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @param {*} value
 * @returns the previous state of the value
 */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;

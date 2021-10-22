import { useEffect, useRef } from "react";

/**
 * Executes a function when clicking anywhere except on an element that
 * holds a specific ref, retuned by this hook.
 * This hook comes from https://stackoverflow.com/a/54292872/1774332
 *
 * @param {function} callback the function that is called when clicking
 *   outside of the element that holds the returned ref.
 * @returns ref to be assigned to the element that does not trigger the
 *   click callback.
 */
function useOuterClick(callback) {
  const callbackRef = useRef<(event) => void>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(e) {
      const innerRefIsVisible =
        innerRef.current &&
        getComputedStyle(innerRef.current).visibility === "visible";
      if (
        innerRefIsVisible &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      )
        callbackRef.current(e);
    }
  }, []);

  return innerRef;
}
export default useOuterClick;

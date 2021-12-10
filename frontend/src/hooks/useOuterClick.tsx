import { useEffect, useRef } from "react";

/**
 * Executes a function when clicking anywhere except on an element that
 * holds a specific ref, retuned by this hook.
 * This hook comes from https://stackoverflow.com/a/54292872/1774332
 *
 * @param callback the function that is called when clicking
 *   outside of the element that holds the returned ref.
 * @returns ref to be assigned to the element that does not trigger the
 *   click callback.
 */
function useOuterClick(callback: (event: MouseEvent) => void) {
  const callbackRef = useRef<((event: MouseEvent) => void) | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(event: MouseEvent): void {
      const innerRefIsVisible =
        innerRef.current &&
        getComputedStyle(innerRef.current).visibility === "visible";
      if (
        innerRefIsVisible &&
        callbackRef.current &&
        // cast as specified in https://stackoverflow.com/a/43851475/1774332
        !innerRef.current.contains(event.target as Node)
      )
        callbackRef.current(event);
    }
  }, []);

  return innerRef;
}
export default useOuterClick;

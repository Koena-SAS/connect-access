import { useEffect, useState } from "react";

/**
 * Custom hook to create and manage state synchronized with local storage.
 * The initial value of the state is read from local storage, after that,
 * every change on the state updates the local storage value.
 *
 * @param {string} localStorageKey
 * @param {boolean} isObject indicates if the value is an object
 * @returns {List} value and setValue to read and manage the state
 */
function useStateWithLocalStorage(localStorageKey, isObject = false) {
  const initValue = () => {
    const localValue = localStorage.getItem(localStorageKey);
    if (localValue) {
      return isObject ? JSON.parse(localValue) : localValue;
    } else {
      return null;
    }
  };
  const [value, setValue] = useState(initValue());

  useEffect(() => {
    if (value) {
      const localValue = isObject ? JSON.stringify(value) : value;
      localStorage.setItem(localStorageKey, localValue);
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [value, localStorageKey, isObject]);

  return [value, setValue];
}

export default useStateWithLocalStorage;

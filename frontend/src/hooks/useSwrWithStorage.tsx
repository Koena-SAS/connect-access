import axios from "axios";
import useSWR from "swr";
import { keysToCamel } from "../utils";

const fetcher = (url, token, isObject) =>
  axios
    .get(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((res) => {
      if (res.data) {
        const data = keysToCamel(res.data);
        const localValue = isObject ? JSON.stringify(data) : data;
        localStorage.setItem(url + token, localValue);
        return data;
      } else {
        localStorage.removeItem(url + token);
        return null;
      }
    });

/**
 * State managed and synchronized with the backend by swr,
 * with an additional local storage copy to be able to provide
 * the information while offline.
 *
 * @param {string} key
 * @param {string} token used to authenticate the user
 * @param {boolean} isObject indicates if the value is an object
 * @returns {List} value and setValue to read and manage the state
 */
function useSwrWithLocalStorage(key, token, isObject = false) {
  const initValue = () => {
    const localValue = localStorage.getItem(key + token);
    if (localValue) {
      return isObject ? JSON.parse(localValue) : localValue;
    } else {
      return null;
    }
  };
  const initialValue = initValue();
  const options = initialValue
    ? {
        initialData: initialValue,
      }
    : undefined;
  return useSWR(token ? [key, token, isObject] : null, fetcher, options);
}

export default useSwrWithLocalStorage;

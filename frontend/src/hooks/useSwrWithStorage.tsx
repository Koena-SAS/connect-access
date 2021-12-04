import axios from "axios";
import useSWR, { SWRResponse } from "swr";
import { keysToCamel } from "../utils";

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((res) => {
      if (res.data) {
        const data = keysToCamel(res.data);
        const localValue =
          typeof data !== "string" ? JSON.stringify(data) : data;
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
 * @param key
 * @param token used to authenticate the user
 * @param isObject indicates if the value is an object
 * @returns value and setValue to read and manage the state
 */
function useSwrWithLocalStorage<Data = unknown, Error = unknown>(
  key: string,
  token: string,
  isObject: boolean = false
): SWRResponse<Data, Error> {
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
  return useSWR<Data, Error>(token ? [key, token] : null, fetcher, options);
}

export default useSwrWithLocalStorage;

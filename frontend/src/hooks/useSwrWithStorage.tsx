import axios from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { keysToCamel } from "../utils";

function fetcher<Data>(url: string, token: string): Promise<Data> {
  return axios
    .get<Data>(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((res) => {
      if (res.data) {
        const data = keysToCamel(res.data) as Data;
        const localValue =
          typeof data !== "string" ? JSON.stringify(data) : data;
        localStorage.setItem(url + token, localValue);
        return data;
      } else {
        localStorage.removeItem(url + token);
        return res.data;
      }
    });
}

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
  token?: string,
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
  const options: SWRConfiguration<Data, Error> | undefined = initialValue
    ? {
        initialData: initialValue,
      }
    : undefined;
  return useSWR<Data, Error>(token ? [key, token] : null, fetcher, options);
}

export default useSwrWithLocalStorage;

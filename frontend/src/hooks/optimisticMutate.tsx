import axios from "axios";
import { cache, mutate } from "swr";
import useMutation from "use-mutation";
import { keysToCamel, keysToSnake } from "../utils";

async function modifyUserDetails({ userDetails, token }) {
  const dataToSend = keysToSnake(userDetails);
  try {
    const response = await axios.put("/auth/users/me/", dataToSend, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Modify the user detials.
 * Hook using use-mutation lib, to make put request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param {object} obj authentication token, and two functions
 *   to be called when the backend reply arrives. One in case
 *   of success and one in case of failure.
 * @returns array containing a function to modify user details,
 *   and an object with additional information like errors.
 */
export function useModifyUserDetails({
  token,
  displayRequestFailure,
  displayRequestSuccess,
}) {
  const key = ["/auth/users/me/", token, true];
  return useMutation(modifyUserDetails, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(key, input.userDetails, false);
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, keysToCamel(data.data));
      displayRequestSuccess();
    },
    onFailure({ error, rollback }) {
      if (rollback) rollback();
      if (
        !error.first_name &&
        !error.last_name &&
        !error.email &&
        !error.phone_number
      )
        /* the error action is only needed if the backend
           sends a non-field error. Field errors are handled
           in the component using this hook. */
        displayRequestFailure();
    },
  });
}

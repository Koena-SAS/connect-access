import type { AxiosResponse } from "axios";
import axios from "axios";
import { cache, mutate } from "swr";
import useMutation from "use-mutation";
import type { UserDetails, UserDetailsToSend } from "../types/userDetails";
import { keysToCamel, keysToSnake } from "../utils";

type ModifyUserDetailsProps = {
  userDetails: UserDetails;
  token: string;
};

async function modifyUserDetails({
  userDetails,
  token,
}: ModifyUserDetailsProps): Promise<AxiosResponse<UserDetailsToSend>> {
  const dataToSend = keysToSnake(userDetails);
  try {
    const response = await axios.put<UserDetailsToSend>(
      "/auth/users/me/",
      dataToSend,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : [];
  }
}

type UseModifyUserDetailsProps = {
  token: string;
  displayRequestFailure: () => void;
  displayRequestSuccess: () => void;
};

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
}: UseModifyUserDetailsProps) {
  const key = ["/auth/users/me/", token];
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

import type { AxiosResponse } from "axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import { cache, mutate } from "swr";
import useMutation from "use-mutation";
import type {
  MediationRequest,
  MediationRequestToSend,
} from "../types/mediationRequest";
import { keysToCamel } from "../utils";

type EditMediationRequestProps = {
  mediationRequest: MediationRequest;
  mediationRequestId: string;
  token: string;
};

async function editMediationRequest({
  mediationRequest,
  mediationRequestId,
  token,
}: EditMediationRequestProps): Promise<AxiosResponse<MediationRequestToSend>> {
  const dataToSend = new FormData();
  if (mediationRequest.requestDate) {
    dataToSend.append("request_date", mediationRequest.requestDate);
  }
  dataToSend.append("first_name", mediationRequest.firstName);
  try {
    const response = await axios.patch<MediationRequestToSend>(
      `/api/mediation-requests/${mediationRequestId}/`,
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

type UseEditMediationRequestProps = {
  token: string;
  onSuccess: () => void;
  onFailure: () => void;
};

/**
 * Edit a mediation request.
 * Hook using use-mutation lib, to make patch request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param {object} obj authentication token and two functions
 *   to be called when the backend reply arrives.
 *   One in case of success and one in case of failure.
 * @returns array containing a function to edit a mediation request,
 *   and an object with additional information like errors.
 */
export function useEditMediationRequest({
  token,
  onSuccess,
  onFailure,
}: UseEditMediationRequestProps) {
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  const key = [`/api/mediation-request/${mediationRequestId}/`, token];
  return useMutation(editMediationRequest, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: MediationRequest[]) =>
          current.map((mediationRequest) => {
            const isTheNewRequest =
              mediationRequest.id === input.mediationRequest.id;
            if (isTheNewRequest) {
              return input.mediationRequest;
            } else {
              return mediationRequest;
            }
          }),
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: MediationRequest[]) =>
        current.map((mediationRequest) => {
          if (mediationRequest.id) return mediationRequest;
          return keysToCamel(data.data);
        })
      );
      onSuccess && onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      onFailure && onFailure();
    },
  });
}

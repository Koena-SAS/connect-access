import type { AxiosResponse } from "axios";
import axios from "axios";
import produce from "immer";
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
  mediationRequest.requestDate &&
    dataToSend.append("request_date", mediationRequest.requestDate);
  mediationRequest.requestDate &&
    dataToSend.append("status", mediationRequest.status);
  mediationRequest.urgency &&
    dataToSend.append("urgency", mediationRequest.urgency);
  dataToSend.append("first_name", mediationRequest.firstName);
  mediationRequest.lastName !== undefined &&
    dataToSend.append("last_name", mediationRequest.lastName);
  dataToSend.append("email", mediationRequest.email);
  mediationRequest.phoneNumber !== undefined &&
    dataToSend.append("phone_number", mediationRequest.phoneNumber);
  mediationRequest.assistiveTechnologyUsed !== undefined &&
    mediationRequest.assistiveTechnologyUsed.forEach((technologyType) => {
      dataToSend.append("assistive_technology_used", technologyType);
    });
  mediationRequest.technologyName !== undefined &&
    dataToSend.append("technology_name", mediationRequest.technologyName);
  mediationRequest.technologyVersion !== undefined &&
    dataToSend.append("technology_version", mediationRequest.technologyVersion);
  dataToSend.append("issue_description", mediationRequest.issueDescription);
  mediationRequest.stepDescription !== undefined &&
    dataToSend.append("step_description", mediationRequest.stepDescription);
  mediationRequest.inaccessibilityLevel &&
    dataToSend.append(
      "inaccessibility_level",
      mediationRequest.inaccessibilityLevel
    );
  mediationRequest.browserUsed &&
    dataToSend.append("browser_used", mediationRequest.browserUsed);
  mediationRequest.url !== undefined &&
    dataToSend.append("url", mediationRequest.url);
  mediationRequest.browser &&
    dataToSend.append("browser", mediationRequest.browser);
  mediationRequest.browserVersion !== undefined &&
    dataToSend.append("browser_version", mediationRequest.browserVersion);
  mediationRequest.mobileAppUsed &&
    dataToSend.append("mobile_app_used", mediationRequest.mobileAppUsed);
  mediationRequest.mobileAppPlatform &&
    dataToSend.append(
      "mobile_app_platform",
      mediationRequest.mobileAppPlatform
    );
  mediationRequest.mobileAppName !== undefined &&
    dataToSend.append("mobile_app_name", mediationRequest.mobileAppName);
  mediationRequest.otherUsedSoftware !== undefined &&
    dataToSend.append(
      "other_used_software",
      mediationRequest.otherUsedSoftware
    );
  mediationRequest.didTellOrganization &&
    dataToSend.append(
      "did_tell_organization",
      mediationRequest.didTellOrganization
    );
  mediationRequest.didOrganizationReply &&
    dataToSend.append(
      "did_organization_reply",
      mediationRequest.didOrganizationReply
    );
  mediationRequest.organizationReply !== undefined &&
    dataToSend.append("organization_reply", mediationRequest.organizationReply);
  mediationRequest.furtherInfo !== undefined &&
    dataToSend.append("further_info", mediationRequest.furtherInfo);
  if (mediationRequest.removeAttachedFile) {
    dataToSend.append("attached_file", new File([], ""));
  } else if (
    mediationRequest.attachedFile !== undefined &&
    mediationRequest.attachedFile.length
  ) {
    dataToSend.append("attached_file", mediationRequest.attachedFile[0]);
  }
  mediationRequest.organizationName !== undefined &&
    dataToSend.append("organization_name", mediationRequest.organizationName);
  mediationRequest.organizationAddress !== undefined &&
    dataToSend.append(
      "organization_address",
      mediationRequest.organizationAddress
    );
  mediationRequest.organizationEmail !== undefined &&
    dataToSend.append("organization_email", mediationRequest.organizationEmail);
  mediationRequest.organizationPhoneNumber !== undefined &&
    dataToSend.append(
      "organization_phone_number",
      mediationRequest.organizationPhoneNumber
    );
  mediationRequest.organizationContact !== undefined &&
    dataToSend.append(
      "organization_contact",
      mediationRequest.organizationContact
    );
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
  const key = [`/api/mediation-requests/`, token];
  return useMutation(editMediationRequest, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: MediationRequest[]) => {
          return current.map((mediationRequest) => {
            const isTheNewRequest =
              mediationRequest.id === input.mediationRequestId;
            if (isTheNewRequest) {
              return produce(input.mediationRequest, (draft) => {
                draft.id = mediationRequest.id;
                draft.modificationDate = mediationRequest.modificationDate;
                const askForFileRemoval = draft.removeAttachedFile;
                const noFileProvidedByUser =
                  draft.attachedFile && !draft.attachedFile.length;
                const fileAlreadyExists = mediationRequest.attachedFile;
                if (askForFileRemoval) {
                  draft.attachedFile = "";
                } else if (noFileProvidedByUser && fileAlreadyExists) {
                  draft.attachedFile = mediationRequest.attachedFile;
                } else if (noFileProvidedByUser && !fileAlreadyExists) {
                  // avoid a visual bug when updating optimistically
                  // while there is no attached file
                  draft.attachedFile = "";
                } else {
                  draft.attachedFile = "#";
                }
              });
            } else {
              return mediationRequest;
            }
          });
        },
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

type DeleteRequestProps = {
  mediationRequest: MediationRequest;
  token: string;
};

async function deleteMediationRequest({
  mediationRequest,
  token,
}: DeleteRequestProps): Promise<AxiosResponse<MediationRequestToSend>> {
  try {
    const response = await axios.delete<MediationRequestToSend>(
      `/api/mediation-requests/${mediationRequest.id}/`,
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

type UseDeleteMediationRequestProps = {
  token: string;
  onSuccess: () => void;
  onFailure: () => void;
};

/**
 * Delete a mediation request.
 * Hook using use-mutation lib, to make delete request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param {object} obj authentication token and two functions
 *   to be called when the backend reply arrives.
 *   One in case of success and one in case of failure.
 * @returns array containing a function to delete a mediation request,
 *   and an object with additional information like errors.
 */
export function useDeleteMediationRequest({
  token,
  onSuccess,
  onFailure,
}: UseDeleteMediationRequestProps) {
  const key = [`/api/mediation-requests/`, token];
  return useMutation(deleteMediationRequest, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: MediationRequest[]) => {
          const mediationRequestsUpdated = produce(current, (draftState) => {
            const index = draftState.findIndex((mediationRequest) => {
              return mediationRequest.id === input.mediationRequest.id;
            });
            draftState.splice(index, 1);
          });
          return mediationRequestsUpdated;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      onSuccess && onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      onFailure && onFailure();
    },
  });
}

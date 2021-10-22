import { useParams } from "react-router-dom";
import useSWR from "swr";
import { keysToCamel } from "../utils";
import { fetcher } from "./fetcher";
import useSwrWithStorage from "./useSwrWithStorage";

/**
 * Return up to date mediation requests, handling calls to the backend,
 * and storing in local storage for offline use.
 * @param {string} token the authentication token to make the query.
 * @returns data and error if any.
 */
function useUserMediationRequests(token) {
  const { data, error } = useSwrWithStorage(
    "/api/mediation-requests/user/",
    token,
    true
  );
  return {
    userMediationRequests: data,
    userMediationRequestsError: error,
  };
}

/**
 * Return up to date user details, handling calls to the backend,
 * and storing in local storage for offline use.
 * @param {string} token the authentication token to make the query.
 * @returns data and error if any.
 */
function useUserDetails(token) {
  const { data, error } = useSwrWithStorage("/auth/users/me/", token, true);
  return {
    userDetails: data,
    userDetailsError: error,
  };
}

/**
 * Return the current organization application details.
 * @param {object} initialOrganizationApp the initial organization application
 *   data sent by the backend. Can be null.
 * @param {string} organizationSlug the organization slug from the current path.
 * @param {string} applicationSlug the application slug from the current path.
 * @returns data and error if any.
 */
function useOrganizationApp(initialOrganizationApp?: any) {
  const { organizationSlug, applicationSlug } = useParams();
  const { data, error, mutate } = useSWR(
    Boolean(organizationSlug && applicationSlug)
      ? `/api/organizations/${organizationSlug}/applications/${applicationSlug}/`
      : null,
    fetcher,
    { initialData: initialOrganizationApp }
  );
  return {
    organizationApp: keysToCamel(data),
    organizationAppError: error,
    mutateOrganizationApp: mutate,
  };
}

export { useUserMediationRequests, useUserDetails, useOrganizationApp };

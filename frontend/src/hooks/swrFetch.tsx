import { useParams } from "react-router-dom";
import useSWR from "swr";
import { MediationRequest } from "../types/mediationRequest";
import { UserDetails } from "../types/userDetails";
import { keysToCamel } from "../utils";
import { fetcher } from "./fetcher";
import useSwrWithStorage from "./useSwrWithStorage";

/**
 * Return up to date mediation requests, handling calls to the backend,
 * and storing in local storage for offline use.
 * @param token the authentication token to make the query.
 * @returns data and error if any.
 */
function useUserMediationRequests(token: string) {
  const { data, error } = useSwrWithStorage<MediationRequest[]>(
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
 * @param token the authentication token to make the query.
 * @returns data and error if any.
 */
function useUserDetails(token: string) {
  const { data, error } = useSwrWithStorage<UserDetails>(
    "/auth/users/me/",
    token,
    true
  );
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
  const { organizationSlug, applicationSlug } = useParams<{
    organizationSlug: string;
    applicationSlug: string;
  }>();
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

/**
 * Return footer links in the "about" category.
 *
 * @returns data and error if any.
 */
function useFooterAboutService() {
  const { data, error } = useSWR("/api/configuration/about-service/", fetcher);
  return {
    footerAboutService: keysToCamel(data),
    footerAboutServiceError: error,
  };
}

/**
 * Return footer contact information.
 *
 * @returns data and error if any.
 */
function useFooterContactInformation() {
  const { data, error } = useSWR(
    "/api/configuration/contact-information/",
    fetcher
  );
  return {
    footerContactInformation: keysToCamel(data),
    footerContactInformationError: error,
  };
}

export {
  useUserMediationRequests,
  useUserDetails,
  useOrganizationApp,
  useFooterAboutService,
  useFooterContactInformation,
};

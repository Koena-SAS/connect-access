import { useParams } from "react-router-dom";
import useSWR from "swr";
import { MediationRequest } from "../types/mediationRequest";
import { keysToCamel } from "../utils";
import { fetcherWithToken } from "./fetcher";

/**
 * Return all the mediation requests.
 * @param {string} token the authentication token to make the query.
 * @returns data, mutate function, and error if any.
 */
function useAdminMediationRequests(token) {
  const { data, error, mutate } = useSWR(
    token ? ["/api/mediation-requests/", token] : null,
    fetcherWithToken
  );
  return {
    mediationRequests: keysToCamel(data),
    mediationRequestsError: error,
    mutateMediationRequests: mutate,
  };
}

type UseAdminMediationRequestProps = {
  mediationRequest: MediationRequest;
  mediationRequestsError: any;
  mutateMediationRequests: any;
};

/**
 * Return the current mediation requests, according to the id from the path.
 * @param {string} token the authentication token to make the query.
 * @returns data, mutate function, and error if any.
 */
function useAdminMediationRequest(token): UseAdminMediationRequestProps {
  const { mediationRequests, mediationRequestsError, mutateMediationRequests } =
    useAdminMediationRequests(token);
  const { requestId } = useParams<{
    requestId: string;
  }>();
  const foundRequest =
    mediationRequests &&
    mediationRequests.filter(function findMediationRequestById(request) {
      return request.id === requestId;
    });
  const mediationRequest =
    foundRequest && foundRequest.length === 1 && foundRequest[0];
  return {
    mediationRequest: mediationRequest,
    mediationRequestsError,
    mutateMediationRequests,
  };
}

/**
 * Return all trace reports of a specific mediation request.
 * @param {string} token the authentication token to make the query.
 * @returns data, function, and error if any.
 */
function useAdminTraceReports(token) {
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  const { data, error } = useSWR(
    token
      ? [`/api/trace-reports/mediation-request/${mediationRequestId}/`, token]
      : null,
    fetcherWithToken
  );
  return {
    traceReports: keysToCamel(data),
    traceReportsError: error,
  };
}

export {
  useAdminMediationRequests,
  useAdminTraceReports,
  useAdminMediationRequest,
};

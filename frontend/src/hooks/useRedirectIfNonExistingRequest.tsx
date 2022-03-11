import { useHistory } from "react-router-dom";
import { PATHS } from "../constants/paths";
import {
  useAdminMediationRequest,
  useAdminMediationRequests,
} from "./swrAdminFetch";
import useGeneratePrefixedPath from "./useGeneratePrefixedPath";

/**
 * Checks wether we are trying to access to the details of a
 * mediation request that does not exist in the admin panel.
 * If that's the case, redirects to the admin "all requests"
 * page.
 * @param token the session token
 */
function useRedirectIfNonExistingRequest(token: string) {
  const generatePrefixedPath = useGeneratePrefixedPath();
  const history = useHistory();
  const { mediationRequest } = useAdminMediationRequest(token);
  const { mediationRequests } = useAdminMediationRequests(token);
  if (mediationRequests && !mediationRequest) {
    history.push(generatePrefixedPath(PATHS.ADMIN_ALL_REQUESTS));
  }
}

export default useRedirectIfNonExistingRequest;

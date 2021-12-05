import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUserMediationRequests } from "../../hooks";
import { MediationRequestsDetail } from "../../mediationRequests";

type UserMediationProps = {
  /**
   * The authentication token given when user is logged in.
   */
  token: string;
};

/**
 * List logged in user's mediation requests.
 */
function UserMediation({ token }: UserMediationProps) {
  const { userMediationRequests } = useUserMediationRequests(token);
  let { requestId } = useParams<{ requestId: string }>();
  const mediationRequest = useMemo(
    () =>
      userMediationRequests &&
      userMediationRequests.find((request) => {
        return request.id.toString() === requestId.toString();
      }),
    [userMediationRequests, requestId]
  );
  return (
    <div className="user-mediation page-base">
      <h1 className="page-base__title">
        <Trans>Mediation request details:</Trans>{" "}
        {mediationRequest && mediationRequest.organizationName}
      </h1>
      <div className="page-base__content user-mediation__content">
        {mediationRequest && (
          <MediationRequestsDetail
            mediationRequest={mediationRequest}
            titlesHeadingLevel={2}
          />
        )}
      </div>
    </div>
  );
}

export default UserMediation;

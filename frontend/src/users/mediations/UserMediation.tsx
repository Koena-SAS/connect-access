import { Trans } from "@lingui/macro";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUserMediationRequests } from "../../hooks";
import { MediationRequestsDetail } from "../../mediationRequests";

/**
 * List logged in user's mediation requests.
 */
function UserMediation({ token }) {
  const { userMediationRequests } = useUserMediationRequests(token);
  let { requestId } = useParams();
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

UserMediation.propTypes = {
  /**
   * The authentication token given when user is logged in.
   */
  token: PropTypes.string.isRequired,
};

export default UserMediation;

import { Trans } from "@lingui/macro";
import { PATHS } from "../../constants/paths";
import { useUserMediationRequests } from "../../hooks";
import { MediationRequestsList } from "../../mediationRequests";

type UserMediationsProps = {
  /**
   * The authentication token given when user is logged in.
   */
  token: string;
};

/**
 * List logged in user's mediation requests.
 */
function UserMediations({ token }: UserMediationsProps) {
  const { userMediationRequests } = useUserMediationRequests(token);
  return (
    <div className="user-mediations page-base">
      <h1 className="page-base__title">
        <Trans>All requests</Trans>
      </h1>
      <div className="page-base__content user-mediations__content">
        {userMediationRequests && (
          <MediationRequestsList
            mediationRequests={userMediationRequests}
            detailsPath={PATHS.USER_REQUEST}
          />
        )}
      </div>
    </div>
  );
}

export default UserMediations;

import { Trans } from "@lingui/macro";
import UserDetails from "./UserDetails";

/**
 * Display user account related information.
 */
function Account({ token }: { token: string }) {
  return (
    <div className="user-account page-base">
      <h1 className="page-base__title">
        <Trans>My account</Trans>
      </h1>
      <div className="page-base__content user-account__content">
        <UserDetails token={token} />
      </div>
    </div>
  );
}

export default Account;

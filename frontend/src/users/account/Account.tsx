import { Trans } from "@lingui/macro";
import PropTypes from "prop-types";
import React from "react";
import UserDetails from "./UserDetails";

/**
 * Display user account related information.
 */
function Account({ token }) {
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

Account.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Account;

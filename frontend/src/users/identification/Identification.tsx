import { t } from "@lingui/macro";
import PropTypes from "prop-types";
import React from "react";
import { PATHS } from "../../constants/paths";
import Tabs from "../../forms/Tabs";
import Login from "./Login";
import Signup from "./Signup";

/**
 * Login and signup forms, controlled by tabs.
 */
function Identification({ setToken, onClose, shouldFocus }) {
  const tabsInfos = [
    {
      element: (
        <Login setToken={setToken} handleCloseIdentification={onClose} />
      ),
      pageTitle: t`Koena Connect - Login`,
      label: t`Log in`,
      path: PATHS.LOGIN,
    },
    {
      element: (
        <Signup setToken={setToken} handleCloseIdentification={onClose} />
      ),
      pageTitle: t`Koena Connect - Signup`,
      label: t`Signup`,
      path: PATHS.REGISTER,
    },
  ];
  return (
    <div className="identification__container">
      <Tabs
        tabsInfos={tabsInfos}
        label={t`Log in or sign up`}
        shouldFocus={shouldFocus}
      />
    </div>
  );
}

Identification.defaultProps = {
  shouldFocus: false,
};

Identification.propTypes = {
  /**
   * Set login token for user authentication.
   */
  setToken: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  /**
   * Whether the first tabbable element should get the focus.
   */
  shouldFocus: PropTypes.bool,
};

export default Identification;

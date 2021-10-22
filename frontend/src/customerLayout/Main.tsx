import { t } from "@lingui/macro";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Snackbar from "../forms/Snackbar";
import { useUserDetails } from "../hooks";
import { FormContainer } from "../mediationForm";
import Page from "../Page";
import {
  Account,
  IdentificationLayout,
  PasswordResetConfirm,
  UserMediation,
  UserMediations,
} from "../users";

/**
 * Main content with different pages.
 */
function Main({
  token,
  setToken,
  isLogged,
  activeMediationFormStep,
  setActiveMediationFormStep,
  paths,
  initialOrganizationApp,
}) {
  const { userDetails } = useUserDetails(token);
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const [requestFailureMessageOpen, setRequestFailureMessageOpen] =
    useState(false);
  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const displayRequestFailure = () => {
    setRequestFailureMessageOpen(true);
  };
  const ClosePasswordConfirmSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const ClosePasswordFailureMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  return (
    <main role="main" id="main" className="customer-layout__main main">
      <Switch>
        <Route
          path={[
            paths.ROOT,
            paths.PROBLEM_DESCRIPTION,
            paths.ORGANIZATION_INFO,
            paths.RECAP,
            paths.LOGIN,
            paths.REGISTER,
            paths.RESET_PASSWORD,
          ]}
          exact
        >
          <IdentificationLayout setToken={setToken} isLogged={isLogged} />
          <FormContainer
            activeStep={activeMediationFormStep}
            setActiveStep={setActiveMediationFormStep}
            userId={userDetails && userDetails.id}
            token={token}
            initialOrganizationApp={initialOrganizationApp}
          />
        </Route>
        <Route path={paths.RESET_PASSWORD_CONFIRM} exact>
          <Page title={t`Koena Connect - Confirm password reset`}>
            {!isLogged && (
              <PasswordResetConfirm
                displayRequestSuccess={displayRequestSuccess}
                displayRequestFailure={displayRequestFailure}
              />
            )}
          </Page>
        </Route>
        <Route path={paths.USER_DETAILS} exact>
          <Page title={t`Koena Connect - My account`}>
            {isLogged && <Account token={token} />}
          </Page>
        </Route>
        <Route path={paths.USER_REQUESTS} exact>
          <Page title={t`Koena Connect - My mediation requests`}>
            {isLogged && <UserMediations token={token} />}
          </Page>
        </Route>
        <Route path={paths.USER_REQUEST} exact>
          <Page title={t`Koena Connect - My mediation request detail`}>
            {isLogged && <UserMediation token={token} />}
          </Page>
        </Route>
      </Switch>
      <Snackbar
        notificationText={t`Your password has been successfully changed.`}
        open={requestSuccessMessageOpen}
        onClose={ClosePasswordConfirmSuccessMessage}
        severity="success"
      />
      <Snackbar
        notificationText={t`We were unable to change your password, please try again later.`}
        open={requestFailureMessageOpen}
        onClose={ClosePasswordFailureMessage}
        severity="error"
      />
    </main>
  );
}

Main.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  /**
   * Set login token for user authentication.
   */
  setToken: PropTypes.func.isRequired,
  /**
   * The authentication token given when user is logged in.
   */
  token: PropTypes.string,
  activeMediationFormStep: PropTypes.number.isRequired,
  setActiveMediationFormStep: PropTypes.func.isRequired,
  paths: PropTypes.objectOf(PropTypes.string),
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp: PropTypes.object,
};

export default Main;

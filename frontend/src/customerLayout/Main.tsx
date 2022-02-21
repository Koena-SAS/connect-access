import { t } from "@lingui/macro";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { useContext, useState } from "react";
import { Route, Switch } from "react-router-dom";
import TermsOfService from "../additionalPages/TermsOfService";
import type { Paths } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import Snackbar from "../forms/Snackbar";
import { useUserDetails } from "../hooks";
import { FormContainer } from "../mediationForm";
import type { Step } from "../mediationForm/StepsInitializer";
import Page from "../Page";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import { ConfigData } from "../types/types";
import {
  Account,
  IdentificationLayout,
  PasswordResetConfirm,
  UserMediation,
  UserMediations,
} from "../users";

type MainProps = {
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
  /**
   * The authentication token given when user is logged in.
   */
  token?: string;
  activeMediationFormStep: Step;
  setActiveMediationFormStep: (activeMediationFormStep: Step) => void;
  paths: Paths;
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationAppRecieved;
};

/**
 * Main content with different pages.
 */
function Main({
  token,
  setToken,
  activeMediationFormStep,
  setActiveMediationFormStep,
  paths,
  initialOrganizationApp,
}: MainProps) {
  const isLogged = token !== undefined;
  const configData = useContext<ConfigData>(ConfigDataContext);
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
  const ClosePasswordConfirmSuccessMessage = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const ClosePasswordFailureMessage = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
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
          <Page title={t`${configData.platformName} - Confirm password reset`}>
            {!isLogged && (
              <PasswordResetConfirm
                displayRequestSuccess={displayRequestSuccess}
                displayRequestFailure={displayRequestFailure}
              />
            )}
          </Page>
        </Route>
        <Route path={paths.USER_DETAILS} exact>
          <Page title={t`${configData.platformName} - My account`}>
            {isLogged && <Account token={token} />}
          </Page>
        </Route>
        <Route path={paths.USER_REQUESTS} exact>
          <Page title={t`${configData.platformName} - My mediation requests`}>
            {isLogged && <UserMediations token={token} />}
          </Page>
        </Route>
        <Route path={paths.USER_REQUEST} exact>
          <Page
            title={t`${configData.platformName} - My mediation request detail`}
          >
            {isLogged && <UserMediation token={token} />}
          </Page>
        </Route>
        <Route path={paths.TERMS_OF_SERVICE} exact>
          <Page title={t`${configData.platformName} - Terms of service`}>
            <TermsOfService />
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

export default Main;

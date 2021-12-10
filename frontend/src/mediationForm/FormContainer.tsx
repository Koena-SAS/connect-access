import { t, Trans } from "@lingui/macro";
import type { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import produce from "immer";
import { createStore, StateMachineProvider } from "little-state-machine";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import Snackbar from "../forms/Snackbar";
import { useGeneratePrefixedPath, useOrganizationApp } from "../hooks";
import Page from "../Page";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import { ConfigData } from "../types/types";
import OrganizationInfo from "./OrganizationInfo";
import ProblemDescription from "./ProblemDescription";
import Recap from "./Recap";
import type { Completed, Step } from "./StepsInitializer";
import StepsInitializer from "./StepsInitializer";
import { initialState } from "./updateAction";
import UserInfo from "./UserInfo";

createStore(initialState);

type FormContainerProps = {
  activeStep: Step;
  setActiveStep: (step: Step) => void;
  /**
   * The id of the currently logged user.
   */
  userId?: string;
  /**
   * The authentication token.
   */
  token?: string;
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationAppRecieved;
};

/**
 * Main form to send a mediation request, and displayed on the homepage.
 */
function FormContainer({
  activeStep,
  setActiveStep,
  userId,
  token,
  initialOrganizationApp,
}: FormContainerProps) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  const [completed, setCompleted] = useState<Completed>({});
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const [shouldTriggerFocus, setShouldTriggerFocus] = useState(false);
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const [requestFailureMessageOpen, setRequestFailureMessageOpen] =
    useState(false);
  const location = useLocation();
  const recapStep = organizationApp ? 2 : 3;

  useEffect(() => {
    if (location.pathname === generatePrefixedPath(PATHS.ROOT)) {
      setActiveStep(0);
    } else if (
      location.pathname === generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION)
    ) {
      setActiveStep(1);
    } else if (
      location.pathname === generatePrefixedPath(PATHS.ORGANIZATION_INFO)
    ) {
      setActiveStep(2);
    } else if (location.pathname === generatePrefixedPath(PATHS.RECAP)) {
      setActiveStep(recapStep);
    }
  }, [location, setActiveStep, generatePrefixedPath, recapStep]);

  function setStepCompleted(step: Step): void {
    const newCompleted = produce(completed, (draftState) => {
      draftState[step] = true;
    });
    setCompleted(newCompleted);
  }
  const resetCompleted = () => {
    setCompleted({});
  };

  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const displayRequestFailure = () => {
    setRequestFailureMessageOpen(true);
  };
  const handleCloseSuccessMessage = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason | null
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason | null
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  return (
    <div className="mediation-request page-base">
      <h1
        className="mediation-request__title page-base__title"
        id="mediation-form-title"
      >
        <Trans>Submit a mediation request</Trans>
      </h1>
      <div className="mediation-request__content page-base__content">
        <Snackbar
          notificationText={t`Your mediation request has been successfully sent !`}
          open={requestSuccessMessageOpen}
          onClose={handleCloseSuccessMessage}
          severity="success"
        />
        <Snackbar
          notificationText={t`There was a technical error and the submission failed, please try again later`}
          open={requestFailureMessageOpen}
          onClose={handleCloseFailureMessage}
          severity="error"
        />
        <StateMachineProvider>
          <StepsInitializer
            setCompleted={setCompleted}
            completed={completed}
            initialOrganizationApp={initialOrganizationApp}
          />
          {activeStep === 0 && (
            <Page
              title={t`${configData.platformName} - Submit a mediation request: your details`}
            >
              <UserInfo
                activeStep={activeStep}
                setStepCompleted={() => setStepCompleted(0)}
                completed={completed}
                shouldTriggerFocus={shouldTriggerFocus}
                setShouldTriggerFocus={setShouldTriggerFocus}
                initialOrganizationApp={initialOrganizationApp}
              />
            </Page>
          )}
          {activeStep === 1 && (
            <Page
              title={t`${configData.platformName} - Submit a mediation request: your problem`}
            >
              <ProblemDescription
                activeStep={activeStep}
                setStepCompleted={() => setStepCompleted(1)}
                completed={completed}
                shouldTriggerFocus={shouldTriggerFocus}
                setShouldTriggerFocus={setShouldTriggerFocus}
                initialOrganizationApp={initialOrganizationApp}
              />
            </Page>
          )}
          {Boolean(activeStep === 2 && !organizationApp) && (
            <Page
              title={t`${configData.platformName} - Submit a mediation request: the organization`}
            >
              <OrganizationInfo
                activeStep={activeStep}
                setStepCompleted={() => setStepCompleted(2)}
                completed={completed}
                shouldTriggerFocus={shouldTriggerFocus}
                setShouldTriggerFocus={setShouldTriggerFocus}
                initialOrganizationApp={initialOrganizationApp}
              />
            </Page>
          )}
          {activeStep === recapStep && (
            <Page
              title={t`${configData.platformName} - Submit a mediation request: summary`}
            >
              <Recap
                activeStep={activeStep}
                completed={completed}
                resetCompleted={resetCompleted}
                shouldTriggerFocus={shouldTriggerFocus}
                setShouldTriggerFocus={setShouldTriggerFocus}
                userId={userId}
                displayRequestSuccessMessage={displayRequestSuccess}
                displayRequestFailureMessage={displayRequestFailure}
                token={token}
                initialOrganizationApp={initialOrganizationApp}
              />
            </Page>
          )}
        </StateMachineProvider>
      </div>
    </div>
  );
}

export default FormContainer;

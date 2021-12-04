import { Trans } from "@lingui/macro";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import axios from "axios";
import { useStateMachine } from "little-state-machine";
import { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { mutate } from "swr";
import { PATHS } from "../constants/paths";
import Button from "../forms/buttons/Button";
import { useGeneratePrefixedPath, useOrganizationApp } from "../hooks";
import MediationRequestsDetail from "../mediationRequests/MediationRequestsDetail";
import type { OrganizationApp } from "../types/organizationApp";
import FormNavigation from "./FormNavigation";
import type { Completed } from "./StepsInitializer";
import { resetState } from "./updateAction";
import { formStateToMediationRequests } from "./utils";

type RecapProps = RouteComponentProps & {
  /**
   * Indicates the figure of the current displayed form step.
   */
  activeStep: number;
  /**
   * List of the steps that have been completed, to determine
   * if the user have access to the next step or not.
   */
  completed: Completed;
  /**
   * Resets completed steps list.
   */
  resetCompleted: () => void;
  /**
   * Wether the focus should be placed on the active tab at init.
   */
  shouldTriggerFocus: boolean;
  /**
   * When true the focus will be placed at the active tab on next render,
   * and the value will be put to false again.
   */
  setShouldTriggerFocus: (shouldTriggerFocus: boolean) => void;
  /**
   * The id of the currently logged user.
   */
  userId?: string;
  /**
   * Trigger success notification when the mediation request has been
   * successfully submitted.
   */
  displayRequestSuccessMessage: () => void;
  /**
   * Trigger error notification when the mediation request has resulted
   * in an error.
   */
  displayRequestFailureMessage: () => void;
  /**
   * The authentication token.
   */
  token?: string;
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationApp;
};

/**
 * 4th step of the main mediation form, to summerize everything before submit.
 */
function Recap({
  history,
  activeStep,
  completed,
  resetCompleted,
  shouldTriggerFocus,
  setShouldTriggerFocus,
  userId,
  displayRequestSuccessMessage,
  displayRequestFailureMessage,
  token,
  initialOrganizationApp,
}: RecapProps) {
  const { state, actions } = useStateMachine({ resetState });
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const [shouldTriggerFocusLocal, setShouldTriggerFocusLocal] = useState(false);

  useEffect(() => {
    return shouldTriggerFocusLocal ? setShouldTriggerFocus(true) : null;
  }, [shouldTriggerFocusLocal, setShouldTriggerFocus]);

  const handleClickUserInfo = () => {
    history.push(generatePrefixedPath(PATHS.ROOT));
    setShouldTriggerFocusLocal(true);
  };
  const handleClickProblemDescription = () => {
    history.push(generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION));
    setShouldTriggerFocusLocal(true);
  };
  const handleClickOrganizationInfo = () => {
    history.push(generatePrefixedPath(PATHS.ORGANIZATION_INFO));
    setShouldTriggerFocusLocal(true);
  };
  const handleClickPrevious = () => {
    if (organizationApp) {
      history.push(generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION));
    } else {
      history.push(generatePrefixedPath(PATHS.ORGANIZATION_INFO));
    }
    setShouldTriggerFocusLocal(true);
  };

  const handleClickReset = () => {
    actions.resetState(null);
    resetCompleted();
    history.push(generatePrefixedPath(PATHS.ROOT));
  };
  const handleClickSubmit = () => {
    const dataToSend = new FormData();
    dataToSend.append("complainant", userId ? userId : "");
    dataToSend.append("application", organizationApp ? organizationApp.id : "");
    dataToSend.append("status", "WAITING_MEDIATOR_VALIDATION");
    dataToSend.append("first_name", state.userInfo.firstName);
    dataToSend.append("last_name", state.userInfo.lastName);
    dataToSend.append("email", state.userInfo.email);
    dataToSend.append("phone_number", state.userInfo.phoneNumber);
    Array.isArray(state.userInfo.assistiveTechnologyUsed) &&
      state.userInfo.assistiveTechnologyUsed.forEach((element) => {
        dataToSend.append("assistive_technology_used", element);
      });
    dataToSend.append("technology_name", state.userInfo.technologyName);
    dataToSend.append("technology_version", state.userInfo.technologyVersion);
    dataToSend.append("urgency", state.problemDescription.urgency);
    dataToSend.append(
      "issue_description",
      state.problemDescription.issueDescription
    );
    dataToSend.append(
      "step_description",
      state.problemDescription.stepDescription
    );
    dataToSend.append(
      "inaccessibility_level",
      state.problemDescription.inaccessibilityLevel
    );
    dataToSend.append("browser_used", state.problemDescription.browserUsed);
    dataToSend.append("url", state.problemDescription.url);
    dataToSend.append("browser", state.problemDescription.browser);
    dataToSend.append(
      "browser_version",
      state.problemDescription.browserVersion
    );
    dataToSend.append("mobileAppUsed", state.problemDescription.mobileAppUsed);
    dataToSend.append(
      "mobileAppPlatform",
      state.problemDescription.mobileAppPlatform
    );
    dataToSend.append("mobileAppName", state.problemDescription.mobileAppName);
    dataToSend.append(
      "otherUsedSoftware",
      state.problemDescription.otherUsedSoftware
    );

    if (!organizationApp) {
      dataToSend.append(
        "did_tell_organization",
        state.problemDescription.didTellOrganization
      );
      dataToSend.append(
        "did_organization_reply",
        state.problemDescription.didOrganizationReply
      );
      dataToSend.append(
        "organization_reply",
        state.problemDescription.organizationReply
      );
    }

    dataToSend.append("further_info", state.problemDescription.furtherInfo);
    if (
      state.problemDescription.attachedFile instanceof FileList &&
      state.problemDescription.attachedFile.length > 0
    ) {
      dataToSend.append(
        "attached_file",
        state.problemDescription.attachedFile[0]
      );
    }

    if (!organizationApp) {
      dataToSend.append("organization_name", state.organizationInfo.name);
      dataToSend.append(
        "organization_address",
        state.organizationInfo.mailingAddress
      );
      dataToSend.append("organization_email", state.organizationInfo.email);
      dataToSend.append(
        "organization_phone_number",
        state.organizationInfo.phoneNumber
      );
      dataToSend.append("organization_contact", state.organizationInfo.contact);
    }

    axios
      .post("/api/mediation-requests/", dataToSend, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        displayRequestSuccessMessage();
        mutate(["/api/mediation-requests/user/", token]);
        handleClickReset();
      })
      .catch(() => {
        displayRequestFailureMessage();
      });
  };
  const additionalComponents = {
    personalInformation: (
      <Button
        size="medium"
        type="button"
        className="recap-section__button"
        onClick={handleClickUserInfo}
      >
        <Trans>Modify your data</Trans>
      </Button>
    ),
    problemDescription: (
      <Button
        size="medium"
        type="button"
        className="recap-section__button"
        onClick={handleClickProblemDescription}
      >
        <Trans>Modify your problem description</Trans>
      </Button>
    ),
    organization: (
      <Button
        size="medium"
        type="button"
        className="recap-section__button"
        onClick={handleClickOrganizationInfo}
      >
        <Trans>Modify organization data</Trans>
      </Button>
    ),
  };
  const tabId = organizationApp ? "2" : "3";
  return (
    <>
      <FormNavigation
        activeStep={activeStep}
        completed={completed}
        onChangeTab={async (): Promise<boolean> => true}
        shouldTriggerFocus={shouldTriggerFocus}
        setShouldTriggerFocus={setShouldTriggerFocus}
        initialOrganizationApp={initialOrganizationApp}
      />
      <div
        role="tabpanel"
        id={`mediation-tabpanel-${tabId}`}
        aria-labelledby={`mediation-tab-${tabId}`}
        className="mediation-tabpanel mediation-request__form"
      >
        <div className="mediation-tabpanel__title-container">
          <h2 className="mediation-tabpanel__title">
            {organizationApp ? (
              <Trans>Step 3: Summary</Trans>
            ) : (
              <Trans>Step 4: Summary</Trans>
            )}
          </h2>
        </div>
        <div className="mediation-tabpanel__form">
          <MediationRequestsDetail
            mediationRequest={formStateToMediationRequests(state)}
            additionalComponents={additionalComponents}
            titlesHeadingLevel={3}
          />
          <div className="mediation-tabpanel__buttons three-button">
            <Button
              size="large"
              type="button"
              className="mediation-tabpanel__back-button"
              onClick={handleClickPrevious}
              startIcon={<ArrowBackIcon />}
            >
              {organizationApp ? (
                <Trans>Step 2: Your problem</Trans>
              ) : (
                <Trans>Step 3: The organization</Trans>
              )}
            </Button>
            <Button
              size="large"
              type="button"
              className="mediation-tabpanel__clear-button"
              onClick={handleClickReset}
              endIcon={<ClearIcon />}
            >
              <Trans>Reset all entered data</Trans>
            </Button>
            <Button
              size="large"
              type="button"
              className="mediation-tabpanel__submit-button"
              onClick={handleClickSubmit}
              endIcon={<DoneIcon />}
            >
              <Trans>Submit my mediation request</Trans>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(Recap);

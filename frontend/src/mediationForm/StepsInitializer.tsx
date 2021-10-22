import { useStateMachine } from "little-state-machine";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { useGeneratePrefixedPath, useOrganizationApp } from "../hooks";
import { organizationInfoStepComplete } from "./OrganizationInfo";
import { problemDescriptionStepComplete } from "./ProblemDescription";
import { userInfoStepComplete } from "./UserInfo";

/**
 * Initialize completed steps and routes away from unothorized step
 * if needed.
 */
function StepsInitializer({
  completed,
  setCompleted,
  history,
  initialOrganizationApp,
}) {
  const { state } = useStateMachine();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  let stepToUrl;
  if (organizationApp) {
    stepToUrl = {
      0: generatePrefixedPath(PATHS.ROOT),
      1: generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION),
      2: generatePrefixedPath(PATHS.RECAP),
    };
  } else {
    stepToUrl = {
      0: generatePrefixedPath(PATHS.ROOT),
      1: generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION),
      2: generatePrefixedPath(PATHS.ORGANIZATION_INFO),
      3: generatePrefixedPath(PATHS.RECAP),
    };
  }
  useEffect(() => {
    const initialCompleted = { ...completed };

    function initializeCompleted() {
      if (userInfoStepComplete(state.userInfo)) {
        initialCompleted[0] = true;
        if (problemDescriptionStepComplete(state.problemDescription)) {
          initialCompleted[1] = true;
          if (
            organizationInfoStepComplete(state.organizationInfo) &&
            !organizationApp
          ) {
            initialCompleted[2] = true;
          }
        }
      }
      setCompleted(initialCompleted);
    }
    initializeCompleted();

    function redirectInitiallyIfNeeded() {
      const askedStep =
        Object.keys(stepToUrl).find(
          (step) => stepToUrl[step] === history.location.pathname
        ) || "0";
      const askedStepNum = parseInt(askedStep);
      if (askedStepNum !== 0 && !initialCompleted[askedStepNum - 1]) {
        redirectToNeerestStep(askedStepNum, initialCompleted);
      }
    }
    redirectInitiallyIfNeeded();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function redirectToNeerestStep(askedStep, initialCompleted) {
    for (let i = askedStep - 1; i >= 0; i--) {
      if (i === 0 || initialCompleted[i - 1]) {
        history.push(stepToUrl[i]);
        return;
      }
    }
  }
  return null;
}

StepsInitializer.propTypes = {
  /**
   * List of the steps that have been completed, to determine
   * if the user have access to the next step or not.
   */
  completed: PropTypes.objectOf(PropTypes.bool).isRequired,
  /**
   * Change the list of the unlocked steps.
   */
  setCompleted: PropTypes.func.isRequired,
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp: PropTypes.object,
};

export default withRouter(StepsInitializer);

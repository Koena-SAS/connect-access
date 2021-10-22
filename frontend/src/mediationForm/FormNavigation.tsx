import { t } from "@lingui/macro";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef } from "react";
import { withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import {
  useGeneratePrefixedPath,
  useOrganizationApp,
  useWindowDimensions,
} from "../hooks";

/**
 * Mediation form navigation between steps.
 */
function FormNavigation({
  activeStep,
  completed,
  history,
  onChangeTab,
  shouldTriggerFocus,
  setShouldTriggerFocus,
  initialOrganizationApp,
}) {
  const tabs = useRef({});
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const { width: windowWidth } = useWindowDimensions();
  const isTablistVertical = Boolean(windowWidth <= 850);
  useEffect(() => {
    if (shouldTriggerFocus) {
      tabs.current[activeStep].focus();
      setShouldTriggerFocus(false);
    }
  }, [shouldTriggerFocus, setShouldTriggerFocus, activeStep]);
  let stepLabels;
  if (organizationApp) {
    stepLabels = [t`About you`, t`Your problem`, t`Summary`];
  } else {
    stepLabels = [
      t`About you`,
      t`Your problem`,
      t`The organization`,
      t`Summary`,
    ];
  }
  function tabProps(index, isActiveTab) {
    const props = {
      id: `mediation-tab-${index}`,
      role: "tab",
    };
    if (isActiveTab) {
      props["aria-controls"] = `mediation-tabpanel-${index}`;
    }
    return props;
  }
  const handleChangeTab = (newValue) => async () => {
    if (completed[newValue] || completed[newValue - 1]) {
      const isFormValid = await onChangeTab();
      if (isFormValid) {
        if (newValue === 0) {
          history.push(generatePrefixedPath(PATHS.ROOT));
        } else if (newValue === 1) {
          history.push(generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION));
        } else if (newValue === 2) {
          if (organizationApp) {
            history.push(generatePrefixedPath(PATHS.RECAP));
          } else {
            history.push(generatePrefixedPath(PATHS.ORGANIZATION_INFO));
          }
        } else if (newValue === 3) {
          history.push(generatePrefixedPath(PATHS.RECAP));
        }
        tabs.current[newValue].focus();
        setShouldTriggerFocus(true);
      }
    }
  };
  const maxCompleted = useMemo(() => {
    if (completed[2]) {
      if (organizationApp) {
        return 2;
      } else {
        return 3;
      }
    } else if (completed[1]) {
      return 2;
    } else {
      return 1;
    }
  }, [completed, organizationApp]);
  const selectNextTab = (index) => {
    const nextIndex = (index + 1) % (maxCompleted + 1);
    if (completed[nextIndex] || completed[nextIndex - 1]) {
      tabs.current[nextIndex].focus();
    }
  };
  const selectPreviousTab = (index) => {
    const previousIndex = (maxCompleted + index) % (maxCompleted + 1);
    if (completed[previousIndex] || completed[previousIndex - 1]) {
      tabs.current[previousIndex].focus();
    }
  };
  const handleKeyDown = (index) => async (event) => {
    if (completed[index] || completed[index - 1]) {
      const nextArrowKey = isTablistVertical ? "ArrowDown" : "ArrowRight";
      const previousArrowKey = isTablistVertical ? "ArrowUp" : "ArrowLeft";
      if (event.key === nextArrowKey) {
        event.preventDefault();
        selectNextTab(index);
      } else if (event.key === previousArrowKey) {
        event.preventDefault();
        selectPreviousTab(index);
      }
    }
  };

  return (
    <>
      <div
        role="tablist"
        className="mediation-request__navigation"
        aria-labelledby="mediation-form-title"
        aria-orientation={isTablistVertical ? "vertical" : "horizontal"}
      >
        <Stepper nonLinear activeStep={activeStep} className="stepper">
          {stepLabels.map((label, index) => {
            const disabled = index !== 0 && !completed[index - 1];
            const iconLabel = completed[index] ? t`Completed` : `${index + 1}`;
            const isActiveStep = activeStep === index;
            return (
              <Step
                key={label}
                className="stepper__step"
                completed={completed[index]}
              >
                <StepButton
                  onClick={handleChangeTab(index)}
                  onKeyDown={handleKeyDown(index)}
                  className={`stepper__button ${isActiveStep ? "active" : ""} ${
                    !disabled ? "unlocked" : ""
                  }`}
                  tabIndex={isActiveStep ? 0 : -1}
                  aria-selected={isActiveStep ? "true" : "false"}
                  disabled={disabled}
                  {...tabProps(index, isActiveStep)}
                  ref={(element) => (tabs.current[index] = element)}
                >
                  <span className="sr-only">{iconLabel} - </span>
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </>
  );
}

FormNavigation.propTypes = {
  /**
   * Indicates the figure of the current displayed form step.
   */
  activeStep: PropTypes.number.isRequired,
  /**
   * List of the steps that have been completed, to determine
   * if the user have access to the next step or not.
   */
  completed: PropTypes.objectOf(PropTypes.bool).isRequired,
  /**
   * Function called when tab changing asked by the user. The
   * tab changing should not happen if the function doesn't return
   * a positive value.
   */
  onChangeTab: PropTypes.func.isRequired,
  /**
   * Wether the focus should be placed on the active tab at init.
   */
  shouldTriggerFocus: PropTypes.bool.isRequired,
  /**
   * When true the focus will be placed at the active tab on next render,
   * and the value will be put to false again.
   */
  setShouldTriggerFocus: PropTypes.func.isRequired,
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp: PropTypes.object,
};

export default withRouter(FormNavigation);

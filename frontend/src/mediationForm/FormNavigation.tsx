import { t } from "@lingui/macro";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { useEffect, useMemo, useRef } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import {
  useGeneratePrefixedPath,
  useOrganizationApp,
  useWindowDimensions,
} from "../hooks";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import { PartialRecord } from "../types/utilTypes";
import type { Completed, Step as StepType } from "./StepsInitializer";

type FormNavigationProps = RouteComponentProps & {
  /**
   * Indicates the figure of the current displayed form step.
   */
  activeStep: StepType;
  /**
   * List of the steps that have been completed, to determine
   * if the user have access to the next step or not.
   */
  completed: Completed;
  /**
   * Function called when tab changing asked by the user. The
   * tab changing should not happen if the function doesn't return
   * a positive value.
   */
  onChangeTab: () => Promise<boolean>;
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
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationAppRecieved;
};

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
}: FormNavigationProps) {
  const tabs = useRef<PartialRecord<StepType, HTMLElement>>({});
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const { width: windowWidth } = useWindowDimensions();
  const isTablistVertical = Boolean(windowWidth <= 850);
  useEffect(() => {
    if (shouldTriggerFocus) {
      tabs.current[activeStep]?.focus();
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
  function tabProps(index: StepType, isActiveTab: boolean) {
    type TabProps = {
      id: string;
      role: string;
      "aria-selected": "true" | "false";
      "aria-controls"?: string;
      tabIndex: 0 | -1;
    };
    const props: TabProps = {
      id: `mediation-tab-${index}`,
      role: "tab",
      "aria-selected": isActiveTab ? "true" : "false",
      tabIndex: isActiveTab ? 0 : -1,
    };
    if (isActiveTab) {
      props["aria-controls"] = `mediation-tabpanel-${index}`;
    }
    return props;
  }
  const handleChangeTab = (newValue: StepType) => async () => {
    if (completed[newValue] || completed[(newValue - 1) as StepType]) {
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
        tabs.current[newValue]?.focus();
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
  const selectNextTab = (index: StepType) => {
    const nextIndex = ((index + 1) % (maxCompleted + 1)) as StepType;
    if (completed[nextIndex] || completed[(nextIndex - 1) as StepType]) {
      tabs.current[nextIndex]?.focus();
    }
  };
  const selectPreviousTab = (index: StepType) => {
    const previousIndex = ((maxCompleted + index) %
      (maxCompleted + 1)) as StepType;
    if (
      completed[previousIndex] ||
      completed[(previousIndex - 1) as StepType]
    ) {
      tabs.current[previousIndex]?.focus();
    }
  };
  const handleKeyDown =
    (index: StepType) =>
    async (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (completed[index] || completed[(index - 1) as StepType]) {
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
      <div className="mediation-request__navigation">
        <Stepper
          nonLinear
          activeStep={activeStep}
          className="stepper"
          role="tablist"
          aria-labelledby="mediation-form-title"
          aria-orientation={isTablistVertical ? "vertical" : "horizontal"}
        >
          {stepLabels.map((label: string, index: number) => {
            const disabled = index !== 0 && !completed[(index - 1) as StepType];
            const iconLabel = completed[index as StepType]
              ? t`Completed`
              : `${index + 1}`;
            const isActiveStep = activeStep === index;
            return (
              <Step
                key={label}
                className="stepper__step"
                completed={completed[index as StepType]}
              >
                <StepButton
                  onClick={handleChangeTab(index as StepType)}
                  onKeyDown={handleKeyDown(index as StepType)}
                  className={`stepper__button ${isActiveStep ? "active" : ""} ${
                    !disabled ? "unlocked" : ""
                  }`}
                  {...tabProps(index as StepType, isActiveStep)}
                  disabled={disabled}
                  ref={(element) =>
                    (tabs.current[index as StepType] = element
                      ? element
                      : undefined)
                  }
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

export default withRouter(FormNavigation);

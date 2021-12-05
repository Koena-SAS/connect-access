import { t, Trans } from "@lingui/macro";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useStateMachine } from "little-state-machine";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import Button from "../forms/buttons/Button";
import Information from "../forms/Information";
import { useGeneratePrefixedPath, useOrganizationApp } from "../hooks";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import {
  AboutIssueFields,
  FurtherInfoFields,
  NavigationContextFields,
  OrganizationAnswerFields,
} from "./fields";
import FormNavigation from "./FormNavigation";
import type { Completed, Step } from "./StepsInitializer";
import type { ProblemDescription as ProblemDescriptionType } from "./updateAction";
import { updateProblemDescription } from "./updateAction";

type FormInput = ProblemDescriptionType;

type ProblemDescriptionProps = RouteComponentProps & {
  /**
   * Indicates the figure of the current displayed form step.
   */
  activeStep: Step;
  /**
   * List of the steps that have been completed, to determine
   * if the user have access to the next step or not.
   */
  completed: Completed;
  /**
   * Function called when tab changing asked by the user and required
   * fields correctly filled. The call will unlock the next step.
   */
  setStepCompleted: () => void;
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
 * Second step of the main mediation form, to get information on the problem.
 */
function ProblemDescription({
  history,
  activeStep,
  setStepCompleted,
  completed,
  shouldTriggerFocus,
  setShouldTriggerFocus,
  initialOrganizationApp,
}: ProblemDescriptionProps) {
  const [shouldFocusOnFirstErrorField, setShouldFocusOnFirstErrorField] =
    useState(false);
  const { state, actions } = useStateMachine({ updateProblemDescription });
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const defaultValues = { ...state.problemDescription };
  if (!(defaultValues.attachedFile instanceof FileList)) {
    delete defaultValues.attachedFile;
  }
  const {
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormInput>({ defaultValues });

  const onSubmit = (data: FormInput) => {
    actions.updateProblemDescription(data);
  };

  let validateRequiredFields = true;
  const validateRequired = (errorText: string) => {
    return (value: string) => {
      if (!validateRequiredFields || Boolean(value)) {
        return true;
      } else {
        return errorText;
      }
    };
  };
  useEffect(() => {
    // TODO: use built-in focus funcitonnality when RHF 7.7 is out
    // cf. https://github.com/react-hook-form/react-hook-form/pull/4960
    if (shouldFocusOnFirstErrorField && errors) {
      if (errors.issueDescription) {
        errors.issueDescription.ref.focus();
      } else if (errors.url) {
        errors.url.ref.focus();
      }
      setShouldFocusOnFirstErrorField(false);
    }
  }, [shouldFocusOnFirstErrorField]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleClickNext = async () => {
    validateRequiredFields = true;
    const isValid = await trigger();
    if (isValid) {
      onSubmit(getValues());
      setStepCompleted();
      if (organizationApp) {
        history.push(generatePrefixedPath(PATHS.RECAP));
      } else {
        history.push(generatePrefixedPath(PATHS.ORGANIZATION_INFO));
      }
      setShouldTriggerFocus(true);
    } else {
      setShouldFocusOnFirstErrorField(true);
    }
  };
  const handleClickPrevious = async () => {
    validateRequiredFields = false;
    const isValid = await trigger();
    if (isValid) {
      onSubmit(getValues());
      history.push(generatePrefixedPath(PATHS.ROOT));
      setShouldTriggerFocus(true);
    } else {
      setShouldFocusOnFirstErrorField(true);
    }
  };
  const handleChangeTab = async () => {
    validateRequiredFields = false;
    const isValid = await trigger();
    if (isValid) {
      onSubmit(getValues());
      return true;
    } else {
      setShouldFocusOnFirstErrorField(true);
      return false;
    }
  };

  return (
    <>
      <FormNavigation
        activeStep={activeStep}
        completed={completed}
        onChangeTab={handleChangeTab}
        shouldTriggerFocus={shouldTriggerFocus}
        setShouldTriggerFocus={setShouldTriggerFocus}
        initialOrganizationApp={initialOrganizationApp}
      />
      <div
        role="tabpanel"
        id="mediation-tabpanel-1"
        aria-labelledby="mediation-tab-1"
        className="mediation-tabpanel mediation-request__form"
      >
        <div className="mediation-tabpanel__title-container">
          <h2 className="mediation-tabpanel__title">
            <Trans>Step 2: Your problem</Trans>
          </h2>
        </div>
        <form noValidate className="mediation-tabpanel__form form">
          <Information
            text={t`Only the 1st field "What was the issue?" is required.`}
          />
          <AboutIssueFields
            register={register}
            errors={errors}
            validateRequired={validateRequired}
            smallPaddingTop={true}
            smallMarginTop={true}
            level={3}
          />
          <NavigationContextFields
            register={register}
            errors={errors}
            watch={watch}
            smallPaddingTop={true}
            level={3}
          />
          {!organizationApp && (
            <OrganizationAnswerFields
              register={register}
              watch={watch}
              smallPaddingTop={true}
              level={3}
            />
          )}
          <FurtherInfoFields
            register={register}
            smallPaddingTop={true}
            level={3}
          />
          <div className="mediation-tabpanel__buttons">
            <Button
              size="large"
              type="button"
              onClick={handleClickPrevious}
              startIcon={<ArrowBackIcon />}
            >
              <Trans>Step 1: About yourself</Trans>
            </Button>
            <Button
              size="large"
              type="button"
              onClick={handleClickNext}
              endIcon={<ArrowForwardIcon />}
            >
              {organizationApp ? (
                <Trans>Step 3: Summary</Trans>
              ) : (
                <Trans>Step 3: The organization</Trans>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Tells if the problem description step is complete or not.
 * @param {object of String} problemDescriptionState
 */
export function problemDescriptionStepComplete(
  problemDescriptionState: ProblemDescriptionType
) {
  const { issueDescription } = problemDescriptionState;
  if (issueDescription) {
    return true;
  } else {
    return false;
  }
}

export default withRouter(ProblemDescription);

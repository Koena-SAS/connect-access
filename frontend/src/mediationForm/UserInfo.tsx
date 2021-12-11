import { t, Trans } from "@lingui/macro";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useStateMachine } from "little-state-machine";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import Button from "../forms/buttons/Button";
import Information from "../forms/Information";
import { useGeneratePrefixedPath } from "../hooks";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import { AssitiveTechnologyFields, PersonalInformationFields } from "./fields";
import FormNavigation from "./FormNavigation";
import type { Completed, Step } from "./StepsInitializer";
import type { UserInfo as UserInfoType } from "./updateAction";
import { updateUserInfo } from "./updateAction";

type FormInput = UserInfoType;

type UserInfoProps = RouteComponentProps & {
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
 * First step of the main mediation form, to get information on the user.
 */
function UserInfo({
  history,
  activeStep,
  setStepCompleted,
  completed,
  shouldTriggerFocus,
  setShouldTriggerFocus,
  initialOrganizationApp,
}: UserInfoProps) {
  const [shouldFocusOnFirstErrorField, setShouldFocusOnFirstErrorField] =
    useState(false);
  const { state, actions } = useStateMachine({ updateUserInfo });
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { register, handleSubmit, errors, trigger, getValues } =
    useForm<FormInput>({
      defaultValues: state.userInfo,
    });
  const onSubmit = (data: FormInput) => {
    actions.updateUserInfo(data);
    setStepCompleted();
    history.push(generatePrefixedPath(PATHS.PROBLEM_DESCRIPTION));
    setShouldTriggerFocus(true);
  };
  const handleChangeTab = async () => {
    const isValid = await trigger();
    if (isValid) {
      actions.updateUserInfo(getValues());
      return true;
    } else {
      setShouldFocusOnFirstErrorField(true);
      return false;
    }
  };
  useEffect(() => {
    // TODO: use built-in focus funcitonnality when RHF 7.7 is out
    // cf. https://github.com/react-hook-form/react-hook-form/pull/4960
    if (shouldFocusOnFirstErrorField && errors) {
      if (errors.firstName?.ref?.focus) {
        errors.firstName.ref.focus();
      } else if (errors.email?.ref?.focus) {
        errors.email.ref.focus();
      } else if (errors.phoneNumber?.ref?.focus) {
        errors.phoneNumber.ref.focus();
      }
      setShouldFocusOnFirstErrorField(false);
    }
  }, [shouldFocusOnFirstErrorField]); // eslint-disable-line react-hooks/exhaustive-deps
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
        id="mediation-tabpanel-0"
        aria-labelledby="mediation-tab-0"
        className="mediation-tabpanel mediation-request__form"
      >
        <div className="mediation-tabpanel__title-container">
          <h2 className="mediation-tabpanel__title">
            <Trans>Step 1: About yourself</Trans>
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mediation-tabpanel__form form"
        >
          <Information
            text={t`Only the fields "First name / username" and "Email" are required.`}
          />
          <PersonalInformationFields
            register={register}
            errors={errors}
            className="mediation-tabpanel__personal-info"
          />
          <AssitiveTechnologyFields
            register={register}
            className="mediation-tabpanel__assistive-technology"
            isUserFacing={true}
          />
          <div className="mediation-tabpanel__buttons">
            <Button size="large" type="submit" endIcon={<ArrowForwardIcon />}>
              <Trans>Step 2: Your problem</Trans>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Tells if the user info step is complete or not.
 * @param {object of String} userInfoState
 */
export function userInfoStepComplete(userInfoState: UserInfoType) {
  const { firstName, email } = userInfoState;
  if (firstName && email) {
    return true;
  } else {
    return false;
  }
}

export default withRouter(UserInfo);

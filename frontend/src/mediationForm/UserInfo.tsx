import { t, Trans } from "@lingui/macro";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useStateMachine } from "little-state-machine";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withRouter } from "react-router-dom";
import { PATHS } from "../constants/paths";
import Button from "../forms/buttons/Button";
import Information from "../forms/Information";
import { useGeneratePrefixedPath } from "../hooks";
import { AssitiveTechnologyFields, PersonalInformationFields } from "./fields";
import FormNavigation from "./FormNavigation";
import { updateUserInfo } from "./updateAction";

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
}) {
  const [shouldFocusOnFirstErrorField, setShouldFocusOnFirstErrorField] =
    useState(false);
  const { state, actions } = useStateMachine({ updateUserInfo });
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { register, handleSubmit, errors, trigger, getValues } = useForm({
    defaultValues: state.userInfo,
  });
  const onSubmit = (data) => {
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
      if (errors.firstName) {
        errors.firstName.ref.focus();
      } else if (errors.email) {
        errors.email.ref.focus();
      } else if (errors.phoneNumber) {
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

UserInfo.propTypes = {
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
   * Function called when tab changing asked by the user and required
   * fields correctly filled. The call will unlock the next step.
   */
  setStepCompleted: PropTypes.func.isRequired,
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

/**
 * Tells if the user info step is complete or not.
 * @param {object of String} userInfoState
 */
export function userInfoStepComplete(userInfoState) {
  const { firstName, email } = userInfoState;
  if (firstName && email) {
    return true;
  } else {
    return false;
  }
}

export default withRouter(UserInfo);

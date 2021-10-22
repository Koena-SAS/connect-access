import { Trans } from "@lingui/macro";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import { EmailField } from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { useGeneratePrefixedPath } from "../../hooks";

/**
 * Display an email field to begin the password reset process.
 */
function PasswordResetRequest({
  onClose,
  displayRequestSuccess,
  displayRequestFailure,
  shouldFocus,
}) {
  const history = useHistory();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const firstTabbableElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (shouldFocus) {
      firstTabbableElement.current.focus();
    }
  }, [shouldFocus]);
  const { register, handleSubmit, errors } = useForm();
  const handleCancel = () => {
    onClose();
  };
  const onSubmit = (data) => {
    const dataToSend = {
      email: data.email,
    };
    axios
      .post("/auth/users/reset_password/", dataToSend)
      .then(() => {
        displayRequestSuccess();
        history.push(generatePrefixedPath(PATHS.LOGIN));
      })
      .catch(() => {
        displayRequestFailure();
      });
  };
  return (
    <div className="identification__container password-reset-request">
      <h1 className="password-reset-request__title">
        <Trans>Request a password reset</Trans>
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="password-reset-request__form form"
      >
        <EmailField
          componentName="password-reset-request"
          errors={errors}
          register={register}
          required={true}
          elementRef={firstTabbableElement}
        />
        <div className="password-reset-request__buttons">
          <DoneButton className="button password-reset-request__submit">
            <Trans>Reset password</Trans>
          </DoneButton>
          <CancelButton
            className="button password-reset-request__cancel"
            onClick={handleCancel}
          >
            <Trans>Cancel</Trans>
          </CancelButton>
        </div>
      </form>
    </div>
  );
}

PasswordResetRequest.defaultProps = {
  shouldFocus: false,
};

PasswordResetRequest.propTypes = {
  onClose: PropTypes.func.isRequired,
  /**
   * Displays a success notification when called.
   */
  displayRequestSuccess: PropTypes.func.isRequired,
  /**
   * Displays an error message when called.
   */
  displayRequestFailure: PropTypes.func.isRequired,
  /**
   * Whether the first tabbable element should get the focus.
   */
  shouldFocus: PropTypes.bool,
};

export default PasswordResetRequest;

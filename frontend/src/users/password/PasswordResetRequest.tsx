import { Trans } from "@lingui/macro";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import { EmailField } from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { useGeneratePrefixedPath } from "../../hooks";

type FormInput = {
  email: string;
};

type PasswordResetRequestProps = {
  onClose: () => void;
  /**
   * Displays a success notification when called.
   */
  displayRequestSuccess: () => void;
  /**
   * Displays an error message when called.
   */
  displayRequestFailure: () => void;
  /**
   * Whether the first tabbable element should get the focus.
   */
  shouldFocus?: boolean;
};

/**
 * Display an email field to begin the password reset process.
 */
function PasswordResetRequest({
  onClose,
  displayRequestSuccess,
  displayRequestFailure,
  shouldFocus = false,
}: PasswordResetRequestProps) {
  const history = useHistory();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const firstTabbableElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (shouldFocus) {
      firstTabbableElement.current.focus();
    }
  }, [shouldFocus]);
  const { register, handleSubmit, errors } = useForm<FormInput>();
  const handleCancel = () => {
    onClose();
  };
  const onSubmit = (data: FormInput) => {
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

export default PasswordResetRequest;

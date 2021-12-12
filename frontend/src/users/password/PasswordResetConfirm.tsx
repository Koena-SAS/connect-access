import { t, Trans } from "@lingui/macro";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import { TextField } from "../../forms";
import Button from "../../forms/buttons/Button";
import { useGeneratePrefixedPath } from "../../hooks";
import {
  chooseErrorWrappingElement,
  formatErrors,
  setManualError,
} from "../../utils/formUtils";

type FormInput = {
  password1: string;
  password2: string;
};

type PasswordResetConfirmProps = {
  /**
   * Function called to diplay success message in snackbar.
   */
  displayRequestSuccess: () => void;
  /**
   * Function called to diplay error message in snackbar.
   */
  displayRequestFailure: () => void;
};

/**
 * Provide a form to update a user's password.
 * This component is only accessible through a link sent by email.
 */
function PasswordResetConfirm({
  displayRequestSuccess,
  displayRequestFailure,
}: PasswordResetConfirmProps) {
  const { register, handleSubmit, errors, watch, setError } =
    useForm<FormInput>();
  const history = useHistory();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const validatePasswords = () => {
    if (watch("password1") === watch("password2")) {
      return true;
    } else {
      return false;
    }
  };
  const onSubmit = (data: FormInput) => {
    const dataToSend = {
      uid: uid,
      token: token,
      new_password: data.password1,
      re_new_password: data.password2,
    };
    axios
      .post("/auth/users/reset_password_confirm/", dataToSend)
      .then(() => {
        displayRequestSuccess();
        history.push(generatePrefixedPath(PATHS.ROOT));
        history.push(generatePrefixedPath(PATHS.LOGIN));
      })
      .catch((error) => {
        const dataExists = error.response && error.response.data;
        const fieldErrorExists =
          dataExists &&
          (error.response.data.new_password ||
            error.response.data.re_new_password);
        if (fieldErrorExists) {
          const data = error.response.data;
          setManualError(data.new_password, "password1", setError);
          setManualError(data.re_new_password, "password2", setError);
        } else {
          displayRequestFailure();
        }
      });
  };
  const password2ErrorMessage = errors?.password2?.message ? (
    errors.password2.message
  ) : (
    <Trans>Passwords do not match.</Trans>
  );
  return (
    <div className="password-reset-confirm page-base">
      <div>
        <h1 className="page-base__title">
          <Trans>Choose a new password</Trans>
        </h1>
        <div className="page-base__content password-reset-confirm__content">
          <form
            className="password-reset-confirm__form form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="password-reset-confirm__field">
              <TextField
                id="reset-password1"
                name="password1"
                inputRef={register({ required: t`The password is required` })}
                label={t`Password`}
                inputProps={{ "aria-describedby": "password1-desc" }}
                type="password"
                autoComplete="new-password"
                error={!!errors.password1}
                helperText={
                  errors.password1 && errors.password1.message
                    ? formatErrors(errors.password1.message, true)
                    : ""
                }
                FormHelperTextProps={{
                  role: "alert",
                  component: chooseErrorWrappingElement(errors.password1),
                }}
                required={true}
              />
              <p id="password1-desc" className="form__helper-text">
                <Trans>
                  At least 8 characters, not fully numeric, and must not be a
                  too common word
                </Trans>
              </p>
            </div>
            <div className="password-reset-confirm__field">
              <TextField
                id="reset-password2"
                name="password2"
                inputRef={register({
                  required: t`Password confirmation is required`,
                  validate: validatePasswords,
                })}
                label={t`Confirm password`}
                type="password"
                autoComplete="new-password"
                error={!!errors.password2}
                helperText={errors.password2 ? password2ErrorMessage : ""}
                FormHelperTextProps={{ role: "alert" }}
                required={true}
              />
            </div>
            <div className="password-reset-confirm__submit">
              <Button size="large" type="submit">
                <Trans>Change your password</Trans>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetConfirm;

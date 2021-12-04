import { t, Trans } from "@lingui/macro";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { mutate } from "swr";
import {
  EmailField,
  FirstNameField,
  LastNameField,
  PhoneField,
  TextField,
} from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { keysToCamel } from "../../utils";
import {
  chooseErrorWrappingElement,
  formatErrors,
  setManualError,
} from "../../utils/formUtils";

type SignupProps = RouteComponentProps & {
  handleCloseIdentification: () => void;
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
};

/**
 * Signup form with error handling.
 */
function Signup({ setToken, handleCloseIdentification }: SignupProps) {
  const { register, handleSubmit, errors, watch, setError } = useForm();
  const [nonFieldErrors, setNonFieldErrors] = useState([]);

  const onSubmit = (data) => {
    const dataToSend = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      password: data.password1,
      re_password: data.password2,
    };
    axios
      .post("/auth/users/", dataToSend)
      .then(({ data: userData }) => {
        const dataToSendToLogin = {
          email: dataToSend.email,
          password: dataToSend.password,
        };
        axios
          .post("/auth/token/login/", dataToSendToLogin)
          .then(({ data: signupData }) => {
            setToken(signupData.auth_token);
            mutate(
              ["/auth/users/me/", signupData.auth_token],
              keysToCamel(userData),
              false
            );
            handleCloseIdentification();
          })
          .catch(() => {
            setNonFieldErrors([
              <Trans>
                We were unable to log you in, please try again later.
              </Trans>,
            ]);
          });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const data = error.response.data;
          setManualError(data.first_name, "firstName", setError);
          setManualError(data.last_name, "lastName", setError);
          setManualError(data.email, "email", setError);
          setManualError(data.phone_number, "phoneNumber", setError);
          setManualError(data.password, "password1", setError);
        } else {
          setNonFieldErrors([
            <Trans>
              We were unable to sign you up, please try again later.
            </Trans>,
          ]);
        }
      });
  };

  const validatePasswords = () => {
    if (watch("password1") === watch("password2")) {
      return true;
    } else {
      return false;
    }
  };

  const handleCancelSignup = () => {
    handleCloseIdentification();
  };
  const password2ErrorMessage = errors?.password2?.message ? (
    errors.password2.message
  ) : (
    <Trans>Passwords do not match.</Trans>
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="signup form">
      <FirstNameField
        componentName="signup"
        errors={errors}
        register={register}
        required={true}
      />
      <LastNameField
        componentName="signup"
        errors={errors}
        register={register}
        className="input-top-margin"
      />
      <EmailField
        componentName="signup"
        errors={errors}
        register={register}
        required={true}
        className="input-top-margin"
      />
      <PhoneField
        componentName="user-info"
        errors={errors}
        register={register}
        className="input-top-margin"
      />
      <TextField
        id="signup-password1"
        name="password1"
        inputRef={register({ required: t`The password is required` })}
        label={t`Password`}
        inputProps={{ "aria-describedby": "password1-desc" }}
        type="password"
        autoComplete="new-password"
        error={!!errors.password1}
        helperText={
          errors.password1 ? formatErrors(errors.password1.message, true) : ""
        }
        FormHelperTextProps={{
          role: "alert",
          component: chooseErrorWrappingElement(errors.password1),
        }}
        required={true}
        className="input-top-margin"
      />
      <p id="password1-desc" className="form__helper-text">
        <Trans>
          At least 8 characters, not fully numeric, and must not be a too common
          word
        </Trans>
      </p>
      <div>
        <TextField
          id="signup-password2"
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
          className="input-top-margin"
        />
      </div>
      {formatErrors(nonFieldErrors, false)}
      <div className="signup__buttons">
        <DoneButton className="signup__submit">
          <Trans>Sign up</Trans>
        </DoneButton>
        <CancelButton className="signup__cancel" onClick={handleCancelSignup}>
          <Trans>Cancel</Trans>
        </CancelButton>
      </div>
    </form>
  );
}

export default withRouter(Signup);

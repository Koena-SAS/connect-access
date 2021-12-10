import { t, Trans } from "@lingui/macro";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { mutate } from "swr";
import { PATHS } from "../../constants/paths";
import { EmailField, TextField } from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { useGeneratePrefixedPath } from "../../hooks";
import { keysToCamel } from "../../utils";

type FormInput = {
  email: string;
  password: string;
};

type LoginProps = RouteComponentProps & {
  handleCloseIdentification: () => void;
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
};

/**
 * Login form with error handling.
 */
function Login({ setToken, handleCloseIdentification }: LoginProps) {
  const generatePrefixedPath = useGeneratePrefixedPath();
  const { register, handleSubmit, errors } = useForm<FormInput>();
  const [nonFieldErrors, setNonFieldErrors] = useState<JSX.Element[]>([]);
  const [allFieldsInError, setAllFieldsInError] = useState(false);
  const onSubmit = (data: FormInput) => {
    const dataToSend = {
      email: data.email,
      password: data.password,
    };
    axios
      .post("/auth/token/login/", dataToSend)
      .then(({ data: signupData }) => {
        setToken(signupData.auth_token);
        axios
          .get("/auth/users/me/", {
            headers: {
              Authorization: `token ${signupData.auth_token}`,
            },
          })
          .then(({ data: userData }) => {
            mutate(
              ["/auth/users/me/", signupData.auth_token],
              keysToCamel(userData),
              false
            );
            handleCloseIdentification();
          })
          .catch(() => {
            setNonFieldErrors([
              <Trans>There was a problem, please reload the page.</Trans>,
            ]);
          });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (error.response.data.non_field_errors) {
            setNonFieldErrors(error.response.data.non_field_errors);
            setAllFieldsInError(true);
          } else {
            setNonFieldErrors([<Trans>An unexpected error occurred.</Trans>]);
          }
        } else {
          setNonFieldErrors([
            <Trans>
              We were unable to log you in, please try again later.
            </Trans>,
          ]);
        }
      });
  };

  const handleCancelLogin = () => {
    handleCloseIdentification();
  };

  const nonFieldErrorsJsx = () => {
    if (nonFieldErrors.length === 1) {
      return (
        <p role="alert" className="form__error-text">
          {nonFieldErrors[0]}
        </p>
      );
    } else if (nonFieldErrors.length > 1) {
      const items = nonFieldErrors.map((value, index) => {
        return (
          <li role="alert" className="form__error-text" key={index}>
            {value}
          </li>
        );
      });
      return <ul>{items}</ul>;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="login form">
      <EmailField
        componentName="login"
        errors={errors}
        register={register}
        error={!!errors.email || allFieldsInError}
        required={true}
      />
      <TextField
        id="login-password"
        name="password"
        inputRef={register({ required: t`The password is required` })}
        label={t`Password`}
        type="password"
        autoComplete="current-password"
        error={!!errors.password || allFieldsInError}
        helperText={errors.password ? errors.password.message : ""}
        FormHelperTextProps={{ role: "alert" }}
        required={true}
      />
      {nonFieldErrorsJsx()}
      <div className="login__buttons">
        <DoneButton className="button login__submit" data-testid="loginSubmit">
          <Trans>Log in</Trans>
        </DoneButton>
        <CancelButton className="login__cancel" onClick={handleCancelLogin}>
          <Trans>Cancel</Trans>
        </CancelButton>
      </div>
      <div className="login__forgotten-password-container">
        <Link
          to={{
            pathname: generatePrefixedPath(PATHS.RESET_PASSWORD),
          }}
          className="login__forgotten-password"
        >
          <Trans>Password forgotten?</Trans>
        </Link>
      </div>
    </form>
  );
}

export default withRouter(Login);

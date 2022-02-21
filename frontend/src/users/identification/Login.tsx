import { t, Trans } from "@lingui/macro";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { mutate } from "swr";
import { PATHS } from "../../constants/paths";
import { EmailField, TextField } from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { useGeneratePrefixedPath } from "../../hooks";
import { keysToCamel } from "../../utils";
import { emailValidationWithoutPassword, formStepReducer } from "./LoginLogic";

type FormInput = {
  email: string;
  password: string;
  token: string;
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
  const [allFieldsInError, setAllFieldsInError] = useState<boolean>(false);
  const [formStep, dispatchFormStep] = useReducer(
    formStepReducer,
    emailValidationWithoutPassword
  );
  const tokenFieldRef = useRef<HTMLInputElement | null>(null);

  const getUserDetails = useCallback(
    (token: string) => {
      axios
        .get("/auth/users/me/", {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        .then(({ data: userData }) => {
          mutate(["/auth/users/me/", token], keysToCamel(userData), false);
          handleCloseIdentification();
        })
        .catch(() => {
          setNonFieldErrors([
            <Trans>There was a problem, please reload the page.</Trans>,
          ]);
        });
    },
    [handleCloseIdentification]
  );

  useEffect(
    function logInWithPassword() {
      if (formStep.sideEffects.includes("FETCH_WITH_PASSWORD")) {
        const dataToSend = {
          email: formStep.formData?.email,
          password: formStep.formData?.password,
        };
        axios
          .post("/auth/token/login/", dataToSend)
          .then(({ data: signupData }) => {
            setToken(signupData.auth_token);
            getUserDetails(signupData.auth_token);
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              if (error.response.data.non_field_errors) {
                setNonFieldErrors(error.response.data.non_field_errors);
                setAllFieldsInError(true);
              } else {
                setNonFieldErrors([
                  <Trans>An unexpected error occurred.</Trans>,
                ]);
              }
            } else {
              setNonFieldErrors([
                <Trans>
                  We were unable to log you in, please try again later.
                </Trans>,
              ]);
            }
            dispatchFormStep({
              type: "SIDE_EFFECTS_DONE",
              sideEffects: ["FETCH_WITH_PASSWORD"],
            });
          });
      }
    },
    [formStep.sideEffects, formStep.formData, setToken, getUserDetails]
  );

  useEffect(
    function logInWithToken() {
      if (formStep.sideEffects.includes("FETCH_WITH_TOKEN")) {
        const dataToSend = {
          email: formStep.formData?.email,
          token: formStep.formData?.token,
        };
        axios
          .post("/passwordless-auth/token/", dataToSend)
          .then(({ data: signupData }) => {
            setToken(signupData.token);
            getUserDetails(signupData.token);
          })
          .catch(() => {
            setNonFieldErrors([
              <Trans>
                We were unable to log you in, please try again later.
              </Trans>,
            ]);
            dispatchFormStep({
              type: "SIDE_EFFECTS_DONE",
              sideEffects: ["FETCH_WITH_TOKEN"],
            });
          });
      }
    },
    [formStep.sideEffects, formStep.formData, setToken, getUserDetails]
  );

  useEffect(
    function sendEmailWithToken() {
      if (formStep.sideEffects.includes("SEND_EMAIL")) {
        const dataToSend = {
          email: formStep.formData?.email,
        };
        axios
          .post("/passwordless-auth/email/", dataToSend)
          .then(() => {
            dispatchFormStep({
              type: "VALIDATE_EMAIL_WITHTOUT_PASSWORD",
            });
          })
          .catch((error) => {
            if (error?.response?.data) {
              dispatchFormStep({
                type: "VALIDATE_EMAIL_WITHTOUT_PASSWORD",
              });
            } else {
              setNonFieldErrors([
                <Trans>We were unable to send the email.</Trans>,
              ]);
            }
          });
      }
    },
    [formStep.sideEffects, formStep.formData]
  );

  useEffect(
    function closeWindow() {
      if (formStep.sideEffects.includes("CLOSE_WINDOW")) {
        handleCloseIdentification();
      }
    },
    [formStep.sideEffects, handleCloseIdentification]
  );

  useEffect(
    function removeErrors() {
      if (formStep.sideEffects.includes("REMOVE_ERRORS")) {
        setNonFieldErrors([]);
        setAllFieldsInError(false);
        dispatchFormStep({
          type: "SIDE_EFFECTS_DONE",
          sideEffects: ["REMOVE_ERRORS"],
        });
      }
    },
    [formStep.sideEffects]
  );

  useEffect(
    function focusOnTokenField() {
      if (formStep.showTokenField && tokenFieldRef.current) {
        tokenFieldRef.current.focus();
      }
    },
    [formStep.showTokenField]
  );

  function onSubmit(data: FormInput) {
    dispatchFormStep({ type: "SUBMIT", formData: data });
  }

  function nonFieldErrorsJsx(): React.ReactNode {
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
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="login form">
      <div style={{ display: formStep.showEmailField ? undefined : "none" }}>
        <EmailField
          componentName="login"
          errors={errors}
          register={register}
          error={!!errors.email || allFieldsInError}
          required={true}
        />
      </div>
      {formStep.showPasswordlessHelperText && (
        <p className="login_passwordlessHelperText">
          <Trans>
            You will receive an email with a 6-digit token you will have to
            enter to log in.
          </Trans>
        </p>
      )}
      {formStep.showEmailField && (
        <div className="login__withPassword">
          <Checkbox
            id="withPassword"
            onChange={function toggleWithPassword() {
              dispatchFormStep({ type: "TOGGLE_PASSWORD" });
            }}
          />
          <label htmlFor="withPassword" className="label">
            <Trans>Log in with password</Trans>
          </label>
        </div>
      )}
      {formStep.showTokenField && (
        <TextField
          id="login-token"
          name="token"
          inputRef={(e: HTMLInputElement) => {
            const ref = register({ required: t`The token is required` });
            ref(e);
            tokenFieldRef.current = e;
          }}
          label={t`Token received by email`}
          error={!!errors.token || allFieldsInError}
          helperText={errors.token ? errors.token.message : ""}
          FormHelperTextProps={{ role: "alert" }}
          required={true}
        />
      )}
      {formStep.showPasswordField && (
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
      )}
      {nonFieldErrorsJsx()}
      <div className="login__buttons-container">
        {formStep.showPasswordField && (
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
        )}
        <div className="login__buttons">
          <DoneButton
            className="button login__submit"
            data-testid="loginSubmit"
          >
            {formStep.submitButtonText}
          </DoneButton>
          <CancelButton
            className="login__cancel"
            onClick={() => dispatchFormStep({ type: "CANCEL" })}
          >
            <Trans>Cancel</Trans>
          </CancelButton>
        </div>
      </div>
    </form>
  );
}

export default withRouter(Login);
export type { FormInput };

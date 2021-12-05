import { t, Trans } from "@lingui/macro";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";
import TextField from "./TextField";

type EmailFieldProps = {
  /**
   * Lowercase simple name to make the id unique, eg. "login"
   */
  componentName: string;
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form errors object
   */
  errors: any;
  /**
   * Ref of this field to be used by the external component.
   */
  elementRef?: any;
  required?: boolean;
  autoComplete?: string;
  [props: string]: any;
};

/**
 * Field asking for email, controlled by react hook form.
 */
function EmailField({
  componentName,
  register,
  errors,
  elementRef,
  required = false,
  autoComplete = "email",
  ...props
}: EmailFieldProps) {
  const errorId = `email-desc-${componentName}`;
  const emailLabel = (
    <Trans>
      <span lang="en">E-mail</span>
    </Trans>
  );
  return (
    <>
      <TextField
        id={`${componentName}-email`}
        name="email"
        inputRef={(input: HTMLInputElement) => {
          const rhfRef = register({
            required: required ? t`The e-mail is required` : undefined,
            pattern: {
              value: /^\S+@\S+\.\S+$/i,
              message: t`The e-mail must be formated like this: name@domain.extension`,
            },
          });
          rhfRef(input);
          if (elementRef) {
            elementRef.current = input;
          }
        }}
        label={emailLabel}
        inputProps={{ "aria-describedby": errorId }}
        type="email"
        autoComplete={autoComplete}
        error={!!errors.email}
        helperText={
          errors.email ? formatErrors(errors.email.message, true) : ""
        }
        FormHelperTextProps={{
          role: "alert",
          component: chooseErrorWrappingElement(errors.email),
        }}
        {...props}
        required={required}
      />
      <p id={errorId} className="form__helper-text">
        <Trans>Example of correct format: name@domain.com</Trans>
      </p>
    </>
  );
}

export default EmailField;

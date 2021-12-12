import { t, Trans } from "@lingui/macro";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";
import TextField from "./TextField";

type PhoneFieldProps = {
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
 * Field asking for phone number, controlled by react hook form.
 */
function PhoneField({
  componentName,
  register,
  errors,
  elementRef,
  required = false,
  autoComplete = "tel",
  ...props
}: PhoneFieldProps) {
  const errorId = `phoneNumber-desc-${componentName}`;
  return (
    <>
      <TextField
        id={`${componentName}-phoneNumber`}
        name="phoneNumber"
        inputRef={(input: HTMLInputElement) => {
          const rhfRef = register({
            required: required ? t`The phone number is required` : undefined,
            pattern: {
              value: /^\+?\d{9,15}$/,
              message: t`The phone number format is invalid`,
            },
          });
          rhfRef(input);
          if (elementRef) {
            elementRef.current = input;
          }
        }}
        label={t`Phone number`}
        inputProps={{ "aria-describedby": errorId }}
        type="tel"
        autoComplete={autoComplete}
        error={!!errors.phoneNumber}
        helperText={
          errors.phoneNumber
            ? formatErrors(errors.phoneNumber.message, true)
            : ""
        }
        FormHelperTextProps={{
          role: "alert",
          component: chooseErrorWrappingElement(errors.phoneNumber),
        }}
        {...props}
        required={required}
      />
      <p id={errorId} className="form__helper-text">
        <Trans>
          The phone number must be 9 to 15 digits long and can be preceded by
          the + sign
        </Trans>
      </p>
    </>
  );
}

export default PhoneField;

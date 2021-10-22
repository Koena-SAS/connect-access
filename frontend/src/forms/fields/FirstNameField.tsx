import { t } from "@lingui/macro";
import React from "react";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";
import TextField from "./TextField";

type FirstNameProps = {
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
 * Field asking for first name, controlled by react hook form.
 */
function FirstNameField({
  componentName,
  register,
  errors,
  elementRef,
  required = false,
  autoComplete = "given-name",
  ...props
}: FirstNameProps) {
  return (
    <TextField
      id={`${componentName}-firstName`}
      name="firstName"
      inputRef={(e) => {
        const rhfRef = register({
          required: required
            ? t`The first name / username is required`
            : undefined,
        });
        rhfRef(e);
        if (elementRef) {
          elementRef.current = e;
        }
      }}
      label={t`First name / username`}
      type="text"
      autoComplete={autoComplete}
      error={!!errors.firstName}
      helperText={
        errors.firstName ? formatErrors(errors.firstName.message, true) : ""
      }
      FormHelperTextProps={{
        role: "alert",
        component: chooseErrorWrappingElement(errors.firstName),
      }}
      {...props}
      required={required}
    />
  );
}

export default FirstNameField;

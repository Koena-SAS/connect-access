import { t } from "@lingui/macro";
import React from "react";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";
import TextField from "./TextField";

type LastNameProps = {
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
 * Field asking for last name, controlled by react hook form.
 */
function LastNameField({
  componentName,
  register,
  errors,
  elementRef,
  required = false,
  autoComplete = "family-name",
  ...props
}: LastNameProps) {
  return (
    <TextField
      id={`${componentName}-lastName`}
      name="lastName"
      inputRef={(e) => {
        const rhfRef = register({
          required: required ? t`The last name is required` : undefined,
        });
        rhfRef(e);
        if (elementRef) {
          elementRef.current = e;
        }
      }}
      label={t`Last name`}
      type="text"
      autoComplete={autoComplete}
      error={!!errors.lastName}
      helperText={
        errors.lastName ? formatErrors(errors.lastName.message, true) : ""
      }
      FormHelperTextProps={{
        role: "alert",
        component: chooseErrorWrappingElement(errors.lastName),
      }}
      {...props}
      required={required}
    />
  );
}

export default LastNameField;

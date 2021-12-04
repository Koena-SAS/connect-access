import { ErrorOption } from "react-hook-form";

/**
 * Formats one or several error message(s).
 * @param errorsToFormat the error messages
 * @param muiError if the error will be given to a MUI component
 */
export function formatErrors(
  errorsToFormat: string | string[],
  muiError: boolean
) {
  if (!Array.isArray(errorsToFormat)) {
    errorsToFormat = [errorsToFormat];
  }
  if (errorsToFormat.length === 1) {
    if (muiError) {
      return errorsToFormat[0];
    } else {
      return (
        <p role="alert" className="form__error-text">
          {errorsToFormat[0]}
        </p>
      );
    }
  } else if (errorsToFormat.length > 1) {
    const items = errorsToFormat.map((value) => {
      return (
        <li className="{!muiError && 'form__error-text'}" key={value}>
          {value}
        </li>
      );
    });
    return <ul className="form__errors-list">{items}</ul>;
  }
}

/**
 * Returns the correct wrapping element for an error message
 * @param errorsToWrap
 */
export function chooseErrorWrappingElement(errorsToWrap?: { message: any }) {
  if (
    errorsToWrap &&
    Array.isArray(errorsToWrap.message) &&
    errorsToWrap.message.length > 1
  ) {
    return "div";
  } else {
    return "p";
  }
}

/**
 * Sets manual errors on react hook form
 * @param errorToSet the error message(s)
 * @param fieldName the field in error
 * @param { Function } setError the react hook form setError function
 */
export function setManualError(
  errorToSet: string,
  fieldName: string,
  setError: (name: string, error: ErrorOption) => void
) {
  if (errorToSet) {
    setError(fieldName, {
      type: "manual",
      message: errorToSet,
    });
  }
}

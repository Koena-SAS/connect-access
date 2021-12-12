import { ErrorOption } from "react-hook-form";

/**
 * Formats one or several error message(s).
 * @param errorsToFormat the error messages
 * @param muiError if the error will be given to a MUI component
 */
export function formatErrors(
  errorsToFormat: string | string[] | JSX.Element | JSX.Element[],
  muiError: boolean
): React.ReactNode {
  let finalErrorsToFormat: (string | JSX.Element)[];
  if (!Array.isArray(errorsToFormat)) {
    finalErrorsToFormat = [errorsToFormat];
  } else {
    finalErrorsToFormat = errorsToFormat;
  }
  if (finalErrorsToFormat.length === 1) {
    if (muiError) {
      return finalErrorsToFormat[0];
    } else {
      return (
        <p role="alert" className="form__error-text">
          {finalErrorsToFormat[0]}
        </p>
      );
    }
  } else if (finalErrorsToFormat.length > 1) {
    const items = finalErrorsToFormat.map((value, index) => {
      return (
        <li className="{!muiError && 'form__error-text'}" key={index}>
          {value}
        </li>
      );
    });
    return <ul className="form__errors-list">{items}</ul>;
  } else {
    return null;
  }
}

/**
 * Returns the correct wrapping element for an error message
 * @param errorsToWrap
 */
export function chooseErrorWrappingElement(errorsToWrap?: { message?: any }) {
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
export function setManualError<FieldName = string>(
  errorToSet: string,
  fieldName: FieldName,
  setError: (name: FieldName, error: ErrorOption) => void
) {
  if (errorToSet) {
    setError(fieldName, {
      type: "manual",
      message: errorToSet,
    });
  }
}

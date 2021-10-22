/**
 * Formats one or several error message(s).
 * @param {String or array of String} errorsToFormat the error messages
 * @param {Boolean} muiError if the error will be given to a MUI component
 */
export function formatErrors(errorsToFormat, muiError) {
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
 * @param {String or array of String} errorsToWrap
 */
export function chooseErrorWrappingElement(errorsToWrap) {
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
 * @param { String or array of String } errorsToSet the error message(s)
 * @param { String } fieldName the field in error
 * @param { Function } setError the react hook form setError function
 */
export function setManualError(errorsToSet, fieldName, setError) {
  if (errorsToSet) {
    setError(fieldName, {
      type: "manual",
      message: errorsToSet,
    });
  }
}

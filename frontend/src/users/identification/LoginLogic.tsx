import { Trans } from "@lingui/macro";
import type { FormInput } from "./Login";

type FormStepName =
  | "EMAIL_VALIDATION_WITHTOUT_PASSWORD"
  | "FINAL_VALIDATION_WITHOUT_PASSWORD"
  | "FINAL_VALIDATION_WITH_PASSWORD";

type FormStepSideEffect =
  | "SEND_EMAIL"
  | "FETCH_WITH_PASSWORD"
  | "FETCH_WITH_TOKEN"
  | "CLOSE_WINDOW";

type FormStepState = {
  name: FormStepName;
  formData?: FormInput;
  sideEffects: FormStepSideEffect[];
  showEmailField: boolean;
  showTokenField: boolean;
  showPasswordField: boolean;
  submitButtonText: React.ReactNode;
};

const emailValidationWithoutPassword: FormStepState = {
  name: "EMAIL_VALIDATION_WITHTOUT_PASSWORD",
  sideEffects: [] as FormStepSideEffect[],
  showEmailField: true,
  showTokenField: false,
  showPasswordField: false,
  submitButtonText: <Trans>Log in with email</Trans>,
} as const;

const finalValidationWithoutPassword: FormStepState = {
  name: "FINAL_VALIDATION_WITHOUT_PASSWORD",
  sideEffects: [] as FormStepSideEffect[],
  showEmailField: false,
  showTokenField: true,
  showPasswordField: false,
  submitButtonText: <Trans>Log in</Trans>,
} as const;

const finalValidationWithPassword: FormStepState = {
  name: "FINAL_VALIDATION_WITH_PASSWORD",
  sideEffects: [] as FormStepSideEffect[],
  showEmailField: true,
  showTokenField: false,
  showPasswordField: true,
  submitButtonText: <Trans>Log in</Trans>,
} as const;

type FormStepActionType =
  | "SUBMIT"
  | "VALIDATE_EMAIL_WITHTOUT_PASSWORD"
  | "BACK_AFTER_LOGIN"
  | "CANCEL"
  | "TOGGLE_PASSWORD"
  | "SIDE_EFFECTS_DONE";

type FormStepAction = {
  type: FormStepActionType;
  formData?: FormInput;
  sideEffects?: FormStepSideEffect[];
};

function formStepReducer(
  formStep: FormStepState,
  action: FormStepAction
): FormStepState {
  switch (action.type) {
    case "SUBMIT":
      switch (formStep.name) {
        case "EMAIL_VALIDATION_WITHTOUT_PASSWORD":
          return {
            ...emailValidationWithoutPassword,
            formData: action?.formData,
            sideEffects: [...formStep.sideEffects, "SEND_EMAIL"],
          };
        case "FINAL_VALIDATION_WITHOUT_PASSWORD":
          return {
            ...finalValidationWithoutPassword,
            formData: action?.formData,
            sideEffects: [...formStep.sideEffects, "FETCH_WITH_TOKEN"],
          };
        case "FINAL_VALIDATION_WITH_PASSWORD":
          return {
            ...finalValidationWithPassword,
            formData: action?.formData,
            sideEffects: [...formStep.sideEffects, "FETCH_WITH_PASSWORD"],
          };
        default:
          return formStep;
      }
    case "VALIDATE_EMAIL_WITHTOUT_PASSWORD":
      return finalValidationWithoutPassword;
    case "CANCEL":
      switch (formStep.name) {
        case "EMAIL_VALIDATION_WITHTOUT_PASSWORD":
        case "FINAL_VALIDATION_WITH_PASSWORD":
          return {
            ...formStep,
            sideEffects: [...formStep.sideEffects, "CLOSE_WINDOW"],
          };
        case "FINAL_VALIDATION_WITHOUT_PASSWORD":
          return emailValidationWithoutPassword;
        default:
          return formStep;
      }
    case "TOGGLE_PASSWORD":
      switch (formStep.name) {
        case "EMAIL_VALIDATION_WITHTOUT_PASSWORD":
          return finalValidationWithPassword;
        case "FINAL_VALIDATION_WITH_PASSWORD":
          return emailValidationWithoutPassword;
        default:
          return formStep;
      }
    case "SIDE_EFFECTS_DONE":
      if (Array.isArray(action.sideEffects)) {
      }
      return {
        ...formStep,
        sideEffects: action.sideEffects
          ? formStep.sideEffects.filter(function removeDoneEffect(element) {
              return !action.sideEffects?.includes(element);
            })
          : formStep.sideEffects,
      };
    default:
      throw Error(`Unsupported action type: ${action.type}.`);
  }
}

export { formStepReducer, emailValidationWithoutPassword };

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  click,
  fillField,
  mockedAxios,
  resetAxiosMocks,
} from "../../testUtils";
import { checkBackendFieldsErrors } from "../identification/testUtils";
import PasswordResetConfirm from "./PasswordResetConfirm";
import { fillResetPasswordConfirmFields } from "./testUtils";

jest.mock("axios");
initLanguagesForTesting();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Error handling", () => {
  it("displays an error message when the password 1 is missing", async () => {
    const app = renderPasswordResetConfirm();
    await fillResetPasswordConfirmFields(app, "password1");
    const errors = app.getAllByRole("alert");
    expect(errors[0].textContent).toMatch(/The password is required/);
  });

  it("displays an error message when the password 2 is missing", async () => {
    const app = renderPasswordResetConfirm();
    await fillResetPasswordConfirmFields(app, "password2");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/Password confirmation is required/);
  });

  it("displays an error message when the two passwords are not the same", async () => {
    const { getByText, getByLabelText, getByRole } =
      renderPasswordResetConfirm();
    fillField(getByLabelText, /Password/, "pass");
    fillField(getByLabelText, /Confirm password/, "pass2");
    const submit = getByText("Change your password");
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(/Passwords do not match/);
  });

  it(`displays an error message when the backend says the password field is
    in error`, async () => {
    await checkBackendFieldsErrors(
      "new_password",
      fillResetPasswordConfirmFields,
      renderPasswordResetConfirm()
    );
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const app = renderPasswordResetConfirm();
    await fillResetPasswordConfirmFields(app, "password1");
    expect(app.getByLabelText(/Password/)).toHaveFocus();
  });
});

it(`sends post request to the backend when submitting the form`, async () => {
  await fillResetPasswordConfirmFields(renderPasswordResetConfirm());
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
});

function renderPasswordResetConfirm() {
  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <PasswordResetConfirm
          displayRequestSuccess={() => null}
          displayRequestFailure={() => null}
        />
      </Router>
    </I18nProvider>
  );
}

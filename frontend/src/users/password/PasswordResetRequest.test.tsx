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
import PasswordResetRequest from "./PasswordResetRequest";
import { fillResetPasswordFields } from "./testUtils";

jest.mock("axios");
initLanguagesForTesting();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Error handling", () => {
  it("displays an error message when the email address is missing", async () => {
    const app = renderPasswordResetRequest();
    await fillResetPasswordFields(app, "email");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail is required/);
  });

  it("displays an error message when the email address does not meet the regex", async () => {
    const { getByText, getByLabelText, getByRole } =
      renderPasswordResetRequest();
    fillField(getByLabelText, /E-mail/, "bla@");
    const submit = getByText("Reset password");
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(
      /The e-mail must be formated like this: name@domain.extension/
    );
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const app = renderPasswordResetRequest();
    await fillResetPasswordFields(app, "email");
    expect(app.getByLabelText(/E-mail/)).toHaveFocus();
  });
});

it(`sends post request to the backend when submitting the form`, async () => {
  await fillResetPasswordFields(renderPasswordResetRequest());
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
});

function renderPasswordResetRequest() {
  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <PasswordResetRequest
          onClose={() => null}
          displayRequestSuccess={() => null}
          displayRequestFailure={() => null}
        />
      </Router>
    </I18nProvider>
  );
}

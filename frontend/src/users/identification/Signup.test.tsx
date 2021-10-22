import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import { click, fillField, mockedAxios } from "../../testUtils";
import Signup from "./Signup";
import { checkBackendFieldsErrors, fillSignupFields } from "./testUtils";

jest.mock("axios");
initLanguagesForTesting();

afterEach(() => {
  jest.clearAllMocks();
});

function renderSignup() {
  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Signup
          setToken={(token) => null}
          handleCloseIdentification={() => null}
        />
      </Router>
    </I18nProvider>
  );
}

describe("Errors on mandatory fields", () => {
  it("displays an error message when the first name is missing", async () => {
    const app = renderSignup();
    await fillSignupFields(app, "firstName");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The first name .* is required/);
  });

  it("displays an error message when the email address is missing", async () => {
    const app = renderSignup();
    await fillSignupFields(app, "email");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail is required/);
  });

  it("displays an error message when the password 1 is missing", async () => {
    const app = renderSignup();
    await fillSignupFields(app, "password1");
    const errors = app.getAllByRole("alert");
    expect(errors[0].textContent).toMatch(/The password is required/);
  });

  it("displays an error message when the password 2 is missing", async () => {
    const app = renderSignup();
    await fillSignupFields(app, "password2");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/Password confirmation is required/);
  });
});

describe("Errors on fields' format", () => {
  it("displays an error message when the email does not meet the regex ", async () => {
    const { getByText, getByLabelText, getByRole } = renderSignup();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "Koena");
    fillField(getByLabelText, /E-mail/, "bla@");
    fillField(getByLabelText, /Password/, "pass");
    fillField(getByLabelText, /Confirm password/, "pass");
    const submit = getByText("Sign up");
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(
      /The e-mail must be formated like this: name@domain.extension/
    );
  });

  it("displays an error message when the two passwords are not the same", async () => {
    const { getByText, getByLabelText, getByRole } = renderSignup();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "Koena");
    fillField(getByLabelText, /E-mail/, "bla@bla.fr");
    fillField(getByLabelText, /Password/, "pass");
    fillField(getByLabelText, /Confirm password/, "pass2");
    const submit = getByText("Sign up");
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(/Passwords do not match/);
  });
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies without response
  data`, async () => {
    const app = renderSignup();
    mockedAxios.post.mockRejectedValue({ data: "" });
    await fillSignupFields(app, null, 1);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to sign you up/);
  });

  it(`displays an error message when the backend says the first name field is
  in error`, async () => {
    await checkBackendFieldsErrors(
      "first_name",
      fillSignupFields,
      renderSignup()
    );
  });

  it(`displays an error message when the backend says the last name field is
  in error`, async () => {
    await checkBackendFieldsErrors(
      "last_name",
      fillSignupFields,
      renderSignup()
    );
  });

  it(`displays an error message when the backend says the email field is
  in error`, async () => {
    await checkBackendFieldsErrors("email", fillSignupFields, renderSignup());
  });

  it(`displays an error message when the backend says the phone number field is
  in error`, async () => {
    await checkBackendFieldsErrors(
      "phone_number",
      fillSignupFields,
      renderSignup()
    );
  });

  it(`displays an error message when the backend says the password field is
  in error`, async () => {
    await checkBackendFieldsErrors(
      "password",
      fillSignupFields,
      renderSignup()
    );
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const { getByText, getByLabelText } = renderSignup();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "");
    fillField(getByLabelText, /E-mail/, "bla@");
    fillField(getByLabelText, /Password/, "pass");
    fillField(getByLabelText, /Confirm password/, "pass");
    const submit = getByText("Sign up");
    await click(submit);
    expect(getByLabelText(/First name/)).toHaveFocus();
  });
});

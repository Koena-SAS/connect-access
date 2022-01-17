import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  click,
  fillField,
  mockedAxios,
  resetAxiosMocks,
} from "../../testUtils";
import Login from "./Login";
import { fillLoginFields } from "./testUtils";

jest.mock("axios");
initLanguagesForTesting();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Back button", () => {
  it(`goes back to email validation when click on cancel button from the final step
  of passwordless login`, async () => {
    const app = renderLogin();
    mockedAxios.post.mockRejectedValue({ data: "" });
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    await click(app.getByText("Cancel"));
    expect(app.getByLabelText(/E-mail/)).toBeInTheDocument();
    expect(app.queryByLabelText(/Token/)).not.toBeInTheDocument();
  });
});

describe("Errors on mandatory fields", () => {
  it("displays an error message when the email address is missing", async () => {
    const app = renderLogin();
    await fillLoginFields(app, "email");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail is required/);
  });
  it(`displays an error message when the password mode is checked and the password
  is missing`, async () => {
    const app = renderLogin();
    await fillLoginFields(app, "password");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The password is required/);
  });
  it(`displays an error message when the token mode is checked and the token
  is missing`, async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    await click(app.getByTestId("loginSubmit"));
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The token is required/);
  });
});

describe("Errors on fields' format", () => {
  it("displays an error message when the email address does not meet the regex", async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@");
    await click(app.getByLabelText(/with password/));
    const submit = app.getByText("Log in");
    await click(submit);
    const errors = app.getAllByRole("alert");
    expect(errors[0].textContent).toMatch(
      /The e-mail must be formated like this: name@domain.extension/
    );
  });
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies without response
  data when logging in with password`, async () => {
    const app = renderLogin();
    mockedAxios.post.mockRejectedValue({ data: "" });
    await fillLoginFields(app);
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to log you in/);
  });
  it(`displays an error message when the backend replies without response
  data when validating the email while logging in without password`, async () => {
    const app = renderLogin();
    mockedAxios.post.mockRejectedValue({ data: "" });
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to send the email/);
  });
  it(`displays an error message when the backend replies without response
  data when logging in without password`, async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    mockedAxios.post.mockRejectedValue({ data: "" });
    const tokenField = await waitFor(() => app.getByLabelText(/Token/));
    fireEvent.change(tokenField, { target: { value: "531684" } });
    await click(app.getByTestId("loginSubmit"));
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to log you in/);
  });

  it(`displays an error message *coming from the backend* when the backend
  says the identifiers are incorrect, when logging in with password`, async () => {
    const app = renderLogin();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["A first specific error", "A second error"],
        },
      },
    });
    await fillLoginFields(app);
    const errors = app.getAllByRole("alert");
    expect(errors[0].textContent).toMatch(/A first specific error/);
    expect(errors[1].textContent).toMatch(/A second error/);
  });
  it(`displays an error message when the backend says the identifiers
  are incorrect, when logging in without password`, async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["A first specific error", "A second error"],
        },
      },
    });
    const tokenField = await waitFor(() => app.getByLabelText(/Token/));
    fireEvent.change(tokenField, { target: { value: "531684" } });
    await click(app.getByTestId("loginSubmit"));
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to log you in/);
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@");
    await click(app.getByLabelText(/with password/));
    const submit = app.getByText("Log in");
    await click(submit);
    expect(app.getByLabelText(/E-mail/)).toHaveFocus();
  });
  it("gives focus to the token field, when validating the email without password", async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@bla.fr");
    await click(app.getByTestId("loginSubmit"));
    await waitFor(() => expect(app.getByLabelText(/Token/)).toHaveFocus());
  });
});

function renderLogin() {
  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Login
          setToken={(token) => null}
          handleCloseIdentification={() => null}
        />
      </Router>
    </I18nProvider>
  );
}

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import { click, fillField, mockedAxios } from "../../testUtils";
import Login from "./Login";
import { fillLoginFields } from "./testUtils";

jest.mock("axios");
initLanguagesForTesting();

afterEach(() => {
  jest.clearAllMocks();
});

describe("Errors on mandatory fields", () => {
  it("displays an error message when the email address is missing", async () => {
    const app = renderLogin();
    await fillLoginFields(app, "email");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail is required/);
  });
  it("displays an error message when the password is missing", async () => {
    const app = renderLogin();
    await fillLoginFields(app, "password");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The password is required/);
  });
});

describe("Errors on fields' format", () => {
  it("displays an error message when the email address does not meet the regex", async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@");
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
  data`, async () => {
    const app = renderLogin();
    mockedAxios.post.mockRejectedValue({ data: "" });
    await fillLoginFields(app);
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/We were unable to log you in/);
  });

  it(`displays an error message when the backend says the identifiers
  are incorrect`, async () => {
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
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const app = renderLogin();
    fillField(app, /E-mail/, "bla@");
    const submit = app.getByText("Log in");
    await click(submit);
    expect(app.getByLabelText(/E-mail/)).toHaveFocus();
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

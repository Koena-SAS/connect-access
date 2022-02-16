import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { RenderResult } from "@testing-library/react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import ContactInformationContext from "../../contexts/contactInformation";
import { click, fillField } from "../../testUtils";
import { ContactInformationRecieved } from "../../types/footerConfiguration";
import {
  axiosGetResponseContactInformation,
  mockedAxios,
  resetAxiosMocks,
} from "../../__mocks__/axiosMock";
import Signup from "./Signup";
import { checkBackendFieldsErrors, fillSignupFields } from "./testUtils";

beforeEach(async () => {
  resetAxiosMocks();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
});

type RenderSignupProps = {
  handleCloseIdentification?: () => void;
  contactInofrmationValue?: ContactInformationRecieved;
};

function renderSignup({
  handleCloseIdentification = () => null,
  contactInofrmationValue = axiosGetResponseContactInformation.data,
}: RenderSignupProps = {}): RenderResult {
  return render(
    <ContactInformationContext.Provider value={contactInofrmationValue}>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router>
            <Signup
              setToken={(token) => null}
              handleCloseIdentification={handleCloseIdentification}
            />
          </Router>
        </I18nProvider>
      </SWRConfig>
    </ContactInformationContext.Provider>
  );
}

describe("Display elements", () => {
  it(`does not display terms of service checkbox if terms of service page content
  does not exist, and validates the registration form without that`, async () => {
    const fn = jest.fn();
    const app = renderSignup({
      handleCloseIdentification: fn,
      contactInofrmationValue: {},
    });
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "Koena");
    fillField(app, /E-mail/, "bla@bla.com");
    fillField(app, /Password/, "pass");
    fillField(app, /Confirm password/, "pass");
    await waitFor(() =>
      expect(app.queryByLabelText(/I have read/)).not.toBeInTheDocument()
    );
    const submit = app.getByText("Sign up");
    await click(submit);
    expect(app.queryByRole("alert")).not.toBeInTheDocument();
    expect(fn).toBeCalled();
  });
});

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

  it("displays an error message when the terms of service checkbox is not checked", async () => {
    const app = renderSignup();
    await fillSignupFields(app, "termsOfService");
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(
      /You have to accept the terms of service/
    );
  });
});

describe("Errors on fields' format", () => {
  it("displays an error message when the email does not meet the regex ", async () => {
    const app = renderSignup();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "Koena");
    fillField(app, /E-mail/, "bla@");
    fillField(app, /Password/, "pass");
    fillField(app, /Confirm password/, "pass");
    await click(app.getByText(/I have read/));
    const submit = app.getByText("Sign up");
    await click(submit);
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(
      /The e-mail must be formated like this: name@domain.extension/
    );
  });

  it("displays an error message when the two passwords are not the same", async () => {
    const app = renderSignup();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "Koena");
    fillField(app, /E-mail/, "bla@bla.fr");
    fillField(app, /Password/, "pass");
    fillField(app, /Confirm password/, "pass2");
    await click(app.getByText(/I have read/));
    const submit = app.getByText("Sign up");
    await click(submit);
    const error = app.getByRole("alert");
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
    const app = renderSignup();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "");
    fillField(app, /E-mail/, "bla@");
    fillField(app, /Password/, "pass");
    fillField(app, /Confirm password/, "pass");
    await click(app.getByText(/I have read/));
    const submit = app.getByText("Sign up");
    await click(submit);
    expect(app.getByLabelText(/First name/)).toHaveFocus();
  });
});

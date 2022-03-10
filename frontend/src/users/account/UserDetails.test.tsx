import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { click, fillField } from "../../testUtils";
import { mockedAxios, resetAxiosMocks } from "../../__mocks__/axiosMock";
import UserDetails from "./UserDetails";

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

async function renderUserDetails() {
  const app = render(
    <I18nProvider i18n={i18n}>
      <UserDetails token="e684rv98r4g" />
    </I18nProvider>
  );
  await waitFor(() =>
    expect(app.getByDisplayValue(/John/)).toBeInTheDocument()
  );
  return app;
}

it("displays the given user details", async () => {
  const { getByDisplayValue } = await renderUserDetails();
  expect(getByDisplayValue(/Doe/)).toBeInTheDocument();
  expect(getByDisplayValue(/john@doe.com/)).toBeInTheDocument();
  expect(getByDisplayValue(/2463259871/)).toBeInTheDocument();
});

it(`displays a success message when the user details are successfully
updated`, async () => {
  const app = await renderUserDetails();
  await fillFields(app);
  expect(
    app.getByText(/Your personal information was successfully updated/)
  ).toBeInTheDocument();
});

describe("Errors on mandatory fields", () => {
  it("displays an error message when the first name is missing", async () => {
    const app = await renderUserDetails();
    await fillFields(app, "firstName");
    const error = app.getByText(/The first name .* is required/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message when the email address is missing", async () => {
    const app = await renderUserDetails();
    await fillFields(app, "email");
    const error = app.getByText(/The e-mail is required/);
    expect(error).toBeInTheDocument();
  });
});

describe("Errors on bad formatted fields", () => {
  it("displays an error message when the email does not meet the regex", async () => {
    const app = await renderUserDetails();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "Koena");
    fillField(app, /E-mail/, "bla@");
    fillField(app, /Phone number/, "4365214982");
    const submit = app.getByText(/Validate your new personal/);
    await click(submit);
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail format is invalid/);
  });

  it(`displays an error message when the phone number does not meet the
regex`, async () => {
    const app = await renderUserDetails();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "Koena");
    fillField(app, /E-mail/, "bla@bla.fr");
    fillField(app, /Phone number/, "982");
    const submit = app.getByText(/Validate your new personal/);
    await click(submit);
    const error = app.getByRole("alert");
    expect(error.textContent).toMatch(/phone number format is/i);
  });
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies without response
data`, async () => {
    const app = await renderUserDetails();
    mockedAxios.put.mockRejectedValue({
      data: "error",
    });
    await fillFields(app);
    const error = app.getByText(
      /We could'nt update your personal information. Please retry later./
    );
    expect(error).toBeInTheDocument();
  });

  it(`displays an error message when the backend says the first name field is
in error`, async () => {
    await checkBackendFieldsErrors("first_name", await renderUserDetails());
  });

  it(`displays an error message when the backend says the last name field is
in error`, async () => {
    await checkBackendFieldsErrors("last_name", await renderUserDetails());
  });

  it(`displays an error message when the backend says the email field is
in error`, async () => {
    await checkBackendFieldsErrors("email", await renderUserDetails());
  });

  it(`displays an error message when the backend says the phone number field is
in error`, async () => {
    await checkBackendFieldsErrors("phone_number", await renderUserDetails());
  });

  async function checkBackendFieldsErrors(
    fieldName: string,
    app: RenderResult
  ) {
    mockedAxios.put.mockRejectedValue({
      response: {
        data: {
          [fieldName]: ["A first specific error", "A second error"],
        },
      },
    });
    // we consider here that the given field has wrong format for the backend
    await fillFields(app);
    const error1 = app.getByText(/A first specific error/);
    expect(error1).toBeInTheDocument();
    const error2 = app.getByText(/A second error/);
    expect(error2).toBeInTheDocument();
    mockedAxios.put.mockRejectedValue({
      response: {
        data: {
          [fieldName]: ["One specific error"],
        },
      },
    });
    await fillFields(app, null, 2);
    const error = app.getByText(/One specific error/);
    expect(error).toBeInTheDocument();
  }
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const app = await renderUserDetails();
    fillField(app, /Last name/, "KOENA");
    fillField(app, /First name/, "");
    fillField(app, /E-mail/, "bla@bla.fr");
    fillField(app, /Phone number/, "982");
    const submit = app.getByText(/Validate your new personal/);
    await click(submit);
    expect(app.getByLabelText(/First name/)).toHaveFocus();
  });
});

async function fillFields(
  app: RenderResult,
  missingField: string | null = null,
  postCallNumber: number = 1
) {
  [/Last name/, /First name/, /Phone number/, /E-mail/].forEach((label) =>
    fillField(app, label, "")
  );
  fillField(app, /Last name/, "KOENA", missingField !== "lastName");
  fillField(app, /First name/, "Koena", missingField !== "firstName");
  fillField(app, /E-mail/, "bla@bla.fr", missingField !== "email");
  fillField(app, /Phone number/, "4365214982", missingField !== "phoneNumber");
  const submit = app.getByText(/Validate your new personal/);
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.put).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

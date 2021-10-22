import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  click,
  fillField,
  mockedAxios,
  resetAxiosMocks,
} from "../../testUtils";
import UserDetails from "./UserDetails";

jest.mock("axios");
initLanguagesForTesting();

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
  const { getByLabelText, getByText } = await renderUserDetails();
  await fillFields(getByLabelText, getByText);
  expect(
    getByText(/Your personal information was successfully updated/)
  ).toBeInTheDocument();
});

describe("Errors on mandatory fields", () => {
  it("displays an error message when the first name is missing", async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await fillFields(getByLabelText, getByText, "firstName");
    const error = getByText(/The first name .* is required/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message when the email address is missing", async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await fillFields(getByLabelText, getByText, "email");
    const error = getByText(/The e-mail is required/);
    expect(error).toBeInTheDocument();
  });
});

describe("Errors on bad formatted fields", () => {
  it("displays an error message when the email does not meet the regex", async () => {
    const { getByText, getByLabelText, getByRole } = await renderUserDetails();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "Koena");
    fillField(getByLabelText, /E-mail/, "bla@");
    fillField(getByLabelText, /Phone number/, "4365214982");
    const submit = getByText(/Validate your new personal/);
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(/The e-mail must be/);
  });

  it(`displays an error message when the phone number does not meet the
regex`, async () => {
    const { getByText, getByLabelText, getByRole } = await renderUserDetails();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "Koena");
    fillField(getByLabelText, /E-mail/, "bla@bla.fr");
    fillField(getByLabelText, /Phone number/, "982");
    const submit = getByText(/Validate your new personal/);
    await click(submit);
    const error = getByRole("alert");
    expect(error.textContent).toMatch(/phone number format is/i);
  });
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies without response
data`, async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    mockedAxios.put.mockRejectedValue({
      data: "error",
    });
    await fillFields(getByLabelText, getByText);
    const error = getByText(
      /We could'nt update your personal information. Please retry later./
    );
    expect(error).toBeInTheDocument();
  });

  it(`displays an error message when the backend says the first name field is
in error`, async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await checkBackendFieldsErrors("first_name", getByText, getByLabelText);
  });

  it(`displays an error message when the backend says the last name field is
in error`, async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await checkBackendFieldsErrors("last_name", getByText, getByLabelText);
  });

  it(`displays an error message when the backend says the email field is
in error`, async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await checkBackendFieldsErrors("email", getByText, getByLabelText);
  });

  it(`displays an error message when the backend says the phone number field is
in error`, async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    await checkBackendFieldsErrors("phone_number", getByText, getByLabelText);
  });

  async function checkBackendFieldsErrors(
    fieldName,
    getByText,
    getByLabelText
  ) {
    mockedAxios.put.mockRejectedValue({
      response: {
        data: {
          [fieldName]: ["A first specific error", "A second error"],
        },
      },
    });
    // we consider here that the given field has wrong format for the backend
    await fillFields(getByLabelText, getByText);
    const error1 = getByText(/A first specific error/);
    expect(error1).toBeInTheDocument();
    const error2 = getByText(/A second error/);
    expect(error2).toBeInTheDocument();
    mockedAxios.put.mockRejectedValue({
      response: {
        data: {
          [fieldName]: ["One specific error"],
        },
      },
    });
    await fillFields(getByLabelText, getByText, 2);
    const error = getByText(/One specific error/);
    expect(error).toBeInTheDocument();
  }
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on submit", async () => {
    const { getByText, getByLabelText } = await renderUserDetails();
    fillField(getByLabelText, /Last name/, "KOENA");
    fillField(getByLabelText, /First name/, "");
    fillField(getByLabelText, /E-mail/, "bla@bla.fr");
    fillField(getByLabelText, /Phone number/, "982");
    const submit = getByText(/Validate your new personal/);
    await click(submit);
    expect(getByLabelText(/First name/)).toHaveFocus();
  });
});

async function fillFields(
  getByLabelText,
  getByText,
  missingField = null,
  postCallNumber = 1
) {
  [/Last name/, /First name/, /Phone number/, /E-mail/].forEach((label) =>
    fillField(getByLabelText, label, "")
  );
  fillField(getByLabelText, /Last name/, "KOENA", missingField !== "lastName");
  fillField(
    getByLabelText,
    /First name/,
    "Koena",
    missingField !== "firstName"
  );
  fillField(getByLabelText, /E-mail/, "bla@bla.fr", missingField !== "email");
  fillField(
    getByLabelText,
    /Phone number/,
    "4365214982",
    missingField !== "phoneNumber"
  );
  const submit = getByText(/Validate your new personal/);
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.put).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

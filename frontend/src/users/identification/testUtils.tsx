import type { RenderResult } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { click, fillField, mockedAxios } from "../../testUtils";

export async function fillSignupFields(
  app: RenderResult,
  missingField: string | null = null,
  postCallNumber: number = 2
) {
  fillField(app, /Last name/, "KOENA", missingField !== "lastName");
  fillField(app, /First name/, "Koena", missingField !== "firstName");
  fillField(app, /E-mail/, "bla@bla.fr", missingField !== "email");
  fillField(app, /Password/, "pass", missingField !== "password1");
  fillField(app, /Confirm password/, "pass", missingField !== "password2");
  const submit = app.getByText("Sign up");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

export async function fillLoginFields(
  app: RenderResult,
  missingField: string | null = null,
  postCallNumber: number = 1
) {
  fillField(app, /E-mail/, "bla@bla.fr", missingField !== "email");
  fillField(app, /Password/, "pass", missingField !== "password");
  const submit = app.getByTestId("loginSubmit");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

export async function checkBackendFieldsErrors(
  fieldName: string,
  fillFieldsFunction: (
    app: RenderResult,
    missingField: string | null,
    postCallNumber: number
  ) => Promise<void>,
  app: RenderResult
) {
  mockedAxios.post.mockRejectedValue({
    response: {
      data: {
        [fieldName]: ["A first specific error", "A second error"],
      },
    },
  });
  // we consider here that the given field has wrong format for the backend
  await fillFieldsFunction(app, null, 1);
  const error1 = app.getByText(/A first specific error/);
  expect(error1).toBeInTheDocument();
  const error2 = app.getByText(/A second error/);
  expect(error2).toBeInTheDocument();
  mockedAxios.post.mockRejectedValue({
    response: {
      data: {
        [fieldName]: ["One specific error"],
      },
    },
  });
  await fillFieldsFunction(app, null, 2);
  const error = app.getByText(/One specific error/);
  expect(error).toBeInTheDocument();
}

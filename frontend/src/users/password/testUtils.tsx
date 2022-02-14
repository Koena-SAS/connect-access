import { RenderResult, waitFor } from "@testing-library/react";
import { click, fillField } from "../../testUtils";
import { mockedAxios } from "../../__mocks__/axiosMock";

export async function fillResetPasswordFields(
  app: RenderResult,
  missingField: string | null = null,
  postCallNumber: number = 1
) {
  fillField(app, /E-mail/, "bla@bla.fr", missingField !== "email");
  const submit = app.getByText("Reset password");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

export async function fillResetPasswordConfirmFields(
  app: RenderResult,
  missingField: string | null = null,
  postCallNumber: number = 1
) {
  fillField(app, /Password/, "pass", missingField !== "password1");
  fillField(app, /Confirm password/, "pass", missingField !== "password2");
  const submit = app.getByText("Change your password");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

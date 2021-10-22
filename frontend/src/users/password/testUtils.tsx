import { waitFor } from "@testing-library/react";
import { click, fillField, mockedAxios } from "../../testUtils";

export async function fillResetPasswordFields(
  app,
  missingField = null,
  postCallNumber = 1
) {
  fillField(
    app.getByLabelText,
    /E-mail/,
    "bla@bla.fr",
    missingField !== "email"
  );
  const submit = app.getByText("Reset password");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

export async function fillResetPasswordConfirmFields(
  app,
  missingField = null,
  postCallNumber = 1
) {
  fillField(
    app.getByLabelText,
    /Password/,
    "pass",
    missingField !== "password1"
  );
  fillField(
    app.getByLabelText,
    /Confirm password/,
    "pass",
    missingField !== "password2"
  );
  const submit = app.getByText("Change your password");
  await click(submit);
  if (!missingField) {
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postCallNumber)
    );
  }
}

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import { resetAxiosMocks } from "../../testUtils";
import Account from "./Account";

jest.mock("axios");
initLanguagesForTesting();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

it("displays account info", async () => {
  const { getByText, getByDisplayValue } = render(
    <I18nProvider i18n={i18n}>
      <Account token="e684rv98r4g" />
    </I18nProvider>
  );
  expect(getByText(/My account/)).toBeInTheDocument();
  await waitFor(() => expect(getByDisplayValue(/John/)).toBeInTheDocument());
});

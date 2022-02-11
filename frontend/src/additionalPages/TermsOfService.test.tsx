import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { cache, SWRConfig } from "swr";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { resetAxiosMocks } from "../testUtils";
import "../__mocks__/ReactMarkdown";
import TermsOfService from "./TermsOfService";

initLanguagesForTesting();

beforeEach(async () => {
  resetAxiosMocks();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

async function renderTermsOfService(): Promise<RenderResult> {
  return await waitFor(() =>
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <TermsOfService />
        </I18nProvider>
      </SWRConfig>
    )
  );
}

it("displays terms of service page content from the backend", async () => {
  const { getByText } = await renderTermsOfService();
  expect(getByText("Terms of service content")).toBeInTheDocument();
});

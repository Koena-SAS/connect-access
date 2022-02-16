import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { cache, SWRConfig } from "swr";
import ContactInformationContext from "../contexts/contactInformation";
import {
  axiosGetResponseContactInformation,
  resetAxiosMocks,
} from "../__mocks__/axiosMock";
import "../__mocks__/reactMarkdownMock";
import TermsOfService from "./TermsOfService";

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
      <ContactInformationContext.Provider
        value={axiosGetResponseContactInformation.data}
      >
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <I18nProvider i18n={i18n}>
            <TermsOfService />
          </I18nProvider>
        </SWRConfig>
      </ContactInformationContext.Provider>
    )
  );
}

it("displays terms of service page content from the backend", async () => {
  const { getByText } = await renderTermsOfService();
  expect(getByText("Terms of service content")).toBeInTheDocument();
});

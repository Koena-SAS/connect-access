import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import ContactInformationContext from "../contexts/contactInformation";
import {
  axiosGetResponseContactInformation,
  resetAxiosMocks,
} from "../__mocks__/axiosMock";
import Footer from "./Footer";

beforeEach(async () => {
  resetAxiosMocks();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

async function renderFooter(): Promise<RenderResult> {
  return await waitFor(() =>
    render(
      <ContactInformationContext.Provider
        value={axiosGetResponseContactInformation.data}
      >
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <I18nProvider i18n={i18n}>
            <Router>
              <Footer />
            </Router>
          </I18nProvider>
        </SWRConfig>
      </ContactInformationContext.Provider>
    )
  );
}

it("displays about service information from the backend", async () => {
  const { getByText } = await renderFooter();
  expect(getByText("About us")).toBeInTheDocument();
  expect(getByText("Legal information")).toBeInTheDocument();
});

it("displays mediation company contact information from the backend", async () => {
  const { getByText } = await renderFooter();
  expect(getByText("mediation@koena.net")).toBeInTheDocument();
  expect(getByText("+33 (0)9 72 63 21")).toBeInTheDocument();
});

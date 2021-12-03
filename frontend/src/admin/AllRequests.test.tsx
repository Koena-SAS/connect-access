import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  mediationRequestsResponse,
  mockedAxios,
  resetAxiosMocks,
} from "../testUtils";
import AllRequests from "./AllRequests";

initLanguagesForTesting();
jest.mock("axios");

let mediationsResponse;

beforeEach(() => {
  mediationsResponse = mediationRequestsResponse.slice();
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

async function renderAllRequests(history) {
  let app;
  async function renderAllRequestsComponent() {
    return render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <AllRequests token="65edg64e" />
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  await waitFor(() => {
    app = renderAllRequestsComponent();
  });
  return app;
}

it(`displays the list of the mediation requests sent by the backend`, async () => {
  mockedAxios.get.mockResolvedValue({ data: mediationsResponse });
  const history = createMemoryHistory();
  const { getByText } = await renderAllRequests(history);
  const firstMediationRequestId = getByText(/4ae77193/);
  const secondMediationRequestId = getByText(/f8842f63/);
  expect(firstMediationRequestId).toBeInTheDocument();
  expect(secondMediationRequestId).toBeInTheDocument();
});

describe("Filter requests", () => {
  it(`filters correctly by status all the mediation requests`, async () => {
    const history = createMemoryHistory();
    const { getByText, queryByText, getByLabelText } = await renderAllRequests(
      history
    );
    fireEvent.change(getByLabelText(/Status/), {
      target: { value: "WAITING_MEDIATOR_VALIDATION" },
    });
    expect(getByText("4ae77193")).toBeInTheDocument();
    expect(queryByText("f8842f63")).not.toBeInTheDocument();
  });

  it(`filters correctly by organization all the mediation requests`, async () => {
    const history = createMemoryHistory();
    const { getByText, queryByText, getByLabelText } = await renderAllRequests(
      history
    );
    fireEvent.change(getByLabelText(/Application/), {
      target: { value: "Site (Stivo)" },
    });
    expect(queryByText("4ae77193")).not.toBeInTheDocument();
    expect(getByText("f8842f63")).toBeInTheDocument();

    fireEvent.change(getByLabelText(/Application/), {
      target: { value: "OTHER" },
    });
    expect(getByText("4ae77193")).toBeInTheDocument();
    expect(queryByText("f8842f63")).not.toBeInTheDocument();
  });
});

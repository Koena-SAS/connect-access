import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { MediationRequestRecieved } from "../types/mediationRequest";
import {
  axiosGetResponseMediationRequests,
  mockedAxios,
  resetAxiosMocks,
} from "../__mocks__/axiosMock";
import AllRequests from "./AllRequests";

let mediationsResponse: MediationRequestRecieved[];

beforeEach(() => {
  resetAxiosMocks();
  mediationsResponse = axiosGetResponseMediationRequests.data.slice();
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

async function renderAllRequests(history: History): Promise<RenderResult> {
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
  return await waitFor(() => renderAllRequestsComponent());
}

it(`displays the list of the mediation requests sent by the backend`, async () => {
  mockedAxios.get.mockResolvedValue({ data: mediationsResponse });
  const history = createMemoryHistory();
  const { getByText } = await renderAllRequests(history);
  const firstMediationRequestId = getByText("4ae77193");
  const secondMediationRequestId = getByText("f8842f63");
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
});

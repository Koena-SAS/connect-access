import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { click, generatePathsWithoutPrefix } from "../testUtils";
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

const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

async function renderAllRequests(history?: History): Promise<RenderResult> {
  const localHistory = history
    ? history
    : createMemoryHistory({
        initialEntries: [generatedPathsWithoutPrefix.ADMIN_ALL_REQUESTS],
      });
  async function renderAllRequestsComponent() {
    return render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={localHistory}>
            <Route path={PATHS_WITHOUT_PREFIX.ADMIN_ALL_REQUESTS}>
              <AllRequests token="65edg64e" />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  return await waitFor(() => renderAllRequestsComponent());
}

it(`displays the list of the mediation requests sent by the backend`, async () => {
  mockedAxios.get.mockResolvedValue({ data: mediationsResponse });
  const { getByText } = await renderAllRequests();
  const firstMediationRequestId = getByText("4ae77193");
  const secondMediationRequestId = getByText("f8842f63");
  expect(firstMediationRequestId).toBeInTheDocument();
  expect(secondMediationRequestId).toBeInTheDocument();
});

describe("Filter requests", () => {
  it(`filters correctly by status all the mediation requests`, async () => {
    const { getByText, queryByText, getByLabelText } =
      await renderAllRequests();
    fireEvent.change(getByLabelText(/Status/), {
      target: { value: "WAITING_MEDIATOR_VALIDATION" },
    });
    expect(getByText("4ae77193")).toBeInTheDocument();
    expect(queryByText("f8842f63")).not.toBeInTheDocument();
  });
});

describe("Details buttons", () => {
  it(`redirects to the correct mediation details when clicking to
  Details button`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithoutPrefix.ADMIN_ALL_REQUESTS],
    });
    await renderAllRequests(history);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ADMIN_ALL_REQUESTS
    );
    const detailButton = screen.getAllByText(/Details/)[2];
    await click(detailButton);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ADMIN_REQUEST_DETAIL
    );
  });
});

describe("Remove buttons", () => {
  describe("Removing the mediation request", () => {
    it(`closes the delete request dialog when clicking on No button`, async () => {
      await renderAllRequests();
      await click(screen.getAllByText(/Remove/)[0]);
      await click(screen.getByText("No"));
      await waitFor(() =>
        expect(screen.queryByText("Yes")).not.toBeInTheDocument()
      );
      expect(
        screen.queryByText(/The mediation request was successfully updated/)
      ).not.toBeInTheDocument();
    });

    it(`closes the delete request dialog when confirming successfully`, async () => {
      await renderAllRequests();
      await click(screen.getAllByText(/Remove/)[0]);
      await click(screen.getByText("Yes"));
      await waitFor(() =>
        expect(screen.queryByText("Yes")).not.toBeInTheDocument()
      );
      expect(
        screen.getByText(/The mediation request was successfully deleted/)
      ).toBeInTheDocument();
    });
  });

  describe("Errors from the backend", () => {
    it(`displays an error message when the backend replies with an error
    during update`, async () => {
      mockedAxios.delete.mockRejectedValue({ data: "backend error" });
      await renderAllRequests();
      await click(screen.getAllByText(/Remove/)[0]);
      await click(screen.getByText("Yes"));
      expect(
        screen.getByText(/The mediation request deletion was not successful/)
      ).toBeInTheDocument();
    });
  });
});

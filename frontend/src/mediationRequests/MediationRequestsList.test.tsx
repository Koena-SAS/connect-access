import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import {
  mediationRequests as mediationRequestsConst,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import type { MediationRequest } from "../types/mediationRequest";
import MediationRequestsList from "./MediationRequestsList";

let mediationRequests: MediationRequest[];

beforeEach(() => {
  mediationRequests = mediationRequestsConst.slice();
});

afterEach(() => {
  jest.clearAllMocks();
});

it("displays the list of given mediation requests", async () => {
  const history = createMemoryHistory();
  const { getByText, getAllByText } = renderMediationRequestList(history);
  expect(getByText("f8842f63")).toBeInTheDocument();
  expect(getByText("4ae77193")).toBeInTheDocument();
  expect(getAllByText(/2021/).length).toEqual(2);
  expect(getAllByText(/Koena/).length).toEqual(1);
  expect(
    getByText(/It loads but I don't get all the informaiton/)
  ).toBeInTheDocument();
  expect(getByText(/It fails to load/)).toBeInTheDocument();
  expect(getByText(/Waiting for mediator validation/)).toBeInTheDocument();
  expect(getByText(/Waiting for contact/)).toBeInTheDocument();
});

it(`redirects to the correct path when clicking on a specific
 mediation request`, async () => {
  await runWithAndWithoutOrganizationPrefix(
    async (generatedPaths: Paths, paths: Paths) => {
      const history = createMemoryHistory();
      history.push(generatedPaths.USER_REQUESTS);
      expect(history.location.pathname).toEqual(generatedPaths.USER_REQUESTS);
      const { getByText } = renderMediationRequestList(
        history,
        generatedPaths,
        paths
      );
      const id = getByText("f8842f63");
      expect(id).toBeInTheDocument();
      const detailsButton = within(id.closest("tr") as HTMLElement).getByText(
        "Details"
      );
      fireEvent.click(detailsButton);
      expect(history.location.pathname).toEqual(generatedPaths.USER_REQUEST);
    }
  );
});

function renderMediationRequestList(
  history?: any,
  generatedPaths?: any,
  paths?: any
) {
  if (!paths) {
    paths = PATHS_WITHOUT_PREFIX;
  }
  if (!history) {
    if (generatedPaths) {
      history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
    } else {
      history = createMemoryHistory();
    }
  }
  return render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <MediationRequestsList
            mediationRequests={mediationRequests}
            detailsPath={PATHS.USER_REQUEST}
          />
        </Route>
      </Router>
    </I18nProvider>
  );
}

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  mediationRequestsResponse,
  mockedAxios,
  runWithAndWithoutOrganizationPrefix,
} from "../../testUtils";
import UserMediation from "./UserMediation";

initLanguagesForTesting();
jest.mock("axios");

let userMediationsResponse;

beforeEach(() => {
  userMediationsResponse = mediationRequestsResponse.slice();
});

afterEach(() => {
  jest.clearAllMocks();
});

it(`displays the detail of the selected user mediation request`, async () => {
  await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
    mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
    const history = createMemoryHistory({
      initialEntries: [generatedPaths.USER_REQUEST],
    });
    const { getByText, queryByText } = render(
      <I18nProvider i18n={i18n}>
        <Router history={history}>
          <Route path={paths.USER_REQUEST}>
            <UserMediation token="65edg64e" />
          </Route>
        </Router>
      </I18nProvider>
    );
    const firstMediationRequestEmail = await waitFor(() =>
      getByText(/bluebill@koena.net/)
    );
    const secondMediationRequestEmail = queryByText(/john@doe.com/);
    const aboutYouText = queryByText(/About you/);
    expect(firstMediationRequestEmail).toBeInTheDocument();
    expect(secondMediationRequestEmail).not.toBeInTheDocument();
    expect(aboutYouText).toBeInTheDocument();
  });
});

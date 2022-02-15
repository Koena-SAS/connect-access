import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../../constants/paths";
import { runWithAndWithoutOrganizationPrefix } from "../../testUtils";
import type { MediationRequestRecieved } from "../../types/mediationRequest";
import {
  axiosGetResponseMediationRequests,
  mockedAxios,
  resetAxiosMocks,
} from "../../__mocks__/axiosMock";
import UserMediation from "./UserMediation";

let userMediationsResponse: MediationRequestRecieved[];

beforeEach(() => {
  resetAxiosMocks();
  userMediationsResponse = axiosGetResponseMediationRequests.data.slice();
});

afterEach(() => {
  jest.clearAllMocks();
});

it(`displays the detail of the selected user mediation request`, async () => {
  await runWithAndWithoutOrganizationPrefix(
    async (generatedPaths: Paths, paths: Paths) => {
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
    }
  );
});

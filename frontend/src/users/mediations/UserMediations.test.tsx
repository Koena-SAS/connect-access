import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import { mediationRequestsResponse, mockedAxios } from "../../testUtils";
import type { MediationRequestRecieved } from "../../types/mediationRequest";
import UserMediations from "./UserMediations";

initLanguagesForTesting();
jest.mock("axios");

let userMediationsResponse: MediationRequestRecieved[];

beforeEach(() => {
  userMediationsResponse = mediationRequestsResponse.slice();
});

afterEach(() => {
  jest.clearAllMocks();
});

it(`displays the list of the user mediation requests sent by the backend`, async () => {
  mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
  const history = createMemoryHistory();
  const { getByText } = render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <UserMediations token="65edg64e" />
      </Router>
    </I18nProvider>
  );
  const firstMediationRequestId = await waitFor(() => getByText(/4ae77193/));
  const secondMediationRequestId = getByText(/f8842f63/);
  expect(firstMediationRequestId).toBeInTheDocument();
  expect(secondMediationRequestId).toBeInTheDocument();
});

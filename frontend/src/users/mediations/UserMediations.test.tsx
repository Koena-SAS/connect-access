import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import type { MediationRequestRecieved } from "../../types/mediationRequest";
import {
  axiosGetResponseMediationRequests,
  mockedAxios,
  resetAxiosMocks,
} from "../../__mocks__/axiosMock";
import UserMediations from "./UserMediations";

let userMediationsResponse: MediationRequestRecieved[];

beforeEach(() => {
  resetAxiosMocks();
  userMediationsResponse = axiosGetResponseMediationRequests.data.slice();
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
  const firstMediationRequestId = await waitFor(() => getByText("4ae77193"));
  const secondMediationRequestId = getByText("f8842f63");
  expect(firstMediationRequestId).toBeInTheDocument();
  expect(secondMediationRequestId).toBeInTheDocument();
});

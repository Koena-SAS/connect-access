import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import { generatePathsWithoutPrefix } from "../../testUtils";
import { resetAxiosMocks } from "../../__mocks__/axiosMock";
import RequestDetail from "./RequestDetail";

initLanguagesForTesting();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  await waitFor(() => cache.clear());
});

const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

async function renderRequestDetail(
  history?: any,
  generatedPaths?: any,
  paths?: any
): Promise<RenderResult> {
  if (!paths) {
    paths = PATHS_WITHOUT_PREFIX;
  }
  if (!history) {
    if (!generatedPaths) {
      generatedPaths = generatedPathsWithoutPrefix;
    }
    history = createMemoryHistory({
      initialEntries: [generatedPaths.ADMIN_REQUEST_DETAIL],
    });
  }
  function renderTraceReportComponent() {
    return render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <Route path={paths.ADMIN_REQUEST_DETAIL}>
              <RequestDetail token="oizjofjzoijf" setBreadcrumbs={() => null} />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  return await waitFor(() => renderTraceReportComponent());
}

describe("display", () => {
  it(`displays mediation request details`, async () => {
    const { getByDisplayValue, getByLabelText } = await renderRequestDetail();
    expect(getByDisplayValue("Bill")).toBeInTheDocument();
    expect(getByDisplayValue("Blue")).toBeInTheDocument();
    expect(getByDisplayValue("bluebill@koena.net")).toBeInTheDocument();
    expect(getByDisplayValue("5555555555")).toBeInTheDocument();
    expect(getByDisplayValue("Keyboard")).toBeInTheDocument();
    expect(getByDisplayValue(/Braille/)).toBeInTheDocument();
    expect(getByDisplayValue("Fictive technology")).toBeInTheDocument();
    expect(getByDisplayValue("3.5.2")).toBeInTheDocument();
    expect(
      within(getByLabelText(/Is your problem urgent?/)).getByLabelText(
        /Not urgent at all/
      )
    ).toBeChecked();
    expect(getByDisplayValue("It fails to load")).toBeInTheDocument();
    expect(getByDisplayValue("I try to load the page")).toBeInTheDocument();
    expect(
      within(
        getByLabelText(/What was the level of inaccessibility/)
      ).getByLabelText("Impossible access")
    ).toBeChecked();
  });
});

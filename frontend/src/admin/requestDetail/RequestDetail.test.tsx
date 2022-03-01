import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import { generatePathsWithoutPrefix } from "../../testUtils";
import { resetAxiosMocks } from "../../__mocks__/axiosMock";
import RequestDetail from "./RequestDetail";

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  await waitFor(() => cache.clear());
});

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
      generatedPaths = generatePathsWithoutPrefix();
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
  it(`displays mediation request details when the organization is a partner`, async () => {
    const {
      getByDisplayValue,
      getByLabelText,
      queryByText,
      queryByDisplayValue,
      getByText,
    } = await renderRequestDetail();
    expect(getByText(/f8842f63/)).toBeInTheDocument();
    expect(getByText(/2ec8eb82f37d/)).toBeInTheDocument();
    expect(
      getByDisplayValue("1/08/2021", { exact: false })
    ).toBeInTheDocument();
    expect(getByText("1/9/2021", { exact: false })).toBeInTheDocument();
    expect(getByDisplayValue("Bill")).toBeInTheDocument();
    expect(getByDisplayValue("Blue")).toBeInTheDocument();
    expect(getByDisplayValue("bluebill@koena.net")).toBeInTheDocument();
    expect(getByDisplayValue("5555555555")).toBeInTheDocument();
    expect(getByDisplayValue("Keyboard")).toBeInTheDocument();
    expect(getByDisplayValue(/Braille/)).toBeInTheDocument();
    expect(getByDisplayValue("Fictive technology")).toBeInTheDocument();
    expect(getByDisplayValue("3.5.2")).toBeInTheDocument();
    expect(
      within(getByLabelText(/Is the problem urgent?/)).getByLabelText(
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
    expect(
      within(
        getByLabelText(/Did the problem occur while using a web browser?/)
      ).getByLabelText("No")
    ).toBeChecked();
    expect(
      queryByText(
        /What is the URL address where you have encountered the problem?/
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(/Which web browser did you use?/)
    ).not.toBeInTheDocument();
    expect(
      queryByText(/Which web browser version did you use?/)
    ).not.toBeInTheDocument();
    expect(
      within(getByLabelText(/Was it a mobile app?/)).getByLabelText("Yes")
    ).toBeChecked();
    expect(getByDisplayValue("Windows phone")).toBeInTheDocument();
    expect(getByDisplayValue("Super app")).toBeInTheDocument();
    expect(
      queryByText(/Which software, connected object or other did you use?/)
    ).not.toBeInTheDocument();
    expect(
      within(
        getByLabelText(
          /Did you already tell the organization in charge about the problem?/
        )
      ).getByLabelText("Yes")
    ).toBeChecked();
    expect(
      within(getByLabelText(/Did they reply?/)).getByLabelText("Yes")
    ).toBeChecked();
    expect(getByDisplayValue("No reply")).toBeInTheDocument();
    expect(getByDisplayValue("Nothing to add")).toBeInTheDocument();
    expect(getByText("Download the current attached file")).toBeInTheDocument();
    expect(queryByDisplayValue(/Koena/)).not.toBeInTheDocument();
    expect(
      queryByDisplayValue(/2, esplanade de la Gare à Sannois 95110/)
    ).not.toBeInTheDocument();
    expect(queryByDisplayValue(/aloha@koena.net/)).not.toBeInTheDocument();
    expect(queryByDisplayValue(/0972632128/)).not.toBeInTheDocument();
    expect(queryByDisplayValue(/Armony/)).not.toBeInTheDocument();
  });

  it(`displays mediation request details when the organization is not a partner`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    const { getByDisplayValue } = await renderRequestDetail(history);
    expect(getByDisplayValue("Koena")).toBeInTheDocument();
    expect(
      getByDisplayValue("2, esplanade de la Gare à Sannois 95110")
    ).toBeInTheDocument();
    expect(getByDisplayValue("aloha@koena.net")).toBeInTheDocument();
    expect(getByDisplayValue("0972632128")).toBeInTheDocument();
    expect(getByDisplayValue("Armony")).toBeInTheDocument();
  });

  it(`displays the current attached file if there is one`, async () => {
    const { getByText } = await renderRequestDetail();
    expect(getByText("Download the current attached file")).toBeInTheDocument();
  });

  it(`does not display the current attached file if there is none`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    const { queryByText } = await renderRequestDetail(history);
    expect(
      queryByText("Download the current attached file")
    ).not.toBeInTheDocument();
  });
});

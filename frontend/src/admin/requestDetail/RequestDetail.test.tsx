import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import {
  checkOptionIsSelected,
  fillField,
  generatePathsWithoutPrefix,
} from "../../testUtils";
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

describe("Display the mediation request details", () => {
  it(`displays mediation request details when the organization is a partner`, async () => {
    await renderRequestDetail();
    expect(screen.getByText(/f8842f63/)).toBeInTheDocument();
    expect(screen.getByText(/2ec8eb82f37d/)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("1/08/2021", { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("1/9/2021", { exact: false })).toBeInTheDocument();
    checkOptionIsSelected("Waiting for contact", "Request status");
    expect(
      within(screen.getByLabelText(/Is the problem urgent?/)).getByLabelText(
        /Not urgent at all/
      )
    ).toBeChecked();
    expect(screen.getByDisplayValue("Bill")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Blue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("bluebill@koena.net")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5555555555")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Keyboard")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Braille/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fictive technology")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3.5.2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("It fails to load")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("I try to load the page")
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByLabelText(/What was the level of inaccessibility/)
      ).getByLabelText("Impossible access")
    ).toBeChecked();
    expect(
      within(
        screen.getByLabelText(
          /Did the problem occur while using a web browser?/
        )
      ).getByLabelText("No")
    ).toBeChecked();
    expect(
      screen.queryByText(
        /What is the URL address where you have encountered the problem?/
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Which web browser did you use?/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Which web browser version did you use?/)
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByLabelText(/Was it a mobile app?/)).getByLabelText(
        "Yes"
      )
    ).toBeChecked();
    expect(screen.getByDisplayValue("Windows phone")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Super app")).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Which software, connected object or other did you use?/
      )
    ).not.toBeInTheDocument();
    expect(
      within(
        screen.getByLabelText(
          /Did you already tell the organization in charge about the problem?/
        )
      ).getByLabelText("Yes")
    ).toBeChecked();
    expect(
      within(screen.getByLabelText(/Did they reply?/)).getByLabelText("Yes")
    ).toBeChecked();
    expect(screen.getByDisplayValue("No reply")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nothing to add")).toBeInTheDocument();
    expect(
      screen.getByText("Download the current attached file")
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue(/Koena/)).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(/2, esplanade de la Gare à Sannois 95110/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(/aloha@koena.net/)
    ).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(/0972632128/)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(/Armony/)).not.toBeInTheDocument();
  });

  it(`displays mediation request details when the organization is not a partner`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    await renderRequestDetail(history);
    expect(screen.getByDisplayValue("Koena")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("2, esplanade de la Gare à Sannois 95110")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("aloha@koena.net")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0972632128")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Armony")).toBeInTheDocument();
  });

  it(`displays the current attached file if there is one`, async () => {
    await renderRequestDetail();
    expect(
      screen.getByText("Download the current attached file")
    ).toBeInTheDocument();
  });

  it(`does not display the current attached file if there is none`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    await renderRequestDetail(history);
    expect(
      screen.queryByText("Download the current attached file")
    ).not.toBeInTheDocument();
  });
});

describe("Form validation success", () => {
  it(`displays a success message when the mediaiton request is successfully
  updated`, async () => {
    const app = await renderRequestDetail();
    fillField(app, /First name/, "Joseph");
    screen.getByRole("button", { name: "Update the mediation request" });
    expect(app.getByLabelText(/First name/)).toHaveDisplayValue("Joseph");
  });
});

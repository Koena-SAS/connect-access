import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
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
  click,
  fillField,
  generatePathsWithoutPrefix,
} from "../../testUtils";
import { mockedAxios, resetAxiosMocks } from "../../__mocks__/axiosMock";
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

  it(`displays the current attached file if there is one, with the checkbox to
  remove it`, async () => {
    await renderRequestDetail();
    expect(
      screen.getByText("Download the current attached file")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remove the attached file")
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
    expect(
      screen.queryByLabelText("Remove the attached file")
    ).not.toBeInTheDocument();
  });
});

describe("Form validation success", () => {
  it(`displays a success message when the mediaiton request is successfully
  updated`, async () => {
    await renderRequestDetail();
    await submitEditForm();
    expect(
      screen.getByText("The mediaiton request was successfully updated.")
    ).toBeInTheDocument();
  });
});

describe("Form errors on mandatory fields", () => {
  it(`displays an error message for every mandatory field not filled when
  validating the form`, async () => {
    const app = await renderRequestDetail();
    fillField(app, /First name/, "");
    fillField(app, "E-mail *", "");
    fillField(app, /What was the issue/, "");
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(
      app.getByText("The first name / username is required")
    ).toBeInTheDocument();
    expect(app.getByText("The e-mail is required")).toBeInTheDocument();
    expect(
      app.getByText("You have to describe your problem")
    ).toBeInTheDocument();
  });
});

describe("Form errors on wrong data format", () => {
  it(`displays an error message when validating the form with a wrong
  format for the email`, async () => {
    const app = await renderRequestDetail();
    fillField(app, "E-mail *", "bla@");
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it(`displays an error message when validating the form with a wrong
  format for the phone number`, async () => {
    const app = await renderRequestDetail();
    fillField(app, /Phone number/, "123");
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it(`displays an error message when validating the form with a wrong
  format for the problem URL`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    const app = await renderRequestDetail(history);
    fillField(app, /What is the URL/, "123");
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it(`displays an error message when validating the form with a wrong
  format for organization email`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    const app = await renderRequestDetail(history);
    const field = app.getAllByLabelText(/E-mail/);
    fireEvent.change(field[1], { target: { value: "bla@" } });
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it(`displays an error message when validating the form with a wrong
  format for organization phone number`, async () => {
    const history = createMemoryHistory({
      initialEntries: [
        generatePathsWithoutPrefix({
          requestId: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        }).ADMIN_REQUEST_DETAIL,
      ],
    });
    const app = await renderRequestDetail(history);
    const field = app.getAllByLabelText(/Phone number/);
    fireEvent.change(field[1], { target: { value: "123" } });
    await submitEditForm();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies with an error
  during update`, async () => {
    mockedAxios.patch.mockRejectedValue({ data: "backend error" });
    await renderRequestDetail();
    await submitEditForm();
    expect(
      screen.getByText(/We could'nt update the mediation request./)
    ).toBeInTheDocument();
  });
});

async function submitEditForm() {
  const submitButton = screen.getAllByRole("button", {
    name: "Update the mediation request",
  });
  await click(submitButton[0]);
}

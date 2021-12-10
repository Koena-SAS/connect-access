import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import type { Paths } from "../../constants/paths";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  click,
  generatePathsWithoutPrefix,
  mockedAxios,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../../testUtils";
import TraceReports from "./TraceReports";

initLanguagesForTesting();
jest.mock("axios");

beforeEach(async () => {
  resetAxiosMocks();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
});

const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

async function renderTraceReports(
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
              <TraceReports token="oizjofjzoijf" setBreadcrumbs={() => null} />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  return await waitFor(() => renderTraceReportComponent());
}

async function runBasicTest(callback: (app: RenderResult) => Promise<void>) {
  await runWithAndWithoutOrganizationPrefix(
    async (generatedPaths: Paths, paths: Paths) => {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ADMIN_REQUEST_DETAIL],
      });
      const app = await renderTraceReports(history, generatedPaths, paths);
      await callback(app);
    }
  );
}

describe("display", () => {
  it(`displays the trace reports related to a specific mediation request`, async () => {
    await runBasicTest(async ({ getByText, getAllByRole }) => {
      expect(getByText(/04\/03\/2021/)).toBeInTheDocument();
      expect(getByText("the call was fine")).toBeInTheDocument();
      expect(getByText(/Complainant/)).toBeInTheDocument();
      expect(getByText(/Mediator/)).toBeInTheDocument();
      expect(getByText(/John/)).toBeInTheDocument();
      const link = getAllByRole("link")[0] as HTMLLinkElement;
      expect(link.href).toContain("report.png");
      expect(getByText("Call")).toBeInTheDocument();

      expect(getByText(/06\/15\/2021/)).toBeInTheDocument();
      expect(getByText("informal contact")).toBeInTheDocument();
      expect(getByText("Other")).toBeInTheDocument();
    });
  });

  it(`closes the add report form when clicking on cancel button`, async () => {
    await runBasicTest(async ({ getByText, queryByText }) => {
      await click(getByText("Add a trace report"));
      await click(getByText("Cancel"));
      await waitFor(() =>
        expect(queryByText("Add the report")).not.toBeInTheDocument()
      );
    });
  });
  it(`closes the add report form when submitting successfully`, async () => {
    await runBasicTest(async ({ getByText, queryByText }) => {
      await click(getByText("Add a trace report"));
      await click(getByText("Add the report"));
      await waitFor(() =>
        expect(queryByText("Add the report")).not.toBeInTheDocument()
      );
    });
  });

  it(`closes the edit report form when clicking on cancel button`, async () => {
    const { getAllByText, getByText, queryByText } = await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    await click(getByText("Cancel"));
    await waitFor(() =>
      expect(queryByText("Edit the report")).not.toBeInTheDocument()
    );
  });
  it(`closes the edit report form when submitting successfully`, async () => {
    const { getAllByText, getByText, queryByText } = await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    await click(getByText("Edit the report"));
    await waitFor(() =>
      expect(queryByText("Edit the report")).not.toBeInTheDocument()
    );
  });

  it(`closes the delete report dialog when clicking on No button`, async () => {
    const { getAllByText, getByText, queryByText } = await renderTraceReports();
    await click(getAllByText("Remove")[0]);
    await click(getByText("No"));
    await waitFor(() => expect(queryByText("Yes")).not.toBeInTheDocument());
  });
  it(`closes the delete report dialog when confirming successfully`, async () => {
    const { getAllByText, getByText, queryByText } = await renderTraceReports();
    await click(getAllByText("Remove")[0]);
    await click(getByText("Yes"));
    await waitFor(() => expect(queryByText("Yes")).not.toBeInTheDocument());
  });

  it(`displays the attached file removal checkbox only when editing a trace report
  that has an attached file`, async () => {
    const { getAllByText, getByText, queryByText } = await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    expect(getByText("Remove the attached file")).toBeInTheDocument();
    await click(getByText("Edit the report"));
    await waitFor(() =>
      expect(queryByText("Edit the report")).not.toBeInTheDocument()
    );
    await click(getAllByText("Edit")[1]);
    expect(queryByText("Remove the attached file")).not.toBeInTheDocument();
  });

  it(`displays the sender name field only when the sender type is
  appropriate`, async () => {
    const { getAllByText, getByLabelText, queryByLabelText } =
      await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    fireEvent.change(getByLabelText("Sender type"), {
      target: { value: "COMPLAINANT" },
    });
    expect(queryByLabelText("Sender name(s)")).not.toBeInTheDocument();
    fireEvent.change(getByLabelText("Sender type"), {
      target: { value: "EXTERNAL_ORGANIZATION" },
    });
    expect(getByLabelText("Sender name(s)")).toBeInTheDocument();
  });

  it(`displays the recipient name field only when the recipient type is
  appropriate`, async () => {
    const { getAllByText, getByLabelText, queryByLabelText } =
      await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    fireEvent.change(getByLabelText("Recipient type"), {
      target: { value: "COMPLAINANT" },
    });
    expect(queryByLabelText("Recipient name(s)")).not.toBeInTheDocument();
    fireEvent.change(getByLabelText("Recipient type"), {
      target: { value: "EXTERNAL_ORGANIZATION" },
    });
    expect(getByLabelText("Recipient name(s)")).toBeInTheDocument();
  });
});

describe("form errors", () => {
  /* TODO: find a way to test Material UI DateTimePicker error  when
  setting incorrect value */
});

describe("Errors from the backend", () => {
  it(`displays an error message when the backend replies with an error
  during creation`, async () => {
    mockedAxios.post.mockRejectedValue({ data: "backend error" });
    const { getByText } = await renderTraceReports();
    await click(getByText("Add a trace report"));
    await click(getByText("Add the report"));
    await waitFor(() =>
      expect(
        getByText(/The report creation was not successful/)
      ).toBeInTheDocument()
    );
  });

  it(`displays an error message when the backend replies with an error
  during deletion`, async () => {
    mockedAxios.delete.mockRejectedValue({ data: "backend error" });
    const { getByText, getAllByText } = await renderTraceReports();
    await click(getAllByText("Remove")[0]);
    await click(getByText("Yes"));
    await waitFor(() =>
      expect(
        getByText(/The report deletion was not successful/)
      ).toBeInTheDocument()
    );
  });

  it(`displays an error message when the backend replies with an error
  during update`, async () => {
    mockedAxios.patch.mockRejectedValue({ data: "backend error" });
    const { getByText, getAllByText } = await renderTraceReports();
    await click(getAllByText("Edit")[0]);
    await click(getByText("Edit the report"));
    await waitFor(() =>
      expect(
        getByText(/The report update was not successful/)
      ).toBeInTheDocument()
    );
  });
});

describe("accessibility", () => {
  it(`moves focus to the first focusable element when opening the
  modal`, async () => {
    const { getByText, getByLabelText } = await renderTraceReports();
    await click(getByText("Add a trace report"));
    const dateField = getByLabelText("Contact date");
    await waitFor(() => expect(dateField).toHaveFocus());
  });
});

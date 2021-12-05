import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import type { Paths } from "../constants/paths";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  configData,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import Main from "./Main";

initLanguagesForTesting();
jest.mock("axios");

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

async function renderMain(
  initialPath: string,
  history: MemoryHistory,
  generatedPaths: Paths,
  paths: Paths
): Promise<RenderResult> {
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
  if (initialPath) history.push(initialPath);
  let main: RenderResult;
  function renderMainComponent() {
    return render(
      <ConfigDataContext.Provider value={configData}>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <I18nProvider i18n={i18n}>
            <Router history={history}>
              <Route path={paths.ROOT}>
                <Main token="oizjofjzoijf" paths={paths} />
              </Route>
            </Router>
          </I18nProvider>
        </SWRConfig>
      </ConfigDataContext.Provider>
    );
  }
  await waitFor(() => {
    main = renderMainComponent();
  });
  return main;
}

describe("Routing tests", () => {
  it("displays correct item when visiting route /admin", async () => {
    await checkOnlyNeededComponentIsRendered("ADMIN");
  });
  it("displays correct item when visiting route /all-requests", async () => {
    await checkOnlyNeededComponentIsRendered("ADMIN_ALL_REQUESTS");
  });
  it("displays correct item when visiting route /all-requests/:requestId/trace-reports", async () => {
    await checkOnlyNeededComponentIsRendered("ADMIN_TRACE_REPORTS");
  });
});

async function checkOnlyNeededComponentIsRendered(routeName: keyof Paths) {
  await runWithAndWithoutOrganizationPrefix(
    async (generatedPaths: Paths, paths: Paths) => {
      const app = await renderMain(
        generatedPaths[routeName],
        null,
        generatedPaths,
        paths
      );
      checkExistsOnRouteEndNowhereElse("ADMIN", "Admin content", app);
      checkExistsOnRouteEndNowhereElse(
        "ADMIN_ALL_REQUESTS",
        "All requests",
        app
      );
      checkExistsOnRouteEndNowhereElse(
        "ADMIN_TRACE_REPORTS",
        /Trace reports/,
        app
      );
    }
  );

  function checkExistsOnRouteEndNowhereElse(
    route: keyof Paths,
    text: string | RegExp,
    app: RenderResult
  ) {
    if (routeName === route) {
      const pageContent = app.getByRole("heading", { name: text });
      expect(pageContent).toBeInTheDocument();
    } else {
      const pageContent = app.queryByRole("heading", { name: text });
      expect(pageContent).not.toBeInTheDocument();
    }
  }
}

describe("renders correctly document title", () => {
  it(`renders correct title when visiting route /admin`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ADMIN,
          "Connect Access - Quick access",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /all-requests`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ADMIN_ALL_REQUESTS,
          "Connect Access - All mediation requests",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /all-requests/:requestId`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ADMIN_REQUEST_DETAIL,
          "Connect Access - Detail of the mediation request",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /all-requests/:requestId/trace-reports`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ADMIN_TRACE_REPORTS,
          "Connect Access - Trace reports of the mediation request",
          paths
        );
      }
    );
  });

  async function checkRendersCorrectTitle(
    route: string,
    expectedTitle: string,
    paths: Paths
  ) {
    await renderMain(route, null, null, paths);
    await waitFor(() => expect(document.title).toEqual(expectedTitle));
  }
});

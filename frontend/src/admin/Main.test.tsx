import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { act, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
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

async function renderMain(initialPath, history, generatedPaths, paths) {
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
  let main;
  function renderMainComponent() {
    return render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <Route path={paths.ROOT}>
              <Main token="oizjofjzoijf" paths={paths} />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  await act(async () => {
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

async function checkOnlyNeededComponentIsRendered(routeName) {
  await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
    const app = await renderMain(
      generatedPaths[routeName],
      null,
      generatedPaths,
      paths
    );
    checkExistsOnRouteEndNowhereElse("ADMIN", "Admin content", app);
    checkExistsOnRouteEndNowhereElse("ADMIN_ALL_REQUESTS", "All requests", app);
    checkExistsOnRouteEndNowhereElse(
      "ADMIN_TRACE_REPORTS",
      /Trace reports/,
      app
    );
  });

  function checkExistsOnRouteEndNowhereElse(route, text, app) {
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
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.ADMIN,
        "Koena Connect - Quick access",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /all-requests`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.ADMIN_ALL_REQUESTS,
        "Koena Connect - All mediation requests",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /all-requests/:requestId`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.ADMIN_REQUEST_DETAIL,
        "Koena Connect - Detail of the mediation request",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /all-requests/:requestId/trace-reports`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.ADMIN_TRACE_REPORTS,
        "Koena Connect - Trace reports of the mediation request",
        paths
      );
    });
  });

  async function checkRendersCorrectTitle(route, expectedTitle, paths) {
    await renderMain(route, null, null, paths);
    await waitFor(() => expect(document.title).toEqual(expectedTitle));
  }
});

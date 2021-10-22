import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router } from "react-router-dom";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import AdminLayout from "./AdminLayout";

initLanguagesForTesting();

function renderAdminLayout(history?: any, generatedPaths?: any, paths?: any) {
  if (!paths) {
    paths = PATHS_WITHOUT_PREFIX;
  }
  if (!history) {
    if (generatedPaths) {
      history = createMemoryHistory({
        initialEntries: [generatedPaths.ADMIN],
      });
    } else {
      history = createMemoryHistory({
        initialEntries: [paths.ADMIN],
      });
    }
  }
  return render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <AdminLayout
            token="oizjofjzoijf"
            siteLanguage="en"
            toggleSiteLanguage={() => null}
            paths={paths}
          />
        </Route>
      </Router>
    </I18nProvider>
  );
}

it(`displays the admin menu and the main block if the user is logged as staff`, async () => {
  const { getByRole } = renderAdminLayout();
  expect(getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
  expect(getByRole("heading", { name: "Admin content" })).toBeInTheDocument();
});

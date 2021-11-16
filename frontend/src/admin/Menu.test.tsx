import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { configData } from "../testUtils";
import Menu from "./Menu";

initLanguagesForTesting();

function renderMenu(history?: any, generatedPaths?: any, paths?: any) {
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
  return render(
    <ConfigDataContext.Provider value={configData}>
      <I18nProvider i18n={i18n}>
        <Router history={history}>
          <Route path={paths.ROOT}>
            <Menu />
          </Route>
        </Router>
      </I18nProvider>
    </ConfigDataContext.Provider>
  );
}

it(`displays the admin menu items`, () => {
  const { getByText } = renderMenu();
  expect(getByText("Dashboard")).toBeInTheDocument();
});

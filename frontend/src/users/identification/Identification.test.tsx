import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import ConfigDataContext from "../../contexts/configData";
import { initLanguagesForTesting } from "../../i18nTestHelper";
import {
  click,
  configData,
  runWithAndWithoutOrganizationPrefix,
} from "../../testUtils";
import Identification from "./Identification";

initLanguagesForTesting();

describe("Click on tabs to chose login or signup", () => {
  it("displays only signup form when on /login path and clicking on signup tab", async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory();
      history.push({
        pathname: generatedPaths.LOGIN,
        state: {
          from: generatedPaths.ROOT,
        },
      });
      const { getByText, queryByTestId } = renderIdentification(
        history,
        generatedPaths,
        paths
      );
      const signupTab = getByText("Signup");
      await click(signupTab);
      const signupButton = getByText("Sign up");
      expect(signupButton).toBeInTheDocument();
      const loginButton = queryByTestId("loginSubmit");
      expect(loginButton).not.toBeInTheDocument();
    });
  });

  it("displays only login form when on /register path and clicking on login tab", async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory();
      history.push({
        pathname: generatedPaths.REGISTER,
        state: {
          from: generatedPaths.ROOT,
        },
      });
      const { getByText, getByTestId, queryByText } = renderIdentification(
        history,
        generatedPaths,
        paths
      );
      const loginTab = getByText("Log in");
      await click(loginTab);
      const signupButton = queryByText("Sign up");
      expect(signupButton).not.toBeInTheDocument();
      const loginButton = getByTestId("loginSubmit");
      expect(loginButton).toBeInTheDocument();
    });
  });

  it("changes the URL when on /login path and clicking on signup tab", async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory();
      history.push({
        pathname: generatedPaths.LOGIN,
        state: {
          from: generatedPaths.ROOT,
        },
      });
      const { getByText } = renderIdentification(
        history,
        generatedPaths,
        paths
      );
      const signupTab = getByText("Signup");
      await click(signupTab);
      expect(history.location.pathname).toEqual(generatedPaths.REGISTER);
    });
  });

  it("changes the URL when on /register path and clicking on login tab", async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory();
      history.push({
        pathname: generatedPaths.REGISTER,
        state: {
          from: generatedPaths.ROOT,
        },
      });
      const { getByText } = renderIdentification(
        history,
        generatedPaths,
        paths
      );
      const signupTab = getByText("Log in");
      await click(signupTab);
      expect(history.location.pathname).toEqual(generatedPaths.LOGIN);
    });
  });
});

function renderIdentification(history, generatedPaths, paths) {
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
            <Identification setToken={() => null} onClose={() => null} />
          </Route>
        </Router>
      </I18nProvider>
    </ConfigDataContext.Provider>
  );
}

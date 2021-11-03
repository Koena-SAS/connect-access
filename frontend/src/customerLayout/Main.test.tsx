import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  mediationRequestsResponse,
  mockedAxios,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import { fillResetPasswordConfirmFields } from "../users/password/testUtils";
import Main from "./Main";

initLanguagesForTesting();
jest.mock("axios");

let userMediationsResponse;

beforeEach(async () => {
  userMediationsResponse = mediationRequestsResponse.slice();
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
});

async function renderMain(
  initialPath = null,
  islogged = false,
  history = null,
  generatedPaths = null,
  paths = null,
  doAct = true
) {
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
              <Main
                setToken={() => null}
                token={islogged ? "e64e84sz" : undefined}
                isLogged={islogged}
                activeMediationFormStep={0}
                setActiveMediationFormStep={() => null}
                paths={paths}
              />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  }
  if (doAct) {
    await act(async () => {
      main = renderMainComponent();
    });
  } else {
    main = renderMainComponent();
  }
  return main;
}

const logged = Object.freeze({
  YES: "YES",
  NO: "NO",
});

describe("Routing tests when not logged in", () => {
  it("displays correct item when visiting route / and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("ROOT", logged.NO);
  });
  it("displays correct item when visiting route /login and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("LOGIN", logged.NO);
  });
  it("displays correct item when visiting route /register and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("REGISTER", logged.NO);
  });
  it("displays correct item when visiting route /reset-password and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("RESET_PASSWORD", logged.NO);
  });
  it(`displays correct item when visiting route /reset-password/confirm/:uid/:token and
  not logged`, async () => {
    await checkOnlyNeededComponentIsRendered(
      "RESET_PASSWORD_CONFIRM",
      logged.NO
    );
  });
  it("displays correct item when visiting route /user-requests and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("USER_REQUESTS", logged.NO);
  });
  it("displays correct item when visiting route /user-requests/:id and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("USER_REQUEST", logged.NO);
  });
});

describe("Routing tests when logged in", () => {
  it("displays correct item when visiting route / and logged", async () => {
    await checkOnlyNeededComponentIsRendered("ROOT", logged.YES);
  });
  it("displays correct item when visiting route /login and logged", async () => {
    await checkOnlyNeededComponentIsRendered("LOGIN", logged.YES);
  });
  it("displays correct item when visiting route /register and logged", async () => {
    await checkOnlyNeededComponentIsRendered("REGISTER", logged.YES);
  });
  it("displays correct item when visiting route /reset-password and logged", async () => {
    await checkOnlyNeededComponentIsRendered("RESET_PASSWORD", logged.YES);
  });
  it(`displays correct item when visiting route /reset-password/confirm/:uid/:token and
  logged`, async () => {
    await checkOnlyNeededComponentIsRendered(
      "RESET_PASSWORD_CONFIRM",
      logged.YES
    );
  });
  it("displays correct item when visiting route /user-requests and logged", async () => {
    await checkOnlyNeededComponentIsRendered("USER_REQUESTS", logged.YES);
  });
  it("displays correct item when visiting route /user-requests/:id and logged", async () => {
    await checkOnlyNeededComponentIsRendered("USER_REQUEST", logged.YES);
  });
});

async function checkOnlyNeededComponentIsRendered(routeName, loggingState) {
  await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
    const isLogged = loggingState === logged.YES;
    const app = await renderMain(
      generatedPaths[routeName],
      isLogged,
      null,
      generatedPaths,
      paths
    );
    const { queryByTestId, queryByText, getByText, getByTestId } = app;
    if (routeName === "LOGIN" && !isLogged) {
      const loginModal = getByTestId("loginSubmit");
      expect(loginModal).toBeInTheDocument();
    } else {
      const loginModal = queryByTestId("loginSubmit");
      expect(loginModal).not.toBeInTheDocument();
    }
    if (routeName === "REGISTER" && !isLogged) {
      const registerModal = getByText("Sign up");
      expect(registerModal).toBeInTheDocument();
    } else {
      const registerModal = queryByText("Sign up");
      expect(registerModal).not.toBeInTheDocument();
    }
    if (routeName === "RESET_PASSWORD" && !isLogged) {
      const resetButton = getByText("Reset password");
      expect(resetButton).toBeInTheDocument();
    } else {
      const resetButton = queryByText("Reset password");
      expect(resetButton).not.toBeInTheDocument();
    }
    if (routeName === "RESET_PASSWORD_CONFIRM" && !isLogged) {
      const submitButton = getByText("Change your password");
      expect(submitButton).toBeInTheDocument();
    } else {
      const submitButton = queryByText("Change your password");
      expect(submitButton).not.toBeInTheDocument();
    }
    if (routeName === "USER_REQUESTS" && isLogged) {
      const userMediations = getByText("All requests");
      expect(userMediations).toBeInTheDocument();
    } else {
      const userMediations = queryByText("All requests");
      expect(userMediations).not.toBeInTheDocument();
    }
    if (routeName === "USER_REQUEST" && isLogged) {
      const userMediation = getByText(/Mediation request details/);
      expect(userMediation).toBeInTheDocument();
    } else {
      const userMediation = queryByText(/Mediation request details/);
      expect(userMediation).not.toBeInTheDocument();
    }
  });
}

describe("Password reset routing", () => {
  it(`redirects to /login after successful password change`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      resetAxiosMocks();
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderMain(
        generatedPaths.RESET_PASSWORD_CONFIRM,
        false,
        history,
        generatedPaths,
        paths
      );
      await fillResetPasswordConfirmFields(app);
      await waitFor(() =>
        expect(history.location.pathname).toEqual(generatedPaths.LOGIN)
      );
    });
  });
});

describe("User mediations", () => {
  it(`displays mediation request item details when clicking on a specific
  mediation request`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
      const { getByText } = await renderMain(
        generatedPaths.USER_REQUESTS,
        true,
        null,
        generatedPaths,
        paths
      );
      const id = await waitFor(() => getByText(/f8842f63/));
      const detailsButton = within(id.closest("tr")).getByText("Details");
      fireEvent.click(detailsButton);
      expect(getByText(/Mediation request details/)).toBeInTheDocument();
    });
  });
});

describe("renders correctly document title", () => {
  // route / is already tested in FormContainer tests

  it(`renders correct title when visiting route /login`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.LOGIN,
        "Connect Access - Login",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /register`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.REGISTER,
        "Connect Access - Signup",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /reset-password`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.RESET_PASSWORD,
        "Connect Access - Reset your password",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /reset-password/confirm/:uid/:token`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.RESET_PASSWORD_CONFIRM,
        "Connect Access - Confirm password reset",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /user-requests`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      await checkRendersCorrectTitle(
        generatedPaths.USER_REQUESTS,
        "Connect Access - My mediation requests",
        paths
      );
    });
  });
  it(`renders correct title when visiting route /user-requests/:id`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
      await checkRendersCorrectTitle(
        generatedPaths.USER_REQUEST,
        "Connect Access - My mediation request detail",
        paths
      );
    });
  });

  async function checkRendersCorrectTitle(route, expectedTitle, paths) {
    renderMain(route, false, null, null, paths, false);
    await waitFor(() => expect(document.title).toEqual(expectedTitle));
  }
});

describe("Notification messages", () => {
  it(`displays a success message when the backend replies with success`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      resetAxiosMocks();
      const app = await renderMain(
        generatedPaths.RESET_PASSWORD_CONFIRM,
        false,
        null,
        generatedPaths,
        paths
      );
      await fillResetPasswordConfirmFields(app);
      const successMessage = await waitFor(() =>
        app.getByText(/Your password has been successfully changed./)
      );
      expect(successMessage).toBeInTheDocument();
    });
  });

  it(`displays an error message when the backend replies with a non field
  error`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      resetAxiosMocks();
      const app = await renderMain(
        generatedPaths.RESET_PASSWORD_CONFIRM,
        false,
        null,
        generatedPaths,
        paths
      );
      mockedAxios.post.mockRejectedValue({ data: "backend error" });
      await fillResetPasswordConfirmFields(app);
      const error = app.getByText(
        /We were unable to change your password, please try again later./
      );
      expect(error).toBeInTheDocument();
    });
  });
});

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import type { Paths } from "../constants/paths";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { configData, runWithAndWithoutOrganizationPrefix } from "../testUtils";
import type { MediationRequestRecieved } from "../types/mediationRequest";
import { fillResetPasswordConfirmFields } from "../users/password/testUtils";
import {
  mediationRequestsResponse,
  mockedAxios,
  resetAxiosMocks,
} from "../__mocks__/axiosMock";
import "../__mocks__/reactMarkdownMock";
import Main from "./Main";

let userMediationsResponse: MediationRequestRecieved[];

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
  initialPath: string | null = null,
  islogged: boolean = false,
  history: History | null = null,
  generatedPaths: Paths | null = null,
  paths: Paths | null = null
): Promise<RenderResult> {
  const finalPaths = paths ? paths : PATHS_WITHOUT_PREFIX;
  const finalHistory = history ? history : generateHistory();
  function generateHistory() {
    if (generatedPaths) {
      return createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
    } else {
      return createMemoryHistory();
    }
  }
  if (initialPath) finalHistory.push(initialPath);
  function renderMainComponent() {
    return render(
      <ConfigDataContext.Provider value={configData}>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <I18nProvider i18n={i18n}>
            <Router history={finalHistory}>
              <Route path={finalPaths.ROOT}>
                <Main
                  setToken={() => null}
                  token={islogged ? "e64e84sz" : undefined}
                  activeMediationFormStep={0}
                  setActiveMediationFormStep={() => null}
                  paths={finalPaths}
                />
              </Route>
            </Router>
          </I18nProvider>
        </SWRConfig>
      </ConfigDataContext.Provider>
    );
  }
  return await waitFor(() => renderMainComponent());
}

const logged = {
  YES: "YES",
  NO: "NO",
} as const;

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
  it("displays correct item when visiting route /terms-of-service and not logged", async () => {
    await checkOnlyNeededComponentIsRendered("TERMS_OF_SERVICE", logged.NO);
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
  it("displays correct item when visiting route /terms-of-service and logged", async () => {
    await checkOnlyNeededComponentIsRendered("TERMS_OF_SERVICE", logged.YES);
  });
});

async function checkOnlyNeededComponentIsRendered(
  routeName: keyof Paths,
  loggingState: "YES" | "NO"
) {
  await runWithAndWithoutOrganizationPrefix(
    async (generatedPaths: Paths, paths: Paths) => {
      const isLogged = loggingState === logged.YES;
      const app = await renderMain(
        generatedPaths[routeName],
        isLogged,
        null,
        generatedPaths,
        paths
      );
      const { queryByTestId, queryByText, getByText, getByTestId, getByRole } =
        app;
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
      if (routeName === "TERMS_OF_SERVICE") {
        const termsOfService = getByRole("heading", {
          name: /Terms of service/,
        });
        expect(termsOfService).toBeInTheDocument();
      } else {
        const termsOfService = queryByText(/Terms of service/);
        expect(termsOfService).not.toBeInTheDocument();
      }
    }
  );
}

describe("Password reset routing", () => {
  it(`redirects to /login after successful password change`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
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
      }
    );
  });
});

describe("User mediations", () => {
  it(`displays mediation request item details when clicking on a specific
  mediation request`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
        const { getByText } = await renderMain(
          generatedPaths.USER_REQUESTS,
          true,
          null,
          generatedPaths,
          paths
        );
        const id = await waitFor(() => getByText("f8842f63"));
        const detailsButton = within(id.closest("tr") as HTMLElement).getByText(
          "Details"
        );
        fireEvent.click(detailsButton);
        expect(getByText(/Mediation request details/)).toBeInTheDocument();
      }
    );
  });
});

describe("renders correctly document title", () => {
  // route / is already tested in FormContainer tests

  it(`renders correct title when visiting route /login`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.LOGIN,
          "Connect Access - Login",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /register`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.REGISTER,
          "Connect Access - Signup",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /reset-password`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.RESET_PASSWORD,
          "Connect Access - Reset your password",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /reset-password/confirm/:uid/:token`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.RESET_PASSWORD_CONFIRM,
          "Connect Access - Confirm password reset",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /user-requests`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.USER_REQUESTS,
          "Connect Access - My mediation requests",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /user-requests/:id`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        mockedAxios.get.mockResolvedValue({ data: userMediationsResponse });
        await checkRendersCorrectTitle(
          generatedPaths.USER_REQUEST,
          "Connect Access - My mediation request detail",
          paths
        );
      }
    );
  });
  it(`renders correct title when visiting route /terms-of-service`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.TERMS_OF_SERVICE,
          "Connect Access - Terms of service",
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
    await renderMain(route, false, null, null, paths);
    await waitFor(() => expect(document.title).toEqual(expectedTitle));
  }
});

describe("Notification messages", () => {
  it(`displays a success message when the backend replies with success`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
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
      }
    );
  });

  it(`displays an error message when the backend replies with a non field
  error`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
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
      }
    );
  });
});

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { StateMachineProvider } from "little-state-machine";
import { useState } from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import App from "./App";
import { PATHS, PATHS_WITHOUT_PREFIX } from "./constants/paths";
import { initLanguagesForTesting } from "./i18nTestHelper";
import { ResetLittleStateMachine, unlockStep } from "./mediationForm/testUtils";
import {
  axiosGetResponseMe,
  click,
  mockedAxios,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "./testUtils";

initLanguagesForTesting();
jest.mock("axios");

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
  // this is needed to clean the store in jsdom sessionStorage
  render(
    <StateMachineProvider>
      <ResetLittleStateMachine />
    </StateMachineProvider>
  );
});

/**
 * Render the App component.
 * If the paths parameter has the organization prefix, the organization
 * app prop will be included, otherwise it will be null.
 */
async function renderApp(history?: any, generatedPaths?: any, paths?: any) {
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
  let main;
  await act(async () => {
    main = render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <Route path={paths.ROOT}>
              <ComponentWrapper paths={paths} />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    );
  });
  await waitFor(() => {
    expect(main.getByText(/Français/)).toBeInTheDocument();
  });
  return main;
}

function ComponentWrapper({ paths }) {
  const [activeStep, setActiveStep] = useState(0);
  const [siteLanguage, setSiteLanguage] = useState("en");
  const toggleSiteLanguage = () => {
    if (siteLanguage === "fr") {
      setSiteLanguage("en");
    } else {
      setSiteLanguage("fr");
    }
  };
  const hasOrganizationPrefix = paths === PATHS;
  const initialOrganizationApp = hasOrganizationPrefix
    ? {
        id: 1,
        name: { en: "Koena Connect", fr: "Koena Connect" },
        slug: "koena-connect",
        logo: "/media/app_logo/koena/koena-connect/koena_square.png",
        logo_alternative: {
          en: "Koena Connect Logo",
          fr: "Logo de Koena Connect",
        },
        description: {
          en: `<h1>Koena Connect</h1>
      <p>Koena Connect is a mediation platform</p>`,
          fr: `<h1>Koena Connect</h1>
      <p>Koena Connect est une plateforme de médiation</p>`,
        },
        text_color: "#DDFF3F",
        button_background_color: "#98FFF4",
        border_color: "#FF2CFD",
        button_hover_color: "#90C9FF",
        step_color: "#3F4BFF",
        footer_color: "#000000",
      }
    : null;
  return (
    <App
      siteLanguage={siteLanguage}
      toggleSiteLanguage={toggleSiteLanguage}
      activeMediationFormStep={activeStep}
      setActiveMediationFormStep={setActiveStep}
      paths={paths}
      initialOrganizationApp={initialOrganizationApp}
    />
  );
}

describe("Admin panel", () => {
  it(`displays admin layout when connected as admin and on admin
  page`, async () => {
    axiosGetResponseMe.data.isStaff = true;
    let loginDone = false;
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderApp(history, generatedPaths, paths);
      if (!loginDone) {
        await loginUser(app);
        loginDone = true;
      }
      act(() => {
        history.push(generatedPaths.ADMIN);
      });
      expect(
        app.getByRole("button", { name: "Dashboard" })
      ).toBeInTheDocument();
      history.push(generatedPaths.ROOT);
      expect(
        app.queryByRole("button", { name: "Dashboard" })
      ).not.toBeInTheDocument();
    });
  });

  it(`does not display admin layout when connected as non admin and on admin
  page`, async () => {
    let loginDone = false;
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderApp(history, generatedPaths, paths);
      if (!loginDone) {
        await loginUser(app);
        loginDone = true;
      }
      act(() => {
        history.push(generatedPaths.ADMIN);
      });
      expect(app.queryByText("Dashboard")).not.toBeInTheDocument();
    });
  });
});

describe("Navbar clicking & display", () => {
  it("displays correct elements when not logged in", async () => {
    const { getByText, queryByText } = await renderApp();
    const login = getByText(/Login/);
    const logout = queryByText(/Logout/);
    expect(login).toBeInTheDocument();
    expect(logout).not.toBeInTheDocument();
  });

  it("displays correct elements when click on login", async () => {
    const { getByText, getByLabelText, queryByText } = await renderApp();
    fireEvent.click(getByText(/Login/));
    const loginForm = getByLabelText(/Password/);
    const myAccount = queryByText(/My account/);
    expect(loginForm).toBeInTheDocument();
    expect(myAccount).not.toBeInTheDocument();
  });

  it(`displays login form when:
    (1) click on login button
    (2) click on register tab
    (3) click on cancel
    (4) click again on login button`, async () => {
    const { getByText, getByTestId } = await renderApp();
    fireEvent.click(getByText(/Login/));
    fireEvent.click(getByText(/Signup/));
    fireEvent.click(getByText(/Cancel/));
    fireEvent.click(getByText(/Login/));
    const loginSubmit = getByTestId("loginSubmit");
    expect(loginSubmit).toBeInTheDocument();
  });

  it(`displays main elements when providing an organization slug and
  an application slug, and an initial organization app prop`, async () => {
    const { getByText } = await renderApp(
      null,
      { ROOT: "/koena/koena-connect" },
      PATHS
    );
    const login = getByText(/Login/);
    expect(login).toBeInTheDocument();
    const main = getByText(/Submit a mediation/);
    expect(main).toBeInTheDocument();
  });

  it(`does not display main elements when providing an organization slug but
  no application slug`, async () => {
    const { getByText, queryByText } = await renderApp(
      null,
      { ROOT: "/koena" },
      PATHS
    );
    const login = getByText(/Login/);
    expect(login).toBeInTheDocument();
    const main = queryByText(/Submit a mediation/);
    expect(main).not.toBeInTheDocument();
  });

  it(`does not display main elements when providing an organization slug but
  no initial organization app prop`, async () => {
    const { getByText, queryByText } = await renderApp(
      null,
      { ROOT: "/koena/koena-connect" },
      PATHS_WITHOUT_PREFIX
    );
    const login = getByText(/Login/);
    expect(login).toBeInTheDocument();
    const main = queryByText(/Submit a mediation/);
    expect(main).not.toBeInTheDocument();
  });
});

describe("Login / logout", () => {
  describe("Login", () => {
    it("displays unlog button instead of login one after login", async () => {
      const app = await renderApp();
      await loginUser(app);
      expect(app.queryByText(/Login/)).not.toBeInTheDocument();
      expect(app.getByText(/Logout/)).toBeInTheDocument();
    });

    it("displays user detail after login when click on my account", async () => {
      const app = await renderApp();
      await loginUser(app);
      const accountButton = app.getByRole("link", { name: /My account/ });
      fireEvent.click(accountButton);
      const phoneNumber = app.getByDisplayValue(/2463259871/);
      expect(phoneNumber).toBeInTheDocument();
    });

    it("logs in after wrong credentials given followed by correct ones", async () => {
      const app = await renderApp();
      mockedAxios.post.mockRejectedValue({ data: "" });
      await loginUser(app, false);
      resetAxiosMocks();
      await loginUser(app, true);
      expect(app.queryByText(/Login/)).not.toBeInTheDocument();
      expect(app.getByText(/Logout/)).toBeInTheDocument();
    });
  });

  describe("Logout", () => {
    it(`displays login button and no more user details after logout,
    and redirects to homepage`, async () => {
      await runWithAndWithoutOrganizationPrefix(
        async (generatedPaths, paths) => {
          const userPhoneNumber = /2463259871/;
          const [app, history] = await checkInfoAndPathsOnLogin(
            userPhoneNumber,
            generatedPaths.USER_DETAILS,
            [/My account/],
            generatedPaths,
            paths
          );
          await checkInfoAndPathsOnLogout(
            app,
            history,
            userPhoneNumber,
            generatedPaths.ROOT
          );
        }
      );
    });

    it(`displays login button and no more user's mediation requests after logout,
    and redirects to homepage`, async () => {
      await runWithAndWithoutOrganizationPrefix(
        async (generatedPaths, paths) => {
          const mediationRequestId = /f8842f63/;
          const [app, history] = await checkInfoAndPathsOnLogin(
            mediationRequestId,
            generatedPaths.USER_REQUESTS,
            [/My requests/],
            generatedPaths,
            paths
          );
          await checkInfoAndPathsOnLogout(
            app,
            history,
            mediationRequestId,
            generatedPaths.ROOT
          );
        }
      );
    });

    it(`displays login button and no more user's mediation request detail after logout,
    and redirects to homepage`, async () => {
      await runWithAndWithoutOrganizationPrefix(
        async (generatedPaths, paths) => {
          const history = createMemoryHistory({
            initialEntries: [generatedPaths.ROOT],
          });
          const app = await renderApp(history, generatedPaths, paths);
          await loginUser(app);
          fireEvent.click(app.getByText(/My requests/));
          const id = app.getByText(/f8842f63/);
          const detailsButton = within(id.closest("tr")).getByText("Details");
          await click(detailsButton);
          await waitFor(() =>
            expect(history.location.pathname).toEqual(
              generatedPaths.USER_REQUEST
            )
          );
          const infoNode = app.getByText(/3\.5\.2/);
          expect(infoNode).toBeInTheDocument();
          await checkInfoAndPathsOnLogout(
            app,
            history,
            /3\.5\.2/,
            generatedPaths.ROOT
          );
        }
      );
    });

    async function checkInfoAndPathsOnLogin(
      info,
      path,
      elementsToClickOn,
      generatedPaths,
      paths
    ) {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderApp(history, generatedPaths, paths);
      await loginUser(app);
      fireEvent.click(app.getByText(/My requests/));
      elementsToClickOn.forEach((element) => {
        fireEvent.click(app.getByText(element));
      });
      await waitFor(() => expect(history.location.pathname).toEqual(path));
      const infoNode = app.queryByText(info) || app.queryByDisplayValue(info);
      expect(infoNode).toBeInTheDocument();
      return [app, history];
    }

    async function checkInfoAndPathsOnLogout(app, history, info, path) {
      fireEvent.click(app.getByText(/Logout/));
      await waitFor(() => expect(app.getByText(/Login/)).toBeInTheDocument());
      expect(app.queryByText(/Logout/)).not.toBeInTheDocument();
      const infoNode = app.queryByText(info) || app.queryByDisplayValue(info);
      expect(infoNode).not.toBeInTheDocument();
      expect(history.location.pathname).toEqual(path);
    }

    it(`logs out user immediately even if the backend replies with an
    error`, async () => {
      const app = await renderApp();
      await loginUser(app);
      mockedAxios.post.mockRejectedValue({ data: "" });
      fireEvent.click(app.getByText(/Logout/));
      expect(app.getByText(/Login/)).toBeInTheDocument();
    });
  });

  describe("Correct behavior after page reload", () => {
    it(`displays unlog button instead of login one after page reload while
    already logged`, async () => {
      const firstRender = await renderApp();
      await loginUser(firstRender);
      cleanup();
      const secondRender = await renderApp();
      expect(secondRender.queryByText(/Login/)).not.toBeInTheDocument();
      expect(secondRender.getByText(/Logout/)).toBeInTheDocument();
    });

    it(`displays user detail after page reload while already
    logged in`, async () => {
      const firstRender = await renderApp();
      await loginUser(firstRender);
      cleanup();
      const secondRender = await renderApp();
      const accountButton = secondRender.getByRole("link", {
        name: /My account/,
      });
      fireEvent.click(accountButton);
      const phoneNumber = secondRender.getByDisplayValue(/2463259871/);
      expect(phoneNumber).toBeInTheDocument();
    });

    it(`displays login button and no more user details after page reload
    while already logged out`, async () => {
      const firstRender = await renderApp();
      await loginUser(firstRender);
      fireEvent.click(firstRender.getByText(/Logout/));
      await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(2));
      cleanup();
      const secondRender = await renderApp();
      expect(secondRender.getByText(/Login/)).toBeInTheDocument();
      expect(secondRender.queryByText(/Logout/)).not.toBeInTheDocument();
      const phoneNumber = secondRender.queryByDisplayValue(/2463259871/);
      expect(phoneNumber).not.toBeInTheDocument();
    });

    it(`displays login button and no more logout after logout press with backend
    rejecting the post call, and page reload`, async () => {
      const firstRender = await renderApp();
      await loginUser(firstRender);
      mockedAxios.post.mockRejectedValue({ data: "" });
      fireEvent.click(firstRender.getByText(/Logout/));
      cleanup();
      const secondRender = await renderApp();
      expect(secondRender.getByText(/Login/)).toBeInTheDocument();
    });
  });
});

async function loginUser(app, getRequestDone = true) {
  fireEvent.click(app.getByText(/Login/));
  const idDialog = app.getByRole("dialog");
  fireEvent.change(within(idDialog).getByLabelText(/E-mail/), {
    target: { value: "john@doe.com" },
  });
  fireEvent.change(within(idDialog).getByLabelText(/Password/), {
    target: { value: "ozjeriovooijsm" },
  });
  fireEvent.click(within(idDialog).getByTestId("loginSubmit"));
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
  if (getRequestDone) {
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
  }
}

describe("Register", () => {
  it("logs in automatically after registration", async () => {
    const app = await renderApp();
    await registerUser(app);
    expect(app.queryByText(/Login/)).not.toBeInTheDocument();
    expect(app.getByText(/Logout/)).toBeInTheDocument();
  });

  it("displays user detail after registration", async () => {
    const app = await renderApp();
    await registerUser(app);
    const accountButton = app.getByRole("link", { name: /My account/ });
    fireEvent.click(accountButton);
    const phoneNumber = app.getByDisplayValue(/2463259871/);
    expect(phoneNumber).toBeInTheDocument();
  });

  it(`registers user and logs in after already existing email given at registration
  followed by a correct registration`, async () => {
    const app = await renderApp();
    mockedAxios.post.mockRejectedValue({ data: "" });
    await registerUser(app, 1);
    resetAxiosMocks();
    await registerUser(app, 3);
    expect(app.queryByText(/Login/)).not.toBeInTheDocument();
    expect(app.getByText(/Logout/)).toBeInTheDocument();
  });

  async function registerUser(app, postAxiosCalls = 2) {
    fireEvent.click(app.getByText(/Login/));
    fireEvent.click(app.getByText(/Signup/));
    const idDialog = app.getByRole("dialog");
    fireEvent.change(within(idDialog).getByLabelText(/Last name/), {
      target: { value: "KOENA" },
    });
    fireEvent.change(within(idDialog).getByLabelText(/First name/), {
      target: { value: "Koena" },
    });
    fireEvent.change(within(idDialog).getByLabelText(/E-mail/), {
      target: { value: "bla@bla.fr" },
    });
    fireEvent.change(within(idDialog).getByLabelText(/Password/), {
      target: { value: "pass" },
    });
    fireEvent.change(within(idDialog).getByLabelText(/Confirm password/), {
      target: { value: "pass" },
    });
    fireEvent.click(within(idDialog).getByText("Sign up"));
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledTimes(postAxiosCalls)
    );
  }
});

describe("Mediation form", () => {
  it(`reloads mediation requests after submitting a new mediation
  request`, async () => {
    const app = await renderApp();
    await loginUser(app);
    const homepage = app.getByAltText(/homepage/);
    await click(homepage);
    await unlockStep(app.getByLabelText, app.getByText, 3);
    const submitButton = app.getByText("Submit my mediation request");
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
          creationDate: "2021-02-03",
          status: "WAITING_MEDIATOR_VALIDATION",
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          stepDescription: "I try to load the page",
          issueDescription: "New mediation request",
          organizationName: "Koena",
        },
      ],
    });
    await click(submitButton);
    const myRequests = app.getByText("My requests");
    await click(myRequests);
    await waitFor(() =>
      expect(app.getByText(/New mediation request/)).toBeInTheDocument()
    );
  });
});

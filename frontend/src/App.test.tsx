import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { RenderResult } from "@testing-library/react";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { StateMachineProvider } from "little-state-machine";
import { useState } from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import App from "./App";
import type { Paths } from "./constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "./constants/paths";
import ConfigDataContext from "./contexts/configData";
import { initLanguagesForTesting } from "./i18nTestHelper";
import type { Step } from "./mediationForm/StepsInitializer";
import { ResetLittleStateMachine, unlockStep } from "./mediationForm/testUtils";
import {
  axiosGetResponseMe,
  click,
  configData,
  generatePathsWithoutPrefix,
  generatePathsWithPrefix,
  mockedAxios,
  resetAxiosMocks,
} from "./testUtils";
import type { MediationRequestRecieved } from "./types/mediationRequest";
import type { Langs } from "./types/types";

initLanguagesForTesting();
jest.mock("axios");

const resetStateMachine = () => {
  // this is needed to clean the store in jsdom sessionStorage
  render(
    <StateMachineProvider>
      <ResetLittleStateMachine />
    </StateMachineProvider>
  );
};

const generatedPathsWithPrefix = generatePathsWithPrefix();
const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

beforeEach(async () => {
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
  resetStateMachine();
});

/**
 * Render the App component.
 * If the paths parameter has the organization prefix, the organization
 * app prop will be included, otherwise it will be null.
 */
async function renderApp(
  history?: any,
  generatedPaths?: any,
  paths?: any
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
  let main = await waitFor(() =>
    render(
      <ConfigDataContext.Provider value={configData}>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <I18nProvider i18n={i18n}>
            <Router history={history}>
              <Route path={paths.ROOT}>
                <ComponentWrapper paths={paths} />
              </Route>
            </Router>
          </I18nProvider>
        </SWRConfig>
      </ConfigDataContext.Provider>
    )
  );
  await waitFor(() => {
    expect(main.getByText(/Français/)).toBeInTheDocument();
  });
  return main;
}

function ComponentWrapper({ paths }: { paths: Paths }) {
  const [activeStep, setActiveStep] = useState<Step>(0);
  const [siteLanguage, setSiteLanguage] = useState<Langs>("en");
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
        id: "1",
        name: { en: "Connect Access", fr: "Connect Access" },
        slug: "koena-connect",
        logo: "/media/app_logo/koena/koena-connect/koena_square.png",
        logo_alternative: {
          en: "Connect Access Logo",
          fr: "Logo de Connect Access",
        },
        description: {
          en: `<h1>Connect Access</h1>
      <p>Connect Access is a mediation platform</p>`,
          fr: `<h1>Connect Access</h1>
      <p>Connect Access est une plateforme de médiation</p>`,
        },
        text_color: "#DDFF3F",
        button_background_color: "#98FFF4",
        border_color: "#FF2CFD",
        button_hover_color: "#90C9FF",
        step_color: "#3F4BFF",
        footer_color: "#000000",
      }
    : undefined;
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
  describe(`displays admin layout when connected as admin and on admin
  page`, () => {
    async function test(
      generatedPaths: Record<string, string>,
      paths: Record<string, string>
    ): Promise<void> {
      axiosGetResponseMe.data.isStaff = true;

      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderApp(history, generatedPaths, paths);
      await loginUser(app);
      await waitFor(() => {
        history.push(generatedPaths.ADMIN);
      });
      expect(
        app.getByRole("button", { name: "Dashboard" })
      ).toBeInTheDocument();
      history.push(generatedPaths.ROOT);
      expect(
        app.queryByRole("button", { name: "Dashboard" })
      ).not.toBeInTheDocument();
    }

    it(`with organization prefix`, async () => {
      await test(generatedPathsWithPrefix, PATHS);
    });
    it(`without organization prefix`, async () => {
      await test(generatedPathsWithoutPrefix, PATHS_WITHOUT_PREFIX);
    });
  });

  describe(`does not display admin layout when connected as non admin and on admin
  page`, () => {
    async function test(
      generatedPaths: Record<string, string>,
      paths: Record<string, string>
    ): Promise<void> {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const app = await renderApp(history, generatedPaths, paths);
      await loginUser(app);
      await waitFor(() => {
        history.push(generatedPaths.ADMIN);
      });
      expect(app.queryByText("Dashboard")).not.toBeInTheDocument();
    }

    it(`with organization prefix`, async () => {
      await test(generatedPathsWithPrefix, PATHS);
    });
    it(`without organization prefix`, async () => {
      await test(generatedPathsWithoutPrefix, PATHS_WITHOUT_PREFIX);
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
    await click(getByLabelText(/with password/));
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
    it("displays unlog button instead of login one after login with password", async () => {
      const app = await renderApp();
      await loginUser(app);
      expect(app.queryByText(/Login/)).not.toBeInTheDocument();
      expect(app.getByText(/Logout/)).toBeInTheDocument();
    });

    it("displays unlog button instead of login one after login without password", async () => {
      const app = await renderApp();
      await loginUser(app, true, 2, false);
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
      await loginUser(app, true, 2);
      expect(app.queryByText(/Login/)).not.toBeInTheDocument();
      expect(app.getByText(/Logout/)).toBeInTheDocument();
    });
  });

  describe("Logout", () => {
    describe(`displays login button and no more user details after logout,
    and redirects to homepage`, () => {
      async function test(generatedPaths: Paths, paths: Paths): Promise<void> {
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

      it(`with organization prefix`, async () => {
        await test(generatedPathsWithPrefix, PATHS);
      });
      it(`without organization prefix`, async () => {
        await test(generatedPathsWithoutPrefix, PATHS_WITHOUT_PREFIX);
      });
    });

    describe(`displays login button and no more user's mediation requests after logout,
    and redirects to homepage`, () => {
      async function test(generatedPaths: Paths, paths: Paths): Promise<void> {
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

      it(`with organization prefix`, async () => {
        await test(generatedPathsWithPrefix, PATHS);
      });
      it(`without organization prefix`, async () => {
        await test(generatedPathsWithoutPrefix, PATHS_WITHOUT_PREFIX);
      });
    });

    describe(`displays login button and no more user's mediation request detail after logout,
    and redirects to homepage`, () => {
      async function test(generatedPaths: Paths, paths: Paths): Promise<void> {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const app = await renderApp(history, generatedPaths, paths);
        await loginUser(app);
        fireEvent.click(app.getByText(/My requests/));
        const id = app.getByText(/f8842f63/);
        const detailsButton = within(id.closest("tr") as HTMLElement).getByText(
          "Details"
        );
        await click(detailsButton);
        await waitFor(() =>
          expect(history.location.pathname).toEqual(generatedPaths.USER_REQUEST)
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

      it(`with organization prefix`, async () => {
        await test(generatedPathsWithPrefix, PATHS);
      });
      it(`without organization prefix`, async () => {
        await test(generatedPathsWithoutPrefix, PATHS_WITHOUT_PREFIX);
      });
    });

    async function checkInfoAndPathsOnLogin(
      info: string | RegExp,
      path: string,
      elementsToClickOn: (string | RegExp)[],
      generatedPaths: Paths,
      paths: Paths
    ): Promise<[RenderResult, MemoryHistory]> {
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

    async function checkInfoAndPathsOnLogout(
      app: RenderResult,
      history: MemoryHistory,
      info: string | RegExp,
      path: string
    ) {
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

async function loginUser(
  app: RenderResult,
  getRequestDone = true,
  numberOfPostCalls = 1,
  withPassword = true
) {
  fireEvent.click(app.getByText(/Login/));
  const idDialog = app.getByRole("dialog");
  fireEvent.change(within(idDialog).getByLabelText(/E-mail/), {
    target: { value: "john@doe.com" },
  });
  await clickOnWithPasswordCheckBox(app, withPassword);
  if (withPassword) {
    fireEvent.change(within(idDialog).getByLabelText(/Password/), {
      target: { value: "ozjeriovooijsm" },
    });
  } else {
    fireEvent.click(within(idDialog).getByTestId("loginSubmit"));
    const tokenField = await waitFor(() =>
      within(idDialog).getByLabelText(/Token/)
    );
    fireEvent.change(tokenField, {
      target: { value: "845134" },
    });
  }
  fireEvent.click(within(idDialog).getByTestId("loginSubmit"));
  await waitFor(() =>
    expect(mockedAxios.post).toHaveBeenCalledTimes(numberOfPostCalls)
  );
  if (getRequestDone) {
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
  }
}

async function clickOnWithPasswordCheckBox(
  app: RenderResult,
  withPassword: boolean
) {
  const withPasswordField = app.getByLabelText(
    /with password/
  ) as HTMLInputElement;
  const shouldClickOnCheckBox =
    Boolean(withPassword) !== Boolean(withPasswordField.checked);
  if (shouldClickOnCheckBox) {
    await click(app.getByLabelText(/with password/));
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

  async function registerUser(app: RenderResult, postAxiosCalls = 2) {
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
    await unlockStep(app, 3);
    const submitButton = app.getByText("Submit my mediation request");
    const userMediationRequestsData: MediationRequestRecieved[] = [
      {
        id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
        creation_date: "2021-02-03",
        request_date: "2021-02-03",
        status: "WAITING_MEDIATOR_VALIDATION",
        first_name: "John",
        last_name: "Doe",
        email: "john@doe.com",
        step_description: "I try to load the page",
        issue_description: "New mediation request",
        organization_name: "Koena",
      },
    ];
    mockedAxios.get.mockResolvedValue({
      data: userMediationRequestsData,
    });
    await click(submitButton);
    const myRequests = app.getByText("My requests");
    await click(myRequests);
    await waitFor(() =>
      expect(app.getByText(/New mediation request/)).toBeInTheDocument()
    );
  });
});

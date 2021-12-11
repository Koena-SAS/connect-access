import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { createStore, StateMachineProvider } from "little-state-machine";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  click,
  generatePathsWithoutPrefix,
  generatePathsWithPrefix,
  mockedAxios,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import Recap from "./Recap";
import type { GlobalState, ProblemDescription } from "./updateAction";

initLanguagesForTesting();
jest.mock("axios");

let storeContent: GlobalState;

const generatedPathsWithPrefix = generatePathsWithPrefix();
const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

beforeEach(() => {
  storeContent = {
    userInfo: {
      firstName: "Bill",
      lastName: "Blue",
      email: "bluebill@koena.net",
      phoneNumber: "5555555555",
      assistiveTechnologyUsed: ["KEYBOARD"],
      technologyName: "Fictive technology",
      technologyVersion: "3.5.2",
    },
    problemDescription: {
      urgency: "VERY_URGENT",
      stepDescription: "I try to load the page",
      issueDescription: "It fails to load",
      inaccessibilityLevel: "IMPOSSIBLE_ACCESS",
      browserUsed: "YES",
      url: "http://koena.net",
      browser: "FIREFOX",
      browserVersion: "58",
      mobileAppUsed: "YES",
      mobileAppPlatform: "IOS",
      mobileAppName: "Super app",
      otherUsedSoftware: "Connected object",
      didTellOrganization: "YES",
      didOrganizationReply: "YES",
      organizationReply: "No reply",
      furtherInfo: "Nothing to add",
      attachedFile: [
        new File(["(⌐□_□)"], "Failure.png", {
          type: "image/png",
        }),
        new File(["(⌐□_□)"], "Failure2.png", {
          type: "image/png",
        }),
      ],
    },
    organizationInfo: {
      name: "Koena",
      mailingAddress: "2, esplanade de la Gare à Sannois 95110",
      email: "aloha@koena.net",
      phoneNumber: "0972632128",
      contact: "Armony",
    },
  };
  createStore(storeContent);
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Display store content", () => {
  it(`displays user info content from the store`, async () => {
    const { getByText } = renderRecap();
    expect(getByText(/Bill/)).toBeInTheDocument();
    expect(getByText(/Blue/)).toBeInTheDocument();
    expect(getByText(/bluebill@koena.net/)).toBeInTheDocument();
    expect(getByText(/5555555555/)).toBeInTheDocument();
    expect(getByText(/Keyboard/)).toBeInTheDocument();
    expect(getByText(/Fictive technology/)).toBeInTheDocument();
    expect(getByText(/3.5.2/)).toBeInTheDocument();
  });

  it(`displays problem description non conditional content from the
  store`, () => {
    const { getByText } = renderRecap();
    expect(getByText(/Yes, very urgent/)).toBeInTheDocument();
    expect(getByText(/I try to load the page/)).toBeInTheDocument();
    expect(getByText(/It fails to load/)).toBeInTheDocument();
    expect(getByText(/Impossible access/)).toBeInTheDocument();
    const browserUsed = within(
      getByText(/Did the problem occur/).parentElement as HTMLElement
    ).getByText("Yes");
    expect(browserUsed).toBeInTheDocument();
    const didTellOrganization = within(
      getByText(/Did you already tell the organization/)
        .parentElement as HTMLElement
    ).getByText("Yes");
    expect(didTellOrganization).toBeInTheDocument();
    expect(getByText(/Nothing to add/)).toBeInTheDocument();
  });

  describe("Conditional on organizaton page or not", () => {
    it(`does not display organization related fieldset if organizationApp
    exists`, async () => {
      const { queryByRole } = renderRecap(
        null,
        generatedPathsWithPrefix,
        PATHS
      );
      const organizationRelatedFieldset = queryByRole("heading", {
        name: "The organization",
        level: 3,
      });
      await waitFor(() =>
        expect(organizationRelatedFieldset).not.toBeInTheDocument()
      );
    });

    it(`displays organization related fieldset if organizationApp does not
    exist`, () => {
      const { getByRole } = renderRecap();
      const organizationRelatedFieldset = getByRole("heading", {
        name: "The organization",
        level: 3,
      });
      expect(organizationRelatedFieldset).toBeInTheDocument();
    });
  });

  describe("Conditional on browser used or not", () => {
    it(`displays problem description correct conditional information if browser
    is used`, () => {
      createStore({
        ...storeContent,
        problemDescription: {
          ...storeContent.problemDescription,
          browserUsed: "YES",
        } as ProblemDescription,
      });
      const { getByText, queryByText } = renderRecap();
      expect(getByText(/http:\/\/koena.net/)).toBeInTheDocument();
      expect(getByText(/Firefox/)).toBeInTheDocument();
      expect(getByText(/58/)).toBeInTheDocument();
      expect(queryByText(/Was it a mobile app ?/)).not.toBeInTheDocument();
      expect(queryByText(/What kind of app was it?/)).not.toBeInTheDocument();
      expect(
        queryByText(/What was the name of the app?/)
      ).not.toBeInTheDocument();
      expect(
        queryByText(/Which software, connected object/)
      ).not.toBeInTheDocument();
    });

    it(`displays problem description correct conditional information if browser
    is not used`, () => {
      createStore({
        ...storeContent,
        problemDescription: {
          ...storeContent.problemDescription,
          browserUsed: "NO",
        } as ProblemDescription,
      });
      const { getByText, queryByText } = renderRecap();
      expect(queryByText(/What is the url address/)).not.toBeInTheDocument();
      expect(queryByText(/Which web browser did/)).not.toBeInTheDocument();
      expect(queryByText(/Which web browser version/)).not.toBeInTheDocument();
      const mobileAppUsed = within(
        getByText(/Was it a mobile app ?/).parentElement as HTMLElement
      ).getByText("Yes");
      expect(mobileAppUsed).toBeInTheDocument();
    });

    describe("Conditionnal on mobile app used or not", () => {
      it(`displays problem description correct conditional information if mobile
        app is used`, () => {
        createStore({
          ...storeContent,
          problemDescription: {
            ...storeContent.problemDescription,
            browserUsed: "NO",
            mobileAppUsed: "YES",
          } as ProblemDescription,
        });
        const { getByText, queryByText } = renderRecap();
        const mobileAppUsed = within(
          getByText(/Was it a mobile app ?/).parentElement as HTMLElement
        ).getByText("Yes");
        expect(mobileAppUsed).toBeInTheDocument();
        expect(getByText("iOS")).toBeInTheDocument();
        expect(getByText("Super app")).toBeInTheDocument();
        expect(
          queryByText(/Which software, connected object/)
        ).not.toBeInTheDocument();
      });

      it(`displays problem description correct conditional information if mobile
      app is not used`, () => {
        createStore({
          ...storeContent,
          problemDescription: {
            ...storeContent.problemDescription,
            browserUsed: "NO",
            mobileAppUsed: "NO",
          } as ProblemDescription,
        });
        const { getByText, queryByText } = renderRecap();
        const mobileAppUsed = within(
          getByText(/Was it a mobile app ?/).parentElement as HTMLElement
        ).getByText("No");
        expect(mobileAppUsed).toBeInTheDocument();
        expect(queryByText(/What kind of app/)).not.toBeInTheDocument();
        expect(queryByText(/What was the name/)).not.toBeInTheDocument();
        expect(getByText("Connected object")).toBeInTheDocument();
      });
    });
  });

  describe("Conditional on did tell organization or not", () => {
    it(`displays problem description correct conditional information
    if did tell organization is true`, () => {
      createStore({
        ...storeContent,
        problemDescription: {
          ...storeContent.problemDescription,
          didTellOrganization: "YES",
        } as ProblemDescription,
      });
      const { getByText } = renderRecap();
      const organizationReply = within(
        getByText(/Did they reply?/).parentElement as HTMLElement
      ).getByText("Yes");
      expect(organizationReply).toBeInTheDocument();
    });

    it(`displays problem description correct conditional information
    if did tell organization is false`, () => {
      createStore({
        ...storeContent,
        problemDescription: {
          ...storeContent.problemDescription,
          didTellOrganization: "NO",
        } as ProblemDescription,
      });
      const { queryByText } = renderRecap();
      expect(queryByText(/Did they reply?/)).not.toBeInTheDocument();
      expect(queryByText(/What was their reply?/)).not.toBeInTheDocument();
    });

    describe("Conditionnal on did they reply or not", () => {
      it(`displays problem description correct conditional information if
      the organization replied`, () => {
        createStore({
          ...storeContent,
          problemDescription: {
            ...storeContent.problemDescription,
            didTellOrganization: "YES",
            didOrganizationReply: "YES",
          } as ProblemDescription,
        });
        const { getByText } = renderRecap();
        expect(getByText("No reply")).toBeInTheDocument();
      });

      it(`displays problem description correct conditional information if
      the organization didn't reply`, () => {
        createStore({
          ...storeContent,
          problemDescription: {
            ...storeContent.problemDescription,
            didTellOrganization: "YES",
            didOrganizationReply: "NO",
          } as ProblemDescription,
        });
        const { queryByText } = renderRecap();
        expect(queryByText(/What was their reply?/)).not.toBeInTheDocument();
      });
    });
  });

  it(`does not display attached file from the store when we have serialized
  and desirialized it in the session storage`, () => {
    //in that case it's not shown and not sent to the backend
    const files = JSON.parse(
      JSON.stringify([
        new File(["(⌐□_□)"], "Failure.png", {
          type: "image/png",
        }),
        new File(["(⌐□_□)"], "Failure2.png", {
          type: "image/png",
        }),
      ])
    );
    createStore({
      ...storeContent,
      problemDescription: {
        ...storeContent.problemDescription,
        attachedFile: files,
      } as ProblemDescription,
    });
    const { queryByText } = renderRecap();
    expect(queryByText(/Failure.png/)).not.toBeInTheDocument();
    expect(queryByText(/Failure2.png/)).not.toBeInTheDocument();
  });

  it(`displays attached file from the store when we have real File
  objects`, () => {
    const { getByText } = renderRecap();
    expect(getByText(/Failure.png/)).toBeInTheDocument();
    expect(getByText(/Failure2.png/)).toBeInTheDocument();
  });

  it(`displays organization info content from the store`, async () => {
    const { getByText } = renderRecap();
    expect(getByText(/Koena/)).toBeInTheDocument();
    expect(getByText(/2, esplanade de la Gare/)).toBeInTheDocument();
    expect(getByText(/aloha@koena.net/)).toBeInTheDocument();
    expect(getByText(/0972632128/)).toBeInTheDocument();
    expect(getByText(/Armony/)).toBeInTheDocument();
  });
});

describe("Route correctly", () => {
  it(`routes to the correct path when clicking on previous step button,
  and on organization app page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    const { getByText } = renderRecap(history, generatedPathsWithPrefix, PATHS);
    const previousStep = await waitFor(() => getByText("Step 2: Your problem"));
    fireEvent.click(previousStep);
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`routes to the correct path when clicking on previous step button,
  and not on organization app page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithoutPrefix.ROOT],
    });
    const { getByText } = renderRecap(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    const previousStep = getByText("Step 3: The organization");
    fireEvent.click(previousStep);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });

  it(`routes to the correct path when clicking on modify your data button`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText } = renderRecap(history, generatedPaths, paths);
        const modifyYourData = getByText("Modify your data");
        fireEvent.click(modifyYourData);
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      }
    );
  });

  it(`routes to the correct path when clicking on modify your problem
  description`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText } = renderRecap(history, generatedPaths, paths);
        const modifyYourData = getByText("Modify your problem description");
        fireEvent.click(modifyYourData);
        expect(history.location.pathname).toEqual(
          generatedPaths.PROBLEM_DESCRIPTION
        );
      }
    );
  });

  it(`routes to the correct path when clicking on modify organization data,
  if not on organization page`, async () => {
    const history = createMemoryHistory();
    const { getByText } = renderRecap(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    const modifyYourData = getByText("Modify organization data");
    fireEvent.click(modifyYourData);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });

  it(`routes to the the homepage when clicking on reset`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText } = renderRecap(history, generatedPaths, paths);
        const resetData = getByText("Reset all entered data");
        fireEvent.click(resetData);
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      }
    );
  });
});

describe("Submit data to backend", () => {
  it("sends a post request to the backend when clicking on submit", async () => {
    const { getByText } = renderRecap();
    mockedAxios.post.mockResolvedValue({ data: {} });
    const submitButton = getByText("Submit my mediation request");
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
  });

  it(`redirects the user to the main page in case of success`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.RECAP],
        });
        const { getByText } = renderRecap(history, generatedPaths, paths);
        expect(history.location.pathname).toEqual(generatedPaths.RECAP);
        mockedAxios.post.mockResolvedValue({ data: {} });
        const submitButton = getByText("Submit my mediation request");
        await click(submitButton);
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      }
    );
  });

  it(`does not redirect the user in case of failure`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.RECAP],
        });
        const { getByText } = renderRecap(history, generatedPaths, paths);
        expect(history.location.pathname).toEqual(generatedPaths.RECAP);
        mockedAxios.post.mockRejectedValue({ data: {} });
        const submitButton = getByText("Submit my mediation request");
        await click(submitButton);
        expect(history.location.pathname).toEqual(generatedPaths.RECAP);
      }
    );
  });
});

function renderRecap(history?: any, generatedPaths?: any, paths?: any) {
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
  const completed =
    paths === PATHS ? { 0: true, 1: true } : { 0: true, 1: true, 2: true };
  return render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <StateMachineProvider>
            <Recap
              activeStep={3}
              completed={completed}
              resetCompleted={() => null}
              shouldTriggerFocus={false}
              setShouldTriggerFocus={() => null}
              displayRequestSuccessMessage={() => null}
              displayRequestFailureMessage={() => null}
            />
          </StateMachineProvider>
        </Route>
      </Router>
    </I18nProvider>
  );
}

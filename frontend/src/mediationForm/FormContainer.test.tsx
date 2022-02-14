import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { StateMachineProvider } from "little-state-machine";
import { useState } from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  click,
  configData,
  generatePathsWithoutPrefix,
  generatePathsWithPrefix,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import { mockedAxios, resetAxiosMocks } from "../__mocks__/axiosMock";
import FormContainer from "./FormContainer";
import type { Step } from "./StepsInitializer";
import {
  checkStep1FieldValues,
  checkStep2FieldValues,
  checkStep3FieldValues,
  fillStep1NonMandatoryFields,
  fillStep2NonMandatoryFields,
  fillStep3NonMandatoryFields,
  ResetLittleStateMachine,
  unlockStep,
} from "./testUtils";

initLanguagesForTesting();

const generatedPathsWithPrefix = generatePathsWithPrefix();
const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

const resetStateMachine = () => {
  // this is needed to clean the store in jsdom sessionStorage
  render(
    <StateMachineProvider>
      <ResetLittleStateMachine />
    </StateMachineProvider>
  );
};

async function resetBetweenTwoSubTests() {
  resetStateMachine();
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(1);
}

beforeEach(async () => {
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
  resetStateMachine();
});

describe("Steps routing correct display", () => {
  it("displays only user info step when on / path", async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await testRoute(generatedPaths.ROOT, 1, generatedPaths, paths);
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it(`displays only problem description step when on /problem-description
  path`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await testRoute(
          generatedPaths.PROBLEM_DESCRIPTION,
          2,
          generatedPaths,
          paths
        );
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it(`displays only organization info step when on /organization-info
  path (not available for organization page)`, async () => {
    await testRoute(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO,
      3,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
  });

  it(`displays only recap step when on /recap path, and on organization page
  `, async () => {
    await testRoute(
      generatedPathsWithPrefix.RECAP,
      3,
      generatedPathsWithPrefix,
      PATHS
    );
  });

  it(`displays only recap step when on /recap path, and not on organization page
  `, async () => {
    await testRoute(
      generatedPathsWithoutPrefix.RECAP,
      4,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
  });

  async function testRoute(
    path: string,
    stepToDisplay: number,
    generatedPaths: Paths,
    paths: Paths
  ) {
    const history = createMemoryHistory({
      initialEntries: [generatedPaths.ROOT],
    });
    const app = renderFormContainer(history, generatedPaths, paths);
    await unlockStep(app, (stepToDisplay - 1) as Step, paths === PATHS);
    await waitFor(() => {
      history.push(path);
    });
    checkStepText(app, /Step 1/, stepToDisplay === 1);
    checkStepText(app, /Step 2/, stepToDisplay === 2);
    checkStepText(app, /Step 3/, stepToDisplay === 3);
    checkStepText(app, /Step 4/, stepToDisplay === 4);
  }

  function checkStepText(
    app: RenderResult,
    textToSearch: string | RegExp,
    shouldBePresent: boolean
  ) {
    if (shouldBePresent) {
      expect(app.getByRole("heading", { level: 2 }).textContent).toMatch(
        textToSearch
      );
    } else {
      expect(
        (app.queryByRole("heading", { level: 2 }) as HTMLElement).textContent
      ).not.toMatch(textToSearch);
    }
  }
});

describe("renders correctly document title", () => {
  it(`renders correct title when visiting route /`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ROOT,
          0,
          "Connect Access - Submit a mediation request: your details",
          generatedPaths,
          paths
        );
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it(`renders correct title when visiting route /problem-description`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.PROBLEM_DESCRIPTION,
          1,
          "Connect Access - Submit a mediation request: your problem",
          generatedPaths,
          paths
        );
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it(`renders correct title when visiting route /organization-info (not available
    for organization page)`, async () => {
    await checkRendersCorrectTitle(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO,
      2,
      "Connect Access - Submit a mediation request: the organization",
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
  });

  it(`renders correct title when visiting route /recap`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.RECAP,
          3,
          "Connect Access - Submit a mediation request: summary",
          generatedPaths,
          paths
        );
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  async function checkRendersCorrectTitle(
    route: string,
    step: Step,
    expectedTitle: string,
    generatedPaths: Paths,
    paths: Paths
  ) {
    const history = createMemoryHistory({
      initialEntries: [generatedPaths.ROOT],
    });
    const app = renderFormContainer(history, generatedPaths, paths);
    await unlockStep(app, step, paths === PATHS);
    history.push(route);
    await waitFor(() => expect(document.title).toEqual(expectedTitle));
  }
});

describe("Steps routing with tabs", () => {
  it(`changes the route only on first, second and third step with first and
  second step completed, when on organization page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    const app = renderFormContainer(history, generatedPathsWithPrefix, PATHS);
    await unlockStep(app, 2, true);
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
    await click(within(app.getByRole("tablist")).getByText("Summary"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
    await click(within(app.getByRole("tablist")).getByText("About you"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    await click(within(app.getByRole("tablist")).getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`changes the route only on first, second and third step with first and
  second step completed, when not on organization page`, async () => {
    const history = createMemoryHistory();
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    const app = renderFormContainer(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    await unlockStep(app, 2);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(within(app.getByRole("tablist")).getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(within(app.getByRole("tablist")).getByText("About you"));
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(within(app.getByRole("tablist")).getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(within(app.getByRole("tablist")).getByText("The organization"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });
});

describe("Initialize unlocked steps and do initial routing if needed", () => {
  it(`keeps unlocked steps unlocked when recreating the component`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const app = renderFormContainer(null, generatedPaths, paths);
        await unlockStep(app, 1);
        app.unmount();
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText: getByText2 } = renderFormContainer(
          history,
          generatedPaths,
          paths
        );
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
        await click(getByText2("Summary"));
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
        await click(getByText2("Your problem"));
        expect(history.location.pathname).toEqual(
          generatedPaths.PROBLEM_DESCRIPTION
        );
        if (paths !== PATHS) {
          await click(getByText2("The organization"));
          expect(history.location.pathname).toEqual(
            generatedPaths.PROBLEM_DESCRIPTION
          );
        }
        await click(getByText2("About you"));
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it(`redirects to the neerest unlocked step if rendering a locked one, when
  on organization page`, async () => {
    let history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.RECAP],
    });
    const { unmount } = renderFormContainer(
      history,
      generatedPathsWithPrefix,
      PATHS
    );
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    unmount();
    const app = renderFormContainer(null, generatedPathsWithPrefix, PATHS);
    await unlockStep(app, 1, true);
    app.unmount();
    history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.RECAP],
    });
    renderFormContainer(history, generatedPathsWithPrefix, PATHS);
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`redirects to the neerest unlocked step if rendering a locked one, when
  not on organization page`, async () => {
    let history = createMemoryHistory({
      initialEntries: [generatedPathsWithoutPrefix.ORGANIZATION_INFO],
    });
    const { unmount } = renderFormContainer(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    unmount();
    const app = renderFormContainer(
      null,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    await unlockStep(app, 1);
    app.unmount();
    history = createMemoryHistory({
      initialEntries: [generatedPathsWithoutPrefix.ORGANIZATION_INFO],
    });
    renderFormContainer(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
  });
});

describe("Saving values with tabs", () => {
  it(`saves the entered data on step 1 after successful click on another tab,
  and redisplays it when click back to the step 1 tab`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 1);
    await click(app.getByText("About you"));
    await fillStep1NonMandatoryFields(app);
    await click(app.getByText("Your problem"));
    await click(app.getByText("About you"));
    checkStep1FieldValues(app);
  });

  it(`saves the entered data on step 2 after successful click on another tab,
  and redisplays it when click back to the step 2 tab`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 2);
    await click(app.getByText("Your problem"));
    await fillStep2NonMandatoryFields(app);
    await click(app.getByText("About you"));
    await click(app.getByText("Your problem"));
    checkStep2FieldValues(app);
  });

  it(`saves the entered data on step 3 after successful click on another tab,
  and redisplays it when click back to the step 3 tab`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 3);
    await click(within(app.getByRole("tablist")).getByText("The organization"));
    fillStep3NonMandatoryFields(app);
    await click(app.getByText("About you"));
    await click(app.getByText("The organization"));
    checkStep3FieldValues(app);
  });
});

describe("Reset entered values", () => {
  it(`removes possibility to change to next page without entering data again
  when clicking on reset`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const app = renderFormContainer(history, generatedPaths, paths);
        await unlockStep(app, 3, paths === PATHS);
        const resetData = app.getByText("Reset all entered data");
        await click(resetData);
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
        await click(app.getByText("Your problem"));
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      },
      undefined,
      resetBetweenTwoSubTests
    );
  });

  it("resets all store values definitely when clicking on reset", async () => {
    const app = renderFormContainer();
    const { getByText, queryByText, getByRole, unmount } = app;
    await unlockStep(app, 3);
    await click(within(getByRole("tablist")).getByText("About you"));
    await fillStep1NonMandatoryFields(app);
    await click(within(getByRole("tablist")).getByText("Summary"));
    const resetData = getByText("Reset all entered data");
    expect(getByText(/Bill/)).toBeInTheDocument();
    expect(getByText(/Blue/)).toBeInTheDocument();
    expect(getByText(/01234567890/)).toBeInTheDocument();
    await click(resetData);
    expect(queryByText(/Bill/)).not.toBeInTheDocument();
    expect(queryByText(/Blue/)).not.toBeInTheDocument();
    expect(queryByText(/01234567890/)).not.toBeInTheDocument();
    unmount();
    const { queryByText: queryByText2 } = renderFormContainer();
    expect(queryByText2(/Bill/)).not.toBeInTheDocument();
    expect(queryByText2(/Blue/)).not.toBeInTheDocument();
    expect(queryByText2(/01234567890/)).not.toBeInTheDocument();
  });
});

describe("A11y of the tabs menu", () => {
  it(`focuses on the first element in the tabpanel after focus on the first
  navigation tab`, () => {
    const { getByLabelText } = renderFormContainer();
    userEvent.tab();
    userEvent.tab();
    expect(getByLabelText(/First name/)).toHaveFocus();
  });

  it(`focuses on the first element in the tabpanel after changing tab`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 1);
    await click(app.getByText("About you"));
    userEvent.tab();
    expect(app.getByLabelText(/First name/)).toHaveFocus();
  });

  it(`gives the focus to the tab when click to next or previous`, async () => {
    const app = renderFormContainer();
    const { getByText, getAllByRole } = app;
    await unlockStep(app, 3);
    await click(getAllByRole("tab")[0]);
    await click(getByText("Step 2: Your problem"));
    expect(getAllByRole("tab")[1]).toHaveFocus();
    await click(getByText("Step 3: The organization"));
    expect(getAllByRole("tab")[2]).toHaveFocus();
    await click(getByText("Step 4: Summary"));
    expect(getAllByRole("tab")[3]).toHaveFocus();
    await click(getByText("Step 3: The organization"));
    expect(getAllByRole("tab")[2]).toHaveFocus();
    await click(getByText("Step 2: Your problem"));
    expect(getAllByRole("tab")[1]).toHaveFocus();
    await click(getByText("Step 1: About yourself"));
    expect(getAllByRole("tab")[0]).toHaveFocus();
  });

  it(`gives the focus to the tab when click to modify from summary`, async () => {
    const app = renderFormContainer();
    const { getByText, getAllByRole } = app;
    await unlockStep(app, 3);
    await click(getByText("Modify your data"));
    expect(getAllByRole("tab")[0]).toHaveFocus();
    await click(getAllByRole("tab")[3]);
    await click(getByText("Modify your problem description"));
    expect(getAllByRole("tab")[1]).toHaveFocus();
    await click(getAllByRole("tab")[3]);
    await click(getByText("Modify organization data"));
    expect(getAllByRole("tab")[2]).toHaveFocus();
  });
});

describe("Submit data to backend", () => {
  it(`displays a success notification when clicking on submit on recap page and the
  operation is successful`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 3);
    mockedAxios.post.mockResolvedValue({ data: {} });
    const submitButton = app.getByText("Submit my mediation request");
    await click(submitButton);
    const success = app.getByText(
      "Your mediation request has been successfully sent !"
    );
    expect(success).toBeInTheDocument();
  });
  it(`displays an error notification when clicking on submit on recap page and the
  backend replies with an error`, async () => {
    const app = renderFormContainer();
    await unlockStep(app, 3);
    mockedAxios.post.mockRejectedValue({ data: {} });
    const submitButton = app.getByText("Submit my mediation request");
    await click(submitButton);
    const failure = app.getByText(/There was a technical error/);
    expect(failure).toBeInTheDocument();
  });
});

function renderFormContainer(
  history?: any,
  generatedPaths?: any,
  paths?: any
): RenderResult {
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
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <Route path={paths.ROOT}>
              <ComponentWrapper />
            </Route>
          </Router>
        </I18nProvider>
      </SWRConfig>
    </ConfigDataContext.Provider>
  );
}

function ComponentWrapper() {
  const [activeStep, setActiveStep] = useState<Step>(0);
  return (
    <FormContainer activeStep={activeStep} setActiveStep={setActiveStep} />
  );
}

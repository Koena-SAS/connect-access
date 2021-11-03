import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { act, render, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { StateMachineProvider } from "little-state-machine";
import { useState } from "react";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
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
import FormContainer from "./FormContainer";
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
jest.mock("axios");
jest.setTimeout(10000);

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
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
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
      async (generatedPaths, paths) => {
        await testRoute(generatedPaths.ROOT, 1, generatedPaths, paths);
      },
      null,
      resetBetweenTwoSubTests
    );
  });

  it(`displays only problem description step when on /problem-description
  path`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths, paths) => {
        await testRoute(
          generatedPaths.PROBLEM_DESCRIPTION,
          2,
          generatedPaths,
          paths
        );
      },
      null,
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

  async function testRoute(path, stepToDisplay, generatedPaths, paths) {
    const history = createMemoryHistory({
      initialEntries: [generatedPaths.ROOT],
    });
    const { getByRole, queryByRole, getByLabelText, getByText } =
      renderFormContainer(history, generatedPaths, paths);
    await unlockStep(
      getByLabelText,
      getByText,
      stepToDisplay - 1,
      paths === PATHS
    );
    await act(async () => {
      history.push(path);
    });
    checkStepText(getByRole, queryByRole, /Step 1/, stepToDisplay === 1);
    checkStepText(getByRole, queryByRole, /Step 2/, stepToDisplay === 2);
    checkStepText(getByRole, queryByRole, /Step 3/, stepToDisplay === 3);
    checkStepText(getByRole, queryByRole, /Step 4/, stepToDisplay === 4);
  }

  function checkStepText(
    getByRole,
    queryByRole,
    textToSearch,
    shouldBePresent
  ) {
    if (shouldBePresent) {
      expect(getByRole("heading", { level: 2 }).textContent).toMatch(
        textToSearch
      );
    } else {
      expect(queryByRole("heading", { level: 2 }).textContent).not.toMatch(
        textToSearch
      );
    }
  }
});

describe("renders correctly document title", () => {
  it(`renders correct title when visiting route /`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths, paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.ROOT,
          0,
          "Connect Access - Submit a mediation request: your details",
          generatedPaths,
          paths
        );
      },
      null,
      resetBetweenTwoSubTests
    );
  });

  it(`renders correct title when visiting route /problem-description`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths, paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.PROBLEM_DESCRIPTION,
          1,
          "Connect Access - Submit a mediation request: your problem",
          generatedPaths,
          paths
        );
      },
      null,
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
      async (generatedPaths, paths) => {
        await checkRendersCorrectTitle(
          generatedPaths.RECAP,
          3,
          "Connect Access - Submit a mediation request: summary",
          generatedPaths,
          paths
        );
      },
      null,
      resetBetweenTwoSubTests
    );
  });

  async function checkRendersCorrectTitle(
    route,
    step,
    expectedTitle,
    generatedPaths,
    paths
  ) {
    const history = createMemoryHistory({
      initialEntries: [generatedPaths.ROOT],
    });
    const { getByLabelText, getByText } = renderFormContainer(
      history,
      generatedPaths,
      paths
    );
    await unlockStep(getByLabelText, getByText, step, paths === PATHS);
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
    const { getByText, getByLabelText, getByRole } = renderFormContainer(
      history,
      generatedPathsWithPrefix,
      PATHS
    );
    await unlockStep(getByLabelText, getByText, 2, true);
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
    await click(within(getByRole("tablist")).getByText("Summary"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
    await click(within(getByRole("tablist")).getByText("About you"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    await click(within(getByRole("tablist")).getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`changes the route only on first, second and third step with first and
  second step completed, when not on organization page`, async () => {
    const history = createMemoryHistory();
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    const { getByText, getByLabelText, getByRole } = renderFormContainer(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    await unlockStep(getByLabelText, getByText, 2);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(within(getByRole("tablist")).getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(within(getByRole("tablist")).getByText("About you"));
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(within(getByRole("tablist")).getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(within(getByRole("tablist")).getByText("The organization"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });
});

describe("Initialize unlocked steps and do initial routing if needed", () => {
  it(`keeps unlocked steps unlocked when recreating the component`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths, paths) => {
        const { getByText, getByLabelText, unmount } = renderFormContainer(
          null,
          generatedPaths,
          paths
        );
        await unlockStep(getByLabelText, getByText, 1);
        unmount();
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
      null,
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
    const {
      getByText,
      getByLabelText,
      unmount: unmount2,
    } = renderFormContainer(null, generatedPathsWithPrefix, PATHS);
    await unlockStep(getByLabelText, getByText, 1, true);
    unmount2();
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
    const {
      getByText,
      getByLabelText,
      unmount: unmount2,
    } = renderFormContainer(
      null,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    await unlockStep(getByLabelText, getByText, 1);
    unmount2();
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
    const { getByText, getByLabelText } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 1);
    await click(getByText("About you"));
    fillStep1NonMandatoryFields(getByLabelText);
    await click(getByText("Your problem"));
    await click(getByText("About you"));
    checkStep1FieldValues(getByLabelText);
  });

  it(`saves the entered data on step 2 after successful click on another tab,
  and redisplays it when click back to the step 2 tab`, async () => {
    const { getByText, getByLabelText } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 2);
    await click(getByText("Your problem"));
    await fillStep2NonMandatoryFields(getByLabelText);
    await click(getByText("About you"));
    await click(getByText("Your problem"));
    checkStep2FieldValues(getByLabelText);
  });

  it(`saves the entered data on step 3 after successful click on another tab,
  and redisplays it when click back to the step 3 tab`, async () => {
    const { getByText, getByLabelText, getByRole } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
    await click(within(getByRole("tablist")).getByText("The organization"));
    fillStep3NonMandatoryFields(getByLabelText);
    await click(getByText("About you"));
    await click(getByText("The organization"));
    checkStep3FieldValues(getByLabelText);
  });
});

describe("Reset entered values", () => {
  it(`removes possibility to change to next page without entering data again
  when clicking on reset`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths, paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText, getByLabelText } = renderFormContainer(
          history,
          generatedPaths,
          paths
        );
        await unlockStep(getByLabelText, getByText, 3, paths === PATHS);
        const resetData = getByText("Reset all entered data");
        await click(resetData);
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
        await click(getByText("Your problem"));
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      },
      null,
      resetBetweenTwoSubTests
    );
  });

  it("resets all store values definitely when clicking on reset", async () => {
    const { getByText, getByLabelText, queryByText, getByRole, unmount } =
      renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
    await click(within(getByRole("tablist")).getByText("About you"));
    fillStep1NonMandatoryFields(getByLabelText);
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
    const { getByLabelText, getByText } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 1);
    await click(getByText("About you"));
    userEvent.tab();
    expect(getByLabelText(/First name/)).toHaveFocus();
  });

  it(`gives the focus to the tab when click to next or previous`, async () => {
    const { getByLabelText, getByText, getAllByRole } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
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
    const { getByLabelText, getByText, getAllByRole } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
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
    const { getByText, getByLabelText } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
    mockedAxios.post.mockResolvedValue({ data: {} });
    const submitButton = getByText("Submit my mediation request");
    await click(submitButton);
    const success = getByText(
      "Your mediation request has been successfully sent !"
    );
    expect(success).toBeInTheDocument();
  });
  it(`displays an error notification when clicking on submit on recap page and the
  backend replies with an error`, async () => {
    const { getByText, getByLabelText } = renderFormContainer();
    await unlockStep(getByLabelText, getByText, 3);
    mockedAxios.post.mockRejectedValue({ data: {} });
    const submitButton = getByText("Submit my mediation request");
    await click(submitButton);
    const failure = getByText(/There was a technical error/);
    expect(failure).toBeInTheDocument();
  });
});

function renderFormContainer(history?: any, generatedPaths?: any, paths?: any) {
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
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <I18nProvider i18n={i18n}>
        <Router history={history}>
          <Route path={paths.ROOT}>
            <ComponentWrapper />
          </Route>
        </Router>
      </I18nProvider>
    </SWRConfig>
  );
}

function ComponentWrapper() {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <FormContainer activeStep={activeStep} setActiveStep={setActiveStep} />
  );
}

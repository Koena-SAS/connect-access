import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { createStore, StateMachineProvider } from "little-state-machine";
import { Route, Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  click,
  generatePathsWithoutPrefix,
  generatePathsWithPrefix,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import ProblemDescription from "./ProblemDescription";
import {
  checkStep2FieldValues,
  fillStep2MandatoryFields,
  fillStep2NonMandatoryFields,
} from "./testUtils";

initLanguagesForTesting();
jest.mock("axios");

const generatedPathsWithPrefix = generatePathsWithPrefix();
const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

beforeEach(async () => {
  createStore({
    problemDescription: {
      urgency: "",
      issueDescription: "",
      stepDescription: "",
      inaccessibilityLevel: "",
      browserUsed: "",
      url: "",
      browser: "",
      browserVersion: "",
      mobileAppUsed: "",
      mobileAppPlatform: "",
      mobileAppName: "",
      otherUsedSoftware: "",
      didTellOrganization: "",
      didOrganizationReply: "",
      organizationReply: "",
      furtherInfo: "",
      attachedFile: null,
    },
  });
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("display fields conditionnally", () => {
  describe("Conditional on browser used or not", () => {
    it(`displays problem description correct conditional fields if browser
    is used`, async () => {
      await checkConditionalFields(true, false, true, true);
    });
    describe("Conditionnal on mobile app used or not", () => {
      it(`displays problem description correct conditional fields if mobile
        app is used`, async () => {
        await checkConditionalFields(false, true, true, true);
      });

      it(`displays problem description correct conditional fields if mobile
      app is not used`, async () => {
        await checkConditionalFields(false, false, true, true);
      });
    });
  });

  describe("Conditional on did tell organization or not", () => {
    it(`displays problem description correct conditional fields
    if did tell organization is false`, async () => {
      await checkConditionalFields(true, false, false, false);
    });
    describe("Conditionnal on did they reply or not", () => {
      it(`displays problem description correct conditional fields if
      the organization replied`, async () => {
        await checkConditionalFields(false, true, true, true);
      });

      it(`displays problem description correct conditional fields if
      the organization didn't reply`, async () => {
        await checkConditionalFields(false, true, true, false);
      });
    });
  });

  async function checkConditionalFields(
    browserUsed,
    mobileAppUsed,
    didTellOrganization,
    didOrganizationReply
  ) {
    const { getByLabelText } = renderProblemDescription();
    const conditionalFields = {
      browserUsed,
      mobileAppUsed,
      didTellOrganization,
      didOrganizationReply,
    };
    fillStep2MandatoryFields(getByLabelText);
    await fillStep2NonMandatoryFields(getByLabelText, conditionalFields);
    await checkStep2FieldValues(getByLabelText, conditionalFields);
  }

  describe("Conditional on organizaton page or not", () => {
    it(`does not display organization related fieldset if organizationApp
    exists`, async () => {
      const { queryByText } = renderProblemDescription(
        null,
        generatedPathsWithPrefix,
        PATHS
      );
      const organizationRelatedFieldset = queryByText(
        "About the organization's answer"
      );
      await waitFor(() =>
        expect(organizationRelatedFieldset).not.toBeInTheDocument()
      );
    });

    it(`displays organization related fieldset if organizationApp does not
    exist`, () => {
      const { getByText } = renderProblemDescription();
      const organizationRelatedFieldset = getByText(
        "About the organization's answer"
      );
      expect(organizationRelatedFieldset).toBeInTheDocument();
    });
  });
});

describe("Errors on mandatory fields", () => {
  it(`displays an error message and keeps the route when the issueDescription is
  missing`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderProblemDescription(history);
    fillStep2MandatoryFields(getByLabelText, "issueDescription");
    const submit = getByText("Step 3: The organization");
    await click(submit);
    const error = getByText("You have to describe your problem");
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Errors on bad formatted input", () => {
  it(`displays an error message and keeps the route when the url has a bad format,
  and click on next`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderProblemDescription(history);
    fillStep2MandatoryFields(getByLabelText);
    const inputUrl = getByLabelText(/What is the URL address/);
    fireEvent.change(inputUrl, { target: { value: "htp://domain.extension" } });
    const submit = getByText("Step 3: The organization");
    await click(submit);
    const error = getByText("The URL format is invalid");
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the url has a bad format,
  and click on previous`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderProblemDescription(history);
    const inputUrl = getByLabelText(/What is the URL address/);
    fireEvent.change(inputUrl, { target: { value: "htp://domain.extension" } });
    const submit = getByText("Step 1: About yourself");
    await click(submit);
    const error = getByText("The URL format is invalid");
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on next", async () => {
    const { getByText, getByLabelText } = renderProblemDescription();
    const inputUrl = getByLabelText(/What is the URL address/);
    fireEvent.change(inputUrl, { target: { value: "htp://domain.extension" } });
    const submit = getByText("Step 3: The organization");
    await click(submit);
    expect(getByLabelText(/What was the issue?/)).toHaveFocus();
  });

  it("gives focus to the first error when click on previous", async () => {
    const { getByText, getByLabelText } = renderProblemDescription();
    const inputUrl = getByLabelText(/What is the URL address/);
    fireEvent.change(inputUrl, { target: { value: "htp://domain.extension" } });
    const submit = getByText("Step 1: About yourself");
    await click(submit);
    expect(getByLabelText(/What is the URL address/)).toHaveFocus();
  });

  it("gives focus to the first error when click another tab", async () => {
    const { getByLabelText, getByRole } = renderProblemDescription();
    const inputUrl = getByLabelText(/What is the URL address/);
    fireEvent.change(inputUrl, { target: { value: "htp://domain.extension" } });
    const submit = getByRole("tab", { name: /About you/ });
    await click(submit);
    expect(getByLabelText(/What is the URL address/)).toHaveFocus();
  });
});

describe("Route correctly on previous / next step navigation buttons", () => {
  it(`routes to the correct path when click on next step button, with required fields
  filled, and on organization app page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    const { getByText, getByLabelText } = renderProblemDescription(
      history,
      generatedPathsWithPrefix,
      PATHS
    );
    fillStep2MandatoryFields(getByLabelText);
    const submit = await waitFor(() => getByText("Step 3: Summary"));
    await click(submit);
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
  });

  it(`routes to the correct path when click on next step button, with required fields
  filled, and not on organization app page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithoutPrefix.ROOT],
    });
    const { getByText, getByLabelText } = renderProblemDescription(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX
    );
    fillStep2MandatoryFields(getByLabelText);
    const submit = getByText("Step 3: The organization");
    await click(submit);
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });

  it(`routes to the correct path when click on previous step button, without willing
  required fields`, async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const { getByText } = renderProblemDescription(
        history,
        generatedPaths,
        paths
      );
      const submit = getByText("Step 1: About yourself");
      await click(submit);
      expect(history.location.pathname).toEqual(generatedPaths.ROOT);
    });
  });
});

describe("Saves data", () => {
  it(`saves entered data after successful click on next step, and redisplays it
  when the component is recreated`, async () => {
    const { getByText, getByLabelText, unmount } = renderProblemDescription();
    fillStep2MandatoryFields(getByLabelText);
    await fillStep2NonMandatoryFields(getByLabelText);
    const next = getByText("Step 3: The organization");
    await click(next);
    unmount();
    await checkStep2FieldValues(renderProblemDescription().getByLabelText);
  });

  it(`saves entered data after successful click on previous step, and redisplays it
  when the component is recreated`, async () => {
    const { getByText, getByLabelText, unmount } = renderProblemDescription();
    fillStep2MandatoryFields(getByLabelText);
    await fillStep2NonMandatoryFields(getByLabelText);
    const previous = getByText("Step 1: About yourself");
    await click(previous);
    unmount();
    await checkStep2FieldValues(renderProblemDescription().getByLabelText);
  });
});

function renderProblemDescription(
  history?: any,
  generatedPaths?: any,
  paths?: any
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
  const completed =
    paths === PATHS ? { 0: true, 1: true } : { 0: true, 1: true, 2: true };
  return render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <I18nProvider i18n={i18n}>
        <Router history={history}>
          <Route path={paths.ROOT}>
            <StateMachineProvider>
              <ProblemDescription
                activeStep={1}
                setStepCompleted={() => null}
                completed={completed}
                shouldTriggerFocus={false}
                setShouldTriggerFocus={() => null}
              />
            </StateMachineProvider>
          </Route>
        </Router>
      </I18nProvider>
    </SWRConfig>
  );
}

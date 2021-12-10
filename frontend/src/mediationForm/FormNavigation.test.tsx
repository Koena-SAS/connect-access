import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import {
  click,
  generatePathsWithoutPrefix,
  generatePathsWithPrefix,
  resetAxiosMocks,
  runWithAndWithoutOrganizationPrefix,
} from "../testUtils";
import FormNavigation from "./FormNavigation";
import type { Completed, Step } from "./StepsInitializer";

initLanguagesForTesting();
jest.mock("axios");

const generatedPathsWithPrefix = generatePathsWithPrefix();
const generatedPathsWithoutPrefix = generatePathsWithoutPrefix();

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Steps routing through tabs", () => {
  it(`doesn't change the route on any tab with no completed steps, when on
  organization page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithPrefix,
      PATHS,
      {}
    );
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
  });

  it(`doesn't change the route on any tab with no completed steps, when not on
  organization page`, async () => {
    const history = createMemoryHistory();
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX,
      {}
    );
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(getByText("The organization"));
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
  });

  it(`changes the route to second step tab, with only first step completed,
  when on organization page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithPrefix,
      PATHS,
      {
        0: true,
      }
    );
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`changes the route to second step tab, with only first step completed,
  when not on organization page`, async () => {
    const history = createMemoryHistory();
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX,
      {
        0: true,
      }
    );
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("The organization"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
  });

  it(`changes the route to second and third step tab, with first and
  second steps completed, when on organization page`, async () => {
    const history = createMemoryHistory({
      initialEntries: [generatedPathsWithPrefix.ROOT],
    });
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithPrefix,
      PATHS,
      {
        0: true,
        1: true,
      }
    );
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.ROOT);
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(generatedPathsWithPrefix.RECAP);
  });

  it(`changes the route to second and third step tab, with only first and
  second steps completed, when not on organization page`, async () => {
    const history = createMemoryHistory();
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX,
      {
        0: true,
        1: true,
      }
    );
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("The organization"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
  });

  it(`changes the route to second, third and fourth step tab, with first, second
  and steps third steps completed, when not on organization page`, async () => {
    const history = createMemoryHistory();
    const { getByText } = renderFormNavigation(
      history,
      generatedPathsWithoutPrefix,
      PATHS_WITHOUT_PREFIX,
      {
        0: true,
        1: true,
        2: true,
      }
    );
    expect(history.location.pathname).toEqual(generatedPathsWithoutPrefix.ROOT);
    await click(getByText("Your problem"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.PROBLEM_DESCRIPTION
    );
    await click(getByText("The organization"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.ORGANIZATION_INFO
    );
    await click(getByText("Summary"));
    expect(history.location.pathname).toEqual(
      generatedPathsWithoutPrefix.RECAP
    );
  });
});

describe("Accessibility", () => {
  describe("Focus management on tabs with arrows", () => {
    it(`changes correctly tabs with arrows when all steps are reachable, when on
  organization page`, () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithPrefix,
        PATHS,
        {
          0: true,
          1: true,
        }
      );
      const tabs = getAllByRole("tab");
      userEvent.tab();
      expect(tabs[0]).toHaveFocus();
      fireEvent.keyDown(tabs[0], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[1]).toHaveFocus();
      fireEvent.keyDown(tabs[1], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[2]).toHaveFocus();
      fireEvent.keyDown(tabs[2], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[0]).toHaveFocus();
      fireEvent.keyDown(tabs[0], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[2]).toHaveFocus();
      fireEvent.keyDown(tabs[2], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[1]).toHaveFocus();
      fireEvent.keyDown(tabs[1], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[0]).toHaveFocus();
    });

    it(`changes correctly tabs with arrows when all steps are reachable, when not on
  organization page`, () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithoutPrefix,
        PATHS_WITHOUT_PREFIX,
        {
          0: true,
          1: true,
          2: true,
        }
      );
      const tabs = getAllByRole("tab");
      userEvent.tab();
      expect(tabs[0]).toHaveFocus();
      fireEvent.keyDown(tabs[0], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[1]).toHaveFocus();
      fireEvent.keyDown(tabs[1], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[2]).toHaveFocus();
      fireEvent.keyDown(tabs[2], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[3]).toHaveFocus();
      fireEvent.keyDown(tabs[3], { key: "ArrowRight", code: "ArrowRight" });
      expect(tabs[0]).toHaveFocus();
      fireEvent.keyDown(tabs[0], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[3]).toHaveFocus();
      fireEvent.keyDown(tabs[3], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[2]).toHaveFocus();
      fireEvent.keyDown(tabs[2], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[1]).toHaveFocus();
      fireEvent.keyDown(tabs[1], { key: "ArrowLeft", code: "ArrowLeft" });
      expect(tabs[0]).toHaveFocus();
    });

    it(`changes correctly tabs with arrows when only step 1 and 2 are reachable
  `, async () => {
      await runWithAndWithoutOrganizationPrefix(
        async (generatedPaths: Paths, paths: Paths) => {
          const { getAllByRole } = renderFormNavigation(
            null,
            generatedPaths,
            paths,
            {
              0: true,
            }
          );
          const tabs = getAllByRole("tab");
          userEvent.tab();
          expect(tabs[0]).toHaveFocus();
          fireEvent.keyDown(tabs[0], { key: "ArrowRight", code: "ArrowRight" });
          expect(tabs[1]).toHaveFocus();
          fireEvent.keyDown(tabs[1], { key: "ArrowRight", code: "ArrowRight" });
          expect(tabs[0]).toHaveFocus();
          fireEvent.keyDown(tabs[0], { key: "ArrowLeft", code: "ArrowLeft" });
          expect(tabs[1]).toHaveFocus();
          fireEvent.keyDown(tabs[1], { key: "ArrowLeft", code: "ArrowLeft" });
          expect(tabs[0]).toHaveFocus();
        }
      );
    });

    it("gives the focus to the currently active element when press tab", async () => {
      await runWithAndWithoutOrganizationPrefix(
        async (generatedPaths: Paths, paths: Paths) => {
          const { getAllByRole } = renderFormNavigation(
            null,
            generatedPaths,
            paths,
            {
              0: true,
              1: true,
              2: true,
            },
            2
          );
          const tabs = getAllByRole("tab");
          userEvent.tab();
          expect(tabs[2]).toHaveFocus();
        }
      );
    });
  });

  describe("Disabled status correctly set", () => {
    it(`sets tabs with no possible action to disabled when starting, and on
    organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithPrefix,
        PATHS
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).toBeDisabled();
      expect(tabs[2]).toBeDisabled();
    });

    it(`sets tabs with no possible action to disabled when starting, and not on
    organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithoutPrefix,
        PATHS_WITHOUT_PREFIX
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).toBeDisabled();
      expect(tabs[2]).toBeDisabled();
      expect(tabs[3]).toBeDisabled();
    });

    it(`sets tabs with no possible action to disabled when some of them are
    unlocked, and not on organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithPrefix,
        PATHS,
        {
          0: true,
        },
        1
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).not.toBeDisabled();
      expect(tabs[2]).toBeDisabled();
    });

    it(`sets tabs with no possible action to disabled when some of them are
    unlocked, and not on organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithoutPrefix,
        PATHS_WITHOUT_PREFIX,
        {
          0: true,
          1: true,
        },
        2
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).not.toBeDisabled();
      expect(tabs[2]).not.toBeDisabled();
      expect(tabs[3]).toBeDisabled();
    });

    it(`sets tabs with no possible action to disabled when all of them are
    unlocked and moved active step on the first step, when on
    organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithoutPrefix,
        PATHS,
        {
          0: true,
          1: true,
        },
        0
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).not.toBeDisabled();
      expect(tabs[2]).not.toBeDisabled();
    });

    it(`sets tabs with no possible action to disabled when all of them are
    unlocked and moved active step on the first step, when not on
    organization page`, async () => {
      const { getAllByRole } = renderFormNavigation(
        null,
        generatedPathsWithoutPrefix,
        PATHS_WITHOUT_PREFIX,
        {
          0: true,
          1: true,
          2: true,
        },
        0
      );
      const tabs = getAllByRole("tab");
      expect(tabs[0]).not.toBeDisabled();
      expect(tabs[1]).not.toBeDisabled();
      expect(tabs[2]).not.toBeDisabled();
      expect(tabs[3]).not.toBeDisabled();
    });
  });
});

function renderFormNavigation(
  history: History | null,
  generatedPaths: Paths,
  paths: Paths,
  completed: Completed = {},
  activeStep: Step = 0
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
  return render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <FormNavigation
            activeStep={activeStep}
            completed={completed}
            onChangeTab={async () => true}
            shouldTriggerFocus={false}
            setShouldTriggerFocus={() => null}
          />{" "}
        </Route>
      </Router>
    </I18nProvider>
  );
}

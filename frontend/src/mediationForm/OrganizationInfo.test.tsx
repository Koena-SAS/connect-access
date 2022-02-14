import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { createStore, StateMachineProvider } from "little-state-machine";
import { Route, Router } from "react-router-dom";
import { cache } from "swr";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { click, runWithAndWithoutOrganizationPrefix } from "../testUtils";
import { resetAxiosMocks } from "../__mocks__/axiosMock";
import OrganizationInfo from "./OrganizationInfo";
import {
  checkStep3FieldValues,
  fillStep3MandatoryFields,
  fillStep3NonMandatoryFields,
} from "./testUtils";

beforeEach(async () => {
  createStore(
    {
      organizationInfo: {
        name: "",
        mailingAddress: "",
        email: "",
        phoneNumber: "",
        contact: "",
      },
    },
    {}
  );
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

describe("Errors on bad formatted input", () => {
  it(`displays an error message and keeps the route when the email address has
  a bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderOrganizationInfo(history);
    const inputEmail = getByLabelText("E-mail");
    fireEvent.change(inputEmail, { target: { value: "mail@domain" } });
    const submitNext = getByText("Step 4: Summary");
    await click(submitNext);
    expect(getByText("The e-mail format is invalid")).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
    const submitPrevious = getByText("Step 2: Your problem");
    await click(submitPrevious);
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the phone number has
  a bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderOrganizationInfo(history);
    const inputPhone = getByLabelText("Phone number");
    fireEvent.change(inputPhone, { target: { value: "321" } });
    const submitNext = getByText("Step 4: Summary");
    await click(submitNext);
    expect(getByText("The phone number format is invalid")).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
    const submitPrevious = getByText("Step 2: Your problem");
    await click(submitPrevious);
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Route correctly on previous / next step navigation buttons", () => {
  it(`routes to the correct path when click on next step button`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText } = renderOrganizationInfo(
          history,
          generatedPaths,
          paths
        );
        const submit = getByText("Step 4: Summary");
        await click(submit);
        expect(history.location.pathname).toEqual(generatedPaths.RECAP);
      }
    );
  });

  it(`routes to the correct path when click on previous step button`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const { getByText } = renderOrganizationInfo(
          history,
          generatedPaths,
          paths
        );
        const submit = getByText("Step 2: Your problem");
        await click(submit);
        expect(history.location.pathname).toEqual(
          generatedPaths.PROBLEM_DESCRIPTION
        );
      }
    );
  });
});

describe("Saves data", () => {
  it(`saves entered data after successful click on next step, and redisplays it
  when the component is recreated`, async () => {
    const app = renderOrganizationInfo();
    fillStep3MandatoryFields(app);
    fillStep3NonMandatoryFields(app);
    const next = app.getByText("Step 4: Summary");
    await click(next);
    app.unmount();
    checkStep3FieldValues(renderOrganizationInfo());
  });

  it(`saves entered data after successful click on previous step, and redisplays it
  when the component is recreated`, async () => {
    const app = renderOrganizationInfo();
    fillStep3MandatoryFields(app);
    fillStep3NonMandatoryFields(app);
    const previous = app.getByText("Step 2: Your problem");
    await click(previous);
    app.unmount();
    checkStep3FieldValues(renderOrganizationInfo());
  });
});

function renderOrganizationInfo(
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
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <StateMachineProvider>
            <OrganizationInfo
              activeStep={2}
              setStepCompleted={() => null}
              completed={completed}
              shouldTriggerFocus={false}
              setShouldTriggerFocus={() => null}
            />
          </StateMachineProvider>
        </Route>
      </Router>
    </I18nProvider>
  );
}

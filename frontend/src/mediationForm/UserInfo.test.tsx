import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { createStore, StateMachineProvider } from "little-state-machine";
import * as reactDeviceDetect from "react-device-detect";
import { Route, Router } from "react-router-dom";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { click, runWithAndWithoutOrganizationPrefix } from "../testUtils";
import {
  checkStep1FieldValues,
  fillStep1MandatoryFields,
  fillStep1NonMandatoryFields,
} from "./testUtils";
import UserInfo from "./UserInfo";

initLanguagesForTesting();

beforeEach(() => {
  createStore({
    userInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      assistiveTechnologyUsed: "",
      technologyName: "",
      technologyVersion: "",
    },
  });
  (reactDeviceDetect.isBrowser as boolean) = true;
});

describe("Errors on mandatory fields", () => {
  it(`displays an error message and keeps the route when the firstname is
  missing`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderUserInfo(history);
    fillStep1MandatoryFields(getByLabelText, "firstName");
    const submit = getByText("Step 2: Your problem");
    await click(submit);
    const error = getByText(/The first name .* is required/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the email address is
  missing`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderUserInfo(history);
    fillStep1MandatoryFields(getByLabelText, "email");
    const submit = getByText("Step 2: Your problem");
    await click(submit);
    const error = getByText(/The e-mail is required/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Errors on bad formatted input", () => {
  it(`displays an error message and keeps the route when the email address has a
  bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderUserInfo(history);
    fillStep1MandatoryFields(getByLabelText, "email");
    const inputEmail = getByLabelText(/E-mail/);
    fireEvent.change(inputEmail, {
      target: { value: "bluebill@koena" },
    });
    const submit = getByText("Step 2: Your problem");
    await click(submit);
    const error = getByText(/The e-mail must be formated like this/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the phone number has a
  bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const { getByText, getByLabelText } = renderUserInfo(history);
    fillStep1MandatoryFields(getByLabelText);
    const inputPhone = getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = getByText("Step 2: Your problem");
    await click(submit);
    const error = getByText(/The phone number format/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on next", async () => {
    const { getByText, getByLabelText } = renderUserInfo();
    fillStep1MandatoryFields(getByLabelText, "firstName");
    const inputPhone = getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = getByText("Step 2: Your problem");
    await click(submit);
    expect(getByLabelText(/First name/)).toHaveFocus();
  });

  it("gives focus to the first error when click another tab", async () => {
    const { getByRole, getByLabelText } = renderUserInfo();
    fillStep1MandatoryFields(getByLabelText, "email");
    const inputPhone = getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = getByRole("tab", { name: /Your problem/ });
    await click(submit);
    expect(getByLabelText(/E-mail/)).toHaveFocus();
  });

  it(`displays a helper text for the assistive technology used field only when on
  desktop`, async () => {
    (reactDeviceDetect.isBrowser as boolean) = true;
    const desktopVersion = renderUserInfo();
    let helperText = desktopVersion.getByText(/To select several technologies/);
    expect(helperText).toBeInTheDocument();
    cleanup();
    (reactDeviceDetect.isBrowser as boolean) = false;
    const mobileVersion = renderUserInfo();
    helperText = mobileVersion.queryByText(/To select several technologies/);
    expect(helperText).not.toBeInTheDocument();
  });
});

describe("Route correctly on previous / next step navigation buttons", () => {
  it("routes to the correct path when click on next step button", async () => {
    await runWithAndWithoutOrganizationPrefix(async (generatedPaths, paths) => {
      const history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
      const { getByText, getByLabelText } = renderUserInfo(
        history,
        generatedPaths,
        paths
      );
      fillStep1MandatoryFields(getByLabelText);
      const submit = getByText("Step 2: Your problem");
      await click(submit);
      expect(history.location.pathname).toEqual(
        generatedPaths.PROBLEM_DESCRIPTION
      );
    });
  });
});

describe("Saves data", () => {
  it(`saves entered data after successful click on next step, and redisplays it
  when the component is recreated`, async () => {
    const { getByText, getByLabelText, unmount } = renderUserInfo();
    fillStep1MandatoryFields(getByLabelText);
    fillStep1NonMandatoryFields(getByLabelText);
    const next = getByText("Step 2: Your problem");
    await click(next);
    unmount();
    checkStep1FieldValues(renderUserInfo().getByLabelText);
  });
});

function renderUserInfo(history?: any, generatedPaths?: any, paths?: any) {
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
            <UserInfo
              activeStep={0}
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

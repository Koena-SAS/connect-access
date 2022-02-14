import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { createStore, StateMachineProvider } from "little-state-machine";
import * as reactDeviceDetect from "react-device-detect";
import { Route, Router } from "react-router-dom";
import { cache } from "swr";
import type { Paths } from "../constants/paths";
import { PATHS, PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { click, runWithAndWithoutOrganizationPrefix } from "../testUtils";
import { resetAxiosMocks } from "../__mocks__/axiosMock";
import {
  checkStep1FieldValues,
  fillStep1MandatoryFields,
  fillStep1NonMandatoryFields,
} from "./testUtils";
import UserInfo from "./UserInfo";

beforeEach(async () => {
  createStore(
    {
      userInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        assistiveTechnologiesUsed: {
          isUsed: "",
          technologies: [],
        },
      },
    },
    {}
  );
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
  (reactDeviceDetect.isBrowser as boolean) = true;
});

describe("Display field blocks", () => {
  it(`displays only the block about wether assistive technologies are used at
  the beginning`, () => {
    const { getByText, queryByText } = renderUserInfo();
    expect(getByText("Do you use assistive technologies?")).toBeInTheDocument();
    expect(queryByText("Assistive technologies used")).not.toBeInTheDocument();
    expect(
      queryByText("Assistive technology name(s) and version(s)")
    ).not.toBeInTheDocument();
  });

  it(`displays only the block about wether assistive technologies are used and
  the block about what type of assistive technologies, if "Yes" has been
  selected `, async () => {
    const { getByText, queryByText, getByLabelText } = renderUserInfo();
    await click(
      within(
        getByLabelText(/Do you use assistive technologies?/)
      ).getByLabelText("Yes")
    );
    expect(getByText("Do you use assistive technologies?")).toBeInTheDocument();
    expect(getByText("Assistive technologies used")).toBeInTheDocument();
    expect(
      queryByText("Assistive technology name(s) and version(s)")
    ).not.toBeInTheDocument();
  });

  it(`displays all the 3 blocks if "Yes" has been selected in the first, and at
  least one technology type has been checked in the second`, async () => {
    const { getByText, getByLabelText } = renderUserInfo();
    await click(
      within(
        getByLabelText("Do you use assistive technologies?")
      ).getByLabelText("Yes")
    );
    await click(
      within(getByLabelText("Assistive technologies used")).getByLabelText(
        "Braille display"
      )
    );
    expect(getByText("Do you use assistive technologies?")).toBeInTheDocument();
    expect(getByText("Assistive technologies used")).toBeInTheDocument();
    expect(
      getByText("Assistive technology name(s) and version(s)")
    ).toBeInTheDocument();
  });

  it(`displays one fieldset in the 3rd block, for each selected technology type
  in the second block`, async () => {
    const app = renderUserInfo();
    await click(
      within(
        app.getByLabelText(/Do you use assistive technologies?/)
      ).getByLabelText("Yes")
    );

    await clickLabelInSecondBlock(app, "Braille display");
    checkDisplayedInThirdBlock(app, [
      { label: "Braille display", isDisplayed: true },
      { label: "Keyboard", isDisplayed: false },
      { label: "Zoom software", isDisplayed: false },
    ]);

    await clickLabelInSecondBlock(app, "Keyboard");
    checkDisplayedInThirdBlock(app, [
      { label: "Braille display", isDisplayed: true },
      { label: "Keyboard", isDisplayed: true },
      { label: "Zoom software", isDisplayed: false },
    ]);

    await clickLabelInSecondBlock(app, "Zoom software");
    checkDisplayedInThirdBlock(app, [
      { label: "Braille display", isDisplayed: true },
      { label: "Keyboard", isDisplayed: true },
      { label: "Zoom software", isDisplayed: true },
    ]);
  });

  async function clickLabelInSecondBlock(app: RenderResult, label: string) {
    await click(
      within(app.getByLabelText("Assistive technologies used")).getByLabelText(
        label
      )
    );
  }

  function checkDisplayedInThirdBlock(
    app: RenderResult,
    areLabelsDisplayed: { label: string; isDisplayed: boolean }[]
  ) {
    areLabelsDisplayed.forEach((labelDisplayed) => {
      if (labelDisplayed.isDisplayed) {
        expect(
          within(
            app.getByLabelText("Assistive technology name(s) and version(s)")
          ).getByRole("group", { name: labelDisplayed.label })
        ).toBeInTheDocument();
      } else {
        expect(
          within(
            app.getByLabelText("Assistive technology name(s) and version(s)")
          ).queryByRole("group", { name: labelDisplayed.label })
        ).not.toBeInTheDocument();
      }
    });
  }
});

describe("Errors on mandatory fields", () => {
  it(`displays an error message and keeps the route when the firstname is
  missing`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const app = renderUserInfo(history);
    fillStep1MandatoryFields(app, "firstName");
    const submit = app.getByText("Step 2: Your problem");
    await click(submit);
    const error = app.getByText(/The first name .* is required/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the email address is
  missing`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const app = renderUserInfo(history);
    fillStep1MandatoryFields(app, "email");
    const submit = app.getByText("Step 2: Your problem");
    await click(submit);
    const error = app.getByText(/The e-mail is required/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Errors on bad formatted input", () => {
  it(`displays an error message and keeps the route when the email address has a
  bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const app = renderUserInfo(history);
    fillStep1MandatoryFields(app, "email");
    const inputEmail = app.getByLabelText(/E-mail/);
    fireEvent.change(inputEmail, {
      target: { value: "bluebill@koena" },
    });
    const submit = app.getByText("Step 2: Your problem");
    await click(submit);
    const error = app.getByText(/The e-mail must be formated like this/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });

  it(`displays an error message and keeps the route when the phone number has a
  bad format`, async () => {
    const history = createMemoryHistory();
    const initialLocation = history.location;
    const app = renderUserInfo(history);
    fillStep1MandatoryFields(app);
    const inputPhone = app.getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = app.getByText("Step 2: Your problem");
    await click(submit);
    const error = app.getByText(/The phone number format/);
    expect(error).toBeInTheDocument();
    expect(history.location).toEqual(initialLocation);
  });
});

describe("Accessibility", () => {
  it("gives focus to the first error when click on next", async () => {
    const app = renderUserInfo();
    fillStep1MandatoryFields(app, "firstName");
    const inputPhone = app.getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = app.getByText("Step 2: Your problem");
    await click(submit);
    expect(app.getByLabelText(/First name/)).toHaveFocus();
  });

  it("gives focus to the first error when clicking on another tab", async () => {
    const app = renderUserInfo();
    fillStep1MandatoryFields(app, "email");
    const inputPhone = app.getByLabelText(/Phone number/);
    fireEvent.change(inputPhone, {
      target: { value: "333" },
    });
    const submit = app.getByRole("tab", { name: /Your problem/ });
    await click(submit);
    expect(app.getByLabelText(/E-mail/)).toHaveFocus();
  });

  it("displays the technology types sorted by alphabetical order", async () => {
    const { getByLabelText } = renderUserInfo();
    await click(
      within(
        getByLabelText(/Do you use assistive technologies?/)
      ).getByLabelText("Yes")
    );
    const technologyTypeLabels = getByLabelText(
      "Assistive technologies used"
    ).querySelectorAll("label");
    expect(technologyTypeLabels[0]).toHaveTextContent(
      "Adapted navigation dispositive"
    );
    expect(technologyTypeLabels[1]).toHaveTextContent("Braille display");
    expect(technologyTypeLabels[2]).toHaveTextContent("DYS Disorder software");
  });
});

describe("Route correctly on previous/next step navigation buttons", () => {
  it("routes to the correct path when click on next step button", async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory({
          initialEntries: [generatedPaths.ROOT],
        });
        const app = renderUserInfo(history, generatedPaths, paths);
        fillStep1MandatoryFields(app);
        const submit = app.getByText("Step 2: Your problem");
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
    const app = renderUserInfo();
    fillStep1MandatoryFields(app);
    await fillStep1NonMandatoryFields(app);
    const next = app.getByText("Step 2: Your problem");
    await click(next);
    app.unmount();
    checkStep1FieldValues(renderUserInfo());
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

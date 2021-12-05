import type { RenderResult } from "@testing-library/react";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useStateMachine } from "little-state-machine";
import { useEffect } from "react";
import { click } from "../testUtils";
import type { Step } from "./StepsInitializer";
import { resetState } from "./updateAction";

/**
 * Util function to fill the mandatory fields for step 1 "About you"
 * @param getByLabelText
 * @param exceptThisOne missing field
 */
export function fillStep1MandatoryFields(
  app: RenderResult,
  exceptThisOne: string = ""
) {
  if (exceptThisOne !== "firstName") {
    fireEvent.change(app.getByLabelText(/First name/), {
      target: { value: "Bill" },
    });
  }
  if (exceptThisOne !== "email") {
    fireEvent.change(app.getByLabelText(/E-mail/), {
      target: { value: "bluebill@koena.net" },
    });
  }
}

/**
 * Util function to fill the optional fields for step 1 "About you"
 * @param { Function } getByLabelText
 */
export function fillStep1NonMandatoryFields(app: RenderResult) {
  fireEvent.change(app.getByLabelText(/Last name/), {
    target: { value: "Blue" },
  });
  fireEvent.change(app.getByLabelText("Phone number"), {
    target: { value: "01234567890" },
  });
  userEvent.selectOptions(app.getByLabelText(/Assistive technologies used/), [
    "BRAILLE_DISPLAY",
    "KEYBOARD",
  ]);
  fireEvent.change(app.getByLabelText("Assistive technology name(s)"), {
    target: { value: "Fictive technology" },
  });
  fireEvent.change(app.getByLabelText("Assistive technology version(s)"), {
    target: { value: "3.5.2" },
  });
}

/**
 * Util function to check the values of the fields for step 1 "About you"
 * @param { Function } getByLabelText
 */
export function checkStep1FieldValues(app: RenderResult) {
  expect((app.getByLabelText(/First name/) as HTMLInputElement).value).toBe(
    "Bill"
  );
  expect((app.getByLabelText(/Last name/) as HTMLInputElement).value).toBe(
    "Blue"
  );
  expect((app.getByLabelText(/E-mail/) as HTMLInputElement).value).toBe(
    "bluebill@koena.net"
  );
  expect((app.getByLabelText("Phone number") as HTMLInputElement).value).toBe(
    "01234567890"
  );
  const keyboard = screen.getByRole("option", {
    name: "Keyboard",
  }) as HTMLOptionElement;
  expect(keyboard.selected).toBe(true);
  const screenReader = screen.getByRole("option", {
    name: "Screen reader with vocal synthesis",
  }) as HTMLOptionElement;
  expect(screenReader.selected).toBe(false);
  const brailleDisplay = screen.getByRole("option", {
    name: "Braille display",
  }) as HTMLOptionElement;
  expect(brailleDisplay.selected).toBe(true);
  const zoomSoftware = screen.getByRole("option", {
    name: "Zoom software",
  }) as HTMLOptionElement;
  expect(zoomSoftware.selected).toBe(false);
  expect(
    (app.getByLabelText("Assistive technology name(s)") as HTMLInputElement)
      .value
  ).toBe("Fictive technology");
  expect(
    (app.getByLabelText("Assistive technology version(s)") as HTMLInputElement)
      .value
  ).toBe("3.5.2");
}

/**
 * Util function to fill the mandatory fields for step 2 "Your problem"
 * @param { function } getByLabelText
 * @param { String } exceptThisOne missing field
 */
export function fillStep2MandatoryFields(
  app: RenderResult,
  exceptThisOne = ""
) {
  if (exceptThisOne !== "issueDescription") {
    fireEvent.change(app.getByLabelText(/What was the issue?/), {
      target: { value: "Description of the issue" },
    });
  }
}

/**
 * Util function to fill the optional fields for step 2 "Your problem"
 * @param { Function } getByLabelText
 * @param { Object } conditionalFields object with keys corresponding
 *   to conditional field names and boolean values indicating if the
 *   field is activated or not.
 */
export async function fillStep2NonMandatoryFields(
  app: RenderResult,
  conditionalFields = {
    browserUsed: true,
    mobileAppUsed: true,
    didTellOrganization: true,
    didOrganizationReply: true,
  }
) {
  const {
    browserUsed,
    mobileAppUsed,
    didTellOrganization,
    didOrganizationReply,
  } = conditionalFields;
  fireEvent.change(app.getByLabelText(/Describe every step you did/), {
    target: { value: "Description of the step" },
  });
  await click(
    within(app.getByLabelText(/Is your problem urgent?/)).getByLabelText(
      "Yes, very urgent: need a quick answer"
    )
  );
  await click(
    within(
      app.getByLabelText(/What was the level of inaccessibility/)
    ).getByLabelText("Impossible access")
  );
  const browserUsedValue = browserUsed ? "Yes" : "No";
  await click(
    within(
      app.getByLabelText(/Did the problem occur while using a web browser?/)
    ).getByLabelText(browserUsedValue)
  );
  if (browserUsed) {
    await fillBrowserRelatedFields(app);
  } else {
    await fillMobileRelatedFields(app, mobileAppUsed);
  }
  await fillOrganizationReplyRelatedFields(
    app,
    didTellOrganization,
    didOrganizationReply
  );
  fireEvent.change(app.getByLabelText(/Anything else about your problem?/), {
    target: { value: "Nothing to add" },
  });
  const file = new File(["(⌐□_□)"], "Failure.png", {
    type: "image/png",
  });
  const attachedFile = app.getByLabelText(/Do not hesitate to upload/);
  fireEvent.change(attachedFile, {
    target: { files: [file] },
  });
}

async function fillBrowserRelatedFields(app: RenderResult) {
  fireEvent.change(app.getByLabelText(/What is the URL address where/), {
    target: { value: "http://koena.net" },
  });
  await click(
    within(app.getByLabelText(/Which web browser did you use?/)).getByLabelText(
      "Firefox"
    )
  );
  fireEvent.change(app.getByLabelText(/Which web browser version/), {
    target: { value: "58" },
  });
}

async function fillMobileRelatedFields(
  app: RenderResult,
  mobileAppUsed: boolean
) {
  const mobileAppUsedValue = mobileAppUsed ? "Yes" : "No";
  await click(
    within(app.getByLabelText(/Was it a mobile app?/)).getByLabelText(
      mobileAppUsedValue
    )
  );
  if (mobileAppUsed) {
    fireEvent.change(app.getByLabelText(/What kind of app/), {
      target: { value: "ANDROID" },
    });
    fireEvent.change(app.getByLabelText(/What was the name of the app?/), {
      target: { value: "Super app" },
    });
  } else {
    fireEvent.change(app.getByLabelText(/Which software, connected object/), {
      target: { value: "Connected object" },
    });
  }
}

async function fillOrganizationReplyRelatedFields(
  app: RenderResult,
  didTellOrganization: boolean,
  didOrganizationReply: boolean
) {
  const didTellOrganizationValue = didTellOrganization ? "Yes" : "No";
  await click(
    within(
      app.getByLabelText(/Did you already tell the organization/)
    ).getByLabelText(didTellOrganizationValue)
  );
  if (didTellOrganization) {
    const didOrganizationReplyValue = didOrganizationReply ? "Yes" : "No";
    await click(
      within(app.getByLabelText(/Did they reply?/)).getByLabelText(
        didOrganizationReplyValue
      )
    );
    if (didOrganizationReply) {
      fireEvent.change(app.getByLabelText(/What was their reply?/), {
        target: { value: "No reply" },
      });
    }
  }
}

/**
 * Util function to check the values of the fields for step 2 "Your problem"
 * @param { Function } getByLabelText
 * @param { Object } conditionalFields object with keys corresponding
 *   to conditional field names and boolean values indicating if the
 *   field is activated or not.
 */
export async function checkStep2FieldValues(
  app: RenderResult,
  conditionalFields = {
    browserUsed: true,
    mobileAppUsed: true,
    didTellOrganization: true,
    didOrganizationReply: true,
  }
) {
  const {
    browserUsed,
    mobileAppUsed,
    didTellOrganization,
    didOrganizationReply,
  } = conditionalFields;
  expect(
    within(app.getByLabelText(/Is your problem urgent?/)).getByLabelText(
      "Yes, very urgent: need a quick answer"
    )
  ).toBeChecked();
  expect(
    (app.getByLabelText(/Describe every step you did/) as HTMLInputElement)
      .value
  ).toBe("Description of the step");
  expect(
    (app.getByLabelText(/What was the issue?/) as HTMLInputElement).value
  ).toBe("Description of the issue");
  expect(
    within(
      app.getByLabelText(/What was the level of inaccessibility/)
    ).getByLabelText("Impossible access")
  ).toBeChecked();
  const browserUsedValue = browserUsed ? "Yes" : "No";
  expect(
    within(
      app.getByLabelText(/Did the problem occur while using a web browser?/)
    ).getByLabelText(browserUsedValue)
  ).toBeChecked();
  if (browserUsed) {
    checkBrowserRelatedFields(app);
  } else {
    await checkMobileRelatedFields(app, mobileAppUsed);
  }
  checkOrganizationReplyRelatedFields(
    app,
    didTellOrganization,
    didOrganizationReply
  );
  expect(
    (
      app.getByLabelText(
        /Anything else about your problem?/
      ) as HTMLInputElement
    ).value
  ).toBe("Nothing to add");
  /* TODO: find a way to test attached file input value
  expect(app.getByLabelText(/Do not hesitate to upload/).files[0].name).toBe(
    "Failure.png"
  );*/
}

function checkBrowserRelatedFields(app: RenderResult) {
  expect(
    within(app.getByLabelText(/Which web browser did you use?/)).getByLabelText(
      "Firefox"
    )
  ).toBeChecked();
  expect(
    (app.getByLabelText(/What is the URL address where/) as HTMLInputElement)
      .value
  ).toBe("http://koena.net");
  expect(
    (app.getByLabelText(/Which web browser version/) as HTMLInputElement).value
  ).toBe("58");
}

async function checkMobileRelatedFields(
  app: RenderResult,
  mobileAppUsed: boolean
) {
  const mobileAppUsedValue = mobileAppUsed ? "Yes" : "No";
  await click(
    within(app.getByLabelText(/Was it a mobile app?/)).getByLabelText(
      mobileAppUsedValue
    )
  );
  if (mobileAppUsed) {
    expect(
      (app.getByLabelText(/What kind of app/) as HTMLInputElement).value
    ).toBe("ANDROID");
    expect(
      (app.getByLabelText(/What was the name of the app?/) as HTMLInputElement)
        .value
    ).toBe("Super app");
  } else {
    expect(
      (
        app.getByLabelText(
          /Which software, connected object/
        ) as HTMLInputElement
      ).value
    ).toBe("Connected object");
  }
}

function checkOrganizationReplyRelatedFields(
  app: RenderResult,
  didTellOrganization: boolean,
  didOrganizationReply: boolean
) {
  const didTellOrganizationValue = didTellOrganization ? "Yes" : "No";
  expect(
    within(
      app.getByLabelText(/Did you already tell the organization/)
    ).getByLabelText(didTellOrganizationValue)
  ).toBeChecked();
  if (didTellOrganization) {
    const didOrganizationReplyValue = didOrganizationReply ? "Yes" : "No";
    expect(
      within(app.getByLabelText(/Did they reply?/)).getByLabelText(
        didOrganizationReplyValue
      )
    ).toBeChecked();
    if (didOrganizationReply) {
      expect(
        (app.getByLabelText(/What was their reply?/) as HTMLInputElement).value
      ).toBe("No reply");
    }
  }
}

/**
 * Util function to fill the mandatory fields for step 3 "The organization"
 * @param { Function } getByLabelText
 * @param { String } exceptThisOne missing field
 */
export function fillStep3MandatoryFields(
  app: RenderResult,
  exceptThisOne = ""
) {}

/**
 * Util function to fill the optional fields for step 3 "The organization"
 * @param { Function } getByLabelText
 */
export function fillStep3NonMandatoryFields(app: RenderResult) {
  fireEvent.change(app.getByLabelText(/Name of the organization/), {
    target: { value: "Koena" },
  });
  fireEvent.change(app.getByLabelText(/Mailing address/), {
    target: { value: "2, esplanade de la Gare" },
  });
  fireEvent.change(app.getByLabelText(/E-mail/), {
    target: { value: "aloha@koena.net" },
  });
  fireEvent.change(app.getByLabelText(/Phone number/), {
    target: { value: "0972632128" },
  });
  fireEvent.change(app.getByLabelText(/Contact/), {
    target: { value: "Armony" },
  });
}

/**
 * Util function to check the values of the fields for step 3 "The organization"
 * @param { Function } getByLabelText
 */
export function checkStep3FieldValues(app: RenderResult) {
  expect(
    (app.getByLabelText(/Name of the organization/) as HTMLInputElement).value
  ).toBe("Koena");
  expect(
    (app.getByLabelText(/Mailing address/) as HTMLInputElement).value
  ).toBe("2, esplanade de la Gare");
  expect((app.getByLabelText(/E-mail/) as HTMLInputElement).value).toBe(
    "aloha@koena.net"
  );
  expect((app.getByLabelText(/Phone number/) as HTMLInputElement).value).toBe(
    "0972632128"
  );
  expect((app.getByLabelText(/Contact/) as HTMLInputElement).value).toBe(
    "Armony"
  );
}

export function ResetLittleStateMachine(): null {
  const { actions } = useStateMachine({ resetState });
  useEffect(() => {
    actions.resetState(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/**
 * Unlocks mediation form steps by filling only mandatory fields.
 * @param {function} getByLabelText the function returned by React
 *    Testing Library.
 * @param {function} getByText the function returned by React
 *    Testing Library.
 * @param {number} untilStep the highest step to unlock (1, 2 or 3).
 * @param {number} withOrganizationPage wether there is the
 *    organization page prefix in the path.
 */
export async function unlockStep(
  app: RenderResult,
  untilStep: Step,
  withOrganizationPage = false
) {
  if (untilStep > 0) {
    fillStep1MandatoryFields(app);
    await click(app.getByText("Step 2: Your problem"));
  }
  if (untilStep > 1) {
    fillStep2MandatoryFields(app);
    if (withOrganizationPage) {
      await click(app.getByText("Step 3: Summary"));
    } else {
      await click(app.getByText("Step 3: The organization"));
    }
  }
  if (untilStep > 2 && !withOrganizationPage) {
    fillStep3MandatoryFields(app);
    await click(app.getByText("Step 4: Summary"));
  }
}

import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useStateMachine } from "little-state-machine";
import { useEffect } from "react";
import { click } from "../testUtils";
import { resetState } from "./updateAction";

/**
 * Util function to fill the mandatory fields for step 1 "About you"
 * @param { Function } getByLabelText
 * @param { String } exceptThisOne missing field
 */
export function fillStep1MandatoryFields(getByLabelText, exceptThisOne = "") {
  if (exceptThisOne !== "firstName") {
    fireEvent.change(getByLabelText(/First name/), {
      target: { value: "Bill" },
    });
  }
  if (exceptThisOne !== "email") {
    fireEvent.change(getByLabelText(/E-mail/), {
      target: { value: "bluebill@koena.net" },
    });
  }
}

/**
 * Util function to fill the optional fields for step 1 "About you"
 * @param { Function } getByLabelText
 */
export function fillStep1NonMandatoryFields(getByLabelText) {
  fireEvent.change(getByLabelText(/Last name/), {
    target: { value: "Blue" },
  });
  fireEvent.change(getByLabelText("Phone number"), {
    target: { value: "01234567890" },
  });
  userEvent.selectOptions(getByLabelText(/Assistive technologies used/), [
    "BRAILLE_DISPLAY",
    "KEYBOARD",
  ]);
  fireEvent.change(getByLabelText("Assistive technology name(s)"), {
    target: { value: "Fictive technology" },
  });
  fireEvent.change(getByLabelText("Assistive technology version(s)"), {
    target: { value: "3.5.2" },
  });
}

/**
 * Util function to check the values of the fields for step 1 "About you"
 * @param { Function } getByLabelText
 */
export function checkStep1FieldValues(getByLabelText) {
  expect(getByLabelText(/First name/).value).toBe("Bill");
  expect(getByLabelText(/Last name/).value).toBe("Blue");
  expect(getByLabelText(/E-mail/).value).toBe("bluebill@koena.net");
  expect(getByLabelText("Phone number").value).toBe("01234567890");
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
  expect(getByLabelText("Assistive technology name(s)").value).toBe(
    "Fictive technology"
  );
  expect(getByLabelText("Assistive technology version(s)").value).toBe("3.5.2");
}

/**
 * Util function to fill the mandatory fields for step 2 "Your problem"
 * @param { function } getByLabelText
 * @param { String } exceptThisOne missing field
 */
export function fillStep2MandatoryFields(getByLabelText, exceptThisOne = "") {
  if (exceptThisOne !== "issueDescription") {
    fireEvent.change(getByLabelText(/What was the issue?/), {
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
  getByLabelText,
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
  fireEvent.change(getByLabelText(/Describe every step you did/), {
    target: { value: "Description of the step" },
  });
  await click(
    within(getByLabelText(/Is your problem urgent?/)).getByLabelText(
      "Yes, very urgent: need a quick answer"
    )
  );
  await click(
    within(
      getByLabelText(/What was the level of inaccessibility/)
    ).getByLabelText("Impossible access")
  );
  const browserUsedValue = browserUsed ? "Yes" : "No";
  await click(
    within(
      getByLabelText(/Did the problem occur while using a web browser?/)
    ).getByLabelText(browserUsedValue)
  );
  if (browserUsed) {
    await fillBrowserRelatedFields(getByLabelText);
  } else {
    await fillMobileRelatedFields(getByLabelText, mobileAppUsed);
  }
  await fillOrganizationReplyRelatedFields(
    getByLabelText,
    didTellOrganization,
    didOrganizationReply
  );
  fireEvent.change(getByLabelText(/Anything else about your problem?/), {
    target: { value: "Nothing to add" },
  });
  const file = new File(["(⌐□_□)"], "Failure.png", {
    type: "image/png",
  });
  const attachedFile = getByLabelText(/Do not hesitate to upload/);
  fireEvent.change(attachedFile, {
    target: { files: [file] },
  });
}

async function fillBrowserRelatedFields(getByLabelText) {
  fireEvent.change(getByLabelText(/What is the URL address where/), {
    target: { value: "http://koena.net" },
  });
  await click(
    within(getByLabelText(/Which web browser did you use?/)).getByLabelText(
      "Firefox"
    )
  );
  fireEvent.change(getByLabelText(/Which web browser version/), {
    target: { value: "58" },
  });
}

async function fillMobileRelatedFields(getByLabelText, mobileAppUsed) {
  const mobileAppUsedValue = mobileAppUsed ? "Yes" : "No";
  await click(
    within(getByLabelText(/Was it a mobile app?/)).getByLabelText(
      mobileAppUsedValue
    )
  );
  if (mobileAppUsed) {
    fireEvent.change(getByLabelText(/What kind of app/), {
      target: { value: "ANDROID" },
    });
    fireEvent.change(getByLabelText(/What was the name of the app?/), {
      target: { value: "Super app" },
    });
  } else {
    fireEvent.change(getByLabelText(/Which software, connected object/), {
      target: { value: "Connected object" },
    });
  }
}

async function fillOrganizationReplyRelatedFields(
  getByLabelText,
  didTellOrganization,
  didOrganizationReply
) {
  const didTellOrganizationValue = didTellOrganization ? "Yes" : "No";
  await click(
    within(
      getByLabelText(/Did you already tell the organization/)
    ).getByLabelText(didTellOrganizationValue)
  );
  if (didTellOrganization) {
    const didOrganizationReplyValue = didOrganizationReply ? "Yes" : "No";
    await click(
      within(getByLabelText(/Did they reply?/)).getByLabelText(
        didOrganizationReplyValue
      )
    );
    if (didOrganizationReply) {
      fireEvent.change(getByLabelText(/What was their reply?/), {
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
  getByLabelText,
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
    within(getByLabelText(/Is your problem urgent?/)).getByLabelText(
      "Yes, very urgent: need a quick answer"
    )
  ).toBeChecked();
  expect(getByLabelText(/Describe every step you did/).value).toBe(
    "Description of the step"
  );
  expect(getByLabelText(/What was the issue?/).value).toBe(
    "Description of the issue"
  );
  expect(
    within(
      getByLabelText(/What was the level of inaccessibility/)
    ).getByLabelText("Impossible access")
  ).toBeChecked();
  const browserUsedValue = browserUsed ? "Yes" : "No";
  expect(
    within(
      getByLabelText(/Did the problem occur while using a web browser?/)
    ).getByLabelText(browserUsedValue)
  ).toBeChecked();
  if (browserUsed) {
    checkBrowserRelatedFields(getByLabelText);
  } else {
    await checkMobileRelatedFields(getByLabelText, mobileAppUsed);
  }
  checkOrganizationReplyRelatedFields(
    getByLabelText,
    didTellOrganization,
    didOrganizationReply
  );
  expect(getByLabelText(/Anything else about your problem?/).value).toBe(
    "Nothing to add"
  );
  /* TODO: find a way to test attached file input value
  expect(getByLabelText(/Do not hesitate to upload/).files[0].name).toBe(
    "Failure.png"
  );*/
}

function checkBrowserRelatedFields(getByLabelText) {
  expect(
    within(getByLabelText(/Which web browser did you use?/)).getByLabelText(
      "Firefox"
    )
  ).toBeChecked();
  expect(getByLabelText(/What is the URL address where/).value).toBe(
    "http://koena.net"
  );
  expect(getByLabelText(/Which web browser version/).value).toBe("58");
}

async function checkMobileRelatedFields(getByLabelText, mobileAppUsed) {
  const mobileAppUsedValue = mobileAppUsed ? "Yes" : "No";
  await click(
    within(getByLabelText(/Was it a mobile app?/)).getByLabelText(
      mobileAppUsedValue
    )
  );
  if (mobileAppUsed) {
    expect(getByLabelText(/What kind of app/).value).toBe("ANDROID");
    expect(getByLabelText(/What was the name of the app?/).value).toBe(
      "Super app"
    );
  } else {
    expect(getByLabelText(/Which software, connected object/).value).toBe(
      "Connected object"
    );
  }
}

function checkOrganizationReplyRelatedFields(
  getByLabelText,
  didTellOrganization,
  didOrganizationReply
) {
  const didTellOrganizationValue = didTellOrganization ? "Yes" : "No";
  expect(
    within(
      getByLabelText(/Did you already tell the organization/)
    ).getByLabelText(didTellOrganizationValue)
  ).toBeChecked();
  if (didTellOrganization) {
    const didOrganizationReplyValue = didOrganizationReply ? "Yes" : "No";
    expect(
      within(getByLabelText(/Did they reply?/)).getByLabelText(
        didOrganizationReplyValue
      )
    ).toBeChecked();
    if (didOrganizationReply) {
      expect(getByLabelText(/What was their reply?/).value).toBe("No reply");
    }
  }
}

/**
 * Util function to fill the mandatory fields for step 3 "The organization"
 * @param { Function } getByLabelText
 * @param { String } exceptThisOne missing field
 */
export function fillStep3MandatoryFields(getByLabelText, exceptThisOne = "") {}

/**
 * Util function to fill the optional fields for step 3 "The organization"
 * @param { Function } getByLabelText
 */
export function fillStep3NonMandatoryFields(getByLabelText) {
  fireEvent.change(getByLabelText(/Name of the organization/), {
    target: { value: "Koena" },
  });
  fireEvent.change(getByLabelText(/Mailing address/), {
    target: { value: "2, esplanade de la Gare" },
  });
  fireEvent.change(getByLabelText(/E-mail/), {
    target: { value: "aloha@koena.net" },
  });
  fireEvent.change(getByLabelText(/Phone number/), {
    target: { value: "0972632128" },
  });
  fireEvent.change(getByLabelText(/Contact/), {
    target: { value: "Armony" },
  });
}

/**
 * Util function to check the values of the fields for step 3 "The organization"
 * @param { Function } getByLabelText
 */
export function checkStep3FieldValues(getByLabelText) {
  expect(getByLabelText(/Name of the organization/).value).toBe("Koena");
  expect(getByLabelText(/Mailing address/).value).toBe(
    "2, esplanade de la Gare"
  );
  expect(getByLabelText(/E-mail/).value).toBe("aloha@koena.net");
  expect(getByLabelText(/Phone number/).value).toBe("0972632128");
  expect(getByLabelText(/Contact/).value).toBe("Armony");
}

export function ResetLittleStateMachine() {
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
  getByLabelText,
  getByText,
  untilStep,
  withOrganizationPage = false
) {
  if (untilStep > 0) {
    fillStep1MandatoryFields(getByLabelText);
    await click(getByText("Step 2: Your problem"));
  }
  if (untilStep > 1) {
    fillStep2MandatoryFields(getByLabelText);
    if (withOrganizationPage) {
      await click(getByText("Step 3: Summary"));
    } else {
      await click(getByText("Step 3: The organization"));
    }
  }
  if (untilStep > 2 && !withOrganizationPage) {
    fillStep3MandatoryFields(getByLabelText);
    await click(getByText("Step 4: Summary"));
  }
}

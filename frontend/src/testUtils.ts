import {
  cleanup,
  fireEvent,
  RenderResult,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import produce from "immer";
import { generatePath } from "react-router-dom";
import { cache } from "swr";
import { PATHS, PATHS_WITHOUT_PREFIX } from "./constants/paths";
import type { MediationRequest } from "./types/mediationRequest";
import { ConfigData } from "./types/types";
import { getEntries } from "./types/utilTypes";
import { resetAxiosMocks } from "./__mocks__/axiosMock";

export const mediationRequests: MediationRequest[] = [
  {
    id: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
    creationDate: "2021-02-03T11:41:04.346286+01:00",
    modificationDate: "2021-02-04T11:41:04.346286+01:00",
    requestDate: "2021-02-03T11:41:04.346286+01:00",
    status: "WAITING_MEDIATOR_VALIDATION",
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    phoneNumber: "4444444444",
    assistiveTechnologyUsed: ["VOCAL_COMMAND_SOFTWARE"],
    urgency: "VERY_URGENT",
    issueDescription: "It loads but I don't get all the informaiton",
    stepDescription: "I try to load the page",
    inaccessibilityLevel: "ACCESS_DIFFICULT",
    browserUsed: "YES",
    url: "http://koena.net",
    browser: "OTHER",
    mobileAppUsed: "NO",
    mobileAppPlatform: "",
    mobileAppName: "",
    otherUsedSoftware: "",
    didTellOrganization: "NO",
    organizationName: "Koena",
    organizationAddress: "2, esplanade de la Gare à Sannois 95110",
    organizationEmail: "aloha@koena.net",
    organizationPhoneNumber: "0972632128",
    organizationContact: "Armony",
  },
  {
    id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
    creationDate: "2021-01-08T11:41:04.346286+01:00",
    modificationDate: "2021-01-09T11:41:04.346286+01:00",
    requestDate: "2021-01-08T11:41:04.346286+01:00",
    status: "WAITING_CONTACT",
    applicationData: {
      id: "7c15b8d0-dcb4-4257-9e5b-2bb2e9364558",
      name: "Site",
      organizationName: "Stivo",
      organizationEmail: "stivo@stivo.com",
      organizationPhoneNumber: "4694987987",
      organizationAddress: "1st street",
    },
    firstName: "Bill",
    lastName: "Blue",
    email: "bluebill@koena.net",
    phoneNumber: "5555555555",
    assistiveTechnologyUsed: ["KEYBOARD", "BRAILLE_DISPLAY"],
    technologyName: "Fictive technology",
    technologyVersion: "3.5.2",
    urgency: "NOT_URGENT",
    issueDescription: "It fails to load",
    stepDescription: "I try to load the page",
    inaccessibilityLevel: "IMPOSSIBLE_ACCESS",
    browserUsed: "NO",
    url: "",
    browser: "",
    browserVersion: "",
    mobileAppUsed: "YES",
    mobileAppPlatform: "WINDOWS_PHONE",
    mobileAppName: "Super app",
    otherUsedSoftware: "",
    didTellOrganization: "YES",
    didOrganizationReply: "YES",
    organizationReply: "No reply",
    furtherInfo: "Nothing to add",
    attachedFile: "Failure.png",
  },
];

/**
 * Generates all URLs with arbitrary values and with an organization prefix.
 * @returns object similar to PATHS but with generated values.
 */
export function generatePathsWithPrefix({
  requestId = "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
} = {}) {
  return produce(PATHS, (draftState) => {
    for (const [key, value] of getEntries(draftState)) {
      draftState[key] = generatePath(value, {
        organizationSlug: "koena",
        applicationSlug: "koena-connect",
        uid: "IN",
        token: "z65e44jjlkmyu84e6fjfszqqds2az5szf",
        requestId,
      });
    }
  });
}

/**
 * Generates all URLs with arbitrary values and without organization prefix.
 * @returns object similar to PATHS but with generated values.
 */
export function generatePathsWithoutPrefix({
  requestId = "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
} = {}) {
  return produce(PATHS, (draftState) => {
    for (const [key, value] of getEntries(draftState)) {
      draftState[key] = generatePath(value, {
        organizationSlug: undefined,
        applicationSlug: undefined,
        uid: "IN",
        token: "z65e44jjlkmyu84e6fjfszqqds2az5szf",
        requestId,
      });
    }
  });
}

/**
 * Cleanup the rendered components, the mocks, and reset axios mocks.
 */
export const cleanupData = async () => {
  jest.clearAllMocks();
  resetAxiosMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
  cleanup();
};

/**
 * Run a given test with organization path prefix, and without it, so
 * the test is executed twice.
 * @param {function} test the test function to run, it should take two
 *   parameters: one for the generated paths, and one for the normal
 *   paths with parameter placeholders.
 * @param {function} cleanupFunction additional optional function to
 *   clean specific things between the two test runs.
 */
export const runWithAndWithoutOrganizationPrefix = async (
  test: any,
  cleanupFunction?: () => void,
  cleanupAsyncFunction?: () => Promise<void>
) => {
  await test(generatePathsWithPrefix(), PATHS);
  if (cleanupFunction) cleanupFunction();
  if (cleanupAsyncFunction) await cleanupAsyncFunction();
  await cleanupData();
  await test(generatePathsWithoutPrefix(), PATHS_WITHOUT_PREFIX);
};

/**
 * Fill a field conditionally.
 * @param app render result coming from react testing library.
 * @param fieldLabel the label of the field to fill.
 * @param value the value of the field to fill.
 * @param shouldFill if false we don't do anything.
 */
export function fillField(
  app: RenderResult,
  fieldLabel: string | RegExp,
  value: string,
  shouldFill: boolean = true
) {
  if (shouldFill) {
    const field = app.getByLabelText(fieldLabel);
    fireEvent.change(field, { target: { value: value } });
  }
}

/**
 * Clicks on the given element wrapped in an waitFor().
 */
export async function click(element: Node) {
  await waitFor(() => {
    fireEvent.click(element);
  });
}

export const configData: ConfigData = {
  platformName: "Connect Access",
  logoFilename: "logo.png",
  logoFilenameSmall: "logo_small.png",
} as const;

/**
 * Check that for a given select, the wanted option is selected, and the
 * other ones are not selected.
 * @param optionName the option name that should be selected
 * @param selectLabel the select label name
 */
export function checkOptionIsSelected(
  optionName: string,
  selectLabel: string | RegExp
) {
  const applicationSelect = screen.getAllByLabelText(selectLabel)[0];
  const selectedOption = within(applicationSelect).getByRole("option", {
    name: optionName,
  }) as HTMLOptionElement;
  const regex = new RegExp(`^(?!${optionName}).*$`);
  const otherOptions = within(applicationSelect).getAllByRole("option", {
    name: regex,
  }) as HTMLOptionElement[];

  expect(selectedOption.selected).toBeTruthy();
  otherOptions.forEach((otherOption) =>
    expect(otherOption.selected).toBeFalsy()
  );
}

import { act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import produce from "immer";
import { generatePath } from "react-router-dom";
import { cache } from "swr";
import { PATHS, PATHS_WITHOUT_PREFIX } from "./constants/paths";
import { ConfigData } from "./constants/types";

jest.mock("axios");
export const mockedAxios = axios as jest.Mocked<typeof axios>;

export const mediationRequestsResponse = [
  {
    id: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
    creation_date: "2021-02-03",
    status: "WAITING_MEDIATOR_VALIDATION",
    first_name: "John",
    last_name: "Doe",
    email: "john@doe.com",
    phone_number: "4444444444",
    assistive_technology_used: ["VOCAL_COMMAND_SOFTWARE"],
    urgency: "VERY_URGENT",
    issue_description: "It loads but I don't get all the informaiton",
    step_description: "I try to load the page",
    inaccessibility_level: "ACCESS_DIFFICULT",
    browser_used: "YES",
    url: "http://koena.net",
    browser: "OTHER",
    mobile_app_used: "NO",
    mobile_app_platform: "",
    mobile_app_name: "",
    other_used_software: "",
    did_tell_organization: "NO",
    organization_name: "Koena",
  },
  {
    id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
    creation_date: "2021-01-08",
    status: "WAITING_CONTACT",
    application_data: {
      id: "7c15b8d0-dcb4-4257-9e5b-2bb2e9364558",
      name: "Site",
      organization_name: "Stivo",
      organization_email: "stivo@stivo.com",
      organization_phone_number: "4694987987",
      organization_address: "1st street",
    },
    first_name: "Bill",
    last_name: "Blue",
    email: "bluebill@koena.net",
    phone_number: "5555555555",
    assistive_technology_used: ["KEYBOARD", "BRAILLE_DISPLAY"],
    technology_name: "Fictive technology",
    technology_version: "3.5.2",
    urgency: "NOT_URGENT",
    step_description: "I try to load the page",
    inaccessibility_level: "IMPOSSIBLE_ACCESS",
    issue_description: "It fails to load",
    browser_used: "NO",
    url: "",
    browser: "",
    browser_version: "",
    mobile_app_used: "YES",
    mobile_app_platform: "WINDOWS_PHONE",
    mobile_app_name: "Super app",
    other_used_software: "",
    did_tell_organization: "YES",
    did_organization_reply: "YES",
    organization_reply: "No reply",
    further_info: "Nothing to add",
    attached_file: "Failure.png",
    organization_name: "Koena",
    organization_address: "2, esplanade de la Gare à Sannois 95110",
    organization_email: "aloha@koena.net",
    organization_phone_number: "0972632128",
    organization_contact: "Armony",
  },
];

export const mediationRequests = [
  {
    id: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
    creationDate: "2021-02-03",
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
  },
  {
    id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
    creationDate: "2021-01-08",
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
    organizationName: "Koena",
    organizationAddress: "2, esplanade de la Gare à Sannois 95110",
    organizationEmail: "aloha@koena.net",
    organizationPhoneNumber: "0972632128",
    organizationContact: "Armony",
  },
];

export let axiosPostResponseLogin;
export let axiosPostResponseLogout;
export let axiosPostResponseRegister;
export let axiosPostResponseResetPassword;
export let axiosPostResponseResetPasswordConfirm;
export let axiosGetResponseMe;
export let axiosPutResponseMe;
export let axiosPostResponseMediationRequests;
export let axiosGetResponseMediationRequests;
export let axiosGetResponseOrganizationApp;
export let axiosGetResponseTraceReports;
export let axiosPostResponseTraceReports;
export let axiosPatchResponseTraceReports;

/**
 * Set mocks for axios methods to be as close as possible
 * to the backend, in the unit tests.
 */
export const resetAxiosMocks = () => {
  axiosPostResponseLogin = {
    data: {
      auth_token: "fhzfmhoizeoncmzecnadh",
    },
  };
  axiosPostResponseLogout = { data: {} };
  axiosPostResponseRegister = {
    data: {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone_number: "2463259871",
    },
  };
  axiosGetResponseMe = axiosPostResponseRegister;
  axiosPutResponseMe = axiosGetResponseMe;
  axiosPostResponseMediationRequests = {};
  axiosGetResponseMediationRequests = {
    data: mediationRequestsResponse.slice(),
  };
  axiosGetResponseOrganizationApp = {
    data: {
      id: 1,
      name: { en: "Connect Access", fr: "Connect Access" },
      slug: "koena-connect",
      logo: "/media/app_logo/koena/koena-connect/koena_square.png",
      logo_alternative: {
        en: "Connect Access Logo",
        fr: "Logo de Connect Access",
      },
      description: {
        en: `<h1>Connect Access</h1>
      <p>Connect Access is a mediation platform</p>`,
        fr: `<h1>Connect Access</h1>
      <p>Connect Access est une plateforme de médiation</p>`,
      },
      text_color: "#DDFF3F",
      button_background_color: "#98FFF4",
      border_color: "#FF2CFD",
      button_hover_color: "#90C9FF",
      step_color: "#3F4BFF",
      footer_color: "#000000",
    },
  };
  axiosGetResponseTraceReports = {
    data: [
      {
        id: "abcbd6f0-ae8a-4f66-9eb6-910e4c686774",
        contactDate: "2021-04-03T00:00:00Z",
        traceType: "CALL",
        senderType: "COMPLAINANT",
        senderName: "",
        recipientType: "MEDIATOR",
        recipientName: "John",
        comment: "the call was fine",
        attachedFile: "report.png",
      },
      {
        id: "c82187d3-ba54-408e-ae37-c5a06bcdcc67",
        contactDate: "2021-06-15T00:00:00Z",
        traceType: "OTHER",
        comment: "informal contact",
        attachedFile: "",
      },
    ],
  };
  axiosPostResponseTraceReports = {
    data: {
      id: "83f3046c-4407-43e5-a8bd-5e583dcd8dfa",
      contactDate: "2021-05-03T00:00:00Z",
      traceType: "CALL",
      comment: "call ok",
      attachedFile: "report.png",
    },
  };
  axiosPostResponseResetPassword = { data: "john@doe.com" };
  axiosPostResponseResetPasswordConfirm = {
    data: {
      uid: "MQ",
      token: "6ds468e4g98r4g8trgrt68g4e6v465e",
      new_password: "pass_new",
      re_new_password: "pass_new",
    },
  };
  axiosPatchResponseTraceReports = {
    data: {
      id: "abcbd6f0-ae8a-4f66-9eb6-910e4c686774",
      contactDate: "2021-04-03T00:00:00Z",
      traceType: "CALL",
      comment: "the call not that fine",
      attachedFile: "report.png",
    },
  };
  mockedAxios.post.mockImplementation((url) => {
    if (url === "/auth/token/login/") {
      return Promise.resolve(axiosPostResponseLogin);
    } else if (url === "/auth/token/logout/") {
      return Promise.resolve(axiosPostResponseLogout);
    } else if (url === "/auth/users/") {
      return Promise.resolve(axiosPostResponseRegister);
    } else if (url === "/auth/users/reset_password/") {
      return Promise.resolve(axiosPostResponseResetPassword);
    } else if (url === "/auth/users/reset_password_confirm/") {
      return Promise.resolve(axiosPostResponseResetPasswordConfirm);
    } else if (url === "/api/mediation-requests/") {
      return Promise.resolve(axiosPostResponseMediationRequests);
    } else if (url === "/api/trace-reports/") {
      return Promise.resolve(axiosPostResponseTraceReports);
    } else {
      return Promise.reject(new Error(`The URL '${url}' is not implemented.`));
    }
  });
  mockedAxios.get.mockImplementation((url) => {
    if (url === "/auth/users/me/") {
      return Promise.resolve(axiosGetResponseMe);
    } else if (url === "/api/mediation-requests/") {
      return Promise.resolve(axiosGetResponseMediationRequests);
    } else if (url === "/api/mediation-requests/user/") {
      return Promise.resolve(axiosGetResponseMediationRequests);
    } else if (url.match(/\/api\/trace-reports\/mediation-request\/[^/]*\//)) {
      return Promise.resolve(axiosGetResponseTraceReports);
    } else if (
      url.match(/\/api\/organizations\/[^/]*\/applications\/[^/]*\//)
    ) {
      return Promise.resolve(axiosGetResponseOrganizationApp);
    } else {
      return Promise.reject(new Error(`The URL '${url}' is not implemented.`));
    }
  });
  mockedAxios.put.mockImplementation((url) => {
    if (url === "/auth/users/me/") {
      return Promise.resolve(axiosPutResponseMe);
    } else {
      return Promise.reject(new Error(`The URL '${url}' is not implemented.`));
    }
  });
  mockedAxios.patch.mockImplementation((url) => {
    if (url.match(/\/api\/trace-reports\/[^/]*/)) {
      return Promise.resolve(axiosPatchResponseTraceReports);
    } else {
      return Promise.reject(new Error(`The URL '${url}' is not implemented.`));
    }
  });
};

/**
 * Generates all URLs with arbitrary values and with an organization prefix.
 * @returns object similar to PATHS but with generated values.
 */
export function generatePathsWithPrefix() {
  return produce(PATHS, (draftState) => {
    for (const [key, value] of Object.entries(draftState)) {
      draftState[key] = generatePath(value, {
        organizationSlug: "koena",
        applicationSlug: "koena-connect",
        uid: "IN",
        token: "z65e44jjlkmyu84e6fjfszqqds2az5szf",
        requestId: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
      });
    }
  });
}

/**
 * Generates all URLs with arbitrary values and without organization prefix.
 * @returns object similar to PATHS but with generated values.
 */
export function generatePathsWithoutPrefix() {
  return produce(PATHS, (draftState) => {
    for (const [key, value] of Object.entries(draftState)) {
      draftState[key] = generatePath(value, {
        organizationSlug: null,
        applicationSlug: null,
        uid: "IN",
        token: "z65e44jjlkmyu84e6fjfszqqds2az5szf",
        requestId: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
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
 * @param {function} getByLabelText function coming from react testing library.
 * @param {string} fieldLabel the label of the field to fill.
 * @param {string} value the value of the field to fill.
 * @param {boolean} shouldFill if false we don't do anything.
 */
export function fillField(
  getByLabelText,
  fieldLabel,
  value,
  shouldFill = true
) {
  if (shouldFill) {
    const field = getByLabelText(fieldLabel);
    fireEvent.change(field, { target: { value: value } });
  }
}

/**
 * Clicks on the given element wrapped in an act().
 */
export async function click(element) {
  await act(async () => {
    fireEvent.click(element);
  });
}

export const configData: ConfigData = {
  platformName: "Connect Access",
} as const;

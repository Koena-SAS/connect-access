import axios from "axios";
import type {
  AboutServiceRecieved,
  ContactInformationRecieved,
} from "../types/footerConfiguration";
import type { MediationRequestRecieved } from "../types/mediationRequest";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import type { TraceReportRecieved } from "../types/traceReport";
import type { UserDetailsReceived } from "../types/userDetails";

jest.mock("axios");
export const mockedAxios = axios as jest.Mocked<typeof axios>;

export let axiosPostResponseLogin: any;
export let axiosPostResponseLogout: any;
export let axiosPostResponseRegister: { data: UserDetailsReceived };
export let axiosPostResponseResetPassword: any;
export let axiosPostResponseResetPasswordConfirm: any;
export let axiosGetResponseMe: { data: UserDetailsReceived };
export let axiosPutResponseMe: { data: UserDetailsReceived };
export let axiosPostResponseMediationRequests: {
  data: MediationRequestRecieved;
};
export let axiosGetResponseMediationRequests: {
  data: MediationRequestRecieved[];
};
export let axiosPatchResponseMediationRequest: {
  data: MediationRequestRecieved;
};
export let axiosGetResponseOrganizationApp: { data: OrganizationAppRecieved };
export let axiosGetResponseTraceReports: { data: TraceReportRecieved[] };
export let axiosPostResponseTraceReports: { data: TraceReportRecieved };
export let axiosPatchResponseTraceReports: { data: TraceReportRecieved };
export let axiosGetResponseAboutService: {
  data: AboutServiceRecieved[];
};
export let axiosGetResponseContactInformation: {
  data: ContactInformationRecieved;
};
export let axiosPostResponsePasswordlessLoginEmail: any;
export let axiosPostResponsePasswordlessLoginToken: any;

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
      id: "yugyuhbjlkoijo",
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone_number: "2463259871",
      is_staff: false,
    },
  };
  axiosGetResponseMe = axiosPostResponseRegister;
  axiosPutResponseMe = axiosGetResponseMe;
  axiosGetResponseMediationRequests = {
    data: [
      {
        id: "4ae77193-1b66-4182-82af-bc9ce432b0e0",
        creation_date: "2021-02-03T11:41:04.346286+01:00",
        modification_date: "2021-02-04T11:41:04.346286+01:00",
        request_date: "2021-02-03T11:41:04.346286+01:00",
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
        organization_address: "2, esplanade de la Gare à Sannois 95110",
        organization_email: "aloha@koena.net",
        organization_phone_number: "0972632128",
        organization_contact: "Armony",
      },
      {
        id: "f8842f63-5073-4956-a7fa-2ec8eb82f37d",
        creation_date: "2021-01-08T11:41:04.346286+01:00",
        modification_date: "2021-01-09T11:41:04.346286+01:00",
        request_date: "2021-01-08T11:41:04.346286+01:00",
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
      },
    ],
  };
  axiosPostResponseMediationRequests = {
    data: axiosGetResponseMediationRequests.data[0],
  };
  axiosPatchResponseMediationRequest = {
    data: axiosGetResponseMediationRequests.data[0],
  };
  axiosGetResponseOrganizationApp = {
    data: {
      id: "iuzhiuzedhuzidh",
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
        contact_date: "2021-04-03T00:00:00Z",
        trace_type: "CALL",
        sender_type: "COMPLAINANT",
        sender_name: "",
        recipient_type: "MEDIATOR",
        recipient_name: "John",
        comment: "the call was fine",
        attached_file: "report.png",
      },
      {
        id: "c82187d3-ba54-408e-ae37-c5a06bcdcc67",
        contact_date: "2021-06-15T00:00:00Z",
        trace_type: "OTHER",
        comment: "informal contact",
        attached_file: "",
      },
    ],
  };
  axiosPostResponseTraceReports = {
    data: {
      id: "83f3046c-4407-43e5-a8bd-5e583dcd8dfa",
      contact_date: "2021-05-03T00:00:00Z",
      trace_type: "CALL",
      comment: "call ok",
      attached_file: "report.png",
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
  axiosPostResponsePasswordlessLoginEmail = {
    data: { detail: "A login token has been sent to you." },
  };
  axiosPostResponsePasswordlessLoginToken = {
    data: { token: "fhzfmhoizeoncmzecnadh" },
  };
  axiosPatchResponseTraceReports = {
    data: {
      id: "abcbd6f0-ae8a-4f66-9eb6-910e4c686774",
      contact_date: "2021-04-03T00:00:00Z",
      trace_type: "CALL",
      comment: "the call not that fine",
      attached_file: "report.png",
    },
  };
  axiosGetResponseAboutService = {
    data: [
      {
        id: "d71769d6-645a-4319-80c1-6dbcb38831a7",
        display_order: 1,
        link_text: {
          fr: "À propos de nous",
          en: "About us",
        },
        link_url: {
          fr: "https://koena.net/mentions-legales/",
          en: "https://koena.net/en/legal-information-and-credits/",
        },
      },
      {
        id: "0327cb51-2f07-4fee-ac27-9415626a5f7f",
        display_order: 2,
        link_text: {
          fr: "Mentions légales",
          en: "Legal information",
        },
        link_url: {
          fr: "/terms-of-service",
          en: "/terms-of-service",
        },
      },
    ],
  };
  axiosGetResponseContactInformation = {
    data: {
      email: {
        fr: "mediation@koena.net",
        en: "mediation@koena.net",
      },
      email_text: {
        fr: "mediation@koena.net",
        en: "mediation@koena.net",
      },
      phone_number: {
        fr: "+339726321",
        en: "+339726321",
      },
      phone_number_text: {
        fr: "+33 (0)9 72 63 21",
        en: "+33 (0)9 72 63 21",
      },
      website: {
        fr: "https://koena.net/",
        en: "https://koena.net/",
      },
      website_text: {
        fr: "koena.net",
        en: "koena.net",
      },
      terms_of_service: {
        fr: "Contenu des conditions générales d'utilisation",
        en: "Terms of service content",
      },
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
    } else if (url === "/passwordless-auth/email/") {
      return Promise.resolve(axiosPostResponsePasswordlessLoginEmail);
    } else if (url === "/passwordless-auth/token/") {
      return Promise.resolve(axiosPostResponsePasswordlessLoginToken);
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
    } else if (url === "/api/configuration/about-service/") {
      return Promise.resolve(axiosGetResponseAboutService);
    } else if (url === "/api/configuration/contact-information/") {
      return Promise.resolve(axiosGetResponseContactInformation);
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
    } else if (url.match(/\/api\/mediation-requests\/[^/]*/)) {
      return Promise.resolve(axiosPatchResponseMediationRequest);
    } else {
      return Promise.reject(new Error(`The URL '${url}' is not implemented.`));
    }
  });
};

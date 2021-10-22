import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    userInfo?: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      assistiveTechnologyUsed: string;
      technologyName: string;
      technologyVersion: string;
    };
    problemDescription?: {
      urgency: string;
      stepDescription: string;
      issueDescription: string;
      inaccessibilityLevel: string;
      browserUsed: string;
      url: string;
      browser: string;
      browserVersion: string;
      mobileAppUsed: string;
      mobileAppPlatform: string;
      mobileAppName: string;
      otherUsedSoftware: string;
      didTellOrganization: string;
      didOrganizationReply: string;
      organizationReply: string;
      furtherInfo: string;
      attachedFile: any;
    };
    organizationInfo?: {
      name: string;
      mailingAddress: string;
      email: string;
      phoneNumber: string;
      contact: string;
    };
  }
}

function updateUserInfo(state, payload) {
  return {
    ...state,
    userInfo: {
      ...state.userInfo,
      ...payload,
    },
  };
}

function updateProblemDescription(state, payload) {
  return {
    ...state,
    problemDescription: {
      ...state.problemDescription,
      ...payload,
    },
  };
}

function updateOrganizationInfo(state, payload) {
  return {
    ...state,
    organizationInfo: {
      ...state.organizationInfo,
      ...payload,
    },
  };
}

const initialState = {
  userInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    assistiveTechnologyUsed: "",
    technologyName: "",
    technologyVersion: "",
  },
  problemDescription: {
    urgency: "",
    stepDescription: "",
    issueDescription: "",
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
  organizationInfo: {
    name: "",
    mailingAddress: "",
    email: "",
    phoneNumber: "",
    contact: "",
  },
};

function resetState() {
  return initialState;
}

export {
  updateUserInfo,
  updateProblemDescription,
  updateOrganizationInfo,
  initialState,
  resetState,
};

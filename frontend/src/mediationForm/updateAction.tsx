import "little-state-machine";
import type {
  AssistiveTechnology,
  Browser,
  InaccessibilityLevel,
  MobileAppPlatform,
  Urgency,
} from "../types/mediationRequest";
import { YesNo } from "../types/types";

declare module "little-state-machine" {
  interface GlobalState {
    userInfo?: UserInfo;
    problemDescription?: ProblemDescription;
    organizationInfo?: OrganizationInfo;
  }
}

type GlobalState = {
  userInfo?: UserInfo;
  problemDescription?: ProblemDescription;
  organizationInfo?: OrganizationInfo;
};

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  assistiveTechnologyUsed: AssistiveTechnology[] | [];
  technologyName: string;
  technologyVersion: string;
};

type ProblemDescription = {
  urgency: Urgency | "";
  stepDescription: string;
  issueDescription: string;
  inaccessibilityLevel: InaccessibilityLevel | "";
  browserUsed: YesNo | "";
  url: string;
  browser: Browser | "";
  browserVersion: string;
  mobileAppUsed: YesNo | "";
  mobileAppPlatform: MobileAppPlatform | "";
  mobileAppName: string;
  otherUsedSoftware: string;
  didTellOrganization: YesNo | "";
  didOrganizationReply: YesNo | "";
  organizationReply: string;
  furtherInfo: string;
  attachedFile: any;
};

type OrganizationInfo = {
  name: string;
  mailingAddress: string;
  email: string;
  phoneNumber: string;
  contact: string;
};

function updateUserInfo(state: GlobalState, payload: Partial<UserInfo>) {
  return {
    ...state,
    userInfo: {
      ...state.userInfo,
      ...payload,
    },
  };
}

function updateProblemDescription(
  state: GlobalState,
  payload: Partial<ProblemDescription>
) {
  return {
    ...state,
    problemDescription: {
      ...state.problemDescription,
      ...payload,
    },
  };
}

function updateOrganizationInfo(
  state: GlobalState,
  payload: Partial<OrganizationInfo>
) {
  return {
    ...state,
    organizationInfo: {
      ...state.organizationInfo,
      ...payload,
    },
  };
}

const initialState: GlobalState = {
  userInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    assistiveTechnologyUsed: [],
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
export type { GlobalState, UserInfo, ProblemDescription, OrganizationInfo };

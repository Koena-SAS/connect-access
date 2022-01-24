import "little-state-machine";
import type {
  AssistiveTechnology,
  Browser,
  InaccessibilityLevel,
  MobileAppPlatform,
  Urgency,
} from "../types/mediationRequest";
import type { YesNo } from "../types/types";

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

type AssistiveTechnologiesUsed = {
  isUsed: YesNo | "";
  technologies: {
    technologyType: AssistiveTechnology;
    technologyName: string;
    technologyVersion: string;
  }[];
};

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  assistiveTechnologiesUsed: AssistiveTechnologiesUsed;
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

function updateUserInfo(
  state: GlobalState,
  payload: Partial<UserInfo>
): GlobalState {
  return {
    ...state,
    userInfo: {
      ...state.userInfo,
      ...payload,
    } as UserInfo,
  };
}

function updateProblemDescription(
  state: GlobalState,
  payload: Partial<ProblemDescription>
): GlobalState {
  return {
    ...state,
    problemDescription: {
      ...state.problemDescription,
      ...payload,
    } as ProblemDescription,
  };
}

function updateOrganizationInfo(
  state: GlobalState,
  payload: Partial<OrganizationInfo>
): GlobalState {
  return {
    ...state,
    organizationInfo: {
      ...state.organizationInfo,
      ...payload,
    } as OrganizationInfo,
  };
}

const initialState: GlobalState = {
  userInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    assistiveTechnologiesUsed: { isUsed: "", technologies: [] },
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

function resetState(): GlobalState {
  return initialState;
}

export {
  updateUserInfo,
  updateProblemDescription,
  updateOrganizationInfo,
  initialState,
  resetState,
};
export type {
  GlobalState,
  UserInfo,
  ProblemDescription,
  OrganizationInfo,
  AssistiveTechnologiesUsed,
};

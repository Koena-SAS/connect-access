type MediationRequest = {
  id: any;
  creationDate: any;
  status: any;
  applicationData: {
    id: any;
    name: any;
    organizationName: any;
    organizationEmail: any;
    organizationPhoneNumber: any;
    organizationAddress: any;
  };
  firstName: any;
  lastName: any;
  email: any;
  phoneNumber: any;
  assistiveTechnologyUsed: any;
  technologyName: any;
  technologyVersion: any;
  urgency: any;
  issueDescription: any;
  stepDescription: any;
  inaccessibilityLevel: any;
  browserUsed: any;
  url: any;
  browser: any;
  browserVersion: any;
  mobileAppUsed: any;
  mobileAppPlatform: any;
  mobileAppName: any;
  otherUsedSoftware: any;
  didTellOrganization: any;
  didOrganizationReply: any;
  organizationReply: any;
  furtherInfo: any;
  attachedFile: any;
  organizationName: any;
  organizationAddress: any;
  organizationEmail: any;
  organizationPhoneNumber: any;
  organizationContact: any;
};

type ConfigData = {
  platformName: string;
};

export type { MediationRequest, ConfigData };

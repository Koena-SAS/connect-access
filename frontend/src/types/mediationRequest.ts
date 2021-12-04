type Status =
  | "PENDING"
  | "WAITING_MEDIATOR_VALIDATION"
  | "FILED"
  | "WAITING_ADMIN"
  | "WAITING_CONTACT"
  | "WAITING_CONTACT_BIS"
  | "MEDIATING"
  | "CLOTURED"
  | "MEDIATION_FAILED";

type InaccessibilityLevel =
  | "IMPOSSIBLE_ACCESS"
  | "ACCESS_DIFFICULT"
  | "RANDOM_ACCESS";

type MobileAppPlatform = "IOS" | "ANDROID" | "WINDOWS_PHONE" | "OTHER";

type Browser =
  | "FIREFOX"
  | "CHROME"
  | "INTERNET_EXPLORER"
  | "MICROSOFT_EDGE"
  | "OTHER"
  | "DONT_KNOW";

type Urgency = "VERY_URGENT" | "MODERATELY_URGENT" | "NOT_URGENT";

type AssistiveTechnology =
  | "KEYBOARD"
  | "SCREEN_READER_VOCAL_SYNTHESIS"
  | "BRAILLE_DISPLAY"
  | "ZOOM_SOFTWARE"
  | "VOCAL_COMMAND_SOFTWARE"
  | "DYS_DISORDER_SOFTWARE"
  | "VIRTUAL_KEYBOARD"
  | "ADAPTED_NAVIGATION_DISPOSITIVE"
  | "EXCLUSIVE_KEYBOARD_NAVIGATION"
  | "OTHER";

type MediationRequest = {
  id: any;
  creationDate: any;
  status: Status;
  applicationData?: {
    id: any;
    name: any;
    organizationName: any;
    organizationEmail: any;
    organizationPhoneNumber: any;
    organizationAddress: any;
  };
  firstName: any;
  lastName?: any;
  email: any;
  phoneNumber?: any;
  assistiveTechnologyUsed?: AssistiveTechnology[];
  technologyName?: any;
  technologyVersion?: any;
  urgency?: Urgency;
  issueDescription: any;
  stepDescription?: any;
  inaccessibilityLevel?: InaccessibilityLevel;
  browserUsed?: any;
  url?: any;
  browser?: Browser | "";
  browserVersion?: any;
  mobileAppUsed?: any;
  mobileAppPlatform?: MobileAppPlatform;
  mobileAppName?: any;
  otherUsedSoftware?: any;
  didTellOrganization?: any;
  didOrganizationReply?: any;
  organizationReply?: any;
  furtherInfo?: any;
  attachedFile?: any;
  organizationName?: any;
  organizationAddress?: any;
  organizationEmail?: any;
  organizationPhoneNumber?: any;
  organizationContact?: any;
};

type MediationRequestRecieved = {
  id: any;
  creation_date: any;
  status: Status;
  application_data?: {
    id: any;
    name: any;
    organization_name: any;
    organization_email: any;
    organization_phone_number: any;
    organization_address: any;
  };
  first_name: any;
  last_name?: any;
  email: any;
  phone_number?: any;
  assistive_technology_used?: AssistiveTechnology[];
  technology_name?: any;
  technology_version?: any;
  urgency?: Urgency;
  issue_description: any;
  step_description?: any;
  inaccessibility_level?: InaccessibilityLevel;
  browser_used?: any;
  url?: any;
  browser?: Browser | "";
  browser_version?: any;
  mobile_app_used?: any;
  mobile_app_platform?: MobileAppPlatform | "";
  mobile_app_name?: any;
  other_used_software?: any;
  did_tell_organization?: any;
  did_organization_reply?: any;
  organization_reply?: any;
  further_info?: any;
  attached_file?: any;
  organization_name?: any;
  organization_address?: any;
  organization_email?: any;
  organization_phone_number?: any;
  organization_contact?: any;
};

export type {
  MediationRequest,
  Status,
  InaccessibilityLevel,
  MobileAppPlatform,
  Browser,
  Urgency,
  AssistiveTechnology,
  MediationRequestRecieved,
};

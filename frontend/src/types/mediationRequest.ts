import type {
  ApplicationData,
  ApplicationDataRecieved,
} from "./organizationApp";
import type { YesNo } from "./types";

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
  id?: string;
  creationDate?: string;
  modificationDate?: string;
  requestDate?: string;
  status: Status;
  complainant?: string;
  applicationData?: ApplicationData;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  assistiveTechnologyUsed?: AssistiveTechnology[] | [];
  technologyName?: string;
  technologyVersion?: string;
  urgency?: Urgency | "";
  issueDescription: string;
  stepDescription?: string;
  inaccessibilityLevel?: InaccessibilityLevel | "";
  browserUsed?: YesNo | "";
  url?: string;
  browser?: Browser | "";
  browserVersion?: string;
  mobileAppUsed?: YesNo | "";
  mobileAppPlatform?: MobileAppPlatform | "";
  mobileAppName?: string;
  otherUsedSoftware?: string;
  didTellOrganization?: YesNo | "";
  didOrganizationReply?: YesNo | "";
  organizationReply?: string;
  furtherInfo?: string;
  attachedFile?: any;
  organizationName?: string;
  organizationAddress?: string;
  organizationEmail?: string;
  organizationPhoneNumber?: string;
  organizationContact?: string;
  removeAttachedFile?: boolean;
};

type MediationRequestRecieved = {
  id?: string;
  creation_date?: string;
  modification_date?: string;
  request_date?: string;
  status: Status;
  complainant?: string;
  application_data?: ApplicationDataRecieved;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  assistive_technology_used?: AssistiveTechnology[] | [];
  technology_name?: string;
  technology_version?: string;
  urgency?: Urgency | "";
  issue_description: string;
  step_description?: string;
  inaccessibility_level?: InaccessibilityLevel | "";
  browser_used?: YesNo | "";
  url?: string;
  browser?: Browser | "";
  browser_version?: string;
  mobile_app_used?: YesNo | "";
  mobile_app_platform?: MobileAppPlatform | "";
  mobile_app_name?: string;
  other_used_software?: string;
  did_tell_organization?: YesNo | "";
  did_organization_reply?: YesNo | "";
  organization_reply?: string;
  further_info?: string;
  attached_file?: any;
  organization_name?: string;
  organization_address?: string;
  organization_email?: string;
  organization_phone_number?: string;
  organization_contact?: string;
};

type MediationRequestToSend = {
  request_date?: string;
  status: Status;
  complainant?: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  assistive_technology_used?: AssistiveTechnology[] | [];
  technology_name?: string;
  technology_version?: string;
  urgency?: Urgency | "";
  issue_description: string;
  step_description?: string;
  inaccessibility_level?: InaccessibilityLevel | "";
  browser_used?: YesNo | "";
  url?: string;
  browser?: Browser | "";
  browser_version?: string;
  mobile_app_used?: YesNo | "";
  mobile_app_platform?: MobileAppPlatform | "";
  mobile_app_name?: string;
  other_used_software?: string;
  did_tell_organization?: YesNo | "";
  did_organization_reply?: YesNo | "";
  organization_reply?: string;
  further_info?: string;
  attached_file?: any;
  organization_name?: string;
  organization_address?: string;
  organization_email?: string;
  organization_phone_number?: string;
  organization_contact?: string;
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
  MediationRequestToSend,
};

import type {
  AssistiveTechnology,
  MediationRequest,
} from "../types/mediationRequest";
import type { AssistiveTechnologiesUsed, GlobalState } from "./updateAction";

/**
 * The main mediation form holds its information in a state hendled by
 * little state machine. It is divided into 3 parts.
 * This function merges them into one object, in the format that is used
 * through the whole app for mediation request information.
 *
 * @param formState the divided state
 * @returns the merged mediation request information
 */
export function formStateToMediationRequests(
  formState: GlobalState
): MediationRequest {
  return {
    status: "WAITING_MEDIATOR_VALIDATION",
    firstName: formState.userInfo ? formState.userInfo.firstName : "",
    lastName: formState.userInfo ? formState.userInfo.lastName : "",
    email: formState.userInfo ? formState.userInfo.email : "",
    phoneNumber: formState.userInfo ? formState.userInfo.phoneNumber : "",
    assistiveTechnologyUsed: formState.userInfo
      ? technologyTypesToMediationRequest(
          formState.userInfo.assistiveTechnologiesUsed
        )
      : [],
    technologyName: formState.userInfo
      ? technologyNamesToMediationRequest(
          formState.userInfo.assistiveTechnologiesUsed
        )
      : "",
    technologyVersion: formState.userInfo
      ? technologyVersionsToMediationRequest(
          formState.userInfo.assistiveTechnologiesUsed
        )
      : "",
    urgency: formState.problemDescription
      ? formState.problemDescription.urgency
      : "",
    stepDescription: formState.problemDescription
      ? formState.problemDescription.stepDescription
      : "",
    issueDescription: formState.problemDescription
      ? formState.problemDescription.issueDescription
      : "",
    inaccessibilityLevel: formState.problemDescription
      ? formState.problemDescription.inaccessibilityLevel
      : "",
    browserUsed: formState.problemDescription
      ? formState.problemDescription.browserUsed
      : "",
    url: formState.problemDescription ? formState.problemDescription.url : "",
    browser: formState.problemDescription
      ? formState.problemDescription.browser
      : "",
    browserVersion: formState.problemDescription
      ? formState.problemDescription.browserVersion
      : "",
    mobileAppUsed: formState.problemDescription
      ? formState.problemDescription.mobileAppUsed
      : "",
    mobileAppPlatform: formState.problemDescription
      ? formState.problemDescription.mobileAppPlatform
      : "",
    mobileAppName: formState.problemDescription
      ? formState.problemDescription.mobileAppName
      : "",
    otherUsedSoftware: formState.problemDescription
      ? formState.problemDescription.otherUsedSoftware
      : "",
    didTellOrganization: formState.problemDescription
      ? formState.problemDescription.didTellOrganization
      : "",
    didOrganizationReply: formState.problemDescription
      ? formState.problemDescription.didOrganizationReply
      : "",
    organizationReply: formState.problemDescription
      ? formState.problemDescription.organizationReply
      : "",
    furtherInfo: formState.problemDescription
      ? formState.problemDescription.furtherInfo
      : "",
    attachedFile: formState.problemDescription
      ? formState.problemDescription.attachedFile
      : "",
    organizationName: formState.organizationInfo
      ? formState.organizationInfo.name
      : "",
    organizationAddress: formState.organizationInfo
      ? formState.organizationInfo.mailingAddress
      : "",
    organizationEmail: formState.organizationInfo
      ? formState.organizationInfo.email
      : "",
    organizationPhoneNumber: formState.organizationInfo
      ? formState.organizationInfo.phoneNumber
      : "",
    organizationContact: formState.organizationInfo
      ? formState.organizationInfo.contact
      : "",
  };
}

export function technologyTypesToMediationRequest(
  assistiveTechnologiesUsed: AssistiveTechnologiesUsed
): AssistiveTechnology[] {
  if (
    assistiveTechnologiesUsed.isUsed === "YES" &&
    Array.isArray(assistiveTechnologiesUsed.technologies)
  ) {
    const technologyTypes = [] as AssistiveTechnology[];
    assistiveTechnologiesUsed.technologies.forEach((technology) => {
      technologyTypes.push(technology.technologyType);
    });
    return technologyTypes;
  }
  return [];
}

export function technologyNamesToMediationRequest(
  assistiveTechnologiesUsed: AssistiveTechnologiesUsed
): string {
  if (
    assistiveTechnologiesUsed.isUsed === "YES" &&
    Array.isArray(assistiveTechnologiesUsed.technologies)
  ) {
    let assistiveTechnologyNames = "";
    assistiveTechnologiesUsed.technologies.forEach((technology) => {
      if (technology.technologyName) {
        assistiveTechnologyNames += `${technology.technologyName}, `;
      }
    });
    if (assistiveTechnologyNames) {
      assistiveTechnologyNames = assistiveTechnologyNames.slice(0, -2);
    }
    return assistiveTechnologyNames;
  }
  return "";
}

export function technologyVersionsToMediationRequest(
  assistiveTechnologiesUsed: AssistiveTechnologiesUsed
): string {
  if (
    assistiveTechnologiesUsed.isUsed === "YES" &&
    Array.isArray(assistiveTechnologiesUsed.technologies)
  ) {
    let assistiveTechnologyVersions = "";
    assistiveTechnologiesUsed.technologies.forEach((technology) => {
      if (technology.technologyVersion) {
        assistiveTechnologyVersions += `${technology.technologyVersion}, `;
      }
    });
    if (assistiveTechnologyVersions) {
      assistiveTechnologyVersions = assistiveTechnologyVersions.slice(0, -2);
    }
    return assistiveTechnologyVersions;
  }
  return "";
}

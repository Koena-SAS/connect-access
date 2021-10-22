/**
 * The main mediation form holds its information in a state hendled by
 * little state machine. It is divided into 3 parts.
 * This function merges them into one object, in the format that is used
 * through the whole app for mediation request information.
 *
 * @param {object} formState the divided state
 * @returns the merged mediation request information
 */
export function formStateToMediationRequests(formState) {
  return {
    firstName: formState.userInfo.firstName,
    lastName: formState.userInfo.lastName,
    email: formState.userInfo.email,
    phoneNumber: formState.userInfo.phoneNumber,
    assistiveTechnologyUsed: formState.userInfo.assistiveTechnologyUsed,
    technologyName: formState.userInfo.technologyName,
    technologyVersion: formState.userInfo.technologyVersion,
    urgency: formState.problemDescription.urgency,
    stepDescription: formState.problemDescription.stepDescription,
    issueDescription: formState.problemDescription.issueDescription,
    inaccessibilityLevel: formState.problemDescription.inaccessibilityLevel,
    browserUsed: formState.problemDescription.browserUsed,
    url: formState.problemDescription.url,
    browser: formState.problemDescription.browser,
    browserVersion: formState.problemDescription.browserVersion,
    mobileAppUsed: formState.problemDescription.mobileAppUsed,
    mobileAppPlatform: formState.problemDescription.mobileAppPlatform,
    mobileAppName: formState.problemDescription.mobileAppName,
    otherUsedSoftware: formState.problemDescription.otherUsedSoftware,
    didTellOrganization: formState.problemDescription.didTellOrganization,
    didOrganizationReply: formState.problemDescription.didOrganizationReply,
    organizationReply: formState.problemDescription.organizationReply,
    furtherInfo: formState.problemDescription.furtherInfo,
    attachedFile: formState.problemDescription.attachedFile,
    organizationName: formState.organizationInfo.name,
    organizationAddress: formState.organizationInfo.mailingAddress,
    organizationEmail: formState.organizationInfo.email,
    organizationPhoneNumber: formState.organizationInfo.phoneNumber,
    organizationContact: formState.organizationInfo.contact,
  };
}

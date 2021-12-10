import { Trans } from "@lingui/macro";
import { ReactNode } from "react";
import {
  assistiveTechnologyMap,
  booleanMap,
  browserMap,
  inaccessibilityLevelMap,
  mobileAppPlatformMap,
  urgencyLevelMap,
} from "../constants/choicesMap";
import { useOrganizationApp } from "../hooks";
import type { MediationRequest } from "../types/mediationRequest";

type MediationRequestsDetailProps = {
  mediationRequest: MediationRequest;
  /**
   * Optional elements that will appear under each main sections
   */
  additionalComponents?: {
    personalInformation: ReactNode;
    problemDescription: ReactNode;
    organization: ReactNode;
  };
  titlesHeadingLevel?: number;
};

/**
 * Display mediation request details.
 */
function MediationRequestsDetail({
  mediationRequest,
  additionalComponents,
  titlesHeadingLevel = 3,
}: MediationRequestsDetailProps) {
  const { organizationApp } = useOrganizationApp();
  const buildAttachedFileDisplay = () => {
    const files = mediationRequest.attachedFile;
    if (files && files.length) {
      if (files.length === 1 && files[0] instanceof File) {
        return files[0].name;
      } else {
        const names = Array.from(files).map((file, index) => {
          if (file instanceof File) {
            return <li key={index}>{file.name}</li>;
          } else {
            return null;
          }
        });
        return <ul>{names}</ul>;
      }
    } else {
      return null;
    }
  };
  const buildTitle = (
    titleProps: React.ComponentPropsWithoutRef<"h1">,
    title: ReactNode
  ) => {
    switch (titlesHeadingLevel) {
      case 1:
        return <h1 {...titleProps}>{title}</h1>;
      case 2:
        return <h2 {...titleProps}>{title}</h2>;
      case 3:
        return <h3 {...titleProps}>{title}</h3>;
      default:
        return <h3 {...titleProps}>{title}</h3>;
    }
  };
  return (
    <>
      <section className="card mediation-request-detail">
        {buildTitle(
          { className: "mediation-request-detail__title" },
          <Trans>About you</Trans>
        )}
        <div role="list" className="mediation-request-detail__list">
          <div className="mediation-request-detail__items-container">
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>First name / username:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.firstName}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Last name:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.lastName}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>
                  <span lang="en">E-mail:</span>
                </Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.email}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Phone number:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.phoneNumber}
              </span>
            </div>
          </div>
          <div className="mediation-request-detail__items-container">
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Assistive technologies used:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.assistiveTechnologyUsed?.length &&
                  mediationRequest.assistiveTechnologyUsed.map(
                    function generateAssistiveTechs(technology, index) {
                      if (technology) {
                        const lastElement =
                          mediationRequest.assistiveTechnologyUsed &&
                          index <
                            mediationRequest.assistiveTechnologyUsed.length - 1;
                        return (
                          <span key={technology}>
                            {lastElement ? (
                              <>
                                <Trans
                                  id={assistiveTechnologyMap[technology]}
                                />
                                ,{" "}
                              </>
                            ) : (
                              <Trans id={assistiveTechnologyMap[technology]} />
                            )}
                          </span>
                        );
                      } else {
                        return null;
                      }
                    }
                  )}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Assistive technology name(s):</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.technologyName}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Assistive technology version(s):</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.technologyVersion}
              </span>
            </div>
          </div>
        </div>
        {additionalComponents && additionalComponents.personalInformation}
      </section>
      <section className="card mediation-request-detail">
        {buildTitle(
          { className: "mediation-request-detail__title" },
          <Trans>Your problem</Trans>
        )}
        <div role="list" className="mediation-request-detail__list">
          <div className="mediation-request-detail__items-container">
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>What was the issue?</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.issueDescription}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>
                  Describe every step you did in order to access the wanted
                  content or features:
                </Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.stepDescription}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>
                  What was the level of inaccessibility encountered?
                </Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.inaccessibilityLevel && (
                  <Trans
                    id={
                      inaccessibilityLevelMap[
                        mediationRequest.inaccessibilityLevel
                      ]
                    }
                  />
                )}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Is your problem urgent?</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.urgency && (
                  <Trans id={urgencyLevelMap[mediationRequest.urgency]} />
                )}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Did the problem occur while using a web browser?</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.browserUsed && (
                  <Trans id={booleanMap[mediationRequest.browserUsed]} />
                )}
              </span>
            </div>
            {mediationRequest.browserUsed !== "NO" && (
              <>
                <div role="listitem">
                  <span className="mediation-request-detail__question">
                    <Trans>
                      What is the url address where you have encountered the
                      problem?
                    </Trans>
                  </span>{" "}
                  <span className="mediation-request-detail__answer">
                    {mediationRequest.url}
                  </span>
                </div>
                <div role="listitem">
                  <span className="mediation-request-detail__question">
                    <Trans>Which web browser did you use?</Trans>
                  </span>{" "}
                  <span className="mediation-request-detail__answer">
                    {mediationRequest.browser && (
                      <Trans id={browserMap[mediationRequest.browser]} />
                    )}
                  </span>
                </div>
                <div role="listitem">
                  <span className="mediation-request-detail__question">
                    <Trans>Which web browser version did you use?</Trans>
                  </span>{" "}
                  <span className="mediation-request-detail__answer">
                    {mediationRequest.browserVersion}
                  </span>
                </div>
              </>
            )}
            {mediationRequest.browserUsed === "NO" && (
              <>
                <div role="listitem">
                  <span className="mediation-request-detail__question">
                    <Trans>Was it a mobile app?</Trans>
                  </span>{" "}
                  <span className="mediation-request-detail__answer">
                    {mediationRequest.mobileAppUsed && (
                      <Trans id={booleanMap[mediationRequest.mobileAppUsed]} />
                    )}
                  </span>
                </div>
                {mediationRequest.mobileAppUsed !== "NO" && (
                  <>
                    <div role="listitem">
                      <span className="mediation-request-detail__question">
                        <Trans>What kind of app was it?</Trans>
                      </span>{" "}
                      <span className="mediation-request-detail__answer">
                        {mediationRequest.mobileAppPlatform && (
                          <Trans
                            id={
                              mobileAppPlatformMap[
                                mediationRequest.mobileAppPlatform
                              ]
                            }
                          />
                        )}
                      </span>
                    </div>
                    <div role="listitem">
                      <span className="mediation-request-detail__question">
                        <Trans>What was the name of the app?</Trans>
                      </span>{" "}
                      <span className="mediation-request-detail__answer">
                        {mediationRequest.mobileAppName}
                      </span>
                    </div>
                  </>
                )}
                {mediationRequest.mobileAppUsed === "NO" && (
                  <div role="listitem">
                    <span className="mediation-request-detail__question">
                      <Trans>
                        Which software, connected object or other did you use?
                      </Trans>
                    </span>{" "}
                    <span className="mediation-request-detail__answer">
                      {mediationRequest.otherUsedSoftware}
                    </span>
                  </div>
                )}
              </>
            )}
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>
                  Did you already tell the organization in charge about the
                  problem?
                </Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.didTellOrganization && (
                  <Trans
                    id={booleanMap[mediationRequest.didTellOrganization]}
                  />
                )}
              </span>
            </div>
            {mediationRequest.didTellOrganization !== "NO" && (
              <>
                <div role="listitem">
                  <span className="mediation-request-detail__question">
                    <Trans>Did they reply?</Trans>
                  </span>{" "}
                  <span className="mediation-request-detail__answer">
                    {mediationRequest.didOrganizationReply && (
                      <Trans
                        id={booleanMap[mediationRequest.didOrganizationReply]}
                      />
                    )}
                  </span>
                </div>
                {mediationRequest.didOrganizationReply !== "NO" && (
                  <div role="listitem">
                    <span className="mediation-request-detail__question">
                      <Trans>What was their reply?</Trans>
                    </span>{" "}
                    <span className="mediation-request-detail__answer">
                      {mediationRequest.organizationReply}
                    </span>
                  </div>
                )}
              </>
            )}
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Further information:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {mediationRequest.furtherInfo}
              </span>
            </div>
            <div role="listitem">
              <span className="mediation-request-detail__question">
                <Trans>Attached file:</Trans>
              </span>{" "}
              <span className="mediation-request-detail__answer">
                {buildAttachedFileDisplay()}
              </span>
            </div>
          </div>
        </div>
        {additionalComponents && additionalComponents.problemDescription}
      </section>
      {!organizationApp && (
        <section className="card mediation-request-detail">
          {buildTitle(
            { className: "mediation-request-detail__title" },
            <Trans>The organization</Trans>
          )}
          <div role="list" className="mediation-request-detail__list">
            <div className="mediation-request-detail__items-container">
              <div role="listitem">
                <span className="mediation-request-detail__question">
                  <Trans>Name of the organization:</Trans>
                </span>{" "}
                <span className="mediation-request-detail__answer">
                  {mediationRequest.organizationName}
                </span>
              </div>
              <div role="listitem">
                <span className="mediation-request-detail__question">
                  <Trans>Mailing adress:</Trans>
                </span>{" "}
                <span className="mediation-request-detail__answer">
                  {mediationRequest.organizationAddress}
                </span>
              </div>
              <div role="listitem">
                <span className="mediation-request-detail__question">
                  <Trans>
                    <span lang="en">E-mail:</span>
                  </Trans>
                </span>{" "}
                <span className="mediation-request-detail__answer">
                  {mediationRequest.organizationEmail}
                </span>
              </div>
            </div>
            <div className="mediation-request-detail__items-container">
              <div role="listitem">
                <span className="mediation-request-detail__question">
                  <Trans>Phone number:</Trans>
                </span>{" "}
                <span className="mediation-request-detail__answer">
                  {mediationRequest.organizationPhoneNumber}
                </span>
              </div>
              <div role="listitem">
                <span className="mediation-request-detail__question">
                  <Trans>Contact:</Trans>
                </span>{" "}
                <span className="mediation-request-detail__answer">
                  {mediationRequest.organizationContact}
                </span>
              </div>
            </div>
          </div>
          {additionalComponents && additionalComponents.organization}
        </section>
      )}
    </>
  );
}

export default MediationRequestsDetail;

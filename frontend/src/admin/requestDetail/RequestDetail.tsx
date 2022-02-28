import { Trans } from "@lingui/macro";
import produce from "immer";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminMediationRequest, usePrevious } from "../../hooks";
import {
  AboutIssueFields,
  AboutOrganizationFields,
  FurtherInfoFields,
  NavigationContextFields,
  OrganizationAnswerFields,
} from "../../mediationForm/fields";
import AssitiveTechnologyFields from "../../mediationForm/fields/AssitiveTechnologyAdminFields";
import { MediationRequest } from "../../types/mediationRequest";
import PersonalInformationFields from "./PersonalInformationFields";

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  assistiveTechnologyUsed: string[];
  technologyName: string;
  technologyVersion: string;
  urgency: string;
  issueDescription: string;
  stepDescription: string;
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
  attachedFile: string;
  organizationName: string;
  organizationAddress: string;
  organizationEmail: string;
  organizationPhoneNumber: string;
  organizationContact: string;
};

type RequestDetailProps = {
  token: string;
  setBreadcrumbs: (breadcrumbs: JSX.Element[]) => void;
};

/**
 * List the details of a specific mediation request, and gives the
 * possibility to update them.
 */
function RequestDetail({ token, setBreadcrumbs }: RequestDetailProps) {
  useEffect(
    function initBreadcrumbs() {
      setBreadcrumbs([
        <Trans>Mediation</Trans>,
        <Trans>All requests</Trans>,
        <Trans>Details</Trans>,
      ]);
    },
    [setBreadcrumbs]
  );
  const { mediationRequest } = useAdminMediationRequest(token);
  const previousMediationRequest = usePrevious<MediationRequest | undefined>(
    mediationRequest
  );
  const [secondInitializationTodo, setSecondInitializationTodo] =
    useState(false);
  const { register, errors, setValue, watch, control } = useForm<FormInputs>({
    defaultValues: mediationRequest
      ? produce(mediationRequest, (draft) => {
          delete draft.id;
          delete draft.attachedFile;
          delete draft.applicationData;
        })
      : { organizationPhoneNumber: "", organizationEmail: "" },
  });
  const setInitialValues = useCallback(() => {
    if (mediationRequest) {
      for (const key of Object.keys(mediationRequest)) {
        if (key !== "id" && key !== "attachedFile" && key !== "applicationData")
          setValue(key, mediationRequest[key as keyof MediationRequest]);
      }
    }
  }, [mediationRequest, setValue]);
  useEffect(
    function setInitialDefaultValues() {
      if (!previousMediationRequest) {
        setInitialValues();
        setSecondInitializationTodo(true);
      }
    },
    [previousMediationRequest, mediationRequest, setValue, setInitialValues]
  );
  useEffect(
    function resetSecondInitializationTodo() {
      if (secondInitializationTodo) {
        setInitialValues();
        setSecondInitializationTodo(false);
      }
    },
    [mediationRequest, secondInitializationTodo, setInitialValues, setValue]
  );
  return (
    <div className="admin-request-detail">
      <h1 className="admin-page-base__title">
        <Trans>Request detail</Trans>
      </h1>
      <form className="form">
        <PersonalInformationFields
          register={register}
          errors={errors}
          legendClassName="admin-request-detail__fieldset-legend-first"
          level={2}
        />
        <AssitiveTechnologyFields
          register={register}
          isUserFacing={false}
          legendClassName="admin-request-detail__fieldset-legend"
          level={2}
        />
        <AboutIssueFields
          register={register}
          errors={errors}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={2}
        />
        <NavigationContextFields
          register={register}
          errors={errors}
          watch={watch}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={3}
        />
        <OrganizationAnswerFields
          register={register}
          watch={watch}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={3}
        />
        <FurtherInfoFields
          register={register}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={3}
          currentAttachedFile={
            mediationRequest?.attachedFile ? (
              <a
                className="admin-request-detail__link"
                href={`${mediationRequest?.attachedFile}`}
                download
              >
                <Trans>Download the current attached file</Trans>
              </a>
            ) : (
              ""
            )
          }
        />
        {!mediationRequest?.applicationData && (
          <AboutOrganizationFields
            register={register}
            errors={errors}
            control={control}
            prefixedNames={true}
            legendClassName="admin-request-detail__fieldset-legend"
            smallPaddingTop={true}
            level={3}
          />
        )}
      </form>
    </div>
  );
}

export default RequestDetail;

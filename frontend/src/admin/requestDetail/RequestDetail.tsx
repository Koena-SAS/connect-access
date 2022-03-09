import { t, Trans } from "@lingui/macro";
import { SnackbarCloseReason } from "@mui/material";
import produce from "immer";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button, Snackbar } from "../../forms";
import {
  useAdminMediationRequest,
  useEditMediationRequest,
  usePrevious,
} from "../../hooks";
import {
  AboutIssueFields,
  AboutOrganizationFields,
  FurtherInfoFields,
  NavigationContextFields,
  OrganizationAnswerFields,
} from "../../mediationForm/fields";
import {
  AssistiveTechnology,
  Browser,
  InaccessibilityLevel,
  MediationRequest,
  MobileAppPlatform,
  Status,
  Urgency,
} from "../../types/mediationRequest";
import { YesNo } from "../../types/types";
import AssitiveTechnologyFields from "../fields/AssitiveTechnologyFields";
import MainFields from "../fields/MainFields";
import PersonalInformationFields from "./PersonalInformationFields";

type FormInput = {
  requestDate: Date | string;
  modificationDate: Date | string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  assistiveTechnologyUsed: AssistiveTechnology[] | [];
  technologyName: string;
  technologyVersion: string;
  status: Status;
  urgency: Urgency | "";
  issueDescription: string;
  stepDescription: string;
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
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const [requestFailureMessageOpen, setRequestFailureMessageOpen] =
    useState(false);
  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const displayRequestFailure = () => {
    setRequestFailureMessageOpen(true);
  };
  const handleCloseSuccessMessage = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
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
  const {
    register,
    errors,
    setError,
    clearErrors,
    setValue,
    watch,
    control,
    handleSubmit,
  } = useForm<FormInput>({
    defaultValues: mediationRequest
      ? produce(mediationRequest, (draft) => {
          delete draft.id;
          delete draft.attachedFile;
          delete draft.applicationData;
        })
      : {
          organizationPhoneNumber: "",
          organizationEmail: "",
          requestDate: Date(),
        },
  });
  const [editMediationRequest] = useEditMediationRequest({
    token,
    onSuccess: displayRequestSuccess,
    onFailure: displayRequestFailure,
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

  const onSubmit = (data: FormInput) => {
    editMediationRequest({
      mediationRequestId: mediationRequestId,
      mediationRequest: data as MediationRequest,
      token,
    });
  };
  return (
    <div className="admin-request-detail">
      <h1 className="admin-page-base__title">
        <Trans>Request detail</Trans>
      </h1>
      <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <MainFields
          register={register}
          control={control}
          mediationRequest={mediationRequest}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
          legendClassName="admin-request-detail__fieldset-legend-first"
          level={2}
        />
        <PersonalInformationFields
          register={register}
          errors={errors}
          legendClassName="admin-request-detail__fieldset-legend"
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
          hideUrgencyField={true}
        />
        <NavigationContextFields
          register={register}
          errors={errors}
          watch={watch}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={2}
        />
        <OrganizationAnswerFields
          register={register}
          watch={watch}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={2}
        />
        <FurtherInfoFields
          register={register}
          legendClassName="admin-request-detail__fieldset-legend"
          smallPaddingTop={true}
          level={2}
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
            level={2}
          />
        )}
        <Snackbar
          notificationText={t`The mediaiton request was successfully updated.`}
          open={requestSuccessMessageOpen}
          onClose={handleCloseSuccessMessage}
          severity="success"
        />
        <Snackbar
          notificationText={t`We could'nt update the mediation request. Please retry later.`}
          open={requestFailureMessageOpen}
          onClose={handleCloseFailureMessage}
          severity="error"
        />
        <div className="admin-request-detail__submit">
          <Button size="medium" type="submit">
            <Trans>Update the mediation request</Trans>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RequestDetail;

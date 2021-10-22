import { Trans } from "@lingui/macro";
import produce from "immer";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAdminMediationRequest, usePrevious } from "../../hooks";
import {
  AboutIssueFields,
  AssitiveTechnologyFields,
} from "../../mediationForm/fields";
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
};

/**
 * List the details of a specific mediation request, and gives the
 * possibility to update them.
 */
function RequestDetail({ token, setBreadcrumbs }) {
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
  const previousMediationRequest = usePrevious(mediationRequest);
  const { register, errors, setValue } = useForm<FormInputs>({
    defaultValues: mediationRequest
      ? produce(mediationRequest, (draft) => {
          delete draft["id"];
        })
      : {},
  });
  useEffect(
    function setInitialDefaultValues() {
      if (!previousMediationRequest && mediationRequest) {
        for (const key of Object.keys(mediationRequest)) {
          if (key !== "id") setValue(key, mediationRequest[key]);
        }
      }
    },
    [previousMediationRequest, mediationRequest, setValue]
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
          errors={errors}
          isUserFacing={false}
          legendClassName="admin-request-detail__fieldset-legend"
          level={2}
        />
        <AboutIssueFields
          register={register}
          errors={errors}
          legendClassName="admin-request-detail__fieldset-legend"
          level={2}
        />
      </form>
    </div>
  );
}

RequestDetail.propTypes = {
  token: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
};

export default RequestDetail;

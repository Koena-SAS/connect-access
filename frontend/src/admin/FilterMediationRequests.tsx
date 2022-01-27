import { t, Trans } from "@lingui/macro";
import { useMemo } from "react";
import { TextField } from "../forms";
import { useAdminMediationRequests } from "../hooks";
import type { MediationRequest } from "../types/mediationRequest";
import type { ApplicationData } from "../types/organizationApp";

type FilterMediationRequestsProps = {
  setChosenStatus: (value: string) => void;
  setChosenApplication: (value: string) => void;
  /**
   * The authentication token given when user is logged in.
   */
  token: string;
};

/**
 * Filter all the mediation requests.
 */
function FilterMediationRequests({
  setChosenStatus,
  setChosenApplication,
  token,
}: FilterMediationRequestsProps) {
  const { mediationRequests } = useAdminMediationRequests(token);
  const applicationNames = useMemo(
    function createApplicationNames() {
      return mediationRequests
        ? mediationRequests.reduce(
            (accumulator: string[], request: MediationRequest) => {
              if (request.applicationData) {
                const applicationName = buildApplicationName(
                  request.applicationData
                );
                if (!accumulator.includes(applicationName)) {
                  accumulator.push(applicationName);
                }
                return accumulator;
              } else {
                return accumulator;
              }
            },
            []
          )
        : [];
    },
    [mediationRequests]
  );
  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChosenStatus(event.target.value);
  };
  const handleChangeApplication = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChosenApplication(event.target.value);
  };

  return (
    <div
      className="filter-mediation-requests form"
      role="group"
      aria-labelledby="filterMediationRequests"
    >
      <span
        className="filter-mediation-requests__text"
        id="filterMediationRequests"
      >
        <Trans>Filter by:</Trans>
      </span>
      <TextField
        id="mediationStatus"
        name="mediationStatus"
        select
        SelectProps={{
          native: true,
        }}
        label={t`Status:`}
        onChange={handleChangeStatus}
        className="filter-mediation-requests__option"
        fullwidth={false}
      >
        <option label={t`All`} value="" />
        <Trans>
          <option value="PENDING">Incomplete</option>
        </Trans>
        <Trans>
          <option value="WAITING_MEDIATOR_VALIDATION">
            Waiting for mediator validation
          </option>
        </Trans>
        <Trans>
          <option value="FILED">Request filed</option>
        </Trans>
        <Trans>
          <option value="WAITING_ADMIN">
            Waiting for administrative validation
          </option>
        </Trans>
        <Trans>
          <option value="WAITING_CONTACT">Waiting for contact</option>
        </Trans>
        <Trans>
          <option value="WAITING_CONTACT_BIS">
            Waiting for second contact
          </option>
        </Trans>
        <Trans>
          <option value="MEDIATING">Mediating</option>
        </Trans>
        <Trans>
          <option value="CLOTURED">Closed</option>
        </Trans>
        <Trans>
          <option value="MEDIATION_FAILED">Mediation failed</option>
        </Trans>
      </TextField>
      <TextField
        id="mediationApplication"
        name="mediationApplication"
        select
        SelectProps={{
          native: true,
        }}
        label={t`Application:`}
        onChange={handleChangeApplication}
        className="filter-mediation-requests__option last"
        fullwidth={false}
      >
        <option label={t`All`} value="" />
        <Trans>
          <option value="OTHER">Other</option>
        </Trans>
        {applicationNames.map(function buildApplicationJsx(applicationName) {
          return (
            <option
              label={applicationName}
              value={applicationName}
              key={applicationName}
            />
          );
        })}
      </TextField>
    </div>
  );
}

function buildApplicationName(applicationData: ApplicationData): string {
  return `${applicationData.name} (${applicationData.organizationName})`;
}

export default FilterMediationRequests;
export { buildApplicationName };

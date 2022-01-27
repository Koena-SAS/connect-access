import { t, Trans } from "@lingui/macro";
import { TextField } from "../forms";

type FilterMediationRequestsProps = {
  setChosenStatus: (value: string) => void;
};

/**
 * Filter all the mediation requests.
 */
function FilterMediationRequests({
  setChosenStatus,
}: FilterMediationRequestsProps) {
  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChosenStatus(event.target.value);
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
    </div>
  );
}

export default FilterMediationRequests;

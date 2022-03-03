import { t, Trans } from "@lingui/macro";
import MediationRequestStatus from "../forms/fields/MediationRequestStatus";

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
      <div className="filter-mediation-requests__statusContainer">
        <MediationRequestStatus
          onChange={handleChangeStatus}
          name="mediationStatus"
          label={t`Status:`}
          defaultOptionLabel={t`All`}
          className="filter-mediation-requests__option"
          fullWidth={true}
        />
      </div>
    </div>
  );
}

export default FilterMediationRequests;

import { Trans } from "@lingui/macro";
import { useMemo, useState } from "react";
import { PATHS } from "../constants/paths";
import { useAdminMediationRequests } from "../hooks";
import { MediationRequestsList } from "../mediationRequests";
import Breadcrumbs from "./Breadcrumbs";
import FilterMediationRequests from "./FilterMediationRequests";

/**
 * List all the mediation requests with filtering options.
 */
function AllRequests({ token }: { token: string }) {
  const { mediationRequests } = useAdminMediationRequests(token);
  const [chosenStatus, setChosenStatus] = useState("");

  const filteredRequests = useMemo(
    function filterRequests() {
      return mediationRequests
        ? mediationRequests.filter((request) => {
            let statusOk;
            if (chosenStatus === "") {
              statusOk = true;
            } else {
              statusOk = request.status === chosenStatus;
            }
            return Boolean(statusOk);
          })
        : [];
    },
    [mediationRequests, chosenStatus]
  );

  return (
    <div className="admin-mediations admin-page-base">
      <h1 className="admin-page-base__title">
        <Trans>All requests</Trans>
      </h1>
      <Breadcrumbs
        items={[<Trans>Mediation</Trans>, <Trans>All requests</Trans>]}
      />
      <FilterMediationRequests setChosenStatus={setChosenStatus} />
      <div className="admin-page-base__content admin-mediations__content">
        <MediationRequestsList
          mediationRequests={filteredRequests}
          detailsPath={PATHS.ADMIN_REQUEST_DETAIL}
        />
      </div>
    </div>
  );
}

export default AllRequests;

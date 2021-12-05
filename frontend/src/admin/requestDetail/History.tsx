import { Trans } from "@lingui/macro";
import { useEffect } from "react";

type HistoryProps = {
  setBreadcrumbs: (breadcrumbs: JSX.Element[]) => void;
};

/**
 * List the available trace reports related to a specific mediation request.
 */
function History({ setBreadcrumbs }: HistoryProps) {
  useEffect(
    function initBreadcrumbs() {
      setBreadcrumbs([
        <Trans>Mediation</Trans>,
        <Trans>All requests</Trans>,
        <Trans>Details</Trans>,
        <Trans>History</Trans>,
      ]);
    },
    [setBreadcrumbs]
  );
  return (
    <>
      <h1 className="admin-page-base__title">
        <Trans>Request detail: History</Trans>
      </h1>
    </>
  );
}

export default History;

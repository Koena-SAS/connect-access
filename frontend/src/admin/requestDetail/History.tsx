import { Trans } from "@lingui/macro";
import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * List the available trace reports related to a specific mediation request.
 */
function History({ token, setBreadcrumbs }) {
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

History.propTypes = {
  token: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
};

export default History;

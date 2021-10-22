import { Trans } from "@lingui/macro";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Overview of the main admin funcitonnalities.
 */
function QuickAccess({ token }) {
  return (
    <div className="admin-quick-access admin-page-base">
      <h1 className="admin-page-base__title">
        <Trans>Admin content</Trans>
      </h1>
      <Breadcrumbs
        items={[<Trans>Dashboard</Trans>, <Trans>Quick Access</Trans>]}
      />
      <div className="admin-page-base__content admin-quick-access__content"></div>
    </div>
  );
}

export default QuickAccess;

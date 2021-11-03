import { t } from "@lingui/macro";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import Page from "../Page";
import AllRequests from "./AllRequests";
import QuickAccess from "./QuickAccess";
import RequestDetailContainer from "./requestDetail/RequestDetailContainer";

/**
 * Main admin content doing the routing between admin pages.
 */
function Main({ token, paths }) {
  return (
    <main role="main" id="main" className="admin-layout__main admin-main">
      <Switch>
        <Route path={paths.ADMIN} exact>
          <Page title={t`Connect Access - Quick access`}>
            <QuickAccess token={token} />
          </Page>
        </Route>
        <Route path={paths.ADMIN_ALL_REQUESTS} exact>
          <Page title={t`Connect Access - All mediation requests`}>
            <AllRequests token={token} />
          </Page>
        </Route>
        <Route path={paths.ADMIN_REQUEST_DETAIL}>
          <RequestDetailContainer token={token} />
        </Route>
      </Switch>
    </main>
  );
}

Main.propTypes = {
  token: PropTypes.string,
  paths: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Main;

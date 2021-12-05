import { t } from "@lingui/macro";
import { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import type { Paths } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import Page from "../Page";
import { ConfigData } from "../types/types";
import AllRequests from "./AllRequests";
import QuickAccess from "./QuickAccess";
import RequestDetailContainer from "./requestDetail/RequestDetailContainer";

type MainProps = {
  token?: string;
  paths: Paths;
};

/**
 * Main admin content doing the routing between admin pages.
 */
function Main({ token, paths }: MainProps) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  return (
    <main role="main" id="main" className="admin-layout__main admin-main">
      <Switch>
        <Route path={paths.ADMIN} exact>
          <Page title={t`${configData.platformName} - Quick access`}>
            <QuickAccess />
          </Page>
        </Route>
        <Route path={paths.ADMIN_ALL_REQUESTS} exact>
          <Page title={t`${configData.platformName} - All mediation requests`}>
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

export default Main;

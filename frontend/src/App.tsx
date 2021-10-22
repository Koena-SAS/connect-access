import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { AdminLayout } from "./admin";
import CustomerLayout from "./customerLayout/CustomerLayout";
import {
  useStateWithStorage,
  useUserDetails,
  useUserMediationRequests,
} from "./hooks";

/**
 * Main component holding the menu and the router.
 */
function App({
  siteLanguage,
  toggleSiteLanguage,
  activeMediationFormStep,
  setActiveMediationFormStep,
  paths,
  initialOrganizationApp,
}) {
  const [token, setToken] = useStateWithStorage("token");
  const isLogged = Boolean(token);
  // the below hooks trigger the loading of data from server
  const { userDetails } = useUserDetails(token);
  const isUserStaff = userDetails && userDetails.isStaff;
  useUserMediationRequests(token);

  return (
    <>
      <Switch>
        <Route path={paths.ADMIN}>
          {isUserStaff && (
            <AdminLayout
              token={token}
              paths={paths}
              siteLanguage={siteLanguage}
              toggleSiteLanguage={toggleSiteLanguage}
            />
          )}
        </Route>
        <Route>
          <CustomerLayout
            activeMediationFormStep={activeMediationFormStep}
            setActiveMediationFormStep={setActiveMediationFormStep}
            paths={paths}
            initialOrganizationApp={initialOrganizationApp}
            token={token}
            setToken={setToken}
            isLogged={isLogged}
            siteLanguage={siteLanguage}
            toggleSiteLanguage={toggleSiteLanguage}
          />
        </Route>
      </Switch>
    </>
  );
}

App.propTypes = {
  siteLanguage: PropTypes.string.isRequired,
  toggleSiteLanguage: PropTypes.func.isRequired,
  activeMediationFormStep: PropTypes.number.isRequired,
  setActiveMediationFormStep: PropTypes.func.isRequired,
  /**
   * The paths to be used in the main element for routes rendering.
   */
  paths: PropTypes.objectOf(PropTypes.string).isRequired,
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp: PropTypes.object,
};

export default App;

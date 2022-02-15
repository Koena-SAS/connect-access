import { Route, Switch } from "react-router-dom";
import { AdminLayout } from "./admin";
import type { Paths } from "./constants/paths";
import CustomerLayout from "./customerLayout/CustomerLayout";
import {
  useStateWithStorage,
  useUserDetails,
  useUserMediationRequests,
} from "./hooks";
import type { Step } from "./mediationForm/StepsInitializer";
import type {
  AboutServiceRecieved,
  ContactInformationRecieved,
} from "./types/footerConfiguration";
import type { OrganizationAppRecieved } from "./types/organizationApp";
import type { Langs } from "./types/types";

type AppProps = {
  siteLanguage: Langs;
  toggleSiteLanguage: () => void;
  activeMediationFormStep: Step;
  setActiveMediationFormStep: (step: Step) => void;
  /**
   * The paths to be used in the main element for routes rendering.
   */
  paths: Paths;
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationAppRecieved;
  /**
   * Contact information data got from the backend for the first time.
   */
  initialContactInformation?: ContactInformationRecieved;
  /**
   * About service data got from the backend for the first time.
   */
  initialAboutService?: AboutServiceRecieved[];
};

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
  initialContactInformation,
  initialAboutService,
}: AppProps) {
  const [token, setToken] = useStateWithStorage<string | undefined>("token");
  // the below hooks trigger the loading of data from server
  const { userDetails } = useUserDetails(token);
  const isUserStaff = userDetails && userDetails.isStaff;
  useUserMediationRequests(token);

  return (
    <>
      <Switch>
        <Route path={paths.ADMIN}>
          {isUserStaff && token && (
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
            initialContactInformation={initialContactInformation}
            initialAboutService={initialAboutService}
            token={token}
            setToken={setToken}
            siteLanguage={siteLanguage}
            toggleSiteLanguage={toggleSiteLanguage}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;

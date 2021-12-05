import { useParams } from "react-router-dom";
import type { Paths } from "../constants/paths";
import { useOrganizationApp } from "../hooks";
import type { Step } from "../mediationForm/StepsInitializer";
import QuickLinks from "../QuickLinks";
import type { OrganizationAppRecieved } from "../types/organizationApp";
import type { Langs } from "../types/types";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

type CustomerLayoutProps = {
  activeMediationFormStep: Step;
  setActiveMediationFormStep: (activeMediationStep: number) => void;
  /**
   * The paths to be used in the main element for routes rendering.
   */
  paths: Paths;
  /**
   * The organization applicaiton data got from the backend for the first time.
   */
  initialOrganizationApp?: OrganizationAppRecieved;
  token?: string;
  setToken: (token: string) => void;
  isLogged: boolean;
  siteLanguage: Langs;
  toggleSiteLanguage: () => void;
};

function CustomerLayout({
  activeMediationFormStep,
  setActiveMediationFormStep,
  paths,
  initialOrganizationApp,
  token,
  setToken,
  isLogged,
  siteLanguage,
  toggleSiteLanguage,
}: CustomerLayoutProps) {
  const { organizationSlug, applicationSlug } = useParams<{
    organizationSlug: string;
    applicationSlug: string;
  }>();
  const { organizationApp } = useOrganizationApp(initialOrganizationApp);
  const organizationInconsistent =
    Boolean(organizationSlug && !organizationApp) ||
    Boolean(organizationSlug && !applicationSlug);
  return (
    <div className="customer-layout">
      <div className="customer-layout__quick-links">
        <QuickLinks
          siteLanguage={siteLanguage}
          toggleSiteLanguage={toggleSiteLanguage}
        />
      </div>
      <Header isLogged={isLogged} setToken={setToken} token={token} />
      {!organizationInconsistent && (
        <Main
          token={token}
          setToken={setToken}
          isLogged={isLogged}
          activeMediationFormStep={activeMediationFormStep}
          setActiveMediationFormStep={setActiveMediationFormStep}
          paths={paths}
          initialOrganizationApp={initialOrganizationApp}
        />
      )}
      <Footer />
    </div>
  );
}

export default CustomerLayout;

import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useOrganizationApp } from "../hooks";
import QuickLinks from "../QuickLinks";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

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
}) {
  const { organizationSlug, applicationSlug } = useParams();
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

CustomerLayout.propTypes = {
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
  token: PropTypes.string,
  setToken: PropTypes.func,
  isLogged: PropTypes.bool.isRequired,
  siteLanguage: PropTypes.string.isRequired,
  toggleSiteLanguage: PropTypes.func.isRequired,
};

export default CustomerLayout;

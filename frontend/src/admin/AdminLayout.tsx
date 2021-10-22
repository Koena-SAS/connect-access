import PropTypes from "prop-types";
import { useAdminMediationRequests } from "../hooks";
import QuickLinks from "../QuickLinks";
import Main from "./Main";
import Menu from "./Menu";

/**
 * Main component holding administration UI.
 * From the frontend logic, this component is displayed only if the user
 * is logged in as staff member.
 */
function AdminLayout({ token, siteLanguage, toggleSiteLanguage, paths }) {
  useAdminMediationRequests(token);
  return (
    <div className="admin-layout">
      <div className="admin-layout__quick-links">
        <QuickLinks
          siteLanguage={siteLanguage}
          toggleSiteLanguage={toggleSiteLanguage}
          excludeFooter={true}
        />
      </div>
      <Menu />
      <Main token={token} paths={paths} />
    </div>
  );
}

AdminLayout.propTypes = {
  token: PropTypes.string,
  siteLanguage: PropTypes.string.isRequired,
  toggleSiteLanguage: PropTypes.func.isRequired,
  /**
   * The paths to be used in the main element for routes rendering.
   */
  paths: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default AdminLayout;

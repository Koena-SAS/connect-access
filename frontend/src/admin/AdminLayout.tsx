import { Paths } from "../constants/paths";
import { useAdminMediationRequests } from "../hooks";
import QuickLinks from "../QuickLinks";
import Main from "./Main";
import Menu from "./Menu";

type AdminLayoutProps = {
  token: string;
  siteLanguage: string;
  toggleSiteLanguage: any;
  /**
   * The paths to be used in the main element for routes rendering.
   */
  paths: Paths;
};

/**
 * Main component holding administration UI.
 * From the frontend logic, this component is displayed only if the user
 * is logged in as staff member.
 */
function AdminLayout({
  token,
  siteLanguage,
  toggleSiteLanguage,
  paths,
}: AdminLayoutProps) {
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

export default AdminLayout;

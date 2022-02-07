import { t } from "@lingui/macro";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { useGeneratePrefixedPath } from "../hooks";
import logoBackground from "../images/logo_background.png";
import { ConfigData } from "../types/types";

type HeaderProps = {
  openedOrMobileMenu: boolean;
};

/**
 * Contains the main logo.
 */
function Header({ openedOrMobileMenu }: HeaderProps) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  const generatePrefixedPath = useGeneratePrefixedPath();

  return (
    <header role="banner" className="admin-navigation__title-logo">
      <h1>
        <NavLink
          exact={true}
          to={generatePrefixedPath(PATHS.ROOT)}
          className="admin-navigation__title-logo-link"
        >
          {openedOrMobileMenu ? (
            <>
              <img
                src={logoBackground}
                alt=""
                className="admin-navigation__logo-background"
              />
              <img
                src={require(`../images/${configData.logoFilename}`).default}
                alt={t`${configData.platformName} homepage`}
                className="admin-navigation__logo"
              />
            </>
          ) : (
            <img
              src={require(`../images/${configData.logoFilenameSmall}`).default}
              alt={t`${configData.platformName} homepage`}
              className="admin-navigation__logo-small"
            />
          )}
        </NavLink>
      </h1>
    </header>
  );
}

export default Header;

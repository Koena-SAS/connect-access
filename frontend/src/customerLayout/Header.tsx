import { t, Trans } from "@lingui/macro";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { LOGIN_HIDDEN } from "../constants/config";
import { PATHS } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import Button from "../forms/buttons/Button";
import {
  useGeneratePrefixedPath,
  useOuterClick,
  useUserDetails,
} from "../hooks";
import logoBackground from "../images/logo_background.png";
import { ConfigData } from "../types/types";
import { LogoutButton } from "../users/identification";

type HeaderProps = {
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string | undefined) => void;
  /**
   * The authentication token given when user is logged in.
   */
  token?: string;
};

/**
 * Header containing the main navbar.
 */
function Header({ setToken, token }: HeaderProps) {
  const isLogged = token !== undefined;
  const configData = useContext<ConfigData>(ConfigDataContext);
  const location = useLocation();
  const history = useHistory();
  const { userDetails } = useUserDetails(token);
  const generatePrefixedPath = useGeneratePrefixedPath();
  const [burgerMenuVisible, setBurgerMenuVisibile] = useState<boolean | null>(
    null
  );
  const showMenu = () => {
    setBurgerMenuVisibile(true);
  };
  const hideMenu = () => {
    setBurgerMenuVisibile(false);
  };
  const navButtonsMenuRef = useOuterClick(() => {
    if (burgerMenuVisible) {
      hideMenu();
    }
  });
  const handleLoginClick = (event: KeyboardEvent) => {
    history.push({
      pathname: generatePrefixedPath(PATHS.LOGIN),
      state: { from: location.pathname },
    });
  };
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (burgerMenuVisible) {
          hideMenu();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [burgerMenuVisible]);
  return (
    <header role="banner" className="customer-layout__header header">
      <nav role="navigation" id="navigation">
        <div className="header__list" role="list">
          <div className="header__logo-container" role="listitem">
            <NavLink
              exact={true}
              to={generatePrefixedPath(PATHS.ROOT)}
              className="header__logo-link"
            >
              <img
                src={logoBackground}
                alt=""
                className="header__logo-background"
              />
              <img
                src={require(`../images/${configData.logoFilename}`).default}
                alt={t`${configData.platformName} homepage`}
                className="header__logo"
              />
            </NavLink>
          </div>

          <button
            className={`header__menu-icon ${
              burgerMenuVisible ? "menu-opened" : "menu-closed"
            }`}
            aria-label={
              burgerMenuVisible ? t`Close the menu` : t`Open the menu`
            }
            aria-expanded={burgerMenuVisible ? true : false}
            aria-controls="nav-buttons"
            onClick={burgerMenuVisible ? hideMenu : showMenu}
          >
            {burgerMenuVisible ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </button>
          <div
            className={`header__nav-buttons ${
              burgerMenuVisible ? "menu-opened" : "menu-closed"
            }`}
            id="nav-buttons"
            ref={navButtonsMenuRef}
          >
            {!isLogged && !LOGIN_HIDDEN && (
              <div className="header__nav-button" role="listitem">
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleLoginClick}
                >
                  <Trans>Login</Trans>
                </Button>
              </div>
            )}
            {isLogged && userDetails?.isStaff && (
              <div className="header__nav-button" role="listitem">
                <Button
                  size="medium"
                  component={NavLink}
                  to={generatePrefixedPath(PATHS.ADMIN_ALL_REQUESTS)}
                  role={null} // the role should be the native link's one
                >
                  <Trans>Admin</Trans>
                </Button>
              </div>
            )}
            {isLogged && (
              <>
                <div className="header__nav-button" role="listitem">
                  <Button
                    size="medium"
                    component={NavLink}
                    to={generatePrefixedPath(PATHS.USER_REQUESTS)}
                    role={null} // the role should be the native link's one
                  >
                    <Trans>My requests</Trans>
                  </Button>
                </div>
                <div className="header__nav-button" role="listitem">
                  <Button
                    size="medium"
                    component={NavLink}
                    to={generatePrefixedPath(PATHS.USER_DETAILS)}
                    role={null}
                  >
                    <Trans>My account</Trans>
                  </Button>
                </div>
                <div className="header__nav-button" role="listitem">
                  <LogoutButton setToken={setToken} token={token} />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

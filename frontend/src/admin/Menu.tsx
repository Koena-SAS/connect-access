import { t, Trans } from "@lingui/macro";
import CloseIcon from "@material-ui/icons/Close";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DomainIcon from "@material-ui/icons/Domain";
import ForumIcon from "@material-ui/icons/Forum";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../constants/paths";
import {
  useGeneratePrefixedPath,
  useOuterClick,
  useWindowDimensions,
} from "../hooks";
import { ArrowLeft, ArrowRight } from "../images/buildSvg";
import logo from "../images/logo_plein.png";
import logoSmall from "../images/logo_small.png";
import MenuItem from "./MenuItem";

/**
 * Administration menu.
 */
function Menu() {
  const generatePrefixedPath = useGeneratePrefixedPath();
  const [shownDesktopMenu, setshownDesktopMenu] = useState(true);
  const [shownMobileMenu, setShownMobileMenu] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const mobileMenu = windowWidth <= 1100;
  const openedOrMobileMenu = Boolean(shownDesktopMenu || mobileMenu);

  function showMobileMenu() {
    setShownMobileMenu(true);
  }
  function hideMobileMenu() {
    setShownMobileMenu(false);
  }
  const menuRef = useOuterClick(() => {
    if (showMobileMenu) {
      hideMobileMenu();
    }
  });
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (shownMobileMenu) {
          hideMobileMenu();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [shownMobileMenu]);

  function handleToggleDesktopMenu() {
    setshownDesktopMenu(!shownDesktopMenu);
  }
  return (
    <>
      <button
        className={`admin-navigation__menu-icon ${
          shownMobileMenu ? "menu-opened" : "menu-closed"
        }`}
        aria-label={shownMobileMenu ? t`Close the menu` : t`Open the menu`}
        aria-expanded={shownMobileMenu ? true : false}
        aria-controls="nav-menu"
        onClick={shownMobileMenu ? hideMobileMenu : showMobileMenu}
      >
        {shownMobileMenu ? (
          <CloseIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </button>
      {!mobileMenu && (
        <button
          className="admin-navigation__toggle-button button"
          onClick={handleToggleDesktopMenu}
          aria-controls="nav-menu"
          aria-expanded={Boolean(shownDesktopMenu)}
        >
          {shownDesktopMenu ? (
            <>
              <ArrowLeft
                className="admin-navigation__close-icon"
                aria-hidden={true}
              />
              <Trans>
                <span>Close sidebar</span>
              </Trans>
            </>
          ) : (
            <ArrowRight
              className="admin-navigation__open-icon"
              aria-hidden={false}
              aria-label={t`Open sidebar`}
            />
          )}
        </button>
      )}
      <aside
        className={`admin-layout__aside admin-navigation ${
          shownMobileMenu ? "menu-opened" : "menu-closed"
        } ${shownDesktopMenu ? "" : "desktop-closed"}`}
        ref={menuRef}
        id="nav-menu"
      >
        <nav role="navigation">
          <ul className="admin-navigation__list">
            <li className="admin-navigation__home admin-navigation__item">
              <NavLink exact={true} to={generatePrefixedPath(PATHS.ROOT)}>
                <img
                  src={openedOrMobileMenu ? logo : logoSmall}
                  alt={t`Connect Access homepage`}
                  className={`admin-navigation__logo ${
                    openedOrMobileMenu ? "" : "small"
                  }`}
                />
              </NavLink>
            </li>
            <MenuItem
              itemText={t`Dashboard`}
              ItemIcon={DashboardIcon}
              id="dashboard"
              shownDesktopMenu={shownDesktopMenu}
              subItems={[
                {
                  text: t`Quick Access`,
                  link: generatePrefixedPath(PATHS.ADMIN),
                },
                { text: t`Statistics`, link: "#" },
              ]}
            />
            <MenuItem
              itemText={t`Mediation`}
              ItemIcon={ForumIcon}
              id="mediation"
              shownDesktopMenu={shownDesktopMenu}
              subItems={[
                {
                  text: t`All requests`,
                  link: generatePrefixedPath(PATHS.ADMIN_ALL_REQUESTS),
                },
                { text: t`Requests management`, link: "#" },
              ]}
            />
            <MenuItem
              itemText={t`General Settings`}
              ItemIcon={SettingsIcon}
              id="general-settings"
              shownDesktopMenu={shownDesktopMenu}
              subItems={[
                { text: t`User management`, link: "#" },
                { text: t`Form management`, link: "#" },
                { text: t`Custom menu management`, link: "#" },
              ]}
            />
            <MenuItem
              itemText={t`Pro Offer`}
              ItemIcon={DomainIcon}
              id="pro-offer"
              shownDesktopMenu={shownDesktopMenu}
              subItems={[{ text: t`Organazations list`, link: "#" }]}
            />
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Menu;

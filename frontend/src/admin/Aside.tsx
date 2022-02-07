import { t, Trans } from "@lingui/macro";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import { useEffect, useState } from "react";
import { useOuterClick, useWindowDimensions } from "../hooks";
import { ArrowLeft, ArrowRight } from "../images/buildSvg";
import Header from "./Header";
import Menu from "./Menu";

/**
 * Aside containing the menu and the header.
 */
function Aside() {
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
    if (shownMobileMenu) {
      hideMobileMenu();
    }
  });
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
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
        <Header openedOrMobileMenu={openedOrMobileMenu} />
        <Menu shownDesktopMenu={shownDesktopMenu} />
      </aside>
    </>
  );
}

export default Aside;

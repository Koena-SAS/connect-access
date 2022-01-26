import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { useGeneratePrefixedPath, useWindowDimensions } from "../hooks";

type ItemIconProps = {
  [props: keyof any]: any;
};

type MenuItemProps = {
  itemText: string;
  ItemIcon: React.FC<ItemIconProps>;
  id: string;
  shownDesktopMenu: boolean;
  /**
   * Actual menu items.
   */
  subItems: {
    text: string;
    link: string;
  }[];
  /**
   * Function called when the user has the focus on a title button of the
   * accordion widget, and presses the arrow down key.
   */
  onNextTitleButton: () => void;
  /**
   * Function called when the user has the focus on a title button of the
   * accordion widget, and presses the arrow up key.
   */
  onPreviousTitleButton: () => void;
  /**
   * Function called when the user has the focus on a title button of the
   * accordion widget, and presses the arrow Home key.
   */
  onFirstTitleButton: () => void;
  /**
   * Function called when the user has the focus on a title button of the
   * accordion widget, and presses the arrow End key.
   */
  onLastTitleButton: () => void;
  setTitleButtonRef: (element: HTMLButtonElement) => void;
};

/**
 * Administration menu item.
 */
function MenuItem({
  itemText,
  ItemIcon,
  id,
  subItems,
  shownDesktopMenu,
  onNextTitleButton,
  onPreviousTitleButton,
  onFirstTitleButton,
  onLastTitleButton,
  setTitleButtonRef,
}: MenuItemProps) {
  const generatePrefixedPath = useGeneratePrefixedPath();
  const location = useLocation();
  const { width: windowWidth } = useWindowDimensions();
  const mobileMenu = windowWidth <= 1100;
  const [showSubmenu, setShowSubmenu] = useState(true);
  function handleToggleSubmenu() {
    setShowSubmenu(!showSubmenu);
  }
  const isItemActive = subItems.reduce(function isItemActive(
    accumulator,
    current
  ) {
    return accumulator || location.pathname === current.link;
  },
  false);
  function handleTitleButtonKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      onPreviousTitleButton();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onNextTitleButton();
    } else if (event.key === "Home") {
      event.preventDefault();
      onFirstTitleButton();
    } else if (event.key === "End") {
      event.preventDefault();
      onLastTitleButton();
    }
  }
  return (
    <>
      {Boolean(shownDesktopMenu || mobileMenu) ? (
        <li className="admin-navigation__item admin-navigation-item">
          <h2 className="admin-navigation-item__title">
            <button
              className="admin-navigation-item__button button"
              aria-controls={`${id}-submenu`}
              onClick={handleToggleSubmenu}
              aria-expanded={showSubmenu ? true : false}
              ref={setTitleButtonRef}
              onKeyDown={handleTitleButtonKeyDown}
            >
              <ItemIcon
                fontSize="small"
                className="admin-navigation-item__icon-before"
                color="action"
              />
              {itemText}
              {showSubmenu ? (
                <KeyboardArrowDownIcon className="admin-navigation-item__icon-after" />
              ) : (
                <KeyboardArrowRightIcon className="admin-navigation-item__icon-after" />
              )}
            </button>
          </h2>

          <ul
            className={
              showSubmenu
                ? "admin-navigation-item__list"
                : "admin-navigation-item__list hidden"
            }
            id={`${id}-submenu`}
          >
            {subItems.map((item) => {
              const isActiveForAdminRoot = location.pathname === item.link;
              const isActiveForOtherPaths =
                location.pathname.startsWith(item.link) &&
                item.link !== generatePrefixedPath(PATHS.ADMIN);
              const isActive = isActiveForAdminRoot || isActiveForOtherPaths;
              return (
                <li
                  className={`admin-navigation-item__item ${
                    isActive ? "active" : ""
                  }`}
                  key={item.text}
                >
                  <NavLink
                    exact={true}
                    to={item.link}
                    className="admin-navigation-item__link"
                  >
                    {item.text}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </li>
      ) : (
        <li
          className={`admin-navigation__item admin-navigation-item closed ${
            isItemActive ? "active" : ""
          }`}
        >
          <ItemIcon
            fontSize="large"
            color="action"
            aria-hidden={false}
            aria-label={itemText}
          />
        </li>
      )}
    </>
  );
}

export default MenuItem;

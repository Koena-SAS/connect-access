import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { useGeneratePrefixedPath, useWindowDimensions } from "../hooks";

type ItemIconProps = {
  fontSize?: string;
  className?: string;
  color?: string;
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
  return (
    <>
      {Boolean(shownDesktopMenu || mobileMenu) ? (
        <li className="admin-navigation__item admin-navigation-item">
          <button
            className="admin-navigation-item__button button"
            aria-controls={`${id}-submenu`}
            onClick={handleToggleSubmenu}
            aria-expanded={showSubmenu ? true : false}
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

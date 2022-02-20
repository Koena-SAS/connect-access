import { t, Trans } from "@lingui/macro";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DomainIcon from "@material-ui/icons/Domain";
import ForumIcon from "@material-ui/icons/Forum";
import SettingsIcon from "@material-ui/icons/Settings";
import { useRef } from "react";
import { PATHS } from "../constants/paths";
import { useGeneratePrefixedPath } from "../hooks";
import MenuItem from "./MenuItem";

type MenuProps = {
  shownDesktopMenu: boolean;
};

/**
 * Administration menu.
 */
function Menu({ shownDesktopMenu }: MenuProps) {
  const generatePrefixedPath = useGeneratePrefixedPath();
  const titleButtonsRef = useRef<HTMLElement[]>([]);

  function handlePreviousTitleButton() {
    for (let i = 1; i < titleButtonsRef.current.length; i++) {
      if (titleButtonsRef.current[i] === document.activeElement) {
        titleButtonsRef.current[i - 1].focus();
        break;
      }
    }
  }
  function handleNextTitleButton() {
    for (let i = 0; i < titleButtonsRef.current.length - 1; i++) {
      if (titleButtonsRef.current[i] === document.activeElement) {
        titleButtonsRef.current[i + 1].focus();
        break;
      }
    }
  }
  function handleFirstTitleButton() {
    titleButtonsRef.current[0].focus();
  }
  function handleLastTitleButton() {
    titleButtonsRef.current[titleButtonsRef.current.length - 1].focus();
  }
  function setTitleButtonRef(
    index: number
  ): (element: HTMLButtonElement) => void {
    return (element) => {
      titleButtonsRef.current[index] = element;
    };
  }
  function generteKeyDownProps(index: number) {
    return {
      onNextTitleButton: handleNextTitleButton,
      onPreviousTitleButton: handlePreviousTitleButton,
      onFirstTitleButton: handleFirstTitleButton,
      onLastTitleButton: handleLastTitleButton,
      setTitleButtonRef: setTitleButtonRef(index),
    };
  }
  return (
    <nav role="navigation" id="navigation">
      <h1 className="admin-navigation__title">
        <Trans>Main menu</Trans>
      </h1>
      <ul className="admin-navigation__list">
        <MenuItem
          itemText={t`Dashboard`}
          ItemIcon={DashboardIcon}
          id="dashboard"
          shownDesktopMenu={shownDesktopMenu}
          subItems={[
            {
              text: t`Quick Access`,
              link: "#",
            },
            { text: t`Statistics`, link: "#" },
          ]}
          {...generteKeyDownProps(0)}
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
          {...generteKeyDownProps(1)}
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
          {...generteKeyDownProps(2)}
        />
        <MenuItem
          itemText={t`Pro Offer`}
          ItemIcon={DomainIcon}
          id="pro-offer"
          shownDesktopMenu={shownDesktopMenu}
          subItems={[{ text: t`Organazations list`, link: "#" }]}
          {...generteKeyDownProps(3)}
        />
      </ul>
    </nav>
  );
}

export default Menu;

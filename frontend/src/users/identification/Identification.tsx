import { t } from "@lingui/macro";
import { useContext } from "react";
import { PATHS } from "../../constants/paths";
import ConfigDataContext from "../../contexts/configData";
import Tabs from "../../forms/Tabs";
import { ConfigData } from "../../types/types";
import Login from "./Login";
import Signup from "./Signup";

type IdentificationProps = {
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
  onClose: () => void;
  /**
   * Whether the first tabbable element should get the focus.
   */
  shouldFocus?: boolean;
};

/**
 * Login and signup forms, controlled by tabs.
 */
function Identification({
  setToken,
  onClose,
  shouldFocus = false,
}: IdentificationProps) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  const tabsInfos = [
    {
      element: (
        <Login setToken={setToken} handleCloseIdentification={onClose} />
      ),
      pageTitle: t`${configData.platformName} - Login`,
      label: t`Log in`,
      path: PATHS.LOGIN,
    },
    {
      element: (
        <Signup setToken={setToken} handleCloseIdentification={onClose} />
      ),
      pageTitle: t`${configData.platformName} - Signup`,
      label: t`Signup`,
      path: PATHS.REGISTER,
    },
  ];
  return (
    <div className="identification__container">
      <Tabs
        tabsInfos={tabsInfos}
        label={t`Log in or sign up`}
        shouldFocus={shouldFocus}
      />
    </div>
  );
}

export default Identification;

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import { PATHS, PATHS_WITHOUT_PREFIX } from "./constants/paths";
import ConfigDataContext from "./contexts/configData";
import { dynamicActivate } from "./i18nHelper";
import type { Step } from "./mediationForm/StepsInitializer";
import type { OrganizationAppRecieved } from "./types/organizationApp";
import type { Langs } from "./types/types";

declare global {
  interface Window {
    SERVER_DATA: {
      initialLanguage: Langs;
      initialOrganizationApp?: OrganizationAppRecieved;
      configData: {
        platformName: string;
        logoFilename: string;
        logoFilenameSmall: string;
      };
    };
  }
}

/**
 * Main component introducing internationalization to the app, and dealing
 * with path priority between non organization and organization paths.
 */
const AppWrapper = () => {
  const [_, setCookie] = useCookies(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [siteLanguage, setSiteLanguage] = useState(
    window.SERVER_DATA.initialLanguage
  );
  const [activeMediationFormStep, setActiveMediationFormStep] =
    useState<Step>(0);

  const toggleSiteLanguage = () => {
    let newSiteLanguage: Langs;
    if (siteLanguage === "fr") {
      newSiteLanguage = "en";
    } else {
      newSiteLanguage = "fr";
    }
    setSiteLanguage(newSiteLanguage);
    setCookie("django_language", newSiteLanguage, {
      sameSite: "strict",
      path: "/",
    });
  };

  useEffect(() => {
    dynamicActivate(siteLanguage);
    document.documentElement.lang = siteLanguage;
  }, [siteLanguage]);
  const paths = window.SERVER_DATA.initialOrganizationApp
    ? PATHS
    : PATHS_WITHOUT_PREFIX;
  return (
    <ConfigDataContext.Provider value={window.SERVER_DATA.configData}>
      <I18nProvider i18n={i18n}>
        <Router>
          <Route path={Object.values(paths)}>
            <App
              siteLanguage={siteLanguage}
              toggleSiteLanguage={toggleSiteLanguage}
              activeMediationFormStep={activeMediationFormStep}
              setActiveMediationFormStep={setActiveMediationFormStep}
              paths={paths}
              initialOrganizationApp={window.SERVER_DATA.initialOrganizationApp}
            />
          </Route>
        </Router>
      </I18nProvider>
    </ConfigDataContext.Provider>
  );
};

export default AppWrapper;

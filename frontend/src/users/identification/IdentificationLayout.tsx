import { t } from "@lingui/macro";
import type { SnackbarCloseReason } from "@material-ui/core";
import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import ConfigDataContext from "../../contexts/configData";
import Dialog from "../../forms/Dialog";
import Snackbar from "../../forms/Snackbar";
import { useGeneratePrefixedPath } from "../../hooks";
import Page from "../../Page";
import { isLocationState } from "../../types/typeGuards";
import { ConfigData } from "../../types/types";
import PasswordResetRequest from "../password/PasswordResetRequest";
import Identification from "./Identification";

type IdentificationLayoutProps = {
  isLogged: boolean;
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
};

/**
 * Modal window for login, signup and password reset.
 */
function IdentificationLayout({
  setToken,
  isLogged,
}: IdentificationLayoutProps) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  const history = useHistory();
  const location = useLocation();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const [shouldFocus, setShouldFocus] = useState(false);
  const [currentDisplayedBlock, setCurrentDisplayedBlock] =
    useState("identification");
  const [dialogAriaLabel, setdialogAriaLabel] = useState("");
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const [requestFailureMessageOpen, setRequestFailureMessageOpen] =
    useState(false);
  const identificationOpen = Boolean(
    location.pathname === generatePrefixedPath(PATHS.LOGIN) ||
      location.pathname === generatePrefixedPath(PATHS.REGISTER) ||
      location.pathname === generatePrefixedPath(PATHS.RESET_PASSWORD)
  );
  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const displayRequestFailure = () => {
    setRequestFailureMessageOpen(true);
  };
  const handleCloseSuccessMessage = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason | null
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason | null
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  const handleCloseIdentification = useCallback(() => {
    if (location.state && isLocationState(location.state)) {
      history.push(location.state.from);
    } else {
      history.push(generatePrefixedPath(PATHS.ROOT));
    }
  }, [generatePrefixedPath, history, location.state]);
  const handleClosePassword = () => {
    history.push(generatePrefixedPath(PATHS.LOGIN));
  };
  useEffect(() => {
    if (location.pathname === generatePrefixedPath(PATHS.LOGIN)) {
      setCurrentDisplayedBlock("identification");
      setdialogAriaLabel(t`Identification - Login`);
    } else if (location.pathname === generatePrefixedPath(PATHS.REGISTER)) {
      setCurrentDisplayedBlock("identification");
      setdialogAriaLabel(t`Identification - Signup`);
    } else if (
      location.pathname === generatePrefixedPath(PATHS.RESET_PASSWORD)
    ) {
      setCurrentDisplayedBlock("reset-password");
      setdialogAriaLabel(t`Identification - Reset your password`);
    }
  }, [location, generatePrefixedPath]);
  useEffect(() => {
    if (identificationOpen) {
      setShouldFocus(true);
    }
  }, [identificationOpen]);
  useEffect(() => {
    if (shouldFocus) {
      setShouldFocus(false);
    }
  }, [shouldFocus]);
  return (
    <>
      {!isLogged && (
        <>
          <Dialog
            open={identificationOpen}
            onClose={handleCloseIdentification}
            PaperProps={{
              "aria-modal": "true",
              "aria-label": t({ id: dialogAriaLabel }),
              "aria-labelledby": undefined,
            }}
          >
            <div className="identification">
              {currentDisplayedBlock === "reset-password" ? (
                <Page
                  title={t`${configData.platformName} - Reset your password`}
                >
                  <PasswordResetRequest
                    onClose={handleClosePassword}
                    displayRequestSuccess={displayRequestSuccess}
                    displayRequestFailure={displayRequestFailure}
                    shouldFocus={shouldFocus}
                  />
                </Page>
              ) : (
                <Identification
                  setToken={setToken}
                  onClose={handleCloseIdentification}
                  shouldFocus={shouldFocus}
                />
              )}
            </div>
          </Dialog>
          <Snackbar
            notificationText={t`If an account exists with this e-mail, you will receive a password reset link soon.`}
            open={requestSuccessMessageOpen}
            onClose={handleCloseSuccessMessage}
            severity="info"
          />
          <Snackbar
            notificationText={t`An error occured, please try again.`}
            open={requestFailureMessageOpen}
            onClose={handleCloseFailureMessage}
            severity="error"
          />
        </>
      )}
    </>
  );
}

export default IdentificationLayout;

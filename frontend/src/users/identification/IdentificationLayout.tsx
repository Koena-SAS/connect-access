import { t } from "@lingui/macro";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import Snackbar from "../../forms/Snackbar";
import { useGeneratePrefixedPath } from "../../hooks";
import Page from "../../Page";
import PasswordResetRequest from "../password/PasswordResetRequest";
import Identification from "./Identification";

/**
 * Modal window for login, signup and password reset.
 */
function IdentificationLayout({ setToken, isLogged }) {
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
  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  const handleCloseIdentification = () => {
    if (location.state && "from" in location.state) {
      history.push(location.state.from);
    } else {
      history.push(generatePrefixedPath(PATHS.ROOT));
    }
  };
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
              "aria-labelledby": null,
            }}
          >
            <div className="identification">
              {currentDisplayedBlock === "reset-password" ? (
                <Page title={t`Koena Connect - Reset your password`}>
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

IdentificationLayout.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  /**
   * Set login token for user authentication.
   */
  setToken: PropTypes.func.isRequired,
};

export default IdentificationLayout;

import { Trans } from "@lingui/macro";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { matchPath } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import { mutate } from "swr";
import { PATHS, PATHS_MANDATORY_LOGIN } from "../../constants/paths";
import Button from "../../forms/buttons/Button";
import { useGeneratePrefixedPath } from "../../hooks";

/**
 * Button to perform logout request.
 */
function LogoutButton({ setToken, token }) {
  const history = useHistory();
  const location = useLocation();
  const generatePrefixedPath = useGeneratePrefixedPath();
  const matchPathMandatoryLogin = () => {
    for (let i = 0; i < PATHS_MANDATORY_LOGIN.length; i++) {
      const match = matchPath(location.pathname, {
        path: PATHS_MANDATORY_LOGIN[i],
        exact: true,
      });
      if (match) {
        return true;
      }
    }
    return false;
  };
  const handleClick = () => {
    axios
      .post(
        "/auth/token/logout/",
        {},
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      )
      .catch(() => {
        /* we do nothing in case of logout error
           because logging out immediately is important
           for the user.*/
      });
    mutate(["/auth/users/me/", token, true], null, false);
    setToken(null);
    const includesMandatoryLogin = PATHS_MANDATORY_LOGIN.includes(
      location.pathname
    );
    if (includesMandatoryLogin || matchPathMandatoryLogin()) {
      history.push(generatePrefixedPath(PATHS.ROOT));
    }
  };
  return (
    <Button
      variant="outlined"
      size="medium"
      type="button"
      onClick={handleClick}
    >
      <Trans>Logout</Trans>
    </Button>
  );
}

LogoutButton.propTypes = {
  /**
   * Set login token for user authentication.
   */
  setToken: PropTypes.func.isRequired,
  /**
   * The authentication token itself.
   */
  token: PropTypes.string.isRequired,
};

export default LogoutButton;

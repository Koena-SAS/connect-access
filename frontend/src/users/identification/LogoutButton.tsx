import { Trans } from "@lingui/macro";
import axios from "axios";
import { matchPath } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import { mutate } from "swr";
import { PATHS, PATHS_MANDATORY_LOGIN } from "../../constants/paths";
import Button from "../../forms/buttons/Button";
import { useGeneratePrefixedPath } from "../../hooks";

type LogoutButtonProps = {
  /**
   * Set login token for user authentication.
   */
  setToken: (token: string) => void;
  /**
   * The authentication token itself.
   */
  token: string;
};

/**
 * Button to perform logout request.
 */
function LogoutButton({ setToken, token }: LogoutButtonProps) {
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
    mutate(["/auth/users/me/", token], null, false);
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

export default LogoutButton;

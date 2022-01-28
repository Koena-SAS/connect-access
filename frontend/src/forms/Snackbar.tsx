import { t } from "@lingui/macro";
import MuiAlert from "@material-ui/core/Alert";
import MUISnackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";

type SnackbarProps = {
  notificationText: string;
  open: boolean;
  onClose: (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason | null
  ) => void;
  closeText?: string;
  severity: "success" | "error" | "info";
};

/**
 * Snackbar using MUI with custom options
 */
function Snackbar({
  notificationText,
  open,
  onClose,
  severity,
  closeText = t`Close message`,
  ...props
}: SnackbarProps) {
  return (
    <MUISnackbar
      open={open}
      autoHideDuration={20000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      {...props}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={(event) => onClose(event, null)}
        severity={severity}
        closeText={closeText}
        role={severity === "error" ? "alert" : "status"}
        className="snackbar-alert"
      >
        <span role={severity === "error" ? "alert" : "status"}>
          {notificationText}
        </span>
      </MuiAlert>
    </MUISnackbar>
  );
}

export default Snackbar;

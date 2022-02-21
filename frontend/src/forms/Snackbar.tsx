import { t } from "@lingui/macro";
import MuiAlert from "@mui/material/Alert";
import MUISnackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

type SnackbarProps = {
  notificationText: string;
  open: boolean;
  onClose: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
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
        onClose={(event) => onClose(event, "escapeKeyDown")}
        severity={severity}
        closeText={closeText}
        role={severity === "error" ? "alert" : "status"}
        className="snackbar-alert"
      >
        <div role={severity === "error" ? "alert" : "status"}>
          {notificationText}
        </div>
      </MuiAlert>
    </MUISnackbar>
  );
}

export default Snackbar;

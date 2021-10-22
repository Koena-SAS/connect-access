import { t } from "@lingui/macro";
import MuiAlert from "@material-ui/core/Alert";
import MUISnackbar from "@material-ui/core/Snackbar";

type SnackbarProps = {
  notificationText: string;
  open: boolean;
  onClose: any;
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
      autoHideDuration={10000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      {...props}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
        closeText={closeText}
        role={severity === "error" ? "alert" : "status"}
        className="snackbar-alert"
      >
        {notificationText}
      </MuiAlert>
    </MUISnackbar>
  );
}

export default Snackbar;

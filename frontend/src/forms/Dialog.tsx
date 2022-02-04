import MUIDialog from "@material-ui/core/Dialog";
import { useEffect } from "react";

type DialogProps = {
  open: boolean;
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  [props: string]: any;
};

/**
 * Dialog using MUI with custom options.
 * It removes the aria-hidden attrinute on the noscript tag added by MUI.
 */
function Dialog({ children, open, onClose, ...props }: DialogProps) {
  useEffect(
    function removeAriaLabelOnNoscript() {
      if (open) {
        document.querySelector("noscript")?.removeAttribute("aria-hidden");
      }
    },
    [open]
  );
  return (
    <MUIDialog open={open} onClose={onClose} {...props}>
      {children}
    </MUIDialog>
  );
}

export default Dialog;

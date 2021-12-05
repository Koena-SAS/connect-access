import { Trans } from "@lingui/macro";
import Dialog from "@material-ui/core/Dialog";
import { ReactNode, useEffect, useRef } from "react";
import CancelButton from "../forms/buttons/CancelButton";
import DoneButton from "../forms/buttons/DoneButton";

type ConfirmationDialogProps = {
  questionText: ReactNode;
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  /**
   * Function executed when the user validates the action.
   */
  onValidate: () => void;
  /**
   * Controls the open / close aspect of the modal.
   */
  opened: boolean;
};

/**
 * Confirmation dialog for actions like deleting something.
 */
function ConfirmationDialog({
  questionText,
  onClose,
  onValidate,
  opened,
}: ConfirmationDialogProps) {
  const cancelElement = useRef<HTMLButtonElement>(null);
  useEffect(
    function triggerFocusOnFirstElement() {
      if (opened) {
        setTimeout(function () {
          /* Material UI sets the focus on the modal itself, we have to
             wait a bit (~2 rerenders, or a small time like below) before
             we are able to set the focus on the contact date input. */
          if ("focus" in cancelElement.current) {
            cancelElement.current.focus();
          }
        }, 10);
      }
    },
    [opened]
  );
  return (
    <Dialog
      open={opened}
      onClose={onClose}
      PaperProps={{
        "aria-modal": "true",
        "aria-labelledby": "confirmation-dialog-title",
        "aria-describedby": "confirmation-dialog-question",
        role: "alertdialog",
      }}
      maxWidth="xs"
      fullWidth
      className="confirmation-dialog"
    >
      <h1 className="confirmation-dialog__title" id="confirmation-dialog-title">
        <Trans>Confirmation</Trans>
      </h1>
      <span
        className="confirmation-dialog__question"
        id="confirmation-dialog-question"
      >
        {questionText}
      </span>
      <div className="confirmation-dialog__content-container">
        <div className="confirmation-dialog__buttons">
          <DoneButton
            className="confirmation-dialog__submit"
            onClick={onValidate}
          >
            <Trans>Yes</Trans>
          </DoneButton>
          <CancelButton
            className="confirmation-dialog__cancel"
            onClick={onClose}
            ref={cancelElement}
          >
            <Trans>No</Trans>
          </CancelButton>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmationDialog;

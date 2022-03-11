import { t, Trans } from "@lingui/macro";
import { SnackbarCloseReason } from "@mui/material";
import { useMemo, useState } from "react";
import { mutate } from "swr";
import { PATHS } from "../constants/paths";
import { ConfirmationDialog, Snackbar } from "../forms";
import { useAdminMediationRequests, useDeleteMediationRequest } from "../hooks";
import { MediationRequestsList } from "../mediationRequests";
import { MediationRequest } from "../types/mediationRequest";
import { error } from "../types/utilTypes";
import Breadcrumbs from "./Breadcrumbs";
import FilterMediationRequests from "./FilterMediationRequests";

/**
 * List all the mediation requests with filtering options.
 */
function AllRequests({ token }: { token: string }) {
  const { mediationRequests } = useAdminMediationRequests(token);
  const [chosenStatus, setChosenStatus] = useState("");

  const filteredRequests = useMemo(
    function filterRequests() {
      return mediationRequests
        ? mediationRequests.filter((request) => {
            let statusOk;
            if (chosenStatus === "") {
              statusOk = true;
            } else {
              statusOk = request.status === chosenStatus;
            }
            return Boolean(statusOk);
          })
        : [];
    },
    [mediationRequests, chosenStatus]
  );

  const failureMessages = Object.freeze({
    none: "",
    delete: t`The mediation request deletion was not successful. Please retry later.`,
  });
  const [requestFailureMessageType, setRequestFailureMessageType] =
    useState<keyof typeof failureMessages>("none");
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const handleCloseSuccessMessage = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageType("none");
  };
  const [confirmationDialogOptions, setConfirmationDialogOptions] = useState<{
    request: MediationRequest | null;
    open: boolean;
  }>({
    request: null,
    open: false,
  });
  function resetConfirmationDialogOptions() {
    setConfirmationDialogOptions({ request: null, open: false });
  }
  const [deleteMediationRequest] = useDeleteMediationRequest({
    token,
    onSuccess: function handleDeleteSuccess() {
      mutate([`/api/mediation-requests/`, token]);
      resetConfirmationDialogOptions();
      displayRequestSuccess();
    },
    onFailure: function handleDeleteFailure() {
      setRequestFailureMessageType("delete");
    },
  });
  return (
    <div className="admin-mediations admin-page-base">
      <h1 className="admin-page-base__title">
        <Trans>All requests</Trans>
      </h1>
      <Breadcrumbs
        items={[<Trans>Mediation</Trans>, <Trans>All requests</Trans>]}
      />
      <FilterMediationRequests setChosenStatus={setChosenStatus} />
      <div className="admin-page-base__content admin-mediations__content">
        <MediationRequestsList
          mediationRequests={filteredRequests}
          detailsPath={PATHS.ADMIN_REQUEST_DETAIL}
          setDeleteDialogOptions={setConfirmationDialogOptions}
        />
      </div>
      <ConfirmationDialog
        questionText={t`Do you really want to delete the mediation request?`}
        onClose={function closeConfirmation() {
          resetConfirmationDialogOptions();
        }}
        onValidate={function removeTraceReport() {
          if (confirmationDialogOptions.request) {
            deleteMediationRequest({
              mediationRequest: confirmationDialogOptions.request,
              token,
            });
          } else {
            error("Cannot remove a null request.");
          }
        }}
        opened={confirmationDialogOptions.open}
      />
      <Snackbar
        notificationText={t`The mediation request was successfully deleted.`}
        open={requestSuccessMessageOpen}
        onClose={handleCloseSuccessMessage}
        severity="success"
      />
      <Snackbar
        notificationText={failureMessages[requestFailureMessageType]}
        open={requestFailureMessageType !== "none"}
        onClose={handleCloseFailureMessage}
        severity="error"
      />
    </div>
  );
}

export default AllRequests;

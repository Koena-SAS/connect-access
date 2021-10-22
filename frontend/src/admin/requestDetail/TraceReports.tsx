import { t, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mutate } from "swr";
import { contactEntityTypeMap, traceTypeMap } from "../../constants/choicesMap";
import Button from "../../forms/buttons/Button";
import DeleteButton from "../../forms/buttons/DeleteButton";
import EditButton from "../../forms/buttons/EditButton";
import ConfirmationDialog from "../../forms/ConfirmationDialog";
import Snackbar from "../../forms/Snackbar";
import Table from "../../forms/Table";
import { useAdminTraceReports, useDeleteTraceReport } from "../../hooks";
import TraceReportForm from "./TraceReportForm";

/**
 * List the available trace reports related to a specific mediation request.
 */
function TraceReports({ token, setBreadcrumbs }) {
  const { i18n } = useLingui();
  const failureMessages = Object.freeze({
    none: "",
    create: t`The report creation was not successful. Please retry later.`,
    edit: t`The report update was not successful. Please retry later.`,
    delete: t`The report deletion was not successful. Please retry later.`,
  });
  const [requestFailureMessageType, setRequestFailureMessageType] =
    useState("none");
  const handleCloseFailureMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageType("none");
  };
  const { traceReports } = useAdminTraceReports(token);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationDialogOptions, setConfirmationDialogOptions] = useState({
    report: null,
    open: false,
  });
  const [editReport, setEditReport] = useState(null);
  function resetConfirmationDialogOptions() {
    setConfirmationDialogOptions({ report: null, open: false });
  }
  const { requestId: mediationRequestId } = useParams();
  const [deleteTraceReport] = useDeleteTraceReport({
    token,
    onSuccess: function handleDeleteSuccess() {
      mutate([
        `/api/trace-reports/mediation-request/${mediationRequestId}/`,
        token,
      ]);
      resetConfirmationDialogOptions();
    },
    onFailure: function handleDeleteFailure() {
      setRequestFailureMessageType("delete");
    },
  });
  useEffect(
    function initBreadcrumbs() {
      setBreadcrumbs([
        <Trans>Mediation</Trans>,
        <Trans>All requests</Trans>,
        <Trans>Details</Trans>,
        <Trans>Trace reports</Trans>,
      ]);
    },
    [setBreadcrumbs]
  );
  function handleAddtraceReport() {
    setFormOpen(true);
  }
  function handleEditTraceReport(report) {
    setEditReport(report);
    setFormOpen(true);
  }
  function handleCloseReportForm() {
    setFormOpen(false);
    setEditReport(null);
  }
  const headsInfos = [
    { text: t`Date` },
    { text: t`Contact Type` },
    { text: t`Sender` },
    { text: t`Recipient` },
    { text: t`Comment` },
    { text: t`Attached file` },
    { text: t`Actions` },
  ];
  const traceReportsList = traceReports ? traceReports : [];
  const rowsInfos = traceReportsList.map((report) => {
    return {
      key: report.id ? report.id : "undefined",
      infos: [
        {
          text: report.contactDate
            ? new Date(report.contactDate).toLocaleString(i18n.locale, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
              })
            : "",
        },
        {
          text: report.traceType ? (
            <Trans id={traceTypeMap[report.traceType]} />
          ) : (
            ""
          ),
        },
        {
          text: (
            <div className="admin-trace-reports__entity">
              {report.senderName ? <span>{`${report.senderName} `}</span> : ""}
              {report.senderType ? (
                <span className="admin-trace-reports__entity-type">
                  [<Trans id={contactEntityTypeMap[report.senderType]} />]
                </span>
              ) : (
                ""
              )}
            </div>
          ),
        },
        {
          text: (
            <div className="admin-trace-reports__entity">
              {report.recipientName ? (
                <span>{`${report.recipientName} `}</span>
              ) : (
                ""
              )}
              {report.recipientType ? (
                <span className="admin-trace-reports__entity-type">
                  [<Trans id={contactEntityTypeMap[report.recipientType]} />]
                </span>
              ) : (
                ""
              )}
            </div>
          ),
        },
        {
          text: report.comment ? (
            <span className="admin-trace-reports__comment">
              {report.comment}
            </span>
          ) : (
            ""
          ),
        },
        {
          text: report.attachedFile ? (
            <a
              className="admin-trace-reports__link"
              href={`${report.attachedFile}`}
              download
            >
              <Trans>Download the file</Trans>
            </a>
          ) : (
            ""
          ),
        },
        {
          text: (
            <div className="admin-trace-reports__action-buttons">
              <DeleteButton
                className="admin-trace-reports__remove-button"
                onClick={() =>
                  setConfirmationDialogOptions({ report: report, open: true })
                }
                size="small"
                variant="outlined"
              >
                <Trans>Remove</Trans>
              </DeleteButton>
              <EditButton
                className="admin-trace-reports__edit-button"
                onClick={() => handleEditTraceReport(report)}
                size="small"
                variant="outlined"
              >
                <Trans>Edit</Trans>
              </EditButton>
            </div>
          ),
        },
      ],
    };
  });
  return (
    <div className="admin-trace-reports">
      <h1 className="admin-page-base__title">
        <Trans>Request detail: Trace reports</Trans>
      </h1>
      <Button
        className="admin-trace-reports__add-button"
        startIcon={<AddIcon />}
        onClick={handleAddtraceReport}
      >
        <Trans>Add a trace report</Trans>
      </Button>
      <TraceReportForm
        onClose={handleCloseReportForm}
        formOpen={formOpen}
        token={token}
        report={editReport ? editReport : null}
        triggerFailureMessage={setRequestFailureMessageType}
      />
      <div className="admin-trace-reports__table-container">
        <Table
          captionText={t`Trace reports`}
          headsInfos={headsInfos}
          rowsInfos={rowsInfos}
          mobileModeFrom={1800}
        />
      </div>
      <ConfirmationDialog
        questionText={t`Do you really want to delete the trace report?`}
        onClose={function closeConfirmation() {
          resetConfirmationDialogOptions();
        }}
        onValidate={function removeTraceReport() {
          deleteTraceReport({
            traceReport: confirmationDialogOptions.report,
            token,
          });
        }}
        opened={confirmationDialogOptions.open}
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

TraceReports.propTypes = {
  token: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
};

export default TraceReports;

import { t, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import produce from "immer";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { mutate } from "swr";
import { TextField } from "../../forms";
import CancelButton from "../../forms/buttons/CancelButton";
import DoneButton from "../../forms/buttons/DoneButton";
import { useAddTraceReport, useEditTraceReport } from "../../hooks";
import type {
  ContactEntityType,
  TraceReport,
  TraceType,
} from "../../types/traceReport";
import type { Langs } from "../../types/types";

type FormInput = {
  traceType: TraceType;
  senderType: ContactEntityType;
  senderName: string;
  recipientType: ContactEntityType;
  recipientName: string;
  contactDate: Date | string;
  comment: string;
  attachedFile: string;
  removeAttachedFile: boolean;
};

type ActionType = "create" | "edit";

type TraceReportFormProps = {
  token: string;
  onClose: () => void;
  formOpen: boolean;
  report: TraceReport;
  /**
   * In case of failure of the creation or edition in the backend.
   */
  triggerFailureMessage: (type: ActionType) => void;
};

/**
 * Form to add or modify a trace report.
 */
function TraceReportForm({
  token,
  onClose,
  formOpen,
  report,
  triggerFailureMessage,
}: TraceReportFormProps) {
  const { i18n } = useLingui();
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  function getReportActionOptions(type: ActionType) {
    return {
      token,
      onFailure: function handleFailure() {
        triggerFailureMessage(type);
      },
      onSuccess: function handleSuccess() {
        mutate([
          `/api/trace-reports/mediation-request/${mediationRequestId}/`,
          token,
        ]);
        onClose();
      },
    };
  }
  const [addTraceReport] = useAddTraceReport(getReportActionOptions("create"));
  const [editTraceReport] = useEditTraceReport(getReportActionOptions("edit"));
  const {
    register,
    handleSubmit,
    errors,
    control,
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm<FormInput>({
    reValidateMode: "onSubmit",
    defaultValues: report
      ? {
          traceType: report.traceType,
          contactDate: new Date(report.contactDate),
          comment: report.comment,
        }
      : { contactDate: new Date(Date.now()) },
  });
  const isEditMode = report ? true : false;

  function onSubmit(data: FormInput) {
    const dataToSend: TraceReport = {
      ...data,
      contactDate:
        typeof data.contactDate !== "string"
          ? data.contactDate.toJSON()
          : data.contactDate,
    };
    if (isEditMode) {
      doEditTraceReport(dataToSend);
    } else {
      doAddTraceReport(dataToSend);
    }
  }
  function doEditTraceReport(dataToSend: TraceReport) {
    const editDataToSend = produce(dataToSend, (draft) => {
      if (draft.removeAttachedFile) {
        draft.attachedFile = "";
      }
    });
    editTraceReport({
      traceReport: editDataToSend,
      mediationRequestId,
      traceReportId: report.id,
      token,
    });
  }
  function doAddTraceReport(dataToSend: TraceReport) {
    addTraceReport({
      traceReport: dataToSend,
      mediationRequestId,
      token,
    });
  }

  const firstTabbableElement = useRef<HTMLInputElement>(null);
  useEffect(
    function triggerFocusOnFirstElement() {
      if (formOpen) {
        setTimeout(function () {
          /* Material UI sets the focus on the modal itself, we have to
             wait a bit (~2 rerenders, or a small time like below) before
             we are able to set the focus on the contact date input. */
          if (firstTabbableElement.current) {
            firstTabbableElement.current.focus();
          }
        }, 10);
      }
    },
    [formOpen]
  );
  useEffect(
    function resetDefaultValues() {
      if (formOpen) {
        reset(
          isEditMode
            ? {
                traceType: report.traceType,
                senderType: report.senderType,
                senderName: report.senderName,
                recipientType: report.recipientType,
                recipientName: report.recipientName,
                contactDate: new Date(report.contactDate),
                comment: report.comment,
              }
            : { contactDate: new Date(Date.now()) }
        );
      }
    },
    [formOpen, reset, isEditMode, report]
  );
  const contactDateFormatError = t`The contact date must be formated following the pattern mm/dd/yyyy hh:mm (a|p)m`;
  const localeMap: Record<Langs, any> = {
    en: enLocale,
    fr: frLocale,
  };
  const maskMap = {
    fr: "__/__/____ __:__",
    en: "__/__/____ __:__ _M",
  };
  const contactEntityTypeOptions = (
    <>
      <option label={t`Not specified`} value="" />
      <Trans>
        <option value="COMPLAINANT">Complainant</option>
      </Trans>
      <Trans>
        <option value="MEDIATOR">Mediator</option>
      </Trans>
      <Trans>
        <option value="ORGANIZATION">Organization (partner)</option>
      </Trans>
      <Trans>
        <option value="EXTERNAL_ORGANIZATION">External organization</option>
      </Trans>
      <Trans>
        <option value="OTHER">Other</option>
      </Trans>
    </>
  );
  const watchSenderType = watch("senderType");
  const watchRecipientType = watch("recipientType");
  function contactEntityNeedsName(contactEntityValue: string) {
    return Boolean(contactEntityValue !== "COMPLAINANT") ? true : false;
  }
  return (
    <Dialog
      open={formOpen}
      onClose={onClose}
      PaperProps={{
        "aria-modal": "true",
        "aria-label": isEditMode
          ? t`Edit a new trace report`
          : t`Add a new trace report`,
        "aria-labelledby": null,
      }}
      maxWidth="sm"
      fullWidth
      className="confirmation-dialog admin-trace-reports-form"
    >
      <h1 className="confirmation-dialog__title">
        {isEditMode ? (
          <Trans>Edit a trace report</Trans>
        ) : (
          <Trans>Add a trace report</Trans>
        )}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="form confirmation-dialog__content-container admin-trace-reports-form__container"
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          locale={localeMap[i18n.locale as Langs]}
        >
          <Controller
            name="contactDate"
            control={control}
            rules={{
              validate: function checkDateFormatError() {
                if (Boolean(errors.contactDate)) {
                  firstTabbableElement.current.focus();
                  return contactDateFormatError;
                } else {
                  return true;
                }
              },
            }}
            render={({ ref, ...rest }) => (
              <DateTimePicker
                label={t`Contact date`}
                mask={maskMap[i18n.locale as Langs]}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      error={!!errors.contactDate}
                      helperText={
                        errors.contactDate ? errors.contactDate.message : ""
                      }
                      id="trace-report-contact-date"
                      FormHelperTextProps={{ role: "alert" }}
                      aria-label={null}
                      inputProps={{
                        ...params.inputProps,
                        "aria-describedby": "trace-report-contact-date-desc",
                      }}
                    />
                  );
                }}
                onError={(reason) => {
                  // when reason is not null then a new error occured on date
                  // when reason is null, then the previous error has disappeared
                  if (reason) {
                    setError("contactDate", {
                      type: "manual",
                      message: contactDateFormatError,
                    });
                  } else {
                    clearErrors("contactDate");
                  }
                }}
                inputRef={firstTabbableElement}
                {...rest}
              />
            )}
          />
          <p id="trace-report-contact-date-desc" className="form__helper-text">
            <Trans>Example of correct format: 09/01/2021 06:52 PM</Trans>
          </p>
        </LocalizationProvider>
        <div className="admin-trace-reports-form__field">
          <TextField
            name="traceType"
            id="traceType"
            select
            SelectProps={{
              native: true,
            }}
            label={t`Contact type`}
            inputRef={register}
          >
            <option label={t`Not specified`} value="" />
            <Trans>
              <option value="CALL">Call</option>
            </Trans>
            <Trans id="optionsEmail">
              <option value="MAIL">E-mail</option>
            </Trans>
            <Trans>
              <option value="LETTER">Letter</option>
            </Trans>
            <Trans>
              <option value="OTHER">Other</option>
            </Trans>
          </TextField>
        </div>
        <div className="admin-trace-reports-form__field entity">
          <div className="admin-trace-reports-form__entity-type">
            <TextField
              name="senderType"
              id="senderType"
              select
              SelectProps={{
                native: true,
              }}
              label={t`Sender type`}
              inputRef={register}
            >
              {contactEntityTypeOptions}
            </TextField>
          </div>
          {contactEntityNeedsName(watchSenderType) && (
            <div className="admin-trace-reports-form__entity-name">
              <TextField
                id="senderName"
                name="senderName"
                inputRef={register}
                label={t`Sender name(s)`}
                type="text"
                className="admin-trace-reports-form__field"
              />
            </div>
          )}
        </div>
        <div className="admin-trace-reports-form__field entity">
          <div className="admin-trace-reports-form__entity-type">
            <TextField
              name="recipientType"
              id="recipientType"
              select
              SelectProps={{
                native: true,
              }}
              label={t`Recipient type`}
              inputRef={register}
            >
              {contactEntityTypeOptions}
            </TextField>
          </div>
          {contactEntityNeedsName(watchRecipientType) && (
            <div className="admin-trace-reports-form__entity-name">
              <TextField
                id="recipientName"
                name="recipientName"
                inputRef={register}
                label={t`Recipient name(s)`}
                type="text"
                className="admin-trace-reports-form__field"
              />
            </div>
          )}
        </div>
        <div className="admin-trace-reports-form__field">
          <TextField
            id="comment"
            name="comment"
            inputRef={register}
            label={t`Comment`}
            type="text"
            multiline={true}
            minRows={4}
            className="admin-trace-reports-form__field"
          />
        </div>
        <div className="admin-trace-reports-form__field admin-trace-reports-form__attached-file">
          <label htmlFor="attachedFile" className="label">
            <Trans>Attached file</Trans>
          </label>
          <input
            type="file"
            name="attachedFile"
            id="attachedFile"
            ref={register}
            className="admin-trace-reports-form__attached-file-input"
          />
        </div>
        {isEditMode && report.attachedFile && (
          <div className="admin-trace-reports-form__remove-file">
            <Checkbox
              id="removeAttachedFile"
              name="removeAttachedFile"
              inputRef={register}
            />
            <label htmlFor="removeAttachedFile" className="label">
              <Trans>Remove the attached file</Trans>
            </label>
          </div>
        )}
        <div className="confirmation-dialog__buttons">
          <DoneButton className="confirmation-dialog__submit admin-trace-reports-form__submit">
            {isEditMode ? (
              <Trans>Edit the report</Trans>
            ) : (
              <Trans>Add the report</Trans>
            )}
          </DoneButton>
          <CancelButton
            className="confirmation-dialog__cancel admin-trace-reports-form__cancel"
            onClick={onClose}
          >
            <Trans>Cancel</Trans>
          </CancelButton>
        </div>
      </form>
    </Dialog>
  );
}

export default TraceReportForm;

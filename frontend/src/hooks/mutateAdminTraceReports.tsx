import type { AxiosResponse } from "axios";
import axios from "axios";
import produce from "immer";
import { useParams } from "react-router-dom";
import { cache, mutate } from "swr";
import useMutation from "use-mutation";
import type { TraceReport, TraceReportToSend } from "../types/traceReport";
import { keysToCamel } from "../utils";

type AddTraceReportProps = {
  traceReport: TraceReport;
  mediationRequestId: string;
  token: string;
};

async function addTraceReport({
  traceReport,
  mediationRequestId,
  token,
}: AddTraceReportProps): Promise<AxiosResponse<TraceReportToSend>> {
  const dataToSend = new FormData();
  dataToSend.append("mediation_request", mediationRequestId);
  dataToSend.append("contact_date", traceReport.contactDate);
  if (traceReport.traceType !== undefined) {
    dataToSend.append("trace_type", traceReport.traceType);
  }
  if (traceReport.senderType !== undefined) {
    dataToSend.append("sender_type", traceReport.senderType);
  }
  dataToSend.append(
    "sender_name",
    traceReport.senderName ? traceReport.senderName : ""
  );
  if (traceReport.recipientType !== undefined) {
    dataToSend.append("recipient_type", traceReport.recipientType);
  }
  dataToSend.append(
    "recipient_name",
    traceReport.recipientName ? traceReport.recipientName : ""
  );
  if (traceReport.comment !== undefined) {
    dataToSend.append("comment", traceReport.comment);
  }
  if (traceReport.attachedFile && traceReport.attachedFile.length) {
    dataToSend.append("attached_file", traceReport.attachedFile[0]);
  }
  try {
    const response = await axios.post<TraceReportToSend>(
      `/api/trace-reports/`,
      dataToSend,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : [];
  }
}

type UseAddTraceReportProps = {
  token: string;
  onSuccess: () => void;
  onFailure: () => void;
};

/**
 * Add a trace report.
 * Hook using use-mutation lib, to make post request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param obj authentication token and two functions
 *   to be called when the backend reply arrives.
 *   One in case of success and one in case of failure.
 * @returns array containing a function to add a trace report,
 *   and an object with additional information like errors.
 */
export function useAddTraceReport({
  token,
  onSuccess,
  onFailure,
}: UseAddTraceReportProps) {
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  const key = [
    `/api/trace-reports/mediation-request/${mediationRequestId}/`,
    token,
  ];
  return useMutation(addTraceReport, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      const dataToSet = produce(input.traceReport, (draft) => {
        if (draft.attachedFile && !draft.attachedFile.length) {
          // avoid a visual bug when updating optimistically
          // while there is no attached file
          draft.attachedFile = "";
        }
      });
      mutate(key, (current: TraceReport[]) => [dataToSet, ...current], false);
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: TraceReport[]) =>
        current.map((traceReport) => {
          if (traceReport.id) return traceReport;
          return keysToCamel(data.data);
        })
      );
      onSuccess && onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      onFailure && onFailure();
    },
  });
}

type EditTraceReportProps = {
  traceReport: TraceReport;
  mediationRequestId: string;
  traceReportId: string;
  token: string;
};

async function editTraceReport({
  traceReport,
  mediationRequestId,
  traceReportId,
  token,
}: EditTraceReportProps): Promise<AxiosResponse<TraceReportToSend>> {
  const dataToSend = new FormData();
  dataToSend.append("mediation_request", mediationRequestId);
  dataToSend.append("contact_date", traceReport.contactDate);
  if (traceReport.traceType !== undefined) {
    dataToSend.append("trace_type", traceReport.traceType);
  }
  if (traceReport.senderType !== undefined) {
    dataToSend.append("sender_type", traceReport.senderType);
  }
  dataToSend.append(
    "sender_name",
    traceReport.senderName ? traceReport.senderName : ""
  );
  if (traceReport.recipientType !== undefined) {
    dataToSend.append("recipient_type", traceReport.recipientType);
  }
  dataToSend.append(
    "recipient_name",
    traceReport.recipientName ? traceReport.recipientName : ""
  );
  if (traceReport.comment !== undefined) {
    dataToSend.append("comment", traceReport.comment);
  }
  if (traceReport.removeAttachedFile) {
    dataToSend.append("attached_file", new File([], ""));
  } else if (traceReport.attachedFile && traceReport.attachedFile.length) {
    dataToSend.append("attached_file", traceReport.attachedFile[0]);
  }
  try {
    const response = await axios.patch<TraceReportToSend>(
      `/api/trace-reports/${traceReportId}/`,
      dataToSend,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : [];
  }
}

type UseEditTraceReportProps = {
  token: string;
  onSuccess: () => void;
  onFailure: () => void;
};

/**
 * Edit a trace report.
 * Hook using use-mutation lib, to make patch request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param {object} obj authentication token and two functions
 *   to be called when the backend reply arrives.
 *   One in case of success and one in case of failure.
 * @returns array containing a function to edit a trace report,
 *   and an object with additional information like errors.
 */
export function useEditTraceReport({
  token,
  onSuccess,
  onFailure,
}: UseEditTraceReportProps) {
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  const key = [
    `/api/trace-reports/mediation-request/${mediationRequestId}/`,
    token,
  ];
  return useMutation(editTraceReport, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: TraceReport[]) =>
          current.map((traceReport) => {
            const isTheNewReport = traceReport.id === input.traceReportId;
            if (isTheNewReport) {
              return produce(input.traceReport, (draft) => {
                const askForFileRemoval = draft.removeAttachedFile;
                const noFileProvidedByUser =
                  draft.attachedFile && !draft.attachedFile.length;
                const fileAlreadyExists = traceReport.attachedFile;
                if (askForFileRemoval) {
                  draft.attachedFile = "";
                } else if (noFileProvidedByUser && fileAlreadyExists) {
                  draft.attachedFile = traceReport.attachedFile;
                } else if (noFileProvidedByUser && !fileAlreadyExists) {
                  // avoid a visual bug when updating optimistically
                  // while there is no attached file
                  draft.attachedFile = "";
                } else {
                  draft.attachedFile = "#";
                }
              });
            } else {
              return traceReport;
            }
          }),
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: TraceReport[]) =>
        current.map((traceReport) => {
          if (traceReport.id) return traceReport;
          return keysToCamel(data.data);
        })
      );
      onSuccess && onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      onFailure && onFailure();
    },
  });
}

type DeleteReportProps = {
  traceReport: TraceReport;
  token: string;
};

async function deleteTraceReport({
  traceReport,
  token,
}: DeleteReportProps): Promise<AxiosResponse<TraceReportToSend>> {
  try {
    const response = await axios.delete<TraceReportToSend>(
      `/api/trace-reports/${traceReport.id}/`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : [];
  }
}

type UseDeleteTraceReportProps = {
  token: string;
  onSuccess: () => void;
  onFailure: () => void;
};

/**
 * Delete a trace report.
 * Hook using use-mutation lib, to make delete request and update
 * optimistically the UI, with the possibility to rollback in
 * case of error.
 * @param {object} obj authentication token and two functions
 *   to be called when the backend reply arrives.
 *   One in case of success and one in case of failure.
 * @returns array containing a function to delete a trace report,
 *   and an object with additional information like errors.
 */
export function useDeleteTraceReport({
  token,
  onSuccess,
  onFailure,
}: UseDeleteTraceReportProps) {
  const { requestId: mediationRequestId } = useParams<{
    requestId: string;
  }>();
  const key = [
    `/api/trace-reports/mediation-request/${mediationRequestId}/`,
    token,
  ];
  return useMutation(deleteTraceReport, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: TraceReport[]) => {
          const traceReportsUpdated = produce(current, (draftState) => {
            const index = draftState.findIndex((traceReport) => {
              return traceReport.id === input.traceReport.id;
            });
            draftState.splice(index, 1);
          });
          return traceReportsUpdated;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      onSuccess && onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      onFailure && onFailure();
    },
  });
}

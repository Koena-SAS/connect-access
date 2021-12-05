type ContactEntityType =
  | "COMPLAINANT"
  | "MEDIATOR"
  | "ORGANIZATION"
  | "EXTERNAL_ORGANIZATION"
  | "OTHER";

type TraceType = "CALL" | "MAIL" | "LETTER" | "OTHER";

type TraceReport = {
  id?: string;
  contactDate: string;
  traceType?: TraceType;
  senderType?: ContactEntityType;
  senderName?: string;
  recipientType?: ContactEntityType;
  recipientName?: string;
  comment?: string;
  attachedFile?: string;
  removeAttachedFile?: boolean;
};

type TraceReportRecieved = {
  id: string;
  contact_date: string;
  trace_type?: TraceType;
  sender_type?: ContactEntityType;
  sender_name?: string;
  recipient_type?: ContactEntityType;
  recipient_name?: string;
  comment?: string;
  attached_file?: string;
};

type TraceReportToSend = {
  contact_date: string;
  trace_type?: TraceType;
  sender_type?: ContactEntityType;
  sender_name?: string;
  recipient_type?: ContactEntityType;
  recipient_name?: string;
  comment?: string;
  attached_file?: string;
};

export type {
  TraceReport,
  ContactEntityType,
  TraceType,
  TraceReportRecieved,
  TraceReportToSend,
};

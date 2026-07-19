export type BankVerificationStatus = "pending" | "verified" | "failed";

export type LinkedBankEvent = {
  id: string;
  eventId: string | null;
  eventName: string;
};

export type BankAccount = {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  maskedAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string | null;
  accountType: "savings" | "current" | null;
  isDefault: boolean;
  verificationStatus: BankVerificationStatus;
  linkedEvents: LinkedBankEvent[];
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketPriority = "low" | "medium" | "high";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_organizer"
  | "resolved"
  | "closed";

export type SupportTicketAttachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  type: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  eventName: string | null;
  status: SupportTicketStatus;
  attachments: SupportTicketAttachment[];
  createdAt: string;
  updatedAt: string;
};

export const SUPPORT_TICKET_TYPES = [
  { label: "General", value: "general" },
  { label: "Payment / Payouts", value: "payment" },
  { label: "Event Related", value: "event" },
  { label: "Account", value: "account" },
  { label: "Technical", value: "technical" },
  { label: "Other", value: "other" },
] as const;

export const SUPPORT_PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

export const SUPPORT_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_for_organizer: "Waiting for Organizer",
  resolved: "Resolved",
  closed: "Closed",
};

import { BankAccountType, GstStatus, OrganizationType } from "../types/organizer";

export const ORGANIZER_PROFILE_STORAGE_KEY = "@bookmyrun/organizer_profile";

export const ORGANIZATION_TYPE_OPTIONS: {
  label: string;
  value: OrganizationType;
}[] = [
  { label: "Individual", value: "individual" },
  { label: "Organization", value: "organization" },
];

export const GST_STATUS_OPTIONS: { label: string; value: GstStatus }[] = [
  { label: "Registered", value: "registered" },
  { label: "Unregistered", value: "unregistered" },
];

export const BANK_ACCOUNT_TYPE_OPTIONS: {
  label: string;
  value: BankAccountType;
}[] = [
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
];

export const SOCIAL_MEDIA_FIELDS = [
  {
    key: "instagram" as const,
    label: "Instagram",
    placeholder: "https://instagram.com/...",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    placeholder: "https://facebook.com/...",
  },
  {
    key: "twitter" as const,
    label: "X (Twitter)",
    placeholder: "https://x.com/...",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/...",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    placeholder: "https://youtube.com/...",
  },
];

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const WEBSITE_REGEX =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

import {
  EMAIL_REGEX,
  GST_REGEX,
  PAN_REGEX,
  PHONE_REGEX,
  WEBSITE_REGEX,
} from "../constants/organizer";
import {
  OrganizerProfile,
  OrganizerProfileErrors,
} from "../types/organizer";

export function validateOrganizerProfile(
  profile: OrganizerProfile
): OrganizerProfileErrors {
  const errors: OrganizerProfileErrors = {};

  if (!profile.organizerName.trim()) {
    errors.organizerName = "Organizer name is required";
  }

  if (!profile.organizationType) {
    errors.organizationType = "Organization type is required";
  }

  if (!profile.panNumber.trim()) {
    errors.panNumber = "PAN number is required";
  } else if (!PAN_REGEX.test(profile.panNumber.trim().toUpperCase())) {
    errors.panNumber = "Enter a valid PAN (e.g. AAFCF1120L)";
  }

  if (!profile.permanentAddress.trim()) {
    errors.permanentAddress = "Permanent address is required";
  }

  if (
    !profile.billingAddressSameAsPermanent &&
    !profile.billingAddress.trim()
  ) {
    errors.billingAddress = "Billing address is required";
  }

  if (!profile.primaryUserName.trim()) {
    errors.primaryUserName = "Primary user name is required";
  }

  // primaryEmail / primaryPhone are owned by User (auth) and validated via session

  if (
    profile.backupPhone.trim() &&
    !PHONE_REGEX.test(profile.backupPhone.trim())
  ) {
    errors.backupPhone = "Enter a valid 10-digit mobile number";
  }

  if (
    profile.supportEmail.trim() &&
    !EMAIL_REGEX.test(profile.supportEmail.trim())
  ) {
    errors.supportEmail = "Enter a valid support email";
  }

  if (
    profile.websiteUrl.trim() &&
    !WEBSITE_REGEX.test(profile.websiteUrl.trim())
  ) {
    errors.websiteUrl = "Enter a valid website URL";
  }

  if (!profile.gstStatus) {
    errors.gstStatus = "GST status is required";
  }

  if (profile.gstStatus === "registered") {
    if (!profile.gstNumber.trim()) {
      errors.gstNumber = "GST number is required for registered status";
    } else if (!GST_REGEX.test(profile.gstNumber.trim().toUpperCase())) {
      errors.gstNumber = "Enter a valid GST number";
    }
  }

  return errors;
}

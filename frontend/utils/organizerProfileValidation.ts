import {
  AADHAAR_REGEX,
  EMAIL_REGEX,
  isValidPan,
  PHONE_REGEX,
  validateGstAgainstPan,
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
  } else if (!isValidPan(profile.panNumber)) {
    errors.panNumber = "Enter a valid PAN (e.g. AAFCF1120L)";
  }

  if (profile.organizationType === "individual") {
    const aadhaar = profile.aadhaarNumber.replace(/\D/g, "");
    if (!aadhaar) {
      errors.aadhaarNumber = "Aadhaar Card Number is required";
    } else if (!AADHAAR_REGEX.test(aadhaar)) {
      errors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number";
    }
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

  if (
    profile.backupPhone.trim() &&
    !PHONE_REGEX.test(profile.backupPhone.trim())
  ) {
    errors.backupPhone = "Enter a valid 10-digit mobile number";
  }

  if (!profile.supportEmail.trim()) {
    errors.supportEmail = "Support Email ID is required";
  } else if (!EMAIL_REGEX.test(profile.supportEmail.trim())) {
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
    const gstCheck = validateGstAgainstPan(
      profile.gstNumber,
      profile.panNumber
    );
    if (!gstCheck.valid) {
      errors.gstNumber = gstCheck.message || "Invalid GST Number";
    }
  }

  return errors;
}

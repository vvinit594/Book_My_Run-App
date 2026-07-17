const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const AADHAAR_REGEX = /^\d{12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export function isValidPan(pan: string): boolean {
  return PAN_REGEX.test(pan.trim().toUpperCase());
}

export function isValidGstFormat(gst: string): boolean {
  return GST_REGEX.test(gst.trim().toUpperCase());
}

export function extractPanFromGst(gst: string): string {
  const normalized = gst.trim().toUpperCase();
  if (normalized.length < 12) return "";
  return normalized.slice(2, 12);
}

export function validateGstAgainstPan(
  gstNumber: string,
  panNumber: string
): { valid: boolean; message?: string } {
  const gst = gstNumber.trim().toUpperCase();
  const pan = panNumber.trim().toUpperCase();

  if (!pan) {
    return {
      valid: false,
      message: "Please enter your PAN Card Number first.",
    };
  }

  if (!isValidPan(pan)) {
    return {
      valid: false,
      message: "Enter a valid PAN Card Number before entering GST.",
    };
  }

  if (!gst) {
    return { valid: false, message: "GST Number is required." };
  }

  if (!isValidGstFormat(gst)) {
    return {
      valid: false,
      message: "Enter a valid 15-character GST Number.",
    };
  }

  const embeddedPan = extractPanFromGst(gst);
  if (embeddedPan !== pan) {
    return {
      valid: false,
      message:
        "Invalid GST Number. The PAN embedded in the GST Number does not match the PAN Card Number entered above.",
    };
  }

  return { valid: true };
}

export function isValidAadhaar(aadhaar: string): boolean {
  return AADHAAR_REGEX.test(aadhaar.trim());
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/\D/g, "").slice(-10));
}

export { PAN_REGEX, GST_REGEX, AADHAAR_REGEX, EMAIL_REGEX, PHONE_REGEX };

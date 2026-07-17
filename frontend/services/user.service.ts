import { AuthUser } from "../types/auth";
import { ApiError, apiRequest } from "./apiClient";
import { persistSession } from "./auth.service";

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function wrap<T>(
  fn: () => Promise<T>,
  fallback: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: mapError(error, fallback) };
  }
}

export async function requestEmailUpdate() {
  return wrap(
    () =>
      apiRequest<{ destination: string; expiresInMinutes: number }>(
        "/user/email/request-update",
        { method: "POST" },
        true
      ),
    "Failed to send OTP"
  );
}

export async function verifyCurrentEmail(otp: string) {
  return wrap(
    () =>
      apiRequest<{ verified: boolean }>(
        "/user/email/verify-current",
        { method: "POST", body: JSON.stringify({ otp }) },
        true
      ),
    "OTP verification failed"
  );
}

export async function sendNewEmailOtp(newEmail: string) {
  return wrap(
    () =>
      apiRequest<{ destination: string; expiresInMinutes: number }>(
        "/user/email/send-new-otp",
        { method: "POST", body: JSON.stringify({ newEmail }) },
        true
      ),
    "Failed to send OTP to new email"
  );
}

export async function verifyNewEmail(newEmail: string, otp: string) {
  const result = await wrap(
    () =>
      apiRequest<{ user: AuthUser }>(
        "/user/email/verify-new",
        { method: "POST", body: JSON.stringify({ newEmail, otp }) },
        true
      ),
    "Failed to update email"
  );

  if (result.success && result.data?.user) {
    await persistSession(result.data.user);
  }
  return result;
}

export async function requestPhoneUpdate() {
  return wrap(
    () =>
      apiRequest<{ destination: string; expiresInMinutes: number }>(
        "/user/phone/request-update",
        { method: "POST" },
        true
      ),
    "Failed to send OTP"
  );
}

export async function verifyCurrentPhone(otp: string) {
  return wrap(
    () =>
      apiRequest<{ verified: boolean }>(
        "/user/phone/verify-current",
        { method: "POST", body: JSON.stringify({ otp }) },
        true
      ),
    "OTP verification failed"
  );
}

export async function sendNewPhoneOtp(newPhone: string) {
  return wrap(
    () =>
      apiRequest<{ destination: string; expiresInMinutes: number }>(
        "/user/phone/send-new-otp",
        { method: "POST", body: JSON.stringify({ newPhone }) },
        true
      ),
    "Failed to send OTP to new phone"
  );
}

export async function verifyNewPhone(newPhone: string, otp: string) {
  const result = await wrap(
    () =>
      apiRequest<{ user: AuthUser }>(
        "/user/phone/verify-new",
        { method: "POST", body: JSON.stringify({ newPhone, otp }) },
        true
      ),
    "Failed to update phone"
  );

  if (result.success && result.data?.user) {
    await persistSession(result.data.user);
  }
  return result;
}

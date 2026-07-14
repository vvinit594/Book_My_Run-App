import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AUTH_STORAGE_KEY,
  EMAIL_REGEX,
  MIN_PASSWORD_LENGTH,
  PHONE_REGEX,
} from "../constants/auth";
import {
  AuthUser,
  CreatePasswordPayload,
  LoginCredentials,
  OTPVerificationPayload,
  PendingSignup,
  SignupCredentials,
} from "../types/auth";
import { ApiError, apiRequest, getAccessToken, setAccessToken } from "./apiClient";

type AuthSessionResponse = {
  token: string;
  user: AuthUser;
};

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export async function getStoredSession(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function persistSession(user: AuthUser, token?: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  if (token) {
    await setAccessToken(token);
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  await setAccessToken(null);
}

export async function login(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  const identifier = credentials.identifier.trim();
  const password = credentials.password.trim();

  if (!identifier || !password) {
    return { success: false, error: "Email/mobile and password are required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  const isEmail = EMAIL_REGEX.test(identifier);
  const isPhone = PHONE_REGEX.test(identifier.replace(/\D/g, "").slice(-10));

  if (!isEmail && !isPhone) {
    return { success: false, error: "Enter a valid email or mobile number" };
  }

  try {
    const data = await apiRequest<AuthSessionResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    await persistSession(data.user, data.token);
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, error: mapError(error, "Login failed") };
  }
}

export async function sendOTP(
  credentials: SignupCredentials
): Promise<{ success: boolean; pending?: PendingSignup; error?: string }> {
  const mobile = credentials.mobile.trim();
  const email = credentials.email.trim().toLowerCase();

  if (!mobile || !email) {
    return { success: false, error: "Mobile number and email are required" };
  }

  if (!PHONE_REGEX.test(mobile)) {
    return { success: false, error: "Enter a valid 10-digit mobile number" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Enter a valid email address" };
  }

  try {
    await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ mobile, email }),
    });
    return { success: true, pending: { mobile, email } };
  } catch (error) {
    return { success: false, error: mapError(error, "Failed to send OTP") };
  }
}

export async function verifyOTP(
  payload: OTPVerificationPayload & PendingSignup
): Promise<{ success: boolean; error?: string }> {
  const mobileOtp = payload.mobileOtp.trim();
  const emailOtp = payload.emailOtp.trim();

  if (mobileOtp.length !== 6 || emailOtp.length !== 6) {
    return { success: false, error: "Please enter 6-digit OTP for both fields" };
  }

  try {
    await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        mobile: payload.mobile,
        email: payload.email,
        mobileOtp,
        emailOtp,
      }),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: mapError(error, "OTP verification failed") };
  }
}

export async function createPassword(
  pending: PendingSignup,
  payload: CreatePasswordPayload
): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  const password = payload.password.trim();
  const confirmPassword = payload.confirmPassword.trim();

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  try {
    const data = await apiRequest<AuthSessionResponse>("/auth/create-password", {
      method: "POST",
      body: JSON.stringify({
        mobile: pending.mobile,
        email: pending.email,
        password,
        confirmPassword,
      }),
    });
    await persistSession(data.user, data.token);
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, error: mapError(error, "Failed to create account") };
  }
}

export async function logout(): Promise<void> {
  try {
    const token = await getAccessToken();
    if (token) {
      await apiRequest("/auth/logout", { method: "POST" }, true);
    }
  } catch {
    // Ignore network errors on logout — still clear local session
  } finally {
    await clearSession();
  }
}

export async function getProfile(): Promise<AuthUser | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return getStoredSession();
    }
    const user = await apiRequest<AuthUser>("/auth/me", { method: "GET" }, true);
    await persistSession(user);
    return user;
  } catch {
    return getStoredSession();
  }
}
